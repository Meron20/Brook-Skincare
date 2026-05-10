import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import Service from "@/models/Service";
import { auth } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q")?.trim();

    if (!query || query.length < 3) {
      return NextResponse.json({ results: [] }, { status: 200 });
    }

    await connectDB();

    const regex = new RegExp(query, "i");

    // Search in parallel across all collections
    const [users, services] = await Promise.all([
      User.find({
        role: "customer",
        $or: [
          { fullName: { $regex: regex } },
          { email: { $regex: regex } },
        ],
      })
        .select("fullName email")
        .limit(5),

      Service.find({
        $or: [
          { name: { $regex: regex } },
          { description: { $regex: regex } },
        ],
      })
        .select("name description price duration")
        .limit(5),
    ]);

    const results = [
      ...users.map(u => ({
        id: u._id,
        type: "user",
        title: u.fullName,
        subtitle: u.email,
        href: "/admin/customers",
      })),
      ...services.map(s => ({
        id: s._id,
        type: "service",
        title: s.name,
        subtitle: `${s.price}kr · ${s.duration} min`,
        href: "/admin/services",
      })),
    ];

    return NextResponse.json({ results }, { status: 200 });
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json({ message: "Search failed" }, { status: 500 });
  }
}