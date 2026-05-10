import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import TimeSlot from "@/models/TimeSlot";

export async function GET() {
  try {
    await connectDB();
    const slots = await TimeSlot.find().sort({ date: 1, startTime: 1 });
    return NextResponse.json({ slots }, { status: 200 });
  } catch (error) {
    console.error("GET timeslots error:", error);
    return NextResponse.json({ message: "Failed to fetch time slots" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { date, slots } = await req.json();

    if (!date || !slots || slots.length === 0) {
      return NextResponse.json({ message: "Date and slots are required" }, { status: 400 });
    }

    // Create all slots for the selected date
    const created = await TimeSlot.insertMany(
      slots.map(({ startTime, endTime }: { startTime: string; endTime: string }) => ({
        date,
        startTime,
        endTime,
        isBooked: false,
        isAvailable: true,
      }))
    );

    return NextResponse.json({ slots: created }, { status: 201 });
  } catch (error) {
    console.error("POST timeslot error:", error);
    return NextResponse.json({ message: "Failed to create time slots" }, { status: 500 });
  }
}