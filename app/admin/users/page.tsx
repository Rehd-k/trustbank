"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";

type UserRow = {
  _id: string;
  email: string;
  firstname: string;
  lastname: string;
  role: string;
  isBlocked?: boolean;
  transfersDisabled?: boolean;
  isEmailVerified?: boolean;
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  function load() {
    const params = new URLSearchParams({ page: String(page), limit: "20" });
    if (search) params.set("search", search);
    api.get("/api/admin/users?" + params).then((res) => {
      setUsers(res.data.users ?? []);
      setTotal(res.data.total ?? 0);
    }).catch(() => {});
  }

  useEffect(() => {
    load();
  }, [page, search]);

  return (
    <div>
      <h1 className="mb-4 text-2xl font-semibold text-zinc-900 dark:text-zinc-100">Users</h1>
      <div className="mb-4 flex gap-2">
        <input
          type="text"
          placeholder="Search email or name"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && load()}
          className="rounded border border-zinc-300 px-3 py-2 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100"
        />
        <button onClick={load} className="rounded bg-zinc-900 px-4 py-2 text-white dark:bg-zinc-100 dark:text-zinc-900">Search</button>
        <Link href="/admin/users/new" className="rounded border border-zinc-300 px-4 py-2 dark:border-zinc-600 dark:text-zinc-300">Create user</Link>
      </div>
      <div className="overflow-x-auto rounded-xl border border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-800">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-zinc-200 dark:border-zinc-700">
              <th className="p-3">Email</th>
              <th className="p-3">Name</th>
              <th className="p-3">Role</th>
              <th className="p-3">Verified</th>
              <th className="p-3">Blocked</th>
              <th className="p-3">Transfers</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id} className="border-b border-zinc-100 dark:border-zinc-700">
                <td className="p-3">{u.email}</td>
                <td className="p-3">{u.firstname} {u.lastname}</td>
                <td className="p-3">{u.role}</td>
                <td className="p-3">{u.isEmailVerified ? "Yes" : "No"}</td>
                <td className="p-3">{u.isBlocked ? "Yes" : "No"}</td>
                <td className="p-3">{u.transfersDisabled ? "Disabled" : "Enabled"}</td>
                <td className="p-3">
                  <Link href={"/admin/users/" + u._id} className="text-blue-600 hover:underline dark:text-blue-400">Edit</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-2 text-zinc-600 dark:text-zinc-400">Total: {total}</p>
    </div>
  );
}
