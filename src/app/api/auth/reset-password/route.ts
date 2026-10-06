import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import crypto from "crypto";

import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const { token, password } = await req.json();

    if (!token || !password) {
      return NextResponse.json(
        { message: "Token and password are required." },
        { status: 400 }
      );
    }

    if (typeof password !== "string" || password.length < 6) {
      return NextResponse.json(
        { message: "Password must be at least 6 characters." },
        { status: 400 }
      );
    }

    // Hash token from URL so we can compare it
    // with the hashed token stored in MongoDB.
    const hashedToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    // Find user with matching token that has not expired
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: {
        $gt: new Date(),
      },
    });

    if (!user) {
      return NextResponse.json(
        {
          message:
            "This password reset link is invalid or has expired. Please request a new one.",
        },
        { status: 400 }
      );
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Save new password
    user.password = hashedPassword;

    // Reset link can only be used once
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    return NextResponse.json(
      {
        success: true,
        message: "Your password has been reset successfully.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Reset password error:", error);

    return NextResponse.json(
      {
        message: "Something went wrong. Please try again.",
      },
      { status: 500 }
    );
  }
}