import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import Settings from "@/models/Settings";
import bcrypt from "bcryptjs";
import { auth } from "@/lib/auth";

export async function GET() {
  try {
    const session = await auth();
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const user = await User.findById(session.user.id).select("-password");

    let settings = await Settings.findOne({ adminId: session.user.id });
    if (!settings) {
      settings = await Settings.create({ adminId: session.user.id });
    }

    return NextResponse.json({ user, settings }, { status: 200 });
  } catch (error) {
    console.error("GET settings error:", error);
    return NextResponse.json({ message: "Failed to fetch settings" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const body = await req.json();
    const { type } = body;

    // ── PROFILE UPDATE ──
    if (type === "profile") {
      const { fullName, email, phone } = body;
      const user = await User.findById(session.user.id);
      if (!user) return NextResponse.json({ message: "User not found" }, { status: 404 });
      if (fullName) user.fullName = fullName;
      if (email) user.email = email;
      if (phone !== undefined) user.phone = phone;
      await user.save();
      return NextResponse.json({ message: "Profile updated successfully" }, { status: 200 });
    }

    // ── CLINIC + SOCIAL UPDATE ──
    if (type === "clinic") {
      const { clinicName, clinicAddress, clinicPhone, clinicAbout, logoUrl, facebook, youtube, tiktok, linkedin } = body;

      const settings = await Settings.findOneAndUpdate(
        { adminId: session.user.id },
        { clinicName, clinicAddress, clinicPhone, clinicAbout, logoUrl, facebook, youtube, tiktok, linkedin },
        { new: true, upsert: true }
      );

      return NextResponse.json({ message: "Clinic settings updated successfully", settings }, { status: 200 });
    }

    // ── PASSWORD UPDATE ──
    if (type === "password") {
      const { currentPassword, newPassword } = body;
      const user = await User.findById(session.user.id);
      if (!user) return NextResponse.json({ message: "User not found" }, { status: 404 });

      const isValid = await bcrypt.compare(currentPassword, user.password);
      if (!isValid) {
        return NextResponse.json({ message: "Current password is incorrect" }, { status: 400 });
      }

      if (newPassword.length < 6) {
        return NextResponse.json({ message: "New password must be at least 6 characters" }, { status: 400 });
      }

      user.password = await bcrypt.hash(newPassword, 12);
      await user.save();
      return NextResponse.json({ message: "Password changed successfully" }, { status: 200 });
    }

    return NextResponse.json({ message: "Invalid request type" }, { status: 400 });
  } catch (error) {
    console.error("PUT settings error:", error);
    return NextResponse.json({ message: "Failed to update settings" }, { status: 500 });
  }
}