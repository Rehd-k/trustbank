"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";

type Account = { _id: string; accountNumber: string; accountType: string; accountBalance: number; currency: string; userId?: { email?: string } };
type User = { _id: string; email: string };

export default function AdminAccountsPage() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ userId: "", accountType: "savings" as const, currency: "USD", initialBalance: "0" });
  const [message, setMessage] = useState("");

  useEffect(() => {
    api.get("/api/admin/accounts").then((res) => setAccounts(Array.isArray(res.data) ? res.data : [])).catch(() => {});
    api.get("/api/admin/users?limit=500").then((res) => setUsers(res.data.users ?? [])).catch(() => {});
  }, []);

  function create(e: React.FormEvent) {
    e.preventDefault();
    setMessage("");
    api
      .post("/api/admin/accounts", {
        userId: form.userId,
        accountType: form.accountType,
        currency: form.currency,
        initialBalance: parseFloat(form.initialBalance) || 0,
      })
      .then((res) => {
        setMessage("Account created");
        setShowCreate(false);
        setAccounts((a) => [res.data, ...a]);
      })
      .catch((err) => setMessage("Error: " + (err.response?.data?.error ?? "Failed")));
  }

  return (
    <div>
      <h1 className="mb-4 text-2xl font-semibold text-zinc-900 dark:text-zinc-100">Accounts</h1>
      {message && <p className="mb-2 rounded bg-green-100 p-2 text-green-800 dark:bg-green-900/30">{message}</p>}
      <button onClick={() => setShowCreate(!showCreate)} className="mb-4 rounded bg-zinc-900 px-4 py-2 text-white dark:bg-zinc-100 dark:text-zinc-900">
        {showCreate ? "Cancel" : "Create account"}
      </button>
      {showCreate && (
        <form onSubmit={create} className="mb-6 flex flex-col gap-2 rounded border border-zinc-200 p-4 dark:border-zinc-700">
          <label>User</label>
          <select required value={form.userId} onChange={(e) => setForm((f) => ({ ...f, userId: e.target.value }))} className="rounded border px-3 py-2 dark:bg-zinc-800">
            <option value="">Select user</option>
            {users.map((u) => (
              <option key={u._id} value={u._id}>{u.email}</option>
            ))}
          </select>
          <label>Account type</label>
          <select value={form.accountType} onChange={(e) => setForm((f) => ({ ...f, accountType: e.target.value as "savings" }))} className="rounded border px-3 py-2 dark:bg-zinc-800">
            <option value="savings">Savings</option>
            <option value="current">Current</option>
            <option value="fixed">Fixed</option>
            <option value="domiciliary">Domiciliary</option>
          </select>
          <input placeholder="Currency" value={form.currency} onChange={(e) => setForm((f) => ({ ...f, currency: e.target.value }))} className="rounded border px-3 py-2 dark:bg-zinc-800" />
          <input type="number" step="0.01" min="0" placeholder="Initial balance" value={form.initialBalance} onChange={(e) => setForm((f) => ({ ...f, initialBalance: e.target.value }))} className="rounded border px-3 py-2 dark:bg-zinc-800" />
          <button type="submit" className="rounded bg-zinc-800 py-2 text-white">Create</button>
        </form>
      )}
      <div className="overflow-x-auto rounded-xl border border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-800">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-zinc-200 dark:border-zinc-700">
              <th className="p-3">Account number</th>
              <th className="p-3">Type</th>
              <th className="p-3">Balance</th>
              <th className="p-3">Currency</th>
              <th className="p-3">User</th>
            </tr>
          </thead>
          <tbody>
            {accounts.map((acc) => (
              <tr key={acc._id} className="border-b border-zinc-100 dark:border-zinc-700">
                <td className="p-3">{acc.accountNumber}</td>
                <td className="p-3">{acc.accountType}</td>
                <td className="p-3">{acc.accountBalance.toFixed(2)}</td>
                <td className="p-3">{acc.currency}</td>
                <td className="p-3">{typeof acc.userId === "object" && acc.userId ? (acc.userId as { email?: string }).email : acc.userId ?? "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
