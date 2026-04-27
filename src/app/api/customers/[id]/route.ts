import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/lib/models/User";
import JournalNote from "@/lib/models/JournalNote";
import Booking from "@/lib/models/Booking";
import ActivityLog from "@/lib/models/ActivityLog";

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await context.params;

    const customer = await User.findById(id).select(
      "_id fullName email phone skinConcern createdAt"
    );

    if (!customer) {
      return NextResponse.json(
        { message: "Customer not found." },
        { status: 404 }
      );
    }

    const notes = await JournalNote.find({ customerId: id }).sort({
      createdAt: -1,
    });

    const bookings = await Booking.find({ customerId: id }).sort({
      createdAt: -1,
    });

    const activityLogs = await ActivityLog.find({ customerId: id }).sort({
    createdAt: -1,
  });

    return NextResponse.json(
      {
        customer,
        notes,
        bookings,
        activityLogs,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Get customer details error:", error);

    return NextResponse.json(
      { message: "Failed to fetch customer details." },
      { status: 500 }
    );
  }
}