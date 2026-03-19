import { Settings2, BellIcon } from "lucide-react";
interface User {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    accounts: { _id: string; accountNumber: string; accountType: string; accountBalance: number; currency: string }[];
    cards: { _id: string; type: string; balance: number; lastFourDigits: string }[];
}
export default function ClientHead({ user }: { user: User }) {
    return <div className="flex justify-between items-center pt-3 md:pt-5">
        <div className="flex items-center">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-gray-400 flex justify-center items-center rounded-full text-lg md:text-xl font-bold">K</div>
            <div className="flex flex-col ml-2 md:ml-3 text-gray-300">
                <p className="font-thin text-base md:text-xl">Good Morning</p>
                <p className="text-xs md:text-sm">{user.firstName} {user.lastName}</p>
            </div>
        </div>
        <div className="flex gap-2 md:gap-3">
            <div className="flex w-8 h-8 md:w-10 md:h-10 justify-center items-center bg-blue-900 text-gray-200 text-xs rounded-full">
                <Settings2 className="size-4 md:size-5" />

            </div>
            <div className="flex w-8 h-8 md:w-10 md:h-10 justify-center items-center bg-blue-900 text-gray-200 text-xs rounded-full">
                <BellIcon className="size-4 md:size-5" />
            </div>
        </div>
    </div>
}