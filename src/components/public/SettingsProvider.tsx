"use client";

import { createContext, useContext, useEffect, useState } from "react";

type SiteSettings = {
  clinicName: string;
  logoUrl: string;
  clinicAbout: string;
  facebook: string;
  youtube: string;
  tiktok: string;
  linkedin: string;
};

const defaultSettings: SiteSettings = {
  clinicName: "Brook Skincare",
  logoUrl: "/brook-logo.jpeg",
  clinicAbout: "Expert care for melanin-rich skin — wherever you are in the world.",
  facebook: "",
  youtube: "https://www.youtube.com/channel/UCQqGytMj-iIbDnqlyTfn7vw",
  tiktok: "",
  linkedin: "",
};

const SettingsContext = createContext<SiteSettings>(defaultSettings);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);

  useEffect(() => {
    fetch("/api/settings")
      .then(res => res.json())
      .then(data => {
        console.log("Settings fetched:", data);
        if (data.settings) {
          setSettings({
            clinicName: data.settings.clinicName || defaultSettings.clinicName,
            logoUrl: data.settings.logoUrl || defaultSettings.logoUrl,
            clinicAbout: data.settings.clinicAbout || defaultSettings.clinicAbout,
            facebook: data.settings.facebook || "",
            youtube: data.settings.youtube || defaultSettings.youtube,
            tiktok: data.settings.tiktok || "",
            linkedin: data.settings.linkedin || "",
          });
        }
      })
      .catch(err => console.error("Settings fetch error:", err));
  }, []);
  return (
    <SettingsContext.Provider value={settings}>
      {children}
    </SettingsContext.Provider>
  );
}

export const useSiteSettings = () => useContext(SettingsContext);