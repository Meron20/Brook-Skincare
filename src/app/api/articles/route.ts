import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Article from "@/models/Article";

export async function GET() {
  try {
    await connectDB();
    const articles = await Article.find({ isPublished: true })
      .sort({ isPinned: -1, createdAt: -1 });
    return NextResponse.json({ articles }, { status: 200 });
  } catch (error) {
    console.error("GET articles error:", error);
    return NextResponse.json({ message: "Failed to fetch articles" }, { status: 500 });
  }
}