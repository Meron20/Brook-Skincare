"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Search,
  User,
  Mail,
  ArrowRight,
  Loader2,
} from "lucide-react";

type Customer = {
  _id: string;
  fullName?: string;
  email: string;
  phone?: string;
  skinConcern?: string;
};

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const res = await fetch("/api/customers");
        const data = await res.json();

        if (!res.ok) {
          setError(data.message || "Failed to fetch customers.");
          return;
        }

        setCustomers(Array.isArray(data) ? data : []);
      } catch {
        setError("Server error. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  const filteredCustomers = customers.filter((customer) => {
    const value = search.toLowerCase();

    return (
      (customer.fullName || "").toLowerCase().includes(value) ||
      customer.email.toLowerCase().includes(value)
    );
  });

  return (
    <div className="space-y-6">
      {/* HEADER ROW */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <p className="text-gray-400 text-sm">
          {customers.length} customer{customers.length !== 1 ? "s" : ""} total
        </p>

        <div className="relative w-full md:max-w-sm">
          <Search
            size={16}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search customers..."
            className="w-full rounded-xl pl-11 pr-4 py-3 text-sm outline-none"
            style={{
              border: "1px solid rgba(30,21,72,0.15)",
              backgroundColor: "#fafafa",
            }}
          />
        </div>
      </div>

      {/* LOADING */}
      {loading && (
        <div className="flex items-center justify-center py-20">
          <Loader2
            size={32}
            className="animate-spin"
            style={{ color: "#C9A96E" }}
          />
        </div>
      )}

      {/* ERROR */}
      {!loading && error && (
        <div
          className="px-4 py-3 rounded-xl text-sm text-red-600"
          style={{
            backgroundColor: "rgba(239,68,68,0.08)",
            border: "1px solid rgba(239,68,68,0.2)",
          }}
        >
          {error}
        </div>
      )}

      {/* EMPTY STATE */}
      {!loading && !error && filteredCustomers.length === 0 && (
        <div
          className="flex flex-col items-center justify-center py-20 gap-4 rounded-2xl"
          style={{
            border: "1px dashed rgba(201,169,110,0.3)",
            backgroundColor: "rgba(201,169,110,0.03)",
          }}
        >
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center"
            style={{
              background:
                "linear-gradient(135deg, rgba(201,169,110,0.15), rgba(30,21,72,0.15))",
            }}
          >
            <User size={24} style={{ color: "#C9A96E" }} />
          </div>

          <div className="text-center">
            <p className="text-gray-500 text-sm font-medium">
              No customers found
            </p>
            <p className="text-gray-400 text-xs mt-1">
              Try searching for another name or email
            </p>
          </div>
        </div>
      )}

      {/* TABLE */}
      {!loading && !error && filteredCustomers.length > 0 && (
        <div
          className="rounded-2xl overflow-hidden"
          style={{ border: "1px solid rgba(30,21,72,0.1)" }}
        >
          {/* Table header */}
          <div
            className="grid grid-cols-8 md:grid-cols-12 px-6 py-4 text-xs font-semibold uppercase tracking-wider"
            style={{
              background: "linear-gradient(135deg, #1E1548, #2a1f5e)",
              color: "#C9A96E",
            }}
          >
            <div className="col-span-3 md:col-span-4">Customer</div>
            <div className="hidden md:block md:col-span-4">Email</div>
            <div className="col-span-3 md:col-span-2 text-center">
              Skin Concern
            </div>
            <div className="col-span-2 text-center">Actions</div>
          </div>

          {/* Table rows */}
          <div className="divide-y divide-[rgba(30,21,72,0.06)]">
            {filteredCustomers.map((customer, i) => (
              <div
                key={customer._id}
                className="grid grid-cols-8 md:grid-cols-12 px-6 py-4 items-center transition-colors duration-150"
                style={{
                  backgroundColor:
                    i % 2 === 0 ? "white" : "rgba(248,247,255,0.8)",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor =
                    "rgba(201,169,110,0.05)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor =
                    i % 2 === 0 ? "white" : "rgba(248,247,255,0.8)")
                }
              >
                {/* Customer */}
                <div className="col-span-3 md:col-span-4 flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center text-white text-xs font-bold"
                    style={{
                      background: "linear-gradient(135deg, #C9A96E, #1E1548)",
                    }}
                  >
                    {(customer.fullName || customer.email)
                      .charAt(0)
                      .toUpperCase()}
                  </div>

                  <span className="text-sm font-semibold text-[#1E1548] truncate">
                    {customer.fullName || "Unnamed customer"}
                  </span>
                </div>

                {/* Email */}
                <div className="hidden md:flex md:col-span-4 items-center gap-2 text-gray-400">
                  <Mail size={13} />
                  <p className="text-xs truncate">{customer.email}</p>
                </div>

                {/* Skin concern */}
                <div className="col-span-3 md:col-span-2 text-center">
                  <span className="text-xs text-gray-400 truncate block">
                    {customer.skinConcern || "—"}
                  </span>
                </div>

                {/* Actions */}
                <div className="col-span-2 flex items-center justify-center">
                  <Link
                    href={`/admin/customers/${customer._id}`}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 hover:scale-105"
                    style={{
                      backgroundColor: "rgba(30,21,72,0.07)",
                      color: "#1E1548",
                    }}
                  >
                    <span className="hidden sm:block">View</span>
                    <ArrowRight size={12} />
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Table footer */}
          <div
            className="px-6 py-3 flex items-center justify-between"
            style={{
              backgroundColor: "rgba(248,247,255,0.9)",
              borderTop: "1px solid rgba(30,21,72,0.08)",
            }}
          >
            <p className="text-xs text-gray-400">
              Showing {filteredCustomers.length} customer
              {filteredCustomers.length !== 1 ? "s" : ""}
            </p>

            <p className="text-xs" style={{ color: "#C9A96E" }}>
              {customers.length} total
            </p>
          </div>
        </div>
      )}
    </div>
  );
}