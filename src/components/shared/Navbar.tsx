"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useState, useRef } from "react";
import { ChevronDown, Menu, X } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { useSiteSettings } from "@/components/public/SettingsProvider";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about" },
  { label: "Contact Us", href: "/contact" },
];

const dropdownLinks = [
  { label: "Services", href: "/services" },
  { label: "Learn", href: "/learn" },
  { label: "Products", href: "/products" },
];

export default function Navbar() {

  const { logoUrl, clinicName } = useSiteSettings();

  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [pagesOpen, setPagesOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleMouseEnter = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    closeTimer.current = setTimeout(() => setIsOpen(false), 150);
  };

  const closeMobileMenu = () => {
    setMobileOpen(false);
    setPagesOpen(false);
  };

  return (
    <>
      <nav
        className="w-full fixed top-0 left-0 right-0 z-50"
        style={{
          backgroundColor: "rgba(10,31,20,0.92)",
          backdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(201,168,76,0.2)",
          transition: "all 0.3s cubic-bezier(0.4,0,0.2,1)",
        }}
      >
        <div className="max-w-7xl mx-auto px-6 py-0 flex items-center justify-between h-[72px]">

          {/* LEFT — Logo */}
          <Link href="/" onClick={closeMobileMenu}>
            <Image
              src={logoUrl}
              alt={clinicName}
              width={56}
              height={56}
              loading="eager"
              priority
              className="rounded-full"
              style={{ width: "56px", height: "56px", objectFit: "cover" }}
            />
          </Link>
          {/* MIDDLE — Desktop links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium transition-all relative group"
                style={{ color: "rgba(255,255,255,0.75)" }}
              >
                {link.label}
                {/* Underline hover effect */}
                <span
                  className="absolute bottom-[-2px] left-0 right-0 h-px scale-x-0 group-hover:scale-x-100 transition-transform duration-300"
                  style={{ backgroundColor: "#C9A84C" }}
                />
              </Link>
            ))}

            {/* Desktop Pages dropdown */}
            <div
              className="relative"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <button
                className="flex items-center gap-1 text-sm font-medium transition-colors relative group"
                style={{ color: "rgba(255,255,255,0.75)" }}
              >
                Pages
                <ChevronDown
                  size={14}
                  className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                />
                <span
                  className="absolute bottom-[-2px] left-0 right-0 h-px scale-x-0 group-hover:scale-x-100 transition-transform duration-300"
                  style={{ backgroundColor: "#C9A84C" }}
                />
              </button>

              {/* Dropdown */}
              <div
                className={`absolute top-full left-0 w-44 rounded-xl shadow-2xl overflow-hidden z-50
                  transform transition-all duration-300 ease-out mt-2
                  ${isOpen
                    ? "opacity-100 translate-y-0 scale-100 pointer-events-auto"
                    : "opacity-0 -translate-y-2 scale-95 pointer-events-none"
                  }`}
                style={{
                  backgroundColor: "#0F2D1E",
                  border: "1px solid rgba(201,168,76,0.2)",
                }}
              >
                {dropdownLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="block px-4 py-3 text-sm transition-colors"
                    style={{
                      color: "rgba(255,255,255,0.75)",
                      borderBottom: "1px solid rgba(255,255,255,0.05)",
                    }}
                    onMouseEnter={e => e.currentTarget.style.color = "#C9A84C"}
                    onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,0.75)"}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT — CTA + Hamburger */}
          <div className="flex items-center gap-4">
            {session ? (
              <Button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="hidden md:flex text-sm px-5 py-2 rounded-full font-semibold transition-all hover:-translate-y-0.5"
                style={{
                  background: "linear-gradient(135deg, #C9A84C, #9A7A2E)",
                  color: "#0A1F14",
                  boxShadow: "0 4px 16px rgba(201,168,76,0.3)",
                }}
              >
                Sign Out
              </Button>
            ) : (
              <Link href="/services">
                <Button
                  className="hidden md:flex text-sm px-5 py-2 rounded-full font-semibold transition-all hover:-translate-y-0.5 hover:shadow-lg"
                  style={{
                    background: "linear-gradient(135deg, #C9A84C, #9A7A2E)",
                    color: "#0A1F14",
                    boxShadow: "0 4px 16px rgba(201,168,76,0.3)",
                  }}
                >
                  Book Appointment
                </Button>
              </Link>
            )}

            {/* Hamburger */}
            <button
              className="md:hidden z-50 relative p-1 transition-colors"
              style={{ color: "rgba(255,255,255,0.8)" }}
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Spacer to push content below fixed navbar */}
      <div className="h-[72px]" />

      {/* ── OVERLAY ── */}
      <div
        onClick={closeMobileMenu}
        className={`fixed inset-0 bg-black z-40 md:hidden transition-opacity duration-300 ${
          mobileOpen ? "opacity-50 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      />

      {/* ── MOBILE DRAWER ── */}
      <div
        className={`fixed top-0 right-0 h-full w-4/5 max-w-sm z-50 md:hidden flex flex-col
          transition-transform duration-300 ease-in-out
          ${mobileOpen ? "translate-x-0" : "translate-x-full"}`}
        style={{
          background: "linear-gradient(180deg, #0A1F14 0%, #0F2D1E 100%)",
          borderLeft: "1px solid rgba(201,168,76,0.15)",
        }}
      >
        {/* Gold accent line */}
        <div
          className="absolute top-0 right-0 w-[2px] h-full"
          style={{ background: "linear-gradient(180deg, transparent, #C9A84C, transparent)" }}
        />

        {/* Drawer header */}
        <div
          className="flex items-center justify-between px-6 py-5"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}
        >
          <Image
            src={logoUrl}
            alt={clinicName}
            width={48}
            height={48}
            priority
            className="rounded-full"
            style={{ width: "48px", height: "48px", objectFit: "cover" }}
          />
          <button
            onClick={closeMobileMenu}
            className="p-2 rounded-xl transition-colors"
            style={{ backgroundColor: "rgba(201,168,76,0.1)", color: "#C9A84C" }}
            aria-label="Close menu"
          >
            <X size={18} />
          </button>
        </div>

        {/* Drawer links */}
        <div className="flex flex-col px-6 py-6 gap-1 flex-1 overflow-y-auto">

          {navLinks.map((link, i) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={closeMobileMenu}
              className={`text-center text-base font-medium py-4 transition-all duration-500 ${
                mobileOpen ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"
              }`}
              style={{
                color: "rgba(255,255,255,0.75)",
                borderBottom: "1px solid rgba(255,255,255,0.06)",
                transitionDelay: mobileOpen ? `${i * 80}ms` : "0ms",
              }}
              onMouseEnter={e => e.currentTarget.style.color = "#C9A84C"}
              onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,0.75)"}
            >
              {link.label}
            </Link>
          ))}

          {/* Pages accordion */}
          <div
            className={`transition-all duration-500 ${
              mobileOpen ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"
            }`}
            style={{
              borderBottom: "1px solid rgba(255,255,255,0.06)",
              transitionDelay: mobileOpen ? `${navLinks.length * 80}ms` : "0ms",
            }}
          >
            <button
              onClick={() => setPagesOpen(!pagesOpen)}
              className="w-full flex items-center justify-center gap-2 text-base font-medium py-4 transition-colors"
              style={{ color: "rgba(255,255,255,0.75)" }}
            >
              Pages
              <ChevronDown
                size={15}
                className={`transition-transform duration-300 ${pagesOpen ? "rotate-180" : ""}`}
                style={{ color: "#C9A84C" }}
              />
            </button>

            <div
              className={`flex flex-col overflow-hidden transition-all duration-300 ease-in-out ${
                pagesOpen ? "max-h-52 opacity-100" : "max-h-0 opacity-0"
              }`}
            >
              {dropdownLinks.map((link, i) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={closeMobileMenu}
                  className={`text-center text-sm py-3 transition-all duration-300 ${
                    pagesOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
                  }`}
                  style={{
                    color: "#C9A84C",
                    transitionDelay: pagesOpen ? `${i * 60}ms` : "0ms",
                    borderBottom: "1px solid rgba(255,255,255,0.04)",
                  }}
                >
                  → {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* CTA Button */}
          <div
            className={`pt-6 transition-all duration-500 ${
              mobileOpen ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"
            }`}
            style={{ transitionDelay: mobileOpen ? `${(navLinks.length + 1) * 80}ms` : "0ms" }}
          >
            {session ? (
              <Button
                className="w-full text-sm px-5 py-3 rounded-full font-semibold"
                style={{
                  background: "linear-gradient(135deg, #C9A84C, #9A7A2E)",
                  color: "#0A1F14",
                }}
                onClick={() => { signOut({ callbackUrl: "/" }); closeMobileMenu(); }}
              >
                Sign Out
              </Button>
            ) : (
              <Link href="/services" onClick={closeMobileMenu} className="block w-full">
                <Button
                  className="w-full text-sm px-5 py-3 rounded-full font-semibold"
                  style={{
                    background: "linear-gradient(135deg, #C9A84C, #9A7A2E)",
                    color: "#0A1F14",
                  }}
                >
                  Book Appointment
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </>
  );
}