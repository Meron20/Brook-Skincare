import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import crypto from "crypto";

import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const { email } = await req.json();

    // Validate email
    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { message: "Email is required" },
        { status: 400 }
      );
    }

    // Normalize email
    const normalizedEmail = email.toLowerCase().trim();

    // Find user
    const user = await User.findOne({
      email: normalizedEmail,
    });

    // Always return the same message if user doesn't exist.
    // This prevents exposing which emails have accounts.
    if (!user) {
      return NextResponse.json(
        {
          message:
            "If an account exists with this email, we've sent a password reset link.",
        },
        { status: 200 }
      );
    }

    // Generate secure random token
    const resetToken = crypto.randomBytes(32).toString("hex");

    // Store only the HASHED token in MongoDB
    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    // Token expires after 30 minutes
    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = new Date(
      Date.now() + 30 * 60 * 1000
    );

    await user.save();

    // Base URL
    const baseUrl =
      process.env.NEXTAUTH_URL|| "http://localhost:3000";

    // The user receives the original token.
    // MongoDB only contains the hash.
    const resetUrl = `${baseUrl}/reset-password?token=${resetToken}`;

    // Send reset email
    const { error } = await resend.emails.send({
      from: "Brook Skincare <onboarding@resend.dev>",
      to: user.email,
      subject: "Reset your Brook Skincare password",

      html: `
        <div
          style="
            font-family: Arial, sans-serif;
            max-width: 600px;
            margin: 0 auto;
            padding: 32px;
            color: #0A1F14;
          "
        >
          <h2 style="margin-bottom: 16px;">
            Reset your password
          </h2>

          <p>
            Hi ${user.fullName},
          </p>

          <p>
            We received a request to reset your Brook Skincare password.
          </p>

          <p style="margin: 32px 0;">
            <a
              href="${resetUrl}"
              style="
                display: inline-block;
                background: #0A1F14;
                color: #ffffff;
                padding: 14px 24px;
                border-radius: 10px;
                text-decoration: none;
                font-weight: 600;
              "
            >
              Reset Password
            </a>
          </p>

          <p>
            This link will expire in 30 minutes.
          </p>

          <p>
            If you didn't request a password reset, you can safely ignore this email.
          </p>

          <p style="margin-top: 32px;">
            Brook Skincare
          </p>
        </div>
      `,
    });

    if (error) {
      console.error("Resend forgot password error:", error);

      // Remove unusable reset token if email failed
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;

      await user.save();

      return NextResponse.json(
        { message: "Unable to send reset email. Please try again." },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        message:
          "If an account exists with this email, we've sent a password reset link.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Forgot password error:", error);

    return NextResponse.json(
      {
        message: "Something went wrong. Please try again.",
      },
      { status: 500 }
    );
  }
}