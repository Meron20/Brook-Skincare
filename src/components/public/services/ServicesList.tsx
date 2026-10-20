"use client";

import { useEffect, useRef, useState } from "react";
import { Clock, BadgeDollarSign, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

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
  const router = useRouter();
  const { status } = useSession();

  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  // ─────────────────────────────────────────────
  // ANIMATION OBSERVER
  // ─────────────────────────────────────────────
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // ─────────────────────────────────────────────
  // FETCH ACTIVE SERVICES
  // ─────────────────────────────────────────────
  useEffect(() => {
    fetch("/api/admin/services")
      .then((res) => res.json())
      .then((data) => {
        setServices(
          data.services?.filter(
            (service: Service) => service.isActive
          ) || []
        );

        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Failed to load services:", error);
        setIsLoading(false);
      });
  }, []);

  // ─────────────────────────────────────────────
  // BOOK SERVICE
  // ─────────────────────────────────────────────
  const handleBook = (service: Service) => {
    // Wait until NextAuth knows whether the customer
    // is logged in or not.
    if (status === "loading") {
      return;
    }

    // Save selected service.
    // This stays in sessionStorage even if the customer
    // needs to visit the login page first.
    sessionStorage.setItem(
      "booking_service",
      JSON.stringify({
        _id: service._id,
        name: service.name,
        price: service.price,
        duration: service.duration,
      })
    );

    // ───────────────────────────────────────────
    // NOT LOGGED IN
    // ───────────────────────────────────────────
    if (status === "unauthenticated") {
      // Remember where the customer should continue
      // after successful login.
      sessionStorage.setItem(
        "booking_return_to",
        "/booking/slot"
      );

      router.push("/login");
      return;
    }

    // ───────────────────────────────────────────
    // ALREADY LOGGED IN
    // ───────────────────────────────────────────
    sessionStorage.removeItem("booking_return_to");

    router.push("/booking/slot");
  };

  return (
    <section
      ref={sectionRef}
      className="py-24"
      style={{ backgroundColor: "#F0F7F2" }}
    >
      <div className="mx-auto max-w-6xl px-6">
        {/* ───────────────────────────────────────
            HEADER
        ─────────────────────────────────────── */}
        <div
          className="mb-16"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible
              ? "translateY(0)"
              : "translateY(30px)",
            transition: "all 0.8s ease",
          }}
        >
          <span
            className="mb-3 block text-xs font-semibold uppercase tracking-widest"
            style={{ color: "#9A7A2E" }}
          >
            Available Services
          </span>

          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
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
                  background:
                    "linear-gradient(135deg, #C9A84C, #9A7A2E)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Consultation
              </strong>
            </h2>

            <p
              className="hidden max-w-xs text-right text-sm md:block"
              style={{
                color: "rgba(10,31,20,0.45)",
                lineHeight: 1.7,
              }}
            >
              All sessions online · Worldwide · Video call
            </p>
          </div>
        </div>

        {/* ───────────────────────────────────────
            LOADING
        ─────────────────────────────────────── */}
        {isLoading && (
          <div className="flex justify-center py-20">
            <div
              className="h-10 w-10 animate-spin rounded-full border-2"
              style={{
                borderColor: "#C9A84C",
                borderTopColor: "transparent",
              }}
            />
          </div>
        )}

        {/* ───────────────────────────────────────
            EMPTY
        ─────────────────────────────────────── */}
        {!isLoading && services.length === 0 && (
          <div className="py-20 text-center">
            <p
              style={{
                color: "rgba(10,31,20,0.4)",
              }}
            >
              Services coming soon. Check back shortly!
            </p>
          </div>
        )}

        {/* ───────────────────────────────────────
            SERVICES
        ─────────────────────────────────────── */}
        {!isLoading && services.length > 0 && (
          <div className="flex flex-col">
            {services.map((service, i) => (
              <div
                key={service._id}
                className="group relative"
                style={{
                  opacity: isVisible ? 1 : 0,
                  transform: isVisible
                    ? "translateY(0)"
                    : "translateY(30px)",
                  transition: `all 0.7s ease ${i * 0.1}s`,
                }}
              >
                {/* ROW */}
                <div
                  className="grid grid-cols-12 items-center gap-6 py-10"
                  style={{
                    borderBottom:
                      "1px solid rgba(10,31,20,0.1)",
                  }}
                >
                  {/* NUMBER */}
                  <div className="col-span-2 hidden items-center justify-end md:flex">
                    <span
                      className="font-light transition-all duration-300"
                      style={{
                        fontFamily:
                          "'Cormorant Garamond', serif",
                        fontSize:
                          "clamp(48px, 8vw, 64px)",
                        color: "rgba(10,31,20,0.08)",
                        lineHeight: 1,
                      }}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>

                  {/* GOLD DIVIDER */}
                  <div className="col-span-1 hidden justify-center md:flex">
                    <div
                      className="h-full min-h-[80px] w-px transition-all duration-300"
                      style={{
                        background:
                          "linear-gradient(180deg, transparent, #C9A84C, transparent)",
                        opacity: 0.4,
                      }}
                    />
                  </div>

                  {/* SERVICE INFO */}
                  <div className="col-span-12 md:col-span-4">
                    <h3
                      className="mb-2 font-semibold transition-all duration-300 group-hover:translate-x-1"
                      style={{
                        fontFamily:
                          "'Cormorant Garamond', serif",
                        fontSize:
                          "clamp(1.4rem, 2.5vw, 1.8rem)",
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

                  {/* PRICE + DURATION */}
                  <div className="col-span-6 flex flex-col gap-3 md:col-span-2">
                    <div className="flex items-center gap-2">
                      <BadgeDollarSign
                        size={14}
                        style={{ color: "#C9A84C" }}
                      />

                      <span
                        className="font-bold"
                        style={{
                          fontFamily:
                            "'Cormorant Garamond', serif",
                          fontSize: "22px",
                          color: "#9A7A2E",
                        }}
                      >
                        {service.price} kr
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Clock
                        size={13}
                        style={{
                          color: "rgba(10,31,20,0.4)",
                        }}
                      />

                      <span
                        className="text-sm"
                        style={{
                          color: "rgba(10,31,20,0.5)",
                        }}
                      >
                        {service.duration} min
                      </span>
                    </div>
                  </div>

                  {/* BOOK BUTTON */}
                  <div className="col-span-12 flex md:col-span-1 md:justify-end">
                    <button
                      type="button"
                      onClick={() => handleBook(service)}
                      disabled={status === "loading"}
                      className="flex w-fit items-center gap-2 rounded-full px-5 py-2.5 text-xs font-semibold transition-all hover:-translate-y-0.5 hover:shadow-lg disabled:cursor-wait disabled:opacity-60"
                      style={{
                        background:
                          "linear-gradient(135deg, #C9A84C, #9A7A2E)",
                        color: "#0A1F14",
                        boxShadow:
                          "0 4px 12px rgba(201,168,76,0.25)",
                      }}
                    >
                      {status === "loading"
                        ? "Loading..."
                        : "Book"}

                      <ArrowRight size={12} />
                    </button>
                  </div>
                </div>

                {/* HOVER GOLD LINE */}
                <div
                  className="absolute bottom-0 left-0 h-px transition-all duration-500"
                  style={{
                    background:
                      "linear-gradient(90deg, #C9A84C, transparent)",
                    width: "0%",
                  }}
                  ref={(el) => {
                    if (el) {
                      el.style.width = "0%";
                    }
                  }}
                />
              </div>
            ))}
          </div>
        )}

        {/* ───────────────────────────────────────
            BOTTOM NOTE
        ─────────────────────────────────────── */}
        {!isLoading && services.length > 0 && (
          <div
            className="mt-10 flex items-center justify-between pt-6"
            style={{
              borderTop:
                "1px solid rgba(10,31,20,0.08)",
            }}
          >
            <p
              className="text-xs"
              style={{
                color: "rgba(10,31,20,0.35)",
              }}
            >
              {services.length} service
              {services.length !== 1 ? "s" : ""} available
            </p>

            <p
              className="text-xs"
              style={{
                color: "rgba(10,31,20,0.35)",
              }}
            >
              🌍 Online consultations · Available worldwide
            </p>
          </div>
        )}
      </div>
    </section>
  );
}