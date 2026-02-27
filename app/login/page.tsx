"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";

export default function LoginPage() {
  const [step, setStep] = useState<"email" | "otp">("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleRequestOtp(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await axios.post("/api/auth/request-otp", { email, purpose: "login" });
      setStep("otp");
    } catch (err) {
      const msg = axios.isAxiosError(err) && err.response?.data?.error ? err.response.data.error : "Failed to send OTP";
      setError(typeof msg === "string" ? msg : "Failed");
    } finally {
      setLoading(false);
    }
  }

  async function handleVerifyOtp(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await axios.post("/api/auth/verify-otp", { email, code: otp, purpose: "login" });
      const data = res.data;
      if (data.token) {
        typeof window !== "undefined" && localStorage.setItem("token", data.token);
        router.push("/dashboard");
      }
    } catch (err) {
      const msg = axios.isAxiosError(err) && err.response?.data?.error ? err.response.data.error : "Invalid OTP";
      setError(typeof msg === "string" ? msg : "Failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 p-4 dark:bg-zinc-950">
      <div className="w-full max-w-sm rounded-xl border border-zinc-200 bg-white p-6 shadow dark:border-zinc-800 dark:bg-zinc-900">
        <h1 className="mb-4 text-xl font-semibold text-zinc-900 dark:text-zinc-100">
          Login
        </h1>
        {error && (
          <p className="mb-3 rounded bg-red-100 px-3 py-2 text-sm text-red-800 dark:bg-red-900/30 dark:text-red-300">
            {error}
          </p>
        )}
        {step === "email" ? (
          <form onSubmit={handleRequestOtp} className="flex flex-col gap-3">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="rounded border border-zinc-300 px-3 py-2 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100"
            />
            <button
              type="submit"
              disabled={loading}
              className="rounded bg-zinc-900 py-2 text-white disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900"
            >
              {loading ? "Sending…" : "Send OTP"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="flex flex-col gap-3">
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Code sent to {email}
            </p>
            <input
              type="text"
              placeholder="6-digit code"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
              maxLength={6}
              className="rounded border border-zinc-300 px-3 py-2 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100"
            />
            <button
              type="submit"
              disabled={loading || otp.length !== 6}
              className="rounded bg-zinc-900 py-2 text-white disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900"
            >
              {loading ? "Verifying…" : "Verify & Login"}
            </button>
            <button
              type="button"
              onClick={() => setStep("email")}
              className="text-sm text-zinc-500 hover:underline"
            >
              Use another email
            </button>
          </form>
        )}
        <p className="mt-4 text-center text-sm text-zinc-500">
          <Link href="/signup" className="hover:underline">Sign up</Link>
          {" · "}
          <Link href="/" className="hover:underline">Home</Link>
        </p>
      </div>
    </div>
  );
}
