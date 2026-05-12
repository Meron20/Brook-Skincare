"use client";

import { Loader2, AlertCircle, User } from "lucide-react";
import { bg, text, border, skeleton, palette, gradient } from "@/lib/theme";

// ─── PageLoading ──────────────────────────────────────────────────────────────
export function PageLoading({ label = "Loading..." }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-3">
      <Loader2
        size={32}
        className="animate-spin"
        style={{ color: palette.gold }}
      />
      <p className="text-sm" style={{ color: text.muted }}>
        {label}
      </p>
    </div>
  );
}

// ─── PageError ────────────────────────────────────────────────────────────────
export function PageError({
  message = "Something went wrong.",
  onRetry,
}: {
  message?: string;
  onRetry?: () => void;
}) {
  return (
    <div
      className="flex flex-col items-center justify-center py-16 gap-4 rounded-2xl"
      style={{
        border: `1px dashed ${border.gold}`,
        backgroundColor: palette.goldFaint,
      }}
    >
      <div
        className="w-14 h-14 rounded-2xl flex items-center justify-center"
        style={{
          background: palette.errorBg,
          border: `1px solid ${palette.errorBorder}`,
        }}
      >
        <AlertCircle size={24} style={{ color: palette.errorText }} />
      </div>

      <div className="text-center">
        <p className="text-sm font-semibold mb-1" style={{ color: text.primary }}>
          Could not load data
        </p>
        <p className="text-xs max-w-xs" style={{ color: text.muted }}>
          {message}
        </p>
      </div>

      {onRetry && (
        <button
          onClick={onRetry}
          className="px-5 py-2 rounded-xl text-xs font-semibold transition-opacity hover:opacity-80"
          style={{ background: gradient.gold, color: bg.page }}
        >
          Try again
        </button>
      )}
    </div>
  );
}

// ─── EmptyState ───────────────────────────────────────────────────────────────
export function EmptyState({
  title,
  description,
  icon,
}: {
  title: string;
  description: string;
  icon?: React.ReactNode;
}) {
  return (
    <div
      className="flex flex-col items-center justify-center py-20 gap-4 rounded-2xl"
      style={{
        border: `1px dashed ${border.gold}`,
        backgroundColor: palette.goldFaint,
      }}
    >
      <div
        className="w-14 h-14 rounded-2xl flex items-center justify-center"
        style={{
          background: palette.goldMuted,
          border: `1px solid ${border.gold}`,
        }}
      >
        {icon ?? <User size={22} style={{ color: palette.gold }} />}
      </div>

      <div className="text-center">
        <p className="text-sm font-medium" style={{ color: text.secondary }}>
          {title}
        </p>
        <p className="text-xs mt-1" style={{ color: text.muted }}>
          {description}
        </p>
      </div>
    </div>
  );
}

// ─── TableSkeleton ────────────────────────────────────────────────────────────
function Bone({ w, h = 10, radius = 6 }: { w: number | string; h?: number; radius?: number }) {
  return (
    <div
      className="animate-pulse"
      style={{ width: w, height: h, borderRadius: radius, background: skeleton.base }}
    />
  );
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="rounded-2xl overflow-hidden" style={{ border: `1px solid ${border.subtle}` }}>
      {/* Header */}
      <div
        className="grid grid-cols-8 md:grid-cols-12 px-6 py-4 gap-4 items-center"
        style={{ background: gradient.sidebar }}
      >
        <div className="col-span-4"><Bone w={80} /></div>
        <div className="hidden md:block col-span-4"><Bone w={60} /></div>
        <div className="hidden md:block col-span-2"><Bone w={70} /></div>
        <div className="col-span-4 md:col-span-2"><Bone w={50} /></div>
      </div>

      {/* Rows */}
      <div>
        {Array.from({ length: rows }).map((_, i) => (
          <div
            key={i}
            className="grid grid-cols-8 md:grid-cols-12 px-6 py-4 items-center gap-4"
            style={{
              borderTop: `1px solid ${border.subtle}`,
              backgroundColor: i % 2 === 0 ? bg.card : bg.hover,
            }}
          >
            <div className="col-span-3 md:col-span-4 flex items-center gap-3">
              <div
                className="w-8 h-8 rounded-lg flex-shrink-0 animate-pulse"
                style={{ background: skeleton.highlight }}
              />
              <Bone w={80 + (i * 17) % 60} />
            </div>
            <div className="hidden md:block col-span-4"><Bone w={100 + (i * 23) % 60} /></div>
            <div className="hidden md:flex col-span-2 justify-center"><Bone w={50 + (i * 11) % 40} /></div>
            <div className="col-span-5 md:col-span-2 flex justify-center"><Bone w={58} h={26} radius={8} /></div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div
        className="px-6 py-3 flex justify-between items-center"
        style={{ borderTop: `1px solid ${border.subtle}`, backgroundColor: bg.hover }}
      >
        <Bone w={100} />
        <Bone w={50} />
      </div>
    </div>
  );
}
