import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Booking from "@/models/Booking";
import ActivityLog from "@/models/ActivityLog";

export async function POST(req: Request) {
  try {
    const { customerId, treatment, date, time } = await req.json();

    if (!customerId || !treatment || !date || !time) {
      return NextResponse.json(
        { message: "All fields are required." },
        { status: 400 }
      );
    }

    await connectDB();

    const booking = await Booking.create({
      customerId,
      treatment,
      date,
      time,
    });

    await ActivityLog.create({
    customerId,
    type: "Booking",
    description: `Booking created: ${treatment} on ${date} at ${time}`,
    createdBy: "Admin",
    });

    return NextResponse.json(booking, { status: 201 });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { message: "Failed to create booking." },
      { status: 500 }
    );
  }
}