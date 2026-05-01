import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Booking from "@/models/Booking";
import JournalNote from "@/models/JournalNote";
import ActivityLog from "@/models/ActivityLog";
import { auth } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const { searchParams } = new URL(req.url);
    const filter = searchParams.get("filter") || "all";

    // Fetch all in parallel
    const [bookings, journals, activities] = await Promise.all([
      filter === "all" || filter === "bookings"
        ? Booking.find()
            .populate("customerId", "fullName email")
            .sort({ createdAt: -1 })
            .limit(50)
        : Promise.resolve([]),

      filter === "all" || filter === "journal"
        ? JournalNote.find()
            .populate("customerId", "fullName email")
            .sort({ createdAt: -1 })
            .limit(50)
        : Promise.resolve([]),

      filter === "all" || filter === "activity"
        ? ActivityLog.find()
            .populate("customerId", "fullName email")
            .sort({ createdAt: -1 })
            .limit(50)
        : Promise.resolve([]),
    ]);

    // Normalize into unified timeline items
    const items = [
      ...bookings.map((b: any) => ({
        id: b._id,
        type: "booking",
        title: b.treatment,
        subtitle: `${b.date} at ${b.time}`,
        status: b.status,
        customer: b.customerId?.fullName || "Unknown",
        email: b.customerId?.email || "",
        createdAt: b.createdAt,
      })),
      ...journals.map((j: any) => ({
        id: j._id,
        type: "journal",
        title: j.title,
        subtitle: j.content.substring(0, 80) + (j.content.length > 80 ? "..." : ""),
        status: "Note",
        customer: j.customerId?.fullName || "Unknown",
        email: j.customerId?.email || "",
        createdAt: j.createdAt,
      })),
      ...activities.map((a: any) => ({
        id: a._id,
        type: "activity",
        title: a.type,
        subtitle: a.description,
        status: "Log",
        customer: a.customerId?.fullName || "Unknown",
        email: a.customerId?.email || "",
        createdAt: a.createdAt,
      })),
    ].sort((a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    return NextResponse.json({ items }, { status: 200 });
  } catch (error) {
    console.error("History error:", error);
    return NextResponse.json(
      { message: "Failed to fetch history" },
      { status: 500 }
    );
  }
}