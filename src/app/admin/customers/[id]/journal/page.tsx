"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  AlertCircle,
  BookOpen,
  CheckCircle,
  ChevronDown,
  ClipboardList,
  Clock,
  Edit3,
  Eye,
  Loader2,
  Plus,
  Save,
  Search,
  Trash2,
  X,
  User,
} from "lucide-react";
import { bg, text, border, palette, gradient } from "@/lib/theme";

type CustomerRef = {
  _id: string;
  fullName?: string;
  name?: string;
  email?: string;
};

type JournalNote = {
  _id: string;
  customerId?: string | CustomerRef;
  title?: string;
  content?: string;
  note?: string;
  createdBy?: string;
  createdAt?: string;
  updatedAt?: string;
};

type Customer = {
  _id: string;
  fullName?: string;
  name?: string;
  email?: string;
  createdAt?: string;
};

type ConsultationForm = {
  _id: string;
  fullName?: string;
  email?: string;
  age?: string;
  location?: string;
  ethnicity?: string;
  fitzpatrickType?: string;
  mainConcern?: string;
  concernDuration?: string;
  sunWorsens?: string;
  triggers?: string[];
  medicalHistory?: string;
  morningRoutine?: string;
  eveningRoutine?: string;
  previousTreatments?: string;
  skinPhotos?: string[];
  productPhotos?: string[];
  goals?: string;
  budget?: string;
  language?: string;
  extraNotes?: string;
  createdAt?: string;
};

export default function AdminCustomerJournalPage() {
  const params = useParams();
  const customerId = params?.id as string;

  const [customer, setCustomer] = useState<Customer | null>(null);
  const [notes, setNotes] = useState<JournalNote[]>([]);
  const [forms, setForms] = useState<ConsultationForm[]>([]);
  const [selectedForm, setSelectedForm] = useState<ConsultationForm | null>(null);

  const [loading, setLoading] = useState(true);
  const [formsLoading, setFormsLoading] = useState(false);
  const [search, setSearch] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingNote, setEditingNote] = useState<JournalNote | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  useEffect(() => {
    if (!customerId) return;
    const load = async () => {
      setLoading(true);
      setFormsLoading(true);
      try {
        const res = await fetch(`/api/customers/${customerId}`);
        const data = await res.json();
        if (!res.ok) {
          setCustomer(null);
          setNotes([]);
          setForms([]);
          setSelectedForm(null);
          return;
        }
        setCustomer(data.customer || null);
        setNotes(Array.isArray(data.notes) ? data.notes : []);
        setForms(Array.isArray(data.consultationForms) ? data.consultationForms : []);
        setSelectedForm(data.consultationForms?.[0] || null);
      } catch (error) {
        console.error(error);
        setCustomer(null);
        setNotes([]);
        setForms([]);
        setSelectedForm(null);
      } finally {
        setLoading(false);
        setFormsLoading(false);
      }
    };
    load();
  }, [customerId]);

  const displayName = customer?.fullName || customer?.name || "Client";
  const displayEmail = customer?.email || "";

  const filtered = notes.filter((n) => {
    const noteTitle = n.title || "";
    const noteContent = n.content || n.note || "";
    return (
      noteTitle.toLowerCase().includes(search.toLowerCase()) ||
      noteContent.toLowerCase().includes(search.toLowerCase())
    );
  });

  const openNew = () => {
    setEditingNote(null);
    setTitle("");
    setContent("");
    setSaveMsg(null);
    setShowForm(true);
  };

  const openEdit = (note: JournalNote) => {
    setEditingNote(note);
    setTitle(note.title || "");
    setContent(note.content || note.note || "");
    setSaveMsg(null);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingNote(null);
    setTitle("");
    setContent("");
    setSaveMsg(null);
  };

  const handleSave = async () => {
    if (!title.trim() || !content.trim()) {
      setSaveMsg({ type: "err", text: "Title and content are required." });
      return;
    }
    setSaving(true);
    setSaveMsg(null);
    try {
      if (editingNote) {
        const res = await fetch(`/api/journal-notes/${editingNote._id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title: title.trim(), content: content.trim() }),
        });
        if (!res.ok) throw new Error();
        const updated: JournalNote = await res.json();
        setNotes((prev) => prev.map((n) => (n._id === updated._id ? updated : n)));
        setSaveMsg({ type: "ok", text: "Note updated." });
      } else {
        const res = await fetch("/api/journal-notes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ customerId, title: title.trim(), content: content.trim() }),
        });
        if (!res.ok) throw new Error();
        const created: JournalNote = await res.json();
        setNotes((prev) => [created, ...prev]);
        setSaveMsg({ type: "ok", text: "Note saved." });
      }
      setTimeout(() => { setSaveMsg(null); closeForm(); }, 1000);
    } catch {
      setSaveMsg({ type: "err", text: "Failed to save. Please try again." });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      const res = await fetch(`/api/journal-notes/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      setNotes((prev) => prev.filter((n) => n._id !== id));
    } finally {
      setDeletingId(null);
      setConfirmDeleteId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <p
            className="mb-1 text-xs font-bold uppercase tracking-[0.25em]"
            style={{ color: palette.gold }}
          >
            Client Journal
          </p>
          {loading ? (
            <div
              className="h-8 w-48 animate-pulse rounded-lg"
              style={{ backgroundColor: "rgba(255,255,255,0.08)" }}
            />
          ) : (
            <h1
              className="text-2xl font-semibold"
              style={{ color: text.primary }}
            >
              {displayName}
            </h1>
          )}
          {displayEmail && (
            <p className="mt-0.5 text-sm" style={{ color: text.muted }}>
              {displayEmail}
            </p>
          )}
        </div>

        <button
          type="button"
          onClick={openNew}
          className="flex items-center gap-2 self-start rounded-xl px-5 py-3 text-sm font-semibold transition-all hover:opacity-90 md:self-auto"
          style={{
            background: gradient.gold,
            color: bg.page,
          }}
        >
          <Plus size={16} strokeWidth={2.5} />
          New Journal Entry
        </button>
      </div>

      {/* STAT CARDS */}
      {!loading && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <StatCard label="Total Notes" value={notes.length} />
          <StatCard
            label="This Month"
            value={
              notes.filter((n) => {
                if (!n.createdAt) return false;
                return new Date(n.createdAt).getMonth() === new Date().getMonth();
              }).length
            }
          />
          <StatCard
            label="Last Entry"
            value={
              notes[0]?.createdAt
                ? new Date(notes[0].createdAt).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                  })
                : "—"
            }
          />
          <StatCard label="Forms" value={forms.length} />
        </div>
      )}

      {/* MAIN LAYOUT */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_380px]">
        {/* LEFT: Notes */}
        <main>
          {/* Search */}
          <div className="relative mb-5">
            <Search
              size={15}
              className="absolute left-4 top-1/2 -translate-y-1/2"
              style={{ color: text.muted }}
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search notes by title or content..."
              className="w-full rounded-xl py-3 pl-11 pr-4 text-sm outline-none transition"
              style={{
                backgroundColor: bg.card,
                border: `1px solid ${border.subtle}`,
                color: text.primary,
              }}
            />
          </div>

          {/* Editor */}
          {showForm && (
            <JournalEditor
              editingNote={editingNote}
              title={title}
              content={content}
              saving={saving}
              saveMsg={saveMsg}
              setTitle={setTitle}
              setContent={setContent}
              onSave={handleSave}
              onClose={closeForm}
            />
          )}

          {/* Note list */}
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 size={24} className="animate-spin" style={{ color: palette.gold }} />
            </div>
          ) : filtered.length === 0 ? (
            <EmptyNotesState search={search} onNew={openNew} />
          ) : (
            <div className="space-y-3">
              <p
                className="text-[10px] font-bold uppercase tracking-[0.25em]"
                style={{ color: text.muted }}
              >
                {filtered.length} {filtered.length === 1 ? "entry" : "entries"}
                {search && ` matching "${search}"`}
              </p>

              {filtered.map((note) => (
                <NoteCard
                  key={note._id}
                  note={note}
                  isConfirmingDelete={confirmDeleteId === note._id}
                  isDeleting={deletingId === note._id}
                  onEdit={() => openEdit(note)}
                  onDeleteRequest={() => setConfirmDeleteId(note._id)}
                  onDeleteConfirm={() => handleDelete(note._id)}
                  onDeleteCancel={() => setConfirmDeleteId(null)}
                />
              ))}
            </div>
          )}
        </main>

        {/* RIGHT: Consultation form */}
        <aside>
          <ConsultationFormViewer
            forms={forms}
            selectedForm={selectedForm}
            setSelectedForm={setSelectedForm}
            loading={formsLoading}
          />
        </aside>
      </div>
    </div>
  );
}

/* ─── Stat Card ─────────────────────────────────────────────────────────── */

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div
      className="rounded-2xl px-5 py-4"
      style={{
        backgroundColor: bg.card,
        border: `1px solid ${border.subtle}`,
      }}
    >
      <p
        className="text-[10px] font-bold uppercase tracking-[0.2em]"
        style={{ color: palette.gold }}
      >
        {label}
      </p>
      <p className="mt-1 text-2xl font-semibold" style={{ color: text.primary }}>
        {value}
      </p>
    </div>
  );
}

/* ─── Journal Editor ─────────────────────────────────────────────────────── */

function JournalEditor({
  editingNote,
  title,
  content,
  saving,
  saveMsg,
  setTitle,
  setContent,
  onSave,
  onClose,
}: {
  editingNote: JournalNote | null;
  title: string;
  content: string;
  saving: boolean;
  saveMsg: { type: "ok" | "err"; text: string } | null;
  setTitle: (v: string) => void;
  setContent: (v: string) => void;
  onSave: () => void;
  onClose: () => void;
}) {
  return (
    <div
      className="mb-6 overflow-hidden rounded-2xl"
      style={{
        backgroundColor: bg.card,
        border: `1px solid ${border.gold}`,
      }}
    >
      {/* Gold top bar */}
      <div className="h-[3px]" style={{ background: gradient.gold }} />

      {/* Header */}
      <div
        className="flex items-center justify-between px-6 py-4"
        style={{ borderBottom: `1px solid ${border.subtle}` }}
      >
        <div className="flex items-center gap-3">
          <div
            className="flex h-8 w-8 items-center justify-center rounded-xl"
            style={{
              backgroundColor: `${palette.gold}20`,
              border: `1px solid ${border.gold}`,
            }}
          >
            {editingNote ? (
              <Edit3 size={14} style={{ color: palette.gold }} />
            ) : (
              <Plus size={14} style={{ color: palette.gold }} />
            )}
          </div>
          <div>
            <p className="text-sm font-bold" style={{ color: text.primary }}>
              {editingNote ? "Edit Note" : "New Journal Entry"}
            </p>
            <p className="text-xs" style={{ color: text.muted }}>
              Add clinical observations, plans, and follow-up notes.
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="flex h-8 w-8 items-center justify-center rounded-xl transition hover:bg-white/10"
          style={{ color: text.muted }}
        >
          <X size={16} />
        </button>
      </div>

      {/* Fields */}
      <div className="space-y-4 p-6">
        <div>
          <label
            className="mb-2 block text-[10px] font-bold uppercase tracking-[0.2em]"
            style={{ color: palette.gold }}
          >
            Title *
          </label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Initial Consultation Notes"
            className="w-full rounded-xl px-4 py-3 text-sm outline-none transition"
            style={{
              backgroundColor: bg.hover,
              border: `1px solid ${border.subtle}`,
              color: text.primary,
            }}
          />
        </div>

        <div>
          <label
            className="mb-2 block text-[10px] font-bold uppercase tracking-[0.2em]"
            style={{ color: palette.gold }}
          >
            Content *
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={8}
            placeholder="Write notes..."
            className="w-full resize-y rounded-xl px-4 py-3 text-sm leading-relaxed outline-none transition"
            style={{
              backgroundColor: bg.hover,
              border: `1px solid ${border.subtle}`,
              color: text.primary,
            }}
          />
        </div>
      </div>

      {/* Footer */}
      <div
        className="flex items-center justify-between px-6 py-4"
        style={{ borderTop: `1px solid ${border.subtle}`, backgroundColor: bg.hover }}
      >
        <button
          type="button"
          onClick={onClose}
          className="rounded-xl px-5 py-2.5 text-sm font-semibold transition hover:bg-white/5"
          style={{ border: `1px solid ${border.subtle}`, color: text.muted }}
        >
          Cancel
        </button>

        <div className="flex items-center gap-3">
          {saveMsg && (
            <p
              className="flex items-center gap-1.5 text-sm"
              style={{ color: saveMsg.type === "ok" ? "#6ee7a0" : "#f87171" }}
            >
              {saveMsg.type === "ok" ? <CheckCircle size={14} /> : <AlertCircle size={14} />}
              {saveMsg.text}
            </p>
          )}

          <button
            type="button"
            onClick={onSave}
            disabled={saving}
            className="flex items-center gap-2 rounded-xl px-6 py-2.5 text-sm font-bold transition-all hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            style={{ background: gradient.gold, color: bg.page }}
          >
            {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
            {saving ? "Saving..." : editingNote ? "Update Note" : "Save Note"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Note Card ──────────────────────────────────────────────────────────── */

function NoteCard({
  note,
  isConfirmingDelete,
  isDeleting,
  onEdit,
  onDeleteRequest,
  onDeleteConfirm,
  onDeleteCancel,
}: {
  note: JournalNote;
  isConfirmingDelete: boolean;
  isDeleting: boolean;
  onEdit: () => void;
  onDeleteRequest: () => void;
  onDeleteConfirm: () => void;
  onDeleteCancel: () => void;
}) {
  const [open, setOpen] = useState(false);

  const noteTitle = note.title || "Untitled note";
  const noteContent = note.content || note.note || "";
  const createdAt = note.createdAt ? new Date(note.createdAt) : null;
  const updatedAt = note.updatedAt ? new Date(note.updatedAt) : createdAt;
  const preview = noteContent.slice(0, 160) + (noteContent.length > 160 ? "..." : "");
  const wordCount = noteContent.trim() ? noteContent.trim().split(/\s+/).length : 0;

  return (
    <div
      className="overflow-hidden rounded-2xl transition-all duration-200"
      style={{
        backgroundColor: bg.card,
        border: `1px solid ${border.subtle}`,
      }}
      onMouseEnter={(e) => (e.currentTarget.style.borderColor = border.gold)}
      onMouseLeave={(e) => (e.currentTarget.style.borderColor = border.subtle)}
    >
      <div className="flex items-start gap-4 px-6 py-5">
        <div
          className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl"
          style={{
            backgroundColor: `${palette.gold}18`,
            border: `1px solid ${border.gold}`,
          }}
        >
          <BookOpen size={15} style={{ color: palette.gold }} />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h3 className="truncate text-sm font-bold" style={{ color: text.primary }}>
                {noteTitle}
              </h3>
              <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-0.5">
                <span className="flex items-center gap-1 text-xs" style={{ color: text.muted }}>
                  <Clock size={11} />
                  {createdAt
                    ? createdAt.toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })
                    : "No date"}
                </span>
                <span className="text-xs" style={{ color: text.muted }}>·</span>
                <span className="text-xs" style={{ color: text.muted }}>
                  {wordCount} words
                </span>
              </div>
            </div>

            {!isConfirmingDelete ? (
              <div className="flex shrink-0 items-center gap-1">
                <button
                  type="button"
                  onClick={onEdit}
                  className="flex h-8 w-8 items-center justify-center rounded-xl transition hover:bg-white/10"
                  title="Edit note"
                  style={{ color: text.muted }}
                >
                  <Edit3 size={14} />
                </button>
                <button
                  type="button"
                  onClick={onDeleteRequest}
                  className="flex h-8 w-8 items-center justify-center rounded-xl transition hover:bg-red-500/10"
                  title="Delete note"
                  style={{ color: text.muted }}
                >
                  <Trash2 size={14} />
                </button>
                <button
                  type="button"
                  onClick={() => setOpen((o) => !o)}
                  className="flex h-8 w-8 items-center justify-center rounded-xl transition hover:bg-white/10"
                  style={{ color: text.muted }}
                >
                  <ChevronDown
                    size={15}
                    className="transition-transform duration-200"
                    style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
                  />
                </button>
              </div>
            ) : (
              <div className="flex shrink-0 items-center gap-2">
                <span className="text-xs" style={{ color: text.muted }}>Delete this note?</span>
                <button
                  type="button"
                  onClick={onDeleteConfirm}
                  disabled={isDeleting}
                  className="rounded-lg px-3 py-1.5 text-xs font-bold transition"
                  style={{
                    backgroundColor: "rgba(239,68,68,0.15)",
                    border: "1px solid rgba(239,68,68,0.3)",
                    color: "#f87171",
                  }}
                >
                  {isDeleting ? <Loader2 size={12} className="animate-spin" /> : "Delete"}
                </button>
                <button
                  type="button"
                  onClick={onDeleteCancel}
                  className="rounded-lg px-3 py-1.5 text-xs font-semibold transition hover:bg-white/8"
                  style={{ color: text.muted }}
                >
                  Cancel
                </button>
              </div>
            )}
          </div>

          {!open && (
            <p className="mt-2 text-sm leading-relaxed" style={{ color: text.muted }}>
              {preview}
            </p>
          )}
        </div>
      </div>

      {open && (
        <div className="px-6 pb-6" style={{ borderTop: `1px solid ${border.subtle}` }}>
          <p
            className="mt-5 whitespace-pre-wrap text-sm leading-7"
            style={{
              color: text.primary,
              fontFamily: "ui-monospace, 'Cascadia Code', monospace",
              fontSize: "0.82rem",
            }}
          >
            {noteContent}
          </p>
          <p className="mt-4 text-xs" style={{ color: text.muted }}>
            Written by {note.createdBy || "Admin"} · Last updated{" "}
            {updatedAt
              ? updatedAt.toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : "unknown"}
          </p>
        </div>
      )}
    </div>
  );
}

/* ─── Empty State ────────────────────────────────────────────────────────── */

function EmptyNotesState({ search, onNew }: { search: string; onNew: () => void }) {
  return (
    <div
      className="flex min-h-[320px] flex-col items-center justify-center rounded-2xl p-10 text-center"
      style={{
        backgroundColor: bg.card,
        border: `1px solid ${border.subtle}`,
      }}
    >
      <div
        className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl text-3xl"
        style={{
          backgroundColor: `${palette.gold}15`,
          border: `1px solid ${border.gold}`,
        }}
      >
        📓
      </div>

      {search ? (
        <>
          <h3 className="text-lg font-semibold" style={{ color: text.primary }}>
            No notes match
          </h3>
          <p className="mt-2 text-sm" style={{ color: text.muted }}>
            No entries contain "{search}". Try a different search term.
          </p>
        </>
      ) : (
        <>
          <h3 className="text-xl font-semibold" style={{ color: text.primary }}>
            No journal entries yet
          </h3>
          <p className="mx-auto mt-3 max-w-sm text-sm leading-6" style={{ color: text.muted }}>
            Start documenting this client's journey — add consultation notes, treatment plans, and
            observations.
          </p>
          <button
            type="button"
            onClick={onNew}
            className="mt-6 flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-bold transition-all hover:opacity-90"
            style={{ background: gradient.gold, color: bg.page }}
          >
            <Plus size={15} strokeWidth={2.5} />
            Add First Entry
          </button>
        </>
      )}
    </div>
  );
}

/* ─── Consultation Form Viewer ───────────────────────────────────────────── */

function ConsultationFormViewer({
  forms,
  selectedForm,
  setSelectedForm,
  loading,
}: {
  forms: ConsultationForm[];
  selectedForm: ConsultationForm | null;
  setSelectedForm: (form: ConsultationForm) => void;
  loading: boolean;
}) {
  return (
    <div
      className="sticky top-6 overflow-hidden rounded-2xl"
      style={{
        backgroundColor: bg.card,
        border: `1px solid ${border.subtle}`,
        maxHeight: "calc(100vh - 3rem)",
      }}
    >
      {/* Header */}
      <div
        className="px-5 py-4"
        style={{
          background: gradient.sidebar,
          borderBottom: `1px solid ${border.subtle}`,
        }}
      >
        <div className="flex items-center gap-2">
          <ClipboardList size={16} style={{ color: palette.gold }} />
          <h2 className="text-sm font-bold" style={{ color: text.primary }}>
            Consultation Form
          </h2>
        </div>
        <p className="mt-1 text-xs" style={{ color: text.muted }}>
          Linked to customer account
        </p>
      </div>

      {/* Scrollable content */}
      <div
        className="overflow-y-auto p-5"
        style={{ maxHeight: "70vh", scrollbarWidth: "thin" }}
      >
        {loading ? (
          <div className="flex items-center gap-2 text-sm" style={{ color: text.muted }}>
            <Loader2 size={15} className="animate-spin" />
            Loading form...
          </div>
        ) : forms.length === 0 ? (
          <div
            className="rounded-xl p-4 text-sm"
            style={{ border: `1px solid ${border.subtle}`, color: text.muted }}
          >
            No consultation form found for this customer.
          </div>
        ) : (
          <>
            {forms.length > 1 && (
              <select
                value={selectedForm?._id || ""}
                onChange={(e) => {
                  const next = forms.find((f) => f._id === e.target.value);
                  if (next) setSelectedForm(next);
                }}
                className="mb-4 w-full rounded-xl px-4 py-3 text-sm outline-none"
                style={{
                  backgroundColor: bg.hover,
                  border: `1px solid ${border.subtle}`,
                  color: text.primary,
                }}
              >
                {forms.map((form, index) => (
                  <option key={form._id} value={form._id}>
                    Form {index + 1} —{" "}
                    {form.createdAt ? new Date(form.createdAt).toLocaleDateString() : "No date"}
                  </option>
                ))}
              </select>
            )}

            {selectedForm && (
              <div className="space-y-3">
                <FormSection title="Client">
                  <FormRow label="Full name" value={selectedForm.fullName} />
                  <FormRow label="Email" value={selectedForm.email} />
                  <FormRow label="Age" value={selectedForm.age} />
                  <FormRow label="Location" value={selectedForm.location} />
                  <FormRow label="Ethnicity" value={selectedForm.ethnicity} />
                  <FormRow label="Fitzpatrick" value={selectedForm.fitzpatrickType} />
                </FormSection>

                <FormSection title="Concern">
                  <FormRow label="Main concern" value={selectedForm.mainConcern} />
                  <FormRow label="Duration" value={selectedForm.concernDuration} />
                  <FormRow label="Sun worsens" value={selectedForm.sunWorsens} />
                  <FormRow label="Triggers" value={selectedForm.triggers?.join(", ")} />
                </FormSection>

                <FormSection title="Routine">
                  <FormRow label="Morning" value={selectedForm.morningRoutine} />
                  <FormRow label="Evening" value={selectedForm.eveningRoutine} />
                  <FormRow label="Previous treatments" value={selectedForm.previousTreatments} />
                  <FormRow label="Medical history" value={selectedForm.medicalHistory} />
                </FormSection>

                <FormSection title="Goals">
                  <FormRow label="Goals" value={selectedForm.goals} />
                  <FormRow label="Budget" value={selectedForm.budget} />
                  <FormRow label="Language" value={selectedForm.language} />
                  <FormRow label="Extra notes" value={selectedForm.extraNotes} />
                </FormSection>

                {(selectedForm.skinPhotos?.length || selectedForm.productPhotos?.length) ? (
                  <FormSection title="Photos">
                    <PhotoLinks title="Skin photos" photos={selectedForm.skinPhotos} />
                    <PhotoLinks title="Product photos" photos={selectedForm.productPhotos} />
                  </FormSection>
                ) : null}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

/* ─── Form helpers ───────────────────────────────────────────────────────── */

function FormSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div
      className="rounded-xl p-4"
      style={{ border: `1px solid ${border.subtle}` }}
    >
      <h3
        className="mb-3 text-[10px] font-bold uppercase tracking-[0.2em]"
        style={{ color: palette.gold }}
      >
        {title}
      </h3>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function FormRow({ label, value }: { label: string; value?: string }) {
  return (
    <div>
      <p
        className="text-[10px] uppercase tracking-[0.16em]"
        style={{ color: text.muted }}
      >
        {label}
      </p>
      <p
        className="mt-0.5 whitespace-pre-wrap text-sm leading-5"
        style={{ color: text.primary }}
      >
        {value || "—"}
      </p>
    </div>
  );
}

function PhotoLinks({ title, photos }: { title: string; photos?: string[] }) {
  if (!photos?.length) return null;
  return (
    <div>
      <p className="text-[10px] uppercase tracking-[0.16em]" style={{ color: text.muted }}>
        {title}
      </p>
      <div className="mt-2 flex flex-wrap gap-2">
        {photos.map((photo, index) => (
          <a
            key={`${photo}-${index}`}
            href={photo}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs transition hover:opacity-80"
            style={{
              border: `1px solid ${border.gold}`,
              color: palette.gold,
              backgroundColor: `${palette.gold}10`,
            }}
          >
            <Eye size={12} />
            Photo {index + 1}
          </a>
        ))}
      </div>
    </div>
  );
}
