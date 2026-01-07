'use client';

import { useEffect, useState } from 'react';


export default function DigitalClock() {
    const [mounted, setMounted] = useState(false);
    const [time, setTime] = useState<Date | null>(null);

    useEffect(() => {
        // eslint-disable-next-line
        setMounted(true);
        setTime(new Date());
        const interval = setInterval(() => {
            setTime(new Date());
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    // Prevent hydration mismatch by defining a fixed loading state or returning null until mounted
    if (!mounted || !time) return (
        <div className="h-32 flex flex-col items-center justify-center text-olive-100/50 animate-pulse">
            <div className="h-16 w-40 bg-white/10 rounded-xl mb-2"></div>
            <div className="h-4 w-24 bg-white/10 rounded-md"></div>
        </div>
    );

    const hours = time.getHours();
    const minutes = time.getMinutes();

    const formatNumber = (num: number) => num < 10 ? `0${num}` : num;
    const dayName = time.toLocaleDateString('en-US', { weekday: 'long' });
    const dateString = time.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });

    return (
        <div className="flex flex-col items-center justify-center text-white p-6 relative">
            {/* Date */}
            <h3 className="text-olive-50 text-xs md:text-sm font-bold tracking-[0.2em] uppercase mb-2 opacity-90 border-b border-olive-200/30 pb-2">
                {dayName}, {dateString}
            </h3>

            {/* Main Time Display - Reduced size */}
            <div className="flex items-baseline justify-center space-x-1 sm:space-x-2 font-mono relative z-10 w-full">

                {/* Hours */}
                <div className="relative group">
                    <div className="text-5xl sm:text-6xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white via-olive-50 to-sage-green-200/50 drop-shadow-[0_0_15px_rgba(255,255,255,0.3)] tabular-nums tracking-tighter transition-all duration-300">
                        {formatNumber(hours)}
                    </div>
                </div>

                {/* Separator */}
                <span className="text-3xl sm:text-4xl md:text-5xl font-light text-olive-200 animate-pulse pb-2 sm:pb-4">:</span>

                {/* Minutes */}
                <div className="relative group">
                    <div className="text-5xl sm:text-6xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white via-olive-50 to-sage-green-200/50 drop-shadow-[0_0_15px_rgba(255,255,255,0.3)] tabular-nums tracking-tighter transition-all duration-300">
                        {formatNumber(minutes)}
                    </div>
                </div>
            </div>

            {/* Decorative Glow elements */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[100%] h-[100%] bg-sage-green-500/10 blur-[60px] rounded-full z-0 pointer-events-none mix-blend-screen"></div>
        </div>
    );
}
