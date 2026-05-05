import { CalendarCheck, Users, BookOpen, TrendingUp } from "lucide-react";
import { text, border, palette, gradient, shadow } from "@/lib/theme";

const stats = [
  {
    label: "Total Bookings",
    value: "0",
    icon: CalendarCheck,
    change: "No bookings yet",
    accent: palette.accentGold,
  },
  {
    label: "Total Clients",
    value: "0",
    icon: Users,
    change: "No clients yet",
    accent: palette.accentGreen,
  },
  {
    label: "Journal Entries",
    value: "0",
    icon: BookOpen,
    change: "No entries yet",
    accent: palette.accentBlue,
  },
  {
    label: "This Month",
    value: "0",
    icon: TrendingUp,
    change: "No data yet",
    accent: palette.accentPurple,
  },
];

export default function AdminDashboard() {
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
      </div>
    </div>
  );
}