"use client";

import { useSession } from "next-auth/react";
import { Bell, Search, Menu } from "lucide-react";
import { useAdminContext } from "./AdminContext";
import { useEffect, useState } from "react";

type AdminHeaderProps = {
    onMenuClick: () => void;
  };
  
export default function AdminHeader({ onMenuClick }: AdminHeaderProps) {
  const { data: session } = useSession();
  const { title, subtitle } = useAdminContext();
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    setAnimated(false);
    const t = setTimeout(() => setAnimated(true), 50);
    return () => clearTimeout(t);
  }, [title]);


  return (
    <header
      className=" sticky top-0 z-40 flex items-center justify-between px-8 py-4"
      style={{
        background: "linear-gradient(180deg, #1E1548 0%, #0f0b2e 100%)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid rgba(201,169,110,0.1)",
      }}
    >
    <div className="flex items-center gap-4">

       
     <button
        className="md:hidden p-2 rounded-xl flex-shrink-0"
        style={{ backgroundColor: "#1E1548", border: "1px solid rgba(201,169,110,0.3)" }}
        onClick={onMenuClick}
        aria-label="Open menu"
        >
        <Menu size={18} style={{ color: "#C9A96E" }} />
    </button>
    <div
        className="transition-all duration-500"
        style={{
          opacity: animated ? 1 : 0,
          transform: animated ? "translateY(0)" : "translateY(8px)",
        }}
      >
        <h1
          className="text-2xl font-bold"
          style={{
            background: "linear-gradient(135deg, #C9A96E 0%, #1E1548 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          {title}
        </h1>
        <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>
      </div>
    </div>
  
      <div
          className="hidden md:flex items-center gap-3 px-4 py-2 rounded-xl"
          style={{
            background: "linear-gradient(135deg, #C9A96E, #1E1548)",
            border: "1px solid rgba(30,21,72,0.08)",
            width: "240px",
          }}
        >
          <Search size={15} className="text-white" />
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent text-sm text-white placeholder-white outline-none w-full"
          />
        </div>
 
      <div className="flex items-center gap-3">

        <button
          className="relative p-2 rounded-xl transition-colors"
          style={{ backgroundColor: "rgba(255,255,255,0.04)" }}
        >
          <Bell size={18} className="text-gray-400" />
          <span
            className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full"
            style={{ backgroundColor: "#C9A96E" }}
          />
        </button>

      
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-sm font-medium text-white">
              {session?.user?.name || "Admin"}
            </p>
            <p className="text-xs" style={{ color: "#C9A96E" }}>
              Administrator
            </p>
          </div>

         
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold"
            style={{
              background: "linear-gradient(135deg, #C9A96E, #1E1548)",
              color: "white",
            }}
          >
            {session?.user?.name?.charAt(0).toUpperCase() || "A"}
          </div>
        </div>
      </div>
    </header>
  );
}