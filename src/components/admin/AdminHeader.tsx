"use client";

import { useSession } from "next-auth/react";
import { Bell, Search, Menu } from "lucide-react";
import { useAdminContext } from "./AdminContext";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { toast } from "sonner";
import Link from "next/link";
import { bg, text, border, palette, gradient, shadow } from "@/lib/theme";

type AdminHeaderProps = {
  onMenuClick: () => void;
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

export default function AdminHeader({ onMenuClick }: AdminHeaderProps) {
  const { data: session } = useSession();
  const { title, subtitle } = useAdminContext();

  const [animated, setAnimated] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationBooking[]>([]);
  const [readIds, setReadIds] = useState<string[]>([]);

  const unreadCount = notifications.filter(
    (item) => !readIds.includes(item._id)
  ).length;

  useEffect(() => {
    setAnimated(false);
    const timer = setTimeout(() => setAnimated(true), 50);
    return () => clearTimeout(timer);
  }, [title]);

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

        setNotifications(sorted.slice(0, 5));
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
        description: `${booking.customerId?.fullName || "Customer"} booked ${
          booking.treatment
        }`,
      });

      const audio = new Audio("/notification.mp3");
      audio.volume = 0.35;
      audio.play().catch(() => {});
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <header
      className="sticky top-0 z-40 flex items-center justify-between px-8 py-4"
      style={{
        background: gradient.header,
        backdropFilter: "blur(12px)",
        borderBottom: `1px solid ${border.gold}`,
        boxShadow: shadow.soft,
      }}
    >
      {/* LEFT */}
      <div className="flex items-center gap-4">
        <button
          className="md:hidden p-2 rounded-xl"
          style={{
            background: gradient.goldSoft,
            border: `1px solid ${border.gold}`,
          }}
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

      {/* SEARCH */}
      <div
        className="hidden md:flex items-center gap-3 px-4 py-2 rounded-xl transition-all duration-300"
        style={{
          background: `linear-gradient(135deg, 
            ${palette.goldDeep} 20%, 
            ${palette.bg2} 60%, 
            ${palette.bg3} 100%, 
            ${palette.bg1 } 100%)`,
          border: `1px solid ${border.gold}`,
          width: "260px",
          boxShadow: `
            inset 0 1px 0 rgba(255,255,255,0.05),
            0 4px 20px rgba(201,169,110,0.08)
          `,
        }}
      >
        <Search size={15} style={{ color: palette.gold }} />

        <input
          type="text"
          placeholder="Search..."
          className="bg-transparent text-sm outline-none w-full placeholder-white/50"
          style={{
            color: "#fff",
          }}
          onFocus={(e) => {
            e.currentTarget.parentElement!.style.boxShadow = `
              inset 0 1px 0 rgba(255,255,255,0.08),
              0 0 0 1px ${palette.gold},
              0 0 20px rgba(201,169,110,0.25)
            `;
          }}
          onBlur={(e) => {
            e.currentTarget.parentElement!.style.boxShadow = `
              inset 0 1px 0 rgba(255,255,255,0.05),
              0 4px 20px rgba(201,169,110,0.08)
            `;
          }}
        />
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-3">
        {/* NOTIFICATIONS */}
        <div className="relative">
          <button
            onClick={() => setNotificationsOpen((prev) => !prev)}
            className="p-2 rounded-xl"
            style={{
              background: gradient.goldSoft,
              border: `1px solid ${border.gold}`,
            }}
          >
            <Bell size={18} style={{ color: palette.gold }} />
          </button>

          {notificationsOpen && (
            <div
              className="absolute right-0 top-12 w-80 rounded-2xl p-4 z-50"
              style={{
                background: gradient.card,
                border: `1px solid ${border.light}`,
                boxShadow: shadow.strong,
              }}
            >
              <h3 style={{ color: text.primary }}>Notifications</h3>

              <div className="mt-3 flex flex-col gap-2">
                {notifications.map((n) => (
                  <Link
                    key={n._id}
                    href="/admin/bookings"
                    className="p-3 rounded-xl"
                    style={{
                      background: palette.goldFaint,
                    }}
                  >
                    <p style={{ color: text.primary }}>
                      {n.customerId?.fullName} booked {n.treatment}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* USER */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:block text-right">
            <p style={{ color: palette.white }}>
              {session?.user?.name || "Admin"}
            </p>
            <p style={{ color: palette.gold, fontSize: "12px" }}>
              Administrator
            </p>
          </div>

          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center font-bold"
            style={{
              background: gradient.gold,
              color: bg.page,
            }}
          >
            {session?.user?.name?.charAt(0).toUpperCase() || "A"}
          </div>
        </div>
      </div>
    </header>
  );
}