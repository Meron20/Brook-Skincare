import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import FAQ from "@/models/FAQ";
import { auth } from "@/lib/auth";

export async function GET() {
  try {
    const session = await auth();
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    await connectDB();
    const faqs = await FAQ.find().sort({ order: 1, createdAt: -1 });
    return NextResponse.json({ faqs }, { status: 200 });
  } catch (error) {
    console.error("GET faq error:", error);
    return NextResponse.json({ message: "Failed to fetch FAQs" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    await connectDB();
    const { question, answer, category, order } = await req.json();

    if (!question || !answer) {
      return NextResponse.json(
        { message: "Question and answer are required" },
        { status: 400 }
      );
    }

    const faq = await FAQ.create({ question, answer, category, order: order || 0 });
    return NextResponse.json({ faq }, { status: 201 });
  } catch (error) {
    console.error("POST faq error:", error);
    return NextResponse.json({ message: "Failed to create FAQ" }, { status: 500 });
  }
}