"use client";

import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";
import { AdminProvider } from "@/components/admin/AdminContext";
import { Toaster } from "sonner";
import { useState } from "react";
import { bg } from "@/lib/theme";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <AdminProvider>
      <Toaster richColors position="top-right" />

      <div className="flex min-h-screen">
        <AdminSidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

        <div
          className="flex flex-col flex-1 md:ml-[72px] transition-all duration-300"
          style={{ backgroundColor: bg.page }}
        >
          <AdminHeader onMenuClick={() => setMobileOpen(true)} />
          <main className="flex-1 p-8">{children}</main>
        </div>
      </div>
    </AdminProvider>
  );
}