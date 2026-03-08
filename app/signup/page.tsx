"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import axios from "axios";
import { ArrowRight, Eye, EyeOff, ShieldCheck, User, Mail, Lock, MapPin } from "lucide-react";

export default function SignupPage() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setMessage("");
    const form = e.currentTarget;
    const fd = new FormData(form);
    const body = {
      firstname: fd.get("firstname"),
      lastname: fd.get("lastname"),
      email: fd.get("email"),
      password: fd.get("password"),
      address: fd.get("address") || undefined,
      currency: "USD",
    };
    setLoading(true);
    try {
      await axios.post("/api/auth/signup", body);
      setMessage("Account created! Check your email to verify.");
      form.reset();
    } catch (err) {
      const msg =
        axios.isAxiosError(err) && err.response?.data?.error
          ? err.response.data.error
          : "Signup failed";
      setError(typeof msg === "string" ? msg : "Failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#0F172A] text-slate-300 font-sans flex flex-col">
      {/* Background glow */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-blue-600/15 blur-[120px] rounded-full pointer-events-none" />
      <div className="fixed bottom-0 right-0 w-[400px] h-[400px] bg-cyan-600/10 blur-[100px] rounded-full pointer-events-none" />

      {/* Navbar */}
      <nav className="w-full z-50 bg-[#0F172A]/80 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/logo.png" alt="logo" width={40} height={40} />
            <span className="text-white font-bold text-lg tracking-tight">
              St. Georges Trust Bank
            </span>
          </Link>
          <div className="flex items-center gap-4 text-sm">
            <span className="text-slate-500">Already have an account?</span>
            <Link
              href="/login"
              className="bg-slate-800 hover:bg-slate-700 text-white px-5 py-2 rounded-full font-semibold border border-slate-700 transition-colors"
            >
              Log in
            </Link>
          </div>
        </div>
      </nav>

      {/* Main content */}
      <div className="flex flex-1 items-center justify-center px-4 py-16 relative z-10">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold px-4 py-2 rounded-full mb-6">
              <ShieldCheck size={14} />
              FDIC Insured · 256-bit Encryption
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-3">
              Open your free account
            </h1>
            <p className="text-slate-400">
              Join thousands experiencing the future of banking.
            </p>
          </div>

          {/* Card */}
          <div className="bg-slate-800/40 border border-slate-700/60 rounded-3xl p-8 backdrop-blur-sm shadow-2xl">
            {/* Alerts */}
            {error && (
              <div className="mb-6 flex items-start gap-3 bg-red-500/10 border border-red-500/20 rounded-2xl px-4 py-3">
                <div className="w-2 h-2 rounded-full bg-red-400 mt-1.5 shrink-0" />
                <p className="text-sm text-red-300">{error}</p>
              </div>
            )}
            {message && (
              <div className="mb-6 flex items-start gap-3 bg-green-500/10 border border-green-500/20 rounded-2xl px-4 py-3">
                <div className="w-2 h-2 rounded-full bg-green-400 mt-1.5 shrink-0" />
                <p className="text-sm text-green-300">{message}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {/* Name row */}
              <div className="grid grid-cols-2 gap-3">
                <div className="relative">
                  <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    name="firstname"
                    placeholder="First name"
                    required
                    className="w-full bg-slate-900/60 border border-slate-700 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all"
                  />
                </div>
                <div className="relative">
                  <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    name="lastname"
                    placeholder="Last name"
                    required
                    className="w-full bg-slate-900/60 border border-slate-700 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all"
                  />
                </div>
              </div>

              {/* Email */}
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  name="email"
                  type="email"
                  placeholder="Email address"
                  required
                  className="w-full bg-slate-900/60 border border-slate-700 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all"
                />
              </div>

              {/* Password */}
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Password (min 6 characters)"
                  minLength={6}
                  required
                  className="w-full bg-slate-900/60 border border-slate-700 rounded-xl pl-10 pr-12 py-3 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

              {/* Address */}
              <div className="relative">
                <MapPin size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  name="address"
                  placeholder="Address (optional)"
                  className="w-full bg-slate-900/60 border border-slate-700 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all"
                />
              </div>

              {/* Terms note */}
              <p className="text-xs text-slate-500 text-center px-2">
                By creating an account, you agree to our{" "}
                <a href="#" className="text-blue-400 hover:underline">Terms of Service</a>{" "}
                and{" "}
                <a href="#" className="text-blue-400 hover:underline">Privacy Policy</a>.
              </p>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white py-3.5 rounded-full font-bold text-sm transition-all flex items-center justify-center gap-2 group mt-1"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    Creating your account…
                  </>
                ) : (
                  <>
                    Create Free Account
                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Footer links */}
          <p className="mt-6 text-center text-sm text-slate-500">
            Already have an account?{" "}
            <Link href="/login" className="text-blue-400 hover:text-blue-300 font-medium transition-colors">
              Log in
            </Link>
            {" · "}
            <Link href="/" className="hover:text-slate-300 transition-colors">
              Back to Home
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
