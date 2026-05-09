import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import ConsultationForm from "@/models/ConsultationForm";

export async function POST(req: Request) {
  try {
    const data = await req.json();

    if (!data.fullName || !data.email || !data.mainConcern || !data.goals) {
      return NextResponse.json(
        { message: "Required fields are missing." },
        { status: 400 }
      );
    }

    await connectDB();

    const form = await ConsultationForm.create({
      fullName: data.fullName,
      email: data.email,
      age: data.age,
      location: data.location,
      ethnicity: data.ethnicity,
      fitzpatrickType: data.fitzpatrickType,
      mainConcern: data.mainConcern,
      concernDuration: data.concernDuration,
      sunWorsens: data.sunWorsens,
      triggers: data.triggers || [],
      medicalHistory: data.medicalHistory,
      morningRoutine: data.morningRoutine,
      eveningRoutine: data.eveningRoutine,
      previousTreatments: data.previousTreatments,
      skinPhotos: data.skinPhotos || [],
      productPhotos: data.productPhotos || [],
      goals: data.goals,
      budget: data.budget,
      language: data.language,
      extraNotes: data.extraNotes,
    });

    return NextResponse.json(
      {
        message: "Questionnaire submitted successfully.",
        formId: form._id,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Consultation form error:", error);

    return NextResponse.json(
      { message: "Something went wrong." },
      { status: 500 }
    );
  }
}