import { NextResponse } from "next/server";
import { Resend } from "resend";
import { z } from "zod";
import { connectDB } from "@/lib/mongodb";

const resend = new Resend(process.env.RESEND_API_KEY);

const contactSchema = z.object({
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  concern: z.string().min(1),
  message: z.string().min(10).max(500),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const data = contactSchema.parse(body);

    const fullName = `${data.firstName} ${data.lastName}`;

    const mongoose = await connectDB();
    const db = mongoose.connection.db;

    if (!db) {
      throw new Error("Database connection not ready");
    }

    await db.collection("contactmessages").insertOne({
      ...data,
      fullName,
      status: "new",
      source: "contact-page",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await resend.emails.send({
      from: "Brook Skincare <onboarding@resend.dev>",
      to: process.env.CONTACT_TO_EMAIL || "hello@brookskincare.com",
      subject: `New contact message from ${fullName}`,
      replyTo: data.email,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6;">
          <h2>New Contact Message</h2>

          <p><strong>Name:</strong> ${fullName}</p>
          <p><strong>Email:</strong> ${data.email}</p>
          <p><strong>Phone:</strong> ${data.phone || "Not provided"}</p>
          <p><strong>Concern:</strong> ${data.concern}</p>

          <hr />

          <p><strong>Message:</strong></p>
          <p>${data.message}</p>
        </div>
      `,
    });

    return NextResponse.json({
      success: true,
      message: "Message saved and sent",
    });
  } catch (error) {
    console.error("Contact API error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong",
      },
      { status: 400 }
    );
  }
}