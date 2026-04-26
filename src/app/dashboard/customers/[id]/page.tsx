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
  id: string;
  title: string;
  content: string;
  date: string;
};

export default function CustomerCardPage() {
  const params = useParams();
  const customerId = params.id as string;

  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);

  const [noteTitle, setNoteTitle] = useState("");
  const [noteContent, setNoteContent] = useState("");

  const [notes, setNotes] = useState<JournalNote[]>([]);

  const [bookings] = useState([
    {
      id: "1",
      treatment: "Skin Consultation",
      date: "2026-05-20",
      time: "14:00",
      status: "Upcoming",
    },
  ]);

  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const res = await fetch(`/api/customers/${customerId}`);
        const data = await res.json();

        if (res.ok) {
          setCustomer(data);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomer();
  }, [customerId]);

  const handleAddNote = () => {
    if (!noteTitle.trim() || !noteContent.trim()) return;

    const newNote = {
      id: crypto.randomUUID(),
      title: noteTitle,
      content: noteContent,
      date: new Date().toLocaleDateString(),
    };

    setNotes((prev) => [newNote, ...prev]);
    setNoteTitle("");
    setNoteContent("");
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
        <p className="text-red-600">Customer not found.</p>
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

        <Button
          className="rounded-xl"
          style={{ backgroundColor: "#C9A96E", color: "#1E1548" }}
        >
          New Booking
        </Button>
      </section>

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
            <h2 className="text-xl font-bold text-[#1E1548] mb-5">Bookings</h2>

            <div className="space-y-4">
              {bookings.map((booking) => (
                <div
                  key={booking.id}
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
              ))}
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
                className="rounded-xl w-full"
                style={{ backgroundColor: "#1E1548", color: "white" }}
              >
                <Plus className="w-4 h-4 mr-2" />
                Save Note
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
                    key={note.id}
                    className="border border-gray-100 rounded-2xl p-5"
                  >
                    <div className="flex justify-between gap-4">
                      <h3 className="font-semibold text-black">{note.title}</h3>
                      <p className="text-sm text-gray-500">{note.date}</p>
                    </div>
                    <p className="text-sm text-gray-700 mt-3 leading-6">
                      {note.content}
                    </p>
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
              <HistoryItem
                icon={<Clock className="w-4 h-4" />}
                title="Customer created"
                text={
                  customer.createdAt
                    ? new Date(customer.createdAt).toLocaleDateString()
                    : "Unknown date"
                }
                dark
              />

              {notes.map((note) => (
                <HistoryItem
                  key={note.id}
                  icon={<FileText className="w-4 h-4" />}
                  title="Journal note added"
                  text={note.title}
                />
              ))}
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

function HistoryItem({
  icon,
  title,
  text,
  dark = false,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
  dark?: boolean;
}) {
  return (
    <div className="flex gap-4">
      <div
        className={`w-10 h-10 rounded-full flex items-center justify-center ${
          dark ? "bg-[#1E1548] text-white" : "bg-[#C9A96E] text-[#1E1548]"
        }`}
      >
        {icon}
      </div>
      <div>
        <p className="font-medium text-black">{title}</p>
        <p className="text-sm text-gray-500">{text}</p>
      </div>
    </div>
  );
}