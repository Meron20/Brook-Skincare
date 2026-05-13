"use client";

import { useState, useEffect } from "react";
import { CldUploadWidget } from "next-cloudinary";
import {
  User, Building2, Lock, Save, Loader2,
  CheckCircle, Eye, EyeOff, Link, X
} from "lucide-react";
import { Button } from "@/components/ui/button";

type Tab = "profile" | "clinic" | "password";

type ProfileData = {
  fullName: string;
  email: string;
  phone: string;
};

type ClinicData = {
  clinicName: string;
  clinicAddress: string;
  clinicPhone: string;
  clinicAbout: string;
  logoUrl: string;
  facebook: string;
  youtube: string;
  tiktok: string;
  linkedin: string;
};

type PasswordData = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

const FacebookIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="#1877F2">
      <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
    </svg>
  );
  
const YoutubeIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="#FF0000">
      <path d="M22.54 6.42a2.78 2.78 0 00-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 00-1.95 1.96A29 29 0 001 12a29 29 0 00.46 5.58a2.78 2.78 0 001.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 001.95-1.96A29 29 0 0023 12a29 29 0 00-.46-5.58z" />
      <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="white" />
    </svg>
  );

const TikTokIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.26 8.26 0 004.84 1.56V6.79a4.85 4.85 0 01-1.07-.1z" />
  </svg>
);

const LinkedInIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z M4 6a2 2 0 100-4 2 2 0 000 4z" />
  </svg>
);
const ImageIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#C9A96E" strokeWidth="2">
      <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/>
      <polyline points="21 15 16 10 5 21"/>
    </svg>
  );

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<Tab>("profile");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [profile, setProfile] = useState<ProfileData>({
    fullName: "", email: "", phone: "",
  });

  const [clinic, setClinic] = useState<ClinicData>({
    clinicName: "", clinicAddress: "", clinicPhone: "",
    clinicAbout: "", logoUrl: "", facebook: "",
    youtube: "", tiktok: "", linkedin: "",
  });

  const [passwords, setPasswords] = useState<PasswordData>({
    currentPassword: "", newPassword: "", confirmPassword: "",
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch("/api/admin/settings");
        const data = await res.json();
        const u = data.user;
        const s = data.settings;
        setProfile({
          fullName: u.fullName || "",
          email: u.email || "",
          phone: u.phone || "",
        });
        setClinic({
          clinicName: s.clinicName || "",
          clinicAddress: s.clinicAddress || "",
          clinicPhone: s.clinicPhone || "",
          clinicAbout: s.clinicAbout || "",
          logoUrl: s.logoUrl || "",
          facebook: s.facebook || "",
          youtube: s.youtube || "",
          tiktok: s.tiktok || "",
          linkedin: s.linkedin || "",
        });
      } catch {
        setError("Failed to load settings");
      } finally {
        setIsLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    setError("");
    setSuccess("");

    if (activeTab === "password") {
      if (!passwords.currentPassword || !passwords.newPassword || !passwords.confirmPassword) {
        setError("All password fields are required");
        setIsSaving(false);
        return;
      }
      if (passwords.newPassword.length < 6) {
        setError("New password must be at least 6 characters");
        setIsSaving(false);
        return;
      }
      if (passwords.newPassword !== passwords.confirmPassword) {
        setError("New passwords do not match");
        setIsSaving(false);
        return;
      }
    }

    try {
      const body =
        activeTab === "profile" ? { type: "profile", ...profile } :
        activeTab === "clinic" ? { type: "clinic", ...clinic } :
        { type: "password", currentPassword: passwords.currentPassword, newPassword: passwords.newPassword };

      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Something went wrong");
        return;
      }

      setSuccess(data.message);
      if (activeTab === "password") {
        setPasswords({ currentPassword: "", newPassword: "", confirmPassword: "" });
      }
      setTimeout(() => setSuccess(""), 3000);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const tabs: { key: Tab; label: string; icon: React.ReactNode }[] = [
    { key: "profile", label: "Profile", icon: <User size={16} /> },
    { key: "clinic", label: "Clinic & Social", icon: <Building2 size={16} /> },
    { key: "password", label: "Password", icon: <Lock size={16} /> },
   

  ];

  const inputClass = "w-full px-4 py-3 rounded-xl text-sm outline-none transition-all";
  const inputStyle = { border: "1px solid rgba(30,21,72,0.15)", backgroundColor: "#fafafa" };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 size={32} className="animate-spin" style={{ color: "#C9A96E" }} />
      </div>
    );
  }

  return (
    <div className="flex justify-center">
      <div className="w-full max-w-2xl space-y-6">

        {/* ── TABS ── */}
        <div
          className="flex rounded-2xl p-1.5 gap-1"
          style={{ backgroundColor: "rgba(30,21,72,0.06)" }}
        >
          {tabs.map(({ key, label, icon }) => (
            <button
              key={key}
              onClick={() => { setActiveTab(key); setError(""); setSuccess(""); }}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-medium transition-all duration-200"
              style={{
                background: activeTab === key ? "linear-gradient(135deg, #C9A84C, #0A1F14)" : "transparent",
                color: activeTab === key ? "white" : "#9ca3af",
                boxShadow: activeTab === key ? "0 1px 4px rgba(30,21,72,0.1)" : "none",
              }}
            >
              {icon}
              <span className="hidden sm:block">{label}</span>
            </button>
          ))}
        </div>

        {/* ── CARD ── */}
        <div
          className="rounded-2xl overflow-hidden"
          style={{ border: "1px solid rgba(30,21,72,0.1)" }}
        >
          {/* Card header */}
          <div
            className="px-6 py-5 flex items-center gap-3"
            style={{ background: "linear-gradient(135deg, #C9A84C, #0A1F14)" }}
          >

            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center text-white"
              style={{ backgroundColor: "rgba(201,169,110,0.2)" }}
            >
              {tabs.find(t => t.key === activeTab)?.icon}
            </div>
            <div>
              <h2 className="text-white font-semibold">
                {tabs.find(t => t.key === activeTab)?.label}
              </h2>
              <p className="text-xs mt-0.5" style={{ color: "#1E1548" }}>
                {activeTab === "profile" && "Update your personal information"}
                {activeTab === "clinic" && "Manage clinic details, logo and social links"}
                {activeTab === "password" && "Change your account password"}
              </p>
            </div>
          </div>

          {/* Card body */}
          <div className="px-6 py-6 bg-white space-y-4">

            {/* Feedback */}
            {error && (
              <div
                className="px-4 py-3 rounded-xl text-sm text-red-600"
                style={{ backgroundColor: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)" }}
              >
                {error}
              </div>
            )}
            {success && (
              <div
                className="px-4 py-3 rounded-xl text-sm flex items-center gap-2"
                style={{ backgroundColor: "rgba(52,211,153,0.08)", border: "1px solid rgba(52,211,153,0.2)", color: "#059669" }}
              >
                <CheckCircle size={16} />
                {success}
              </div>
            )}

            {/* ── PROFILE TAB ── */}
            {activeTab === "profile" && (
              <>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-[#1E1548]">Full Name</label>
                  <input value={profile.fullName}
                    onChange={e => setProfile({ ...profile, fullName: e.target.value })}
                    placeholder="Your full name" className={inputClass} style={inputStyle} />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-[#1E1548]">Email Address</label>
                  <input type="email" value={profile.email}
                    onChange={e => setProfile({ ...profile, email: e.target.value })}
                    placeholder="your@email.com" className={inputClass} style={inputStyle} />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-[#1E1548]">Phone Number</label>
                  <input value={profile.phone}
                    onChange={e => setProfile({ ...profile, phone: e.target.value })}
                    placeholder="+46 70 000 00 00" className={inputClass} style={inputStyle} />
                </div>
              </>
            )}

            {/* ── CLINIC TAB ── */}
            {activeTab === "clinic" && (
              <>
                {/* Logo URL */}
                 <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-[#1E1548] flex items-center gap-2">
                        <ImageIcon />
                        Clinic Logo
                    </label>

                    <CldUploadWidget
                        uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
                       
                        onSuccess={async (result) => {
                            if (result.info && typeof result.info === "object" && "secure_url" in result.info) {
                              const uploadedUrl = result.info.secure_url as string;
                              setClinic(prev => ({ ...prev, logoUrl: uploadedUrl }));
                          
                              try {
                                await fetch("/api/admin/settings", {
                                  method: "PUT",
                                  headers: { "Content-Type": "application/json" },
                                  body: JSON.stringify({
                                    type: "clinic",
                                    ...clinic,
                                    logoUrl: uploadedUrl,
                                  }),
                                });
                                setSuccess("Logo uploaded and saved! ✓");
                                setTimeout(() => setSuccess(""), 3000);
                              } catch {
                                setError("Logo uploaded but failed to save. Click Save Changes.");
                              }
                            }
                          }}
                    >
                    {({ open }) => (
                    <button
                        type="button"
                        onClick={() => open()}
                        className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-all hover:opacity-80"
                        style={{
                        border: "2px dashed rgba(201,169,110,0.4)",
                        backgroundColor: "rgba(201,169,110,0.04)",
                        color: "#C9A96E",
                        }}
                    >
                        <ImageIcon />
                        {clinic.logoUrl ? "Change Logo" : "Upload Logo"}
                    </button>
                    )}
                </CldUploadWidget>
                {clinic.logoUrl && (
                    <div
                    className="flex items-center gap-4 p-4 rounded-xl mt-1"
                    style={{
                        backgroundColor: "rgba(30,21,72,0.03)",
                        border: "1px solid rgba(201,169,110,0.2)",
                    }}
                    >
                    <img
                        src={clinic.logoUrl}
                        alt="Logo preview"
                        className="w-16 h-16 object-contain rounded-xl"
                        style={{ border: "1px solid rgba(201,169,110,0.3)" }}
                    />
                    <div className="flex-1">
                        <p className="text-sm font-medium text-[#1E1548]">Logo uploaded ✓</p>
                        <p className="text-xs text-gray-400 mt-0.5 truncate">{clinic.logoUrl}</p>
                    </div>
                    <button
                        type="button"
                        onClick={() => setClinic({ ...clinic, logoUrl: "" })}
                        className="p-1.5 rounded-lg transition-colors"
                        style={{ backgroundColor: "rgba(239,68,68,0.08)" }}
                    >
                        <X size={14} className="text-red-400" />
                    </button>
                    </div>
                )}
                </div>

                {/* Divider */}
                <div className="flex items-center gap-3 py-1">
                  <div className="flex-1 h-px" style={{ backgroundColor: "rgba(30,21,72,0.08)" }} />
                  <span className="text-xs text-gray-400 font-medium">Clinic Information</span>
                  <div className="flex-1 h-px" style={{ backgroundColor: "rgba(30,21,72,0.08)" }} />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-[#1E1548]">Clinic Name</label>
                  <input value={clinic.clinicName}
                    onChange={e => setClinic({ ...clinic, clinicName: e.target.value })}
                    placeholder="Brook Skincare" className={inputClass} style={inputStyle} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-[#1E1548]">Address</label>
                    <input value={clinic.clinicAddress}
                      onChange={e => setClinic({ ...clinic, clinicAddress: e.target.value })}
                      placeholder="Stockholm, Sweden" className={inputClass} style={inputStyle} />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-[#1E1548]">Clinic Phone</label>
                    <input value={clinic.clinicPhone}
                      onChange={e => setClinic({ ...clinic, clinicPhone: e.target.value })}
                      placeholder="+46 70 000 00 00" className={inputClass} style={inputStyle} />
                  </div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-[#1E1548]">About the Clinic</label>
                  <textarea value={clinic.clinicAbout}
                    onChange={e => setClinic({ ...clinic, clinicAbout: e.target.value })}
                    placeholder="Tell customers about Brook Skincare..."
                    rows={3} className={`${inputClass} resize-none`} style={inputStyle} />
                </div>

                {/* Divider */}
                <div className="flex items-center gap-3 py-1">
                  <div className="flex-1 h-px" style={{ backgroundColor: "rgba(30,21,72,0.08)" }} />
                  <span className="text-xs text-gray-400 font-medium">Social Media Links</span>
                  <div className="flex-1 h-px" style={{ backgroundColor: "rgba(30,21,72,0.08)" }} />
                </div>

                {/* Social media links */}
                {[
                  { key: "facebook", label: "Facebook", icon: <FacebookIcon />, placeholder: "https://facebook.com/brookskincare" },
                  { key: "youtube", label: "YouTube", icon: <YoutubeIcon />, placeholder: "https://youtube.com/@brookskincare" },
                  { key: "tiktok", label: "TikTok", icon: <TikTokIcon />, placeholder: "https://tiktok.com/@brookskincare" },
                  { key: "linkedin", label: "LinkedIn", icon: <LinkedInIcon />, placeholder: "https://linkedin.com/in/brookskincare" },
                ].map(({ key, label, icon, placeholder }) => (
                  <div key={key} className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-[#1E1548] flex items-center gap-2">
                      {icon}
                      {label}
                    </label>
                    <div className="relative">
                      <Link size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" />
                      <input
                        value={clinic[key as keyof ClinicData]}
                        onChange={e => setClinic({ ...clinic, [key]: e.target.value })}
                        placeholder={placeholder}
                        className={`${inputClass} pl-9`}
                        style={inputStyle}
                      />
                    </div>
                  </div>
                ))}
              </>
            )}

            {/* ── PASSWORD TAB ── */}
            {activeTab === "password" && (
              <>
                {[
                  { label: "Current Password", key: "currentPassword", show: showCurrent, toggle: () => setShowCurrent(!showCurrent) },
                  { label: "New Password", key: "newPassword", show: showNew, toggle: () => setShowNew(!showNew) },
                  { label: "Confirm New Password", key: "confirmPassword", show: showConfirm, toggle: () => setShowConfirm(!showConfirm) },
                ].map(({ label, key, show, toggle }) => (
                  <div key={key} className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-[#1E1548]">{label}</label>
                    <div className="relative">
                      <input
                        type={show ? "text" : "password"}
                        value={passwords[key as keyof PasswordData]}
                        onChange={e => setPasswords({ ...passwords, [key]: e.target.value })}
                        placeholder="••••••••"
                        className={`${inputClass} pr-10`}
                        style={inputStyle}
                      />
                      <button type="button" onClick={toggle}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                        {show ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>
                ))}
                <div
                  className="px-4 py-3 rounded-xl text-xs text-gray-500"
                  style={{ backgroundColor: "rgba(30,21,72,0.03)", border: "1px solid rgba(30,21,72,0.08)" }}
                >
                  Password must be at least 6 characters long
                </div>
              </>
            )}
          </div>

          {/* Card footer */}
          <div
            className="px-6 py-4 flex justify-end"
            style={{ backgroundColor: "rgba(248,247,255,0.8)", borderTop: "1px solid rgba(30,21,72,0.08)" }}
          >
            <Button
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold"
              style={{ background:"linear-gradient(135deg, #C9A84C, #0A1F14)", color: "white" }}
            >
              {isSaving ? (
                <><Loader2 size={15} className="animate-spin" />Saving...</>
              ) : (
                <><Save size={15} />Save Changes</>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}