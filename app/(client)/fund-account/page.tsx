'use client'
import React, { useState } from 'react';
import { ArrowLeft, Wallet, CheckCircle2, DollarSign, PiggyBank } from 'lucide-react';

const FundAccountPage = () => {
    const [selectedMethod, setSelectedMethod] = useState('USDT');
    const [amount, setAmount] = useState('0.00');

    const methods = [
        { id: 'USDT', name: 'USDT', color: 'bg-emerald-500' },
        { id: 'Ethereum', name: 'Ethereum', color: 'bg-emerald-500' },
        { id: 'Bitcoin', name: 'Bitcoin', color: 'bg-amber-500' },
    ];

    return (
        <div className="min-h-screen bg-[#0b0e14] text-white font-sans pb-10">
            {/* Header Card */}
            <div className="relative overflow-hidden bg-linear-to-b from-[#00a3e0] to-[#0b0e14] pt-6 pb-12 px-6 rounded-b-[3rem]">
                <button className="bg-white/10 p-2 rounded-xl mb-6 backdrop-blur-md">
                    <ArrowLeft size={20} />
                </button>

                <div className="flex flex-col items-center text-center">
                    <div className="bg-white/20 p-4 rounded-2xl mb-4 backdrop-blur-md shadow-lg">
                        <PiggyBank size={32} className="text-white" />
                    </div>
                    <h1 className="text-2xl font-bold mb-2">Fund Your Account</h1>
                    <p className="text-white/70 text-sm max-w-62.5">
                        Choose your preferred deposit method and amount
                    </p>
                </div>
            </div>

            <div className="px-6 -mt-6 space-y-6">
                {/* Method Selection */}
                <section>
                    <h3 className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-4 ml-1">
                        Select Deposit Method
                    </h3>
                    <div className="space-y-3">
                        {methods.map((method) => (
                            <button
                                key={method.id}
                                onClick={() => setSelectedMethod(method.id)}
                                className={`w-full p-4 rounded-2xl border transition-all flex items-center justify-between ${selectedMethod === method.id
                                        ? 'bg-[#1a1d24] border-blue-500 shadow-lg shadow-blue-500/10'
                                        : 'bg-[#1a1d24] border-gray-800'
                                    }`}
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`${method.color} p-2.5 rounded-xl shadow-inner`}>
                                        <Wallet size={20} className="text-white" />
                                    </div>
                                    <span className="font-bold text-sm">{method.name}</span>
                                </div>
                                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedMethod === method.id ? 'border-blue-500 bg-blue-500' : 'border-gray-700'
                                    }`}>
                                    {selectedMethod === method.id && <CheckCircle2 size={12} className="text-white" />}
                                </div>
                            </button>
                        ))}
                    </div>
                </section>

                {/* Amount Input */}
                <section className="bg-[#1a1d24] p-6 rounded-3xl border border-gray-800">
                    <h3 className="text-gray-400 text-xs font-bold mb-4 uppercase tracking-wider">
                        Deposit Amount
                    </h3>

                    <div className="bg-[#0b0e14] p-4 rounded-2xl border border-gray-800 flex items-center justify-between mb-6 group focus-within:border-blue-500 transition-colors">
                        <span className="text-blue-500 text-2xl font-bold">$</span>
                        <div className="flex items-baseline gap-1 w-full justify-end">
                            <input
                                type="text"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                className="bg-transparent text-right text-3xl font-black text-white focus:outline-none w-full"
                                placeholder="0.00"
                            />
                            <span className="text-gray-600 font-bold">.00</span>
                        </div>
                    </div>

                    {/* Quick Selection Buttons */}
                    <div className="grid grid-cols-4 gap-2">
                        {['100', '500', '1000', '5000'].map((val) => (
                            <button
                                key={val}
                                onClick={() => setAmount(val)}
                                className="bg-gray-800/40 border border-gray-800 text-gray-400 py-3 rounded-xl text-xs font-bold hover:bg-gray-700 hover:text-white transition-all"
                            >
                                ${val}
                            </button>
                        ))}
                    </div>
                </section>

                {/* Action Button */}
                <button className="w-full bg-[#00a3e0] py-4 rounded-2xl font-bold text-sm shadow-xl shadow-blue-500/20 active:scale-95 transition-all">
                    Proceed to Deposit
                </button>
            </div>
        </div>
    );
};

export default FundAccountPage;