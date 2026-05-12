"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  Mail,
  Phone,
  User,
  Calendar,
  FileText,
  Clock,
  Plus,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { bg, text, border, palette, gradient } from "@/lib/theme";
import {
  PageError,
  EmptyState,
  TableSkeleton,
} from "@/components/admin/StateComponents";

type Customer = {
  _id: string;
  fullName?: string;
  email: string;
  phone?: string;
  skinConcern?: string;
  createdAt?: string;
};

type JournalNote = {
  _id: string;
  title: string;
  content: string;
  createdAt: string;
  createdBy?: string;
};

type Booking = {
  _id: string;
  treatment: string;
  date: string;
  time: string;
  status: string;
  createdAt?: string;
};

type ActivityLog = {
  _id: string;
  type: string;
  description: string;
  createdAt: string;
  createdBy?: string;
};

export default function CustomerCardPage() {
  const params = useParams();
  const customerId = params.id as string;

  const [customer, setCustomer] = useState<Customer | null>(null);
  const [notes, setNotes] = useState<JournalNote[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);

  const [loading, setLoading] = useState(true);
  const [isSavingNote, setIsSavingNote] = useState(false);
  const [isSavingBooking, setIsSavingBooking] = useState(false);
  const [error, setError] = useState("");

  const [noteTitle, setNoteTitle] = useState("");
  const [noteContent, setNoteContent] = useState("");

  const [newTreatment, setNewTreatment] = useState("");
  const [newDate, setNewDate] = useState("");
  const [newTime, setNewTime] = useState("");

  const fetchCustomer = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const res = await fetch(`/api/customers/${customerId}`);
      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Failed to fetch customer.");
        return;
      }

      setCustomer(data.customer);
      setNotes(data.notes || []);
      setBookings(data.bookings || []);
      setActivityLogs(data.activityLogs || []);
    } catch {
      setError("Could not load customer data.");
    } finally {
      setLoading(false);
    }
  }, [customerId]);

  useEffect(() => {
    if (customerId) fetchCustomer();
  }, [customerId, fetchCustomer]);

  const handleAddNote = async () => {
    if (!noteTitle.trim() || !noteContent.trim()) {
      setError("Please enter both note title and content.");
      return;
    }

    try {
      setIsSavingNote(true);
      setError("");

      const res = await fetch("/api/journal-notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customerId, title: noteTitle, content: noteContent }),
      });

      const newNote = await res.json();

      if (!res.ok) {
        setError(newNote.message || "Failed to create journal note.");
        return;
      }

      setNotes((prev) => [newNote, ...prev]);
      setActivityLogs((prev) => [
        {
          _id: crypto.randomUUID(),
          type: "Journal Note",
          description: `Journal note added: ${newNote.title}`,
          createdAt: newNote.createdAt || new Date().toISOString(),
          createdBy: "Admin",
        },
        ...prev,
      ]);

      setNoteTitle("");
      setNoteContent("");
    } catch {
      setError("Could not save journal note.");
    } finally {
      setIsSavingNote(false);
    }
  };

  const handleCreateBooking = async () => {
    if (!newTreatment.trim() || !newDate || !newTime) {
      setError("Please fill in all booking fields.");
      return;
    }

    try {
      setIsSavingBooking(true);
      setError("");

      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerId,
          treatment: newTreatment,
          date: newDate,
          time: newTime,
        }),
      });

      const newBooking = await res.json();

      if (!res.ok) {
        setError(newBooking.message || "Failed to create booking.");
        return;
      }

      setBookings((prev) => [newBooking, ...prev]);
      setActivityLogs((prev) => [
        {
          _id: crypto.randomUUID(),
          type: "Booking",
          description: `Booking created: ${newBooking.treatment} on ${newBooking.date} at ${newBooking.time}`,
          createdAt: newBooking.createdAt || new Date().toISOString(),
          createdBy: "Admin",
        },
        ...prev,
      ]);

      setNewTreatment("");
      setNewDate("");
      setNewTime("");
    } catch {
      setError("Could not create booking.");
    } finally {
      setIsSavingBooking(false);
    }
  };

  if (loading) {
    return <TableSkeleton rows={6} />;
  }

  if (!customer) {
    return (
      <PageError
        message={error || "Customer not found."}
        onRetry={fetchCustomer}
      />
    );
  }

  return (
    <div className="space-y-6">
      <section
        className="rounded-2xl overflow-hidden"
        style={{
          backgroundColor: bg.card,
          border: `1px solid ${border.subtle}`,
        }}
      >
        <div
          className="px-6 py-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
          style={{ background: gradient.sidebar }}
        >
          <div className="flex items-center gap-4">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-bold"
              style={{ background: gradient.gold, color: bg.page }}
            >
              {(customer.fullName || customer.email).charAt(0).toUpperCase()}
            </div>

            <div>
              <p className="text-sm" style={{ color: palette.gold }}>
                Customer Card
              </p>
              <h1 className="text-2xl md:text-3xl font-bold text-white mt-1">
                {customer.fullName || "Unnamed customer"}
              </h1>
              <p className="text-white/60 text-sm mt-1">{customer.email}</p>
            </div>
          </div>
        </div>
      </section>

      {error && <PageError message={error} />}

      <section className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-1 space-y-6">
          <Panel title="Customer Information">
            <div className="space-y-4 text-sm">
              <InfoRow icon={<User className="w-4 h-4" />} label="Full name" value={customer.fullName || "Not provided"} />
              <InfoRow icon={<Mail className="w-4 h-4" />} label="Email" value={customer.email} />
              <InfoRow icon={<Phone className="w-4 h-4" />} label="Phone" value={customer.phone || "Not provided"} />
              <InfoRow icon={<FileText className="w-4 h-4" />} label="Skin concern" value={customer.skinConcern || "Not specified"} />
              <InfoRow
                icon={<Calendar className="w-4 h-4" />}
                label="Created at"
                value={
                  customer.createdAt
                    ? new Date(customer.createdAt).toLocaleDateString()
                    : "Unknown"
                }
              />
            </div>
          </Panel>

          <Panel title="Create Booking">
            <div className="flex flex-col gap-3">
              <InputField
                value={newTreatment}
                onChange={setNewTreatment}
                placeholder="Treatment"
              />

              <InputField
                type="date"
                value={newDate}
                onChange={setNewDate}
              />

              <InputField
                type="time"
                value={newTime}
                onChange={setNewTime}
              />

              <Button
                onClick={handleCreateBooking}
                disabled={isSavingBooking}
                className="rounded-xl w-full py-3 text-sm font-semibold"
                style={{ background: gradient.gold, color: bg.page }}
              >
                {isSavingBooking ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 size={16} className="animate-spin" />
                    Saving...
                  </span>
                ) : (
                  "Create Booking"
                )}
              </Button>
            </div>
          </Panel>

          <Panel title="Bookings">
            <div className="space-y-3">
              {bookings.length > 0 ? (
                bookings.map((booking, i) => (
                  <CardItem key={booking._id} index={i}>
                    <p className="font-semibold" style={{ color: text.primary }}>
                      {booking.treatment}
                    </p>
                    <p className="text-sm mt-2" style={{ color: text.muted }}>
                      {booking.date} at {booking.time}
                    </p>
                    <span
                      className="inline-block mt-3 text-xs px-3 py-1 rounded-full"
                      style={{
                        backgroundColor:
                          booking.status === "Completed"
                            ? "rgba(52,211,153,0.14)"
                            : `${palette.gold}1f`,
                        color:
                          booking.status === "Completed" ? "#059669" : text.primary,
                      }}
                    >
                      {booking.status || "Upcoming"}
                    </span>
                  </CardItem>
                ))
              ) : (
                <EmptyState
                  icon={<Calendar size={22} style={{ color: palette.gold }} />}
                  title="No bookings yet"
                  description="Bookings for this customer will appear here"
                />
              )}
            </div>
          </Panel>

          <Panel title="Add Journal Note">
            <div className="flex flex-col gap-4">
              <InputField
                value={noteTitle}
                onChange={setNoteTitle}
                placeholder="Note title"
              />

              <TextAreaField
                value={noteContent}
                onChange={setNoteContent}
                placeholder="Write journal note..."
              />

              <Button
                onClick={handleAddNote}
                disabled={isSavingNote}
                className="rounded-xl w-full py-3 text-sm font-semibold"
                style={{ background: gradient.gold, color: bg.page }}
              >
                <Plus className="w-4 h-4 mr-2" />
                {isSavingNote ? "Saving..." : "Save Note"}
              </Button>
            </div>
          </Panel>
        </div>

        <div className="xl:col-span-2 space-y-6">
          <Panel title="Journal Notes">
            <div className="space-y-4">
              {notes.length > 0 ? (
                notes.map((note, i) => (
                  <CardItem key={note._id} index={i}>
                    <div className="flex justify-between gap-4">
                      <h3 className="font-semibold" style={{ color: text.primary }}>
                        {note.title}
                      </h3>
                      <p className="text-xs" style={{ color: text.muted }}>
                        {new Date(note.createdAt).toLocaleDateString()}
                      </p>
                    </div>

                    <p className="text-sm mt-3 leading-6" style={{ color: text.secondary }}>
                      {note.content}
                    </p>

                    {note.createdBy && (
                      <p className="text-xs mt-3" style={{ color: text.muted }}>
                        Created by: {note.createdBy}
                      </p>
                    )}
                  </CardItem>
                ))
              ) : (
                <EmptyState
                  icon={<FileText size={22} style={{ color: palette.gold }} />}
                  title="No journal notes yet"
                  description="Journal notes for this customer will appear here"
                />
              )}
            </div>
          </Panel>

          <Panel title="History">
            <div className="space-y-5">
              {activityLogs.length > 0 ? (
                activityLogs.map((item) => (
                  <div key={item._id} className="flex gap-4">
                    <div
                      className="w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center"
                      style={{ background: gradient.gold, color: bg.page }}
                    >
                      <Clock className="w-4 h-4" />
                    </div>

                    <div>
                      <p className="font-semibold" style={{ color: text.primary }}>
                        {item.type}
                      </p>
                      <p className="text-xs" style={{ color: text.muted }}>
                        {new Date(item.createdAt).toLocaleDateString()}
                      </p>
                      <p className="text-sm mt-1" style={{ color: text.secondary }}>
                        {item.description}
                      </p>
                      {item.createdBy && (
                        <p className="text-xs mt-1" style={{ color: text.muted }}>
                          Created by: {item.createdBy}
                        </p>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <EmptyState
                  icon={<Clock size={22} style={{ color: palette.gold }} />}
                  title="No history yet"
                  description="Activity history will appear here"
                />
              )}
            </div>
          </Panel>
        </div>
      </section>
    </div>
  );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{ backgroundColor: bg.card, border: `1px solid ${border.subtle}` }}
    >
      <div
        className="px-6 py-4 text-sm font-semibold uppercase tracking-wider"
        style={{ background: gradient.sidebar, color: palette.gold }}
      >
        {title}
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
}

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex gap-3">
      <div
        className="w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center"
        style={{
          backgroundColor: `${palette.gold}1f`,
          color: palette.gold,
        }}
      >
        {icon}
      </div>

      <div>
        <p className="text-xs" style={{ color: text.muted }}>
          {label}
        </p>
        <p className="font-medium break-all" style={{ color: text.primary }}>
          {value}
        </p>
      </div>
    </div>
  );
}

function CardItem({
  children,
  index,
}: {
  children: React.ReactNode;
  index: number;
}) {
  return (
    <div
      className="rounded-2xl p-4"
      style={{
        border: `1px solid ${border.subtle}`,
        backgroundColor: index % 2 === 0 ? bg.card : bg.hover,
      }}
    >
      {children}
    </div>
  );
}

function InputField({
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full rounded-xl px-4 py-3 text-sm outline-none"
      style={{
        border: `1px solid ${border.subtle}`,
        backgroundColor: bg.card,
        color: text.primary,
      }}
    />
  );
}

function TextAreaField({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={5}
      className="w-full rounded-xl px-4 py-3 text-sm outline-none resize-none"
      style={{
        border: `1px solid ${border.subtle}`,
        backgroundColor: bg.card,
        color: text.primary,
      }}
    />
  );
}