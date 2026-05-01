"use client";

import { useState, useEffect } from "react";
import {
  ChevronLeft, ChevronRight, Plus, Trash2,
  X, Loader2, Clock, CheckSquare, Square
} from "lucide-react";
import { Button } from "@/components/ui/button";

type TimeSlot = {
  _id: string;
  date: string;
  startTime: string;
  endTime: string;
  isBooked: boolean;
  isAvailable: boolean;
};

// Predefined slots every 30 minutes from 08:00 to 18:00
const PREDEFINED_SLOTS = Array.from({ length: 20 }, (_, i) => {
  const totalMinutes = 8 * 60 + i * 30;
  const hours = Math.floor(totalMinutes / 60).toString().padStart(2, "0");
  const mins = (totalMinutes % 60).toString().padStart(2, "0");
  const endTotal = totalMinutes + 30;
  const eHours = Math.floor(endTotal / 60).toString().padStart(2, "0");
  const eMins = (endTotal % 60).toString().padStart(2, "0");
  return { startTime: `${hours}:${mins}`, endTime: `${eHours}:${eMins}` };
});

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const MONTHS = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"];

const getWeekDates = (offset: number) => {
  const now = new Date();
  const day = now.getDay();
  const monday = new Date(now);
  monday.setDate(now.getDate() - (day === 0 ? 6 : day - 1) + offset * 7);
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d;
  });
};

const formatDate = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

export default function TimeSlotsPage() {
  const [weekOffset, setWeekOffset] = useState(0);
  const [weekDates, setWeekDates] = useState<Date[]>([]);
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedPredefined, setSelectedPredefined] = useState<string[]>([]);
  const [customSlots, setCustomSlots] = useState<{ startTime: string; endTime: string }[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  useEffect(() => {
    setWeekDates(getWeekDates(weekOffset));
  }, [weekOffset]);

  const fetchSlots = async () => {
    try {
      const res = await fetch("/api/admin/timeslots");
      const data = await res.json();
      setSlots(data.slots || []);
    } catch {
      setError("Failed to load time slots");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchSlots(); }, []);

  const getSlotsForDate = (date: string) =>
    slots.filter(s => s.date === date).sort((a, b) => a.startTime.localeCompare(b.startTime));

  const openModal = (date: string) => {
    setSelectedDate(date);
    setSelectedPredefined([]);
    setCustomSlots([]);
    setError("");
    setModalOpen(true);
  };

  const togglePredefined = (key: string) => {
    setSelectedPredefined(prev =>
      prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]
    );
  };

  const addCustomSlot = () => {
    setCustomSlots(prev => [...prev, { startTime: "", endTime: "" }]);
  };

  const updateCustomSlot = (i: number, field: "startTime" | "endTime", value: string) => {
    setCustomSlots(prev => prev.map((s, idx) => idx === i ? { ...s, [field]: value } : s));
  };

  const removeCustomSlot = (i: number) => {
    setCustomSlots(prev => prev.filter((_, idx) => idx !== i));
  };

  const handleSave = async () => {
    const predefinedToSave = PREDEFINED_SLOTS.filter(s =>
      selectedPredefined.includes(`${s.startTime}-${s.endTime}`)
    );
    const validCustom = customSlots.filter(s => s.startTime && s.endTime);
    const allSlots = [...predefinedToSave, ...validCustom];

    if (allSlots.length === 0) {
      setError("Please select or add at least one time slot");
      return;
    }

    setIsSaving(true);
    setError("");

    try {
      const res = await fetch("/api/admin/timeslots", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date: selectedDate, slots: allSlots }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.message || "Something went wrong");
        return;
      }

      await fetchSlots();
      setModalOpen(false);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await fetch(`/api/admin/timeslots/${id}`, { method: "DELETE" });
      await fetchSlots();
      setDeleteConfirm(null);
    } catch {
      setError("Failed to delete time slot");
    }
  };

  const today = formatDate(new Date());

  return (
    <div className="space-y-6">

      {/* ── WEEK NAVIGATION ── */}
      <div
        className="flex items-center justify-between px-6 py-4 rounded-2xl"
        style={{ background: "linear-gradient(135deg, #1E1548, #2a1f5e)" }}
      >
        <button
          onClick={() => setWeekOffset(w => w - 1)}
          className="p-2 rounded-xl transition-all hover:scale-110"
          style={{ backgroundColor: "rgba(201,169,110,0.15)" }}
        >
          <ChevronLeft size={20} style={{ color: "#C9A96E" }} />
        </button>

        <div className="text-center">
          <p className="text-white font-semibold text-lg">
            {weekDates.length > 0 && (
              <>
                {weekDates[0].getDate()} {MONTHS[weekDates[0].getMonth()]} —{" "}
                {weekDates[6].getDate()} {MONTHS[weekDates[6].getMonth()]}{" "}
                {weekDates[0].getFullYear()}
              </>
            )}
          </p>
          <p className="text-xs mt-0.5" style={{ color: "#C9A96E" }}>
            {weekOffset === 0 ? "Current week" : weekOffset > 0 ? `+${weekOffset} week${weekOffset > 1 ? "s" : ""}` : `${weekOffset} week${weekOffset < -1 ? "s" : ""}`}
          </p>
        </div>

        <button
          onClick={() => setWeekOffset(w => w + 1)}
          className="p-2 rounded-xl transition-all hover:scale-110"
          style={{ backgroundColor: "rgba(201,169,110,0.15)" }}
        >
          <ChevronRight size={20} style={{ color: "#C9A96E" }} />
        </button>
      </div>

      {/* ── WEEKLY GRID ── */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 size={32} className="animate-spin" style={{ color: "#C9A96E" }} />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-3">
          {weekDates.map((date, i) => {
            const dateStr = formatDate(date);
            const daySlots = getSlotsForDate(dateStr);
            const isToday = dateStr === today;
            const isPast = dateStr < today;

            return (
              <div
                key={dateStr}
                className="rounded-2xl overflow-hidden flex flex-col"
                style={{
                  border: isToday
                    ? "1.5px solid #C9A96E"
                    : "1px solid rgba(30,21,72,0.1)",
                  opacity: isPast ? 0.6 : 1,
                }}
              >
                {/* Day header */}
                <div
                  className="px-3 py-3 text-center"
                  style={{
                    background: isToday
                      ? "linear-gradient(135deg, #C9A96E, #1E1548)"
                      : "linear-gradient(135deg, #1E1548, #2a1f5e)",
                  }}
                >
                  <p className="text-xs font-semibold text-white/70 uppercase tracking-wider">
                    {DAYS[i]}
                  </p>
                  <p className="text-xl font-bold text-white mt-0.5">
                    {date.getDate()}
                  </p>
                  {isToday && (
                    <span className="text-xs text-white/80">Today</span>
                  )}
                </div>

                {/* Slots */}
                <div className="flex-1 p-2 space-y-1.5 bg-white min-h-[120px]">
                  {daySlots.length === 0 ? (
                    <p className="text-xs text-gray-300 text-center pt-3">No slots</p>
                  ) : (
                    daySlots.map(slot => (
                      <div
                        key={slot._id}
                        className="flex items-center justify-between px-2 py-1.5 rounded-lg group"
                        style={{
                          backgroundColor: slot.isBooked
                            ? "rgba(239,68,68,0.08)"
                            : "rgba(52,211,153,0.08)",
                          border: `1px solid ${slot.isBooked ? "rgba(239,68,68,0.2)" : "rgba(52,211,153,0.2)"}`,
                        }}
                      >
                        <div className="flex items-center gap-1">
                          <Clock size={10} style={{ color: "#1E1548" }} />
                          <span className="text-xs font-medium" style={{ color: "#1E1548"}}>
                            {slot.startTime}
                          </span>
                        </div>
                        {!slot.isBooked && (
                          <button
                            onClick={() => setDeleteConfirm(slot._id)}
                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Trash2 size={10} className="text-red-400" />
                          </button>
                        )}
                      </div>
                    ))
                  )}
                </div>

                {/* Add button */}
                {!isPast && (
                  <button
                    onClick={() => openModal(dateStr)}
                    className="w-full py-2 text-xs font-medium flex items-center justify-center gap-1 transition-all hover:opacity-80"
                    style={{
                      backgroundColor: "rgba(201,169,110,0.08)",
                      color: "#C9A96E",
                      borderTop: "1px solid rgba(201,169,110,0.15)",
                    }}
                  >
                    <Plus size={12} />
                    Add slots
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* ── ADD SLOTS MODAL ── */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" }}
        >
          <div className="w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl bg-white max-h-[90vh] flex flex-col">

            {/* Modal header */}
            <div
              className="flex items-center justify-between px-6 py-5 flex-shrink-0"
              style={{ background: "linear-gradient(135deg, #C9A96E, #1E1548)", color: "white" }}
            >
              <div>
                <h2 className="text-white font-semibold text-lg">Add Time Slots</h2>
                <p className="text-xs mt-0.5" style={{ color: "#1E1548" }}>{selectedDate}</p>
              </div>
              <button onClick={() => setModalOpen(false)} className="text-white/70 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>

            {/* Modal body */}
            <div className="overflow-y-auto flex-1 px-6 py-5 space-y-5">
              {error && (
                <div
                  className="px-4 py-3 rounded-xl text-sm text-red-600"
                  style={{ backgroundColor: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)" }}
                >
                  {error}
                </div>
              )}

              {/* Predefined slots */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-semibold text-[#1E1548]">Predefined Slots</p>
                  <button
                    onClick={() => {
                      const allKeys = PREDEFINED_SLOTS.map(s => `${s.startTime}-${s.endTime}`);
                      setSelectedPredefined(
                        selectedPredefined.length === allKeys.length ? [] : allKeys
                      );
                    }}
                    className="text-xs font-medium hover:underline"
                    style={{ color: "#C9A96E" }}
                  >
                    {selectedPredefined.length === PREDEFINED_SLOTS.length ? "Deselect all" : "Select all"}
                  </button>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {PREDEFINED_SLOTS.map(slot => {
                    const key = `${slot.startTime}-${slot.endTime}`;
                    const isSelected = selectedPredefined.includes(key);
                    return (
                      <button
                        key={key}
                        onClick={() => togglePredefined(key)}
                        className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-medium transition-all duration-200"
                        style={{
                          backgroundColor: isSelected ? "rgba(201,169,110,0.12)" : "rgba(30,21,72,0.04)",
                          border: `1px solid ${isSelected ? "#C9A96E" : "rgba(30,21,72,0.1)"}`,
                          color: isSelected ? "#C9A96E" : "#6b7280",
                        }}
                      >
                        {isSelected
                          ? <CheckSquare size={13} style={{ color: "#C9A96E" }} />
                          : <Square size={13} className="text-gray-300" />
                        }
                        {slot.startTime}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Divider */}
              <div className="flex items-center gap-3">
                <div className="flex-1 h-px" style={{ backgroundColor: "rgba(30,21,72,0.08)" }} />
                <span className="text-xs text-gray-400">or add custom</span>
                <div className="flex-1 h-px" style={{ backgroundColor: "rgba(30,21,72,0.08)" }} />
              </div>

              {/* Custom slots */}
              <div className="space-y-3">
                {customSlots.map((slot, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="flex-1 grid grid-cols-2 gap-2">
                      <div className="flex flex-col gap-1">
                        <label className="text-xs text-gray-400">Start</label>
                        <input
                          type="time"
                          value={slot.startTime}
                          onChange={e => updateCustomSlot(i, "startTime", e.target.value)}
                          className="w-full px-3 py-2 rounded-xl text-sm outline-none"
                          style={{ border: "1px solid rgba(30,21,72,0.15)", backgroundColor: "#fafafa" }}
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-xs text-gray-400">End</label>
                        <input
                          type="time"
                          value={slot.endTime}
                          onChange={e => updateCustomSlot(i, "endTime", e.target.value)}
                          className="w-full px-3 py-2 rounded-xl text-sm outline-none"
                          style={{ border: "1px solid rgba(30,21,72,0.15)", backgroundColor: "#fafafa" }}
                        />
                      </div>
                    </div>
                    <button
                      onClick={() => removeCustomSlot(i)}
                      className="p-2 rounded-xl mt-4"
                      style={{ backgroundColor: "rgba(239,68,68,0.08)" }}
                    >
                      <X size={14} className="text-red-400" />
                    </button>
                  </div>
                ))}

                <button
                  onClick={addCustomSlot}
                  className="w-full py-2.5 rounded-xl text-sm font-medium flex items-center justify-center gap-2 transition-all hover:opacity-80"
                  style={{
                    backgroundColor: "rgba(30,21,72,0.04)",
                    border: "1px dashed rgba(30,21,72,0.2)",
                    color: "#6b7280",
                  }}
                >
                  <Plus size={14} />
                  Add custom slot
                </button>
              </div>

              {/* Summary */}
              {(selectedPredefined.length > 0 || customSlots.filter(s => s.startTime && s.endTime).length > 0) && (
                <div
                  className="px-4 py-3 rounded-xl text-sm"
                  style={{ backgroundColor: "rgba(201,169,110,0.08)", border: "1px solid rgba(201,169,110,0.2)" }}
                >
                  <span style={{ color: "#C9A96E" }} className="font-medium">
                    {selectedPredefined.length + customSlots.filter(s => s.startTime && s.endTime).length} slot{selectedPredefined.length + customSlots.filter(s => s.startTime && s.endTime).length !== 1 ? "s" : ""} selected
                  </span>
                </div>
              )}
            </div>

            {/* Modal footer */}
            <div className="px-6 pb-6 pt-3 flex gap-3 flex-shrink-0 border-t" style={{ borderColor: "rgba(30,21,72,0.08)" }}>
              <Button
                onClick={() => setModalOpen(false)}
                className="flex-1 py-3 rounded-xl text-sm"
                style={{ backgroundColor: "rgba(30,21,72,0.05)", color: "#1E1548" }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                disabled={isSaving}
                className="flex-1 py-3 rounded-xl text-sm font-semibold"
                style={{ background: "linear-gradient(135deg, #C9A96E, #1E1548)", color: "white" }}
              >
                {isSaving ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 size={16} className="animate-spin" />
                    Saving...
                  </span>
                ) : "Save Slots"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ── DELETE CONFIRM ── */}
      {deleteConfirm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" }}
        >
          <div className="w-full max-w-sm rounded-2xl bg-white overflow-hidden shadow-2xl">
            <div className="px-6 py-6 text-center">
              <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{ backgroundColor: "rgba(239,68,68,0.1)" }}>
                <Trash2 size={22} className="text-red-500" />
              </div>
              <h3 className="text-lg font-semibold text-[#1E1548] mb-2">Delete this slot?</h3>
              <p className="text-gray-400 text-sm">This action cannot be undone.</p>
            </div>
            <div className="px-6 pb-6 flex gap-3">
              <Button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 py-3 rounded-xl text-sm"
                style={{ backgroundColor: "rgba(30,21,72,0.05)", color: "#1E1548" }}
              >
                Cancel
              </Button>
              <Button
                onClick={() => handleDelete(deleteConfirm)}
                className="flex-1 py-3 rounded-xl text-sm font-semibold bg-red-500 hover:bg-red-600 text-white"
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}