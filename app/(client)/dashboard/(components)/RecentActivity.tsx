import { api } from "@/lib/api";
import { useEffect, useState } from "react";

const RecentActivity = ({ userId }: { userId: string }) => {
    const [transactions, setTransactions] = useState<any[]>()
    const [error, setHaveError] = useState<boolean>(false)
    const [loading, setLoading] = useState<boolean>(false)
    useEffect(() => {
        api
            .get("/api/me")
            .then((res) => { setTransactions(res.data) })
            .catch(() => {
                setHaveError(true)
            })
            .finally(() => setLoading(false));
    }, [userId])
    const activities = [
        { type: 'Credit', amount: '+$0.41', date: '02 Nov 2025, 17:00', icon: '↓', color: 'text-green-500' },
        { type: 'Credit', amount: '+$65,000.00', date: '21 Nov 2025, 05:58', icon: '↓', color: 'text-green-500' },
    ];

    return (
        <div className="mt-2">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold">Recent Activity</h3>
                <button className="text-blue-400 text-sm">View All &gt;</button>
            </div>
            {error ? <div className="flex justify-center items-center">

            </div> :
                <div className="space-y-3">
                    {activities.map((item, i) => (
                        <div key={i} className="bg-[#1a1d24] p-4 rounded-2xl flex items-center justify-between border border-gray-800">
                            <div className="flex items-center gap-4">
                                <div className="bg-green-900/20 p-3 rounded-xl">{item.icon}</div>
                                <div>
                                    <p className="font-bold">{item.type}</p>
                                    <p className="text-gray-500 text-xs">{item.date}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <button className="text-blue-400 text-xs mb-1">View Details</button>
                                <p className={`${item.color} font-bold`}>{item.amount}</p>
                            </div>
                        </div>
                    ))}
                </div>
            }
        </div>
    );
};
export { RecentActivity }