"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, Loader2, Mail } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setIsLoading(true);
    setMessage("");
    setError("");

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Something went wrong. Please try again.");
        return;
      }

      setMessage(data.message);
      setEmail("");
    } catch (error) {
      console.error("Forgot password error:", error);

      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#F0F7F2] px-4 py-12 flex items-center justify-center">
      <div className="w-full max-w-md">
        {/* Back */}
        <Link
          href="/login"
          className="mb-6 inline-flex items-center gap-2 text-sm text-[#0A1F14]/60 transition hover:text-[#C9A96E]"
        >
          <ArrowLeft size={17} />
          Back to sign in
        </Link>

        {/* Card */}
        <div className="relative overflow-hidden rounded-3xl border border-[#C9A96E]/25 bg-white p-7 shadow-xl sm:p-10">
          {/* Gold top line */}
          <div className="absolute left-0 right-0 top-0 h-[3px] bg-gradient-to-r from-transparent via-[#C9A96E] to-transparent" />

          {/* Header */}
          <div className="mb-8">
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-[#0A1F14] text-[#C9A96E]">
              <Mail size={21} />
            </div>

            <h1
              className="text-3xl font-semibold text-[#0A1F14]"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              Forgot your password?
            </h1>

            <p className="mt-2 text-sm leading-relaxed text-gray-500">
              Enter the email address associated with your Brook Skincare
              account and we&apos;ll send you a link to reset your password.
            </p>
          </div>

          {/* Success */}
          {message && (
            <div className="mb-6 flex gap-3 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-700">
              <CheckCircle2 size={19} className="mt-0.5 shrink-0" />

              <div>
                <p className="font-medium">Check your email</p>
                <p className="mt-1 text-green-700/80">{message}</p>
              </div>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-medium text-[#0A1F14]"
            >
              Email address
            </label>

            <div className="relative">
              <Mail
                size={17}
                className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                id="email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full border-b border-[#0A1F14] bg-transparent py-3 pl-7 pr-3 text-sm text-black outline-none transition focus:border-[#C9A96E]"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="mt-7 flex w-full items-center justify-center gap-2 rounded-xl bg-[#0A1F14] px-5 py-3.5 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Sending...
                </>
              ) : (
                "Send reset link"
              )}
            </button>
          </form>

          <p className="mt-7 text-center text-sm text-gray-500">
            Remember your password?{" "}
            <Link
              href="/login"
              className="font-medium hover:underline"
              style={{ color: "#C9A96E" }}
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}