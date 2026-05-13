import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import FAQ from "@/models/FAQ";
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
    const faq = await FAQ.findByIdAndUpdate(id, body, { returnDocument: "after" });
    if (!faq) return NextResponse.json({ message: "FAQ not found" }, { status: 404 });
    return NextResponse.json({ faq }, { status: 200 });
  } catch (error) {
    console.error("PUT faq error:", error);
    return NextResponse.json({ message: "Failed to update FAQ" }, { status: 500 });
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
    await FAQ.findByIdAndDelete(id);
    return NextResponse.json({ message: "FAQ deleted" }, { status: 200 });
  } catch (error) {
    console.error("DELETE faq error:", error);
    return NextResponse.json({ message: "Failed to delete FAQ" }, { status: 500 });
  }
}