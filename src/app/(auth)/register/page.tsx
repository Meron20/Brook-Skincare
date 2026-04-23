"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Mail, User, Lock, EyeOff, Eye } from "lucide-react";

type FormData = {
  email: string;
  fullName: string;
  password: string;
  confirmPassword: string;
};

type FormErrors = {
  email?: string;
  fullName?: string;
  password?: string;
  confirmPassword?: string;
  general?: string;
};

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    email: "",
    fullName: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
      general: "",
    }));

    setSuccessMessage("");
  };

  const validateForm = () => {
    const newErrors: FormErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.email.trim()) {
      newErrors.email = "E-postadress är obligatorisk.";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Ange en giltig e-postadress (ex: namn@mail.com)";
    }

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Användarnamn är obligatoriskt.";
    } else if (formData.fullName.trim().length < 2) {
      newErrors.fullName = "Användarnamnet måste vara minst 2 tecken.";
    }

    if (!formData.password) {
      newErrors.password = "Lösenord är obligatoriskt.";
    } else if (formData.password.length < 6) {
      newErrors.password = "Lösenordet måste vara minst 6 tecken.";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Bekräfta ditt lösenord.";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Lösenorden matchar inte.";
    }

    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const validationErrors = validateForm();
    setErrors(validationErrors);
    setSuccessMessage("");

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    try {
      setIsLoading(true);

      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          username: formData.fullName,
          password: formData.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrors({
          general: data.message || "Något gick fel.",
        });
        return;
      }

      setSuccessMessage("Registrering lyckades!");

      setFormData({
        email: "",
        fullName: "",
        password: "",
        confirmPassword: "",
      });
    } catch (error) {
      console.error(error);
      setErrors({
        general: "Serverfel. Försök igen senare.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f3f3f3] px-6 py-10">
      <section className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-black">
            Get in Touch with Brook Skincare
          </h1>
          <p className="text-gray-500 mt-4 max-w-2xl mx-auto text-sm md:text-base leading-relaxed">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cursus nibh
            mauris, nec turpis orci lectus maecenas. Suspendisse sed magna eget
            nibh in turpis.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-center mb-5 text-sm text-gray-800">
              Welcome to lorem..!
            </p>

            <div className="flex bg-[#eadfcf] rounded-full p-1 max-w-[280px] mb-6">
              <Link
                href="/login"
                className="w-1/2 py-2 rounded-full text-[#1E1548] font-medium text-center"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="w-1/2 py-2 rounded-full bg-[#1E2C8C] text-white font-medium text-center"
              >
                Register
              </Link>
            </div>

            <p className="text-sm text-gray-800 mb-10 leading-6">
              If you don’t have an account register
              <br />
              You can{" "}
              <span className="text-blue-700 font-semibold">
                Register here!
              </span>
            </p>

            <form
              onSubmit={handleSubmit}
              noValidate
              className="space-y-8 max-w-md"
            >
              {errors.general && (
                <p className="text-red-500 text-sm">{errors.general}</p>
              )}

              {successMessage && (
                <p className="text-green-600 text-sm">{successMessage}</p>
              )}

              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <div
                  className={`flex items-center border-b pb-2 ${
                    errors.email ? "border-red-500" : "border-black"
                  }`}
                >
                  <Mail className="w-4 h-4 text-gray-500 mr-2" />
                  <input
                    name="email"
                    type="email"
                    placeholder="Enter your email address"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full bg-transparent outline-none text-sm"
                  />
                </div>
                {errors.email && (
                  <p className="text-red-500 text-sm mt-2">{errors.email}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Username
                </label>
                <div
                  className={`flex items-center border-b pb-2 ${
                    errors.fullName ? "border-red-500" : "border-black"
                  }`}
                >
                  <User className="w-4 h-4 text-gray-500 mr-2" />
                  <input
                    name="username"
                    type="text"
                    placeholder="Enter your user name"
                    value={formData.fullName}
                    onChange={handleChange}
                    className="w-full bg-transparent outline-none text-sm"
                  />
                </div>
                {errors.fullName && (
                  <p className="text-red-500 text-sm mt-2">{errors.fullName}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Password
                </label>
                <div
                  className={`flex items-center border-b pb-2 ${
                    errors.password ? "border-red-500" : "border-black"
                  }`}
                >
                  <Lock className="w-4 h-4 text-gray-500 mr-2" />
                  <input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full bg-transparent outline-none text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="ml-2"
                  >
                    {showPassword ? (
                      <Eye className="w-4 h-4 text-gray-500 cursor-pointer" />
                    ) : (
                      <EyeOff className="w-4 h-4 text-gray-500 cursor-pointer" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-500 text-sm mt-2">{errors.password}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Confirm Password
                </label>
                <div
                  className={`flex items-center border-b pb-2 ${
                    errors.confirmPassword ? "border-red-500" : "border-black"
                  }`}
                >
                  <Lock className="w-4 h-4 text-gray-500 mr-2" />
                  <input
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full bg-transparent outline-none text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    className="ml-2"
                  >
                    {showConfirmPassword ? (
                      <Eye className="w-4 h-4 text-gray-500 cursor-pointer" />
                    ) : (
                      <EyeOff className="w-4 h-4 text-gray-500 cursor-pointer" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-red-500 text-sm mt-2">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#1E2C8C] text-white py-3 rounded-full font-medium mt-4 disabled:opacity-50"
              >
                {isLoading ? "Registering..." : "Register"}
              </button>
            </form>
          </div>

          <div className="relative w-full h-[540px] rounded-[28px] overflow-hidden">
            <Image
              src="/book-image.png"
              alt="Brook skincare"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-black/20" />
            <div className="absolute bottom-8 left-6 text-white">
              <h2 className="text-4xl font-bold">Lorem Ipsum is simply</h2>
              <p className="text-2xl mt-2">Lorem Ipsum is simply</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}