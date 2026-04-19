"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";

// ── ZOD SCHEMA ──
const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    // We will connect this to NextAuth later
    console.log("Form data:", data);
    setTimeout(() => setIsLoading(false), 1500);
  };

  const handleTabSwitch = (tab: "login" | "register") => {
    setActiveTab(tab);
    reset();
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4 py-12"
    //   style={{ backgroundColor: "#0f0b2e" }}
    >
      {/* ── PAGE HEADER ── */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-[#1E1548] mb-3">
          Welcome to{" "}
          <span style={{ color: "#C9A96E" }}>Brook Skincare</span>
        </h1>
        <p className="text-gray-500 text-base max-w-md mx-auto">
          Book your personal skin consultation with a licensed skincare
          specialist — available online, worldwide.
        </p>
      </div>

      {/* ── CARD ── */}
      <div className="w-full max-w-4xl rounded-3xl overflow-hidden shadow-2xl flex min-h-[580px] text-[#1E1548]">

        {/* ── LEFT — FORM SIDE ── */}
        <div
          className="w-full md:w-1/2 flex flex-col px-8 py-10  text-[#1E1548] "
        >
          {/* Welcome text */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-1">
              Sign in to your account
            </h2>
            <p className="text-gray-500 text-sm">
              Access your bookings and consultation history
            </p>
          </div>

          {/* ── PILL TOGGLE ── */}
          <div
            className="flex rounded-full p-1 mb-6 w-fit"
            style={{ backgroundColor: "#2a1f5e" }}
          >
            {(["login", "register"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => handleTabSwitch(tab)}
                className="px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 capitalize"
                style={{
                  backgroundColor:
                    activeTab === tab ? "#C9A96E" : "transparent",
                  color: activeTab === tab ? "#1E1548" : "#9ca3af",
                }}
              >
                {tab === "login" ? "Sign In" : "Register"}
              </button>
            ))}
          </div>

          {/* ── NO ACCOUNT LINK ── */}
          <p className="text-sm text-gray-500 mb-6">
            {activeTab === "login" ? (
              <>
                Don&apos;t have an account?{" "}
                <button
                  onClick={() => handleTabSwitch("register")}
                  className="font-medium hover:underline transition-colors"
                  style={{ color: "#CFA86A" }}
                >
                  Create one here
                </button>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <button
                  onClick={() => handleTabSwitch("login")}
                  className="font-medium hover:underline hover:opacity-80 transition-colors"
                  style={{ color: "#CFA86A" }}
                >
                  Sign in here
                </button>
              </>
            )}
          </p>

          {/* ── FORM ── */}
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 flex-1">

            {/* Email */}
            <div className="flex flex-col gap-1">
              <label className="text-sm text-[#1E1548]">
                Email address
              </label>
              <input
                    {...register("email")}
                    type="email"
                    placeholder="you@example.com"
                    className="w-full px-0 py-3 text-sm text-black placeholder-gray-400 outline-none bg-transparent border-b transition-all"
                    style={{
                        borderBottom: errors.email
                        ? "2px solid #ef4444"
                        : "1px solid #1E1548",
                    }}
                />
                {errors.email && (
                    <p className="text-xs text-red-600 mt-1">
                    {errors.email.message}
                    </p>
                )}
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <label className="text-sm text-[#1E1548]">Password</label>
                <Link
                  href="/forgot-password"
                  className="text-xs hover:underline"
                  style={{ color: "#CFA86A" }}
                >
                  Forgot password?
                </Link>
              </div>
              <input
                {...register("password")}
                type="password"
                placeholder="Enter your password"
                className="w-full px-0 py-3 text-sm text-black placeholder-gray-400 outline-none bg-transparent border-b transition-all"
                style={{
                    borderBottom: errors.email
                    ? "2px solid #ef4444"
                    : "1px solid #1E1548",
                }}
              />
              {errors.password && (
                <p className="text-xs text-red-600 mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Divider */}
            <div className="flex items-center gap-3 my-1">
              <div className="flex-1 h-px" style={{ backgroundColor: "rgba(255,255,255,0.08)" }} />
              <span className="text-xs text-gray-500">or continue with</span>
              <div className="flex-1 h-px" style={{ backgroundColor: "rgba(255,255,255,0.08)" }} />
            </div>

            {/* Social buttons */}
            <div className="flex  gap-3">
              <button
                type="button"
                className="w-full flex items-center justify-center gap-3 py-3 rounded-xl text-sm font-medium text-white transition-all hover:opacity-90"
                style={{
                  backgroundColor: "#C9A96E", color: "#1E1548",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.7 9.05 7.4c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.39-1.32 2.76-2.54 3.99zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" fill="white"/>
                </svg>
                Sign in with Apple
              </button>

              <button
                type="button"
                className="w-full flex items-center justify-center gap-3 py-3 rounded-xl text-sm font-medium text-white transition-all hover:opacity-90"
                style={{
                  backgroundColor: "#C9A96E", color: "#1E1548",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Sign in with Google
              </button>
            </div>
            <div>

            {/* Login button */}
                <Button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 rounded-xl text-sm font-semibold mt-1 transition-all hover:opacity-90"
                style={{ backgroundColor: "#2a1f5e" }}
            
                >
                {isLoading ? "Signing in..." : "Sign In"}
                </Button>
            </div>

          </form>
        </div>

        {/* ── RIGHT — IMAGE SIDE ── */}
        <div className="hidden md:block md:w-1/2 relative">
          <Image
            src="/login.png"
            alt="Brook Skincare"
            fill
            className="object-cover object-center"
            priority
          />

          {/* Overlay gradient */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to top, rgba(30,21,72,0.85) 0%, rgba(30,21,72,0.2) 60%, transparent 100%)",
            }}
          />

          {/* Bottom text */}
          <div className="absolute bottom-8 left-6 right-6 z-10">
            <p
              className="text-lg font-semibold text-white mb-1"
              style={{ textShadow: "0 1px 4px rgba(0,0,0,0.4)" }}
            >
              Your skin deserves expert care
            </p>
            <p className="text-sm text-gray-300">
              Personalized consultations with a licensed skincare specialist,
              wherever you are in the world.
            </p>
          </div>
        </div>

      </div>

      {/* ── FOOTER NOTE ── */}
      <p className="text-xs text-gray-600 mt-8 text-center">
        By continuing, you agree to Brook Skincare&apos;s{" "}
        <Link href="/terms" className="hover:underline" style={{ color: "#C9A96E" }}>
          Terms of Service
        </Link>{" "}
        and{" "}
        <Link href="/privacy" className="hover:underline" style={{ color: "#C9A96E" }}>
          Privacy Policy
        </Link>
      </p>
    </div>
  );
}