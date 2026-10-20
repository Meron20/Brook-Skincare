import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import JournalNote from "@/models/JournalNote";
import Booking from "@/models/Booking";
import ActivityLog from "@/models/ActivityLog";
import ConsultationForm from "@/models/ConsultationForm";

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await context.params;

    if (!id) {
      return NextResponse.json(
        { message: "Customer ID is required." },
        { status: 400 }
      );
    }

    const customer = await User.findById(id)
      .select(
        "_id fullName email phone skinConcern createdAt"
      )
      .lean();

    if (!customer) {
      return NextResponse.json(
        { message: "Customer not found." },
        { status: 404 }
      );
    }

    const [
      notes,
      bookings,
      activityLogs,
      consultationForms,
    ] = await Promise.all([
      JournalNote.find({ customerId: id })
        .sort({ createdAt: -1 })
        .lean(),

      Booking.find({ customerId: id })
        .sort({ createdAt: -1 })
        .lean(),

      ActivityLog.find({ customerId: id })
        .sort({ createdAt: -1 })
        .lean(),

      ConsultationForm.find({ userId: id })
        .sort({ createdAt: -1 })
        .lean(),
    ]);

    return NextResponse.json(
      {
        customer,
        notes,
        bookings,
        activityLogs,

        // Includes both standard consultation forms
        // and Melasma assessments.
        consultationForms,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(
      "Get customer details error:",
      error
    );

    return NextResponse.json(
      {
        message:
          "Failed to fetch customer details.",
      },
      { status: 500 }
    );
  }
}