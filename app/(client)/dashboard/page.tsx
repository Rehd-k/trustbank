"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronRight } from 'lucide-react'
import Link from "next/link";
import { api } from "@/lib/api";
import FinanacialServiceCard from "@/src/components/financailservice.card";
import EmblaCarousel from "@/src/carosel/EmblaCarousel";
import ClientHead from "./(components)/header";
import { Options } from "./(components)/options";
import AddButton from "./(components)/addButton";
import { AccountHealthCard } from "./(components)/AccountHealthCard";
import { MonthlySummaryCard } from "./(components)/MonthlySummaryCard";
import { RecentActivity } from "./(components)/RecentActivity";
import { Achievements } from "./(components)/Achievements";
import { HelpSection } from "./(components)/HelpSection";
import { SupportBanner } from "./(components)/SupportBanner";

type User = {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  accounts: { _id: string; accountNumber: string; accountType: string; accountBalance: number; currency: string }[];
  cards: { _id: string; type: string; balance: number; lastFourDigits: string }[];
};

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [flipped, setFlipped] = useState(false);


  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token) {
      router.push("/login");
      return;
    }
    api
      .get("/api/me")
      .then((res) => { setUser(res.data) })
      .catch(() => {
        localStorage.removeItem("token");
        router.push("/login");
      })
      .finally(() => setLoading(false));
  }, [router]);


  // Demo backend-driven metrics (replace with real API data)
  const [healthPercent, setHealthPercent] = useState<number>(73);
  const [monthlyTotals, setMonthlyTotals] = useState<{ totalIn: number; totalOut: number; currency?: string }>({
    totalIn: 4520.5,
    totalOut: 1389.25,
    currency: "USD",
  });
  const [history, setHistory] = useState<Array<{ id: string; date: string; desc: string; amount: number }>>([
    { id: "1", date: "2026-02-12", desc: "Salary", amount: 3000 },
    { id: "2", date: "2026-02-14", desc: "Coffee Shop", amount: -4.5 },
    { id: "3", date: "2026-02-18", desc: "Groceries", amount: -86.75 },
    { id: "4", date: "2026-02-21", desc: "Freelance", amount: 800 },
    { id: "5", date: "2026-02-23", desc: "Electricity Bill", amount: -120 },
  ]);

  const slides =
    user?.accounts.map((res, index) => <div key={index} className="relative w-full max-w-104 sm:max-w-lg md:max-w-xl lg:max-w-160 h-52 sm:h-56 rounded-2xl overflow-hidden shadow-2xl mx-auto">

      {/* Base Gradient */}
      <div className="absolute inset-0 bg-linear-to-br from-[#0ea5e9] to-[#1e3a8a]" />

      {/* Top Right Bubble */}
      <div className="absolute -top-5 -right-5 w-40 h-40 rounded-full 
                      bg-linear-to-br from-indigo-950/70 to-white/5 
                      opacity-60 animate-pulse" />

      {/* Bottom Left Bubble */}
      <div className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full 
                      bg-linear-to-tr from-blue-600/70 to-transparent animate-pulse
                      " />

      {/* Content */}
      <div className="relative z-10 p-6 text-white flex flex-col justify-between h-full">

        {/* Top */}
        <div className="flex justify-between">
          <div>
            <p className="text-xs tracking-widest opacity-80">
              CITY PRIME BANK
            </p>
            <p className="text-xs opacity-60">{user.firstName}</p>
          </div>

          <div className="text-right">
            <p className="text-xs opacity-70">{res.accountType.toLocaleUpperCase()} Account</p>
            <p className="text-sm font-semibold">{res.accountNumber}</p>
          </div>
        </div>

        {/* Balance */}
        <div className="text-center">
          <p className="text-xs opacity-70">Available Balance</p>
          <h2 className="text-3xl font-bold tracking-wide">
            {formatCurrency(res.accountBalance)}
          </h2>
        </div>

        {/* Bottom */}
        <div className="flex justify-between items-center">

          <span className="flex items-center gap-2 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs">
            <span className="w-2 h-2 bg-green-400 rounded-full" />
            Active
          </span>

          <p className=" text-[10px] opacity-60">
            Last updated: {new Date(Date.now()).getUTCFullYear()}
          </p>
        </div>


      </div>
    </div>
    );




  function handleLogout() {
    api.post("/api/auth/logout").catch(() => { }).finally(() => {
      localStorage.removeItem("token");
      router.push("/");
    });
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-950">
        <p className="text-zinc-600 dark:text-zinc-400">Loading…</p>
      </div>
    );
  }
  if (!user) return null;

  const monthName = new Date().toLocaleString(undefined, { month: "long" });

  function formatCurrency(value: number) {
    try {
      const code = monthlyTotals.currency || "USD";
      return new Intl.NumberFormat(undefined, { style: "currency", currency: code }).format(value);
    } catch (e) {
      return `${monthlyTotals.currency || "$"}${value.toFixed(2)}`;
    }
  }

  return (
    <div className="relative min-h-screen 
      bg-[linear-gradient(135deg,#0b1f2a_0%,#123a5a_30%,#1f6fa9_50%,#123a5a_70%,#0b1f2a_100%)] 
      text-white overflow-hidden">

      {/* Soft bloom overlays */}
      <div className="absolute inset-0 
        bg-[radial-gradient(circle_at_25%_25%,rgba(255,255,255,0.08),transparent_40%)]" />
      <div className="absolute inset-0 
        bg-[radial-gradient(circle_at_75%_75%,rgba(255,255,255,0.05),transparent_45%)]" />

      <div className="relative z-10 mx-auto w-full max-w-7xl">
        <div className="pb-14 md:pb-16 px-4 sm:px-6 lg:px-8 xl:px-10 bg-linear-to-br from-[#0b1120] via-[#222066] to-[#151342]">
          <ClientHead user={user} />
          <div className="mt-4 md:mt-5">
            <EmblaCarousel slides={slides} />
          </div>
          <div className="mt-5 md:mt-6">
            <Options />
          </div>
        </div>

        <div className="bg-linear-to-br from-[#23386b] via-[#23225a] to-[#151342] px-4 sm:px-6 lg:px-8 xl:px-10 pb-12 md:pb-16">
          <section className="pt-6 md:pt-8">
            <div className="flex justify-between items-center py-4 md:py-5">
              <p className="text-gray-200 text-sm md:text-base font-bold">Quick Transfer</p>
              <Link className="text-gray-200 font-thin text-xs md:text-sm flex items-center" href={""}>
                <p className="">View All</p>
                <ChevronRight className="size-4" />
              </Link>
            </div>

            <AddButton />


            <div className="flex justify-between items-center mt-8 md:mt-10">
              <p className="text-gray-200 text-sm md:text-base font-bold">Your Active Cards</p>
              <Link className="text-gray-200 font-thin text-xs md:text-sm flex items-center" href={""}>
                <p className="">Manage</p>
                <ChevronRight className="size-4" />
              </Link>
            </div>

            <div className="backdrop-blur-md rounded-xl shadow-lg p-3 md:p-5 mt-4 md:mt-5 border border-blue-900/50 max-w-4xl">

              <div className="flex flex-col justify-between">

                {/* Debit Card with Flip Animation */}


                <div className="relative w-full max-w-104 md:max-w-120 h-48 md:h-52 perspective-distant group cursor-pointer select-none"
                  tabIndex={0} // allow keyboard focus for accessibility
                >
                  <div
                    tabIndex={0}
                    role="button"
                    aria-label="Flip card"
                    onClick={() => setFlipped(prev => !prev)}
                    onKeyDown={e => {
                      if (e.key === "Enter" || e.key === " ") setFlipped(prev => !prev);
                    }}
                    className={`
              absolute inset-0 transition-transform duration-700 transform-3d
              ${flipped ? "transform-[rotateY(180deg)]" : ""}
              group-hover:shadow-[0_10px_52px_5px_rgba(11,45,114,0.29)]
              group-hover:saturate-150
            `}
                  >
                    {/* Card Front */}
                    <div className={`
            absolute inset-0 rounded-xl
            flex flex-col justify-between
            bg-linear-to-tr from-(--color-primary) via-(--color-secondary) to-(--color-primary-300)
            p-3 transition-all duration-300
            before:absolute before:inset-0 before:rounded-3xl before:pointer-events-none
            before:bg-[conic-gradient(from_120deg_at_60%_50%,rgba(255,255,255,0.34)_25%,transparent_75%)]
            group-hover:before:opacity-80 group-hover:before:blur-[2px] before:transition-all before:duration-300
            backface-hidden
          `}>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-white font-semibold tracking-wide">
                          <p className="font-bold">City Prime</p>
                          <p className="">Virtual Banking</p>
                        </span>
                        <span className="text-lg text-white/70 font-extrabold">⋆⋆⋆⋆</span>
                      </div>
                      <div className="mt-6">
                        <span className="block text-gray-100  font-mono tracking-widest select-text text-sm">
                          4321&nbsp;****
                          ****&nbsp;1234
                        </span>
                      </div>
                      <div className="flex justify-between items-end mt-0 text-sm">
                        <div>
                          <p className="text-sm text-zinc-200/80 mb-1">Card Holder</p>
                          <p className="font-medium text-white">{user.firstName} {user.lastName}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-zinc-200/80 mb-1">Valid Thru</p>
                          <p className="font-medium text-white">12/29</p>
                        </div>
                      </div>
                    </div>
                    {/* Card Back */}
                    <div className={`
            absolute inset-0 rounded-xl shadow-xl flex flex-col
            bg-linear-to-bl from-(--color-accent-light) via-(--color-secondary) to-(--color-primary) 
            p-7 transform-[rotateY(180deg)] transition-all duration-300
            backface-hidden
          `}>
                      <div className="w-full h-8 bg-zinc-900 rounded-lg mb-3" />
                      <div className="flex justify-between items-center mt-4">
                        <div>
                          <p className="uppercase text-xs text-zinc-900/40 font-bold">Customer Service</p>
                          <p className="text-zinc-900 text-sm">1-800-000-0000</p>
                        </div>
                        <div className="flex flex-col items-end">
                          <p className="uppercase text-xs text-zinc-900/40 font-bold">CVV</p>
                          <div className="w-12 h-6 bg-white flex items-center justify-center rounded mt-1">
                            <span className="text-zinc-900 font-semibold select-text">258</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex-1 flex items-end">
                        <span className="text-xs text-zinc-800/40">Debit Card · Example Bank</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between py-2 px-2">
                  <p className="text-xs text-gray-100">American Express Card</p>
                  <p className="text-xs font-semibold text-gray-200">USD 0.00</p>
                </div>

                <button className="w-full py-3 bg-linear-to-r from-blue-500 to-purple-600 text-white rounded-2xl font-semibold hover:opacity-90 transition-opacity">
                  View All Cards
                </button>
              </div>
            </div>
          </section>

          <section className="pt-8 md:pt-10">
            <div className="flex justify-between items-center py-4 md:py-5">
              <p className="text-gray-200 font-semibold text-xs md:text-sm">Financial Services</p>
              <Link className="text-gray-200 font-thin text-xs md:text-sm flex items-center" href={""}>
                <p className="">View All</p>
                <ChevronRight className="size-4" />
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
              <FinanacialServiceCard />
              <FinanacialServiceCard />
              <FinanacialServiceCard />
              <FinanacialServiceCard />
            </div>
          </section>

          <div className="pt-8 md:pt-10 text-white font-sans flex flex-col gap-4 md:gap-5 max-w-3xl lg:max-w-4xl">
            <AccountHealthCard />
            <MonthlySummaryCard />
            <RecentActivity userId={user._id} />
          </div>

          <section className="pt-8 md:pt-10 max-w-4xl">
            <Achievements />
            <HelpSection />
            <SupportBanner />
          </section>
        </div>
      </div>
    </div>
  );
}
