"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Clock, BadgeDollarSign, ArrowRight } from "lucide-react";

type Service = {
  _id: string;
  name: string;
  description: string;
  price: number;
  duration: number;
  image: string;
  isActive: boolean;
};

export default function ServicesList() {
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    fetch("/api/admin/services")
      .then(res => res.json())
      .then(data => {
        setServices(data.services?.filter((s: Service) => s.isActive) || []);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, []);

  return (
    <section
      ref={sectionRef}
      className="py-24"
      style={{ backgroundColor: "#F0F7F2" }}
    >
      <div className="max-w-6xl mx-auto px-6">

        {/* ── HEADER ── */}
        <div
          className="mb-16"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? "translateY(0)" : "translateY(30px)",
            transition: "all 0.8s ease",
          }}
        >
          <span
            className="text-xs font-semibold tracking-widest uppercase mb-3 block"
            style={{ color: "#9A7A2E" }}
          >
            Available Services
          </span>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <h2
              className="font-light"
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "clamp(2rem, 4vw, 3rem)",
                color: "#0A1F14",
                lineHeight: 1.1,
              }}
            >
              Choose Your{" "}
              <strong
                className="font-semibold"
                style={{
                  background: "linear-gradient(135deg, #C9A84C, #9A7A2E)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Consultation
              </strong>
            </h2>
            <p
              className="text-sm max-w-xs text-right hidden md:block"
              style={{ color: "rgba(10,31,20,0.45)", lineHeight: 1.7 }}
            >
              All sessions online · Worldwide · Video call
            </p>
          </div>
        </div>

        {/* ── LOADING ── */}
        {isLoading && (
          <div className="flex justify-center py-20">
            <div
              className="w-10 h-10 rounded-full border-2 animate-spin"
              style={{ borderColor: "#C9A84C", borderTopColor: "transparent" }}
            />
          </div>
        )}

        {/* ── EMPTY ── */}
        {!isLoading && services.length === 0 && (
          <div className="text-center py-20">
            <p style={{ color: "rgba(10,31,20,0.4)" }}>
              Services coming soon. Check back shortly!
            </p>
          </div>
        )}

        {/* ── MAGAZINE STYLE ROWS ── */}
        {!isLoading && services.length > 0 && (
          <div className="flex flex-col">
            {services.map((service, i) => (
              <div
                key={service._id}
                className="group relative"
                style={{
                  opacity: isVisible ? 1 : 0,
                  transform: isVisible ? "translateY(0)" : "translateY(30px)",
                  transition: `all 0.7s ease ${i * 0.1}s`,
                }}
              >
                {/* ── ROW ── */}
                <div
                  className="grid grid-cols-12 gap-6 py-10 items-center"
                  style={{
                    borderBottom: "1px solid rgba(10,31,20,0.1)",
                  }}
                >
                  {/* Large number */}
                  <div className="col-span-2 hidden md:flex items-center justify-end">
                    <span
                      className="font-light transition-all duration-300"
                      style={{
                        fontFamily: "'Cormorant Garamond', serif",
                        fontSize: "clamp(48px, 8vw, 64px)",
                        color: "rgba(10,31,20,0.08)",
                        lineHeight: 1,
                      }}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>

                  {/* Gold vertical divider */}
                  <div
                    className="col-span-1 hidden md:flex justify-center"
                  >
                    <div
                      className="w-px h-full min-h-[80px] transition-all duration-300"
                      style={{
                        background: "linear-gradient(180deg, transparent, #C9A84C, transparent)",
                        opacity: 0.4,
                      }}
                    />
                  </div>

                  {/* Service name + desc */}
                  <div className="col-span-12 md:col-span-4">
                    <h3
                      className="font-semibold mb-2 transition-all duration-300 group-hover:translate-x-1"
                      style={{
                        fontFamily: "'Cormorant Garamond', serif",
                        fontSize: "clamp(1.4rem, 2.5vw, 1.8rem)",
                        color: "#0A1F14",
                        lineHeight: 1.2,
                      }}
                    >
                      {service.name}
                    </h3>
                    <p
                      className="text-sm leading-relaxed"
                      style={{
                        color: "rgba(10,31,20,0.55)",
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {service.description}
                    </p>
                  </div>

                  {/* Price + Duration */}
                  <div className="col-span-6 md:col-span-2 flex flex-col gap-3">
                    <div className="flex items-center gap-2">
                      <BadgeDollarSign
                        size={14}
                        style={{ color: "#C9A84C" }}
                      />
                      <span
                        className="font-bold"
                        style={{
                          fontFamily: "'Cormorant Garamond', serif",
                          fontSize: "22px",
                          color: "#9A7A2E",
                        }}
                      >
                        {service.price} kr
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock size={13} style={{ color: "rgba(10,31,20,0.4)" }} />
                      <span
                        className="text-sm"
                        style={{ color: "rgba(10,31,20,0.5)" }}
                      >
                        {service.duration} min
                      </span>
                    </div>
                  </div>

                  {/* Image thumbnail */}
                  {/* <div className="col-span-6 md:col-span-2">
                    <div
                      className="relative rounded-xl overflow-hidden"
                      style={{ aspectRatio: "4/3" }}
                    >
                      {service.image ? (
                        <Image
                          src={service.image}
                          alt={service.name}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                          sizes="20vw"
                        />
                      ) : (
                        <div
                          className="w-full h-full flex items-center justify-center text-2xl font-bold text-white"
                          style={{
                            background: "linear-gradient(135deg, #0A1F14, #1A3D2B)",
                            fontFamily: "'Cormorant Garamond', serif",
                          }}
                        >
                          {service.name.charAt(0)}
                        </div>
                      )}
                    </div>
                  </div> */}

                  {/* Book button */}
                  <div className="col-span-12 md:col-span-1 flex md:justify-end">
                    <Link
                      href="/login"
                      className="flex items-center gap-2 px-5 py-2.5 rounded-full font-semibold text-xs transition-all hover:-translate-y-0.5 hover:shadow-lg w-fit"
                      style={{
                        background: "linear-gradient(135deg, #C9A84C, #9A7A2E)",
                        color: "#0A1F14",
                        boxShadow: "0 4px 12px rgba(201,168,76,0.25)",
                      }}
                    >
                      Book
                      <ArrowRight size={12} />
                    </Link>
                  </div>
                </div>

                {/* Hover gold highlight line */}
                <div
                  className="absolute bottom-0 left-0 h-px transition-all duration-500"
                  style={{
                    background: "linear-gradient(90deg, #C9A84C, transparent)",
                    width: "0%",
                  }}
                  ref={el => {
                    if (el) {
                      el.style.width = "0%";
                    }
                  }}
                />
              </div>
            ))}
          </div>
        )}

        {/* ── BOTTOM NOTE ── */}
        {!isLoading && services.length > 0 && (
          <div
            className="flex items-center justify-between mt-10 pt-6"
            style={{ borderTop: "1px solid rgba(10,31,20,0.08)" }}
          >
            <p
              className="text-xs"
              style={{ color: "rgba(10,31,20,0.35)" }}
            >
              {services.length} service{services.length !== 1 ? "s" : ""} available
            </p>
            <p
              className="text-xs"
              style={{ color: "rgba(10,31,20,0.35)" }}
            >
              🌍 Online consultations · Available worldwide
            </p>
          </div>
        )}
      </div>
    </section>
  );
}