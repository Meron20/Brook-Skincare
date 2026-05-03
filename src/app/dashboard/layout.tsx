// "use client";

// import Link from "next/link";
// import { usePathname } from "next/navigation";
// import { signOut } from "next-auth/react";
// import {
//   LayoutDashboard,
//   Calendar,
//   FileText,
//   User,
//   Menu,
//   X,
//   Bell,
// } from "lucide-react";
// import { useEffect, useState } from "react";

// type NotificationBooking = {
//   _id: string;
//   treatment: string;
//   date: string;
//   time: string;
//   createdAt?: string;
//   customerId?: {
//     fullName?: string;
//     email?: string;
//   };
// };
// const [notifications, setNotifications] = useState<NotificationBooking[]>([]);

// export default function DashboardLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   const pathname = usePathname();
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false);
//   const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
//   const [notifications, setNotifications] = useState<NotificationBooking[]>([]);

//   const links = [
//     { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
//     { label: "Bookings", href: "/dashboard/bookings", icon: Calendar },
//     { label: "Journal", href: "/dashboard/journal", icon: FileText },
//   ];

//   useEffect(() => {
//     const fetchNotifications = async () => {
//       try {
//         const res = await fetch("/api/bookings");
//         const data = await res.json();

//         if (!res.ok) return;

//         const bookings = Array.isArray(data) ? data : data.bookings || [];

//         setNotifications(bookings.slice(0, 5));
//       } catch (error) {
//         console.error("Failed to fetch booking notifications", error);
//       }
//     };

//     fetchNotifications();
//   }, []);

//   return (
//     <div className="min-h-screen bg-[#f7f6f3] flex">
//       {isSidebarOpen && (
//         <div
//           className="fixed inset-0 bg-black/40 z-40 md:hidden"
//           onClick={() => setIsSidebarOpen(false)}
//         />
//       )}

//       <aside
//         className={`fixed md:static inset-y-0 left-0 z-50 w-64 bg-[#1E1548] text-white p-6 flex flex-col transform transition-transform duration-300 ${
//           isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
//         }`}
//       >
//         <div className="flex items-center justify-between mb-8">
//           <h2 className="text-xl font-bold">Brook Admin</h2>

//           <button className="md:hidden" onClick={() => setIsSidebarOpen(false)}>
//             <X size={22} />
//           </button>
//         </div>

//         <nav className="flex flex-col gap-2">
//           {links.map((item) => {
//             const Icon = item.icon;
//             const isActive =
//               item.href === "/dashboard"
//                 ? pathname === item.href
//                 : pathname.startsWith(item.href);

//             return (
//               <Link
//                 key={item.href}
//                 href={item.href}
//                 onClick={() => setIsSidebarOpen(false)}
//                 className={`flex items-center gap-3 px-4 py-3 rounded-xl transition ${
//                   isActive
//                     ? "bg-white text-[#1E1548]"
//                     : "text-white hover:bg-white/10"
//                 }`}
//               >
//                 <Icon size={18} />
//                 <span className="text-sm font-medium">{item.label}</span>
//               </Link>
//             );
//           })}
//         </nav>
//       </aside>

//       <div className="flex-1 flex flex-col">
//         <header className="bg-white border-b px-4 md:px-6 py-4 flex items-center justify-between shadow-sm">
//           <div className="flex items-center gap-3">
//             <button
//               className="md:hidden w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center"
//               onClick={() => setIsSidebarOpen(true)}
//             >
//               <Menu size={20} />
//             </button>

//             <div>
//               <h1 className="text-lg font-semibold text-[#1E1548]">
//                 Dashboard
//               </h1>
//               <p className="text-xs text-gray-500">Welcome back 👋</p>
//             </div>
//           </div>

//           <div className="flex items-center gap-3 relative">
//             <button
//               onClick={() => setIsNotificationsOpen((prev) => !prev)}
//               className="relative w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center"
//             >
//               <Bell size={16} />

//               {notifications.length > 0 && (
//                 <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[10px] flex items-center justify-center">
//                   {notifications.length}
//                 </span>
//               )}
//             </button>

//             {isNotificationsOpen && (
//               <div className="absolute right-0 top-12 w-80 bg-white border border-gray-100 rounded-2xl shadow-lg p-4 z-30">
//                 <h3 className="font-semibold text-[#1E1548] mb-3">
//                   Notifications
//                 </h3>

//                 <div className="flex flex-col gap-3">
//                   {notifications.length > 0 ? (
//                     notifications.map((booking) => (
//                       <Link
//                         key={booking._id}
//                         href="/dashboard/bookings"
//                         onClick={() => setIsNotificationsOpen(false)}
//                         className="rounded-xl bg-[#f7f6f3] p-3 text-sm text-gray-700 hover:bg-[#eee9dd] transition"
//                       >
//                         <p className="font-medium text-[#1E1548]">
//                           New booking created
//                         </p>

//                         <p className="text-xs text-gray-500 mt-1">
//                           {booking.customerId?.fullName || "Customer"} booked{" "}
//                           {booking.treatment}
//                         </p>

//                         <p className="text-xs text-gray-400 mt-1">
//                           {booking.date} at {booking.time}
//                         </p>
//                       </Link>
//                     ))
//                   ) : (
//                     <p className="text-sm text-gray-500">No notifications</p>
//                   )}
//                 </div>
//               </div>
//             )}

//             <div className="hidden sm:flex items-center gap-3">
//               <div className="w-9 h-9 rounded-full bg-[#1E1548] text-white flex items-center justify-center">
//                 <User size={16} />
//               </div>

//               <span className="text-sm font-medium text-gray-700">Admin</span>

//               <button
//                 onClick={() => signOut({ callbackUrl: "/login" })}
//                 className="rounded-full px-4 py-2 text-sm font-medium hover:opacity-90 transition"
//                 style={{ backgroundColor: "#C9A96E", color: "#1E1548" }}
//               >
//                 Sign Out
//               </button>
//             </div>

//             <button
//               onClick={() => signOut({ callbackUrl: "/login" })}
//               className="sm:hidden rounded-full px-3 py-2 text-xs font-medium hover:opacity-90 transition"
//               style={{ backgroundColor: "#C9A96E", color: "#1E1548" }}
//             >
//               Sign Out
//             </button>
//           </div>
//         </header>

//         <main className="p-4 md:p-8">{children}</main>
//       </div>
//     </div>
//   );
// }