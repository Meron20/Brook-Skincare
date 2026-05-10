import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Newsletter from "@/models/Newsletter";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { email } = await req.json();

    // Validation
    if (!email) {
      return NextResponse.json(
        { message: "Email is required" },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { message: "Please enter a valid email address" },
        { status: 400 }
      );
    }

    // Check if already subscribed
    const existing = await Newsletter.findOne({ email });
    if (existing) {
      if (existing.isActive) {
        return NextResponse.json(
          { message: "This email is already subscribed!" },
          { status: 409 }
        );
      } else {
        // Reactivate if previously unsubscribed
        existing.isActive = true;
        await existing.save();
        return NextResponse.json(
          { message: "Welcome back! You are subscribed again." },
          { status: 200 }
        );
      }
    }

    // Save new subscriber
    await Newsletter.create({ email });

    return NextResponse.json(
      { message: "Successfully subscribed!" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Newsletter error:", error);
    return NextResponse.json(
      { message: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}