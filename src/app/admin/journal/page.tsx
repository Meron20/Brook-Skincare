"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  AlertCircle,
  BookOpen,
  Calendar,
  Clock,
  ExternalLink,
  Loader2,
  Search,
  User,
} from "lucide-react";
import { bg, text, border, palette, gradient } from "@/lib/theme";

type Customer = {
  _id: string;
  fullName?: string;
  name?: string;
  email?: string;
};

type JournalNote = {
  _id: string;
  customerId?: string | Customer;
  customer?: Customer;
  title?: string;
  content?: string;
  note?: string;
  createdAt?: string;
};

export default function AdminJournalPage() {
  const [notes, setNotes] = useState<JournalNote[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function fetchNotes() {
      setLoading(true);
      setError("");

      try {
        const res = await fetch("/api/journal-notes");
        const data = await res.json();

        if (!res.ok) {
          setError(data.message || "Failed to load journal notes.");
          return;
        }

        setNotes(
          Array.isArray(data) ? data : data.notes || data.journalNotes || []
        );
      } catch {
        setError("Could not load journal notes.");
      } finally {
        setLoading(false);
      }
    }

    fetchNotes();
  }, []);

  const filteredNotes = useMemo(() => {
    const value = search.toLowerCase().trim();

    if (!value) return notes;

    return notes.filter((note) => {
      const customer =
        typeof note.customerId === "object" ? note.customerId : note.customer;

      return (
        note.title?.toLowerCase().includes(value) ||
        note.content?.toLowerCase().includes(value) ||
        note.note?.toLowerCase().includes(value) ||
        customer?.fullName?.toLowerCase().includes(value) ||
        customer?.name?.toLowerCase().includes(value) ||
        customer?.email?.toLowerCase().includes(value)
      );
    });
  }, [notes, search]);

  const thisMonthCount = notes.filter((note) => {
    if (!note.createdAt) return false;

    const date = new Date(note.createdAt);
    const now = new Date();

    return (
      date.getMonth() === now.getMonth() &&
      date.getFullYear() === now.getFullYear()
    );
  }).length;

  const latestDate = notes[0]?.createdAt
    ? new Date(notes[0].createdAt).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "—";

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p
            className="mb-1 text-xs font-bold uppercase tracking-[0.25em]"
            style={{ color: palette.gold }}
          >
            Admin Panel
          </p>

          <h1
            className="text-2xl font-semibold md:text-3xl"
            style={{ color: text.primary }}
          >
            Journal
          </h1>

          <p className="mt-1 text-sm" style={{ color: text.muted }}>
            View all customer journal notes.
          </p>
        </div>

        <p className="text-sm" style={{ color: text.muted }}>
          {loading
            ? "Loading journal..."
            : `${filteredNotes.length} note${
                filteredNotes.length !== 1 ? "s" : ""
              } shown`}
        </p>
      </div>

      {/* STATS */}
      {!loading && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <StatCard label="Total Notes" value={notes.length} />
          <StatCard label="This Month" value={thisMonthCount} />
          <StatCard label="Latest Note" value={latestDate} />
          <StatCard
            label="Customers"
            value={
              new Set(
                notes
                  .map((note) => {
                    const customer =
                      typeof note.customerId === "object"
                        ? note.customerId
                        : note.customer;

                    return typeof note.customerId === "string"
                      ? note.customerId
                      : customer?._id;
                  })
                  .filter(Boolean)
              ).size
            }
          />
        </div>
      )}

      {/* SEARCH */}
      <div className="relative">
        <Search
          size={16}
          className="absolute left-4 top-1/2 -translate-y-1/2"
          style={{ color: text.muted }}
        />

        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by note, customer or email..."
          disabled={loading}
          className="w-full rounded-xl py-3 pl-11 pr-4 text-sm outline-none transition disabled:opacity-60"
          style={{
            backgroundColor: bg.card,
            border: `1px solid ${border.subtle}`,
            color: text.primary,
          }}
        />
      </div>

      {/* LOADING */}
      {loading && (
        <div
          className="flex min-h-[320px] items-center justify-center rounded-2xl"
          style={{
            backgroundColor: bg.card,
            border: `1px solid ${border.subtle}`,
          }}
        >
          <div className="flex items-center gap-2 text-sm" style={{ color: text.muted }}>
            <Loader2 size={18} className="animate-spin" />
            Loading journal...
          </div>
        </div>
      )}

      {/* ERROR */}
      {!loading && error && (
        <div
          className="rounded-2xl p-6"
          style={{
            backgroundColor: bg.card,
            border: "1px solid rgba(239,68,68,0.25)",
          }}
        >
          <div className="flex items-center gap-2 text-sm text-red-400">
            <AlertCircle size={18} />
            {error}
          </div>
        </div>
      )}

      {/* EMPTY */}
      {!loading && !error && filteredNotes.length === 0 && (
        <div
          className="flex min-h-[320px] flex-col items-center justify-center rounded-2xl p-10 text-center"
          style={{
            backgroundColor: bg.card,
            border: `1px solid ${border.subtle}`,
          }}
        >
          <div
            className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl"
            style={{
              backgroundColor: `${palette.gold}15`,
              border: `1px solid ${border.gold}`,
            }}
          >
            <BookOpen size={26} style={{ color: palette.gold }} />
          </div>

          <h3 className="text-xl font-semibold" style={{ color: text.primary }}>
            {notes.length === 0 ? "No journal notes yet" : "No notes found"}
          </h3>

          <p className="mt-2 max-w-sm text-sm leading-6" style={{ color: text.muted }}>
            {notes.length === 0
              ? "Customer journal notes will appear here once created."
              : "Try searching for another customer, email or note title."}
          </p>
        </div>
      )}

      {/* NOTE LIST */}
      {!loading && !error && filteredNotes.length > 0 && (
        <div className="space-y-3">
          <p
            className="text-[10px] font-bold uppercase tracking-[0.25em]"
            style={{ color: text.muted }}
          >
            {filteredNotes.length}{" "}
            {filteredNotes.length === 1 ? "entry" : "entries"}
            {search && ` matching "${search}"`}
          </p>

          {filteredNotes.map((note) => (
            <JournalNoteCard key={note._id} note={note} />
          ))}
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div
      className="rounded-2xl px-5 py-4"
      style={{
        backgroundColor: bg.card,
        border: `1px solid ${border.subtle}`,
      }}
    >
      <p
        className="text-[10px] font-bold uppercase tracking-[0.2em]"
        style={{ color: palette.gold }}
      >
        {label}
      </p>

      <p className="mt-1 text-2xl font-semibold" style={{ color: text.primary }}>
        {value}
      </p>
    </div>
  );
}

function JournalNoteCard({ note }: { note: JournalNote }) {
  const customer =
    typeof note.customerId === "object" ? note.customerId : note.customer;

  const realCustomerId =
    typeof note.customerId === "string" ? note.customerId : customer?._id;

  const noteTitle = note.title || "Journal Note";
  const noteContent = note.content || note.note || "No content";

  const createdAt = note.createdAt ? new Date(note.createdAt) : null;

  const wordCount = noteContent.trim()
    ? noteContent.trim().split(/\s+/).length
    : 0;

  return (
    <div
      className="overflow-hidden rounded-2xl transition-all duration-200"
      style={{
        backgroundColor: bg.card,
        border: `1px solid ${border.subtle}`,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = border.gold;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = border.subtle;
      }}
    >
      <div
        className="h-[3px]"
        style={{
          background: gradient.gold,
          opacity: 0.75,
        }}
      />

      <div className="p-5 md:p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="flex min-w-0 gap-4">
            <div
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
              style={{
                backgroundColor: `${palette.gold}18`,
                border: `1px solid ${border.gold}`,
              }}
            >
              <BookOpen size={16} style={{ color: palette.gold }} />
            </div>

            <div className="min-w-0">
              <h2
                className="truncate text-base font-semibold"
                style={{ color: text.primary }}
              >
                {noteTitle}
              </h2>

              <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1">
                <span
                  className="flex items-center gap-1 text-xs"
                  style={{ color: text.muted }}
                >
                  <Calendar size={12} />
                  {createdAt
                    ? createdAt.toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })
                    : "No date"}
                </span>

                <span className="text-xs" style={{ color: text.muted }}>
                  ·
                </span>

                <span
                  className="flex items-center gap-1 text-xs"
                  style={{ color: text.muted }}
                >
                  <Clock size={12} />
                  {wordCount} words
                </span>
              </div>

              <div className="mt-3 flex items-start gap-2">
                <User size={14} className="mt-0.5 shrink-0" style={{ color: palette.gold }} />

                <div>
                  <p className="text-sm font-medium" style={{ color: text.primary }}>
                    {customer?.fullName || customer?.name || "Unknown customer"}
                  </p>

                  {customer?.email && (
                    <p className="text-xs" style={{ color: text.muted }}>
                      {customer.email}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {realCustomerId && (
            <Link
              href={`/admin/customers/${realCustomerId}/journal`}
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition hover:opacity-90"
              style={{
                backgroundColor: `${palette.gold}14`,
                border: `1px solid ${border.gold}`,
                color: palette.gold,
              }}
            >
              Open customer journal
              <ExternalLink size={14} />
            </Link>
          )}
        </div>

        <div
          className="mt-5 rounded-xl p-4"
          style={{
            backgroundColor: bg.hover,
            border: `1px solid ${border.subtle}`,
          }}
        >
          <p
            className="whitespace-pre-wrap text-sm leading-7"
            style={{ color: text.primary }}
          >
            {noteContent}
          </p>
        </div>
      </div>
    </div>
  );
}