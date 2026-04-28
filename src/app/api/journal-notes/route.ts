import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import JournalNote from "@/models/JournalNote";
import ActivityLog from "@/models/ActivityLog";

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
    type: "Journal Note",
    description: `Journal note added: ${title}`,
    createdBy: "Admin",
    });

    return NextResponse.json(note, { status: 201 });
  } catch (error) {
    console.error("Create note error:", error);

    return NextResponse.json(
      { message: "Failed to create journal note. Please try again." },
      { status: 500 }
    );
  }
}