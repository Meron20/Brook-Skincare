"use client";

import { useState, useEffect } from "react";
import {
  Plus, Pencil, Trash2, Clock,
  BadgeDollarSign, X, Loader2, ToggleLeft, ToggleRight
} from "lucide-react";
import { Button } from "@/components/ui/button";

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

  const fetchServices = async () => {
    try {
      const res = await fetch("/api/services");
      const data = await res.json();
      setServices(data.services || []);
    } catch {
      setError("Failed to load services");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchServices(); }, []);

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
    if (!formData.name || !formData.description || !formData.price || !formData.duration) {
      setError("All fields are required");
      return;
    }
    setIsSaving(true);
    setError("");
    try {
      const url = editingService ? `/api/services/${editingService._id}` : "/api/services";
      const method = editingService ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.message || "Something went wrong");
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
      await fetch(`/api/services/${id}`, { method: "DELETE" });
      await fetchServices();
      setDeleteConfirm(null);
    } catch {
      setError("Failed to delete service");
    }
  };

  const handleToggleActive = async (service: Service) => {
    try {
      await fetch(`/api/services/${service._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...service, isActive: !service.isActive }),
      });
      await fetchServices();
    } catch {
      setError("Failed to update service");
    }
  };

  return (
    <div className="space-y-6">

      {/* ── HEADER ROW ── */}
      <div className="flex items-center justify-between">
        <p className="text-gray-400 text-sm">
          {services.length} service{services.length !== 1 ? "s" : ""} total
        </p>
        <Button
          onClick={() => openModal()}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium"
          style={{ background: "linear-gradient(135deg, #C9A96E, #1E1548)", color: "white" }}
        >
          <Plus size={15} />
          Add Service
        </Button>
      </div>

      {/* ── LOADING ── */}
      {isLoading && (
        <div className="flex items-center justify-center py-20">
          <Loader2 size={32} className="animate-spin" style={{ color: "#C9A96E" }} />
        </div>
      )}

      {/* ── EMPTY STATE ── */}
      {!isLoading && services.length === 0 && (
        <div
          className="flex flex-col items-center justify-center py-20 gap-4 rounded-2xl"
          style={{ border: "1px dashed rgba(201,169,110,0.3)", backgroundColor: "rgba(201,169,110,0.03)" }}
        >
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, rgba(201,169,110,0.15), rgba(30,21,72,0.15))" }}
          >
            <Plus size={24} style={{ color: "#C9A96E" }} />
          </div>
          <div className="text-center">
            <p className="text-gray-500 text-sm font-medium">No services yet</p>
            <p className="text-gray-400 text-xs mt-1">Add your first service to get started</p>
          </div>
          <Button
            onClick={() => openModal()}
            className="px-5 py-2 rounded-xl text-sm"
            style={{ background: "linear-gradient(135deg, #C9A96E, #1E1548)", color: "white" }}
          >
            Add your first service
          </Button>
        </div>
      )}

      {/* ── TABLE ── */}
      {!isLoading && services.length > 0 && (
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
            <div className="col-span-3 md:col-span-4">Service</div>
            <div className="hidden md:block md:col-span-3">Description</div>
            <div className="col-span-2 md:col-span-1 text-center">Price</div>
            <div className="col-span-1 text-center">Duration</div>
            <div className="col-span-1 text-center">Status</div>
            <div className="col-span-2 md:text-center sm:mt-2 md:mt-0 ">Actions</div>
        </div>

          {/* Table rows */}
          <div className="divide-y divide-[rgba(30,21,72,0.06)]">
            {services.map((service, i) => (
             <div
                    key={service._id}
                    className="grid grid-cols-8 md:grid-cols-12 px-6 py-4 items-center transition-colors duration-150"
                    style={{
                    backgroundColor: i % 2 === 0 ? "white" : "rgba(248,247,255,0.8)",
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "rgba(201,169,110,0.05)"}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = i % 2 === 0 ? "white" : "rgba(248,247,255,0.8)"}
                >
                {/* Service name */}
                <div className="col-span-3 md:col-span-4 flex items-center gap-3">
                 <div
                    className="w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center text-white text-xs font-bold"
                    style={{ background: "linear-gradient(135deg, #C9A96E, #1E1548)" }}
                    >
                  {service.name.charAt(0).toUpperCase()}
                 </div>
                 <span className="text-sm font-semibold text-[#1E1548] truncate">
                   {service.name}
                 </span>
             </div>


                {/* Description */}
                <div className="hidden md:block md:col-span-3">
                    <p className="text-xs text-gray-400 truncate">{service.description}</p>
                </div>


                {/* Price */}
                <div className="col-span-2 md:col-span-1 text-center">
                  <div className="flex items-center justify-center gap-1" style={{ color: "#C9A96E" }}>
                    <BadgeDollarSign size={13} />
                    <span className="text-sm font-semibold">{service.price}</span>
                  </div>
                </div>

                {/* Duration */}
                <div className="col-span-1 text-center">
                  <div className="flex items-center justify-center gap-1 text-gray-400">
                    <Clock size={13} />
                    <span className="text-xs">{service.duration}m</span>
                   </div>
                </div>
                {/* Status toggle */}
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
                
             <div className="col-span-2 mt-2 flex items-center justify-center gap-2">
                <button
                    onClick={() => openModal(service)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 hover:scale-105"
                    style={{ backgroundColor: "rgba(30,21,72,0.07)", color: "#1E1548" }}
                    >
                   <Pencil size={12} />
                   <span className="hidden sm:block">Edit</span>
                </button>
                <button
                    onClick={() => setDeleteConfirm(service._id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 hover:scale-105"
                    style={{ backgroundColor: "rgba(30,21,72,0.07)", color: "#1E1548" }}
                    >
                  <Trash2 size={12} />
                  <span className="hidden sm:block">Delete</span>
                </button>
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
              Showing {services.length} service{services.length !== 1 ? "s" : ""}
            </p>
            <p className="text-xs" style={{ color: "#C9A96E" }}>
              {services.filter(s => s.isActive).length} active
            </p>
          </div>
        </div>
      )}

      {/* ── CREATE / EDIT MODAL ── */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" }}
        >
          <div className="w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl bg-white">
            <div
              className="flex items-center justify-between px-6 py-5"
              style={{ background: "linear-gradient(135deg, #C9A96E, #1E1548)", color: "white" }}
        
            >
              <h2 className="text-white font-semibold text-lg">
                {editingService ? "Edit Service" : "Add New Service"}
              </h2>
              <button onClick={closeModal} className="text-white/70 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="px-6 py-6 space-y-4">
              {error && (
                <div
                  className="px-4 py-3 rounded-xl text-sm text-red-600"
                  style={{ backgroundColor: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)" }}
                >
                  {error}
                </div>
              )}

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-[#1E1548]">Service Name</label>
                <input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Hyperpigmentation Consultation"
                  className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                  style={{ border: "1px solid rgba(30,21,72,0.15)", backgroundColor: "#fafafa" }}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-[#1E1548]">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe what this service includes..."
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl text-sm outline-none resize-none"
                  style={{ border: "1px solid rgba(30,21,72,0.15)", backgroundColor: "#fafafa" }}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-[#1E1548]">Price (kr)</label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="e.g. 500"
                    className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                    style={{ border: "1px solid rgba(30,21,72,0.15)", backgroundColor: "#fafafa" }}
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-[#1E1548]">Duration (min)</label>
                  <input
                    type="number"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    placeholder="e.g. 60"
                    className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                    style={{ border: "1px solid rgba(30,21,72,0.15)", backgroundColor: "#fafafa" }}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-[#1E1548]">
                  Image URL <span className="text-gray-400 font-normal">(optional)</span>
                </label>
                <input
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="https://..."
                  className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                  style={{ border: "1px solid rgba(30,21,72,0.15)", backgroundColor: "#fafafa" }}
                />
              </div>
            </div>

            <div className="px-6 pb-6 flex gap-3">
              <Button
                onClick={closeModal}
                className="flex-1 py-3 rounded-xl text-sm font-medium"
                style={{ backgroundColor: "rgba(30,21,72,0.05)", color: "#1E1548" }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                disabled={isSaving}
                className="flex-1 py-3 rounded-xl text-sm font-semibold"
                style={{ background: "linear-gradient(135deg, #C9A96E, #1E1548)", color: "white" }}
              >
                {isSaving ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 size={16} className="animate-spin" />
                    Saving...
                  </span>
                ) : editingService ? "Save Changes" : "Create Service"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ── DELETE CONFIRM ── */}
      {deleteConfirm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" }}
        >
          <div className="w-full max-w-sm rounded-2xl bg-white overflow-hidden shadow-2xl">
            <div className="px-6 py-6 text-center">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{ backgroundColor: "rgba(239,68,68,0.1)" }}
              >
                <Trash2 size={22} className="text-red-500" />
              </div>
              <h3 className="text-lg font-semibold text-[#1E1548] mb-2">Delete Service?</h3>
              <p className="text-gray-400 text-sm">This action cannot be undone.</p>
            </div>
            <div className="px-6 pb-6 flex gap-3">
              <Button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 py-3 rounded-xl text-sm"
                style={{ backgroundColor: "rgba(30,21,72,0.05)", color: "#1E1548" }}
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