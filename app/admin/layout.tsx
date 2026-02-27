"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { api } from "@/lib/api";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [allowed, setAllowed] = useState<boolean | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login?redirect=/admin");
      return;
    }
    api
      .get("/api/me")
      .then((res) => {
        if (res.data.role !== "admin") {
          setAllowed(false);
          router.push("/");
        } else {
          setAllowed(true);
        }
      })
      .catch(() => {
        router.push("/login?redirect=/admin");
      });
  }, [router]);

  if (allowed === null) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-100 dark:bg-zinc-900">
        <p className="text-zinc-600">Checking access…</p>
      </div>
    );
  }
  if (allowed === false) return null;

  return (
    <div className="min-h-screen bg-zinc-100 dark:bg-zinc-900">
      <header className="border-b border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-800">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <Link href="/admin" className="font-semibold text-zinc-900 dark:text-zinc-100">
            Admin
          </Link>
          <nav className="flex gap-4 text-sm">
            <Link
              href="/admin"
              className={pathname === "/admin" ? "font-medium text-zinc-900 dark:text-zinc-100" : "text-zinc-600 dark:text-zinc-400"}
            >
              Dashboard
            </Link>
            <Link
              href="/admin/users"
              className={pathname?.startsWith("/admin/users") ? "font-medium text-zinc-900 dark:text-zinc-100" : "text-zinc-600 dark:text-zinc-400"}
            >
              Users
            </Link>
            <Link
              href="/admin/accounts"
              className={pathname === "/admin/accounts" ? "font-medium text-zinc-900 dark:text-zinc-100" : "text-zinc-600 dark:text-zinc-400"}
            >
              Accounts
            </Link>
            <Link
              href="/admin/transactions"
              className={pathname === "/admin/transactions" ? "font-medium text-zinc-900 dark:text-zinc-100" : "text-zinc-600 dark:text-zinc-400"}
            >
              Transactions
            </Link>
            <Link
              href="/admin/settings"
              className={pathname === "/admin/settings" ? "font-medium text-zinc-900 dark:text-zinc-100" : "text-zinc-600 dark:text-zinc-400"}
            >
              Settings
            </Link>
            <Link
              href="/admin/mail"
              className={pathname === "/admin/mail" ? "font-medium text-zinc-900 dark:text-zinc-100" : "text-zinc-600 dark:text-zinc-400"}
            >
              Mail
            </Link>
            <Link href="/" className="text-zinc-500 hover:underline">Exit admin</Link>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-6">{children}</main>
    </div>
  );
}
