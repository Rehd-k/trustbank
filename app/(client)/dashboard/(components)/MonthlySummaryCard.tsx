const MonthlySummaryCard = () => (
    <div className="bg-[#1a1d24] p-4 rounded-2xl border border-gray-800">
        <h3 className="text-gray-300 font-medium mb-6">This Month</h3>
        <div className="grid grid-cols-2 gap-4 text-center">
            <div>
                <div className="bg-green-900/20 w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-2">
                    <span className="text-green-500 text-xs">↓</span>
                </div>
                <p className="text-gray-400 text-xs">Income</p>
                <p className="text-green-500 font-bold">$0.00</p>
            </div>
            <div>
                <div className="bg-red-900/20 w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-2">
                    <span className="text-red-500 text-xs">↑</span>
                </div>
                <p className="text-gray-400 text-xs">Expenses</p>
                <p className="text-red-500 font-bold">$0.41</p>
            </div>
        </div>
        <div className="mt-6 pt-4 border-t border-gray-800 flex justify-center gap-2">
            <span className="text-gray-400">Net:</span>
            <span className="text-red-500 font-bold">$-0.41</span>
        </div>
    </div>
);

export { MonthlySummaryCard }