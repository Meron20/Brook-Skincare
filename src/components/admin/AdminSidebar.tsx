"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  Sparkles,
  Clock,
  CalendarCheck,
  Users,
  BookOpen,
  History,
  Settings,
  LogOut,
  X,
} from "lucide-react";
import { border, palette, gradient, shadow } from "@/lib/theme";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/admin" },
  { icon: Sparkles, label: "Services", href: "/admin/services" },
  { icon: Clock, label: "Time Slots", href: "/admin/timeslots" },
  { icon: Users, label: "Customers", href: "/admin/customers" },
  { icon: CalendarCheck, label: "Bookings", href: "/admin/bookings" },
  { icon: BookOpen, label: "Journal", href: "/admin/journal" },
  { icon: History, label: "History", href: "/admin/history" },
  { icon: Settings, label: "Settings", href: "/admin/settings" },
];

type AdminSidebarProps = {
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
};

export default function AdminSidebar({
  mobileOpen,
  setMobileOpen,
}: AdminSidebarProps) {
  const pathname = usePathname();

  const SidebarContent = ({ isMobile = false }: { isMobile?: boolean }) => (
    <div className="relative flex flex-col h-full py-6">
      <div className="px-4 mb-10 overflow-hidden">
        <Link
          href="/admin"
          className="flex flex-col items-center gap-3"
          onClick={() => isMobile && setMobileOpen(false)}
        >
          <div className="flex-shrink-0">
            <Image
              src="/logo.png"
              alt="Brook Skincare"
              width={170}
              height={70}
              className="rounded-lg object-contain"
              style={{ minWidth: "40px" }}
            />
          </div>

          <div
            className={
              isMobile
                ? "block"
                : "overflow-hidden whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-300"
            }
          >
            <p className="text-md" style={{ color: palette.gold }}>
              Admin Panel
            </p>
          </div>
        </Link>
      </div>

      <nav className="flex-1 flex flex-col gap-1 px-3">
        {navItems.map(({ icon: Icon, label, href }, i) => {
          const isActive =
            href === "/admin" ? pathname === href : pathname.startsWith(href);

          return (
            <Link
              key={href}
              href={href}
              onClick={() => isMobile && setMobileOpen(false)}
              className="flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 relative group/item overflow-hidden"
              style={{
                background: isActive ? gradient.goldSoft : "transparent",
                animationDelay: `${i * 50}ms`,
              }}
            >
              {isActive && (
                <div
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-6 rounded-r-full"
                  style={{ background: gradient.gold }}
                />
              )}

              <div
                className="absolute inset-0 opacity-0 group-hover/item:opacity-100 transition-opacity duration-200 rounded-xl"
                style={{ background: gradient.goldSoft }}
              />

              {isActive && (
                <div
                  className="absolute inset-0 rounded-xl opacity-20 blur-xl"
                  style={{ backgroundColor: palette.gold }}
                />
              )}

              <div className="relative flex-shrink-0">
                <Icon
                  size={20}
                  style={{
                    color: isActive
                      ? palette.gold
                      : "rgba(255,255,255,0.52)",
                  }}
                />
              </div>

              <span
                className={`relative whitespace-nowrap text-sm font-medium transition-all duration-300 ${
                  isMobile
                    ? "block"
                    : "overflow-hidden opacity-0 group-hover:opacity-100"
                }`}
                style={{
                  color: isActive ? palette.gold : "rgba(255,255,255,0.75)",
                  transitionDelay: "60ms",
                }}
              >
                {label}
              </span>
            </Link>
          );
        })}
      </nav>

      <div
        className="mx-4 my-4"
        style={{ height: "1px", backgroundColor: "rgba(201,169,110,0.2)" }}
      />

      <div className="px-3">
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group/logout overflow-hidden relative"
        >
          <div
            className="absolute inset-0 opacity-0 group-hover/logout:opacity-100 transition-opacity duration-200 rounded-xl"
            style={{ backgroundColor: palette.errorBgSoft }}
          />

          <div className="relative flex-shrink-0">
            <LogOut size={20} style={{ color: palette.errorText }} />
          </div>

          <span
            className={`relative whitespace-nowrap text-sm font-medium transition-all duration-300 ${
              isMobile
                ? "block"
                : "overflow-hidden opacity-0 group-hover:opacity-100"
            }`}
            style={{
              color: palette.errorText,
              transitionDelay: "60ms",
            }}
          >
            Log Out
          </span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      <aside
        className="hidden md:block fixed top-0 left-0 h-full z-50 group"
        style={{
          width: "72px",
          transition: "width 300ms cubic-bezier(0.4,0,0.2,1)",
          boxShadow: shadow.strong,
        }}
        onMouseEnter={(e) => (e.currentTarget.style.width = "240px")}
        onMouseLeave={(e) => (e.currentTarget.style.width = "72px")}
      >
        <div
          className="absolute inset-0"
          style={{
            background: gradient.sidebar,
            borderRight: `1px solid ${border.gold}`,
          }}
        />

        <div
          className="absolute top-0 left-0 w-[2px] h-full"
          style={{
            background: `linear-gradient(180deg, transparent, ${palette.gold}, transparent)`,
          }}
        />

        <SidebarContent isMobile={false} />
      </aside>

      <div
        onClick={() => setMobileOpen(false)}
        className={`md:hidden fixed inset-0 z-50 transition-opacity duration-300 ${
          mobileOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        style={{ backgroundColor: "rgba(0,0,0,0.6)" }}
      />

      <div
        className={`md:hidden fixed top-0 left-0 h-full z-50 w-64 transition-transform duration-300 ease-in-out ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{
          background: gradient.sidebar,
          borderRight: `1px solid ${border.gold}`,
          boxShadow: shadow.strong,
        }}
      >
        <div
          className="absolute top-0 left-0 w-[2px] h-full"
          style={{
            background: `linear-gradient(180deg, transparent, ${palette.gold}, transparent)`,
          }}
        />

        <button
          className="absolute top-4 right-4 p-2 rounded-xl transition-colors"
          style={{ background: gradient.goldSoft }}
          onClick={() => setMobileOpen(false)}
          aria-label="Close menu"
        >
          <X size={18} style={{ color: palette.gold }} />
        </button>

        <SidebarContent isMobile={true} />
      </div>
    </>
  );
}