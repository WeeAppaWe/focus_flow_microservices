'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authApi } from '@/api/auth.api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { User, Mail, Lock } from 'lucide-react';
import BackgroundBlobs from '@/components/common/BackgroundBlobs';

// Define a type for the error object since we can't use any
interface ApiError {
    response?: {
        data?: {
            message?: string;
        };
    };
}

export default function SlidingAuth() {
    const [isSignUp, setIsSignUp] = useState(false);
    const router = useRouter();

    // Login State
    const [loginEmail, setLoginEmail] = useState('');
    const [loginPassword, setLoginPassword] = useState('');
    const [loginLoading, setLoginLoading] = useState(false);

    // Register State
    const [regName, setRegName] = useState('');
    const [regEmail, setRegEmail] = useState('');
    const [regPassword, setRegPassword] = useState('');
    const [regLoading, setRegLoading] = useState(false);

    // Custom bezier for "Smooth Phasing"
    const transitionClass = "transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)]";

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoginLoading(true);
        try {
            const data = await authApi.login({ email: loginEmail, password: loginPassword });
            const { token, user } = data.data;
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
            toast.success('Welcome back!');
            router.push('/dashboard');
        } catch (err: unknown) {
            const error = err as ApiError;
            toast.error(error.response?.data?.message || 'Login failed');
        } finally {
            setLoginLoading(false);
        }
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setRegLoading(true);
        try {
            await authApi.register({ name: regName, email: regEmail, password: regPassword });
            toast.success('Account created! Please login.');
            setIsSignUp(false);
        } catch (err: unknown) {
            const error = err as ApiError;
            toast.error(error.response?.data?.message || 'Registration failed');
        } finally {
            setRegLoading(false);
        }
    };

    // Content Animation Variants
    const contentVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: (i: number) => ({
            opacity: 1,
            y: 0,
            transition: { delay: i * 0.1, duration: 0.5 }
        })
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-sage-green-50 dark:bg-evergreen-950 p-4 font-sans relative overflow-hidden">
            <BackgroundBlobs />

            <div className={cn(
                "relative bg-white/95 dark:bg-evergreen-900/90 backdrop-blur-2xl border border-white/50 rounded-[24px] shadow-[0_8px_32px_0_rgba(75,85,63,0.10)] overflow-hidden w-[850px] max-w-full min-h-[550px]",
            )}>

                {/* --- SIGN UP CONTAINER --- */}
                <div className={cn(
                    "absolute top-0 h-full left-0 w-1/2 flex flex-col items-center justify-center p-12 text-center",
                    transitionClass,
                    isSignUp
                        ? "translate-x-full opacity-100 z-[5]"
                        : "opacity-0 z-[1]"
                )}>
                    <form onSubmit={handleRegister} className="w-full flex flex-col items-center">
                        <motion.h1
                            initial="hidden" animate={isSignUp ? "visible" : "hidden"} custom={0} variants={contentVariants}
                            className="font-bold text-3xl mb-4 text-evergreen-900 dark:text-white"
                        >
                            Create Account
                        </motion.h1>

                        <motion.div initial="hidden" animate={isSignUp ? "visible" : "hidden"} custom={3} variants={contentVariants} className="w-full space-y-3">
                            <div className="relative group">
                                <User className="absolute left-3 top-3.5 h-4 w-4 text-sage-green-500 group-focus-within:text-evergreen-600 transition-colors" />
                                <Input placeholder="Name" className="pl-10 h-11 bg-white border-sage-green-200 focus:border-evergreen-500 focus:ring-evergreen-500 transition-all text-evergreen-900 placeholder:text-sage-green-400 font-medium shadow-sm" value={regName} onChange={(e) => setRegName(e.target.value)} required />
                            </div>
                            <div className="relative group">
                                <Mail className="absolute left-3 top-3.5 h-4 w-4 text-sage-green-500 group-focus-within:text-evergreen-600 transition-colors" />
                                <Input placeholder="Email" type="email" className="pl-10 h-11 bg-white border-sage-green-200 focus:border-evergreen-500 focus:ring-evergreen-500 transition-all text-evergreen-900 placeholder:text-sage-green-400 font-medium shadow-sm" value={regEmail} onChange={(e) => setRegEmail(e.target.value)} required />
                            </div>
                            <div className="relative group">
                                <Lock className="absolute left-3 top-3.5 h-4 w-4 text-sage-green-500 group-focus-within:text-evergreen-600 transition-colors" />
                                <Input placeholder="Password" type="password" className="pl-10 h-11 bg-white border-sage-green-200 focus:border-evergreen-500 focus:ring-evergreen-500 transition-all text-evergreen-900 placeholder:text-sage-green-400 font-medium shadow-sm" value={regPassword} onChange={(e) => setRegPassword(e.target.value)} required />
                            </div>
                        </motion.div>

                        <motion.div initial="hidden" animate={isSignUp ? "visible" : "hidden"} custom={4} variants={contentVariants} className="mt-6 w-full flex flex-col items-center">
                            <Button className="w-full rounded-xl bg-sage-green-600 hover:bg-sage-green-700 text-white font-bold py-6 shadow-lg shadow-sage-green-500/30 transition-all hover:scale-[1.02]" disabled={regLoading}>
                                {regLoading ? 'Creating...' : 'Sign Up'}
                            </Button>
                        </motion.div>
                    </form>
                </div>

                {/* --- SIGN IN CONTAINER --- */}
                <div className={cn(
                    "absolute top-0 h-full left-0 w-1/2 flex flex-col items-center justify-center p-12 text-center z-[2]",
                    transitionClass,
                    isSignUp ? "translate-x-full" : ""
                )}>
                    <form onSubmit={handleLogin} className="w-full flex flex-col items-center">
                        <motion.h1
                            initial="hidden" animate={!isSignUp ? "visible" : "hidden"} custom={0} variants={contentVariants}
                            className="font-bold text-3xl mb-4 text-evergreen-900 dark:text-white"
                        >
                            Sign In
                        </motion.h1>
                        <motion.div initial="hidden" animate={!isSignUp ? "visible" : "hidden"} custom={3} variants={contentVariants} className="w-full space-y-3">
                            <div className="relative group">
                                <Mail className="absolute left-3 top-3.5 h-4 w-4 text-sage-green-500 group-focus-within:text-evergreen-600 transition-colors" />
                                <Input placeholder="Email" type="email" className="pl-10 h-11 bg-white border-sage-green-200 focus:border-evergreen-500 focus:ring-evergreen-500 transition-all text-evergreen-900 placeholder:text-sage-green-400 font-medium shadow-sm" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} required />
                            </div>
                            <div className="relative group">
                                <Lock className="absolute left-3 top-3.5 h-4 w-4 text-sage-green-500 group-focus-within:text-evergreen-600 transition-colors" />
                                <Input placeholder="Password" type="password" className="pl-10 h-11 bg-white border-sage-green-200 focus:border-evergreen-500 focus:ring-evergreen-500 transition-all text-evergreen-900 placeholder:text-sage-green-400 font-medium shadow-sm" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} required />
                            </div>
                        </motion.div>

                        <motion.div initial="hidden" animate={!isSignUp ? "visible" : "hidden"} custom={4} variants={contentVariants} className="w-full mt-2 flex flex-col items-center">
                            <a href="#" className="text-sage-green-600 text-xs hover:text-evergreen-700 transition-colors self-end">Forgot your password?</a>
                            <Button className="w-full mt-4 rounded-xl bg-evergreen-600 hover:bg-evergreen-700 text-white font-bold py-6 shadow-lg shadow-evergreen-500/30 transition-all hover:scale-[1.02]" disabled={loginLoading}>
                                {loginLoading ? 'Signing In...' : 'Sign In'}
                            </Button>
                        </motion.div>
                    </form>
                </div>

                {/* --- OVERLAY CONTAINER --- */}
                <div className={cn(
                    "absolute top-0 left-1/2 w-1/2 h-full overflow-hidden z-[100]",
                    transitionClass,
                    isSignUp ? "-translate-x-full" : ""
                )}>
                    {/* Overlay Gradient with Earthy Effect */}
                    <div className={cn(
                        "bg-gradient-to-br from-evergreen-800 via-sage-green-700 to-olive-leaf-600 text-white relative -left-full h-full w-[200%]",
                        transitionClass,
                        isSignUp ? "translate-x-1/2" : "translate-x-0"
                    )}>
                        {/* Decorative Circles inside Overlay */}
                        <div className="absolute top-[-50px] left-[-50px] w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
                        <div className="absolute bottom-[20%] right-[20%] w-48 h-48 bg-olive-leaf-400/20 rounded-full blur-3xl"></div>

                        {/* --- OVERLAY LEFT (Register Mode Panel) --- */}
                        <div className={cn(
                            "absolute top-0 h-full w-1/2 flex flex-col items-center justify-center p-12 text-center",
                            transitionClass,
                            isSignUp ? "translate-x-0" : "-translate-x-[20%]"
                        )}>
                            <h1 className="font-bold text-4xl mb-6">Welcome Back!</h1>
                            <p className="text-base text-gray-100/90 mb-8 leading-relaxed">
                                To keep connected with us please login with your personal info
                            </p>
                            <button
                                className="bg-white/10 backdrop-blur-md border border-white/40 rounded-full px-12 py-3 font-semibold uppercase text-xs tracking-widest hover:bg-white hover:text-evergreen-700 transition-all hover:scale-105 active:95 shadow-lg"
                                onClick={() => setIsSignUp(false)}
                            >
                                Sign In
                            </button>
                        </div>

                        {/* --- OVERLAY RIGHT (Login Mode Panel) --- */}
                        <div className={cn(
                            "absolute right-0 top-0 h-full w-1/2 flex flex-col items-center justify-center p-12 text-center",
                            transitionClass,
                            isSignUp ? "translate-x-[20%]" : "translate-x-0"
                        )}>
                            <h1 className="font-bold text-4xl mb-6">Hello, Friend!</h1>
                            <p className="text-base text-gray-100/90 mb-8 leading-relaxed">
                                Enter your personal details and start your journey with us
                            </p>
                            <button
                                className="bg-white/10 backdrop-blur-md border border-white/40 rounded-full px-12 py-3 font-semibold uppercase text-xs tracking-widest hover:bg-white hover:text-sage-green-700 transition-all hover:scale-105 active:95 shadow-lg"
                                onClick={() => setIsSignUp(true)}
                            >
                                Sign Up
                            </button>
                        </div>

                    </div>
                </div>

            </div>
        </div>
    );
}
