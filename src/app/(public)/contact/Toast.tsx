import { AlertCircle, CheckCircle } from "lucide-react";

type ToastProps = {
  toast: {
    type: "success" | "error";
    message: string;
    id: number;
  };
};

export default function Toast({ toast }: ToastProps) {
  return (
    <div
      key={toast.id}
      className="fixed bottom-6 left-5 right-5 z-[999] mx-auto max-w-sm md:left-auto md:right-6 md:mx-0"
      style={{
        animation: "toastIn 0.45s cubic-bezier(0.22,1,0.36,1) both",
      }}
    >
      <div className="relative overflow-hidden rounded-2xl border border-[#C9A84C]/25 bg-[#071F14]/90 shadow-[0_8px_60px_rgba(0,0,0,0.55),0_0_0_1px_rgba(201,168,76,0.08)] backdrop-blur-2xl">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#C9A84C]/8 via-transparent to-transparent" />

        <div className="relative flex items-start gap-3.5 px-5 py-4">
          <div
            className="mt-0.5 shrink-0"
            style={{
              color: toast.type === "success" ? "#C9A84C" : "#ef4444",
              animation:
                toast.type === "success"
                  ? "iconPulse 2s ease-in-out infinite"
                  : undefined,
            }}
          >
            {toast.type === "success" ? (
              <CheckCircle size={22} strokeWidth={1.8} />
            ) : (
              <AlertCircle size={22} strokeWidth={1.8} />
            )}
          </div>

          <div className="min-w-0 flex-1">
            <p className="mb-1 text-xs font-semibold uppercase tracking-[0.18em] text-[#C9A84C]">
              {toast.type === "success" ? "Message sent" : "Something went wrong"}
            </p>
            <p className="text-sm leading-relaxed text-white/70">
              {toast.message}
            </p>
          </div>
        </div>

        <div className="relative h-[2px] bg-white/5">
          <div
            className="absolute left-0 top-0 h-full rounded-full"
            style={{
              background:
                toast.type === "success"
                  ? "linear-gradient(90deg, #C9A84C, #E8C96A)"
                  : "#ef4444",
              animation: "toastBar 4s linear forwards",
            }}
          />
        </div>
      </div>
    </div>
  );
}