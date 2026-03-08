'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Wallet, CheckCircle2, Copy, Check, PiggyBank, Building2, Bitcoin } from 'lucide-react';
import axios from 'axios';

type Settings = {
    btcWallet?: string;
    ethWallet?: string;
    usdtWallet?: string;
    bankName?: string;
    bankAccountNumber?: string;
    bankRoutingNumber?: string;
    bankSwiftCode?: string;
    bankBeneficiary?: string;
};

type Method = { id: string; name: string; color: string; icon: React.ReactNode; key: keyof Settings; label: string };

const FundAccountPage = () => {
    const router = useRouter();
    const [selectedMethod, setSelectedMethod] = useState('btcWallet');
    const [amount, setAmount] = useState('');
    const [settings, setSettings] = useState<Settings>({});
    const [loadingSettings, setLoadingSettings] = useState(true);
    const [copied, setCopied] = useState(false);
    const [done, setDone] = useState(false);

    useEffect(() => {
        axios.get('/api/settings')
            .then(res => setSettings(res.data))
            .catch(() => { })
            .finally(() => setLoadingSettings(false));
    }, []);

    const methods: Method[] = [
        { id: 'btcWallet', name: 'Bitcoin (BTC)', color: 'bg-amber-500', icon: <Bitcoin size={20} className="text-white" />, key: 'btcWallet', label: 'BTC Wallet Address' },
        { id: 'ethWallet', name: 'Ethereum (ETH)', color: 'bg-indigo-500', icon: <Wallet size={20} className="text-white" />, key: 'ethWallet', label: 'ETH Wallet Address' },
        { id: 'usdtWallet', name: 'USDT (TRC-20)', color: 'bg-emerald-500', icon: <Wallet size={20} className="text-white" />, key: 'usdtWallet', label: 'USDT Wallet Address' },
        { id: 'bankTransfer', name: 'Bank Wire Transfer', color: 'bg-blue-500', icon: <Building2 size={20} className="text-white" />, key: 'bankName', label: 'Bank Transfer' },
    ];

    const selected = methods.find(m => m.id === selectedMethod)!;
    const isCrypto = selectedMethod !== 'bankTransfer';
    const cryptoAddress = isCrypto ? (settings[selected.key as keyof Settings] as string) ?? '' : '';

    function copyAddress() {
        if (!cryptoAddress) return;
        navigator.clipboard.writeText(cryptoAddress);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }

    function handleProceed() {
        if (!amount || parseFloat(amount) <= 0) return;
        setDone(true);
    }

    return (
        <div className="min-h-screen bg-[#0b0e14] text-white font-sans pb-10">
            {/* Header */}
            <div className="relative overflow-hidden bg-gradient-to-b from-[#00a3e0] to-[#0b0e14] pt-6 pb-12 px-6 rounded-b-[3rem]">
                <button onClick={() => router.back()} className="bg-white/10 p-2 rounded-xl mb-6 backdrop-blur-md hover:bg-white/20 transition-colors">
                    <ArrowLeft size={20} />
                </button>
                <div className="flex flex-col items-center text-center">
                    <div className="bg-white/20 p-4 rounded-2xl mb-4 backdrop-blur-md shadow-lg">
                        <PiggyBank size={32} className="text-white" />
                    </div>
                    <h1 className="text-2xl font-bold mb-2">Fund Your Account</h1>
                    <p className="text-white/70 text-sm max-w-xs">Choose your preferred deposit method and send funds to the details below.</p>
                </div>
            </div>

            <div className="px-6 -mt-6 space-y-6">
                {done ? (
                    <div className="bg-[#1a1d24] border border-green-500/30 rounded-3xl p-8 text-center space-y-4">
                        <div className="w-16 h-16 mx-auto rounded-full bg-green-500/20 flex items-center justify-center">
                            <CheckCircle2 size={32} className="text-green-400" />
                        </div>
                        <h2 className="text-xl font-bold text-white">Deposit Initiated</h2>
                        <p className="text-slate-400 text-sm">
                            Please send <span className="text-white font-bold">${parseFloat(amount).toLocaleString()}</span> via <span className="text-white font-bold">{selected.name}</span> to the address provided. Your account will be credited once confirmed.
                        </p>
                        <button onClick={() => { setDone(false); setAmount(''); }} className="w-full py-3 bg-slate-700 hover:bg-slate-600 rounded-2xl text-sm font-semibold transition-colors mt-2">
                            Make Another Deposit
                        </button>
                    </div>
                ) : (
                    <>
                        {/* Method Selection */}
                        <section>
                            <h3 className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-4 ml-1">Select Deposit Method</h3>
                            <div className="space-y-3">
                                {methods.map((method) => (
                                    <button
                                        key={method.id}
                                        onClick={() => setSelectedMethod(method.id)}
                                        className={`w-full p-4 rounded-2xl border transition-all flex items-center justify-between
                      ${selectedMethod === method.id ? 'bg-[#1a1d24] border-blue-500 shadow-lg shadow-blue-500/10' : 'bg-[#1a1d24] border-gray-800 hover:border-gray-600'}`}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className={`${method.color} p-2.5 rounded-xl shadow-inner`}>{method.icon}</div>
                                            <span className="font-bold text-sm">{method.name}</span>
                                        </div>
                                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedMethod === method.id ? 'border-blue-500 bg-blue-500' : 'border-gray-700'}`}>
                                            {selectedMethod === method.id && <CheckCircle2 size={12} className="text-white" />}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </section>

                        {/* Deposit Address / Bank Info */}
                        <section className="bg-[#1a1d24] p-6 rounded-3xl border border-gray-800">
                            <h3 className="text-gray-400 text-xs font-bold mb-4 uppercase tracking-wider">
                                {isCrypto ? `${selected.name} Deposit Address` : 'Bank Wire Details'}
                            </h3>

                            {loadingSettings ? (
                                <div className="space-y-3">
                                    {[...Array(3)].map((_, i) => <div key={i} className="h-10 bg-slate-700/40 rounded-xl animate-pulse" />)}
                                </div>
                            ) : isCrypto ? (
                                <div className="space-y-4">
                                    {cryptoAddress ? (
                                        <>
                                            <div className="bg-[#0b0e14] rounded-2xl p-4 border border-gray-800">
                                                <p className="text-xs text-gray-500 mb-2 uppercase tracking-wider">Wallet Address</p>
                                                <p className="text-white font-mono text-sm break-all leading-relaxed">{cryptoAddress}</p>
                                            </div>
                                            <button
                                                onClick={copyAddress}
                                                className={`w-full py-3 rounded-2xl flex items-center justify-center gap-2 font-semibold text-sm transition-all
                          ${copied ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-blue-600/20 text-blue-400 border border-blue-500/20 hover:bg-blue-600/30'}`}
                                            >
                                                {copied ? <><Check size={16} /> Copied!</> : <><Copy size={16} /> Copy Address</>}
                                            </button>
                                        </>
                                    ) : (
                                        <p className="text-slate-500 text-sm text-center py-4">Wallet address not configured yet. Please contact support.</p>
                                    )}
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {[
                                        { label: 'Bank Name', value: settings.bankName },
                                        { label: 'Beneficiary', value: settings.bankBeneficiary },
                                        { label: 'Account Number', value: settings.bankAccountNumber },
                                        { label: 'Routing Number (ABA)', value: settings.bankRoutingNumber },
                                        { label: 'SWIFT / BIC', value: settings.bankSwiftCode },
                                    ].filter(r => r.value).map(({ label, value }) => (
                                        <div key={label} className="flex justify-between items-center py-2 border-b border-slate-800/60 last:border-0">
                                            <span className="text-xs text-slate-500 uppercase tracking-wider">{label}</span>
                                            <span className="text-white font-mono text-sm">{value}</span>
                                        </div>
                                    ))}
                                    {!settings.bankName && (
                                        <p className="text-slate-500 text-sm text-center py-4">Bank details not configured yet. Please contact support.</p>
                                    )}
                                </div>
                            )}
                        </section>

                        {/* Amount Input */}
                        <section className="bg-[#1a1d24] p-6 rounded-3xl border border-gray-800">
                            <h3 className="text-gray-400 text-xs font-bold mb-4 uppercase tracking-wider">Deposit Amount (USD)</h3>
                            <div className="bg-[#0b0e14] p-4 rounded-2xl border border-gray-800 flex items-center gap-3 mb-5 focus-within:border-blue-500 transition-colors">
                                <span className="text-blue-500 text-2xl font-bold">$</span>
                                <input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    className="bg-transparent text-right text-3xl font-black text-white focus:outline-none w-full"
                                    placeholder="0.00"
                                />
                            </div>
                            <div className="grid grid-cols-4 gap-2">
                                {['100', '500', '1000', '5000'].map((val) => (
                                    <button key={val} onClick={() => setAmount(val)}
                                        className="bg-gray-800/40 border border-gray-800 text-gray-400 py-3 rounded-xl text-xs font-bold hover:bg-gray-700 hover:text-white transition-all">
                                        ${val}
                                    </button>
                                ))}
                            </div>
                        </section>

                        <button
                            onClick={handleProceed}
                            disabled={!amount || parseFloat(amount) <= 0}
                            className="w-full bg-[#00a3e0] hover:bg-[#0090c7] disabled:opacity-40 disabled:cursor-not-allowed py-4 rounded-2xl font-bold text-sm shadow-xl shadow-blue-500/20 active:scale-95 transition-all"
                        >
                            Proceed to Deposit
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

export default FundAccountPage;