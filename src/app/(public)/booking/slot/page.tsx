"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, Clock, ArrowRight } from "lucide-react";
import BookingProgress from "@/components/public/booking/BookingProgress";

type TimeSlot = {
  _id: string;
  date: string;
  startTime: string;
  endTime: string;
  isBooked: boolean;
  isAvailable: boolean;
};

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const formatDate = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

const today = formatDate(new Date());

export default function SlotPage() {
  const router = useRouter();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch all slots
  useEffect(() => {
    fetch("/api/admin/timeslots")
      .then(res => res.json())
      .then(data => {
        setSlots(data.slots || []);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, []);

  // Get calendar days for current month
  const getCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    // Get Monday as first day
    let startDay = firstDay.getDay() - 1;
    if (startDay === -1) startDay = 6;

    const days: (Date | null)[] = [];

    // Empty cells before first day
    for (let i = 0; i < startDay; i++) {
      days.push(null);
    }

    // Actual days
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push(new Date(year, month, i));
    }

    return days;
  };

  const getSlotsForDate = (date: string) =>
    slots.filter(s => s.date === date && !s.isBooked && s.isAvailable);

  const hasAvailableSlots = (date: string) =>
    getSlotsForDate(date).length > 0;

  const isPastDate = (date: string) => date < today;

  const handleContinue = () => {
    if (!selectedDate || !selectedSlot) return;
    // Save selection to sessionStorage for next step
    sessionStorage.setItem("booking_date", selectedDate);
    sessionStorage.setItem("booking_slot", JSON.stringify(selectedSlot));
    router.push("/client-journal");
  };

  const calendarDays = getCalendarDays();
  const selectedDateSlots = selectedDate ? getSlotsForDate(selectedDate) : [];

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: "#F0F7F2" }}
    >
      {/* Progress */}
      <div
        className="sticky top-0 z-40 bg-white"
        style={{ borderBottom: "1px solid rgba(10,31,20,0.08)" }}
      >
        <BookingProgress currentStep={2} />
      </div>

      <div className="max-w-5xl mx-auto px-6 py-12">

        {/* Header */}
        <div className="mb-10">
          <span
            className="text-xs font-semibold tracking-widest uppercase mb-2 block"
            style={{ color: "#9A7A2E" }}
          >
            Step 2 of 4
          </span>
          <h1
            className="font-light mb-2"
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "clamp(2rem, 4vw, 3rem)",
              color: "#0A1F14",
            }}
          >
            Choose Your{" "}
            <strong
              className="font-semibold"
              style={{
                background: "linear-gradient(135deg, #C9A84C, #9A7A2E)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Date & Time
            </strong>
          </h1>
          <p className="text-sm" style={{ color: "rgba(10,31,20,0.55)" }}>
            Select an available date then choose your preferred time slot.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* ── LEFT — Calendar ── */}
          <div
            className="rounded-3xl overflow-hidden"
            style={{
              backgroundColor: "white",
              border: "1px solid rgba(201,168,76,0.2)",
              boxShadow: "0 4px 24px rgba(10,31,20,0.06)",
            }}
          >
            {/* Calendar header */}
            <div
              className="flex items-center justify-between px-6 py-5"
              style={{
                background: "linear-gradient(135deg, #0A1F14, #1A3D2B)",
              }}
            >
              <button
                onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))}
                className="p-2 rounded-xl transition-all hover:scale-110"
                style={{ backgroundColor: "rgba(201,168,76,0.15)" }}
              >
                <ChevronLeft size={18} style={{ color: "#C9A84C" }} />
              </button>

              <p
                className="font-semibold text-white"
                style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "20px" }}
              >
                {MONTHS[currentDate.getMonth()]} {currentDate.getFullYear()}
              </p>

              <button
                onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))}
                className="p-2 rounded-xl transition-all hover:scale-110"
                style={{ backgroundColor: "rgba(201,168,76,0.15)" }}
              >
                <ChevronRight size={18} style={{ color: "#C9A84C" }} />
              </button>
            </div>

            {/* Day labels */}
            <div className="grid grid-cols-7 px-4 pt-4">
              {DAYS.map(day => (
                <div
                  key={day}
                  className="text-center text-xs font-semibold uppercase tracking-wider py-2"
                  style={{ color: "rgba(10,31,20,0.55)" }}
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar grid */}
            <div className="grid grid-cols-7 gap-1 p-4">
              {calendarDays.map((date, i) => {
                if (!date) return <div key={`empty-${i}`} />;

                const dateStr = formatDate(date);
                const isPast = isPastDate(dateStr);
                const hasSlots = hasAvailableSlots(dateStr);
                const isSelected = selectedDate === dateStr;
                const isToday = dateStr === today;

                return (
                  <button
                    key={dateStr}
                    onClick={() => {
                      if (!isPast && hasSlots) {
                        setSelectedDate(dateStr);
                        setSelectedSlot(null);
                      }
                    }}
                    disabled={isPast || !hasSlots}
                    className="relative aspect-square rounded-xl flex flex-col items-center justify-center transition-all duration-200"
                    style={{
                        backgroundColor: isSelected
                        ? "#0A1F14"
                        : isToday && !isSelected
                        ? "rgba(201,168,76,0.1)"
                        : "transparent",
                      border: isSelected
                        ? "2px solid #C9A84C"
                        : isToday
                        ? "1.5px solid rgba(201,168,76,0.4)"
                        : "1px solid transparent",
                      opacity: isPast ? 0.3 : 1,
                      cursor: isPast || !hasSlots ? "not-allowed" : "pointer",
                    }}
                  >
                    <span
                      className="text-sm font-medium"
                      style={{
                        color: isSelected
                          ? "white"
                          : isPast
                          ? "rgba(10,31,20,0.70)"
                          : !hasSlots
                          ? "rgba(10,31,20,0.6)"
                          : "#0A1F14",

                      }}
                    >
                      {date.getDate()}
                    </span>

                    {/* Available dot */}
                    {hasSlots && !isPast && (
                      <div
                        className="absolute bottom-1 w-2 h-2 rounded-full"
                        style={{
                          backgroundColor: isSelected ? "#C9A84C" : "black",
                          opacity: 1,
                        }}
                      />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Legend */}
            <div
              className="flex items-center gap-6 px-6 py-4"
              style={{ borderTop: "1px solid rgba(10,31,20,0.06)" }}
            >
              <div className="flex items-center gap-2">
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: "#C9A84C" }}
                />
                <span className="text-xs" style={{ color: "rgba(10,31,20,0.7)" }}>
                  Available
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: "rgba(10,31,20,0.25)" }}
                />
                <span className="text-xs" style={{ color: "rgba(10,31,20,0.7)" }}>
                  Unavailable
                </span>
              </div>
            </div>
          </div>

          {/* ── RIGHT — Time slots ── */}
          <div className="flex flex-col gap-4">

            {/* No date selected */}
            {!selectedDate && (
              <div
                className="rounded-3xl flex flex-col items-center justify-center py-20 gap-4"
                style={{
                  backgroundColor: "white",
                  border: "1px dashed rgba(201,168,76,0.3)",
                }}
              >
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center"
                  style={{ backgroundColor: "rgba(201,168,76,0.1)" }}
                >
                  <Clock size={28} style={{ color: "#C9A84C" }} />
                </div>
                <p
                  className="text-sm font-medium"
                  style={{ color: "rgba(10,31,20,0.5)" }}
                >
                  Select a date to see available slots
                </p>
              </div>
            )}

            {/* Date selected — show slots */}
            {selectedDate && (
              <div
                className="rounded-3xl overflow-hidden"
                style={{
                  backgroundColor: "white",
                  border: "1px solid rgba(201,168,76,0.2)",
                  boxShadow: "0 4px 24px rgba(10,31,20,0.06)",
                }}
              >
                {/* Slots header */}
                <div
                  className="px-6 py-5"
                  style={{
                    background: "linear-gradient(135deg, #0A1F14, #1A3D2B)",
                  }}
                >
                  <p
                    className="font-semibold text-white"
                    style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "18px" }}
                  >
                    {new Date(selectedDate + "T00:00:00").toLocaleDateString("en-SE", {
                      weekday: "long",
                      day: "numeric",
                      month: "long",
                    })}
                  </p>
                  <p className="text-xs mt-1" style={{ color: "rgba(201,168,76,0.7)" }}>
                    {selectedDateSlots.length} slot{selectedDateSlots.length !== 1 ? "s" : ""} available
                  </p>
                </div>

                {/* Slots grid */}
                <div className="p-6">
                  {isLoading ? (
                    <div className="flex justify-center py-8">
                      <div
                        className="w-8 h-8 rounded-full border-2 animate-spin"
                        style={{ borderColor: "#C9A84C", borderTopColor: "transparent" }}
                      />
                    </div>
                  ) : selectedDateSlots.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-sm" style={{ color: "rgba(10,31,20,0.4)" }}>
                        No available slots for this date
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-3 gap-3">
                      {selectedDateSlots.map(slot => {
                        const isSelected = selectedSlot?._id === slot._id;
                        return (
                          <button
                            key={slot._id}
                            onClick={() => setSelectedSlot(slot)}
                            className="flex flex-col items-center py-3 px-2 rounded-2xl transition-all duration-200 hover:-translate-y-0.5"
                            style={{
                              backgroundColor: isSelected
                                ? "rgba(201,168,76,0.12)"
                                : "rgba(10,31,20,0.03)",
                              border: isSelected
                                ? "1.5px solid #C9A84C"
                                : "1px solid rgba(10,31,20,0.1)",
                              boxShadow: isSelected
                                ? "0 4px 16px rgba(201,168,76,0.2)"
                                : "none",
                            }}
                          >
                            <Clock
                              size={14}
                              style={{ color: isSelected ? "#C9A84C" : "rgba(10,31,20,0.4)" }}
                              className="mb-1"
                            />
                            <span
                              className="text-sm font-semibold"
                              style={{ color: isSelected ? "#9A7A2E" : "#0A1F14" }}
                            >
                              {slot.startTime}
                            </span>
                            <span
                              className="text-xs"
                              style={{ color: "rgba(10,31,20,0.4)" }}
                            >
                              {slot.endTime}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Selected summary + Continue */}
            {selectedDate && selectedSlot && (
              <div
                className="rounded-3xl p-6"
                style={{
                  background: "linear-gradient(135deg, #0A1F14, #1A3D2B)",
                  border: "1px solid rgba(201,168,76,0.25)",
                }}
              >
                {/* Gold top line */}
                <div
                  className="h-[2px] w-full rounded-full mb-5"
                  style={{
                    background: "linear-gradient(90deg, transparent, #C9A84C, transparent)",
                  }}
                />

                <p
                  className="text-xs font-semibold uppercase tracking-widest mb-3"
                  style={{ color: "#C9A84C" }}
                >
                  Your Selection
                </p>

                <div className="flex items-center gap-4 mb-6">
                  <div>
                    <p className="text-white font-semibold text-sm">
                      {new Date(selectedDate + "T00:00:00").toLocaleDateString("en-SE", {
                        weekday: "long",
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                    <p style={{ color: "#C9A84C" }} className="text-sm font-medium mt-0.5">
                      {selectedSlot.startTime} — {selectedSlot.endTime}
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleContinue}
                  className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl font-semibold text-sm transition-all hover:-translate-y-0.5"
                  style={{
                    background: "linear-gradient(135deg, #C9A84C, #9A7A2E)",
                    color: "#0A1F14",
                    boxShadow: "0 4px 20px rgba(201,168,76,0.35)",
                  }}
                >
                  Continue to Medical Form
                  <ArrowRight size={16} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}