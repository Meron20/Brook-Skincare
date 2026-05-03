"use client";

import { useEffect, useState } from "react";
import {
  Calendar,
  Clock,
  Loader2,
  User,
  FileText,
  Search,
  Plus,
  Pencil,
  Trash2,
  X,
  ChevronDown,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";

type Customer = {
  _id: string;
  fullName?: string;
  email: string;
};

type Booking = {
  _id: string;
  customerId?: Customer;
  treatment: string;
  date: string;
  time: string;
  status: string;
  createdAt?: string;
};

type FormData = {
  customerId: string;
  treatment: string;
  date: string;
  time: string;
};

const emptyForm: FormData = {
  customerId: "",
  treatment: "",
  date: "",
  time: "",
};

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);

  const [search, setSearch] = useState("");
  const [customerSearch, setCustomerSearch] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [customerDropdownOpen, setCustomerDropdownOpen] = useState(false);
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null);
  const [formData, setFormData] = useState<FormData>(emptyForm);

  const [isSaving, setIsSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const fetchBookings = async () => {
    try {
      setLoading(true);

      const res = await fetch("/api/bookings");
      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Failed to fetch bookings.");
        return;
      }

      setBookings(Array.isArray(data) ? data : data.bookings || []);
    } catch {
      setError("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fetchCustomers = async () => {
    try {
      const res = await fetch("/api/customers");
      const data = await res.json();

      if (res.ok) {
        setCustomers(Array.isArray(data) ? data : data.customers || []);
      }
    } catch {
      setError("Failed to load customers.");
    }
  };

  useEffect(() => {
    fetchBookings();
    fetchCustomers();
  }, []);

  const selectedCustomer = customers.find(
    (customer) => customer._id === formData.customerId
  );

  const filteredCustomers = customers.filter((customer) => {
    const value = customerSearch.toLowerCase();

    return (
      customer.fullName?.toLowerCase().includes(value) ||
      customer.email.toLowerCase().includes(value)
    );
  });

  const filteredBookings = bookings.filter((booking) => {
    const value = search.toLowerCase();

    return (
      booking.treatment?.toLowerCase().includes(value) ||
      booking.customerId?.fullName?.toLowerCase().includes(value) ||
      booking.customerId?.email?.toLowerCase().includes(value) ||
      booking.status?.toLowerCase().includes(value) ||
      booking.date?.toLowerCase().includes(value) ||
      booking.time?.toLowerCase().includes(value)
    );
  });

  const openModal = (booking?: Booking) => {
    if (booking) {
      setEditingBooking(booking);
      setFormData({
        customerId: booking.customerId?._id || "",
        treatment: booking.treatment,
        date: booking.date,
        time: booking.time,
      });
      setCustomerSearch("");
    } else {
      setEditingBooking(null);
      setFormData(emptyForm);
      setCustomerSearch("");
    }

    setError("");
    setCustomerDropdownOpen(false);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingBooking(null);
    setFormData(emptyForm);
    setCustomerSearch("");
    setCustomerDropdownOpen(false);
    setError("");
  };

  const handleSave = async () => {
    if (
      !formData.customerId ||
      !formData.treatment ||
      !formData.date ||
      !formData.time
    ) {
      setError("All fields are required.");
      return;
    }

    setIsSaving(true);
    setError("");

    try {
      const url = editingBooking
        ? `/api/bookings/${editingBooking._id}`
        : "/api/bookings";

      const method = editingBooking ? "PUT" : "POST";

      const body = editingBooking
        ? {
            customerId: formData.customerId,
            treatment: formData.treatment,
            date: formData.date,
            time: formData.time,
            status: editingBooking.status || "Upcoming",
          }
        : formData;

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Something went wrong.");
        return;
      }

      await fetchBookings();
      closeModal();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/bookings/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        setError("Failed to delete booking.");
        return;
      }

      await fetchBookings();
      setDeleteConfirm(null);
    } catch {
      setError("Failed to delete booking.");
    }
  };

  const handleToggleStatus = async (booking: Booking) => {
  const newStatus = booking.status === "Completed" ? "Upcoming" : "Completed";
    try {
      const res = await fetch(`/api/bookings/${booking._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerId: booking.customerId?._id,
          treatment: booking.treatment,
          date: booking.date,
          time: booking.time,
          status: newStatus,
        }),
      });

      if (!res.ok) {
        setError("Failed to update booking status.");
        return;
      }

      await fetchBookings();
    } catch {
      setError("Failed to update booking status.");
    }
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <p className="text-gray-400 text-sm">
          {filteredBookings.length} booking
          {filteredBookings.length !== 1 ? "s" : ""} total
        </p>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative w-full md:w-80">
            <Search
              size={16}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search bookings..."
              className="w-full rounded-xl pl-11 pr-4 py-3 text-sm outline-none"
              style={{
                border: "1px solid rgba(30,21,72,0.15)",
                backgroundColor: "#fafafa",
              }}
            />
          </div>

          <Button
            onClick={() => openModal()}
            className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-medium"
            style={{
              background: "linear-gradient(135deg, #C9A96E, #1E1548)",
              color: "white",
            }}
          >
            <Plus size={15} />
            Add Booking
          </Button>
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

      {/* EMPTY */}
      {!loading && !error && filteredBookings.length === 0 && (
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
            <Calendar size={24} style={{ color: "#C9A96E" }} />
          </div>

          <div className="text-center">
            <p className="text-gray-500 text-sm font-medium">
              {bookings.length === 0 ? "No bookings yet" : "No bookings found"}
            </p>
            <p className="text-gray-400 text-xs mt-1">
              {bookings.length === 0
                ? "Bookings will appear here once created"
                : "Try searching for another customer, treatment or date"}
            </p>
          </div>
        </div>
      )}

      {/* TABLE */}
      {!loading && !error && filteredBookings.length > 0 && (
        <div
          className="rounded-2xl overflow-hidden"
          style={{ border: "1px solid rgba(30,21,72,0.1)" }}
        >
          <div
            className="grid grid-cols-10 md:grid-cols-14 px-6 py-4 text-xs font-semibold uppercase tracking-wider"
            style={{
              background: "linear-gradient(135deg, #1E1548, #2a1f5e)",
              color: "#C9A96E",
            }}
          >
            <div className="col-span-3">Customer</div>
            <div className="col-span-3">Treatment</div>
            <div className="hidden md:block md:col-span-2 text-center">
              Date
            </div>
            <div className="hidden md:block md:col-span-2 text-center">
              Time
            </div>
            <div className="col-span-2 text-center">Status</div>
            <div className="col-span-2 text-center">Actions</div>
          </div>

          <div className="divide-y divide-[rgba(30,21,72,0.06)]">
            {filteredBookings.map((booking, i) => (
              <div
                key={booking._id}
                className="grid grid-cols-10 md:grid-cols-14 px-6 py-4 items-center transition-colors duration-150"
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
                <div className="col-span-3 flex items-center gap-3 min-w-0">
                  <div
                    className="w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center text-white text-xs font-bold"
                    style={{
                      background: "linear-gradient(135deg, #C9A96E, #1E1548)",
                    }}
                  >
                    <User size={14} />
                  </div>

                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-[#1E1548] truncate">
                      {booking.customerId?.fullName || "Unknown customer"}
                    </p>
                    {booking.customerId?.email && (
                      <p className="text-xs text-gray-400 truncate">
                        {booking.customerId.email}
                      </p>
                    )}
                  </div>
                </div>

                <div className="col-span-3 flex items-center gap-2 min-w-0">
                  <FileText size={13} style={{ color: "#C9A96E" }} />
                  <span className="text-sm text-[#1E1548] font-medium truncate">
                    {booking.treatment}
                  </span>
                </div>

                <div className="hidden md:flex md:col-span-2 justify-center items-center gap-1 text-gray-400">
                  <Calendar size={13} />
                  <span className="text-xs">{booking.date}</span>
                </div>

                <div className="hidden md:flex md:col-span-2 justify-center items-center gap-1 text-gray-400">
                  <Clock size={13} />
                  <span className="text-xs">{booking.time}</span>
                </div>

                <div className="col-span-2 flex justify-center">
                  <button
                    onClick={() => handleToggleStatus(booking)}
                    className="text-xs px-3 py-1 rounded-full font-medium transition-all duration-200 hover:scale-105"
                    style={{
                      backgroundColor:
                        booking.status === "completed"
                          ? "rgba(52,211,153,0.14)"
                          : "rgba(201,169,110,0.12)",
                      color:
                        booking.status === "completed" ? "#059669" : "#1E1548",
                    }}
                  >
                    {booking.status || "pending"}
                  </button>
                </div>

                <div className="col-span-2 flex items-center justify-center gap-2">
                  <button
                    onClick={() => openModal(booking)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 hover:scale-105"
                    style={{
                      backgroundColor: "rgba(30,21,72,0.07)",
                      color: "#1E1548",
                    }}
                  >
                    <Pencil size={12} />
                    <span className="hidden sm:block">Edit</span>
                  </button>

                  <button
                    onClick={() => setDeleteConfirm(booking._id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 hover:scale-105"
                    style={{
                      backgroundColor: "rgba(239,68,68,0.08)",
                      color: "#dc2626",
                    }}
                  >
                    <Trash2 size={12} />
                    <span className="hidden sm:block">Delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div
            className="px-6 py-3 flex items-center justify-between"
            style={{
              backgroundColor: "rgba(248,247,255,0.9)",
              borderTop: "1px solid rgba(30,21,72,0.08)",
            }}
          >
            <p className="text-xs text-gray-400">
              Showing {filteredBookings.length} booking
              {filteredBookings.length !== 1 ? "s" : ""}
            </p>

            <p className="text-xs" style={{ color: "#C9A96E" }}>
              {bookings.length} total
            </p>
          </div>
        </div>
      )}

      {/* CREATE / EDIT MODAL */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{
            backgroundColor: "rgba(0,0,0,0.5)",
            backdropFilter: "blur(4px)",
          }}
        >
          <div className="w-full max-w-lg rounded-2xl overflow-visible shadow-2xl bg-white">
            <div
              className="flex items-center justify-between px-6 py-5 rounded-t-2xl"
              style={{
                background: "linear-gradient(135deg, #C9A96E, #1E1548)",
                color: "white",
              }}
            >
              <h2 className="text-white font-semibold text-lg">
                {editingBooking ? "Edit Booking" : "Add New Booking"}
              </h2>

              <button
                onClick={closeModal}
                className="text-white/70 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="px-6 py-6 space-y-4">
              {error && (
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

              {/* CUSTOMER DROPDOWN */}
              <div className="flex flex-col gap-1.5 relative">
                <label className="text-sm font-medium text-[#1E1548]">
                  Customer
                </label>

                <button
                  type="button"
                  onClick={() =>
                    setCustomerDropdownOpen(!customerDropdownOpen)
                  }
                  className="w-full px-4 py-3 rounded-xl text-sm outline-none flex items-center justify-between text-left"
                  style={{
                    border: "1px solid rgba(30,21,72,0.15)",
                    backgroundColor: "#fafafa",
                  }}
                >
                  <div className="min-w-0">
                    {selectedCustomer ? (
                      <>
                        <p className="font-medium text-[#1E1548] truncate">
                          {selectedCustomer.fullName || "Unnamed customer"}
                        </p>
                        <p className="text-xs text-gray-400 truncate">
                          {selectedCustomer.email}
                        </p>
                      </>
                    ) : (
                      <span className="text-gray-400">Select customer</span>
                    )}
                  </div>

                  <ChevronDown
                    size={17}
                    className={`text-gray-400 transition-transform ${
                      customerDropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {customerDropdownOpen && (
                  <div
                    className="absolute top-full left-0 right-0 mt-2 z-[70] rounded-2xl bg-white shadow-2xl overflow-hidden"
                    style={{
                      border: "1px solid rgba(30,21,72,0.12)",
                    }}
                  >
                    <div className="p-3 border-b border-[rgba(30,21,72,0.08)]">
                      <div className="relative">
                        <Search
                          size={15}
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                        />
                        <input
                          value={customerSearch}
                          onChange={(e) => setCustomerSearch(e.target.value)}
                          placeholder="Search customer..."
                          className="w-full rounded-xl pl-9 pr-3 py-2.5 text-sm outline-none"
                          style={{
                            border: "1px solid rgba(30,21,72,0.12)",
                            backgroundColor: "#fafafa",
                          }}
                        />
                      </div>
                    </div>

                    <div className="max-h-64 overflow-y-auto">
                      {filteredCustomers.length > 0 ? (
                        filteredCustomers.map((customer) => (
                          <button
                            key={customer._id}
                            type="button"
                            onClick={() => {
                              setFormData({
                                ...formData,
                                customerId: customer._id,
                              });
                              setCustomerSearch("");
                              setCustomerDropdownOpen(false);
                            }}
                            className="w-full px-4 py-3 flex items-center justify-between gap-3 text-left hover:bg-[rgba(201,169,110,0.06)] transition-colors"
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <div
                                className="w-9 h-9 rounded-xl flex-shrink-0 flex items-center justify-center text-white text-xs font-bold"
                                style={{
                                  background:
                                    "linear-gradient(135deg, #C9A96E, #1E1548)",
                                }}
                              >
                                {(customer.fullName || customer.email)
                                  .charAt(0)
                                  .toUpperCase()}
                              </div>

                              <div className="min-w-0">
                                <p className="text-sm font-semibold text-[#1E1548] truncate">
                                  {customer.fullName || "Unnamed customer"}
                                </p>
                                <p className="text-xs text-gray-400 truncate">
                                  {customer.email}
                                </p>
                              </div>
                            </div>

                            {formData.customerId === customer._id && (
                              <Check size={16} style={{ color: "#C9A96E" }} />
                            )}
                          </button>
                        ))
                      ) : (
                        <p className="px-4 py-5 text-sm text-gray-400 text-center">
                          No customers found
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-[#1E1548]">
                  Treatment
                </label>
                <input
                  value={formData.treatment}
                  onChange={(e) =>
                    setFormData({ ...formData, treatment: e.target.value })
                  }
                  placeholder="e.g. Hyperpigmentation Consultation"
                  className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                  style={{
                    border: "1px solid rgba(30,21,72,0.15)",
                    backgroundColor: "#fafafa",
                  }}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-[#1E1548]">
                    Date
                  </label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) =>
                      setFormData({ ...formData, date: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                    style={{
                      border: "1px solid rgba(30,21,72,0.15)",
                      backgroundColor: "#fafafa",
                    }}
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-[#1E1548]">
                    Time
                  </label>
                  <input
                    type="time"
                    value={formData.time}
                    onChange={(e) =>
                      setFormData({ ...formData, time: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                    style={{
                      border: "1px solid rgba(30,21,72,0.15)",
                      backgroundColor: "#fafafa",
                    }}
                  />
                </div>
              </div>
            </div>

            <div className="px-6 pb-6 flex gap-3">
              <Button
                onClick={closeModal}
                className="flex-1 py-3 rounded-xl text-sm font-medium"
                style={{
                  backgroundColor: "rgba(30,21,72,0.05)",
                  color: "#1E1548",
                }}
              >
                Cancel
              </Button>

              <Button
                onClick={handleSave}
                disabled={isSaving}
                className="flex-1 py-3 rounded-xl text-sm font-semibold"
                style={{
                  background: "linear-gradient(135deg, #C9A96E, #1E1548)",
                  color: "white",
                }}
              >
                {isSaving ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 size={16} className="animate-spin" />
                    Saving...
                  </span>
                ) : editingBooking ? (
                  "Save Changes"
                ) : (
                  "Create Booking"
                )}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRM */}
      {deleteConfirm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{
            backgroundColor: "rgba(0,0,0,0.5)",
            backdropFilter: "blur(4px)",
          }}
        >
          <div className="w-full max-w-sm rounded-2xl bg-white overflow-hidden shadow-2xl">
            <div className="px-6 py-6 text-center">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{ backgroundColor: "rgba(239,68,68,0.1)" }}
              >
                <Trash2 size={22} className="text-red-500" />
              </div>

              <h3 className="text-lg font-semibold text-[#1E1548] mb-2">
                Delete Booking?
              </h3>

              <p className="text-gray-400 text-sm">
                This action cannot be undone.
              </p>
            </div>

            <div className="px-6 pb-6 flex gap-3">
              <Button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 py-3 rounded-xl text-sm"
                style={{
                  backgroundColor: "rgba(30,21,72,0.05)",
                  color: "#1E1548",
                }}
              >
                Cancel
              </Button>

              <Button
                onClick={() => handleDelete(deleteConfirm)}
                className="flex-1 py-3 rounded-xl text-sm font-semibold bg-red-500 hover:bg-red-600 text-white"
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}