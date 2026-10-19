"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Clock } from "lucide-react";

type BookingService = {
  _id: string;
  name: string;
  price: number;
  duration: number;
};

export default function SelectedService() {
  const [service, setService] = useState<BookingService | null>(null);

  useEffect(() => {
    const saved = sessionStorage.getItem("booking_service");
    if (saved) setService(JSON.parse(saved));
  }, []);

  // No service chosen yet: show nothing
  if (!service) return null;

  return (
    <div
      className="max-w-2xl mx-auto mt-5 flex items-center justify-between rounded-xl px-4 py-3"
      style={{
        backgroundColor: "rgba(201,168,76,0.08)",
        border: "1px solid rgba(201,168,76,0.25)",
      }}
    >
      <div>
        <p className="text-xs" style={{ color: "rgba(10,31,20,0.45)" }}>
          Selected service
        </p>
        <p className="text-sm font-semibold" style={{ color: "#0A1F14" }}>
          {service.name}
        </p>
      </div>

      <div className="flex items-center gap-4">
        <span className="flex items-center gap-1 text-xs" style={{ color: "rgba(10,31,20,0.5)" }}>
          <Clock size={12} />
          {service.duration} min
        </span>
        <span className="text-sm font-bold" style={{ color: "#9A7A2E" }}>
          {service.price} kr
        </span>
        <Link
          href="/services"
          className="text-xs font-medium hover:underline"
          style={{ color: "#C9A84C" }}
        >
          Change
        </Link>
      </div>
    </div>
  );
}