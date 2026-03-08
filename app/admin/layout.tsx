"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { api } from "@/lib/api";
import {
  LayoutDashboard,
  Users,
  CreditCard,
  ArrowLeftRight,
  Settings,
  Mail,
  LogOut,
  Menu,
  X,
  ShieldCheck,
} from "lucide-react";

const NAV_LINKS = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/accounts", label: "Accounts", icon: CreditCard },
  { href: "/admin/transactions", label: "Transactions", icon: ArrowLeftRight },
  { href: "/admin/settings", label: "Settings", icon: Settings },
  { href: "/admin/mail", label: "Mail", icon: Mail },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [allowed, setAllowed] = useState<boolean | null>(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      // No token at all — redirect without showing the spinner
      router.replace("/admin/login");
      return;
    }
    api
      .get("/api/me")
      .then((res) => {
        if (res.data.role !== "admin") {
          setAllowed(false);   // correctly deny non-admins
          router.replace("/");
        } else {
          setAllowed(true);
        }
      })
      .catch(() => {
        localStorage.removeItem("token");
        router.replace("/admin/login");
      });
  }, [router]);

  function handleLogout() {
    localStorage.removeItem("token");
    router.push("/admin/login");
  }

  if (allowed === null) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0F172A]">
        <div className="flex flex-col items-center gap-4">
          <svg className="animate-spin h-8 w-8 text-blue-400" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
          </svg>
          <p className="text-slate-400 text-sm">Verifying access…</p>
        </div>
      </div>
    );
  }
  if (allowed === false) return null;

  function isActive(href: string, exact?: boolean) {
    if (exact) return pathname === href;
    return pathname?.startsWith(href);
  }

  return (
    <div className="min-h-screen bg-[#080E1A] text-slate-300 font-sans flex">
      {/* Sidebar overlay on mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/60 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 z-40 flex flex-col bg-[#0F172A] border-r border-slate-800 transition-transform duration-300
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 md:static md:flex`}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-6 h-20 border-b border-slate-800 shrink-0">
          <Image src="/logo.png" alt="logo" width={36} height={36} />
          <div>
            <p className="text-white font-bold text-sm leading-tight">St. Georges</p>
            <p className="text-slate-500 text-xs">Trust Bank</p>
          </div>
        </div>

        {/* Admin badge */}
        <div className="px-6 pt-5 pb-3">
          <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-xl px-3 py-2">
            <ShieldCheck size={14} className="text-red-400 shrink-0" />
            <span className="text-xs font-semibold text-red-400">Admin Panel</span>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
          {NAV_LINKS.map(({ href, label, icon: Icon, exact }) => {
            const active = isActive(href, exact);
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all
                  ${active
                    ? "bg-blue-600/20 text-blue-400 border border-blue-500/20"
                    : "text-slate-400 hover:text-white hover:bg-slate-800/60"
                  }`}
              >
                <Icon size={18} />
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Bottom actions */}
        <div className="px-3 py-4 border-t border-slate-800 space-y-1">
          <Link
            href="/"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-500 hover:text-white hover:bg-slate-800/60 transition-all"
          >
            <LogOut size={18} />
            Exit to site
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-red-500 hover:text-red-400 hover:bg-red-500/10 transition-all"
          >
            <LogOut size={18} />
            Sign out
          </button>
        </div>
      </aside>

      {/* Main area */}
      <div className="flex-1 flex flex-col min-h-screen min-w-0">
        {/* Top bar */}
        <header className="h-16 flex items-center justify-between px-6 border-b border-slate-800 bg-[#0F172A]/70 backdrop-blur-md shrink-0">
          <button
            className="md:hidden text-slate-400 hover:text-white transition-colors"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu size={22} />
          </button>
          <div className="hidden md:block">
            <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-widest">
              {NAV_LINKS.find((l) => isActive(l.href, l.exact))?.label ?? "Admin"}
            </h2>
          </div>
          <div className="flex items-center gap-3 ml-auto">
            <div className="w-8 h-8 rounded-full bg-blue-600/20 border border-blue-500/30 flex items-center justify-center">
              <ShieldCheck size={14} className="text-blue-400" />
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6 md:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
