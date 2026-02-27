import { Landmark } from "lucide-react";

const TransferModal = ({ method, onClose }: any) => {
    const isCrypto = method.id === 'crypto';

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose}></div>

            <div className="relative bg-[#1a1d24] w-full max-w-sm rounded-3xl p-6 border border-gray-800 shadow-2xl">
                <h2 className="text-xl font-bold mb-2 text-center">{method.title}</h2>

                {isCrypto ? (
                    /* Crypto Form */
                    <div className="space-y-4 mt-4">
                        <div>
                            <label className="text-gray-400 text-xs block mb-1">Select Account</label>
                            <select className="w-full bg-[#242831] border border-gray-700 rounded-xl p-3 text-sm">
                                <option>Main Wallet ($45,000.00)</option>
                                <option>Savings ($19,600.00)</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-gray-400 text-xs block mb-1">Select Asset</label>
                            <select className="w-full bg-[#242831] border border-gray-700 rounded-xl p-3 text-sm">
                                <option>Bitcoin (BTC)</option>
                                <option>Ethereum (ETH)</option>
                                <option>USDT</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-gray-400 text-xs block mb-1">Amount</label>
                            <input type="number" placeholder="0.00" className="w-full bg-[#242831] border border-gray-700 rounded-xl p-3 text-sm" />
                        </div>
                        <button className="w-full bg-blue-500 py-3 rounded-xl font-bold mt-2 shadow-lg shadow-blue-500/20">
                            Confirm Send
                        </button>
                    </div>
                ) : (
                    /* Customer Care Message */
                    <div className="text-center py-6">
                        <div className="bg-yellow-900/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-yellow-500">
                            <Landmark size={32} />
                        </div>
                        <p className="text-gray-300 text-sm leading-relaxed">
                            To complete a <span className="font-bold">{method.title}</span>, please contact our support team for verification and routing details.
                        </p>
                        <button className="w-full bg-blue-500 py-3 rounded-xl font-bold mt-6">
                            Contact Support
                        </button>
                    </div>
                )}

                <button onClick={onClose} className="w-full mt-2 text-gray-500 text-sm py-2">Cancel</button>
            </div>
        </div>
    );
};

export default TransferModal;