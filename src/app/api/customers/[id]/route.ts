import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/lib/models/User";
import JournalNote from "@/lib/models/JournalNote";

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

    return NextResponse.json({
      customer,
      notes,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}