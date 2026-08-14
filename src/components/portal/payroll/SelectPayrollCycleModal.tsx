"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronRight, CalendarDays, Check } from 'lucide-react';
import { PayrollCycle } from '@/utils/payrollCycles';

interface SelectPayrollCycleModalProps {
    isOpen: boolean;
    onClose: () => void;
    cycles: PayrollCycle[];
    selectedStartDate: string;
    selectedEndDate: string;
    onSelect: (cycle: PayrollCycle) => void;
}

export default function SelectPayrollCycleModal({
    isOpen,
    onClose,
    cycles,
    selectedStartDate,
    selectedEndDate,
    onSelect
}: SelectPayrollCycleModalProps) {
    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[1000] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-sm">

                {/* Backdrop Tap Area */}
                <div
                    className="absolute inset-0"
                    onClick={onClose}
                    aria-hidden="true"
                />

                <motion.div
                    initial={{ y: '100%', opacity: 0.5 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: '100%', opacity: 0 }}
                    transition={{ type: 'spring', damping: 30, stiffness: 350 }}
                    className="relative z-10 bg-white dark:bg-primary rounded-t-[28px] sm:rounded-3xl w-full sm:max-w-[460px] flex flex-col shadow-2xl overflow-hidden max-h-[85vh] sm:max-h-[80vh] border border-gray-100 dark:border-gray-800"
                >
                    {/* Mobile Drag Indicator */}
                    <div className="w-12 h-1.5 bg-gray-300 dark:bg-gray-700 rounded-full mx-auto mt-3 sm:hidden shrink-0" />

                    {/* Header */}
                    <div className="flex items-center justify-between px-5 pt-4 pb-4 sm:p-6 border-b border-gray-100 dark:border-gray-800 shrink-0">
                        <div>
                            <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white tracking-tight leading-none">
                                Select Payroll Cycle
                            </h2>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                21st to 20th recurring statement periods
                            </p>
                        </div>
                        <button
                            onClick={onClose}
                            className="w-8 h-8 rounded-full bg-gray-50 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 flex items-center justify-center text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                        >
                            <X size={15} />
                        </button>
                    </div>

                    {/* Cycles List */}
                    <div className="p-3 sm:p-4 overflow-y-auto space-y-2 divide-y divide-transparent">
                        {cycles.map((cycle, idx) => {
                            const isSelected =
                                cycle.startDate === selectedStartDate && cycle.endDate === selectedEndDate;

                            return (
                                <button
                                    key={idx}
                                    type="button"
                                    onClick={() => onSelect(cycle)}
                                    className={`w-full p-3.5 sm:p-4 rounded-2xl border text-left transition-all flex items-center justify-between group active:scale-[0.99] ${isSelected
                                            ? 'bg-blue-50/60 dark:bg-blue-500/10 border-brand-blue/40 dark:border-blue-500/30'
                                            : 'bg-white dark:bg-gray-800/40 border-gray-100 dark:border-gray-700/60 hover:bg-gray-50/80 dark:hover:bg-gray-800/80'
                                        }`}
                                >
                                    <div className="flex items-center gap-3.5 min-w-0">
                                        <div
                                            className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-colors ${isSelected
                                                    ? 'bg-brand-blue text-white shadow-sm shadow-brand-blue/30'
                                                    : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                                                }`}
                                        >
                                            <CalendarDays size={16} />
                                        </div>

                                        <div className="min-w-0">
                                            <h4 className={`text-sm font-semibold truncate ${isSelected
                                                    ? 'text-brand-blue dark:text-blue-400'
                                                    : 'text-gray-900 dark:text-white'
                                                }`}>
                                                {cycle.label}
                                            </h4>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 truncate">
                                                {cycle.formattedRange}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="pl-3 shrink-0">
                                        {isSelected ? (
                                            <div className="w-5 h-5 rounded-full bg-brand-blue text-white flex items-center justify-center shadow-sm">
                                                <Check size={12} strokeWidth={2.5} />
                                            </div>
                                        ) : (
                                            <ChevronRight
                                                size={16}
                                                className="text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-200 transition-transform group-hover:translate-x-0.5"
                                            />
                                        )}
                                    </div>
                                </button>
                            );
                        })}
                    </div>

                    {/* Mobile Bottom Spacer */}
                    <div className="h-4 sm:hidden shrink-0" />
                </motion.div>
            </div>
        </AnimatePresence>
    );
}