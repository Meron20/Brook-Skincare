"use client";

import { useEffect, useMemo, useState } from "react";
import { CalendarCheck, Users, BookOpen, TrendingUp, Loader2 } from "lucide-react";
import { text, border, palette, gradient, shadow } from "@/lib/theme";

type Booking = {
  _id: string;
  createdAt?: string;
  date?: string;
  treatment?: string;
  customerName?: string;
  customer?: {
    fullName?: string;
    email?: string;
  };
  customerId?: {
    _id: string;
    fullName?: string;
    email?: string;
  };
};

type Customer = {
  _id: string;
};

type JournalNote = {
  _id: string;
  createdAt?: string;
};

export default function AdminDashboard() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [journalNotes, setJournalNotes] = useState<JournalNote[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const [bookingsRes, customersRes, journalRes] = await Promise.all([
          fetch("/api/bookings"),
          fetch("/api/customers"),
          fetch("/api/journal-notes"),
        ]);

        const bookingsData = bookingsRes.ok ? await bookingsRes.json() : [];
        const customersData = customersRes.ok ? await customersRes.json() : [];
        const journalData = journalRes.ok ? await journalRes.json() : [];

        setBookings(Array.isArray(bookingsData) ? bookingsData : bookingsData.bookings || []);
        setCustomers(Array.isArray(customersData) ? customersData : customersData.customers || []);
        setJournalNotes(Array.isArray(journalData) ? journalData : journalData.notes || journalData.journalNotes || []);
      } catch (error) {
        console.error("Dashboard load error:", error);
      } finally {
        setLoading(false);
      }
    }

    loadDashboardData();
  }, []);

  const thisMonthCount = useMemo(() => {
    const now = new Date();

    return bookings.filter((booking) => {
      const rawDate = booking.date || booking.createdAt;
      if (!rawDate) return false;

      const date = new Date(rawDate);

      return (
        date.getMonth() === now.getMonth() &&
        date.getFullYear() === now.getFullYear()
      );
    }).length;
  }, [bookings]);

  const recentBookings = bookings.slice(0, 5);

  const stats = [
    {
      label: "Total Bookings",
      value: bookings.length.toString(),
      icon: CalendarCheck,
      change: bookings.length ? "Bookings created" : "No bookings yet",
      accent: palette.accentGold,
    },
    {
      label: "Total Clients",
      value: customers.length.toString(),
      icon: Users,
      change: customers.length ? "Registered clients" : "No clients yet",
      accent: palette.accentGreen,
    },
    {
      label: "Journal Entries",
      value: journalNotes.length.toString(),
      icon: BookOpen,
      change: journalNotes.length ? "Saved journal notes" : "No entries yet",
      accent: palette.accentBlue,
    },
    {
      label: "This Month",
      value: thisMonthCount.toString(),
      icon: TrendingUp,
      change: thisMonthCount ? "Bookings this month" : "No data yet",
      accent: palette.accentPurple,
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 size={28} className="animate-spin" style={{ color: palette.gold }} />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {stats.map(({ label, value, icon: Icon, change, accent }) => (
          <div
            key={label}
            className="rounded-2xl p-6 flex flex-col gap-4 relative overflow-hidden transition-all duration-300 hover:-translate-y-1"
            style={{
              background: gradient.card,
              border: `1px solid ${border.subtle}`,
              boxShadow: shadow.card,
            }}
          >
            <div
              className="absolute -top-8 -right-8 w-28 h-28 rounded-full opacity-20 blur-2xl pointer-events-none"
              style={{ backgroundColor: accent }}
            />

            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center relative"
              style={{
                backgroundColor: `${accent}1a`,
                border: `1px solid ${accent}33`,
              }}
            >
              <Icon size={20} style={{ color: accent }} />
            </div>

            <div>
              <p className="text-3xl font-bold" style={{ color: text.primary }}>
                {value}
              </p>
              <p className="text-sm mt-1" style={{ color: text.secondary }}>
                {label}
              </p>
            </div>

            <p className="text-xs" style={{ color: text.muted }}>
              {change}
            </p>
          </div>
        ))}
      </div>

      <div
        className="rounded-2xl p-6 relative overflow-hidden"
        style={{
          background: gradient.cardGold,
          border: `1px solid ${border.gold}`,
          boxShadow: shadow.card,
        }}
      >
        <div
          className="absolute -top-10 -right-10 w-36 h-36 rounded-full blur-3xl opacity-25"
          style={{ backgroundColor: palette.gold }}
        />

        <h2 className="text-lg font-semibold mb-6" style={{ color: text.primary }}>
          Recent Bookings
        </h2>

        {recentBookings.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 gap-3 relative">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center"
              style={{
                background: gradient.goldSoft,
                border: `1px solid ${border.gold}`,
              }}
            >
              <CalendarCheck size={30} style={{ color: palette.gold }} />
            </div>

            <p className="text-sm font-medium" style={{ color: text.secondary }}>
              No bookings yet
            </p>

            <p className="text-xs text-center" style={{ color: text.muted }}>
              Bookings will appear here once customers start scheduling
            </p>
          </div>
        ) : (
          <div className="space-y-3 relative">
            {recentBookings.map((booking) => (
              <div
                key={booking._id}
                className="rounded-xl p-4 flex items-center justify-between gap-4"
                style={{
                  backgroundColor: "rgba(255,255,255,0.7)",
                  border: `1px solid ${border.subtle}`,
                }}
              >
                <div>
                  <p className="text-sm font-semibold" style={{ color: text.primary }}>
                    {booking.treatment || "Booking"}
                  </p>
                  <p className="text-xs mt-1" style={{ color: text.muted }}>
                    {booking.customerName ||
                     booking.customerId?.fullName ||
                     booking.customerId?.email ||
                     booking.customer?.fullName ||
                     booking.customer?.email ||
                     "Unknown customer"}
                  </p>
                </div>

                <p className="text-xs" style={{ color: text.secondary }}>
                  {booking.date
                    ? new Date(booking.date).toLocaleDateString()
                    : booking.createdAt
                    ? new Date(booking.createdAt).toLocaleDateString()
                    : "No date"}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}