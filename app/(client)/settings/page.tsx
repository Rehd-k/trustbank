'use client'
import { useState } from 'react';
import {
    ArrowLeft,
    User,
    Shield,
    Bell,
    Moon,
    Globe,
    HelpCircle,
    LogOut,
    ChevronRight,
    Lock,
    Smartphone,
    Mail,
    CheckCircle2
} from 'lucide-react';

const SettingsPage = () => {
    const [notifications, setNotifications] = useState(true);
    const [biometric, setBiometric] = useState(false);

    // Reusable Row Component
    const SettingRow = ({ icon: Icon, title, subtitle, action, color = "text-slate-400" }: any) => (
        <div className="flex items-center justify-between p-4 border-b border-slate-800/50 last:border-0 hover:bg-slate-800/30 transition-colors cursor-pointer group">
            <div className="flex items-center gap-4">
                <div className={`p-2 rounded-xl bg-slate-800 group-hover:bg-slate-700 transition-colors ${color}`}>
                    <Icon size={20} />
                </div>
                <div>
                    <h4 className="text-white text-sm font-medium">{title}</h4>
                    {subtitle && <p className="text-xs text-slate-500">{subtitle}</p>}
                </div>
            </div>
            {action ? action : <ChevronRight size={18} className="text-slate-600" />}
        </div>
    );

    // Toggle Switch Component
    const Toggle = ({ active, onToggle }: any) => (
        <div
            onClick={onToggle}
            className={`w-12 h-6 rounded-full flex items-center p-1 cursor-pointer transition-colors duration-300 ${active ? 'bg-blue-500' : 'bg-slate-700'}`}
        >
            <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${active ? 'translate-x-6' : 'translate-x-0'}`} />
        </div>
    );

    return (
        <div className=" flex justify-center items-center font-sans">
            {/* Mobile Container */}
            <div className="w-full h-212.5 rounded-[30px] border border-slate-800 shadow-2xl relative overflow-hidden flex flex-col">

                {/* Header */}
                <div className="flex items-center px-2 py-6 shrink-0 z-20 backdrop-blur-sm sticky top-0">

                    <h1 className="text-white font-bold text-lg tracking-wide ml-4">Settings</h1>
                </div>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto pb-8 scrollbar-hide px-5">

                    {/* Profile Card */}
                    <div className="bg-linear-to-r from-blue-600 to-blue-800 rounded-2xl p-5 mb-8 flex items-center gap-4 shadow-lg relative overflow-hidden">
                        {/* Decor */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10"></div>

                        <div className="relative">
                            <div className="w-16 h-16 rounded-full bg-slate-200 border-2 border-white/30 flex items-center justify-center text-blue-600 font-bold text-xl">
                                JD
                            </div>
                            <div className="absolute bottom-0 right-0 bg-green-500 border-2 border-blue-700 w-4 h-4 rounded-full"></div>
                        </div>

                        <div className="relative z-10">
                            <h2 className="text-white font-bold text-lg">John Doe</h2>
                            <p className="text-blue-100 text-xs mb-1">john.doe@example.com</p>
                            <div className="flex items-center gap-1 bg-black/20 w-fit px-2 py-0.5 rounded-full backdrop-blur-sm">
                                <CheckCircle2 size={10} className="text-green-400" />
                                <span className="text-[10px] text-white font-medium">Verified Account</span>
                            </div>
                        </div>
                    </div>

                    {/* Section: General */}
                    <div className="mb-6">
                        <h3 className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-3 ml-2">General</h3>
                        <div className="bg-[#151F32] rounded-2xl overflow-hidden border border-slate-800/60">
                            <SettingRow
                                icon={User}
                                title="Personal Information"
                                subtitle="Edit name, address, etc."
                                color="text-blue-400" action={undefined} />
                            <SettingRow
                                icon={Globe}
                                title="Language"
                                action={<span className="text-xs text-slate-400 font-medium">English (US)</span>}
                                color="text-purple-400" subtitle={undefined} />
                        </div>
                    </div>

                    {/* Section: Security */}
                    <div className="mb-6">
                        <h3 className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-3 ml-2">Security</h3>
                        <div className="bg-[#151F32] rounded-2xl overflow-hidden border border-slate-800/60">
                            <SettingRow
                                icon={Lock}
                                title="Change Password"
                                color="text-orange-400" subtitle={undefined} action={undefined} />
                            <SettingRow
                                icon={Smartphone}
                                title="Two-Factor Auth"
                                subtitle="Enabled via SMS"
                                color="text-green-400" action={undefined} />
                            <SettingRow
                                icon={Shield}
                                title="Biometric ID"
                                action={<Toggle active={biometric} onToggle={() => setBiometric(!biometric)} />}
                                color="text-teal-400" subtitle={undefined} />
                        </div>
                    </div>

                    {/* Section: Preferences */}
                    <div className="mb-6">
                        <h3 className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-3 ml-2">App Settings</h3>
                        <div className="bg-[#151F32] rounded-2xl overflow-hidden border border-slate-800/60">
                            <SettingRow
                                icon={Bell}
                                title="Push Notifications"
                                action={<Toggle active={notifications} onToggle={() => setNotifications(!notifications)} />}
                                color="text-yellow-400" subtitle={undefined} />
                            <SettingRow
                                icon={Moon}
                                title="Dark Mode"
                                action={<Toggle active={true} onToggle={() => { }} />} // Force true for demo
                                color="text-slate-300" subtitle={undefined} />
                        </div>
                    </div>

                    {/* Section: Support */}
                    <div className="mb-8">
                        <h3 className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-3 ml-2">Support</h3>
                        <div className="bg-[#151F32] rounded-2xl overflow-hidden border border-slate-800/60">
                            <SettingRow
                                icon={HelpCircle}
                                title="Help Center"
                                color="text-pink-400" subtitle={undefined} action={undefined} />
                            <SettingRow
                                icon={Mail}
                                title="Contact Support"
                                color="text-cyan-400" subtitle={undefined} action={undefined} />
                        </div>
                    </div>

                    {/* Logout */}
                    <button className="w-full bg-red-500/10 hover:bg-red-500/20 text-red-500 py-4 rounded-xl font-bold transition-colors flex items-center justify-center gap-2 mb-6 border border-red-500/20">
                        <LogOut size={18} />
                        Log Out
                    </button>

                    <p className="text-center text-slate-600 text-[10px] pb-4">
                        Version 2.4.0 (Build 20260224)
                    </p>

                </div>
            </div>
        </div>
    );
};

export default SettingsPage;