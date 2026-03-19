'use client';

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { api } from "@/lib/api";
import type { LoanRequestReceiptData } from "@/src/receipts/loanRequestReceipt";
import { downloadLoanRequestPdf } from "@/src/receipts/loanRequestReceipt";

type Account = {
  _id: string;
  accountNumber: string;
  accountType: string;
  accountBalance: number;
  currency: string;
};

type User = {
  _id: string;
  firstName?: string;
  lastName?: string;
  accounts: Account[];
};

export default function LoansPage() {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [selectedAccountId, setSelectedAccountId] = useState<string>("");

  const [amount, setAmount] = useState<number>(0);
  const [interestRate, setInterestRate] = useState<number>(0);
  const [termMonths, setTermMonths] = useState<number>(12);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selectedAccount = useMemo(
    () => accounts.find((a) => a._id === selectedAccountId) ?? null,
    [accounts, selectedAccountId]
  );

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    api
      .get("/api/me")
      .then((res) => {
        setUser(res.data);
        setAccounts(res.data.accounts ?? []);
        if (res.data.accounts?.[0]?._id) setSelectedAccountId(res.data.accounts[0]._id);
      })
      .catch(() => {
        localStorage.removeItem("token");
        router.push("/login");
      });
  }, [router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!selectedAccount) {
      setError("Select an account.");
      return;
    }
    if (amount <= 0) {
      setError("Enter a valid amount.");
      return;
    }
    if (interestRate < 0) {
      setError("Interest rate must be 0 or greater.");
      return;
    }
    if (termMonths < 1) {
      setError("Term must be at least 1 month.");
      return;
    }

    setLoading(true);
    try {
      const res = await api.post("/api/loans", {
        accountId: selectedAccount._id,
        amount,
        interestRate,
        termMonths,
        currency: selectedAccount.currency ?? "USD",
      });

      const loan = res.data;
      const pdfData: LoanRequestReceiptData = {
        requestId: loan._id,
        createdAt: loan.createdAt ?? new Date().toISOString(),
        status: loan.status,
        accountNumber: selectedAccount.accountNumber,
        accountType: selectedAccount.accountType,
        amount: loan.amount ?? amount,
        currency: loan.currency ?? selectedAccount.currency ?? "USD",
        interestRate: loan.interestRate ?? interestRate,
        termMonths: loan.termMonths ?? termMonths,
        dueDate: loan.dueDate,
      };

      await downloadLoanRequestPdf(pdfData);
      window.alert("Thanks! We will be connected with you shortly.");

      setAmount(0);
      setInterestRate(0);
      setTermMonths(12);
    } catch (err: any) {
      setError(err?.response?.data?.error ?? "Loan request failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#0b0e14] text-white font-sans max-w-2xl mx-auto p-4 md:p-6">
      <div className="flex items-center gap-3 mb-6">
        <button
          type="button"
          onClick={() => router.back()}
          className="bg-[#1a1d24] p-2 rounded-xl text-gray-400"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-xl font-bold">Apply for a Loan</h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-[#1a1d24] rounded-2xl border border-slate-800 p-5">
        {error ? <p className="mb-4 text-red-400 text-sm">{error}</p> : null}

        <div className="space-y-4">
          <div>
            <label className="text-sm text-slate-300">Account</label>
            <select
              value={selectedAccountId}
              onChange={(e) => setSelectedAccountId(e.target.value)}
              className="mt-2 w-full bg-[#0f172a] border border-slate-700 rounded-xl p-2"
            >
              {accounts.map((a) => (
                <option key={a._id} value={a._id}>
                  {a.accountType} • {a.accountNumber}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm text-slate-300">Amount</label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="mt-2 w-full bg-[#0f172a] border border-slate-700 rounded-xl p-2"
            />
          </div>

          <div>
            <label className="text-sm text-slate-300">Interest rate (%)</label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={interestRate}
              onChange={(e) => setInterestRate(Number(e.target.value))}
              className="mt-2 w-full bg-[#0f172a] border border-slate-700 rounded-xl p-2"
            />
          </div>

          <div>
            <label className="text-sm text-slate-300">Term (months)</label>
            <input
              type="number"
              min="1"
              step="1"
              value={termMonths}
              onChange={(e) => setTermMonths(Number(e.target.value))}
              className="mt-2 w-full bg-[#0f172a] border border-slate-700 rounded-xl p-2"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-6 w-full py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 font-semibold text-sm"
        >
          {loading ? "Submitting..." : "Submit request"}
        </button>
      </form>
    </div>
  );
}

