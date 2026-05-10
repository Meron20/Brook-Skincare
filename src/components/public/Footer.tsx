"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useSiteSettings } from "@/components/public/SettingsProvider";

const footerLinks = {
  Services: [
    { label: "Hyperpigmentation", href: "/services" },
    { label: "Melasma Treatment", href: "/services" },
    { label: "Skin Assessment", href: "/services" },
    { label: "Full Consultation", href: "/services" },
    { label: "Full Programme", href: "/services" },
  ],
  Learn: [
    { label: "The 5-Pillar Method", href: "/learn" },
    { label: "About Melasma", href: "/learn" },
    { label: "Skin Type Guide", href: "/learn" },
    { label: "Ingredient Guide", href: "/learn" },
    { label: "The Book", href: "/learn" },
  ],
  Clinic: [
    { label: "About Brook", href: "/about" },
    { label: "Book Appointment", href: "/services" },
    { label: "Contact Us", href: "/contact" },
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
  ],
};

  export default function Footer() {
      const { logoUrl, clinicName, clinicAbout, facebook, youtube, tiktok, linkedin } = useSiteSettings();
      const [email, setEmail] = useState("");
      const [subscribed, setSubscribed] = useState(false);
      const [isLoading, setIsLoading] = useState(false);
      const [error, setError] = useState("");
      const [successMsg, setSuccessMsg] = useState("");
      
        // ── DYNAMIC SOCIALS — built from settings ──
        const socials = [
          {
            label: "YouTube",
            href: youtube || "https://www.youtube.com/channel/UCQqGytMj-iIbDnqlyTfn7vw",
            show: true,
            icon: (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.54 6.42a2.78 2.78 0 00-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 00-1.95 1.96A29 29 0 001 12a29 29 0 00.46 5.58a2.78 2.78 0 001.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 001.95-1.96A29 29 0 0023 12a29 29 0 00-.46-5.58z" />
                <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="#0A1F14" />
              </svg>
            ),
          },
          {
            label: "WhatsApp",
            href: "https://wa.me/46790409411",
            show: true,
            icon: (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
            ),
          },
          {
            label: "Facebook",
            href: facebook,
            show: !!facebook,
            icon: (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
              </svg>
            ),
          },
          {
            label: "TikTok",
            href: tiktok,
            show: !!tiktok,
            icon: (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.26 8.26 0 004.84 1.56V6.79a4.85 4.85 0 01-1.07-.1z" />
              </svg>
            ),
          },
          {
            label: "LinkedIn",
            href: linkedin,
            show: !!linkedin,
            icon: (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z M4 6a2 2 0 100-4 2 2 0 000 4z" />
              </svg>
            ),
          },
        ].filter(s => s.show);

      const handleSubscribe = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSuccessMsg("");
      
        // Client-side validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email) {
          setError("Please enter your email address");
          return;
        }
        if (!emailRegex.test(email)) {
          setError("Please enter a valid email address");
          return;
        }
      
        setIsLoading(true);
        try {
          const res = await fetch("/api/newsletter", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email }),
          });
      
          const data = await res.json();
      
          if (!res.ok) {
            setError(data.message || "Something went wrong");
            return;
          }
      
          setSubscribed(true);
          setSuccessMsg(data.message);
          setEmail("");
        } catch {
          setError("Something went wrong. Please try again.");
        } finally {
          setIsLoading(false);
        }
      };
  return (
    <footer
      className="relative overflow-hidden"
      style={{ backgroundColor: "#0A1F14" }}
    >
      {/* Gold top border */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background: "linear-gradient(90deg, transparent, #C9A84C, transparent)",
        }}
      />

      {/* Background gradient */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse 60% 40% at 10% 80%, rgba(201,168,76,0.04) 0%, transparent 60%),
            radial-gradient(ellipse 40% 60% at 90% 20%, rgba(74,144,164,0.03) 0%, transparent 50%)
          `,
        }}
      />

      <div className="max-w-7xl mx-auto px-6 py-6 relative z-10">

        {/* ── MAIN FOOTER GRID ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 pb-12">

          {/* Brand column */}
          <div className="lg:col-span-1">
            {/* Logo */}
            <Link href="/" className="inline-block mb-4">
              <Image
                src={logoUrl}
                alt={clinicName}
                width={60}
                height={60}
                className="rounded-full object-cover"
                style={{ border: "2px solid rgba(201,168,76,0.4)" }}
              />
            </Link>

            {/* Brand name */}
            <p
              className="font-bold mb-1"
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "24px",
                color: "#C9A84C",
              }}
            >
              {clinicName}
            </p>
            <p
              className="text-xs mb-5"
              style={{ color: "rgba(255,255,255,0.4)" }}
            >
              Hyperpigmentation & Skin Health
            </p>

            {/* Tagline */}
            <p
              className="text-sm mb-6"
              style={{
                color: "rgba(255,255,255,0.5)",
                fontStyle: "italic",
                lineHeight: 1.7,
                borderLeft: "2px solid #C9A84C",
                paddingLeft: "14px",
              }}
            >
              {clinicAbout || "Expert care for melanin-rich skin — wherever you are in the world."}
            </p>

            {/* Socials */}
          <div className="flex justify-between  gap-4">
            <div className="flex gap-3">
              {socials.map(social => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="w-9 h-9 rounded-full flex items-center justify-center transition-all hover:scale-110"
                  style={{
                    backgroundColor: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    color: "rgba(255,255,255,0.7)",
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.backgroundColor = "rgba(201,168,76,0.15)";
                    e.currentTarget.style.borderColor = "#C9A84C";
                    e.currentTarget.style.color = "#C9A84C";
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.05)";
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
                    e.currentTarget.style.color = "rgba(255,255,255,0.7)";
                  }}
                >
                  {social.icon}
                </a>
              ))}
             </div>
             
            </div>
          </div>

          {/* Links columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <p
                className="text-xs font-bold uppercase tracking-widest mb-5 pt-4"
                style={{ color: "white" }}
              >
                {title}
              </p>
              <ul className="flex flex-col gap-3  ">
                {links.map(link => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm transition-colors "
                      style={{ color: "rgba(255,255,255,0.45)" }}
                      onMouseEnter={e => e.currentTarget.style.color = "#C9A84C"}
                      onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,0.45)"}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
              </div>
            ))}
         </div>
          <div
            className="py-2 flex flex-col md:flex-row items-start md:items-center justify-between gap-8"
            style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
          >
            {/* LEFT — Title + Subtitle */}
            <div className="flex-shrink-0">
              <p
                className="font-semibold mb-1"
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: "20px",
                  color: "white",
                }}
              >
                Stay in the Loop
              </p>
              <p
                className="text-xs"
                style={{ color: "rgba(255,255,255,0.4)", lineHeight: 1.6 }}
              >
                Get skincare tips and exclusive offers straight to your inbox.
              </p>
            </div>

            {/* RIGHT — Form */}
            <div className="flex-shrink-0">
              {subscribed ? (
                <div
                  className="flex items-center gap-3 px-5 py-3 rounded-2xl"
                  style={{
                    backgroundColor: "rgba(52,211,153,0.08)",
                    border: "1px solid rgba(52,211,153,0.2)",
                  }}
                >
                  <span>✅</span>
                  <div>
                    <p className="text-white font-semibold text-sm">You're subscribed!</p>
                    <p className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>
                      {successMsg}
                    </p>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex flex-col gap-2">
                  {/* Input + Button */}
                  <div className="flex gap-3">
                    <input
                      type="email"
                      value={email}
                      onChange={e => { setEmail(e.target.value); setError(""); }}
                      placeholder="your@email.com"
                      className="px-4 py-2.5 rounded-full text-sm text-white placeholder-gray-600 outline-none transition-all"
                      style={{
                        width: "220px",
                        backgroundColor: "rgba(255,255,255,0.06)",
                        border: error
                          ? "1px solid rgba(239,68,68,0.5)"
                          : "1px solid rgba(201,168,76,0.25)",
                      }}
                      onFocus={e => { if (!error) e.target.style.borderColor = "#C9A84C"; }}
                      onBlur={e => { if (!error) e.target.style.borderColor = "rgba(201,168,76,0.25)"; }}
                    />
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="px-5 py-2.5 rounded-full font-semibold text-sm transition-all hover:-translate-y-0.5 disabled:opacity-60 flex-shrink-0"
                      style={{
                        background: "linear-gradient(135deg, #C9A84C, #9A7A2E)",
                        color: "#0A1F14",
                      }}
                    >
                      {isLoading ? "..." : "Subscribe →"}
                    </button>
                  </div>

                  {/* Error */}
                  {error && (
                    <p className="text-xs pl-2" style={{ color: "#ef4444" }}>
                      ⚠ {error}
                    </p>
                  )}

                  {/* Privacy */}
                  <p className="text-xs pl-2" style={{ color: "rgba(255,255,255,0.25)" }}>
                    🔒 No spam. Unsubscribe anytime.
                  </p>
                </form>
              )}
            </div>
          </div>

        {/* ── FOOTER BOTTOM ── */}
        <div
          className="py-8 flex flex-col sm:flex-row items-center justify-between gap-4"
          style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
        >
          <p
            className="text-xs text-center sm:text-left"
            style={{ color: "rgba(255,255,255,0.3)" }}
          >
            © {new Date().getFullYear()}{" "}
            <span style={{ color: "#C9A84C" }}>Brook Skincare</span>
            . All rights reserved. Built with care in Stockholm, Sweden.
          </p>

          <div className="flex items-center gap-6">
            {[
              { label: "Privacy Policy", href: "/privacy" },
              { label: "Terms of Service", href: "/terms" },
            ].map(link => (
              <Link
                key={link.label}
                href={link.href}
                className="text-xs transition-colors"
                style={{ color: "rgba(255,255,255,0.3)" }}
                onMouseEnter={e => e.currentTarget.style.color = "#C9A84C"}
                onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,0.3)"}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* WhatsApp floating button */}
      <a
        href="https://wa.me/46790409411"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center text-2xl transition-all hover:scale-110 hover:shadow-2xl"
        style={{
          backgroundColor: "#25D366",
          boxShadow: "0 4px 20px rgba(37,211,102,0.4)",
        }}
        title="Chat with Brook on WhatsApp"
      >
        💬
      </a>
    </footer>
  );
}