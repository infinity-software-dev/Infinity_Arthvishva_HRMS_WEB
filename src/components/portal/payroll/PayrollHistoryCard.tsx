"use client";

import React from 'react';
import { Calendar, Clock, ChevronRight, CheckCircle2 } from 'lucide-react';

interface PayrollHistoryCardProps {
    item: any;
    onPress: () => void;
}

export default function PayrollHistoryCard({ item, onPress }: PayrollHistoryCardProps) {
    const formatDate = (dateStr: string) => {
        if (!dateStr) return '';
        return new Date(dateStr).toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    };

    const getStatusBadge = (status: string) => {
        const isPaid = status?.toLowerCase() === 'paid';
        return (
            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${isPaid
                    ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20'
                    : 'bg-blue-50 text-brand-blue dark:bg-blue-500/10 dark:text-blue-400 border border-blue-200 dark:border-blue-500/20'
                }`}>
                <CheckCircle2 size={10} />
                {status || 'PROCESSED'}
            </span>
        );
    };

    return (
        <button
            type="button"
            onClick={onPress}
            className="w-full text-left bg-white dark:bg-primary border border-gray-100 dark:border-gray-800 hover:border-gray-200 dark:hover:border-gray-700 rounded-2xl p-4 sm:p-5 shadow-sm transition-all group flex flex-col justify-between gap-4"
        >
            <div className="flex items-start justify-between w-full">
                <div>
                    <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                        Net Payout
                    </span>
                    <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white tracking-tight mt-0.5">
                        ₹{Number(item.netSalary || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </h3>
                </div>
                <div className="flex items-center gap-2">
                    {getStatusBadge(item.status)}
                    <div className="w-7 h-7 rounded-full bg-gray-50 dark:bg-gray-800 flex items-center justify-center text-gray-400 group-hover:text-gray-700 dark:group-hover:text-white transition-colors">
                        <ChevronRight size={15} className="group-hover:translate-x-0.5 transition-transform" />
                    </div>
                </div>
            </div>

            <div className="pt-3 border-t border-gray-50 dark:border-gray-800/80 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 w-full">
                <div className="flex items-center gap-1.5 font-medium">
                    <Calendar size={13} className="text-gray-400" />
                    <span>{formatDate(item.fromDate)} → {formatDate(item.toDate)}</span>
                </div>
                <div className="flex items-center gap-1 px-2 py-0.5 bg-gray-50 dark:bg-gray-800 rounded-md font-semibold text-gray-700 dark:text-gray-300">
                    <Clock size={11} className="text-brand-blue dark:text-blue-400" />
                    <span>{item.paidDays} Paid Days</span>
                </div>
            </div>
        </button>
    );
}