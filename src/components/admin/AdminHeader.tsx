"use client";

import { useSession } from "next-auth/react";
import {
  Bell, Search, Menu, X, User, Sparkles,
  CalendarCheck, BookOpen, CheckCheck, Circle,
} from "lucide-react";
import { useAdminContext } from "./AdminContext";
import { useEffect, useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { io } from "socket.io-client";
import { toast } from "sonner";
import Link from "next/link";
import { bg, text, border, palette, gradient, shadow } from "@/lib/theme";

type AdminHeaderProps = {
  onMenuClick: () => void;
};

type SearchResult = {
  id: string;
  type: "user" | "service" | "booking" | "journal";
  title: string;
  subtitle: string;
  href: string;
};

type NotificationBooking = {
  _id: string;
  treatment: string;
  date: string;
  time: string;
  createdAt?: string;
  customerId?: {
    fullName?: string;
    email?: string;
  };
};

const typeConfig = {
  user: { icon: User, label: "Customers", color: "#818cf8" },
  service: { icon: Sparkles, label: "Services", color: "#C9A96E" },
  booking: { icon: CalendarCheck, label: "Bookings", color: "#34d399" },
  journal: { icon: BookOpen, label: "Journal", color: "#f472b6" },
};

export default function AdminHeader({ onMenuClick }: AdminHeaderProps) {
  const { data: session } = useSession();
  const { title, subtitle } = useAdminContext();
  const router = useRouter();

  const [animated, setAnimated] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationBooking[]>([]);
  const [readIds, setReadIds] = useState<string[]>([]);

  const searchRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const unreadCount = notifications.filter(
    (item) => !readIds.includes(item._id)
  ).length;

  // Title animation
  useEffect(() => {
    setAnimated(false);
    const t = setTimeout(() => setAnimated(true), 50);
    return () => clearTimeout(t);
  }, [title]);

  // Close search on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchOpen(false);
        setSearchQuery("");
        setResults([]);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Notifications + socket
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await fetch("/api/bookings");
        const data = await res.json();
        if (!res.ok) return;
        const bookings: NotificationBooking[] = Array.isArray(data)
          ? data
          : data.bookings || [];
        const sorted = bookings.sort(
          (a, b) =>
            new Date(b.createdAt || "").getTime() -
            new Date(a.createdAt || "").getTime()
        );
        const latest = sorted.slice(0, 5);
        setNotifications(latest);
        setReadIds(latest.map((item) => item._id));
      } catch (error) {
        console.error("Failed to fetch booking notifications", error);
      }
    };

    fetchNotifications();

    const socket = io();
    socket.on("booking:created", (booking: NotificationBooking) => {
      setNotifications((prev) => {
        const exists = prev.some((item) => item._id === booking._id);
        if (exists) return prev;
        return [booking, ...prev].slice(0, 5);
      });
      toast.success("New booking created", {
        description: `${booking.customerId?.fullName || "Customer"} booked ${booking.treatment}`,
      });
      const audio = new Audio("/notification.mp3");
      audio.volume = 0.35;
      audio.play().catch(() => {});
    });

    return () => { socket.disconnect(); };
  }, []);

  // Search
  const handleSearch = useCallback(async (query: string) => {
    if (query.trim().length < 3) {
      setResults([]);
      setIsSearching(false);
      return;
    }
    setIsSearching(true);
    try {
      const res = await fetch(`/api/admin/search?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      setResults(data.results || []);
    } catch {
      setResults([]);
    } finally {
      setIsSearching(false);
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    setSearchOpen(true);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => handleSearch(value), 400);
  };

  const handleResultClick = (href: string) => {
    router.push(href);
    setSearchOpen(false);
    setSearchQuery("");
    setResults([]);
  };

  const groupedResults = results.reduce((acc, result) => {
    if (!acc[result.type]) acc[result.type] = [];
    acc[result.type].push(result);
    return acc;
  }, {} as Record<string, SearchResult[]>);

  // Notification helpers
  const handleToggleNotifications = () => setNotificationsOpen(prev => !prev);
  const markAllAsRead = () => setReadIds(notifications.map(item => item._id));
  const markAllAsUnread = () => setReadIds([]);
  const toggleRead = (id: string) => {
    setReadIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  return (
    <header
      className="sticky top-0 z-40 flex items-center justify-between px-4 md:px-8 py-4"
      style={{
        background: gradient.header,
        backdropFilter: "blur(12px)",
        borderBottom: `1px solid ${border.gold}`,
        boxShadow: shadow.soft,
      }}
    >
      {/* LEFT — Hamburger + Title */}
      <div className="flex items-center gap-4">
        <button
          className="md:hidden p-2 rounded-xl"
          style={{ background: gradient.goldSoft, border: `1px solid ${border.gold}` }}
          onClick={onMenuClick}
        >
          <Menu size={18} style={{ color: palette.gold }} />
        </button>

        <div
          style={{
            opacity: animated ? 1 : 0,
            transform: animated ? "translateY(0)" : "translateY(8px)",
            transition: "all 0.4s ease",
          }}
        >
          <h1 className="text-2xl font-bold" style={{ color: palette.white }}>
            {title}
          </h1>
          <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "12px" }}>
            {subtitle}
          </p>
        </div>
      </div>

      {/* CENTER — Search with dropdown */}
      <div ref={searchRef} className="relative hidden md:block">
        <div
          className="flex items-center gap-3 px-4 py-2 rounded-xl cursor-pointer transition-all duration-300"
          style={{
            background: searchOpen ? "rgba(255,255,255,0.1)" : gradient.goldSoft,
            border: searchOpen ? `1px solid ${palette.gold}` : `1px solid ${border.gold}`,
            width: searchOpen ? "300px" : "220px",
          }}
        >
          {isSearching ? (
            <div
              className="w-3.5 h-3.5 rounded-full border-2 animate-spin flex-shrink-0"
              style={{ borderColor: palette.gold, borderTopColor: "transparent" }}
            />
          ) : (
            <Search size={14} style={{ color: palette.gold, flexShrink: 0 }} />
          )}
          <input
            type="text"
            placeholder="Search users, services..."
            value={searchQuery}
            onChange={handleInputChange}
            onFocus={() => setSearchOpen(true)}
            className="bg-transparent text-sm text-white placeholder-white/50 outline-none w-full"
          />
          {searchQuery && (
            <button onClick={() => { setSearchQuery(""); setResults([]); setSearchOpen(false); }}>
              <X size={13} className="text-gray-500 hover:text-white transition-colors" />
            </button>
          )}
        </div>

        {/* Results dropdown */}
        {searchOpen && searchQuery.trim().length >= 3 && (
          <div
            className="absolute top-full right-0 mt-2 w-80 rounded-2xl overflow-hidden shadow-2xl z-50"
            style={{ background: gradient.card, border: `1px solid ${border.light}`, boxShadow: shadow.strong }}
          >
            {isSearching ? (
              <div className="flex items-center justify-center gap-3 py-6">
                <div className="w-4 h-4 rounded-full border-2 animate-spin"
                  style={{ borderColor: palette.gold, borderTopColor: "transparent" }} />
                <p className="text-sm text-gray-500">Searching...</p>
              </div>
            ) : results.length > 0 ? (
              <>
                {Object.entries(groupedResults).map(([type, items]) => {
                  const config = typeConfig[type as keyof typeof typeConfig];
                  const Icon = config.icon;
                  return (
                    <div key={type}>
                      <div className="flex items-center gap-2 px-4 pt-3 pb-1">
                        <Icon size={12} style={{ color: config.color }} />
                        <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: config.color }}>
                          {config.label}
                        </p>
                        <span className="text-xs px-1.5 py-0.5 rounded-full"
                          style={{ backgroundColor: `${config.color}20`, color: config.color }}>
                          {items.length}
                        </span>
                      </div>
                      {items.map(result => (
                        <button key={String(result.id)} onClick={() => handleResultClick(result.href)}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-left transition-all hover:bg-white/5">
                          <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                            style={{ backgroundColor: `${config.color}15` }}>
                            <Icon size={13} style={{ color: config.color }} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-white truncate">{result.title}</p>
                            <p className="text-xs text-gray-500 truncate">{result.subtitle}</p>
                          </div>
                        </button>
                      ))}
                      <div style={{ height: "1px", backgroundColor: "rgba(255,255,255,0.04)", margin: "4px 0" }} />
                    </div>
                  );
                })}
                <div className="px-4 py-2.5">
                  <p className="text-xs text-gray-600">
                    {results.length} result{results.length !== 1 ? "s" : ""} for &quot;{searchQuery}&quot;
                  </p>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 gap-2">
                <Search size={24} className="text-gray-700" />
                <p className="text-sm text-gray-500">No results for &quot;{searchQuery}&quot;</p>
                <p className="text-xs text-gray-700">Try a different search term</p>
              </div>
            )}
          </div>
        )}

        {/* Hint < 3 chars */}
        {searchOpen && searchQuery.trim().length > 0 && searchQuery.trim().length < 3 && (
          <div className="absolute top-full right-0 mt-2 w-80 rounded-2xl px-4 py-3 shadow-2xl z-50"
            style={{ background: gradient.card, border: `1px solid ${border.light}` }}>
            <p className="text-xs text-gray-500 text-center">Type at least 3 characters to search...</p>
          </div>
        )}
      </div>

      {/* RIGHT — Bell + User */}
      <div className="flex items-center gap-3">

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={handleToggleNotifications}
            className="relative p-2 rounded-xl"
            style={{ background: gradient.goldSoft, border: `1px solid ${border.gold}` }}
          >
            <Bell size={18} style={{ color: palette.gold }} />
            {unreadCount > 0 && (
              <span
                className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-[10px] font-bold"
                style={{ backgroundColor: "#dc2626", color: "white", border: `2px solid ${palette.bg0}` }}
              >
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </button>

          {notificationsOpen && (
            <div
              className="absolute right-0 top-12 w-80 rounded-2xl p-4 z-50"
              style={{ background: gradient.card, border: `1px solid ${border.light}`, boxShadow: shadow.strong }}
            >
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="text-sm font-bold" style={{ color: text.primary }}>
                    Notifications
                  </h3>
                  <p className="text-xs" style={{ color: text.muted }}>{unreadCount} unread</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={markAllAsRead} className="text-xs font-semibold" style={{ color: palette.gold }}>
                    Mark read
                  </button>
                  <button onClick={markAllAsUnread} className="text-xs font-semibold" style={{ color: text.muted }}>
                    Unread
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                {notifications.length === 0 ? (
                  <p className="rounded-xl p-4 text-sm" style={{ color: text.muted }}>
                    No notifications yet.
                  </p>
                ) : notifications.map(n => {
                  const isRead = readIds.includes(n._id);
                  return (
                    <div
                      key={n._id}
                      className="rounded-xl p-3 transition"
                      style={{
                        background: isRead ? "rgba(0,0,0,0.03)" : palette.goldFaint,
                        border: isRead ? `1px solid ${border.subtle}` : `1px solid ${border.gold}`,
                        opacity: isRead ? 0.65 : 1,
                      }}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <Link
                          href="/admin/bookings"
                          onClick={() => setNotificationsOpen(false)}
                          className="flex-1"
                        >
                          <p className="text-sm font-semibold" style={{ color: text.primary }}>
                            {!isRead && "● "}
                            {n.customerId?.fullName || "Customer"} booked {n.treatment}
                          </p>
                          <p className="mt-1 text-xs" style={{ color: text.muted }}>
                            {n.date} at {n.time}
                          </p>
                        </Link>
                        <button
                          type="button"
                          onClick={() => toggleRead(n._id)}
                          title={isRead ? "Mark as unread" : "Mark as read"}
                          className="rounded-lg p-1 transition hover:opacity-70"
                          style={{ color: isRead ? text.muted : palette.gold }}
                        >
                          {isRead ? <Circle size={15} /> : <CheckCheck size={15} />}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* User */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:block text-right">
            <p style={{ color: palette.white }}>{session?.user?.name || "Admin"}</p>
            <p style={{ color: palette.gold, fontSize: "12px" }}>Administrator</p>
          </div>
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center font-bold"
            style={{ background: gradient.gold, color: bg.page }}
          >
            {session?.user?.name?.charAt(0).toUpperCase() || "A"}
          </div>
        </div>
      </div>
    </header>
  );
}