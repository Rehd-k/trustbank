"use client";

import { useState } from "react";
import Link from "next/link";
import axios from "axios";

export default function SignupPage() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

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
     
      const res = await axios.post("/api/auth/signup", body);
      setMessage("Account created. Check your email to verify.");
      form.reset();
    } catch (err) {
      const msg = axios.isAxiosError(err) && err.response?.data?.error ? err.response.data.error : "Signup failed";
      setError(typeof msg === "string" ? msg : "Failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 p-4 dark:bg-zinc-950">
      <div className="w-full max-w-sm rounded-xl border border-zinc-200 bg-white p-6 shadow dark:border-zinc-800 dark:bg-zinc-900">
        <h1 className="mb-4 text-xl font-semibold text-zinc-900 dark:text-zinc-100">
          Sign up
        </h1>
        {error && (
          <p className="mb-3 rounded bg-red-100 px-3 py-2 text-sm text-red-800 dark:bg-red-900/30 dark:text-red-300">
            {error}
          </p>
        )}
        {message && (
          <p className="mb-3 rounded bg-green-100 px-3 py-2 text-sm text-green-800 dark:bg-green-900/30 dark:text-green-300">
            {message}
          </p>
        )}
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            name="firstname"
            placeholder="First name"
            required
            className="rounded border border-zinc-300 px-3 py-2 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100"
          />
          <input
            name="lastname"
            placeholder="Last name"
            required
            className="rounded border border-zinc-300 px-3 py-2 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100"
          />
          <input
            name="email"
            type="email"
            placeholder="Email"
            required
            className="rounded border border-zinc-300 px-3 py-2 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100"
          />
          <input
            name="password"
            type="password"
            placeholder="Password (min 6)"
            minLength={6}
            required
            className="rounded border border-zinc-300 px-3 py-2 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100"
          />
          <input
            name="address"
            placeholder="Address (optional)"
            className="rounded border border-zinc-300 px-3 py-2 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100"
          />
          <button
            type="submit"
            disabled={loading}
            className="rounded bg-zinc-900 py-2 text-white disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900"
          >
            {loading ? "Creating…" : "Create account"}
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-zinc-500">
          <Link href="/login" className="hover:underline">Login</Link>
          {" · "}
          <Link href="/" className="hover:underline">Home</Link>
        </p>
      </div>
    </div>
  );
}
