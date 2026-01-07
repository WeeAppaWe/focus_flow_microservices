import { Button } from '@/components/ui/button';
import { LayoutDashboard, LogOut } from 'lucide-react';
import { motion } from 'framer-motion';
import NotificationBell from './NotificationBell';

interface User {
    id: number;
    name: string;
    email: string;
}

interface DashboardHeaderProps {
    user: User | null;
    pendingCount: number;
    completedCount: number;
    onLogout: () => void;
}

export default function DashboardHeader({ user, pendingCount, completedCount, onLogout }: DashboardHeaderProps) {

    // Helper: Get Greeting
    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good Morning';
        if (hour < 18) return 'Good Afternoon';
        return 'Good Evening';
    };

    return (
        <motion.header
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="flex flex-col md:flex-row justify-between items-center bg-white/60 dark:bg-evergreen-900/60 backdrop-blur-xl p-6 rounded-[32px] border border-sage-green-100 dark:border-evergreen-800 shadow-xl relative z-50"
        >
            <div className="flex items-center gap-5 mb-4 md:mb-0 w-full md:w-auto">
                <div className="bg-gradient-to-br from-evergreen-600 to-olive-leaf-600 p-3.5 rounded-2xl shadow-lg shadow-evergreen-500/20 transform transition-transform hover:scale-105 hover:rotate-3">
                    <LayoutDashboard className="text-white w-7 h-7" />
                </div>
                <div>
                    <h1 className="text-3xl font-bold text-evergreen-900 dark:text-white tracking-tight">FocusFlow</h1>
                    <p className="text-base text-sage-green-600 font-medium">{getGreeting()}, {user?.name?.split(' ')[0]}</p>
                </div>
            </div>

            <div className="flex flex-wrap justify-center md:justify-end items-center gap-3 w-full md:w-auto">
                <div className="flex gap-2 p-1.5 bg-sage-green-50/50 dark:bg-evergreen-800/50 rounded-2xl border border-sage-green-100 backdrop-blur-sm">
                    <div className="px-5 py-2 rounded-xl text-center">
                        <span className="block text-xl font-bold text-olive-600 dark:text-olive-400">{pendingCount}</span>
                        <span className="text-xs font-semibold text-sage-green-500 uppercase tracking-wider">Pending</span>
                    </div>
                    <div className="w-px bg-sage-green-200 dark:bg-evergreen-700 my-2"></div>
                    <div className="px-5 py-2 rounded-xl text-center">
                        <span className="block text-xl font-bold text-evergreen-600 dark:text-evergreen-400">{completedCount}</span>
                        <span className="text-xs font-semibold text-sage-green-500 uppercase tracking-wider">Done</span>
                    </div>
                </div>
                <NotificationBell />
                <Button
                    variant="ghost"
                    onClick={onLogout}
                    className="bg-white/50 hover:bg-red-50 text-sage-green-600 hover:text-red-500 border border-white/60 rounded-xl px-4 py-6 h-auto transition-all ml-2"
                >
                    <LogOut size={20} />
                </Button>
            </div>
        </motion.header>
    );
}
