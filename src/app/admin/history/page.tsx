"use client";

import { useState, useEffect } from "react";
import {
  CalendarCheck, BookOpen, Activity,
  LayoutList, AlignJustify, Loader2,
  User, Clock, CheckCircle, XCircle,
} from "lucide-react";

type HistoryItem = {
  id: string;
  type: "booking" | "journal" | "activity";
  title: string;
  subtitle: string;
  status: string;
  customer: string;
  email: string;
  createdAt: string;
};

type Filter = "all" | "bookings" | "journal" | "activity";
type ViewMode = "timeline" | "table";

const filterTabs: { key: Filter; label: string; icon: React.ReactNode; color: string }[] = [
  { key: "all", label: "All", icon: <AlignJustify size={14} />, color: "#C9A96E" },
  { key: "bookings", label: "Bookings", icon: <CalendarCheck size={14} />, color: "#34d399" },
  { key: "journal", label: "Journal", icon: <BookOpen size={14} />, color: "#818cf8" },
  { key: "activity", label: "Activity", icon: <Activity size={14} />, color: "#f472b6" },
];

const typeConfig = {
  booking: { color: "#34d399", bg: "rgba(52,211,153,0.1)", icon: CalendarCheck },
  journal: { color: "#818cf8", bg: "rgba(129,140,248,0.1)", icon: BookOpen },
  activity: { color: "#f472b6", bg: "rgba(244,114,182,0.1)", icon: Activity },
};

const statusConfig: Record<string, { color: string; bg: string; icon: React.ReactNode }> = {
  Completed: { color: "#34d399", bg: "rgba(52,211,153,0.1)", icon: <CheckCircle size={12} /> },
  Cancelled: { color: "#ef4444", bg: "rgba(239,68,68,0.1)", icon: <XCircle size={12} /> },
  Upcoming: { color: "#C9A96E", bg: "rgba(201,169,110,0.1)", icon: <Clock size={12} /> },
  Note: { color: "#818cf8", bg: "rgba(129,140,248,0.1)", icon: <BookOpen size={12} /> },
  Log: { color: "#f472b6", bg: "rgba(244,114,182,0.1)", icon: <Activity size={12} /> },
};

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  if (date.toDateString() === today.toDateString()) return "Today";
  if (date.toDateString() === yesterday.toDateString()) return "Yesterday";
  return date.toLocaleDateString("en-SE", {
    day: "numeric", month: "long", year: "numeric",
  });
};

const formatTime = (dateStr: string) =>
  new Date(dateStr).toLocaleTimeString("en-SE", {
    hour: "2-digit", minute: "2-digit",
  });

const groupByDate = (items: HistoryItem[]) => {
  return items.reduce((acc, item) => {
    const dateKey = formatDate(item.createdAt);
    if (!acc[dateKey]) acc[dateKey] = [];
    acc[dateKey].push(item);
    return acc;
  }, {} as Record<string, HistoryItem[]>);
};

export default function HistoryPage() {
  const [items, setItems] = useState<HistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<Filter>("all");
  const [viewMode, setViewMode] = useState<ViewMode>("timeline");

  const fetchHistory = async (f: Filter) => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/admin/history?filter=${f}`);
      const data = await res.json();
      setItems(data.items || []);
    } catch {
      console.error("Failed to fetch history");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchHistory(filter); }, [filter]);

  const grouped = groupByDate(items);

  return (
    <div className="space-y-6">

      {/* ── CONTROLS ROW ── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">

        {/* Filter tabs */}
        <div
          className="flex rounded-xl p-1 gap-1"
          style={{ backgroundColor: "rgba(30,21,72,0.06)" }}
        >
          {filterTabs.map(({ key, label, icon, color }) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
              style={{
                background: filter === key
                  ? "linear-gradient(135deg, #C9A96E, #1E1548)"
                  : "transparent",
                color: filter === key ? "white" : "#9ca3af",
              }}
            >
              <span style={{ color: filter === key ? "white" : color }}>
                {icon}
              </span>
              <span className="hidden sm:block">{label}</span>
            </button>
          ))}
        </div>

        {/* View mode toggle */}
        <div
          className="flex rounded-xl p-1 gap-1"
          style={{ backgroundColor: "rgba(30,21,72,0.06)" }}
        >
          {([
            { mode: "timeline", icon: <AlignJustify size={15} />, label: "Timeline" },
            { mode: "table", icon: <LayoutList size={15} />, label: "Table" },
          ] as const).map(({ mode, icon, label }) => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
              style={{
                background: viewMode === mode
                  ? "linear-gradient(135deg, #C9A96E, #1E1548)"
                  : "transparent",
                color: viewMode === mode ? "white" : "#9ca3af",
              }}
            >
              {icon}
              <span className="hidden sm:block">{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ── LOADING ── */}
      {isLoading && (
        <div className="flex items-center justify-center py-20">
          <Loader2 size={32} className="animate-spin" style={{ color: "#C9A96E" }} />
        </div>
      )}

      {/* ── EMPTY STATE ── */}
      {!isLoading && items.length === 0 && (
        <div
          className="flex flex-col items-center justify-center py-20 gap-4 rounded-2xl"
          style={{
            border: "1px dashed rgba(201,169,110,0.3)",
            backgroundColor: "rgba(201,169,110,0.03)",
          }}
        >
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, rgba(201,169,110,0.15), rgba(30,21,72,0.15))" }}
          >
            <Clock size={24} style={{ color: "#C9A96E" }} />
          </div>
          <div className="text-center">
            <p className="text-gray-500 text-sm font-medium">No history yet</p>
            <p className="text-gray-400 text-xs mt-1">
              Activity will appear here as the clinic operates
            </p>
          </div>
        </div>
      )}

      {/* ══════════════════════════════
           TIMELINE VIEW
      ══════════════════════════════ */}
      {!isLoading && items.length > 0 && viewMode === "timeline" && (
        <div className="space-y-8">
          {Object.entries(grouped).map(([date, dateItems]) => (
            <div key={date}>

              {/* Date header */}
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="px-3 py-1 rounded-full text-xs font-semibold"
                  style={{
                    background: "linear-gradient(135deg, #C9A96E, #1E1548)",
                    color: "white",
                  }}
                >
                  {date}
                </div>
                <div
                  className="flex-1 h-px"
                  style={{ backgroundColor: "rgba(201,169,110,0.15)" }}
                />
                <span className="text-xs text-gray-400">
                  {dateItems.length} event{dateItems.length !== 1 ? "s" : ""}
                </span>
              </div>

              {/* Timeline items */}
              <div className="relative ml-4">
                {/* Vertical line */}
                <div
                  className="absolute left-3 top-0 bottom-0 w-px"
                  style={{ backgroundColor: "rgba(201,169,110,0.15)" }}
                />

                <div className="space-y-3">
                  {dateItems.map((item, i) => {
                    const config = typeConfig[item.type];
                    const Icon = config.icon;
                    const status = statusConfig[item.status] || statusConfig.Log;

                    return (
                      <div
                        key={String(item.id)}
                        className="relative flex gap-4 pl-10"
                        style={{
                          animationDelay: `${i * 50}ms`,
                        }}
                      >
                        {/* Timeline dot */}
                        <div
                          className="absolute left-0 w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 z-10"
                          style={{ backgroundColor: config.bg, border: `2px solid ${config.color}` }}
                        >
                          <Icon size={13} style={{ color: config.color }} />
                        </div>

                        {/* Card */}
                        <div
                          className="flex-1 rounded-2xl p-4 transition-all hover:shadow-md"
                          style={{
                            backgroundColor: "white",
                            border: "1px solid rgba(30,21,72,0.08)",
                          }}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex-1 min-w-0">

                              {/* Title + Status */}
                              <div className="flex items-center gap-2 flex-wrap mb-1">
                                <p className="text-sm font-semibold text-[#1E1548] truncate">
                                  {item.title}
                                </p>
                                <span
                                  className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0"
                                  style={{
                                    backgroundColor: status.bg,
                                    color: status.color,
                                  }}
                                >
                                  {status.icon}
                                  {item.status}
                                </span>
                              </div>

                              {/* Subtitle */}
                              <p className="text-xs text-gray-400 mb-2 line-clamp-2">
                                {item.subtitle}
                              </p>

                              {/* Customer */}
                              <div className="flex items-center gap-1.5">
                                <div
                                  className="w-5 h-5 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                                  style={{ background: "linear-gradient(135deg, #C9A96E, #1E1548)" }}
                                >
                                  {item.customer.charAt(0).toUpperCase()}
                                </div>
                                <span className="text-xs text-gray-500">{item.customer}</span>
                                <span className="text-xs text-gray-300">·</span>
                                <span className="text-xs text-gray-400">{item.email}</span>
                              </div>
                            </div>

                            {/* Time */}
                            <div className="text-right flex-shrink-0">
                              <p className="text-xs text-gray-400">
                                {formatTime(item.createdAt)}
                              </p>
                              <div
                                className="mt-1 w-6 h-6 rounded-lg flex items-center justify-center ml-auto"
                                style={{ backgroundColor: config.bg }}
                              >
                                <Icon size={12} style={{ color: config.color }} />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ══════════════════════════════
           TABLE VIEW
      ══════════════════════════════ */}
      {!isLoading && items.length > 0 && viewMode === "table" && (
        <div
          className="rounded-2xl overflow-hidden"
          style={{ border: "1px solid rgba(30,21,72,0.1)" }}
        >
          {/* Table header */}
          <div
            className="grid grid-cols-12 px-6 py-4 text-xs font-semibold uppercase tracking-wider"
            style={{
              background: "linear-gradient(135deg, #1E1548, #2a1f5e)",
              color: "#C9A96E",
            }}
          >
            <div className="col-span-1">Type</div>
            <div className="col-span-3">Title</div>
            <div className="col-span-3 hidden md:block">Customer</div>
            <div className="col-span-2 hidden md:block">Details</div>
            <div className="col-span-2 text-center">Status</div>
            <div className="col-span-1 text-right">Time</div>
          </div>

          {/* Table rows */}
          <div className="divide-y divide-gray-100">
            {items.map((item, i) => {
              const config = typeConfig[item.type];
              const Icon = config.icon;
              const status = statusConfig[item.status] || statusConfig.Log;

              return (
                <div
                  key={String(item.id)}
                  className="grid grid-cols-12 px-6 py-4 items-center transition-colors duration-150"
                  style={{
                    backgroundColor: i % 2 === 0 ? "white" : "rgba(248,247,255,0.8)",
                  }}
                  onMouseEnter={e => e.currentTarget.style.backgroundColor = "rgba(201,169,110,0.04)"}
                  onMouseLeave={e => e.currentTarget.style.backgroundColor = i % 2 === 0 ? "white" : "rgba(248,247,255,0.8)"}
                >
                  {/* Type icon */}
                  <div className="col-span-1">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: config.bg }}
                    >
                      <Icon size={15} style={{ color: config.color }} />
                    </div>
                  </div>

                  {/* Title */}
                  <div className="col-span-3">
                    <p className="text-sm font-semibold text-[#1E1548] truncate">
                      {item.title}
                    </p>
                    <p className="text-xs text-gray-400 truncate md:hidden">
                      {item.customer}
                    </p>
                  </div>

                  {/* Customer */}
                  <div className="col-span-3 hidden md:flex items-center gap-2">
                    <div
                      className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                      style={{ background: "linear-gradient(135deg, #C9A96E, #1E1548)" }}
                    >
                      {item.customer.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-medium text-[#1E1548] truncate">{item.customer}</p>
                      <p className="text-xs text-gray-400 truncate">{item.email}</p>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="col-span-2 hidden md:block">
                    <p className="text-xs text-gray-400 truncate">{item.subtitle}</p>
                  </div>

                  {/* Status */}
                  <div className="col-span-2 flex justify-center">
                    <span
                      className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-medium"
                      style={{ backgroundColor: status.bg, color: status.color }}
                    >
                      {status.icon}
                      {item.status}
                    </span>
                  </div>

                  {/* Time */}
                  <div className="col-span-1 text-right">
                    <p className="text-xs text-gray-400">{formatTime(item.createdAt)}</p>
                    <p className="text-xs text-gray-300">{formatDate(item.createdAt)}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Table footer */}
          <div
            className="px-6 py-3 flex items-center justify-between"
            style={{
              backgroundColor: "rgba(248,247,255,0.9)",
              borderTop: "1px solid rgba(30,21,72,0.08)",
            }}
          >
            <p className="text-xs text-gray-400">
              Showing {items.length} record{items.length !== 1 ? "s" : ""}
            </p>
            <p className="text-xs" style={{ color: "#C9A96E" }}>
              {items.filter(i => i.type === "booking").length} bookings ·{" "}
              {items.filter(i => i.type === "journal").length} journal entries ·{" "}
              {items.filter(i => i.type === "activity").length} activity logs
            </p>
          </div>
        </div>
      )}
    </div>
  );
}