"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, FileText, CheckCircle, Clock, AlertTriangle, CalendarDays } from 'lucide-react';

interface ViewReportModalProps {
    isOpen: boolean;
    onClose: () => void;
    reportData: any;
    dateStr: string;
}

export default function ViewReportModal({ isOpen, onClose, reportData, dateStr }: ViewReportModalProps) {
    if (!isOpen || !reportData) return null;

    const formattedDate = new Date(dateStr).toLocaleDateString('en-GB', {
        weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
    });

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[1000] flex items-center justify-center p-5 bg-slate-900/70 backdrop-blur-md">
                <motion.div
                    initial={{ scale: 0.92, opacity: 0, y: 24 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.92, opacity: 0, y: 24 }}
                    transition={{ type: 'spring', damping: 30, stiffness: 400 }}
                    className="relative bg-white dark:bg-primary rounded-3xl w-full max-w-[560px] flex flex-col shadow-2xl max-h-[92dvh] overflow-hidden"
                >
                    {/* Header */}
                    <div className="flex items-center gap-3 p-5 sm:p-6 border-b border-gray-100 dark:border-gray-800 shrink-0">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-blue to-blue-600 flex items-center justify-center shrink-0 shadow-md">
                            <FileText size={18} color="#fff" />
                        </div>
                        <div>
                            <h2 className="text-[1.12rem] font-black text-primary dark:text-white tracking-tight">End of Day Report</h2>
                            <div className="flex items-center gap-1.5 text-xs text-secondary dark:text-gray-400 mt-0.5">
                                <CalendarDays size={12} />
                                {formattedDate}
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="ml-auto w-8 h-8 rounded-lg bg-gray-50 dark:bg-gray-800 flex items-center justify-center text-gray-500 hover:text-red-500 transition-colors"
                        >
                            <X size={16} />
                        </button>
                    </div>

                    {/* Body (Scrollable) */}
                    <div className="p-5 sm:p-6 overflow-y-auto flex flex-col gap-5">

                        {/* Completed Work */}
                        <div className="flex flex-col gap-2">
                            <label className="flex items-center gap-1.5 text-xs font-bold text-secondary dark:text-gray-400">
                                <CheckCircle size={14} className="text-brand-green" /> Today's Completed Work
                            </label>
                            <div className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700/50 rounded-xl p-4 text-sm text-primary dark:text-gray-200 whitespace-pre-wrap leading-relaxed min-h-[80px]">
                                {reportData.todayWork || <span className="text-gray-400 italic">No work summary provided.</span>}
                            </div>
                        </div>

                        {/* Pending Work */}
                        <div className="flex flex-col gap-2">
                            <label className="flex items-center gap-1.5 text-xs font-bold text-secondary dark:text-gray-400">
                                <Clock size={14} className="text-brand-blue" /> Pending / Carry-over Tasks
                            </label>
                            <div className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700/50 rounded-xl p-4 text-sm text-primary dark:text-gray-200 whitespace-pre-wrap leading-relaxed">
                                {reportData.pendingWork || <span className="text-gray-400 italic">None reported.</span>}
                            </div>
                        </div>

                        {/* Blockers */}
                        <div className="flex flex-col gap-2">
                            <label className="flex items-center gap-1.5 text-xs font-bold text-secondary dark:text-gray-400">
                                <AlertTriangle size={14} className="text-amber-500" /> Blockers / Issues Faced
                            </label>
                            <div className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700/50 rounded-xl p-4 text-sm text-primary dark:text-gray-200 whitespace-pre-wrap leading-relaxed">
                                {reportData.issuesFaced || <span className="text-gray-400 italic">None reported.</span>}
                            </div>
                        </div>

                    </div>

                    {/* Footer Action */}
                    <div className="p-5 sm:p-6 border-t border-gray-100 dark:border-gray-800 shrink-0 bg-gray-50 dark:bg-gray-900/50">
                        <button
                            className="w-full py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-secondary dark:text-gray-300 rounded-xl text-sm font-bold hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-sm"
                            onClick={onClose}
                        >
                            Close Report
                        </button>
                    </div>

                </motion.div>
            </div>
        </AnimatePresence>
    );
}