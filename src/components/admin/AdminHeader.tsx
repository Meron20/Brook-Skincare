"use client";

import { useSession } from "next-auth/react";
import { Bell, Search, Menu, X, User, Sparkles, CalendarCheck, BookOpen } from "lucide-react";
import { useAdminContext } from "./AdminContext";
import { useEffect, useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";

type AdminHeaderProps = {
  onMenuClick: () => void;
};

type SearchResult = {
  id: string;
  type: "user" | "service" | "booking" | "journal";
  title: string;
  subtitle: string;
  href: string;
};

const typeConfig = {
  user: { icon: User, label: "Customers", color: "#818cf8" },
  service: { icon: Sparkles, label: "Services", color: "#C9A96E" },
  booking: { icon: CalendarCheck, label: "Bookings", color: "#34d399" },
  journal: { icon: BookOpen, label: "Journal", color: "#f472b6" },
};

export default function AdminHeader({ onMenuClick }: AdminHeaderProps) {
  const { data: session } = useSession();
  const { title, subtitle } = useAdminContext();
  const router = useRouter();
  const [animated, setAnimated] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setAnimated(false);
    const t = setTimeout(() => setAnimated(true), 50);
    return () => clearTimeout(t);
  }, [title]);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchOpen(false);
        setSearchQuery("");
        setResults([]);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Debounced search
  const handleSearch = useCallback(async (query: string) => {
    if (query.trim().length < 3) {
      setResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    try {
      const res = await fetch(`/api/admin/search?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      setResults(data.results || []);
    } catch {
      setResults([]);
    } finally {
      setIsSearching(false);
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    setSearchOpen(true);

    // Debounce — wait 400ms after user stops typing
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => handleSearch(value), 400);
  };

  const handleResultClick = (href: string) => {
    router.push(href);
    setSearchOpen(false);
    setSearchQuery("");
    setResults([]);
  };

  // Group results by type
  const groupedResults = results.reduce((acc, result) => {
    if (!acc[result.type]) acc[result.type] = [];
    acc[result.type].push(result);
    return acc;
  }, {} as Record<string, SearchResult[]>);

  return (
    <header
      className="sticky top-0 z-40 flex items-center justify-between px-4 md:px-8 py-4"
      style={{
        background: "linear-gradient(180deg, #1E1548 0%, #0f0b2e 100%)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid rgba(201,169,110,0.1)",
      }}
    >
      {/* LEFT — Hamburger + Title */}
      <div className="flex items-center gap-4">
        <button
          className="md:hidden p-2 rounded-xl flex-shrink-0"
          style={{
            backgroundColor: "rgba(201,169,110,0.1)",
            border: "1px solid rgba(201,169,110,0.3)",
          }}
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
            className="text-xl md:text-2xl font-bold"
            style={{
              background: "linear-gradient(135deg, #C9A96E 0%, #ffffff 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            {title}
          </h1>
          <p className="text-xs text-gray-400 mt-0.5 hidden sm:block">
            {subtitle}
          </p>
        </div>
      </div>

      {/* RIGHT — Search + Bell + User */}
      <div className="flex items-center justify-center ">

        {/* ── SEARCH ── */}
   
           <div ref={searchRef} className="relative hidden md:block">
             <div
                    className="flex items-center gap-3 px-4 py-2 rounded-xl cursor-pointer"
                    style={{
                    background: searchOpen
                        ? "rgba(255,255,255,0.1)"
                        : "linear-gradient(135deg, #C9A96E, #1E1548)",
                    border: searchOpen
                        ? "1px solid rgba(201,169,110,0.5)"
                        : "1px solid transparent",
                    width: searchOpen ? "300px" : "200px",
                    transition: "all 0.3s ease",
                    }}
                >
            {isSearching ? (
              <div
                className="w-3.5 h-3.5 rounded-full border-2 animate-spin flex-shrink-0"
                style={{ borderColor: "#C9A96E", borderTopColor: "transparent" }}
              />
            ) : (
              <Search size={14} style={{ color: "white", flexShrink: 0 }} />
            )}
            <input
              type="text"
              placeholder="Search users, services..."
              value={searchQuery}
              onChange={handleInputChange}
              onFocus={() => setSearchOpen(true)}
              className="bg-transparent text-sm text-white placeholder-white outline-none w-full"
            />
            {searchQuery && (
              <button onClick={() => {
                setSearchQuery("");
                setResults([]);
                setSearchOpen(false);
              }}>
                <X size={13} className="text-gray-500 hover:text-white transition-colors" />
              </button>
            )}
          </div>

          {/* ── RESULTS DROPDOWN ── */}
          {searchOpen && searchQuery.trim().length >= 3 && (
            <div
              className="absolute top-full right-0 mt-2 w-80 rounded-2xl overflow-hidden shadow-2xl z-50"
              style={{
                backgroundColor: "#12092e",
                border: "1px solid rgba(201,169,110,0.2)",
              }}
            >
              {isSearching ? (
                <div className="flex items-center justify-center gap-3 py-6">
                  <div
                    className="w-4 h-4 rounded-full border-2 animate-spin"
                    style={{ borderColor: "#C9A96E", borderTopColor: "transparent" }}
                  />
                  <p className="text-sm text-gray-500">Searching...</p>
                </div>
              ) : results.length > 0 ? (
                <>
                  {Object.entries(groupedResults).map(([type, items]) => {
                    const config = typeConfig[type as keyof typeof typeConfig];
                    const Icon = config.icon;
                    return (
                      <div key={type}>
                        {/* Category header */}
                        <div
                          className="flex items-center gap-2 px-4 pt-3 pb-1"
                        >
                          <Icon size={12} style={{ color: config.color }} />
                          <p
                            className="text-xs font-semibold uppercase tracking-wider"
                            style={{ color: config.color }}
                          >
                            {config.label}
                          </p>
                          <span
                            className="text-xs px-1.5 py-0.5 rounded-full"
                            style={{
                              backgroundColor: `${config.color}20`,
                              color: config.color,
                            }}
                          >
                            {items.length}
                          </span>
                        </div>

                        {/* Results */}
                        {items.map(result => (
                          <button
                            key={String(result.id)}
                            onClick={() => handleResultClick(result.href)}
                            className="w-full flex items-center gap-3 px-4 py-2.5 text-left transition-all hover:bg-white/5 group"
                          >
                            <div
                              className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                              style={{ backgroundColor: `${config.color}15` }}
                            >
                              <Icon size={13} style={{ color: config.color }} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-white truncate">
                                {result.title}
                              </p>
                              <p className="text-xs text-gray-500 truncate">
                                {result.subtitle}
                              </p>
                            </div>
                          </button>
                        ))}

                        <div
                          style={{ height: "1px", backgroundColor: "rgba(255,255,255,0.04)", margin: "4px 0" }}
                        />
                      </div>
                    );
                  })}

                  {/* Footer */}
                  <div className="px-4 py-2.5">
                    <p className="text-xs text-gray-600">
                      {results.length} result{results.length !== 1 ? "s" : ""} for &quot;{searchQuery}&quot;
                    </p>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 gap-2">
                  <Search size={24} className="text-gray-700" />
                  <p className="text-sm text-gray-500">
                    No results for &quot;{searchQuery}&quot;
                  </p>
                  <p className="text-xs text-gray-700">
                    Try a different search term
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Hint when less than 3 chars */}
          {searchOpen && searchQuery.trim().length > 0 && searchQuery.trim().length < 3 && (
            <div
              className="absolute top-full right-0 mt-2 w-80 rounded-2xl px-4 py-3 shadow-2xl z-50"
              style={{
                backgroundColor: "#12092e",
                border: "1px solid rgba(201,169,110,0.2)",
              }}
            >
              <p className="text-xs text-gray-500 text-center">
                Type at least 3 characters to search...
              </p>
            </div>
          )}
         </div>
        </div>

        {/* ── BELL ── */}
     <div className="flex items-center justify-end gap-3">
        <button
          className="relative p-2.5 rounded-xl transition-all hover:scale-105"
          style={{
            backgroundColor: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <Bell size={16} className="text-gray-400" />
          <span
            className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full"
            style={{ backgroundColor: "#C9A96E" }}
          />
        </button>

        {/* ── USER INFO ── */}
        
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium text-white leading-tight">
              {session?.user?.name || "Admin"}
            </p>
            <p className="text-xs" style={{ color: "#C9A96E" }}>
              Administrator
            </p>
          </div>
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold flex-shrink-0"
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