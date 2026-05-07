import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Settings from "@/models/Settings";

export async function GET() {
  try {
    await connectDB();
    
    const settings = await Settings.findOne({
      $or: [
        { clinicName: { $ne: "" } },
        { logoUrl: { $ne: "" } },
        { youtube: { $ne: "" } },
      ]
    }).sort({ updatedAt: -1 });

    const finalSettings = settings || await Settings.findOne().sort({ updatedAt: -1 });

    return NextResponse.json({ settings: finalSettings }, { status: 200 });
  } catch (error) {
    console.error("GET public settings error:", error);
    return NextResponse.json(
      { message: "Failed to fetch settings" },
      { status: 500 }
    );
  }
}