import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import JournalNote from "@/models/JournalNote";
import ActivityLog from "@/models/ActivityLog";
import ConsultationForm from "@/models/ConsultationForm";
import User from "@/models/User";
import { auth } from "@/lib/auth";

export async function GET(req: Request) {
  try {

    const session = await auth();

      if (session?.user?.role !== "admin") {
        return NextResponse.json({ message: "Not allowed." }, { status: 403 });
}
    const { searchParams } = new URL(req.url);
    const customerId = searchParams.get("customerId");

    await connectDB();

    // =========================================================
    // 1. FETCH MANUAL JOURNAL NOTES
    // =========================================================

    const noteQuery = customerId
      ? { customerId }
      : {};

    const notes = await JournalNote.find(noteQuery)
      .populate(
        "customerId",
        "fullName name email"
      )
      .sort({ createdAt: -1 })
      .lean();

    // =========================================================
    // 2. FETCH CONSULTATION FORMS
    // =========================================================

    const formQuery = customerId
      ? { userId: customerId }
      : {};

    const forms =
      await ConsultationForm.find(formQuery)
        .sort({ createdAt: -1 })
        .lean();

    // =========================================================
    // 3. FIND USERS BELONGING TO THE FORMS
    // =========================================================

    const formUserIds = [
      ...new Set(
        forms
          .filter((form: any) => form.userId)
          .map((form: any) =>
            form.userId.toString()
          )
      ),
    ];

    const users =
      formUserIds.length > 0
        ? await User.find({
            _id: {
              $in: formUserIds,
            },
          })
            .select(
              "_id fullName name email"
            )
            .lean()
        : [];

    const userMap = new Map(
      users.map((user: any) => [
        user._id.toString(),
        user,
      ])
    );

    // =========================================================
    // 4. NORMALISE JOURNAL NOTES
    // =========================================================

    const journalEntries = notes.map(
      (note: any) => {
        return {
          _id: note._id.toString(),

          entryType: "note",

          customerId: note.customerId,

          title:
            note.title || "Journal Note",

          content:
            note.content ||
            note.note ||
            "",

          createdAt: note.createdAt,
        };
      }
    );

    // =========================================================
    // 5. NORMALISE CONSULTATION FORMS
    // =========================================================

    const consultationEntries = forms.map(
      (form: any) => {
        const userId =
          form.userId?.toString();

        const customer =
          userMap.get(userId);

        const isMelasma =
          form.formType === "melasma";

        return {
          _id: form._id.toString(),

          entryType:
            "consultation_form",

          formType:
            form.formType || "standard",

          customerId: customer
            ? {
                _id:
                  customer._id.toString(),

                fullName:
                  customer.fullName || "",

                name:
                  customer.name || "",

                email:
                  customer.email || "",
              }
            : userId,

          title: isMelasma
            ? "Melasma Assessment"
            : "Pre-Consultation Form",

          content: isMelasma
            ? "Amharic Melasma questionnaire submitted."
            : `${
                form.mainConcern ||
                "Skin consultation"
              } — consultation form submitted.`,

          language:
            form.language || null,

          createdAt: form.createdAt,
        };
      }
    );

    // =========================================================
    // 6. MERGE EVERYTHING INTO ONE JOURNAL FEED
    // =========================================================

    const entries = [
      ...journalEntries,
      ...consultationEntries,
    ].sort((a: any, b: any) => {
      const dateA = new Date(
        a.createdAt || 0
      ).getTime();

      const dateB = new Date(
        b.createdAt || 0
      ).getTime();

      return dateB - dateA;
    });

    return NextResponse.json(entries);
  } catch (error) {
    console.error(
      "[GET /api/journal-notes]",
      error
    );

    return NextResponse.json(
      {
        message:
          "Internal server error.",
      },
      { status: 500 }
    );
  }
}

// ===========================================================
// CREATE MANUAL JOURNAL NOTE
// ===========================================================

export async function POST(req: Request) {
  try {
    const session = await auth();

      if (session?.user?.role !== "admin") {
        return NextResponse.json({ message: "Not allowed." }, { status: 403 });
      }
    const {
      customerId,
      title,
      content,
    } = await req.json();

    if (
      !customerId ||
      !title?.trim() ||
      !content?.trim()
    ) {
      return NextResponse.json(
        {
          message:
            "Please fill in both title and journal content.",
        },
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

    const populatedNote =
      await JournalNote.findById(note._id)
        .populate(
          "customerId",
          "fullName name email"
        )
        .lean();

    return NextResponse.json(
      populatedNote,
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error(
      "[POST /api/journal-notes]",
      error
    );

    return NextResponse.json(
      {
        message:
          "Internal server error.",
      },
      { status: 500 }
    );
  }
}