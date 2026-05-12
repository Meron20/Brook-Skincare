import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import JournalNote from "@/models/JournalNote";
import ActivityLog from "@/models/ActivityLog";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const customerId = searchParams.get("customerId");

    await connectDB();

    const query = customerId ? { customerId } : {};

    const notes = await JournalNote.find(query)
      .populate("customerId", "fullName name email")
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json(notes);
  } catch (error) {
    console.error("[GET /api/journal-notes]", error);
    return NextResponse.json(
      { message: "Internal server error." },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const { customerId, title, content } = await req.json();

    if (!customerId || !title?.trim() || !content?.trim()) {
      return NextResponse.json(
        { message: "Please fill in both title and journal content." },
        { status: 400 }
      );
    }

    await connectDB();

    const note = await JournalNote.create({
      customerId,
      title: title.trim(),
      content: content.trim(),
      createdBy: "Admin",
    });

    await ActivityLog.create({
      customerId,
      type: "journal_note",
      description: `New journal entry: "${title.trim()}"`,
    });

    const populatedNote = await JournalNote.findById(note._id)
      .populate("customerId", "fullName name email")
      .lean();

    return NextResponse.json(populatedNote, { status: 201 });
  } catch (error) {
    console.error("[POST /api/journal-notes]", error);
    return NextResponse.json(
      { message: "Internal server error." },
      { status: 500 }
    );
  }
}