import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import ConsultationForm from "@/models/ConsultationForm";
import User from "@/models/User";
import { auth } from "@/lib/auth";
 

export async function POST(req: Request) {
  try {
    await connectDB();

    const session = await auth();
    const data = await req.json();

    if (!data.fullName || !data.email || !data.mainConcern || !data.goals) {
      return NextResponse.json(
        { message: "Required fields are missing." },
        { status: 400 }
      );
    }

    if (!session?.user?.email) {
      return NextResponse.json(
        { message: "Please log in before submitting the form." },
        { status: 401 }
      );
    }

    const user = await User.findOne({
      email: session.user.email.toLowerCase().trim(),
    });

    if (!user) {
      return NextResponse.json(
        { message: "User not found. Please log in again." },
        { status: 404 }
      );
    }

    const form = await ConsultationForm.create({
      userId: user._id,
      fullName: data.fullName,
      email: user.email,

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

    await User.findByIdAndUpdate(user._id, {
      skinConcern: data.mainConcern,
    });

    return NextResponse.json(
      {
        message: "Questionnaire submitted successfully.",
        formId: form._id,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("[POST /api/consultation-form]", error);

    return NextResponse.json(
      { message: "Something went wrong." },
      { status: 500 }
    );
  }
}