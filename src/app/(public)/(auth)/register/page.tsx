"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Mail, Lock, Eye, EyeOff, User } from "lucide-react";
import { Button } from "@/components/ui/button";

const registerSchema = z
  .object({
    fullName: z.string().min(2, "Full name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [serverError, setServerError] = useState("");
  const [serverSuccess, setServerSuccess] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    setServerError("");
    setServerSuccess("");

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName: data.fullName,
          email: data.email,
          password: data.password,
        }),
      });

      const result = await res.json();

      if (!res.ok) {
        setServerError(result.message || "Something went wrong.");
        return;
      }

      setServerSuccess("Account created successfully! Redirecting to login...");
      reset();

      setTimeout(() => {
        router.push("/login");
      }, 1200);
    } catch {
      setServerError("Server error. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-[#1E1548] mb-3">
          Welcome to <span style={{ color: "#C9A96E" }}>Brook Skincare</span>
        </h1>
        <p className="text-gray-500 text-base max-w-md mx-auto">
          Create your account to book your personal skincare consultation with a
          licensed skincare specialist.
        </p>
      </div>

      <div className="w-full max-w-4xl rounded-3xl overflow-hidden shadow-2xl flex min-h-[580px] bg-white">
        <div className="w-full md:w-1/2 flex flex-col px-8 py-10">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-[#1E1548] mb-1">
              Create your account
            </h2>
            <p className="text-gray-500 text-sm">
              Join Brook Skincare and book your first consultation
            </p>
          </div>

          <div
            className="flex rounded-full p-1 mb-6 w-fit"
            style={{ backgroundColor: "#2a1f5e" }}
          >
            <Link
              href="/login"
              className="px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 text-gray-400"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="px-5 py-2 rounded-full text-sm font-medium transition-all duration-300"
              style={{
                backgroundColor: "#C9A96E",
                color: "#1E1548",
              }}
            >
              Register
            </Link>
          </div>

          <p className="text-sm text-gray-500 mb-6">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-medium hover:underline"
              style={{ color: "#C9A96E" }}
            >
              Sign in here
            </Link>
          </p>

          {serverError && (
            <div
              className="w-full px-4 py-3 rounded-xl text-sm text-red-600 mb-4"
              style={{
                backgroundColor: "rgba(239,68,68,0.1)",
                border: "1px solid rgba(239,68,68,0.2)",
              }}
            >
              {serverError}
            </div>
          )}

          {serverSuccess && (
            <div
              className="w-full px-4 py-3 rounded-xl text-sm text-green-700 mb-4"
              style={{
                backgroundColor: "rgba(34,197,94,0.1)",
                border: "1px solid rgba(34,197,94,0.2)",
              }}
            >
              {serverSuccess}
            </div>
          )}

          <form
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            className="flex flex-col gap-4 flex-1"
          >
            <div className="flex flex-col gap-1">
              <label className="text-sm text-[#1E1548]">Full name</label>
              <div className="relative">
                <User
                  className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-400"
                  size={16}
                />
                <input
                  {...register("fullName")}
                  type="text"
                  placeholder="Enter your full name"
                  className="w-full pl-7 py-3 text-sm text-black placeholder-gray-400 outline-none bg-transparent border-b transition-all"
                  style={{
                    borderBottom: errors.fullName
                      ? "2px solid #ef4444"
                      : "1px solid #1E1548",
                  }}
                />
              </div>
              {errors.fullName && (
                <p className="text-xs text-red-600">{errors.fullName.message}</p>
              )}
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm text-[#1E1548]">Email address</label>
              <div className="relative">
                <Mail
                  className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-400"
                  size={16}
                />
                <input
                  {...register("email")}
                  type="text"
                  placeholder="you@example.com"
                  className="w-full pl-7 py-3 text-sm text-black placeholder-gray-400 outline-none bg-transparent border-b transition-all"
                  style={{
                    borderBottom: errors.email
                      ? "2px solid #ef4444"
                      : "1px solid #1E1548",
                  }}
                />
              </div>
              {errors.email && (
                <p className="text-xs text-red-600">{errors.email.message}</p>
              )}
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm text-[#1E1548]">Password</label>
              <div className="relative">
                <Lock
                  className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-400"
                  size={16}
                />
                <input
                  {...register("password")}
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  className="w-full pl-7 pr-8 py-3 text-sm text-black placeholder-gray-400 outline-none bg-transparent border-b transition-all"
                  style={{
                    borderBottom: errors.password
                      ? "2px solid #ef4444"
                      : "1px solid #1E1548",
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-400"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-red-600">{errors.password.message}</p>
              )}
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm text-[#1E1548]">Confirm password</label>
              <div className="relative">
                <Lock
                  className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-400"
                  size={16}
                />
                <input
                  {...register("confirmPassword")}
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  className="w-full pl-7 pr-8 py-3 text-sm text-black placeholder-gray-400 outline-none bg-transparent border-b transition-all"
                  style={{
                    borderBottom: errors.confirmPassword
                      ? "2px solid #ef4444"
                      : "1px solid #1E1548",
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-400"
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-xs text-red-600">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-xl text-sm font-semibold mt-1 hover:opacity-90"
              style={{ backgroundColor: "#1E1548", color: "white" }}
            >
              {isLoading ? "Creating account..." : "Create Account"}
            </Button>
          </form>
        </div>

        <div className="hidden md:block md:w-1/2 relative">
          <Image
            src="/login.png"
            alt="Brook Skincare"
            fill
            sizes="50vw"
            className="object-cover object-center"
            priority
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to top, rgba(30,21,72,0.85) 0%, rgba(30,21,72,0.2) 60%, transparent 100%)",
            }}
          />
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