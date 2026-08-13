"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, CheckCircle, Clock, AlertTriangle, Users, UserCircle, X, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

interface CheckOutReportModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (reportData: any) => void;
    managers: any[];
    isLoading: boolean;
}

export default function CheckOutReportModal({ isOpen, onClose, onSubmit, managers, isLoading }: CheckOutReportModalProps) {
    const [reportData, setReportData] = useState({
        todayWork: '',
        pendingWork: '',
        issuesFaced: '',
        reportParticipant: '',
    });

    const handleSubmit = () => {
        if (!reportData.todayWork.trim()) {
            toast.error("Please describe today's completed work.");
            return;
        }
        if (managers.length > 0 && !reportData.reportParticipant) {
            toast.error("Please select a manager to share the report with.");
            return;
        }
        onSubmit(reportData);
    };

    const toggleParticipant = (id: string) => {
        setReportData(prev => ({
            ...prev,
            reportParticipant: prev.reportParticipant === id ? '' : id,
        }));
    };

    if (!isOpen) return null;

    return (
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
                        <Send size={18} color="#fff" />
                    </div>
                    <div>
                        <h2 className="text-[1.12rem] font-black text-primary dark:text-white tracking-tight">Check-out Report</h2>
                        <p className="text-xs text-secondary dark:text-gray-400 mt-0.5">Complete your daily EOD before leaving</p>
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

                    <div className="flex flex-col gap-1.5">
                        <label className="flex items-center gap-1.5 text-xs font-bold text-secondary dark:text-gray-400">
                            <CheckCircle size={14} className="text-brand-green" /> Today's Completed Work <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl p-3 text-sm text-primary dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-blue/30 focus:border-brand-blue resize-none transition-all placeholder:text-gray-400 dark:placeholder:text-gray-600"
                            placeholder="What specific tasks did you complete today?"
                            rows={3}
                            value={reportData.todayWork}
                            onChange={(e) => setReportData({ ...reportData, todayWork: e.target.value })}
                        />
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="flex items-center gap-1.5 text-xs font-bold text-secondary dark:text-gray-400">
                            <Clock size={14} className="text-brand-blue" /> Pending / Carry-over Tasks
                        </label>
                        <textarea
                            className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl p-3 text-sm text-primary dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-blue/30 focus:border-brand-blue resize-none transition-all placeholder:text-gray-400 dark:placeholder:text-gray-600"
                            placeholder="Any tasks to carry forward to tomorrow?"
                            rows={2}
                            value={reportData.pendingWork}
                            onChange={(e) => setReportData({ ...reportData, pendingWork: e.target.value })}
                        />
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="flex items-center gap-1.5 text-xs font-bold text-secondary dark:text-gray-400">
                            <AlertTriangle size={14} className="text-amber-500" /> Blockers / Issues Faced
                        </label>
                        <textarea
                            className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl p-3 text-sm text-primary dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-blue/30 focus:border-brand-blue resize-none transition-all placeholder:text-gray-400 dark:placeholder:text-gray-600"
                            placeholder="Any blockers, challenges, or escalations?"
                            rows={2}
                            value={reportData.issuesFaced}
                            onChange={(e) => setReportData({ ...reportData, issuesFaced: e.target.value })}
                        />
                    </div>

                    {managers.length > 0 && (
                        <div className="flex flex-col gap-2">
                            <label className="flex items-center gap-1.5 text-xs font-bold text-secondary dark:text-gray-400 mb-1">
                                <Users size={14} className="text-brand-blue" /> Share Report With <span className="text-red-500">*</span>
                            </label>
                            <div className="flex flex-wrap gap-2 p-3 bg-gray-50 dark:bg-gray-800/30 border border-gray-200 dark:border-gray-800 rounded-xl">
                                {managers.map(emp => {
                                    const isSelected = reportData.reportParticipant === emp._id;
                                    return (
                                        <button
                                            key={emp._id}
                                            onClick={() => toggleParticipant(emp._id)}
                                            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${isSelected
                                                    ? 'bg-brand-blue text-white border-brand-blue shadow-md'
                                                    : 'bg-white dark:bg-primary text-secondary dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:border-brand-blue hover:text-brand-blue'
                                                }`}
                                        >
                                            <UserCircle size={14} />
                                            {emp.name}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer Actions */}
                <div className="p-5 sm:p-6 border-t border-gray-100 dark:border-gray-800 flex flex-col-reverse sm:flex-row gap-3 shrink-0 bg-gray-50 dark:bg-gray-900/50">
                    <button
                        className="flex-1 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-secondary dark:text-gray-300 rounded-xl text-sm font-bold hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                        onClick={onClose}
                    >
                        Cancel
                    </button>
                    <button
                        className="flex-1 py-3 bg-brand-blue text-white rounded-xl text-sm font-bold shadow-md shadow-brand-blue/20 hover:bg-blue-700 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                        onClick={handleSubmit}
                        disabled={isLoading}
                    >
                        {isLoading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                        Submit & Check Out
                    </button>
                </div>

            </motion.div>
        </div>
    );
}