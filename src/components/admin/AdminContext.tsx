"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { usePathname } from "next/navigation";

const routeTitles: Record<string, { title: string; subtitle: string }> = {
  "/admin": { title: "Dashboard", subtitle: "Here's your clinic overview" },
  "/admin/services": { title: "Services", subtitle: "Manage your skincare services" },
  "/admin/timeslots": { title: "Time Slots", subtitle: "Manage your availability" },
  "/admin/bookings": { title: "Bookings", subtitle: "View and manage appointments" },
  "/admin/journal": { title: "Journal", subtitle: "Patient journal entries" },
  "/admin/history": { title: "History", subtitle: "Past consultations and records" },
  "/admin/settings": { title: "Settings", subtitle: "Configure your clinic settings" },
};

type AdminContextType = {
  title: string;
  subtitle: string;
};

const AdminContext = createContext<AdminContextType>({
  title: "Dashboard",
  subtitle: "Here's your clinic overview",
});

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [pageInfo, setPageInfo] = useState(routeTitles["/admin"]);

  useEffect(() => {
    const info = routeTitles[pathname] || { title: "Admin", subtitle: "" };
    setPageInfo(info);
  }, [pathname]);

  return (
    <AdminContext.Provider value={pageInfo}>
      {children}
    </AdminContext.Provider>
  );
}

export const useAdminContext = () => useContext(AdminContext);