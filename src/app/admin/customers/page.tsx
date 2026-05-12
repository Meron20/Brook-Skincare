"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Search, Mail, ArrowRight, User } from "lucide-react";
import { bg, text, border, palette, gradient } from "@/lib/theme";
import {
  PageError,
  EmptyState,
  TableSkeleton,
} from "@/components/admin/StateComponents";

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

  const fetchCustomers = useCallback(async () => {
    setLoading(true);
    setError("");
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
  }, []);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  const filteredCustomers = customers.filter((c) => {
    const v = search.toLowerCase();
    return (
      (c.fullName || "").toLowerCase().includes(v) ||
      c.email.toLowerCase().includes(v)
    );
  });

  return (
    <div className="space-y-6">
      {/* Header row */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <p className="text-sm" style={{ color: text.muted }}>
          {customers.length} customer{customers.length !== 1 ? "s" : ""} total
        </p>

        <div className="relative w-full md:max-w-sm">
          <Search
            size={16}
            className="absolute left-4 top-1/2 -translate-y-1/2"
            style={{ color: text.muted }}
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search customers..."
            className="w-full rounded-xl pl-11 pr-4 py-3 text-sm outline-none"
            style={{
              backgroundColor: bg.card,
              border: `1px solid ${border.subtle}`,
              color: text.primary,
            }}
          />
        </div>
      </div>

      {/* States */}
      {loading && <TableSkeleton rows={6} />}

      {!loading && error && (
        <PageError message={error} onRetry={fetchCustomers} />
      )}

      {!loading && !error && filteredCustomers.length === 0 && (
        <EmptyState
          icon={<User size={22} style={{ color: palette.gold }} />}
          title={search ? "No customers match your search" : "No customers yet"}
          description={
            search
              ? "Try searching with a different name or email"
              : "Customers will appear here once they register or book a service"
          }
        />
      )}

      {/* Table */}
      {!loading && !error && filteredCustomers.length > 0 && (
        <div
          className="rounded-2xl overflow-hidden"
          style={{ border: `1px solid ${border.subtle}` }}
        >
          {/* Table header */}
          <div
            className="grid grid-cols-8 md:grid-cols-12 px-6 py-4 text-xs font-semibold uppercase tracking-wider"
            style={{ background: gradient.sidebar, color: palette.gold }}
          >
            <div className="col-span-3 md:col-span-4">Customer</div>
            <div className="hidden md:block md:col-span-4">Email</div>
            <div className="col-span-3 md:col-span-2 text-center">Skin Concern</div>
            <div className="col-span-2 text-center">Actions</div>
          </div>

          {/* Rows */}
          <div>
            {filteredCustomers.map((customer, i) => (
              <div
                key={customer._id}
                className="grid grid-cols-8 md:grid-cols-12 px-6 py-4 items-center transition-colors duration-150"
                style={{
                  backgroundColor: i % 2 === 0 ? bg.card : bg.hover,
                  borderTop: `1px solid ${border.subtle}`,
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = `${palette.gold}0d`)
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor =
                    i % 2 === 0 ? bg.card : bg.hover)
                }
              >
                {/* Name */}
                <div className="col-span-3 md:col-span-4 flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center text-xs font-bold"
                    style={{
                      background: gradient.gold,
                      color: bg.page,
                    }}
                  >
                    {(customer.fullName || customer.email).charAt(0).toUpperCase()}
                  </div>
                  <span
                    className="text-sm font-semibold truncate"
                    style={{ color: text.primary }}
                  >
                    {customer.fullName || "Unnamed customer"}
                  </span>
                </div>

                {/* Email */}
                <div
                  className="hidden md:flex md:col-span-4 items-center gap-2"
                  style={{ color: text.muted }}
                >
                  <Mail size={13} />
                  <p className="text-xs truncate">{customer.email}</p>
                </div>

                {/* Skin concern */}
                <div className="col-span-3 md:col-span-2 text-center">
                  <span className="text-xs truncate block" style={{ color: text.muted }}>
                    {customer.skinConcern || "—"}
                  </span>
                </div>

                {/* Action */}
                <div className="col-span-2 flex items-center justify-center">
                  <Link
                    href={`/admin/customers/${customer._id}`}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 hover:scale-105"
                    style={{
                      backgroundColor: `${palette.gold}1a`,
                      color: palette.gold,
                      border: `1px solid ${border.gold}`,
                    }}
                  >
                    <span className="hidden sm:block">View</span>
                    <ArrowRight size={12} />
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div
            className="px-6 py-3 flex items-center justify-between"
            style={{
              borderTop: `1px solid ${border.subtle}`,
              backgroundColor: bg.hover,
            }}
          >
            <p className="text-xs" style={{ color: text.muted }}>
              Showing {filteredCustomers.length} customer
              {filteredCustomers.length !== 1 ? "s" : ""}
            </p>
            <p className="text-xs" style={{ color: palette.gold }}>
              {customers.length} total
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
