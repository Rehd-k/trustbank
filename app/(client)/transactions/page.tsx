'use client'
import { useState, useEffect } from 'react';
import AccountCarousel from './AccountCarousel';
import TransactionList from './transactionList';
import { api } from '@/lib/api';

const HistoryPage = () => {
    // State
    const [selectedAccount, setSelectedAccount] = useState(null); // null = All
    const [transactions, setTransactions] = useState<any[]>([]);
    const [accounts, setAccounts] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [skip, setSkip] = useState(0);
    const [hasMore, setHasMore] = useState(true);



    // Helper array of just IDs for checking ownership
    const myAccountNumbers = accounts.map(a => a.accountNumber);

    const LIMIT = 10;

    const fetchTransactions = async (reset = false) => {
        setLoading(true);
        try {
            const currentSkip = reset ? 0 : skip;

            // Build Query Params
            const params = new URLSearchParams({
                limit: LIMIT.toString(),       // Convert number to string
                skip: currentSkip.toString(),  // Convert number to string
            });
            if (selectedAccount) {
                params.append("accountNumber", selectedAccount);
            }

            const res_accounts = await api.get(`/api/accounts`);
            const response = await api.get(`/api/transactions?${params.toString()}`);
            const data = await response.data;

            setAccounts(res_accounts.data);
            if (reset) {
                setTransactions(data);
            } else {
                setTransactions((prev: any) => [...prev, ...data]);
            }

            // Logic to determine if we reached the end
            if (data.length < LIMIT) {
                setHasMore(false);
            } else {
                setHasMore(true);
            }

            // Update skip for next time
            setSkip(currentSkip + LIMIT);

        } catch (error) {
            console.error("Failed to fetch", error);
        } finally {
            setLoading(false);
        }
    };

    // 1. Initial Load & When Account Changes
    useEffect(() => {
        setSkip(0);
        setHasMore(true);
        fetchTransactions(true); // true = reset list
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedAccount]);

    // 2. Load More Handler
    const handleLoadMore = () => {
        if (!loading && hasMore) {
            fetchTransactions(false); // false = append to list
        }
    };

    return (
        <div className="min-h-screen bg-[#0F172A] p-4 text-white font-sans max-w-md mx-auto border-x border-slate-800">

            {/* Top Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold mb-1">Transactions</h1>
                <p className="text-slate-400 text-sm">View your financial activity</p>
            </div>

            {/* Account Selector */}
            <div className="mb-6">
                <AccountCarousel
                    accounts={accounts}
                    selectedAccount={selectedAccount}
                    onSelect={setSelectedAccount}
                />
            </div>

            {/* Transaction Feed */}
            <TransactionList
                transactions={transactions}
                loading={loading}
                hasMore={hasMore}
                onLoadMore={handleLoadMore}
                selectedAccount={selectedAccount}
            />
        </div>
    );
};

export default HistoryPage;