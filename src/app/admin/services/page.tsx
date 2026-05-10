"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  Clock,
  BadgeDollarSign,
  X,
  Loader2,
  ToggleLeft,
  ToggleRight,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { bg, text, border, palette, gradient } from "@/lib/theme";
import {
  PageError,
  EmptyState,
  TableSkeleton,
} from "@/components/admin/StateComponents";

type Service = {
  _id: string;
  name: string;
  description: string;
  price: number;
  duration: number;
  image: string;
  isActive: boolean;
};

type FormData = {
  name: string;
  description: string;
  price: string;
  duration: string;
  image: string;
};

const emptyForm: FormData = {
  name: "",
  description: "",
  price: "",
  duration: "",
  image: "",
};

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [formData, setFormData] = useState<FormData>(emptyForm);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const fetchServices = useCallback(async () => {
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("/api/admin/services");
      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Failed to load services.");
        return;
      }

      setServices(data.services || []);
    } catch {
      setError("Failed to load services.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  const openModal = (service?: Service) => {
    if (service) {
      setEditingService(service);
      setFormData({
        name: service.name,
        description: service.description,
        price: service.price.toString(),
        duration: service.duration.toString(),
        image: service.image,
      });
    } else {
      setEditingService(null);
      setFormData(emptyForm);
    }

    setError("");
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingService(null);
    setFormData(emptyForm);
    setError("");
  };

  const handleSave = async () => {
    if (
      !formData.name ||
      !formData.description ||
      !formData.price ||
      !formData.duration
    ) {
      setError("All fields are required.");
      return;
    }

    setIsSaving(true);
    setError("");

    try {
      const url = editingService
        ? `/api/admin/services/${editingService._id}`
        : "/api/admin/services";

      const method = editingService ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Something went wrong.");
        return;
      }

      await fetchServices();
      closeModal();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/services/${id}`, { method: "DELETE" });

      if (!res.ok) {
        setError("Failed to delete service.");
        return;
      }

      await fetchServices();
      setDeleteConfirm(null);
    } catch {
      setError("Failed to delete service.");
    }
  };

  const handleToggleActive = async (service: Service) => {
    try {
      const res = await fetch(`/api/admin/services/${service._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...service, isActive: !service.isActive }),
      });

      if (!res.ok) {
        setError("Failed to update service.");
        return;
      }

      await fetchServices();
    } catch {
      setError("Failed to update service.");
    }
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm" style={{ color: text.muted }}>
          {isLoading
            ? "Loading services..."
            : `${services.length} service${services.length !== 1 ? "s" : ""} total`}
        </p>

        <Button
          onClick={() => openModal()}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium"
          style={{ background: gradient.gold, color: bg.page }}
        >
          <Plus size={15} />
          Add Service
        </Button>
      </div>

      {/* STATES */}
      {isLoading && <TableSkeleton rows={6} />}

      {!isLoading && error && (
        <PageError message={error} onRetry={fetchServices} />
      )}

      {!isLoading && !error && services.length === 0 && (
        <EmptyState
          icon={<Sparkles size={24} style={{ color: palette.gold }} />}
          title="No services yet"
          description="Add your first service to get started"
        />
      )}

      {/* TABLE */}
      {!isLoading && !error && services.length > 0 && (
        <div
          className="rounded-2xl overflow-hidden"
          style={{ border: `1px solid ${border.subtle}` }}
        >
          <div
            className="grid grid-cols-8 md:grid-cols-12 px-6 py-4 text-xs font-semibold uppercase tracking-wider"
            style={{ background: gradient.sidebar, color: palette.gold }}
          >
            <div className="col-span-3 md:col-span-4">Service</div>
            <div className="hidden md:block md:col-span-3">Description</div>
            <div className="col-span-2 md:col-span-1 text-center">Price</div>
            <div className="col-span-1 text-center">Duration</div>
            <div className="col-span-1 text-center">Status</div>
            <div className="col-span-2 text-center">Actions</div>
          </div>

          <div>
            {services.map((service, i) => (
              <div
                key={service._id}
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
                <div className="col-span-3 md:col-span-4 flex items-center gap-3 min-w-0">
                  <div
                    className="w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center text-xs font-bold"
                    style={{ background: gradient.gold, color: bg.page }}
                  >
                    {service.name.charAt(0).toUpperCase()}
                  </div>

                  <span
                    className="text-sm font-semibold truncate"
                    style={{ color: text.primary }}
                  >
                    {service.name}
                  </span>
                </div>

                <div className="hidden md:block md:col-span-3 min-w-0">
                  <p className="text-xs truncate" style={{ color: text.muted }}>
                    {service.description}
                  </p>
                </div>

                <div className="col-span-2 md:col-span-1 text-center">
                  <div
                    className="flex items-center justify-center gap-1"
                    style={{ color: palette.gold }}
                  >
                    <BadgeDollarSign size={13} />
                    <span className="text-sm font-semibold">{service.price}</span>
                  </div>
                </div>

                <div className="col-span-1 text-center">
                  <div
                    className="flex items-center justify-center gap-1"
                    style={{ color: text.muted }}
                  >
                    <Clock size={13} />
                    <span className="text-xs">{service.duration}m</span>
                  </div>
                </div>

                <div className="col-span-1 flex justify-center">
                  <button
                    onClick={() => handleToggleActive(service)}
                    className="transition-all duration-200 hover:scale-110"
                  >
                    {service.isActive ? (
                      <ToggleRight size={28} style={{ color: "#34d399" }} />
                    ) : (
                      <ToggleLeft size={28} style={{ color: "#d1d5db" }} />
                    )}
                  </button>
                </div>

                <div className="col-span-2 flex items-center justify-center gap-2">
                  <button
                    onClick={() => openModal(service)}
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
                    onClick={() => setDeleteConfirm(service._id)}
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
              Showing {services.length} service{services.length !== 1 ? "s" : ""}
            </p>

            <p className="text-xs" style={{ color: palette.gold }}>
              {services.filter((s) => s.isActive).length} active
            </p>
          </div>
        </div>
      )}

      {/* CREATE / EDIT MODAL */}
      {modalOpen && (
        <ModalWrapper>
          <div
            className="w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl"
            style={{ backgroundColor: bg.card }}
          >
            <ModalHeader
              title={editingService ? "Edit Service" : "Add New Service"}
              onClose={closeModal}
            />

            <div className="px-6 py-6 space-y-4">
              {error && <PageError message={error} />}

              <InputField
                label="Service Name"
                value={formData.name}
                onChange={(value) => setFormData({ ...formData, name: value })}
                placeholder="e.g. Hyperpigmentation Consultation"
              />

              <TextAreaField
                label="Description"
                value={formData.description}
                onChange={(value) =>
                  setFormData({ ...formData, description: value })
                }
                placeholder="Describe what this service includes..."
              />

              <div className="grid grid-cols-2 gap-4">
                <InputField
                  label="Price (kr)"
                  type="number"
                  value={formData.price}
                  onChange={(value) =>
                    setFormData({ ...formData, price: value })
                  }
                  placeholder="e.g. 500"
                />

                <InputField
                  label="Duration (min)"
                  type="number"
                  value={formData.duration}
                  onChange={(value) =>
                    setFormData({ ...formData, duration: value })
                  }
                  placeholder="e.g. 60"
                />
              </div>

              <InputField
                label="Image URL"
                optional
                value={formData.image}
                onChange={(value) => setFormData({ ...formData, image: value })}
                placeholder="https://..."
              />
            </div>

            <div className="px-6 pb-6 flex gap-3">
              <Button
                onClick={closeModal}
                className="flex-1 py-3 rounded-xl text-sm font-medium"
                style={{ backgroundColor: bg.hover, color: text.primary }}
              >
                Cancel
              </Button>

              <Button
                onClick={handleSave}
                disabled={isSaving}
                className="flex-1 py-3 rounded-xl text-sm font-semibold"
                style={{ background: gradient.gold, color: bg.page }}
              >
                {isSaving ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 size={16} className="animate-spin" />
                    Saving...
                  </span>
                ) : editingService ? (
                  "Save Changes"
                ) : (
                  "Create Service"
                )}
              </Button>
            </div>
          </div>
        </ModalWrapper>
      )}

      {/* DELETE CONFIRM */}
      {deleteConfirm && (
        <ModalWrapper>
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
                Delete Service?
              </h3>

              <p className="text-sm" style={{ color: text.muted }}>
                This action cannot be undone.
              </p>
            </div>

            <div className="px-6 pb-6 flex gap-3">
              <Button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 py-3 rounded-xl text-sm"
                style={{ backgroundColor: bg.hover, color: text.primary }}
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
        </ModalWrapper>
      )}
    </div>
  );
}

function ModalWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{
        backgroundColor: "rgba(0,0,0,0.5)",
        backdropFilter: "blur(4px)",
      }}
    >
      {children}
    </div>
  );
}

function ModalHeader({
  title,
  onClose,
}: {
  title: string;
  onClose: () => void;
}) {
  return (
    <div
      className="flex items-center justify-between px-6 py-5"
      style={{ background: gradient.gold, color: bg.page }}
    >
      <h2 className="font-semibold text-lg">{title}</h2>

      <button
        onClick={onClose}
        className="text-white/70 hover:text-white transition-colors"
      >
        <X size={20} />
      </button>
    </div>
  );
}

function InputField({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  optional = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  optional?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium" style={{ color: text.primary }}>
        {label}{" "}
        {optional && (
          <span className="font-normal" style={{ color: text.muted }}>
            (optional)
          </span>
        )}
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

function TextAreaField({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium" style={{ color: text.primary }}>
        {label}
      </label>

      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={3}
        className="w-full px-4 py-3 rounded-xl text-sm outline-none resize-none"
        style={{
          border: `1px solid ${border.subtle}`,
          backgroundColor: bg.card,
          color: text.primary,
        }}
      />
    </div>
  );
}