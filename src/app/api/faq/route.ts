import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import FAQ from "@/models/FAQ";

export async function GET() {
  try {
    await connectDB();
    const faqs = await FAQ.find({ isVisible: true })
      .sort({ order: 1, createdAt: 1 });
    return NextResponse.json({ faqs }, { status: 200 });
  } catch (error) {
    console.error("GET faq error:", error);
    return NextResponse.json({ message: "Failed to fetch FAQs" }, { status: 500 });
  }
}