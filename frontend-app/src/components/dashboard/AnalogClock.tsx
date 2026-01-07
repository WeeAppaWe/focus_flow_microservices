'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function AnalogClock() {
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        // Determine the time on mount to avoid hydration mismatch, though for clock hands slight mismatch is okay if client-only.
        setTime(new Date());
        const interval = setInterval(() => {
            setTime(new Date());
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    // Calculate degrees
    const seconds = time.getSeconds();
    const minutes = time.getMinutes();
    const hours = time.getHours();

    const secondDegrees = (seconds / 60) * 360;
    const minuteDegrees = ((minutes + seconds / 60) / 60) * 360;
    const hourDegrees = ((hours + minutes / 60) / 12) * 360;

    return (
        <div className="relative w-40 h-40 md:w-48 md:h-48 flex items-center justify-center bg-white/10 backdrop-blur-md rounded-full border border-white/20 shadow-2xl">
            {/* Clock Face Indicators */}
            {[...Array(12)].map((_, i) => (
                <div
                    key={i}
                    className="absolute w-1 h-3 bg-white/40 rounded-full"
                    style={{
                        transform: `rotate(${i * 30}deg) translateY(-420%)`, // Push out from center
                        transformOrigin: '50% 500%' // Very specific origin trick, or just absolute positioning
                        // Simpler approach: absolute positioning + transform
                    }}
                />
            ))}
            {/* Proper dial markers */}
            <div className="absolute inset-0">
                {[...Array(12)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute top-0 left-1/2 w-1 h-full pt-2 -ml-0.5"
                        style={{ transform: `rotate(${i * 30}deg)` }}
                    >
                        <div className="w-full h-2 bg-white/50 rounded-full" />
                    </div>
                ))}
            </div>

            {/* Clock Center */}
            <div className="absolute w-3 h-3 bg-white rounded-full z-20 shadow-lg"></div>

            {/* Hour Hand */}
            <div
                className="absolute w-1.5 h-12 bg-white rounded-full origin-bottom z-10 bottom-1/2 left-1/2 -translate-x-1/2"
                style={{
                    transform: `translateX(-50%) rotate(${hourDegrees}deg)`,
                }}
            />

            {/* Minute Hand */}
            <div
                className="absolute w-1 h-16 bg-blue-200/80 rounded-full origin-bottom z-10 bottom-1/2 left-1/2 -translate-x-1/2"
                style={{
                    transform: `translateX(-50%) rotate(${minuteDegrees}deg)`,
                }}
            />

            {/* Second Hand */}
            <motion.div
                className="absolute w-0.5 h-20 bg-red-400 rounded-full origin-bottom z-10 bottom-1/2 left-1/2 -translate-x-1/2"
                style={{
                    transform: `translateX(-50%) rotate(${secondDegrees}deg)`,
                }}
                // Use animation for smoother ticking if desired, but CSS transition is often enough
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
            />

            {/* Digital Time Display (Optional, below or inside) */}
            <div className="absolute -bottom-12 font-mono text-sm text-white/80 bg-black/20 px-3 py-1 rounded-full backdrop-blur-sm">
                {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
        </div>
    );
}
