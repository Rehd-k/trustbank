"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";

type Tx = { _id: string; fromAccount: string; toAccount: string; amount: number; currency: string; type: string; status: string; date: string };

export default function AdminTransactionsPage() {
  const [list, setList] = useState<Tx[]>([]);
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ fromAccount: "", toAccount: "", amount: "", currency: "USD", updateBalances: true });
  const [message, setMessage] = useState("");

  function load() {
    api.get("/api/admin/transactions?limit=50").then((res) => setList(Array.isArray(res.data) ? res.data : [])).catch(() => {});
  }

  useEffect(() => {
    load();
  }, []);

  function create(e: React.FormEvent) {
    e.preventDefault();
    setMessage("");
    api
      .post("/api/admin/transactions", {
        fromAccount: form.fromAccount,
        toAccount: form.toAccount,
        amount: parseFloat(form.amount),
        currency: form.currency,
        updateBalances: form.updateBalances,
      })
      .then(() => {
        setMessage("Created");
        setShowCreate(false);
        load();
      })
      .catch((err) => setMessage("Error: " + (err.response?.data?.error ?? "Failed")));
  }

  return (
    <div>
      <h1 className="mb-4 text-2xl font-semibold text-zinc-900 dark:text-zinc-100">Transactions</h1>
      {message && <p className="mb-2 rounded bg-green-100 p-2 text-green-800 dark:bg-green-900/30">{message}</p>}
      <button onClick={() => setShowCreate(!showCreate)} className="mb-4 rounded bg-zinc-900 px-4 py-2 text-white dark:bg-zinc-100 dark:text-zinc-900">
        {showCreate ? "Cancel" : "Create transaction"}
      </button>
      {showCreate && (
        <form onSubmit={create} className="mb-6 flex flex-col gap-2 rounded border border-zinc-200 p-4 dark:border-zinc-700">
          <input required placeholder="From account number" value={form.fromAccount} onChange={(e) => setForm((f) => ({ ...f, fromAccount: e.target.value }))} className="rounded border px-3 py-2 dark:bg-zinc-800" />
          <input required placeholder="To account number" value={form.toAccount} onChange={(e) => setForm((f) => ({ ...f, toAccount: e.target.value }))} className="rounded border px-3 py-2 dark:bg-zinc-800" />
          <input required type="number" step="0.01" placeholder="Amount" value={form.amount} onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))} className="rounded border px-3 py-2 dark:bg-zinc-800" />
          <input placeholder="Currency" value={form.currency} onChange={(e) => setForm((f) => ({ ...f, currency: e.target.value }))} className="rounded border px-3 py-2 dark:bg-zinc-800" />
          <label><input type="checkbox" checked={form.updateBalances} onChange={(e) => setForm((f) => ({ ...f, updateBalances: e.target.checked }))} /> Update balances</label>
          <button type="submit" className="rounded bg-zinc-800 py-2 text-white">Create</button>
        </form>
      )}
      <div className="overflow-x-auto rounded-xl border border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-800">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-zinc-200 dark:border-zinc-700">
              <th className="p-3">From</th>
              <th className="p-3">To</th>
              <th className="p-3">Amount</th>
              <th className="p-3">Type</th>
              <th className="p-3">Status</th>
              <th className="p-3">Date</th>
            </tr>
          </thead>
          <tbody>
            {list.map((tx) => (
              <tr key={tx._id} className="border-b border-zinc-100 dark:border-zinc-700">
                <td className="p-3">{tx.fromAccount}</td>
                <td className="p-3">{tx.toAccount}</td>
                <td className="p-3">{tx.currency} {tx.amount}</td>
                <td className="p-3">{tx.type}</td>
                <td className="p-3">{tx.status}</td>
                <td className="p-3">{new Date(tx.date).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
