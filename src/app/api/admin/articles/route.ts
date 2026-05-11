import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Article from "@/models/Article";
import { auth } from "@/lib/auth";

export async function GET() {
  try {
    const session = await auth();
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    await connectDB();
    const articles = await Article.find().sort({ createdAt: -1 });
    return NextResponse.json({ articles }, { status: 200 });
  } catch (error) {
    console.error("GET articles error:", error);
    return NextResponse.json({ message: "Failed to fetch articles" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    await connectDB();
    const body = await req.json();
    const { title, excerpt, content, category, coverImage, isPublished, isPinned } = body;

    if (!title || !excerpt || !content) {
      return NextResponse.json(
        { message: "Title, excerpt and content are required" },
        { status: 400 }
      );
    }

    let slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  // Check if slug exists and add suffix if needed
  const existingSlug = await Article.findOne({ slug });
  if (existingSlug) {
    slug = `${slug}-${Date.now()}`;
  }


    const article = await Article.create({
      title, excerpt, content, category,
      slug,
      coverImage: coverImage || "",
      isPublished: isPublished || false,
      isPinned: isPinned || false,
    });

    return NextResponse.json({ article }, { status: 201 });
  } catch (error) {
    console.error("POST article error:", error);
    return NextResponse.json({ message: "Failed to create article" }, { status: 500 });
  }
}