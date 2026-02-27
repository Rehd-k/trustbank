"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import { api } from "@/lib/api";

export default function TransferPage() {
  const [fromAccountNumber, setFromAccountNumber] = useState("");
  const [toAccountNumber, setToAccountNumber] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess(false);
    if (!localStorage.getItem("token")) {
      router.push("/login");
      return;
    }
    setLoading(true);
    try {
      await api.post("/api/transfer", {
        fromAccountNumber,
        toAccountNumber,
        amount: parseFloat(amount),
        type: "local",
      });
      setSuccess(true);
      setFromAccountNumber("");
      setToAccountNumber("");
      setAmount("");
    } catch (err) {
      const msg = axios.isAxiosError(err) && err.response?.data?.error ? err.response.data.error : "Transfer failed";
      setError(typeof msg === "string" ? msg : "Failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 p-4 dark:bg-zinc-950">
      <div className="w-full max-w-sm rounded-xl border border-zinc-200 bg-white p-6 shadow dark:border-zinc-800 dark:bg-zinc-900">
        <h1 className="mb-4 text-xl font-semibold text-zinc-900 dark:text-zinc-100">
          Local transfer
        </h1>
        {error && (
          <p className="mb-3 rounded bg-red-100 px-3 py-2 text-sm text-red-800 dark:bg-red-900/30 dark:text-red-300">
            {error}
          </p>
        )}
        {success && (
          <p className="mb-3 rounded bg-green-100 px-3 py-2 text-sm text-green-800 dark:bg-green-900/30 dark:text-green-300">
            Transfer completed.
          </p>
        )}
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            placeholder="From account number"
            value={fromAccountNumber}
            onChange={(e) => setFromAccountNumber(e.target.value)}
            required
            className="rounded border border-zinc-300 px-3 py-2 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100"
          />
          <input
            placeholder="To account number"
            value={toAccountNumber}
            onChange={(e) => setToAccountNumber(e.target.value)}
            required
            className="rounded border border-zinc-300 px-3 py-2 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100"
          />
          <input
            type="number"
            step="0.01"
            min="0"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
            className="rounded border border-zinc-300 px-3 py-2 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100"
          />
          <button
            type="submit"
            disabled={loading}
            className="rounded bg-zinc-900 py-2 text-white disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900"
          >
            {loading ? "Processing…" : "Transfer"}
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-zinc-500">
          <Link href="/dashboard" className="hover:underline">Back to dashboard</Link>
        </p>
      </div>
    </div>
  );
}
