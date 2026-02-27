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
    return <div className="flex justify-between items-center pt-2">
        <div className="flex ">
            <div className="w-10 h-10 bg-gray-400 flex justify-center items-center rounded-full text-xl font-bold">K</div>
            <div className="flex flex-col ml-2 text-gray-300">
                <p className="font-thin text-lg">Good Morning</p>
                <p className="text-xs">{user.firstName} {user.lastName}</p>
            </div>
        </div>
        <div className="flex">
            <div className="mr-2 flex w-8 h-8 justify-center items-center bg-blue-900 text-gray-200 text-xs rounded-full">
                <Settings2 className="size-4" />

            </div>
            <div className="flex w-8 h-8 justify-center items-center bg-blue-900 text-gray-200 text-xs rounded-full">
                <BellIcon className="size-4" />
            </div>
        </div>
    </div>
}