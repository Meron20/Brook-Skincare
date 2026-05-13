"use client";

import { useState, useEffect } from "react";
import {
  Plus, Pencil, Trash2, X, Loader2,
  BookOpen, HelpCircle, Eye, EyeOff,
  Pin, Tag
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { CldUploadWidget } from "next-cloudinary";

type Article = {
  _id: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  coverImage: string;
  isPublished: boolean;
  isPinned: boolean;
  createdAt: string;
};

type FAQ = {
  _id: string;
  question: string;
  answer: string;
  category: string;
  order: number;
  isVisible: boolean;
};

type Tab = "articles" | "faq";

const CATEGORIES = [
  { value: "general", label: "General" },
  { value: "melasma", label: "Melasma" },
  { value: "ingredients", label: "Ingredients" },
  { value: "routines", label: "Routines" },
  { value: "spf", label: "SPF" },
];

const categoryColors: Record<string, string> = {
  general: "#818cf8",
  melasma: "#C9A84C",
  ingredients: "#34d399",
  routines: "#f472b6",
  spf: "#fb923c",
};

export default function LearnPage() {
  const [activeTab, setActiveTab] = useState<Tab>("articles");

  // Articles state
  const [articles, setArticles] = useState<Article[]>([]);
  const [articlesLoading, setArticlesLoading] = useState(true);
  const [articleModal, setArticleModal] = useState(false);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [articleForm, setArticleForm] = useState({
    title: "", excerpt: "", content: "",
    category: "general", coverImage: "",
    isPublished: false, isPinned: false,
  });

  // FAQ state
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [faqsLoading, setFaqsLoading] = useState(true);
  const [faqModal, setFaqModal] = useState(false);
  const [editingFaq, setEditingFaq] = useState<FAQ | null>(null);
  const [faqForm, setFaqForm] = useState({
    question: "", answer: "", category: "general", order: 0,
  });

  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState<{ id: string; type: "article" | "faq" } | null>(null);

  // Fetch articles
  const fetchArticles = async () => {
    try {
      const res = await fetch("/api/admin/articles");
      const data = await res.json();
      setArticles(data.articles || []);
    } catch { setError("Failed to load articles"); }
    finally { setArticlesLoading(false); }
  };

  // Fetch FAQs
  const fetchFaqs = async () => {
    try {
      const res = await fetch("/api/admin/faq");
      const data = await res.json();
      setFaqs(data.faqs || []);
    } catch { setError("Failed to load FAQs"); }
    finally { setFaqsLoading(false); }
  };

  useEffect(() => { fetchArticles(); fetchFaqs(); }, []);

  // Article modal
  const openArticleModal = (article?: Article) => {
    if (article) {
      setEditingArticle(article);
      setArticleForm({
        title: article.title,
        excerpt: article.excerpt,
        content: article.content,
        category: article.category,
        coverImage: article.coverImage,
        isPublished: article.isPublished,
        isPinned: article.isPinned,
      });
    } else {
      setEditingArticle(null);
      setArticleForm({
        title: "", excerpt: "", content: "",
        category: "general", coverImage: "",
        isPublished: false, isPinned: false,
      });
    }
    setError("");
    setArticleModal(true);
  };

  // Save article
  const saveArticle = async () => {
    if (!articleForm.title || !articleForm.excerpt || !articleForm.content) {
      setError("Title, excerpt and content are required");
      return;
    }
    setIsSaving(true);
    setError("");
    try {
      const url = editingArticle
        ? `/api/admin/articles/${editingArticle._id}`
        : "/api/admin/articles";
      const method = editingArticle ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(articleForm),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.message || "Something went wrong");
        return;
      }
      await fetchArticles();
      setArticleModal(false);
    } catch { setError("Something went wrong"); }
    finally { setIsSaving(false); }
  };

  // FAQ modal
  const openFaqModal = (faq?: FAQ) => {
    if (faq) {
      setEditingFaq(faq);
      setFaqForm({
        question: faq.question,
        answer: faq.answer,
        category: faq.category,
        order: faq.order,
      });
    } else {
      setEditingFaq(null);
      setFaqForm({ question: "", answer: "", category: "general", order: 0 });
    }
    setError("");
    setFaqModal(true);
  };

  // Save FAQ
  const saveFaq = async () => {
    if (!faqForm.question || !faqForm.answer) {
      setError("Question and answer are required");
      return;
    }
    setIsSaving(true);
    setError("");
    try {
      const url = editingFaq
        ? `/api/admin/faq/${editingFaq._id}`
        : "/api/admin/faq";
      const method = editingFaq ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(faqForm),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.message || "Something went wrong");
        return;
      }
      await fetchFaqs();
      setFaqModal(false);
    } catch { setError("Something went wrong"); }
    finally { setIsSaving(false); }
  };

  // Delete
  const handleDelete = async () => {
    if (!deleteConfirm) return;
    try {
      const url = deleteConfirm.type === "article"
        ? `/api/admin/articles/${deleteConfirm.id}`
        : `/api/admin/faq/${deleteConfirm.id}`;
      await fetch(url, { method: "DELETE" });
      if (deleteConfirm.type === "article") await fetchArticles();
      else await fetchFaqs();
      setDeleteConfirm(null);
    } catch { setError("Failed to delete"); }
  };

  // Toggle publish
  const togglePublish = async (article: Article) => {
    await fetch(`/api/admin/articles/${article._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...article, isPublished: !article.isPublished }),
    });
    await fetchArticles();
  };

  // Toggle FAQ visibility
  const toggleFaqVisible = async (faq: FAQ) => {
    await fetch(`/api/admin/faq/${faq._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...faq, isVisible: !faq.isVisible }),
    });
    await fetchFaqs();
  };

  const inputClass = "w-full px-4 py-3 rounded-xl text-sm outline-none transition-all";
  const inputStyle = { border: "1px solid rgba(30,21,72,0.15)", backgroundColor: "#fafafa" };

  return (
    <div className="space-y-6">

      {/* ── TABS ── */}
      <div className="flex items-center justify-between">
        <div
          className="flex rounded-xl p-1 gap-1"
          style={{ backgroundColor: "rgba(30,21,72,0.06)" }}
        >
          {([
            { key: "articles", label: "Articles", icon: BookOpen },
            { key: "faq", label: "FAQ", icon: HelpCircle },
          ] as const).map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className="flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium transition-all duration-200"
              style={{
                background: activeTab === key
                  ? "linear-gradient(135deg, #C9A84C, #0A1F14)"
                  : "transparent",
                color: activeTab === key ? "white" : "#9ca3af",
              }}
            >
              <Icon size={14} />
              {label}
            </button>
          ))}
        </div>

        <Button
          onClick={() => activeTab === "articles" ? openArticleModal() : openFaqModal()}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium"
          style={{ background: "linear-gradient(135deg, #C9A84C, #0A1F14)", color: "white" }}
        >
          <Plus size={15} />
          {activeTab === "articles" ? "New Article" : "New FAQ"}
        </Button>
      </div>

      {activeTab === "articles" && (
        <>
          {articlesLoading ? (
            <div className="flex justify-center py-20">
              <Loader2 size={32} className="animate-spin" style={{ color: "#C9A84C" }} />
            </div>
          ) : articles.length === 0 ? (
            <div
              className="flex flex-col items-center justify-center py-20 gap-4 rounded-2xl"
              style={{ border: "1px dashed rgba(201,169,110,0.3)", backgroundColor: "rgba(201,169,110,0.03)" }}
            >
              <BookOpen size={32} style={{ color: "rgba(201,169,110,0.4)" }} />
              <p className="text-gray-500 text-sm">No articles yet</p>
              <Button
                onClick={() => openArticleModal()}
                className="px-5 py-2 rounded-xl text-sm"
                style={{ background: "linear-gradient(135deg, #C9A84C, #0A1F14)", color: "white" }}
              >
                Write your first article
              </Button>
            </div>
          ) : (
            <div
              className="rounded-2xl overflow-hidden"
              style={{ border: "1px solid rgba(30,21,72,0.1)" }}
            >
              {/* Table header */}
              <div
                className="grid grid-cols-12 px-6 py-4 text-xs font-semibold uppercase tracking-wider"
                style={{ background: "linear-gradient(135deg, #0A1F14, #1A3D2B)", color: "#C9A84C" }}
              >
                <div className="col-span-5">Article</div>
                <div className="col-span-2 hidden md:block">Category</div>
                <div className="col-span-2 text-center">Status</div>
                <div className="col-span-1 text-center hidden md:block">Pinned</div>
                <div className="col-span-2 text-center">Actions</div>
              </div>

              {/* Table rows */}
              <div className="divide-y divide-gray-100">
                {articles.map((article, i) => (
                  <div
                    key={article._id}
                    className="grid grid-cols-12 px-6 py-4 items-center transition-colors"
                    style={{ backgroundColor: i % 2 === 0 ? "white" : "rgba(248,247,255,0.8)" }}
                    onMouseEnter={e => e.currentTarget.style.backgroundColor = "rgba(201,169,110,0.04)"}
                    onMouseLeave={e => e.currentTarget.style.backgroundColor = i % 2 === 0 ? "white" : "rgba(248,247,255,0.8)"}
                  >
                    {/* Title */}
                    <div className="col-span-5">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                          style={{ backgroundColor: `${categoryColors[article.category]}20` }}
                        >
                          <BookOpen size={14} style={{ color: categoryColors[article.category] }} />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-[#0A1F14] truncate">
                            {article.title}
                          </p>
                          <p className="text-xs text-gray-400 truncate hidden sm:block">
                            {article.excerpt.substring(0, 60)}...
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Category */}
                    <div className="col-span-2 hidden md:block">
                      <span
                        className="text-xs px-2.5 py-1 rounded-full font-medium capitalize"
                        style={{
                          backgroundColor: `${categoryColors[article.category]}20`,
                          color: categoryColors[article.category],
                        }}
                      >
                        {article.category}
                      </span>
                    </div>

                    {/* Publish toggle */}
                    <div className="col-span-2 flex justify-center">
                      <button
                        onClick={() => togglePublish(article)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                        style={{
                          backgroundColor: article.isPublished
                            ? "rgba(52,211,153,0.1)"
                            : "rgba(239,68,68,0.08)",
                          color: article.isPublished ? "#34d399" : "#ef4444",
                        }}
                      >
                        {article.isPublished
                          ? <><Eye size={12} /> Published</>
                          : <><EyeOff size={12} /> Draft</>
                        }
                      </button>
                    </div>

                    {/* Pinned */}
                    <div className="col-span-1 flex justify-center hidden md:flex">
                      {article.isPinned && (
                        <Pin size={14} style={{ color: "#C9A84C" }} />
                      )}
                    </div>

                    {/* Actions */}
                    <div className="col-span-2 flex items-center justify-center gap-2">
                      <button
                        onClick={() => openArticleModal(article)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all hover:scale-105"
                        style={{ backgroundColor: "rgba(30,21,72,0.07)", color: "#0A1F14" }}
                      >
                        <Pencil size={12} />
                        <span className="hidden sm:block">Edit</span>
                      </button>
                      <button
                        onClick={() => setDeleteConfirm({ id: article._id, type: "article" })}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all hover:scale-105"
                        style={{ backgroundColor: "rgba(239,68,68,0.08)", color: "#ef4444" }}
                      >
                        <Trash2 size={12} />
                        <span className="hidden sm:block">Delete</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div
                className="px-6 py-3 flex items-center justify-between"
                style={{ backgroundColor: "rgba(248,247,255,0.9)", borderTop: "1px solid rgba(30,21,72,0.08)" }}
              >
                <p className="text-xs text-gray-400">
                  {articles.length} article{articles.length !== 1 ? "s" : ""}
                </p>
                <p className="text-xs" style={{ color: "#C9A84C" }}>
                  {articles.filter(a => a.isPublished).length} published
                </p>
              </div>
            </div>
          )}
        </>
      )}

    
      {activeTab === "faq" && (
        <>
          {faqsLoading ? (
            <div className="flex justify-center py-20">
              <Loader2 size={32} className="animate-spin" style={{ color: "#C9A84C" }} />
            </div>
          ) : faqs.length === 0 ? (
            <div
              className="flex flex-col items-center justify-center py-20 gap-4 rounded-2xl"
              style={{ border: "1px dashed rgba(201,169,110,0.3)", backgroundColor: "rgba(201,169,110,0.03)" }}
            >
              <HelpCircle size={32} style={{ color: "rgba(201,169,110,0.4)" }} />
              <p className="text-gray-500 text-sm">No FAQs yet</p>
              <Button
                onClick={() => openFaqModal()}
                className="px-5 py-2 rounded-xl text-sm"
                style={{ background: "linear-gradient(135deg, #C9A84C, #0A1F14)", color: "white" }}
              >
                Add your first FAQ
              </Button>
            </div>
          ) : (
            <div
              className="rounded-2xl overflow-hidden"
              style={{ border: "1px solid rgba(30,21,72,0.1)" }}
            >
              {/* Table header */}
              <div
                className="grid grid-cols-12 px-6 py-4 text-xs font-semibold uppercase tracking-wider"
                style={{ background: "linear-gradient(135deg, #0A1F14, #1A3D2B)", color: "#C9A84C" }}
              >
                <div className="col-span-1">#</div>
                <div className="col-span-5">Question</div>
                <div className="col-span-2 hidden md:block">Category</div>
                <div className="col-span-2 text-center">Visible</div>
                <div className="col-span-2 text-center">Actions</div>
              </div>

              <div className="divide-y divide-gray-100">
                {faqs.map((faq, i) => (
                  <div
                    key={faq._id}
                    className="grid grid-cols-12 px-6 py-4 items-center transition-colors"
                    style={{ backgroundColor: i % 2 === 0 ? "white" : "rgba(248,247,255,0.8)" }}
                    onMouseEnter={e => e.currentTarget.style.backgroundColor = "rgba(201,169,110,0.04)"}
                    onMouseLeave={e => e.currentTarget.style.backgroundColor = i % 2 === 0 ? "white" : "rgba(248,247,255,0.8)"}
                  >
                    {/* Order */}
                    <div className="col-span-1">
                      <span
                        className="text-xs font-bold px-2 py-1 rounded-lg"
                        style={{ backgroundColor: "rgba(30,21,72,0.06)", color: "#0A1F14" }}
                      >
                        {faq.order || i + 1}
                      </span>
                    </div>

                    {/* Question */}
                    <div className="col-span-5">
                      <p className="text-sm font-semibold text-[#0A1F14] truncate">
                        {faq.question}
                      </p>
                      <p className="text-xs text-gray-400 truncate hidden sm:block">
                        {faq.answer.substring(0, 60)}...
                      </p>
                    </div>

                    {/* Category */}
                    <div className="col-span-2 hidden md:block">
                      <div className="flex items-center gap-1.5">
                        <Tag size={11} className="text-gray-400" />
                        <span className="text-xs text-gray-500 capitalize">{faq.category}</span>
                      </div>
                    </div>

                    {/* Visible toggle */}
                    <div className="col-span-2 flex justify-center">
                      <button
                        onClick={() => toggleFaqVisible(faq)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium"
                        style={{
                          backgroundColor: faq.isVisible
                            ? "rgba(52,211,153,0.1)"
                            : "rgba(239,68,68,0.08)",
                          color: faq.isVisible ? "#34d399" : "#ef4444",
                        }}
                      >
                        {faq.isVisible
                          ? <><Eye size={12} /> Visible</>
                          : <><EyeOff size={12} /> Hidden</>
                        }
                      </button>
                    </div>

                    {/* Actions */}
                    <div className="col-span-2 flex items-center justify-center gap-2">
                      <button
                        onClick={() => openFaqModal(faq)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all hover:scale-105"
                        style={{ backgroundColor: "rgba(30,21,72,0.07)", color: "#0A1F14" }}
                      >
                        <Pencil size={12} />
                        <span className="hidden sm:block">Edit</span>
                      </button>
                      <button
                        onClick={() => setDeleteConfirm({ id: faq._id, type: "faq" })}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all hover:scale-105"
                        style={{ backgroundColor: "rgba(239,68,68,0.08)", color: "#ef4444" }}
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
                style={{ backgroundColor: "rgba(248,247,255,0.9)", borderTop: "1px solid rgba(30,21,72,0.08)" }}
              >
                <p className="text-xs text-gray-400">
                  {faqs.length} FAQ{faqs.length !== 1 ? "s" : ""}
                </p>
                <p className="text-xs" style={{ color: "#C9A84C" }}>
                  {faqs.filter(f => f.isVisible).length} visible
                </p>
              </div>
            </div>
          )}
        </>
      )}

      {/* ── ARTICLE MODAL ── */}
      {articleModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" }}
        >
          <div className="w-full max-w-2xl rounded-2xl overflow-hidden shadow-2xl bg-white max-h-[90vh] flex flex-col">
            {/* Header */}
            <div
              className="flex items-center justify-between px-6 py-5 flex-shrink-0"
              style={{ background: "linear-gradient(135deg, #0A1F14, #1A3D2B)" }}
            >
              <h2 className="text-white font-semibold text-lg">
                {editingArticle ? "Edit Article" : "New Article"}
              </h2>
              <button onClick={() => setArticleModal(false)} className="text-white/70 hover:text-white">
                <X size={20} />
              </button>
            </div>

            {/* Body */}
            <div className="overflow-y-auto flex-1 px-6 py-6 space-y-4">
              {error && (
                <div
                  className="px-4 py-3 rounded-xl text-sm text-red-600"
                  style={{ backgroundColor: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)" }}
                >
                  {error}
                </div>
              )}

              {/* Title */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-[#0A1F14]">Title</label>
                <input
                  value={articleForm.title}
                  onChange={e => setArticleForm({ ...articleForm, title: e.target.value })}
                  placeholder="e.g. What causes melasma?"
                  className={inputClass} style={inputStyle}
                />
              </div>

              {/* Excerpt */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-[#0A1F14]">
                  Excerpt <span className="text-gray-400 font-normal">(short summary)</span>
                </label>
                <textarea
                  value={articleForm.excerpt}
                  onChange={e => setArticleForm({ ...articleForm, excerpt: e.target.value })}
                  placeholder="A short description shown in the article list..."
                  rows={2}
                  className={`${inputClass} resize-none`} style={inputStyle}
                />
              </div>

              {/* Content */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-[#0A1F14]">Content</label>
                <textarea
                  value={articleForm.content}
                  onChange={e => setArticleForm({ ...articleForm, content: e.target.value })}
                  placeholder="Write the full article content here..."
                  rows={8}
                  className={`${inputClass} resize-none`} style={inputStyle}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-[#0A1F14]">Category</label>
                  <select
                    value={articleForm.category}
                    onChange={e => setArticleForm({ ...articleForm, category: e.target.value })}
                    className={inputClass} style={inputStyle}
                  >
                    {CATEGORIES.map(c => (
                      <option key={c.value} value={c.value}>{c.label}</option>
                    ))}
                  </select>
                </div>

             
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-[#0A1F14]">Cover Image</label>
                  <CldUploadWidget
                    uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
                    onSuccess={(result) => {
                        const info = result.info;
                        if (info && typeof info === "object" && "secure_url" in info) {
                          const url = (info as { secure_url: string }).secure_url;
                          setArticleForm(prev => ({
                            ...prev,
                            coverImage: url,
                          }));
                        }
                      }}
                    >
                    {({ open }) => (
                      <button
                        type="button"
                        onClick={() => open()}
                        className={`${inputClass} text-left`}
                        style={{
                          ...inputStyle,
                          color: articleForm.coverImage ? "#0A1F14" : "#9ca3af",
                        }}
                      >
                        {articleForm.coverImage ? "✓ Image uploaded" : "Upload cover image"}
                      </button>
                    )}
                  </CldUploadWidget>
                  {articleForm.coverImage && (
                        <div className="relative mt-1">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={articleForm.coverImage}
                            alt="Cover preview"
                            className="w-full h-40 object-contain rounded-xl"
                            style={{ 
                                border: "1px solid rgba(10,31,20,0.15)",
                                backgroundColor: "rgba(10,31,20,0.03)",
                             }}
                        />
                        <button
                            type="button"
                            onClick={() => setArticleForm(prev => ({ ...prev, coverImage: "" }))}
                            className="absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center"
                            style={{ backgroundColor: "rgba(239,68,68,0.9)" }}
                        >
                            <X size={12} className="text-white" />
                        </button>
                    </div>
                    )}
                </div>
              </div>

              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={articleForm.isPublished}
                    onChange={e => setArticleForm({ ...articleForm, isPublished: e.target.checked })}
                    className="w-4 h-4 accent-[#C9A84C]"
                  />
                  <span className="text-sm text-[#0A1F14]">Publish immediately</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={articleForm.isPinned}
                    onChange={e => setArticleForm({ ...articleForm, isPinned: e.target.checked })}
                    className="w-4 h-4 accent-[#C9A84C]"
                  />
                  <span className="text-sm text-[#0A1F14]">Pin to top</span>
                </label>
              </div>
            </div>

            <div className="px-6 pb-6 pt-3 flex gap-3 flex-shrink-0 border-t" style={{ borderColor: "rgba(30,21,72,0.08)" }}>
              <Button
                onClick={() => setArticleModal(false)}
                className="flex-1 py-3 rounded-xl text-sm"
                style={{ backgroundColor: "rgba(30,21,72,0.05)", color: "#0A1F14" }}
              >
                Cancel
              </Button>
              <Button
                onClick={saveArticle}
                disabled={isSaving}
                className="flex-1 py-3 rounded-xl text-sm font-semibold"
                style={{ background: "linear-gradient(135deg, #C9A84C, #0A1F14)", color: "white" }}
              >
                {isSaving ? <Loader2 size={16} className="animate-spin mx-auto" /> : editingArticle ? "Save Changes" : "Publish Article"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {faqModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" }}
        >
          <div className="w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl bg-white">
            <div
              className="flex items-center justify-between px-6 py-5"
              style={{ background: "linear-gradient(135deg, #0A1F14, #1A3D2B)" }}
            >
              <h2 className="text-white font-semibold text-lg">
                {editingFaq ? "Edit FAQ" : "New FAQ"}
              </h2>
              <button onClick={() => setFaqModal(false)} className="text-white/70 hover:text-white">
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
                <label className="text-sm font-medium text-[#0A1F14]">Question</label>
                <input
                  value={faqForm.question}
                  onChange={e => setFaqForm({ ...faqForm, question: e.target.value })}
                  placeholder="e.g. How long does a consultation take?"
                  className={inputClass} style={inputStyle}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-[#0A1F14]">Answer</label>
                <textarea
                  value={faqForm.answer}
                  onChange={e => setFaqForm({ ...faqForm, answer: e.target.value })}
                  placeholder="Write a clear, helpful answer..."
                  rows={4}
                  className={`${inputClass} resize-none`} style={inputStyle}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-[#0A1F14]">Category</label>
                  <select
                    value={faqForm.category}
                    onChange={e => setFaqForm({ ...faqForm, category: e.target.value })}
                    className={inputClass} style={inputStyle}
                  >
                    {CATEGORIES.map(c => (
                      <option key={c.value} value={c.value}>{c.label}</option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-[#0A1F14]">Order</label>
                  <input
                    type="number"
                    value={faqForm.order}
                    onChange={e => setFaqForm({ ...faqForm, order: Number(e.target.value) })}
                    placeholder="0"
                    className={inputClass} style={inputStyle}
                  />
                </div>
              </div>
            </div>

            <div className="px-6 pb-6 flex gap-3">
              <Button
                onClick={() => setFaqModal(false)}
                className="flex-1 py-3 rounded-xl text-sm"
                style={{ backgroundColor: "rgba(30,21,72,0.05)", color: "#0A1F14" }}
              >
                Cancel
              </Button>
              <Button
                onClick={saveFaq}
                disabled={isSaving}
                className="flex-1 py-3 rounded-xl text-sm font-semibold"
                style={{ background: "linear-gradient(135deg, #C9A84C, #0A1F14)", color: "white" }}
              >
                {isSaving ? <Loader2 size={16} className="animate-spin mx-auto" /> : editingFaq ? "Save Changes" : "Add FAQ"}
              </Button>
            </div>
          </div>
        </div>
      )}

    
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
              <h3 className="text-lg font-semibold text-[#0A1F14] mb-2">
                Delete this {deleteConfirm.type}?
              </h3>
              <p className="text-gray-400 text-sm">This action cannot be undone.</p>
            </div>
            <div className="px-6 pb-6 flex gap-3">
              <Button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 py-3 rounded-xl text-sm"
                style={{ backgroundColor: "rgba(30,21,72,0.05)", color: "#0A1F14" }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleDelete}
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