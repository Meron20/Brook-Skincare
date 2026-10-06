"use client";

import { FormEvent, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  Eye,
  EyeOff,
  Loader2,
  Lock,
} from "lucide-react";

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!token) {
      setError(
        "This password reset link is invalid. Please request a new one."
      );
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setIsLoading(true);

      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Unable to reset password.");
        return;
      }

      setSuccess("Your password has been reset successfully.");

      setPassword("");
      setConfirmPassword("");

      // Send user back to login
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (error) {
      console.error("Reset password error:", error);

      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F0F7F2] px-4 py-12">
      <div className="w-full max-w-md">
        <Link
          href="/login"
          className="mb-6 inline-flex items-center gap-2 text-sm text-[#0A1F14]/60 transition hover:text-[#C9A96E]"
        >
          <ArrowLeft size={17} />
          Back to sign in
        </Link>

        <div className="relative overflow-hidden rounded-3xl border border-[#C9A96E]/25 bg-white p-7 shadow-xl sm:p-10">
          {/* Gold top line */}
          <div className="absolute left-0 right-0 top-0 h-[3px] bg-gradient-to-r from-transparent via-[#C9A96E] to-transparent" />

          <div className="mb-8">
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-[#0A1F14] text-[#C9A96E]">
              <Lock size={21} />
            </div>

            <h1
              className="text-3xl font-semibold text-[#0A1F14]"
              style={{
                fontFamily: "'Cormorant Garamond', serif",
              }}
            >
              Create new password
            </h1>

            <p className="mt-2 text-sm leading-relaxed text-gray-500">
              Choose a new password for your Brook Skincare account.
            </p>
          </div>

          {/* Invalid URL */}
          {!token && (
            <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
              This password reset link is invalid. Please request a new one.
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
              {error}
            </div>
          )}

          {/* Success */}
          {success && (
            <div className="mb-6 flex gap-3 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-700">
              <CheckCircle2
                size={19}
                className="mt-0.5 shrink-0"
              />

              <div>
                <p className="font-medium">Password updated</p>
                <p className="mt-1">
                  {success} Redirecting you to sign in...
                </p>
              </div>
            </div>
          )}

          {!success && (
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* New password */}
              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-medium text-[#0A1F14]"
                >
                  New password
                </label>

                <div className="relative">
                  <Lock
                    size={17}
                    className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="new-password"
                    placeholder="Enter your new password"
                    disabled={!token || isLoading}
                    className="w-full border-b border-[#0A1F14] bg-transparent py-3 pl-7 pr-9 text-sm text-black outline-none transition focus:border-[#C9A96E] disabled:opacity-50"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-400 transition hover:text-[#C9A96E]"
                  >
                    {showPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
              </div>

              {/* Confirm password */}
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="mb-2 block text-sm font-medium text-[#0A1F14]"
                >
                  Confirm new password
                </label>

                <div className="relative">
                  <Lock
                    size={17}
                    className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) =>
                      setConfirmPassword(e.target.value)
                    }
                    autoComplete="new-password"
                    placeholder="Confirm your new password"
                    disabled={!token || isLoading}
                    className="w-full border-b border-[#0A1F14] bg-transparent py-3 pl-7 pr-9 text-sm text-black outline-none transition focus:border-[#C9A96E] disabled:opacity-50"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword((prev) => !prev)
                    }
                    className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-400 transition hover:text-[#C9A96E]"
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={!token || isLoading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#0A1F14] px-5 py-3.5 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <Loader2
                      size={18}
                      className="animate-spin"
                    />
                    Updating password...
                  </>
                ) : (
                  "Reset password"
                )}
              </button>
            </form>
          )}

          {!token && (
            <Link
              href="/forgot-password"
              className="mt-6 block text-center text-sm font-medium hover:underline"
              style={{ color: "#C9A96E" }}
            >
              Request a new reset link
            </Link>
          )}
        </div>
      </div>
    </main>
  );
}