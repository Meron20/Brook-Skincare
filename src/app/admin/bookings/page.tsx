"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Calendar,
  Clock,
  User,
  FileText,
  Search,
  Plus,
  Pencil,
  Trash2,
  X,
  ChevronDown,
  Check,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
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

  const fetchBookings = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
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
  }, []);

  const fetchCustomers = useCallback(async () => {
    try {
      const res = await fetch("/api/customers");
      const data = await res.json();

      if (res.ok) {
        setCustomers(Array.isArray(data) ? data : data.customers || []);
      }
    } catch {
      setError("Failed to load customers.");
    }
  }, []);

  useEffect(() => {
    fetchBookings();
    fetchCustomers();
  }, [fetchBookings, fetchCustomers]);

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
    } else {
      setEditingBooking(null);
      setFormData(emptyForm);
    }

    setError("");
    setCustomerSearch("");
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
        <p className="text-sm" style={{ color: text.muted }}>
          {loading
            ? "Loading bookings..."
            : `${filteredBookings.length} booking${
                filteredBookings.length !== 1 ? "s" : ""
              } shown`}
        </p>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative w-full md:w-80">
            <Search
              size={16}
              className="absolute left-4 top-1/2 -translate-y-1/2"
              style={{ color: text.muted }}
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search bookings..."
              disabled={loading}
              className="w-full rounded-xl pl-11 pr-4 py-3 text-sm outline-none disabled:opacity-60"
              style={{
                backgroundColor: bg.card,
                border: `1px solid ${border.subtle}`,
                color: text.primary,
              }}
            />
          </div>

          <Button
            onClick={() => openModal()}
            className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-medium"
            style={{
              background: gradient.gold,
              color: bg.page,
            }}
          >
            <Plus size={15} />
            Add Booking
          </Button>
        </div>
      </div>

      {/* STATES */}
      {loading && <TableSkeleton rows={6} />}

      {!loading && error && (
        <PageError message={error} onRetry={fetchBookings} />
      )}

      {!loading && !error && filteredBookings.length === 0 && (
        <EmptyState
          icon={<Calendar size={24} style={{ color: palette.gold }} />}
          title={bookings.length === 0 ? "No bookings yet" : "No bookings found"}
          description={
            bookings.length === 0
              ? "Bookings will appear here once created"
              : "Try searching for another customer, treatment or date"
          }
        />
      )}

      {/* TABLE */}
      {!loading && !error && filteredBookings.length > 0 && (
        <div
          className="rounded-2xl overflow-hidden"
          style={{ border: `1px solid ${border.subtle}` }}
        >
          <div
            className="grid grid-cols-10 md:grid-cols-14 px-6 py-4 text-xs font-semibold uppercase tracking-wider"
            style={{ background: gradient.sidebar, color: palette.gold }}
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

          <div>
            {filteredBookings.map((booking, i) => (
              <div
                key={booking._id}
                className="grid grid-cols-10 md:grid-cols-14 px-6 py-4 items-center transition-colors duration-150"
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
                <div className="col-span-3 flex items-center gap-3 min-w-0">
                  <div
                    className="w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center text-xs font-bold"
                    style={{
                      background: gradient.gold,
                      color: bg.page,
                    }}
                  >
                    <User size={14} />
                  </div>

                  <div className="min-w-0">
                    <p
                      className="text-sm font-semibold truncate"
                      style={{ color: text.primary }}
                    >
                      {booking.customerId?.fullName || "Unknown customer"}
                    </p>
                    {booking.customerId?.email && (
                      <p
                        className="text-xs truncate"
                        style={{ color: text.muted }}
                      >
                        {booking.customerId.email}
                      </p>
                    )}
                  </div>
                </div>

                <div className="col-span-3 flex items-center gap-2 min-w-0">
                  <FileText size={13} style={{ color: palette.gold }} />
                  <span
                    className="text-sm font-medium truncate"
                    style={{ color: text.primary }}
                  >
                    {booking.treatment}
                  </span>
                </div>

                <div
                  className="hidden md:flex md:col-span-2 justify-center items-center gap-1"
                  style={{ color: text.muted }}
                >
                  <Calendar size={13} />
                  <span className="text-xs">{booking.date}</span>
                </div>

                <div
                  className="hidden md:flex md:col-span-2 justify-center items-center gap-1"
                  style={{ color: text.muted }}
                >
                  <Clock size={13} />
                  <span className="text-xs">{booking.time}</span>
                </div>

                <div className="col-span-2 flex justify-center">
                  <button
                    onClick={() => handleToggleStatus(booking)}
                    className="text-xs px-3 py-1 rounded-full font-medium transition-all duration-200 hover:scale-105"
                    style={{
                      backgroundColor:
                        booking.status === "Completed"
                          ? "rgba(52,211,153,0.14)"
                          : `${palette.gold}1f`,
                      color:
                        booking.status === "Completed"
                          ? "#059669"
                          : text.primary,
                    }}
                  >
                    {booking.status || "Upcoming"}
                  </button>
                </div>

                <div className="col-span-2 flex items-center justify-center gap-2">
                  <button
                    onClick={() => openModal(booking)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 hover:scale-105"
                    style={{
                      backgroundColor: `${palette.gold}1a`,
                      color: palette.gold,
                      border: `1px solid ${border.gold}`,
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
                      border: "1px solid rgba(239,68,68,0.2)",
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
              borderTop: `1px solid ${border.subtle}`,
              backgroundColor: bg.hover,
            }}
          >
            <p className="text-xs" style={{ color: text.muted }}>
              Showing {filteredBookings.length} booking
              {filteredBookings.length !== 1 ? "s" : ""}
            </p>

            <p className="text-xs" style={{ color: palette.gold }}>
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
          <div
            className="w-full max-w-lg rounded-2xl overflow-visible shadow-2xl"
            style={{ backgroundColor: bg.card }}
          >
            <div
              className="flex items-center justify-between px-6 py-5 rounded-t-2xl"
              style={{
                background: gradient.gold,
                color: bg.page,
              }}
            >
              <h2 className="font-semibold text-lg">
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
              {error && <PageError message={error} />}

              <div className="flex flex-col gap-1.5 relative">
                <label
                  className="text-sm font-medium"
                  style={{ color: text.primary }}
                >
                  Customer
                </label>

                <button
                  type="button"
                  onClick={() =>
                    setCustomerDropdownOpen(!customerDropdownOpen)
                  }
                  className="w-full px-4 py-3 rounded-xl text-sm outline-none flex items-center justify-between text-left"
                  style={{
                    border: `1px solid ${border.subtle}`,
                    backgroundColor: bg.card,
                    color: text.primary,
                  }}
                >
                  <div className="min-w-0">
                    {selectedCustomer ? (
                      <>
                        <p className="font-medium truncate">
                          {selectedCustomer.fullName || "Unnamed customer"}
                        </p>
                        <p
                          className="text-xs truncate"
                          style={{ color: text.muted }}
                        >
                          {selectedCustomer.email}
                        </p>
                      </>
                    ) : (
                      <span style={{ color: text.muted }}>Select customer</span>
                    )}
                  </div>

                  <ChevronDown
                    size={17}
                    className={`transition-transform ${
                      customerDropdownOpen ? "rotate-180" : ""
                    }`}
                    style={{ color: text.muted }}
                  />
                </button>

                {customerDropdownOpen && (
                  <div
                    className="absolute top-full left-0 right-0 mt-2 z-[70] rounded-2xl shadow-2xl overflow-hidden"
                    style={{
                      border: `1px solid ${border.subtle}`,
                      backgroundColor: bg.card,
                    }}
                  >
                    <div className="p-3" style={{ borderBottom: `1px solid ${border.subtle}` }}>
                      <div className="relative">
                        <Search
                          size={15}
                          className="absolute left-3 top-1/2 -translate-y-1/2"
                          style={{ color: text.muted }}
                        />
                        <input
                          value={customerSearch}
                          onChange={(e) => setCustomerSearch(e.target.value)}
                          placeholder="Search customer..."
                          className="w-full rounded-xl pl-9 pr-3 py-2.5 text-sm outline-none"
                          style={{
                            border: `1px solid ${border.subtle}`,
                            backgroundColor: bg.card,
                            color: text.primary,
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
                            className="w-full px-4 py-3 flex items-center justify-between gap-3 text-left transition-colors"
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <div
                                className="w-9 h-9 rounded-xl flex-shrink-0 flex items-center justify-center text-xs font-bold"
                                style={{
                                  background: gradient.gold,
                                  color: bg.page,
                                }}
                              >
                                {(customer.fullName || customer.email)
                                  .charAt(0)
                                  .toUpperCase()}
                              </div>

                              <div className="min-w-0">
                                <p
                                  className="text-sm font-semibold truncate"
                                  style={{ color: text.primary }}
                                >
                                  {customer.fullName || "Unnamed customer"}
                                </p>
                                <p
                                  className="text-xs truncate"
                                  style={{ color: text.muted }}
                                >
                                  {customer.email}
                                </p>
                              </div>
                            </div>

                            {formData.customerId === customer._id && (
                              <Check size={16} style={{ color: palette.gold }} />
                            )}
                          </button>
                        ))
                      ) : (
                        <p className="px-4 py-5 text-sm text-center" style={{ color: text.muted }}>
                          No customers found
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <InputField
                label="Treatment"
                value={formData.treatment}
                onChange={(value) =>
                  setFormData({ ...formData, treatment: value })
                }
                placeholder="e.g. Hyperpigmentation Consultation"
              />

              <div className="grid grid-cols-2 gap-4">
                <InputField
                  label="Date"
                  type="date"
                  value={formData.date}
                  onChange={(value) => setFormData({ ...formData, date: value })}
                />

                <InputField
                  label="Time"
                  type="time"
                  value={formData.time}
                  onChange={(value) => setFormData({ ...formData, time: value })}
                />
              </div>
            </div>

            <div className="px-6 pb-6 flex gap-3">
              <Button
                onClick={closeModal}
                className="flex-1 py-3 rounded-xl text-sm font-medium"
                style={{
                  backgroundColor: bg.hover,
                  color: text.primary,
                }}
              >
                Cancel
              </Button>

              <Button
                onClick={handleSave}
                disabled={isSaving}
                className="flex-1 py-3 rounded-xl text-sm font-semibold"
                style={{
                  background: gradient.gold,
                  color: bg.page,
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
          <div
            className="w-full max-w-sm rounded-2xl overflow-hidden shadow-2xl"
            style={{ backgroundColor: bg.card }}
          >
            <div className="px-6 py-6 text-center">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{ backgroundColor: "rgba(239,68,68,0.1)" }}
              >
                <Trash2 size={22} className="text-red-500" />
              </div>

              <h3
                className="text-lg font-semibold mb-2"
                style={{ color: text.primary }}
              >
                Delete Booking?
              </h3>

              <p className="text-sm" style={{ color: text.muted }}>
                This action cannot be undone.
              </p>
            </div>

            <div className="px-6 pb-6 flex gap-3">
              <Button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 py-3 rounded-xl text-sm"
                style={{
                  backgroundColor: bg.hover,
                  color: text.primary,
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

function InputField({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium" style={{ color: text.primary }}>
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-4 py-3 rounded-xl text-sm outline-none"
        style={{
          border: `1px solid ${border.subtle}`,
          backgroundColor: bg.card,
          color: text.primary,
        }}
      />
    </div>
  );
}