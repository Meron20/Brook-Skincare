import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import TimeSlot from "@/models/TimeSlot";

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const slot = await TimeSlot.findByIdAndDelete(id);

    if (!slot) {
      return NextResponse.json({ message: "Time slot not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Time slot deleted" }, { status: 200 });
  } catch (error) {
    console.error("DELETE timeslot error:", error);
    return NextResponse.json({ message: "Failed to delete time slot" }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const body = await req.json();

    const slot = await TimeSlot.findByIdAndUpdate(id, body, { returnDocument: "after" });

    if (!slot) {
      return NextResponse.json({ message: "Time slot not found" }, { status: 404 });
    }

    return NextResponse.json({ slot }, { status: 200 });
  } catch (error) {
    console.error("PUT timeslot error:", error);
    return NextResponse.json({ message: "Failed to update time slot" }, { status: 500 });
  }
}