'use client'
import Link from "next/link";
import { BellIcon, CreditCard, Logs, MenuIcon, Send, Settings2, UserIcon } from "lucide-react";
import { usePathname } from "next/navigation";

export default function ClientLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const pathname = usePathname();
    return (

        <main className="mx-auto relative md:grid md:grid-cols-6 w-full">
            <nav className="flex w-full justify-center">
                {/* Sidebar for medium and up screens */}
                <aside className="hidden md:flex flex-col md:w-full md:h-screen bg-primary p-4">
                    <div className="md:w-full flex flex-col py-4 gap-4 items-center border-b border-gray-200">
                        <div className="h-14 w-14 rounded-full flex justify-center items-center bg-gray-200">
                            <UserIcon className="size-6 text-primary" />
                        </div>
                        <div className="text-center">
                            <p className="text-xl font-thin">Good Morning</p>
                            <p>User, User</p>
                        </div>
                    </div>
                    <nav className="flex flex-col gap-4 mt-6 text-white">
                        <Link href="/dashboard" className="hover:underline">Dashboard</Link>
                        <Link href="/transactions" className="hover:underline">Transactions</Link>
                        <Link href="/settings" className="hover:underline">Settings</Link>
                    </nav>
                </aside>

                {/* Navbar floating at the bottom for small screens */}
                <nav className="md:hidden fixed bottom-5 left-1/2 -translate-x-1/2 bg-linear-to-r from-primary to-primary/90 w-[90%] max-w-md rounded-2xl flex justify-around py-6 px-2 shadow-lg z-50">
                    <Link href="/transactions" className={`flex flex-col items-center text-white hover:text-yellow-200 ${pathname === '/transactions' ? 'py-4 px-4 bg-secondary rounded-2xl' : ''}`}>
                        <Logs className="size-5 mb-1" /><span className="text-xs">Activities</span>
                    </Link>
                    <Link href="/transfer" className={`flex flex-col items-center text-white hover:text-yellow-200 ${pathname === '/transfer' ? 'py-4 px-4 bg-secondary rounded-2xl' : ''}`}>
                        <Send className="size-5 mb-1" /><span className="text-xs">Transfer</span>
                    </Link>
                    <Link href="/dashboard" className={`flex flex-col items-center text-white hover:text-yellow-200 ${pathname === '/dashboard' ? 'py-4 px-2 bg-secondary rounded-2xl' : ''}`}>
                        <MenuIcon className="size-5 mb-1" /><span className="text-xs">Dashboard</span>
                    </Link>

                    <Link href="/settings" className={`flex flex-col items-center text-white hover:text-yellow-200 ${pathname === '/settings' ? 'py-4 px-2 bg-secondary rounded-2xl' : ''}`}>
                        <CreditCard className="size-5 mb-1" /><span className="text-xs">Settings</span>
                    </Link>
                    <Link href="/accounts" className={`flex flex-col items-center text-white hover:text-yellow-200 ${pathname === '/accounts' ? 'py-4 px-2 bg-secondary rounded-2xl' : ''}`}>
                        <UserIcon className="size-5 mb-1" /><span className="text-xs">Account</span>
                    </Link>
                </nav>
            </nav>

            <div className="col-span-5">
                <header className="top-0 w-full md:flex items-center justify-between p-2 md:bg-primary/90 bg-transparent hidden">
                    <MenuIcon className="size-4 hover:cursor-pointer" />

                    <div className="flex gap-2">
                        <button className="p-2 rounded-full bg-primary hover:cursor-pointer">
                            <Settings2 className="size-4 text-yellow-400" />
                        </button>
                        <button className="p-2 rounded-full bg-primary hover:cursor-pointer">
                            <BellIcon className="size-4 text-white" />
                        </button>
                        <button className="p-2 rounded-full bg-primary hover:cursor-pointer">
                            <UserIcon className="size-4 text-white" />
                        </button>
                    </div>
                </header>
                <div className="w-full h-full bg-linear-to-r from-blue-950 to-indigo-950/90 pb-40">
                    {children}
                </div>
            </div>

        </main>
    );
}