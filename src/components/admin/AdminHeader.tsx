"use client";

import { useSession } from "next-auth/react";
import { Bell, Search, Menu } from "lucide-react";
import { useAdminContext } from "./AdminContext";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { toast } from "sonner";
import Link from "next/link";

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

  const unreadCount = notifications.filter((n) => !readIds.includes(n._id)).length;

  useEffect(() => {
    setAnimated(false);
    const t = setTimeout(() => setAnimated(true), 50);
    return () => clearTimeout(t);
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
        const exists = prev.some((item) => item._id === booking._id)
        if (exists) return prev;
        return [booking, ...prev].slice(0, 5)
      })

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
        background: "linear-gradient(180deg, #1E1548 0%, #0f0b2e 100%)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid rgba(201,169,110,0.1)",
      }}
    >
      <div className="flex items-center gap-4">
        <button
          className="md:hidden p-2 rounded-xl flex-shrink-0"
          style={{
            backgroundColor: "#1E1548",
            border: "1px solid rgba(201,169,110,0.3)",
          }}
          onClick={onMenuClick}
          aria-label="Open menu"
        >
          <Menu size={18} style={{ color: "#C9A96E" }} />
        </button>

        <div
          className="transition-all duration-500"
          style={{
            opacity: animated ? 1 : 0,
            transform: animated ? "translateY(0)" : "translateY(8px)",
          }}
        >
          <h1
            className="text-2xl font-bold"
            style={{
              background: "linear-gradient(135deg, #C9A96E 0%, #1E1548 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            {title}
          </h1>
          <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>
        </div>
      </div>

      <div
        className="hidden md:flex items-center gap-3 px-4 py-2 rounded-xl"
        style={{
          background: "linear-gradient(135deg, #C9A96E, #1E1548)",
          border: "1px solid rgba(30,21,72,0.08)",
          width: "240px",
        }}
      >
        <Search size={15} className="text-white" />
        <input
          type="text"
          placeholder="Search..."
          className="bg-transparent text-sm text-white placeholder-white outline-none w-full"
        />
      </div>

      <div className="flex items-center gap-3">
        <div className="relative">
          <button
            onClick={() => setNotificationsOpen((prev) => !prev)}
            className="relative p-2 rounded-xl transition-colors"
            style={{ backgroundColor: "rgba(255,255,255,0.04)" }}
          >
            <Bell size={18} className="text-gray-400" />

            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-4 h-4 px-1 rounded-full bg-red-500 text-white text-[10px] flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>

          {notificationsOpen && (
            <div className="absolute right-0 top-12 w-80 rounded-2xl bg-white shadow-2xl border border-[rgba(30,21,72,0.08)] p-4 z-50">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-[#1E1548]">Notifications</h3>

                {unreadCount > 0 && (
                  <button
                    onClick={() =>
                      setReadIds(notifications.map((item) => item._id))
                    }
                    className="text-xs"
                    style={{ color: "#C9A96E" }}
                  >
                    Mark all read
                  </button>
                )}
              </div>

              <div className="flex flex-col gap-3 max-h-80 overflow-y-auto">
                {notifications.length > 0 ? (
                  notifications.map((booking) => {
                    const isRead = readIds.includes(booking._id);

                    return (
                      <Link
                        key={booking._id}
                        href="/admin/bookings"
                        onClick={() => {
                          setReadIds((prev) =>
                            prev.includes(booking._id)
                              ? prev
                              : [...prev, booking._id]
                          );
                          setNotificationsOpen(false);
                        }}
                        className={`rounded-xl p-3 text-sm transition ${
                          isRead
                            ? "bg-[#f7f6f3] opacity-60"
                            : "bg-[rgba(201,169,110,0.13)]"
                        } hover:bg-[#eee9dd]`}
                      >
                        <p className="font-medium text-[#1E1548]">
                          New booking created
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {booking.customerId?.fullName || "Customer"} booked{" "}
                          {booking.treatment}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          {booking.date} at {booking.time}
                        </p>
                      </Link>
                    );
                  })
                ) : (
                  <p className="text-sm text-gray-500">No notifications</p>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-sm font-medium text-white">
              {session?.user?.name || "Admin"}
            </p>
            <p className="text-xs" style={{ color: "#C9A96E" }}>
              Administrator
            </p>
          </div>

          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold"
            style={{
              background: "linear-gradient(135deg, #C9A96E, #1E1548)",
              color: "white",
            }}
          >
            {session?.user?.name?.charAt(0).toUpperCase() || "A"}
          </div>
        </div>
      </div>
    </header>
  );
}