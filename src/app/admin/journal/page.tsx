"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  AlertCircle,
  BookOpen,
  Calendar,
  Clock,
  ExternalLink,
  FileText,
  Languages,
  Loader2,
  Search,
  User,
} from "lucide-react";

import {
  bg,
  text,
  border,
  palette,
  gradient,
} from "@/lib/theme";

// ============================================================
// TYPES
// ============================================================

type Customer = {
  _id: string;
  fullName?: string;
  name?: string;
  email?: string;
};

type JournalEntry = {
  _id: string;

  entryType?:
    | "note"
    | "consultation_form";

  formType?:
    | "standard"
    | "melasma";

  customerId?:
    | string
    | Customer;

  customer?: Customer;

  title?: string;

  content?: string;

  note?: string;

  language?: string | null;

  createdAt?: string;
};

// ============================================================
// PAGE
// ============================================================

export default function AdminJournalPage() {
  const [entries, setEntries] =
    useState<JournalEntry[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [search, setSearch] =
    useState("");

  // ==========================================================
  // FETCH JOURNAL ENTRIES
  // ==========================================================

  useEffect(() => {
    async function fetchEntries() {
      setLoading(true);
      setError("");

      try {
        const res = await fetch(
          "/api/journal-notes",
          {
            cache: "no-store",
          }
        );

        const data =
          await res.json();

        if (!res.ok) {
          setError(
            data.message ||
              "Failed to load journal."
          );

          return;
        }

        setEntries(
          Array.isArray(data)
            ? data
            : data.entries ||
                data.notes ||
                data.journalNotes ||
                []
        );
      } catch (error) {
        console.error(
          "Journal fetch error:",
          error
        );

        setError(
          "Could not load journal."
        );
      } finally {
        setLoading(false);
      }
    }

    fetchEntries();
  }, []);

  // ==========================================================
  // SEARCH
  // ==========================================================

  const filteredEntries =
    useMemo(() => {
      const value = search
        .toLowerCase()
        .trim();

      if (!value) {
        return entries;
      }

      return entries.filter(
        (entry) => {
          const customer =
            typeof entry.customerId ===
            "object"
              ? entry.customerId
              : entry.customer;

          return (
            entry.title
              ?.toLowerCase()
              .includes(value) ||
            entry.content
              ?.toLowerCase()
              .includes(value) ||
            entry.note
              ?.toLowerCase()
              .includes(value) ||
            entry.formType
              ?.toLowerCase()
              .includes(value) ||
            entry.language
              ?.toLowerCase()
              .includes(value) ||
            customer?.fullName
              ?.toLowerCase()
              .includes(value) ||
            customer?.name
              ?.toLowerCase()
              .includes(value) ||
            customer?.email
              ?.toLowerCase()
              .includes(value)
          );
        }
      );
    }, [entries, search]);

  // ==========================================================
  // STATS
  // ==========================================================

  const thisMonthCount =
    entries.filter((entry) => {
      if (!entry.createdAt) {
        return false;
      }

      const date = new Date(
        entry.createdAt
      );

      const now = new Date();

      return (
        date.getMonth() ===
          now.getMonth() &&
        date.getFullYear() ===
          now.getFullYear()
      );
    }).length;

  const latestDate =
    entries[0]?.createdAt
      ? new Date(
          entries[0].createdAt
        ).toLocaleDateString(
          "en-GB",
          {
            day: "numeric",
            month: "short",
            year: "numeric",
          }
        )
      : "—";

  const customerCount =
    new Set(
      entries
        .map((entry) => {
          const customer =
            typeof entry.customerId ===
            "object"
              ? entry.customerId
              : entry.customer;

          return typeof entry.customerId ===
            "string"
            ? entry.customerId
            : customer?._id;
        })
        .filter(Boolean)
    ).size;

  const consultationCount =
    entries.filter(
      (entry) =>
        entry.entryType ===
        "consultation_form"
    ).length;

  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <div className="space-y-6">
      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p
            className="mb-1 text-xs font-bold uppercase tracking-[0.25em]"
            style={{
              color: palette.gold,
            }}
          >
            Admin Panel
          </p>

          <h1
            className="text-2xl font-semibold md:text-3xl"
            style={{
              color: text.primary,
            }}
          >
            Journal
          </h1>

          <p
            className="mt-1 text-sm"
            style={{
              color: text.muted,
            }}
          >
            View customer journal
            notes and submitted
            consultation forms.
          </p>
        </div>

        <p
          className="text-sm"
          style={{
            color: text.muted,
          }}
        >
          {loading
            ? "Loading journal..."
            : `${
                filteredEntries.length
              } ${
                filteredEntries.length ===
                1
                  ? "entry"
                  : "entries"
              } shown`}
        </p>
      </div>

      {/* =====================================================
          STATS
      ===================================================== */}

      {!loading && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <StatCard
            label="Total Entries"
            value={entries.length}
          />

          <StatCard
            label="This Month"
            value={thisMonthCount}
          />

          <StatCard
            label="Forms"
            value={consultationCount}
          />

          <StatCard
            label="Customers"
            value={customerCount}
          />
        </div>
      )}

      {/* Latest date helper */}

      {!loading &&
        entries.length > 0 && (
          <p
            className="-mt-2 text-xs"
            style={{
              color: text.muted,
            }}
          >
            Latest entry:{" "}
            <span
              style={{
                color: text.primary,
              }}
            >
              {latestDate}
            </span>
          </p>
        )}

      {/* =====================================================
          SEARCH
      ===================================================== */}

      <div className="relative">
        <Search
          size={16}
          className="absolute left-4 top-1/2 -translate-y-1/2"
          style={{
            color: text.muted,
          }}
        />

        <input
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          placeholder="Search by note, form, customer or email..."
          disabled={loading}
          className="w-full rounded-xl py-3 pl-11 pr-4 text-sm outline-none transition disabled:opacity-60"
          style={{
            backgroundColor: bg.card,

            border: `1px solid ${border.subtle}`,

            color: text.primary,
          }}
        />
      </div>

      {/* =====================================================
          LOADING
      ===================================================== */}

      {loading && (
        <div
          className="flex min-h-[320px] items-center justify-center rounded-2xl"
          style={{
            backgroundColor:
              bg.card,

            border: `1px solid ${border.subtle}`,
          }}
        >
          <div
            className="flex items-center gap-2 text-sm"
            style={{
              color: text.muted,
            }}
          >
            <Loader2
              size={18}
              className="animate-spin"
            />

            Loading journal...
          </div>
        </div>
      )}

      {/* =====================================================
          ERROR
      ===================================================== */}

      {!loading && error && (
        <div
          className="rounded-2xl p-6"
          style={{
            backgroundColor:
              bg.card,

            border:
              "1px solid rgba(239,68,68,0.25)",
          }}
        >
          <div className="flex items-center gap-2 text-sm text-red-400">
            <AlertCircle
              size={18}
            />

            {error}
          </div>
        </div>
      )}

      {/* =====================================================
          EMPTY
      ===================================================== */}

      {!loading &&
        !error &&
        filteredEntries.length ===
          0 && (
          <div
            className="flex min-h-[320px] flex-col items-center justify-center rounded-2xl p-10 text-center"
            style={{
              backgroundColor:
                bg.card,

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
              <BookOpen
                size={26}
                style={{
                  color:
                    palette.gold,
                }}
              />
            </div>

            <h3
              className="text-xl font-semibold"
              style={{
                color:
                  text.primary,
              }}
            >
              {entries.length === 0
                ? "No journal entries yet"
                : "No entries found"}
            </h3>

            <p
              className="mt-2 max-w-sm text-sm leading-6"
              style={{
                color:
                  text.muted,
              }}
            >
              {entries.length === 0
                ? "Customer journal notes and submitted consultation forms will appear here."
                : "Try searching for another customer, email, form or note title."}
            </p>
          </div>
        )}

      {/* =====================================================
          ENTRY LIST
      ===================================================== */}

      {!loading &&
        !error &&
        filteredEntries.length >
          0 && (
          <div className="space-y-3">
            <p
              className="text-[10px] font-bold uppercase tracking-[0.25em]"
              style={{
                color:
                  text.muted,
              }}
            >
              {
                filteredEntries.length
              }{" "}
              {filteredEntries.length ===
              1
                ? "entry"
                : "entries"}

              {search &&
                ` matching "${search}"`}
            </p>

            {filteredEntries.map(
              (entry) => (
                <JournalEntryCard
                  key={`${entry.entryType}-${entry._id}`}
                  entry={entry}
                />
              )
            )}
          </div>
        )}
    </div>
  );
}

// ============================================================
// STAT CARD
// ============================================================

function StatCard({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
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
        style={{
          color: palette.gold,
        }}
      >
        {label}
      </p>

      <p
        className="mt-1 text-2xl font-semibold"
        style={{
          color: text.primary,
        }}
      >
        {value}
      </p>
    </div>
  );
}

// ============================================================
// JOURNAL ENTRY CARD
// ============================================================

function JournalEntryCard({
  entry,
}: {
  entry: JournalEntry;
}) {
  const customer =
    typeof entry.customerId ===
    "object"
      ? entry.customerId
      : entry.customer;

  const realCustomerId =
    typeof entry.customerId ===
    "string"
      ? entry.customerId
      : customer?._id;

  const entryTitle =
    entry.title ||
    "Journal Entry";

  const entryContent =
    entry.content ||
    entry.note ||
    "No content";

  const createdAt =
    entry.createdAt
      ? new Date(
          entry.createdAt
        )
      : null;

  const wordCount =
    entryContent.trim()
      ? entryContent
          .trim()
          .split(/\s+/)
          .length
      : 0;

  const isConsultationForm =
    entry.entryType ===
    "consultation_form";

  const isMelasma =
    isConsultationForm &&
    entry.formType ===
      "melasma";

  return (
    <div
      className="overflow-hidden rounded-2xl transition-all duration-200"
      style={{
        backgroundColor: bg.card,

        border: `1px solid ${border.subtle}`,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor =
          border.gold;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor =
          border.subtle;
      }}
    >
      {/* GOLD TOP LINE */}

      <div
        className="h-[3px]"
        style={{
          background:
            gradient.gold,

          opacity: 0.75,
        }}
      />

      <div className="p-5 md:p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          {/* LEFT */}

          <div className="flex min-w-0 gap-4">
            {/* ICON */}

            <div
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
              style={{
                backgroundColor: `${palette.gold}18`,

                border: `1px solid ${border.gold}`,
              }}
            >
              {isConsultationForm ? (
                <FileText
                  size={16}
                  style={{
                    color:
                      palette.gold,
                  }}
                />
              ) : (
                <BookOpen
                  size={16}
                  style={{
                    color:
                      palette.gold,
                  }}
                />
              )}
            </div>

            <div className="min-w-0">
              {/* BADGES */}

              <div className="mb-2 flex flex-wrap items-center gap-2">
                {isConsultationForm ? (
                  <span
                    className="rounded-full px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.15em]"
                    style={{
                      backgroundColor: `${palette.gold}14`,

                      border: `1px solid ${border.gold}`,

                      color:
                        palette.gold,
                    }}
                  >
                    {isMelasma
                      ? "Melasma Assessment"
                      : "Consultation Form"}
                  </span>
                ) : (
                  <span
                    className="rounded-full px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.15em]"
                    style={{
                      backgroundColor:
                        bg.hover,

                      border: `1px solid ${border.subtle}`,

                      color:
                        text.muted,
                    }}
                  >
                    Journal Note
                  </span>
                )}

                {isMelasma && (
                  <span
                    className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.15em]"
                    style={{
                      backgroundColor:
                        bg.hover,

                      border: `1px solid ${border.subtle}`,

                      color:
                        text.muted,
                    }}
                  >
                    <Languages
                      size={10}
                    />

                    {entry.language ||
                      "Amharic"}
                  </span>
                )}
              </div>

              {/* TITLE */}

              <h2
                className="truncate text-base font-semibold"
                style={{
                  color:
                    text.primary,
                }}
              >
                {entryTitle}
              </h2>

              {/* META */}

              <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1">
                <span
                  className="flex items-center gap-1 text-xs"
                  style={{
                    color:
                      text.muted,
                  }}
                >
                  <Calendar
                    size={12}
                  />

                  {createdAt
                    ? createdAt.toLocaleDateString(
                        "en-GB",
                        {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        }
                      )
                    : "No date"}
                </span>

                <span
                  className="text-xs"
                  style={{
                    color:
                      text.muted,
                  }}
                >
                  ·
                </span>

                {isConsultationForm ? (
                  <span
                    className="flex items-center gap-1 text-xs"
                    style={{
                      color:
                        text.muted,
                    }}
                  >
                    <FileText
                      size={12}
                    />

                    Submitted form
                  </span>
                ) : (
                  <span
                    className="flex items-center gap-1 text-xs"
                    style={{
                      color:
                        text.muted,
                    }}
                  >
                    <Clock
                      size={12}
                    />

                    {wordCount} words
                  </span>
                )}
              </div>

              {/* CUSTOMER */}

              <div className="mt-3 flex items-start gap-2">
                <User
                  size={14}
                  className="mt-0.5 shrink-0"
                  style={{
                    color:
                      palette.gold,
                  }}
                />

                <div>
                  <p
                    className="text-sm font-medium"
                    style={{
                      color:
                        text.primary,
                    }}
                  >
                    {customer?.fullName ||
                      customer?.name ||
                      "Unknown customer"}
                  </p>

                  {customer?.email && (
                    <p
                      className="text-xs"
                      style={{
                        color:
                          text.muted,
                      }}
                    >
                      {
                        customer.email
                      }
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* OPEN CUSTOMER */}

          {realCustomerId && (
            <Link
              href={`/admin/customers/${realCustomerId}/journal`}
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition hover:opacity-90"
              style={{
                backgroundColor: `${palette.gold}14`,

                border: `1px solid ${border.gold}`,

                color:
                  palette.gold,
              }}
            >
              Open customer journal

              <ExternalLink
                size={14}
              />
            </Link>
          )}
        </div>

        {/* CONTENT */}

        <div
          className="mt-5 rounded-xl p-4"
          style={{
            backgroundColor:
              bg.hover,

            border: `1px solid ${border.subtle}`,
          }}
        >
          <p
            className="whitespace-pre-wrap text-sm leading-7"
            style={{
              color:
                text.primary,
            }}
          >
            {entryContent}
          </p>
        </div>
      </div>
    </div>
  );
}