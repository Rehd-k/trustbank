const HelpSection = () => (
    <div className="mt-6">
        <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold">Need Help?</h3>
            <button className="text-blue-400 text-sm">Support Center &gt;</button>
        </div>

        <div className="grid grid-cols-2 gap-4">
            {/* Live Chat Card */}
            <div className="bg-[#1a1d24] p-6 rounded-2xl border border-gray-800 text-center flex flex-col items-center">
                <div className="bg-blue-900/20 p-3 rounded-xl mb-3 text-blue-500">
                    💬
                </div>
                <p className="font-bold text-sm">Live Chat</p>
                <p className="text-gray-500 text-[10px] mt-1">Get instant help from our team</p>
            </div>

            {/* Email Support Card */}
            <div className="bg-[#1a1d24] p-6 rounded-2xl border border-gray-800 text-center flex flex-col items-center">
                <div className="bg-green-900/20 p-3 rounded-xl mb-3 text-green-500">
                    ✉️
                </div>
                <p className="font-bold text-sm">Email Support</p>
                <p className="text-gray-500 text-[10px] mt-1">Send us a detailed message</p>
            </div>
        </div>
    </div>
);
export { HelpSection }