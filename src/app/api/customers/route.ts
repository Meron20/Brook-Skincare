import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import ConsultationForm from "@/models/ConsultationForm";

export async function GET() {
  try {
    await connectDB();

    const users = await User.find({
      role: { $ne: "admin" },
    })
      .sort({ createdAt: -1 })
      .lean();

    const forms = await ConsultationForm.find({})
      .sort({ createdAt: -1 })
      .lean();

    const latestFormByUserId = new Map<string, any>();

    forms.forEach((form) => {
      if (!form.userId) return;

      const userId = form.userId.toString();

      if (!latestFormByUserId.has(userId)) {
        latestFormByUserId.set(userId, form);
      }
    });

    const customers = users.map((user) => {
      const form = latestFormByUserId.get(user._id.toString());

      return {
        _id: user._id.toString(),
        fullName: user.fullName || "",
        email: user.email || "",
        phone: user.phone || "",
        skinConcern:
          form?.mainConcern ||
          user.skinConcern ||
          "",

        hasForm: !!form,

        latestFormId: form?._id?.toString() || null,

        createdAt: user.createdAt,
      };
    });

    return NextResponse.json(customers);
  } catch (error) {
    console.error("[GET /api/customers]", error);

    return NextResponse.json(
      { message: "Failed to fetch customers" },
      { status: 500 }
    );
  }
}