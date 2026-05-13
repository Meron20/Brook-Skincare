"use client";

import { useEffect, useState } from "react";
import { Calendar, CheckCircle, Clock } from "lucide-react";
import BookingProgress from "@/components/public/booking/BookingProgress";

type TimeSlot = {
  _id: string;
  date: string;
  startTime: string;
  endTime: string;
};

export default function BookingConfirmationPage() {
  const [date, setDate] = useState("");
  const [slot, setSlot] = useState<TimeSlot | null>(null);

  useEffect(() => {
    setDate(sessionStorage.getItem("booking_date") || "");

    const storedSlot = sessionStorage.getItem("booking_slot");
    if (storedSlot) setSlot(JSON.parse(storedSlot));
  }, []);

  return (
    <main className="min-h-screen" style={{ backgroundColor: "#F0F7F2" }}>
      <div
        className="sticky top-0 z-40 bg-white"
        style={{ borderBottom: "1px solid rgba(10,31,20,0.08)" }}
      >
        <BookingProgress currentStep={4} />
      </div>

      <div className="mx-auto max-w-3xl px-6 py-16 text-center">
        <div
          className="mx-auto mb-7 flex h-20 w-20 items-center justify-center rounded-3xl"
          style={{
            backgroundColor: "rgba(201,168,76,0.12)",
            border: "1px solid rgba(201,168,76,0.25)",
          }}
        >
          <CheckCircle size={42} style={{ color: "#C9A84C" }} />
        </div>

        <span
          className="mb-2 block text-xs font-semibold uppercase tracking-widest"
          style={{ color: "#9A7A2E" }}
        >
          Step 4 of 4
        </span>

        <h1
          className="mb-3 font-light"
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "clamp(2.2rem, 5vw, 3.5rem)",
            color: "#0A1F14",
          }}
        >
          Booking{" "}
          <strong
            className="font-semibold"
            style={{
              background: "linear-gradient(135deg, #C9A84C, #9A7A2E)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Confirmed
          </strong>
        </h1>

        <p className="mx-auto mb-8 max-w-xl text-sm leading-6" style={{ color: "rgba(10,31,20,0.55)" }}>
          Thank you. Your time slot and medical questionnaire have been submitted.
          Brook will review your answers before your session.
        </p>

        <div
          className="mx-auto rounded-3xl p-6 text-left"
          style={{
            backgroundColor: "white",
            border: "1px solid rgba(201,168,76,0.2)",
            boxShadow: "0 4px 24px rgba(10,31,20,0.06)",
          }}
        >
          <p
            className="mb-5 text-xs font-semibold uppercase tracking-widest"
            style={{ color: "#9A7A2E" }}
          >
            Your Appointment
          </p>

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Calendar size={18} style={{ color: "#C9A84C" }} />
              <span style={{ color: "#0A1F14" }}>
                {date
                  ? new Date(date + "T00:00:00").toLocaleDateString("en-SE", {
                      weekday: "long",
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })
                  : "Date not selected"}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <Clock size={18} style={{ color: "#C9A84C" }} />
              <span style={{ color: "#0A1F14" }}>
                {slot ? `${slot.startTime} — ${slot.endTime}` : "Time not selected"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}