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
      } catch (error) {
        console.error(error);
        setError("Could not load customer data.");
      } finally {
        setLoading(false);
      }
    };

    if (customerId) {
      fetchCustomer();
    }
  }, [customerId]);

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
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customerId,
          title: noteTitle,
          content: noteContent,
        }),
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
    } catch (error) {
      console.error(error);
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
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customerId,
          treatment: newTreatment,
          date: newDate,
          time: newTime,
        }),
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
    } catch (error) {
      console.error(error);
      setError("Could not create booking.");
    } finally {
      setIsSavingBooking(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-3xl p-6 shadow-sm">
        <p className="text-gray-500">Loading customer...</p>
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="bg-white rounded-3xl p-6 shadow-sm">
        <p className="text-red-600">{error || "Customer not found."}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <section className="bg-white rounded-3xl p-6 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <p className="text-sm text-gray-500">Customer Card</p>
          <h1 className="text-3xl font-bold text-[#1E1548] mt-1">
            {customer.fullName || "Unnamed customer"}
          </h1>
          <p className="text-gray-500 mt-2">{customer.email}</p>
        </div>
      </section>

      {error && (
        <div className="bg-white rounded-3xl p-4 shadow-sm">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      <section className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-1 flex flex-col gap-6">
          <div className="bg-white rounded-3xl p-6 shadow-sm">
            <h2 className="text-xl font-bold text-[#1E1548] mb-5">
              Customer Information
            </h2>

            <div className="space-y-4 text-sm">
              <InfoRow
                icon={<User className="w-4 h-4 text-[#1E1548]" />}
                label="Full name"
                value={customer.fullName || "Not provided"}
              />
              <InfoRow
                icon={<Mail className="w-4 h-4 text-[#1E1548]" />}
                label="Email"
                value={customer.email}
              />
              <InfoRow
                icon={<Phone className="w-4 h-4 text-[#1E1548]" />}
                label="Phone"
                value={customer.phone || "Not provided"}
              />
              <InfoRow
                icon={<FileText className="w-4 h-4 text-[#1E1548]" />}
                label="Skin concern"
                value={customer.skinConcern || "Not specified"}
              />
              <InfoRow
                icon={<Calendar className="w-4 h-4 text-[#1E1548]" />}
                label="Created at"
                value={
                  customer.createdAt
                    ? new Date(customer.createdAt).toLocaleDateString()
                    : "Unknown"
                }
              />
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-sm">
            <h2 className="text-xl font-bold text-[#1E1548] mb-5">
              Create Booking
            </h2>

            <div className="flex flex-col gap-3">
              <input
                value={newTreatment}
                onChange={(e) => setNewTreatment(e.target.value)}
                placeholder="Treatment"
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none"
              />

              <input
                type="date"
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none"
              />

              <input
                type="time"
                value={newTime}
                onChange={(e) => setNewTime(e.target.value)}
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none"
              />

              <Button
                onClick={handleCreateBooking}
                disabled={isSavingBooking}
                className="rounded-xl w-full"
                style={{ backgroundColor: "#C9A96E", color: "#1E1548" }}
              >
                {isSavingBooking ? "Saving..." : "Create Booking"}
              </Button>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-sm">
            <h2 className="text-xl font-bold text-[#1E1548] mb-5">Bookings</h2>

            <div className="space-y-4">
              {bookings.length > 0 ? (
                bookings.map((booking) => (
                  <div
                    key={booking._id}
                    className="border border-gray-100 rounded-2xl p-4"
                  >
                    <p className="font-semibold text-black">
                      {booking.treatment}
                    </p>
                    <p className="text-sm text-gray-500 mt-2">
                      {booking.date} at {booking.time}
                    </p>
                    <span className="inline-block mt-3 text-xs px-3 py-1 rounded-full bg-blue-100 text-blue-700">
                      {booking.status}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500">No bookings yet.</p>
              )}
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-sm">
            <h2 className="text-xl font-bold text-[#1E1548] mb-5">
              Add Journal Note
            </h2>

            <div className="flex flex-col gap-4">
              <input
                value={noteTitle}
                onChange={(e) => setNoteTitle(e.target.value)}
                placeholder="Note title"
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none"
              />

              <textarea
                value={noteContent}
                onChange={(e) => setNoteContent(e.target.value)}
                placeholder="Write journal note..."
                rows={5}
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none resize-none"
              />

              <Button
                onClick={handleAddNote}
                disabled={isSavingNote}
                className="rounded-xl w-full"
                style={{ backgroundColor: "#1E1548", color: "white" }}
              >
                <Plus className="w-4 h-4 mr-2" />
                {isSavingNote ? "Saving..." : "Save Note"}
              </Button>
            </div>
          </div>
        </div>

        <div className="xl:col-span-2 flex flex-col gap-6">
          <div className="bg-white rounded-3xl p-6 shadow-sm">
            <h2 className="text-xl font-bold text-[#1E1548] mb-5">
              Journal Notes
            </h2>

            <div className="space-y-4">
              {notes.length > 0 ? (
                notes.map((note) => (
                  <div
                    key={note._id}
                    className="border border-gray-100 rounded-2xl p-5"
                  >
                    <div className="flex justify-between gap-4">
                      <h3 className="font-semibold text-black">{note.title}</h3>
                      <p className="text-sm text-gray-500">
                        {new Date(note.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <p className="text-sm text-gray-700 mt-3 leading-6">
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
                <p className="text-sm text-gray-500">No journal notes yet.</p>
              )}
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-sm">
            <h2 className="text-xl font-bold text-[#1E1548] mb-5">History</h2>

            <div className="space-y-4">
              {activityLogs.length > 0 ? (
                activityLogs.map((item) => (
                  <div key={item._id} className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-[#1E1548] text-white flex items-center justify-center">
                      <Clock className="w-4 h-4" />
                    </div>

                    <div>
                      <p className="font-medium text-black">{item.type}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(item.createdAt).toLocaleDateString()}
                      </p>
                      <p className="text-sm text-gray-700 mt-1">
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
                <p className="text-sm text-gray-500">No history yet.</p>
              )}
            </div>
          </div>
        </div>
      </section>
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
      {icon}
      <div>
        <p className="text-gray-500">{label}</p>
        <p className="text-black font-medium">{value}</p>
      </div>
    </div>
  );
}