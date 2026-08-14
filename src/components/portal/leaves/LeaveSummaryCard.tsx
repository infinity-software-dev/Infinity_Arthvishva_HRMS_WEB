import React from 'react';
import { LucideIcon } from 'lucide-react';

interface SummaryCardProps {
    title: string;
    value: string | number;
    icon: LucideIcon;
    borderClass: string;
    iconColor: string;
    loading?: boolean;
}

export default function LeaveSummaryCard({
    title,
    value,
    icon: Icon,
    borderClass,
    iconColor,
    loading
}: SummaryCardProps) {
    return (
        <div className={`bg-white dark:bg-primary border-y border-r border-l-[4px] border-gray-100 dark:border-gray-800 ${borderClass} rounded-2xl p-5 shadow-sm transition-colors relative overflow-hidden`}>
            <div className="flex items-start justify-between relative z-10">
                <div>
                    <p className="text-[10px] font-bold text-secondary dark:text-gray-400 uppercase tracking-wider mb-1">
                        {title}
                    </p>
                    {loading ? (
                        <div className="h-8 w-16 bg-gray-100 dark:bg-gray-800 animate-pulse rounded mt-1"></div>
                    ) : (
                        <h3 className="text-3xl font-black text-primary dark:text-white leading-none">
                            {value}
                        </h3>
                    )}
                </div>
                <div className={`p-2 bg-gray-50 dark:bg-gray-800/50 rounded-xl ${iconColor}`}>
                    <Icon size={18} />
                </div>
            </div>
        </div>
    );
}