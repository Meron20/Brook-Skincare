"use client";

import { useCallback, useEffect, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Trash2,
  X,
  Loader2,
  Clock,
  CheckSquare,
  Square,
  CalendarDays,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { bg, text, border, palette, gradient } from "@/lib/theme";
import {
  PageError,
  EmptyState,
  TableSkeleton,
} from "@/components/admin/StateComponents";

type TimeSlot = {
  _id: string;
  date: string;
  startTime: string;
  endTime: string;
  isBooked: boolean;
  isAvailable: boolean;
};

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

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

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
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate()
  ).padStart(2, "0")}`;

export default function TimeSlotsPage() {
  const [weekOffset, setWeekOffset] = useState(0);
  const [weekDates, setWeekDates] = useState<Date[]>([]);
  const [slots, setSlots] = useState<TimeSlot[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedPredefined, setSelectedPredefined] = useState<string[]>([]);
  const [customSlots, setCustomSlots] = useState<
    { startTime: string; endTime: string }[]
  >([]);

  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  useEffect(() => {
    setWeekDates(getWeekDates(weekOffset));
  }, [weekOffset]);

  const fetchSlots = useCallback(async () => {
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("/api/timeslots");
      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Failed to load time slots.");
        return;
      }

      setSlots(data.slots || []);
    } catch {
      setError("Failed to load time slots.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSlots();
  }, [fetchSlots]);

  const getSlotsForDate = (date: string) =>
    slots
      .filter((slot) => slot.date === date)
      .sort((a, b) => a.startTime.localeCompare(b.startTime));

  const openModal = (date: string) => {
    setSelectedDate(date);
    setSelectedPredefined([]);
    setCustomSlots([]);
    setError("");
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedDate("");
    setSelectedPredefined([]);
    setCustomSlots([]);
    setError("");
  };

  const togglePredefined = (key: string) => {
    setSelectedPredefined((prev) =>
      prev.includes(key) ? prev.filter((item) => item !== key) : [...prev, key]
    );
  };

  const addCustomSlot = () => {
    setCustomSlots((prev) => [...prev, { startTime: "", endTime: "" }]);
  };

  const updateCustomSlot = (
    index: number,
    field: "startTime" | "endTime",
    value: string
  ) => {
    setCustomSlots((prev) =>
      prev.map((slot, i) => (i === index ? { ...slot, [field]: value } : slot))
    );
  };

  const removeCustomSlot = (index: number) => {
    setCustomSlots((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    const predefinedToSave = PREDEFINED_SLOTS.filter((slot) =>
      selectedPredefined.includes(`${slot.startTime}-${slot.endTime}`)
    );

    const validCustom = customSlots.filter(
      (slot) => slot.startTime && slot.endTime
    );

    const allSlots = [...predefinedToSave, ...validCustom];

    if (allSlots.length === 0) {
      setError("Please select or add at least one time slot.");
      return;
    }

    setIsSaving(true);
    setError("");

    try {
      const res = await fetch("/api/timeslots", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date: selectedDate, slots: allSlots }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Something went wrong.");
        return;
      }

      await fetchSlots();
      closeModal();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/timeslots/${id}`, { method: "DELETE" });

      if (!res.ok) {
        setError("Failed to delete time slot.");
        return;
      }

      await fetchSlots();
      setDeleteConfirm(null);
    } catch {
      setError("Failed to delete time slot.");
    }
  };

  const today = formatDate(new Date());
  const selectedCount =
    selectedPredefined.length +
    customSlots.filter((slot) => slot.startTime && slot.endTime).length;

  return (
    <div className="space-y-6">
      {/* WEEK NAVIGATION */}
      <div
        className="flex items-center justify-between px-6 py-4 rounded-2xl"
        style={{
          background: gradient.sidebar,
          border: `1px solid ${border.subtle}`,
        }}
      >
        <button
          onClick={() => setWeekOffset((week) => week - 1)}
          className="p-2 rounded-xl transition-all hover:scale-110"
          style={{ backgroundColor: `${palette.gold}26` }}
        >
          <ChevronLeft size={20} style={{ color: palette.gold }} />
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

          <p className="text-xs mt-0.5" style={{ color: palette.gold }}>
            {weekOffset === 0
              ? "Current week"
              : weekOffset > 0
              ? `+${weekOffset} week${weekOffset > 1 ? "s" : ""}`
              : `${weekOffset} week${weekOffset < -1 ? "s" : ""}`}
          </p>
        </div>

        <button
          onClick={() => setWeekOffset((week) => week + 1)}
          className="p-2 rounded-xl transition-all hover:scale-110"
          style={{ backgroundColor: `${palette.gold}26` }}
        >
          <ChevronRight size={20} style={{ color: palette.gold }} />
        </button>
      </div>

      {/* STATES */}
      {isLoading && <TableSkeleton rows={7} />}

      {!isLoading && error && <PageError message={error} onRetry={fetchSlots} />}

      {!isLoading && !error && slots.length === 0 && (
        <EmptyState
          icon={<CalendarDays size={24} style={{ color: palette.gold }} />}
          title="No time slots yet"
          description="Add available slots so customers can book appointments"
        />
      )}

      {/* WEEK GRID */}
      {!isLoading && !error && (
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
                  backgroundColor: bg.card,
                  border: isToday
                    ? `1.5px solid ${palette.gold}`
                    : `1px solid ${border.subtle}`,
                  opacity: isPast ? 0.6 : 1,
                }}
              >
                <div
                  className="px-3 py-3 text-center"
                  style={{
                    background: isToday ? gradient.gold : gradient.sidebar,
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

                <div
                  className="flex-1 p-2 space-y-1.5 min-h-[120px]"
                  style={{ backgroundColor: bg.card }}
                >
                  {daySlots.length === 0 ? (
                    <p className="text-xs text-center pt-3" style={{ color: text.muted }}>
                      No slots
                    </p>
                  ) : (
                    daySlots.map((slot) => (
                      <div
                        key={slot._id}
                        className="flex items-center justify-between px-2 py-1.5 rounded-lg group"
                        style={{
                          backgroundColor: slot.isBooked
                            ? "rgba(239,68,68,0.08)"
                            : "rgba(52,211,153,0.08)",
                          border: `1px solid ${
                            slot.isBooked
                              ? "rgba(239,68,68,0.2)"
                              : "rgba(52,211,153,0.2)"
                          }`,
                        }}
                      >
                        <div className="flex items-center gap-1">
                          <Clock size={10} style={{ color: text.primary }} />
                          <span
                            className="text-xs font-medium"
                            style={{ color: text.primary }}
                          >
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

                {!isPast && (
                  <button
                    onClick={() => openModal(dateStr)}
                    className="w-full py-2 text-xs font-medium flex items-center justify-center gap-1 transition-all hover:opacity-80"
                    style={{
                      backgroundColor: `${palette.gold}14`,
                      color: palette.gold,
                      borderTop: `1px solid ${border.gold}`,
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

      {/* ADD SLOTS MODAL */}
      {modalOpen && (
        <ModalWrapper>
          <div
            className="w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl max-h-[90vh] flex flex-col"
            style={{ backgroundColor: bg.card }}
          >
            <div
              className="flex items-center justify-between px-6 py-5 flex-shrink-0"
              style={{ background: gradient.gold, color: bg.page }}
            >
              <div>
                <h2 className="font-semibold text-lg">Add Time Slots</h2>
                <p className="text-xs mt-0.5" style={{ color: text.primary }}>
                  {selectedDate}
                </p>
              </div>

              <button
                onClick={closeModal}
                className="text-white/70 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="overflow-y-auto flex-1 px-6 py-5 space-y-5">
              {error && <PageError message={error} />}

              <div>
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-semibold" style={{ color: text.primary }}>
                    Predefined Slots
                  </p>

                  <button
                    onClick={() => {
                      const allKeys = PREDEFINED_SLOTS.map(
                        (slot) => `${slot.startTime}-${slot.endTime}`
                      );
                      setSelectedPredefined(
                        selectedPredefined.length === allKeys.length ? [] : allKeys
                      );
                    }}
                    className="text-xs font-medium hover:underline"
                    style={{ color: palette.gold }}
                  >
                    {selectedPredefined.length === PREDEFINED_SLOTS.length
                      ? "Deselect all"
                      : "Select all"}
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {PREDEFINED_SLOTS.map((slot) => {
                    const key = `${slot.startTime}-${slot.endTime}`;
                    const isSelected = selectedPredefined.includes(key);

                    return (
                      <button
                        key={key}
                        onClick={() => togglePredefined(key)}
                        className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-medium transition-all duration-200"
                        style={{
                          backgroundColor: isSelected
                            ? `${palette.gold}1f`
                            : bg.hover,
                          border: `1px solid ${
                            isSelected ? palette.gold : border.subtle
                          }`,
                          color: isSelected ? palette.gold : text.muted,
                        }}
                      >
                        {isSelected ? (
                          <CheckSquare size={13} style={{ color: palette.gold }} />
                        ) : (
                          <Square size={13} style={{ color: text.muted }} />
                        )}
                        {slot.startTime}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex-1 h-px" style={{ backgroundColor: border.subtle }} />
                <span className="text-xs" style={{ color: text.muted }}>
                  or add custom
                </span>
                <div className="flex-1 h-px" style={{ backgroundColor: border.subtle }} />
              </div>

              <div className="space-y-3">
                {customSlots.map((slot, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="flex-1 grid grid-cols-2 gap-2">
                      <TimeInput
                        label="Start"
                        value={slot.startTime}
                        onChange={(value) =>
                          updateCustomSlot(i, "startTime", value)
                        }
                      />

                      <TimeInput
                        label="End"
                        value={slot.endTime}
                        onChange={(value) =>
                          updateCustomSlot(i, "endTime", value)
                        }
                      />
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
                    backgroundColor: bg.hover,
                    border: `1px dashed ${border.subtle}`,
                    color: text.muted,
                  }}
                >
                  <Plus size={14} />
                  Add custom slot
                </button>
              </div>

              {selectedCount > 0 && (
                <div
                  className="px-4 py-3 rounded-xl text-sm"
                  style={{
                    backgroundColor: `${palette.gold}14`,
                    border: `1px solid ${border.gold}`,
                  }}
                >
                  <span style={{ color: palette.gold }} className="font-medium">
                    {selectedCount} slot{selectedCount !== 1 ? "s" : ""} selected
                  </span>
                </div>
              )}
            </div>

            <div
              className="px-6 pb-6 pt-3 flex gap-3 flex-shrink-0 border-t"
              style={{ borderColor: border.subtle }}
            >
              <Button
                onClick={closeModal}
                className="flex-1 py-3 rounded-xl text-sm"
                style={{ backgroundColor: bg.hover, color: text.primary }}
              >
                Cancel
              </Button>

              <Button
                onClick={handleSave}
                disabled={isSaving}
                className="flex-1 py-3 rounded-xl text-sm font-semibold"
                style={{ background: gradient.gold, color: bg.page }}
              >
                {isSaving ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 size={16} className="animate-spin" />
                    Saving...
                  </span>
                ) : (
                  "Save Slots"
                )}
              </Button>
            </div>
          </div>
        </ModalWrapper>
      )}

      {/* DELETE CONFIRM */}
      {deleteConfirm && (
        <ModalWrapper>
          <div
            className="w-full max-w-sm rounded-2xl overflow-hidden shadow-2xl"
            style={{ backgroundColor: bg.card }}
          >
            <div className="px-6 py-6 text-center">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{ backgroundColor: "rgba(239,68,68,0.1)" }}
              >
                <Trash2 size={22} className="text-red-500" />
              </div>

              <h3
                className="text-lg font-semibold mb-2"
                style={{ color: text.primary }}
              >
                Delete this slot?
              </h3>

              <p className="text-sm" style={{ color: text.muted }}>
                This action cannot be undone.
              </p>
            </div>

            <div className="px-6 pb-6 flex gap-3">
              <Button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 py-3 rounded-xl text-sm"
                style={{ backgroundColor: bg.hover, color: text.primary }}
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
        </ModalWrapper>
      )}
    </div>
  );
}

function ModalWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{
        backgroundColor: "rgba(0,0,0,0.5)",
        backdropFilter: "blur(4px)",
      }}
    >
      {children}
    </div>
  );
}

function TimeInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs" style={{ color: text.muted }}>
        {label}
      </label>

      <input
        type="time"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 rounded-xl text-sm outline-none"
        style={{
          border: `1px solid ${border.subtle}`,
          backgroundColor: bg.card,
          color: text.primary,
        }}
      />
    </div>
  );
}