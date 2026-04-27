import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Service from "@/models/Service";


export async function GET() {
  try {
    await connectDB();
    const services = await Service.find().sort({ createdAt: -1 });
    return NextResponse.json({ services }, { status: 200 });
  } catch (error) {
    console.error("GET services error:", error);
    return NextResponse.json(
      { message: "Failed to fetch services" },
      { status: 500 }
    );
  }
}


export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    const { name, description, price, duration, image } = body;

    if (!name || !description || !price || !duration) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 }
      );
    }

    const service = await Service.create({
      name,
      description,
      price: Number(price),
      duration: Number(duration),
      image: image || "",
    });

    return NextResponse.json({ service }, { status: 201 });
  } catch (error) {
    console.error("POST service error:", error);
    return NextResponse.json(
      { message: "Failed to create service" },
      { status: 500 }
    );
  }
}