"use client";

import React, { useState, useEffect } from 'react';
import { Clock, LogOut } from 'lucide-react';
import { motion } from 'framer-motion';

interface LiveTimerProps {
    inTime: string;
    shiftHours?: number;
    onCheckOut: () => void;
    canAct: boolean;
}

const formatDuration = (ms: number) => {
    const s = Math.floor(Math.abs(ms) / 1000);
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
};

export default function LiveTimer({ inTime, shiftHours = 8.5, onCheckOut, canAct }: LiveTimerProps) {
    const [remainingMs, setRemainingMs] = useState(0);
    const [isOvertime, setIsOvertime] = useState(false);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        if (!inTime) return;

        const inDate = new Date(inTime);
        // Use 7 hours for Saturday, otherwise use standard shiftHours
        const actualShiftHours = inDate.getDay() === 6 ? 7 : shiftHours;
        const shiftMs = actualShiftHours * 3600000;

        const tick = () => {
            const workedMs = Date.now() - inDate.getTime();
            const rem = shiftMs - workedMs;

            setIsOvertime(rem < 0);
            setRemainingMs(Math.abs(rem));

            // Calculate progress bar percentage
            const pct = (workedMs / shiftMs) * 100;
            setProgress(Math.min(100, Math.max(0, pct)));
        };

        tick();
        const interval = setInterval(tick, 1000);
        return () => clearInterval(interval);
    }, [inTime, shiftHours]);

    const formatClockInTime = (isoString: string) => {
        return new Date(isoString).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
        }).toLowerCase();
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full flex flex-col items-center justify-center py-6"
        >
            {/* Badge */}
            <div className="bg-white/5 border border-white/10 px-4 py-1.5 rounded-full mb-4">
                <span className="text-[10px] font-extrabold text-white/60 uppercase tracking-[0.2em]">
                    {isOvertime ? 'Overtime Active' : 'Shift Time Remaining'}
                </span>
            </div>

            {/* Timer */}
            <div className={`text-5xl md:text-[64px] font-black tracking-tight tabular-nums leading-none mb-3 ${isOvertime ? 'text-amber-400 drop-shadow-[0_0_20px_rgba(251,191,36,0.3)]' : 'text-white drop-shadow-md'
                }`}>
                {isOvertime && <span className="opacity-70 mr-2">+</span>}
                {formatDuration(remainingMs)}
            </div>

            {/* Subtext */}
            <div className="flex items-center gap-1.5 text-xs font-medium text-white/50 mb-8">
                <Clock size={12} />
                <span>Clocked in at {formatClockInTime(inTime)}</span>
            </div>

            {/* Progress Bar */}
            <div className="w-48 h-1.5 bg-white/10 rounded-full overflow-hidden mb-10">
                <div
                    className="h-full rounded-full transition-all duration-1000 ease-linear"
                    style={{
                        width: `${progress}%`,
                        background: isOvertime ? '#F59E0B' : 'linear-gradient(90deg, #2076C7, #1CADA3)'
                    }}
                />
            </div>

            {/* Checkout Button */}
            <button
                onClick={onCheckOut}
                disabled={!canAct}
                className={`px-8 py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all duration-300 ${canAct
                        ? 'bg-gradient-to-r from-[#1CADA3] to-[#059669] text-white shadow-[0_8px_30px_rgba(28,173,163,0.3)] hover:shadow-[0_8px_40px_rgba(28,173,163,0.5)] hover:-translate-y-0.5 active:scale-95'
                        : 'bg-white/10 text-white/40 cursor-not-allowed'
                    }`}
            >
                <LogOut size={18} />
                Check Out
            </button>

            {!canAct && (
                <p className="text-xs text-white/50 text-center mt-4">
                    📡 Verify your location to check out
                </p>
            )}
        </motion.div>
    );
}