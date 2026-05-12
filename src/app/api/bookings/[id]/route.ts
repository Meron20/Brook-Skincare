import { connectDB } from "@/lib/mongodb";
import Booking from "@/models/Booking";
import { NextResponse } from "next/server";

export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await context.params;
    const body = await req.json();

    const booking = await Booking.findByIdAndUpdate(
      id,
      {
        customerId: body.customerId,
        treatment: body.treatment,
        date: body.date,
        time: body.time,
        status: body.status || "Upcoming",
      },
      { returnDocument: "after", runValidators: true }
    ).populate("customerId", "fullName email");

    if (!booking) {
      return NextResponse.json(
        { message: "Booking not found." },
        { status: 404 }
      );
    }

    return NextResponse.json(booking, { status: 200 });
  } catch (error) {
    console.error("PUT booking error:", error);

    return NextResponse.json(
      { message: "Failed to update booking." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await context.params;

    const deleted = await Booking.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json(
        { message: "Booking not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("DELETE booking error:", error);

    return NextResponse.json(
      { message: "Failed to delete booking." },
      { status: 500 }
    );
  }
}