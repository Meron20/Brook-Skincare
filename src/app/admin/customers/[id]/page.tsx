"use client";

import { useEffect, useState } from "react";
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

  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await fetch(`/api/customers/${customerId}`);
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "Failed to fetch customer.");
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
    };

    if (customerId) fetchCustomer();
  }, [customerId]);

  const inputStyle = {
    border: "1px solid rgba(30,21,72,0.15)",
    backgroundColor: "#fafafa",
  };

  const cardStyle = {
    border: "1px solid rgba(30,21,72,0.1)",
  };

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
        throw new Error(newNote.message || "Failed to create journal note.");
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
        body: JSON.stringify({ customerId, treatment: newTreatment, date: newDate, time: newTime }),
      });

      const newBooking = await res.json();

      if (!res.ok) {
        throw new Error(newBooking.message || "Failed to create booking.");
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
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 size={32} className="animate-spin" style={{ color: "#C9A96E" }} />
      </div>
    );
  }

  if (!customer) {
    return (
      <div
        className="px-4 py-3 rounded-xl text-sm text-red-600"
        style={{
          backgroundColor: "rgba(239,68,68,0.08)",
          border: "1px solid rgba(239,68,68,0.2)",
        }}
      >
        {error || "Customer not found."}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <section
        className="rounded-2xl overflow-hidden bg-white"
        style={cardStyle}
      >
        <div
          className="px-6 py-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
          style={{
            background: "linear-gradient(135deg, #1E1548, #2a1f5e)",
          }}
        >
          <div className="flex items-center gap-4">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center text-white text-xl font-bold"
              style={{
                background: "linear-gradient(135deg, #C9A96E, #1E1548)",
              }}
            >
              {(customer.fullName || customer.email).charAt(0).toUpperCase()}
            </div>

            <div>
              <p className="text-sm" style={{ color: "#C9A96E" }}>
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

      {error && (
        <div
          className="px-4 py-3 rounded-xl text-sm text-red-600"
          style={{
            backgroundColor: "rgba(239,68,68,0.08)",
            border: "1px solid rgba(239,68,68,0.2)",
          }}
        >
          {error}
        </div>
      )}

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
                value={customer.createdAt ? new Date(customer.createdAt).toLocaleDateString() : "Unknown"}
              />
            </div>
          </Panel>

          <Panel title="Create Booking">
            <div className="flex flex-col gap-3">
              <input
                value={newTreatment}
                onChange={(e) => setNewTreatment(e.target.value)}
                placeholder="Treatment"
                className="w-full rounded-xl px-4 py-3 text-sm outline-none"
                style={inputStyle}
              />

              <input
                type="date"
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
                className="w-full rounded-xl px-4 py-3 text-sm outline-none"
                style={inputStyle}
              />

              <input
                type="time"
                value={newTime}
                onChange={(e) => setNewTime(e.target.value)}
                className="w-full rounded-xl px-4 py-3 text-sm outline-none"
                style={inputStyle}
              />

              <Button
                onClick={handleCreateBooking}
                disabled={isSavingBooking}
                className="rounded-xl w-full py-3 text-sm font-semibold"
                style={{
                  background: "linear-gradient(135deg, #C9A96E, #1E1548)",
                  color: "white",
                }}
              >
                {isSavingBooking ? "Saving..." : "Create Booking"}
              </Button>
            </div>
          </Panel>

          <Panel title="Bookings">
            <div className="space-y-3">
              {bookings.length > 0 ? (
                bookings.map((booking, i) => (
                  <div
                    key={booking._id}
                    className="rounded-2xl p-4"
                    style={{
                      border: "1px solid rgba(30,21,72,0.08)",
                      backgroundColor: i % 2 === 0 ? "white" : "rgba(248,247,255,0.8)",
                    }}
                  >
                    <p className="font-semibold text-[#1E1548]">{booking.treatment}</p>
                    <p className="text-sm text-gray-400 mt-2">
                      {booking.date} at {booking.time}
                    </p>
                    <span
                      className="inline-block mt-3 text-xs px-3 py-1 rounded-full"
                      style={{
                        backgroundColor: "rgba(201,169,110,0.12)",
                        color: "#1E1548",
                      }}
                    >
                      {booking.status}
                    </span>
                  </div>
                ))
              ) : (
                <EmptyText text="No bookings yet." />
              )}
            </div>
          </Panel>

          <Panel title="Add Journal Note">
            <div className="flex flex-col gap-4">
              <input
                value={noteTitle}
                onChange={(e) => setNoteTitle(e.target.value)}
                placeholder="Note title"
                className="w-full rounded-xl px-4 py-3 text-sm outline-none"
                style={inputStyle}
              />

              <textarea
                value={noteContent}
                onChange={(e) => setNoteContent(e.target.value)}
                placeholder="Write journal note..."
                rows={5}
                className="w-full rounded-xl px-4 py-3 text-sm outline-none resize-none"
                style={inputStyle}
              />

              <Button
                onClick={handleAddNote}
                disabled={isSavingNote}
                className="rounded-xl w-full py-3 text-sm font-semibold"
                style={{
                  background: "linear-gradient(135deg, #C9A96E, #1E1548)",
                  color: "white",
                }}
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
                  <div
                    key={note._id}
                    className="rounded-2xl p-5"
                    style={{
                      border: "1px solid rgba(30,21,72,0.08)",
                      backgroundColor: i % 2 === 0 ? "white" : "rgba(248,247,255,0.8)",
                    }}
                  >
                    <div className="flex justify-between gap-4">
                      <h3 className="font-semibold text-[#1E1548]">{note.title}</h3>
                      <p className="text-xs text-gray-400">
                        {new Date(note.createdAt).toLocaleDateString()}
                      </p>
                    </div>

                    <p className="text-sm text-gray-600 mt-3 leading-6">
                      {note.content}
                    </p>

                    {note.createdBy && (
                      <p className="text-xs text-gray-400 mt-3">
                        Created by: {note.createdBy}
                      </p>
                    )}
                  </div>
                ))
              ) : (
                <EmptyText text="No journal notes yet." />
              )}
            </div>
          </Panel>

          <Panel title="History">
            <div className="space-y-5">
              {activityLogs.length > 0 ? (
                activityLogs.map((item) => (
                  <div key={item._id} className="flex gap-4">
                    <div
                      className="w-10 h-10 rounded-xl text-white flex-shrink-0 flex items-center justify-center"
                      style={{
                        background: "linear-gradient(135deg, #C9A96E, #1E1548)",
                      }}
                    >
                      <Clock className="w-4 h-4" />
                    </div>

                    <div>
                      <p className="font-semibold text-[#1E1548]">{item.type}</p>
                      <p className="text-xs text-gray-400">
                        {new Date(item.createdAt).toLocaleDateString()}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        {item.description}
                      </p>
                      {item.createdBy && (
                        <p className="text-xs text-gray-400 mt-1">
                          Created by: {item.createdBy}
                        </p>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <EmptyText text="No history yet." />
              )}
            </div>
          </Panel>
        </div>
      </section>
    </div>
  );
}

function Panel({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className="rounded-2xl overflow-hidden bg-white"
      style={{ border: "1px solid rgba(30,21,72,0.1)" }}
    >
      <div
        className="px-6 py-4 text-sm font-semibold uppercase tracking-wider"
        style={{
          background: "linear-gradient(135deg, #1E1548, #2a1f5e)",
          color: "#C9A96E",
        }}
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
          backgroundColor: "rgba(201,169,110,0.12)",
          color: "#C9A96E",
        }}
      >
        {icon}
      </div>

      <div>
        <p className="text-gray-400 text-xs">{label}</p>
        <p className="text-[#1E1548] font-medium break-all">{value}</p>
      </div>
    </div>
  );
}

function EmptyText({ text }: { text: string }) {
  return <p className="text-sm text-gray-400">{text}</p>;
}