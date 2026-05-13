import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Article from "@/models/Article";
import { auth } from "@/lib/auth";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    await connectDB();
    const { id } = await params;
    const body = await req.json();

    const article = await Article.findByIdAndUpdate(id, body, {
      returnDocument: "after",
    });

    if (!article) {
      return NextResponse.json({ message: "Article not found" }, { status: 404 });
    }

    return NextResponse.json({ article }, { status: 200 });
  } catch (error) {
    console.error("PUT article error:", error);
    return NextResponse.json({ message: "Failed to update article" }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    await connectDB();
    const { id } = await params;
    const article = await Article.findByIdAndDelete(id);

    if (!article) {
      return NextResponse.json({ message: "Article not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Article deleted" }, { status: 200 });
  } catch (error) {
    console.error("DELETE article error:", error);
    return NextResponse.json({ message: "Failed to delete article" }, { status: 500 });
  }
}