"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";

export default function AdminDashboard() {
  const [stats, setStats] = useState<{ users?: number; accounts?: number; transactions?: number }>({});

  useEffect(() => {
    Promise.all([
      api.get("/api/admin/users?limit=1"),
      api.get("/api/admin/accounts"),
      api.get("/api/admin/transactions?limit=1"),
    ])
      .then(([u, a, t]) => {
        setStats({
          users: u.data.total ?? 0,
          accounts: Array.isArray(a.data) ? a.data.length : 0,
          transactions: Array.isArray(t.data) ? t.data.length : 0,
        });
      })
      .catch(() => {});
  }, []);

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold">Admin dashboard</h1>
      <div className="grid gap-4 sm:grid-cols-3">
        <Link href="/admin/users" className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-700 dark:bg-zinc-800">
          <p className="text-3xl font-bold">{stats.users ?? "—"}</p>
          <p className="text-zinc-600 dark:text-zinc-400">Users</p>
        </Link>
        <Link href="/admin/accounts" className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-700 dark:bg-zinc-800">
          <p className="text-3xl font-bold">{stats.accounts ?? "—"}</p>
          <p className="text-zinc-600 dark:text-zinc-400">Accounts</p>
        </Link>
        <Link href="/admin/transactions" className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-700 dark:bg-zinc-800">
          <p className="text-3xl font-bold">{stats.transactions ?? "—"}</p>
          <p className="text-zinc-600 dark:text-zinc-400">Transactions</p>
        </Link>
      </div>
      <div className="mt-8 flex flex-wrap gap-4">
        <Link href="/admin/users" className="rounded-lg bg-zinc-900 px-4 py-2 text-white dark:bg-zinc-100 dark:text-zinc-900">Manage users</Link>
        <Link href="/admin/accounts" className="rounded-lg border border-zinc-300 px-4 py-2 dark:border-zinc-600">Manage accounts</Link>
        <Link href="/admin/transactions" className="rounded-lg border border-zinc-300 px-4 py-2 dark:border-zinc-600">Manage transactions</Link>
        <Link href="/admin/settings" className="rounded-lg border border-zinc-300 px-4 py-2 dark:border-zinc-600">Site settings</Link>
        <Link href="/admin/mail" className="rounded-lg border border-zinc-300 px-4 py-2 dark:border-zinc-600">Send mail</Link>
      </div>
    </div>
  );
}
