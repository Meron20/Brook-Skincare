import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";


const navLinks = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about" },
  { label: "Contact Us", href: "/contact" },
  { label: "Pages", href: "/pages" },
  { label: "Register", href: "/register" },
];

export default function Navbar() {
  return (
    <nav className="w-full px-6 py-4" style={{ backgroundColor: "#1E1548" }}>
      <div className="max-w-7xl mx-auto flex items-center justify-between">

        {/* LEFT — Logo */}
        <Link href="/">
          <Image
            src="/logo.png"
            alt="Brook Skincare Logo"
            width={130}
            height={45}
            priority
          />
        </Link>

        {/* MIDDLE — Nav Links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-gray-200 hover:text-gray-300 transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* RIGHT — CTA Button */}
        <Button
          className="text-sm px-5 py-2 rounded-full font-medium transition-colors"
          style={{ backgroundColor: "#C9A96E", color: "#1E1548" }}
        >
          Book Appointment
        </Button>

      </div>
    </nav>
  );
}