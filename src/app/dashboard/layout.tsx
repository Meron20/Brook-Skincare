import Link from "next/link";
import { LayoutDashboard, Users, Calendar, FileText } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const links = [
    { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { label: "Customers", href: "/dashboard/customers", icon: Users },
    { label: "Bookings", href: "/dashboard/bookings", icon: Calendar },
    { label: "Journal", href: "/dashboard/journal", icon: FileText },
  ];

  return (
    <div className="min-h-screen bg-[#f7f6f3] flex">
      <aside className="hidden md:flex w-64 bg-[#1E1548] text-white p-6 flex-col">
        <h2 className="text-xl font-bold mb-8">Brook Admin</h2>

        <nav className="flex flex-col gap-2">
          {links.map((item) => {
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/10 transition"
              >
                <Icon size={18} />
                <span className="text-sm">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>

      <main className="flex-1 p-4 md:p-8">{children}</main>
    </div>
  );
}