"use client";

import Image from "next/image";
import { Gift, CalendarX } from "lucide-react";
import { useUpcomingBirthdays } from "@/hooks/dashboard-hooks/useUpcomingBirthdays";

export default function UpcomingBirthdays() {
    // 1. Consume business logic from the hook
    const { birthdays, loading } = useUpcomingBirthdays();

    return (
        <div className="w-full bg-white dark:bg-primary p-4 md:p-6 rounded-2xl md:rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col h-full transition-colors duration-300">

            {/* Header */}
            <div className="flex justify-between items-center mb-4 md:mb-6 shrink-0">
                <h3 className="text-base md:text-lg font-bold text-primary dark:text-white flex items-center gap-2">
                    <Gift className="w-4 h-4 md:w-5 md:h-5 text-brand-blue" />
                    Birthdays
                </h3>
                <span className="dark:bg-brand-blue/10 text-brand-blue text-[10px] md:text-xs font-bold px-2 py-1 rounded-md shrink-0">
                    This Month
                </span>
            </div>

            {/* Content Area - Added overflow-y-auto for mobile scrolling */}
            <div className="flex flex-col gap-2 md:gap-3 flex-1 pr-1 overflow-y-auto no-scrollbar">
                {loading ? (
                    // 1. LOADING STATE (Skeleton)
                    Array.from({ length: 4 }).map((_, i) => (
                        <div
                            key={i}
                            className="flex items-center justify-between p-2 md:p-3 animate-pulse"
                        >
                            <div className="flex items-center gap-2 md:gap-3">
                                <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gray-200 dark:bg-gray-700"></div>
                                <div className="flex flex-col gap-1">
                                    <div className="w-20 md:w-24 h-3 bg-gray-200 dark:bg-gray-700 rounded"></div>
                                    <div className="w-12 md:w-16 h-2 bg-gray-200 dark:bg-gray-700 rounded"></div>
                                </div>
                            </div>
                            <div className="w-10 md:w-12 h-5 md:h-6 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                        </div>
                    ))
                ) : birthdays.length === 0 ? (
                    // 2. EMPTY STATE
                    <div className="flex flex-col items-center justify-center h-full py-6 md:py-8 text-center opacity-70">
                        <div className="bg-brand-blue/10 p-3 md:p-4 rounded-full mb-2 md:mb-3 text-brand-blue">
                            <CalendarX className="w-5 h-5 md:w-6 md:h-6" />
                        </div>
                        <p className="text-xs md:text-sm font-semibold text-primary dark:text-white">
                            No Upcoming Birthdays
                        </p>
                        <p className="text-[10px] md:text-xs text-secondary dark:text-gray-400 mt-1 px-4">
                            There are no birthdays for the rest of this month.
                        </p>
                    </div>
                ) : (
                    // 3. DATA STATE
                    birthdays.map((person) => (
                        <div
                            key={person.id}
                            className={`flex items-center justify-between p-2 md:p-3 rounded-xl md:rounded-2xl transition-all duration-300 ${person.isToday
                                ? "bg-gradient-to-r from-brand-blue/10 to-brand-green/10 dark:from-brand-blue/10 dark:to-brand-green/10 border border-brand-blue/20 dark:border-brand-blue/20 shadow-sm"
                                : "hover:bg-gray-50 dark:hover:bg-white/5 border border-transparent"
                                }`}
                        >
                            <div className="flex items-center gap-2 md:gap-3 min-w-0">
                                {/* Avatar */}
                                <div className="relative w-8 h-8 md:w-10 md:h-10 rounded-full overflow-hidden border border-gray-100 dark:border-gray-700 shadow-sm shrink-0">
                                    <Image
                                        src={
                                            person.avatar ||
                                            `https://ui-avatars.com/api/?name=${encodeURIComponent(person.name)}&background=random`
                                        }
                                        alt={person.name}
                                        fill
                                        className="object-cover"
                                    />
                                </div>

                                {/* Info */}
                                <div className="flex flex-col min-w-0 pr-2">
                                    <span
                                        className={`text-xs md:text-sm font-bold truncate ${person.isToday
                                            ? "text-brand-blue"
                                            : "text-primary dark:text-white group-hover:text-brand-blue"
                                            }`}
                                    >
                                        {person.name}
                                    </span>
                                    <span className="text-[9px] md:text-[10px] lg:text-xs text-secondary dark:text-gray-400 font-medium truncate">
                                        {person.role}
                                    </span>
                                </div>
                            </div>

                            {/* Date / Action Button */}
                            <div className="flex items-center shrink-0 ml-1 md:ml-2">
                                <span className="text-[10px] md:text-xs font-bold text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-white/5 px-1.5 py-0.5 md:px-2 md:py-1 rounded-md whitespace-nowrap">
                                    {person.date}
                                </span>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}