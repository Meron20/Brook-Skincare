"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Calendar, CheckCircle, Clock, Sparkles } from "lucide-react";
import BookingProgress from "@/components/public/booking/BookingProgress";

type TimeSlot = {
  _id: string;
  date: string;
  startTime: string;
  endTime: string;
};

type BookingService = {
  _id: string;
  name: string;
  price: number;
  duration: number;
};

export default function BookingConfirmationPage() {
  const { data: session } = useSession();

  const [service, setService] = useState<BookingService | null>(null);
  const [date, setDate] = useState("");
  const [slot, setSlot] = useState<TimeSlot | null>(null);

  const [isSaving, setIsSaving] = useState(false);
  const [isBooked, setIsBooked] = useState(false);
  const [error, setError] = useState("");

  // Read the saved booking data
  useEffect(() => {
    const savedService = sessionStorage.getItem("booking_service");
    if (savedService) setService(JSON.parse(savedService));

    setDate(sessionStorage.getItem("booking_date") || "");

    const savedSlot = sessionStorage.getItem("booking_slot");
    if (savedSlot) setSlot(JSON.parse(savedSlot));
  }, []);

  // The button only works when every step is done
  const canConfirm = service && date && slot;

  const handleConfirm = async () => {
    setError("");

    if (!session?.user) {
      setError("Please sign in to confirm your booking.");
      return;
    }

    setIsSaving(true);

    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerId: session.user.id,
          treatment: service!.name,
          date,
          time: `${slot!.startTime} — ${slot!.endTime}`,
        }),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.message || "Failed.");

      // Booking saved: clear the old data
      sessionStorage.removeItem("booking_service");
      sessionStorage.removeItem("booking_date");
      sessionStorage.removeItem("booking_slot");
      sessionStorage.removeItem("booking_journal_submitted");

      setIsBooked(true);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const formattedDate = date
    ? new Date(date + "T00:00:00").toLocaleDateString("en-SE", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "Date not selected";

  return (
    <main className="min-h-screen" style={{ backgroundColor: "#F0F7F2" }}>
      <div
        className="sticky top-0 z-40 bg-white"
        style={{ borderBottom: "1px solid rgba(10,31,20,0.08)" }}
      >
        <BookingProgress currentStep={4} />
      </div>

      <div className="mx-auto max-w-3xl px-6 py-16 text-center">
        {isBooked && (
          <div
            className="mx-auto mb-7 flex h-20 w-20 items-center justify-center rounded-3xl"
            style={{
              backgroundColor: "rgba(201,168,76,0.12)",
              border: "1px solid rgba(201,168,76,0.25)",
            }}
          >
            <CheckCircle size={42} style={{ color: "#C9A84C" }} />
          </div>
        )}

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
          {isBooked ? "Booking " : "Confirm Your "}
          <strong
            className="font-semibold"
            style={{
              background: "linear-gradient(135deg, #C9A84C, #9A7A2E)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            {isBooked ? "Confirmed" : "Booking"}
          </strong>
        </h1>

        <p
          className="mx-auto mb-8 max-w-xl text-sm leading-6"
          style={{ color: "rgba(10,31,20,0.55)" }}
        >
          {isBooked
            ? "Thank you. Brook will review your answers before your session."
            : "Please check your appointment details below."}
        </p>

        {/* Appointment card */}
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
              <Sparkles size={18} style={{ color: "#C9A84C" }} />
              <span style={{ color: "#0A1F14" }}>
                {service
                  ? `${service.name} · ${service.duration} min · ${service.price} kr`
                  : "Service not selected"}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <Calendar size={18} style={{ color: "#C9A84C" }} />
              <span style={{ color: "#0A1F14" }}>{formattedDate}</span>
            </div>

            <div className="flex items-center gap-3">
              <Clock size={18} style={{ color: "#C9A84C" }} />
              <span style={{ color: "#0A1F14" }}>
                {slot ? `${slot.startTime} — ${slot.endTime}` : "Time not selected"}
              </span>
            </div>
          </div>
        </div>

        {/* Error message */}
        {error && (
          <p className="mt-5 text-sm" style={{ color: "#991b1b" }}>
            {error}
          </p>
        )}

        {/* Confirm button (hidden after booking) */}
        {!isBooked && (
          <div className="mt-8">
            <button
              type="button"
              onClick={handleConfirm}
              disabled={!canConfirm || isSaving}
              className="rounded-2xl px-10 py-3.5 text-sm font-bold transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
              style={{
                background: "linear-gradient(135deg, #C9A84C, #9A7A2E)",
                color: "white",
                boxShadow: "0 8px 28px rgba(201,168,76,0.3)",
              }}
            >
              {isSaving ? "Saving..." : "Confirm Booking"}
            </button>

            {!canConfirm && (
              <p className="mt-3 text-sm" style={{ color: "rgba(10,31,20,0.45)" }}>
                Please finish the earlier steps before confirming.
              </p>
            )}
          </div>
        )}
      </div>
    </main>
  );
}