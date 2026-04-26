import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await context.params;

    const customer = await User.findById(id);

    if (!customer) {
      return NextResponse.json(
        { message: "Customer not found." },
        { status: 404 }
      );
    }

    return NextResponse.json(customer);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}