import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import JournalNote from "@/models/JournalNote";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { title, content } = await req.json();

    if (!title?.trim() || !content?.trim()) {
      return NextResponse.json(
        { message: "Title and content are required." },
        { status: 400 }
      );
    }

    await connectDB();

    const note = await JournalNote.findByIdAndUpdate(
      id,
      {
        title: title.trim(),
        content: content.trim(),
      },
      { new: true, runValidators: true }
    )
      .populate("customerId", "fullName email")
      .lean();

    if (!note) {
      return NextResponse.json({ message: "Note not found." }, { status: 404 });
    }

    return NextResponse.json(note);
  } catch (error) {
    console.error("[PATCH /api/journal-notes/:id]", error);
    return NextResponse.json(
      { message: "Internal server error." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await connectDB();

    const note = await JournalNote.findByIdAndDelete(id);

    if (!note) {
      return NextResponse.json({ message: "Note not found." }, { status: 404 });
    }

    return NextResponse.json({ message: "Note deleted." });
  } catch (error) {
    console.error("[DELETE /api/journal-notes/:id]", error);
    return NextResponse.json(
      { message: "Internal server error." },
      { status: 500 }
    );
  }
}