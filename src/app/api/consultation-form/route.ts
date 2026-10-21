import { NextResponse } from "next/server";

import { connectDB } from "@/lib/mongodb";
import ConsultationForm from "@/models/ConsultationForm";
import User from "@/models/User";
import { auth } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    await connectDB();

    /*
     * Always verify the authenticated user.
     */
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json(
        {
          message:
            "Please log in before submitting the form.",
        },
        {
          status: 401,
        }
      );
    }

    const data = await req.json();

    /*
     * Determine which questionnaire is being submitted.
     */
    const isMelasmaForm =
      data.formType === "melasma";

    const isGeneralForm =
      data.formType === "general";

    /*
     * Validation for the Melasma questionnaire.
     */
    if (isMelasmaForm) {
      if (
        !data.fullName ||
        !data.melasmaAssessment
      ) {
        return NextResponse.json(
          {
            message:
              "Required Melasma assessment fields are missing.",
          },
          {
            status: 400,
          }
        );
      }
      } else if (isGeneralForm) {
      if (!data.fullName || !data.generalAssessment) {
        return NextResponse.json(
          { message: "Required assessment fields are missing." },
          { status: 400 }
        );
      }
    } else {
      /*
       * Validation for the existing standard
       * consultation form.
       */
      if (
        !data.fullName ||
        !data.email ||
        !data.mainConcern ||
        !data.goals
      ) {
        return NextResponse.json(
          {
            message:
              "Required fields are missing.",
          },
          {
            status: 400,
          }
        );
      }
    }

    /*
     * Find the logged-in customer.
     *
     * We use the session email instead of trusting
     * the email sent from the browser.
     */
    const user = await User.findOne({
      email: session.user.email
        .toLowerCase()
        .trim(),
    });

    if (!user) {
      return NextResponse.json(
        {
          message:
            "User not found. Please log in again.",
        },
        {
          status: 404,
        }
      );
    }

    /*
     * Standard fields.
     *
     * For Melasma we provide fallback values so the
     * existing required MongoDB fields continue to work.
     */
    const mainConcern = isMelasmaForm
      ? data.mainConcern ||
        "Melasma / Hyperpigmentation"
      : data.mainConcern;

    const goals = isMelasmaForm
      ? data.goals || "Melasma assessment"
      : data.goals;

    const language = isMelasmaForm
      ? data.language || "Amharic"
      : data.language;

    /*
     * Save questionnaire.
     */
    const form = await ConsultationForm.create({
      userId: user._id,

      fullName: data.fullName,

      // Never trust an arbitrary browser email.
      // Store the authenticated user's email.
      email: user.email,

      age: data.age,
      location: data.location,
      ethnicity: data.ethnicity,
      fitzpatrickType: data.fitzpatrickType,

      mainConcern,

      concernDuration: data.concernDuration,
      sunWorsens: data.sunWorsens,

      triggers: Array.isArray(data.triggers)
        ? data.triggers
        : [],

      medicalHistory: data.medicalHistory,

      morningRoutine: data.morningRoutine,
      eveningRoutine: data.eveningRoutine,

      previousTreatments:
        data.previousTreatments,

      skinPhotos: Array.isArray(data.skinPhotos)
        ? data.skinPhotos
        : [],

      productPhotos: Array.isArray(
        data.productPhotos
      )
        ? data.productPhotos
        : [],

      goals,

      budget: data.budget,

      language,

      extraNotes: data.extraNotes,

      /*
       * New questionnaire fields.
       */
      formType: isMelasmaForm
        ? "melasma"
        : isGeneralForm
          ? "general"
          : "standard",
      melasmaAssessment: isMelasmaForm
        ? data.melasmaAssessment
        : null,

      generalAssessment: isGeneralForm
        ? data.generalAssessment
        : null,
    });
    /*
     * Keep customer's primary skin concern updated.
     */
    await User.findByIdAndUpdate(user._id, {
      skinConcern: mainConcern,
    });

    return NextResponse.json(
      {
        message:
          "Questionnaire submitted successfully.",

        formId: form._id,

        formType: form.formType,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error(
      "[POST /api/consultation-form]",
      error
    );

    return NextResponse.json(
      {
        message: "Something went wrong.",
      },
      {
        status: 500,
      }
    );
  }
}