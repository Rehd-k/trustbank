'use client';
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { api } from "@/lib/api";
import {
    LayoutDashboard, ArrowLeftRight, Send, Settings, Wallet, Bell, UserIcon, Menu, X
} from "lucide-react";

type User = { firstname?: string; lastName?: string; firstName?: string; email?: string };

const NAV = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/transactions", label: "Transactions", icon: ArrowLeftRight },
    { href: "/transfer", label: "Transfer", icon: Send },
    { href: "/fund-account", label: "Fund", icon: Wallet },
    { href: "/settings", label: "Settings", icon: Settings },
];

export default function ClientLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [drawerOpen, setDrawerOpen] = useState(false);

    useEffect(() => {
        const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
        if (!token) { router.replace("/login"); return; }
        api.get("/api/me").then(res => setUser(res.data)).catch(() => {
            localStorage.removeItem("token");
            router.replace("/login");
        });
    }, [router]);

    const firstName = user?.firstname || user?.firstName || "";
    const initials = firstName ? firstName.charAt(0).toUpperCase() : "U";

    return (
        <div className="min-h-screen bg-[#0b0e14] text-white font-sans">
            {/* Desktop Sidebar */}
            <aside className="hidden md:flex fixed left-0 top-0 h-full w-64 flex-col bg-[#0F172A] border-r border-slate-800 z-30">
                <div className="flex items-center gap-3 px-6 h-20 border-b border-slate-800">
                    <div className="w-10 h-10 rounded-full bg-blue-600/20 border border-blue-500/30 flex items-center justify-center font-bold text-blue-400">{initials}</div>
                    <div className="min-w-0">
                        <p className="text-white text-sm font-semibold truncate">{firstName || "Welcome"}</p>
                        <p className="text-slate-500 text-xs truncate">{user?.email || ""}</p>
                    </div>
                </div>
                <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
                    {NAV.map(({ href, label, icon: Icon }) => {
                        const active = pathname === href || (href !== "/dashboard" && pathname?.startsWith(href));
                        return (
                            <Link key={href} href={href}
                                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all
                  ${active ? "bg-blue-600/20 text-blue-400 border border-blue-500/20" : "text-slate-400 hover:text-white hover:bg-slate-800/60"}`}>
                                <Icon size={18} />
                                {label}
                            </Link>
                        );
                    })}
                </nav>
                <div className="px-6 py-4 border-t border-slate-800">
                    <p className="text-xs text-slate-600">St. Georges Trust Bank</p>
                </div>
            </aside>

            {/* Mobile drawer overlay */}
            {drawerOpen && (
                <div className="fixed inset-0 z-40 bg-black/60 md:hidden" onClick={() => setDrawerOpen(false)}>
                    <div className="absolute left-0 top-0 h-full w-64 bg-[#0F172A] border-r border-slate-800 flex flex-col" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center justify-between px-5 h-16 border-b border-slate-800">
                            <p className="text-white font-bold text-sm">Menu</p>
                            <button onClick={() => setDrawerOpen(false)} className="text-slate-400 hover:text-white"><X size={20} /></button>
                        </div>
                        <nav className="flex-1 px-3 py-4 space-y-1">
                            {NAV.map(({ href, label, icon: Icon }) => (
                                <Link key={href} href={href} onClick={() => setDrawerOpen(false)}
                                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all
                    ${pathname === href ? "bg-blue-600/20 text-blue-400 border border-blue-500/20" : "text-slate-400 hover:text-white hover:bg-slate-800/60"}`}>
                                    <Icon size={18} />
                                    {label}
                                </Link>
                            ))}
                        </nav>
                    </div>
                </div>
            )}

            {/* Mobile top bar */}
            <header className="md:hidden fixed top-0 left-0 right-0 z-20 h-16 flex items-center justify-between px-4 bg-[#0F172A]/90 backdrop-blur-md border-b border-slate-800">
                <button onClick={() => setDrawerOpen(true)} className="text-slate-400 hover:text-white transition-colors"><Menu size={22} /></button>
                <p className="text-white font-bold text-sm">St. Georges</p>
                <Link href="/settings" className="w-8 h-8 rounded-full bg-blue-600/20 border border-blue-500/30 flex items-center justify-center font-bold text-blue-400 text-sm">{initials}</Link>
            </header>

            {/* Main content */}
            <main className="md:ml-64 pt-16 md:pt-0 min-h-screen">
                {children}
            </main>

            {/* Mobile bottom nav */}
            <nav className="md:hidden fixed bottom-5 left-1/2 -translate-x-1/2 bg-[#0F172A]/95 border border-slate-700/60 backdrop-blur-md w-[92vw] max-w-md rounded-2xl flex justify-around py-3 px-1 shadow-2xl z-20">
                {NAV.slice(0, 5).map(({ href, label, icon: Icon }) => {
                    const active = pathname === href;
                    return (
                        <Link key={href} href={href}
                            className={`flex flex-col items-center gap-0.5 px-3 py-2 rounded-xl transition-all
                ${active ? "bg-blue-600/20 text-blue-400" : "text-slate-500 hover:text-white"}`}>
                            <Icon size={20} />
                            <span className="text-[10px] font-medium">{label}</span>
                        </Link>
                    );
                })}
            </nav>
        </div>
    );
}