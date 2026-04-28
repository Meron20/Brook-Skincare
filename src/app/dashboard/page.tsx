"use client";

import { useEffect, useState } from "react";
import { Users, Calendar, FileText, TrendingUp } from "lucide-react";

export default function DashboardPage() {
  const [customerCount, setCustomerCount] = useState(0);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("/api/customers");
        const data = await res.json();

        if (Array.isArray(data)) {
          setCustomerCount(data.length);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchStats();
  }, []);

  const cards = [
    {
      title: "Customers",
      value: customerCount.toString(),
      description: "Registered customers",
      icon: Users,
    },
    {
      title: "Bookings",
      value: "0",
      description: "Total bookings",
      icon: Calendar,
    },
    {
      title: "Journal Notes",
      value: "0",
      description: "Saved notes",
      icon: FileText,
    },
    {
      title: "Activity",
      value: "0",
      description: "Recent actions",
      icon: TrendingUp,
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <section className="bg-white rounded-3xl p-6 shadow-sm">
        <p className="text-sm text-gray-500">Dashboard</p>
        <h1 className="text-3xl font-bold text-[#1E1548] mt-1">
          Welcome to Brook Skincare Admin
        </h1>
        <p className="text-gray-500 mt-2">
          Manage customers, bookings and journal notes from one place.
        </p>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {cards.map((card) => {
          const Icon = card.icon;

          return (
            <div key={card.title} className="bg-white rounded-3xl p-6 shadow-sm">
              <div className="w-12 h-12 rounded-2xl bg-[#1E1548] text-white flex items-center justify-center mb-4">
                <Icon size={20} />
              </div>
              <h2 className="text-lg font-semibold text-[#1E1548]">
                {card.title}
              </h2>
              <p className="text-3xl font-bold mt-2">{card.value}</p>
              <p className="text-sm text-gray-500 mt-1">{card.description}</p>
            </div>
          );
        })}
      </section>
    </div>
  );
}