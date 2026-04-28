import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

export async function GET() {
  try {
    await connectDB();

    const customers = await User.find().sort({ createdAt: -1 });

    return NextResponse.json(customers);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { message: "Failed to fetch customers" },
      { status: 500 }
    );
  }
}