"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Search, User, Mail, ArrowRight } from "lucide-react";

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
      } catch (err) {
        console.error(err);
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
    <div className="flex flex-col gap-6">
      {/* Header */}
      <section className="bg-white rounded-3xl p-6 shadow-sm">
        <p className="text-sm text-gray-500">Dashboard / Customers</p>
        <h1 className="text-3xl font-bold text-[#1E1548] mt-1">Customers</h1>
        <p className="text-gray-500 mt-2">
          View and manage all registered customers.
        </p>
      </section>

      {/* Search */}
      <section className="bg-white rounded-3xl p-6 shadow-sm">
        <div className="relative max-w-md">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search customers..."
            className="w-full rounded-xl border border-gray-200 pl-10 pr-4 py-3 text-sm outline-none"
          />
        </div>
      </section>

      {/* Status */}
      {loading && (
        <div className="bg-white rounded-3xl p-6 shadow-sm">
          <p className="text-gray-500">Loading customers...</p>
        </div>
      )}

      {error && (
        <div className="bg-white rounded-3xl p-6 shadow-sm">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {/* Customers */}
      {!loading && !error && (
        <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredCustomers.length > 0 ? (
            filteredCustomers.map((customer) => (
              <div
                key={customer._id}
                className="bg-white rounded-3xl p-6 shadow-sm flex flex-col gap-4"
              >
                <div className="w-12 h-12 rounded-2xl bg-[#1E1548] text-white flex items-center justify-center">
                  <User size={20} />
                </div>

                <div>
                  <h2 className="text-xl font-bold text-[#1E1548]">
                    {customer.fullName || "Unnamed customer"}
                  </h2>

                  <div className="flex items-center gap-2 text-sm text-gray-500 mt-2">
                    <Mail size={14} />
                    <span>{customer.email}</span>
                  </div>
                </div>

                <Link
                  href={`/admin/customers/${customer._id}`}
                  className="mt-auto inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-medium"
                  style={{ backgroundColor: "#C9A96E", color: "#1E1548" }}
                >
                  View Customer Card
                  <ArrowRight size={16} />
                </Link>
              </div>
            ))
          ) : (
            <div className="bg-white rounded-3xl p-6 shadow-sm">
              <p className="text-sm text-gray-500">No customers found.</p>
            </div>
          )}
        </section>
      )}
    </div>
  );
}