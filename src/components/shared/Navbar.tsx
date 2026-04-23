"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useState, useRef } from "react";
import { ChevronDown, Menu, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";


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
   
  const router = useRouter()
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
      <nav className="w-full" style={{ backgroundColor: "#1E1548" }}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

          {/* LEFT — Logo */}
          <Link href="/" onClick={closeMobileMenu}>
            <Image
              src="/logo.png"
              alt="Brook Skincare Logo"
              width={130}
              height={45}
              loading="eager"
              style={{ width: "130px", height: "auto" }}
              priority 
            />
          </Link>

          {/* MIDDLE — Desktop links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-gray-200 hover:text-[#C9A96E] transition-colors"
              >
                {link.label}
              </Link>
            ))}

            {/* Desktop Pages dropdown */}
            <div
              className="relative"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <button className="flex items-center gap-1 text-sm text-gray-200 hover:text-[#C9A96E] transition-colors">
                Pages
                <ChevronDown
                  size={14}
                  className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                />
              </button>

            
                <div
                    className={`
                        absolute top-full left-0 w-44 rounded-xl shadow-lg overflow-hidden z-50
                        transform transition-all duration-300 ease-out
                        ${isOpen ? "opacity-100 translate-y-0 scale-100" : "opacity-0 -translate-y-2 scale-95 pointer-events-none"}
                    `}
                    style={{ backgroundColor: "#2a1f5e" }}
                    >
                  {dropdownLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="block px-4 py-3 text-sm text-gray-200 hover:text-[#C9A96E] transition-colors"
                      style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}
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
                className="hidden md:flex text-sm px-5 py-2 rounded-full font-medium"
                style={{ backgroundColor: "#C9A96E", color: "#1E1548" }}
              >
                Sign Out
              </Button>
            ) : (
              <Link href="/login">
                <Button
                  className="hidden md:flex text-sm px-5 py-2 rounded-full font-medium"
                  style={{ backgroundColor: "#C9A96E", color: "#1E1548" }}
                >
                  Book Appointment
                </Button>
              </Link>
            )}

            <button
              className="md:hidden text-gray-200 hover:text-[#C9A96E] transition-colors z-50 relative"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {/* ── OVERLAY — dims the background ── */}
      <div
        onClick={closeMobileMenu}
        className={`fixed inset-0 bg-black z-40 md:hidden transition-opacity duration-300 ${
          mobileOpen ? "opacity-50 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      />

      {/* ── MOBILE DRAWER — slides from right ── */}
      <div
        className={`fixed top-0 right-0 h-full w-4/5 max-w-sm z-50 md:hidden flex flex-col
          transition-transform duration-300 ease-in-out
          ${mobileOpen ? "translate-x-0" : "translate-x-full"}`}
        style={{ backgroundColor: "#1E1548" }}
      >
        {/* Drawer header */}
        <div
          className="flex items-center justify-between px-6 py-5"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}
        >
          <Image
            src="/logo.png"
            alt="Brook Skincare Logo"
            width={100}
            height={35}
            priority
          />
          <button
            onClick={closeMobileMenu}
            className="text-gray-200 hover:text-[#C9A96E] transition-colors"
            aria-label="Close menu"
          >
            <X size={22} />
          </button>
        </div>

        {/* Drawer links */}
        <div className="flex flex-col px-6 py-6 gap-1 flex-1 overflow-y-auto">

          {/* Regular nav links — staggered animation */}
          {navLinks.map((link, i) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={closeMobileMenu}
              className={`text-center text-base font-medium text-gray-200 hover:text-[#C9A96E]
                py-4 transition-all duration-500
                ${mobileOpen ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"}`}
              style={{
                borderBottom: "1px solid rgba(255,255,255,0.06)",
                transitionDelay: mobileOpen ? `${i * 80}ms` : "0ms",
              }}
            >
              {link.label}
            </Link>
          ))}

          {/* Pages accordion */}
          <div
            className={`transition-all duration-500
              ${mobileOpen ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"}`}
            style={{
              borderBottom: "1px solid rgba(255,255,255,0.06)",
              transitionDelay: mobileOpen ? `${navLinks.length * 80}ms` : "0ms",
            }}
          >
            <button
              onClick={() => setPagesOpen(!pagesOpen)}
              className="w-full flex items-center justify-center gap-2 text-base font-medium
                text-gray-200 hover:text-[#C9A96E] transition-colors py-4"
            >
              Pages
              <ChevronDown
                size={15}
                className={`transition-transform duration-300 ${pagesOpen ? "rotate-180" : ""}`}
              />
            </button>

            {/* Sublinks — staggered animation */}
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
                  className={`text-center text-sm py-3 transition-all duration-300
                    text-[#C9A96E] hover:text-white
                    ${pagesOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"}`}
                  style={{
                    transitionDelay: pagesOpen ? `${i * 60}ms` : "0ms",
                    borderBottom: "1px solid rgba(255,255,255,0.04)",
                  }}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* CTA Button */}
          <div
            className={`pt-6 transition-all duration-500
              ${mobileOpen ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"}`}
            style={{ transitionDelay: mobileOpen ? `${(navLinks.length + 1) * 80}ms` : "0ms" }}
          >
           {session ? (
              <Button
                className="w-full text-sm px-5 py-3 rounded-full font-medium"
                style={{ backgroundColor: "#C9A96E", color: "#1E1548" }}
                onClick={() => { signOut({ callbackUrl: "/" }); closeMobileMenu(); }}
              >
                Sign Out
              </Button>
            ) : (
              <Link href="/login" onClick={closeMobileMenu} className="block w-full">
                <Button
                  className="w-full text-sm px-5 py-3 rounded-full font-medium"
                  style={{ backgroundColor: "#C9A96E", color: "#1E1548" }}
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