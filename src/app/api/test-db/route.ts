import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";

export async function GET() {
  try {
    console.log("Trying to connect to MongoDB...");
    
    await connectDB();

    console.log("MongoDB connected successfully");

    return NextResponse.json({
      message:"MongoDB connected",
    });
  } catch (error) {
    console.error("MongoDB connection failed:", error);

    return NextResponse.json(
      {
        message: "MongoDB not connected",
        error,
      },
      { status: 500 }
    );
  }
}