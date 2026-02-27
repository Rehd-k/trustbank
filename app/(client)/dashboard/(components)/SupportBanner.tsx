const SupportBanner = () => (
    <div className="bg-[#1a1d24] p-6 rounded-2xl border border-gray-800 mt-4 text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
            <div className="bg-blue-500 w-5 h-5 rounded-full flex items-center justify-center text-[10px]">🎧</div>
            <h3 className="font-bold">24/7 Support</h3>
        </div>

        <p className="text-gray-400 text-xs mb-6">We're here to help you anytime</p>

        <div className="flex justify-center gap-8">
            <div className="flex flex-col items-center gap-1">
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-blue-500">🕒</div>
                <span className="text-[10px] text-gray-400">24/7</span>
            </div>
            <div className="flex flex-col items-center gap-1">
                <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-green-500">🎧</div>
                <span className="text-[10px] text-gray-400">Support</span>
            </div>
            <div className="flex flex-col items-center gap-1">
                <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-blue-400">⚡</div>
                <span className="text-[10px] text-gray-400">Fast</span>
            </div>
        </div>
    </div>
);

export { SupportBanner }