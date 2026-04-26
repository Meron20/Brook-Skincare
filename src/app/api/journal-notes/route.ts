import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import JournalNote from "@/lib/models/JournalNote";

export async function POST(req: Request) {
  try {
    const { customerId, title, content } = await req.json();

    if (!customerId || !title || !content) {
      return NextResponse.json(
        { message: "All fields are required." },
        { status: 400 }
      );
    }

    await connectDB();

    const note = await JournalNote.create({
      customerId,
      title,
      content,
      createdBy: "Admin",
    });

    return NextResponse.json(note, { status: 201 });
  } catch (error) {
    console.error("Create note error:", error);

    return NextResponse.json(
      { message: "Failed to create journal note." },
      { status: 500 }
    );
  }
}