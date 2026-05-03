import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Booking from "@/models/Booking";
import ActivityLog from "@/models/ActivityLog";

export async function GET() {
  try {
    await connectDB();

    const bookings = await Booking.find()
      .populate("customerId", "fullName email")
      .sort({ createdAt: -1 });

    return NextResponse.json({ bookings }, { status: 200 });
  } catch (error) {
    console.error("GET bookings error:", error);

    return NextResponse.json(
      { message: "Failed to fetch bookings." },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();

    const { customerId, treatment, date, time, status } =
      await req.json();

    if (!customerId || !treatment || !date || !time) {
      return NextResponse.json(
        { message: "All fields are required." },
        { status: 400 }
      );
    }

    const booking = await Booking.create({
      customerId,
      treatment,
      date,
      time,
      status: status || "Upcoming",
    });

    await ActivityLog.create({
      customerId,
      type: "Booking",
      description: `Booking created: ${treatment} on ${date} at ${time}`,
      createdBy: "System",
    });

    const populatedBooking = await Booking.findById(booking._id).populate(
      "customerId",
      "fullName email"
    );

    // 🔥 REALTIME EVENT
    (global as any).io?.emit("booking:created", populatedBooking);

    return NextResponse.json(populatedBooking, { status: 201 });
  } catch (error) {
    console.error("POST booking error:", error);

    return NextResponse.json(
      { message: "Failed to create booking." },
      { status: 500 }
    );
  }
}