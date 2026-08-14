"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    X,
    CheckCircle2,
    CloudSun,
    Calendar,
    Bed,
    Gift,
    Plane,
    CircleDashed,
    XCircle,
    Receipt,
    Building2,
    CreditCard,
    Hash,
    FileCheck2
} from 'lucide-react';

interface HistoricalPayrollModalProps {
    isOpen: boolean;
    onClose: () => void;
    slip: any | null;
}

export default function HistoricalPayrollModal({
    isOpen,
    onClose,
    slip
}: HistoricalPayrollModalProps) {
    if (!isOpen || !slip) return null;

    const formatDate = (dateString: string) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    };

    const getStatusStyle = (status: string) => {
        switch (status?.toLowerCase()) {
            case "paid":
                return "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20";
            case "processed":
                return "bg-blue-50 text-brand-blue dark:bg-blue-500/10 dark:text-blue-400 border-blue-200 dark:border-blue-500/20";
            default:
                return "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400 border-amber-200 dark:border-amber-500/20";
        }
    };

    const getBadgeStyle = (type: string) => {
        switch (type) {
            case "Present":
                return { bg: "bg-emerald-100 dark:bg-emerald-500/10", text: "text-emerald-700 dark:text-emerald-400", Icon: CheckCircle2 };
            case "HalfDay":
            case "HalfCompOff":
                return { bg: "bg-amber-100 dark:bg-amber-500/10", text: "text-amber-700 dark:text-amber-400", Icon: CloudSun };
            case "Holiday":
                return { bg: "bg-indigo-100 dark:bg-indigo-500/10", text: "text-indigo-700 dark:text-indigo-400", Icon: Calendar };
            case "WeekOff":
                return { bg: "bg-slate-100 dark:bg-slate-800", text: "text-slate-700 dark:text-slate-400", Icon: Bed };
            case "CompOff":
                return { bg: "bg-purple-100 dark:bg-purple-500/10", text: "text-purple-700 dark:text-purple-400", Icon: Gift };
            case "PaidLeave":
                return { bg: "bg-blue-100 dark:bg-blue-500/10", text: "text-blue-700 dark:text-blue-400", Icon: Plane };
            case "Absent":
            case "Sandwiched":
                return { bg: "bg-red-100 dark:bg-red-500/10", text: "text-red-700 dark:text-red-400", Icon: XCircle };
            default:
                return { bg: "bg-gray-100 dark:bg-gray-800", text: "text-gray-700 dark:text-gray-400", Icon: CircleDashed };
        }
    };

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[1000] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-sm">

                {/* Backdrop Tap Area */}
                <div className="absolute inset-0" onClick={onClose} aria-hidden="true" />

                <motion.div
                    initial={{ y: '100%', opacity: 0.5 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: '100%', opacity: 0 }}
                    transition={{ type: 'spring', damping: 30, stiffness: 350 }}
                    className="relative z-10 bg-white dark:bg-primary rounded-t-[28px] sm:rounded-3xl w-full sm:max-w-[540px] flex flex-col shadow-2xl overflow-hidden max-h-[90vh] sm:max-h-[85vh] border border-gray-100 dark:border-gray-800"
                >
                    {/* Mobile Drag Indicator */}
                    <div className="w-12 h-1.5 bg-gray-300 dark:bg-gray-700 rounded-full mx-auto mt-3 sm:hidden shrink-0" />

                    {/* Header */}
                    <div className="flex items-center justify-between px-5 pt-4 pb-4 sm:p-6 border-b border-gray-100 dark:border-gray-800 shrink-0">
                        <div>
                            <h2 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white tracking-tight">
                                Salary Statement
                            </h2>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                Official statement record
                            </p>
                        </div>
                        <button
                            onClick={onClose}
                            className="w-8 h-8 rounded-full bg-gray-50 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 flex items-center justify-center text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                        >
                            <X size={15} />
                        </button>
                    </div>

                    {/* Scrollable Content */}
                    <div className="p-4 sm:p-6 overflow-y-auto space-y-6">

                        {/* ── HEADER: NET SALARY & STATUS ── */}
                        <div className="relative bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-5 text-center flex flex-col items-center justify-center border border-gray-100 dark:border-gray-700/50">
                            {slip.status && (
                                <span className={`absolute top-3 right-3 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getStatusStyle(slip.status)}`}>
                                    {slip.status}
                                </span>
                            )}

                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
                                Net Take-Home
                            </span>
                            <h3 className="text-3xl font-black text-brand-blue dark:text-blue-400 tracking-tight mb-1">
                                ₹{Number(slip.netSalary || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                            </h3>
                            <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                                {formatDate(slip.fromDate)} → {formatDate(slip.toDate)}
                            </p>
                        </div>

                        {/* ── QUICK ATTENDANCE STATS ── */}
                        <div className="grid grid-cols-4 gap-2 sm:gap-3">
                            {[
                                { label: 'Paid Days', value: slip.paidDays ?? 0 },
                                { label: 'Present', value: slip.presentDays ?? 0 },
                                { label: 'Absent', value: slip.absentDays ?? 0 },
                                { label: 'Half Days', value: slip.halfDays ?? 0 }
                            ].map((stat, idx) => (
                                <div key={idx} className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl py-3 flex flex-col items-center justify-center">
                                    <span className="text-base sm:text-lg font-bold text-gray-900 dark:text-white leading-none">
                                        {stat.value}
                                    </span>
                                    <span className="text-[9px] sm:text-[10px] font-medium text-gray-500 dark:text-gray-400 mt-1 uppercase tracking-wider">
                                        {stat.label}
                                    </span>
                                </div>
                            ))}
                        </div>

                        {/* ── FINANCIAL SPLIT ── */}
                        <div className="flex bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-4 sm:p-5">

                            {/* Earnings Column */}
                            <div className="flex-1 pr-3 sm:pr-4">
                                <h4 className="text-[10px] font-bold text-gray-400 tracking-widest uppercase mb-3">Earnings</h4>
                                <div className="space-y-2 mb-3">
                                    <div className="flex justify-between items-center text-xs">
                                        <span className="font-medium text-gray-600 dark:text-gray-400">Basic</span>
                                        <span className="font-semibold text-gray-900 dark:text-white">₹{(slip.earnings?.basic || 0).toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-xs">
                                        <span className="font-medium text-gray-600 dark:text-gray-400">Allowances</span>
                                        <span className="font-semibold text-gray-900 dark:text-white">₹{(slip.earnings?.allowances || 0).toFixed(2)}</span>
                                    </div>
                                    {(slip.earnings?.reimbursements || 0) > 0 && (
                                        <div className="flex justify-between items-center text-xs">
                                            <span className="font-medium text-gray-600 dark:text-gray-400">Reimbursements</span>
                                            <span className="font-semibold text-emerald-600 dark:text-emerald-400">₹{(slip.earnings.reimbursements).toFixed(2)}</span>
                                        </div>
                                    )}
                                </div>
                                <div className="flex justify-between items-center text-xs pt-3 border-t border-gray-100 dark:border-gray-800">
                                    <span className="font-bold text-gray-900 dark:text-white">Gross</span>
                                    <span className="font-bold text-gray-900 dark:text-white">₹{(slip.earnings?.totalGross || 0).toFixed(2)}</span>
                                </div>
                            </div>

                            {/* Divider */}
                            <div className="w-px bg-gray-200 dark:bg-gray-800 mx-1 sm:mx-2" />

                            {/* Deductions Column */}
                            <div className="flex-1 pl-3 sm:pl-4">
                                <h4 className="text-[10px] font-bold text-gray-400 tracking-widest uppercase mb-3">Deductions</h4>
                                <div className="space-y-2 mb-3">
                                    <div className="flex justify-between items-center text-xs">
                                        <span className="font-medium text-gray-600 dark:text-gray-400">Prof. Tax</span>
                                        <span className="font-semibold text-gray-900 dark:text-white">₹{(slip.deductions?.professionalTax || 0).toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-xs">
                                        <span className="font-medium text-gray-600 dark:text-gray-400">TDS / Other</span>
                                        <span className="font-semibold text-gray-900 dark:text-white">
                                            ₹{(((slip.deductions?.taxDeductedAtSource || 0) + (slip.deductions?.other || 0))).toFixed(2)}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex justify-between items-center text-xs pt-3 border-t border-gray-100 dark:border-gray-800 mt-auto">
                                    <span className="font-bold text-gray-900 dark:text-white">Total</span>
                                    <span className="font-bold text-gray-900 dark:text-white">₹{(slip.deductions?.totalDeductions || 0).toFixed(2)}</span>
                                </div>
                            </div>

                        </div>

                        {/* ── BANK & TRANSFER DETAILS ── */}
                        {slip.employeeId && slip.employeeId.bankName && (
                            <div>
                                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2.5">
                                    Transfer Details
                                </h3>
                                <div className="bg-gray-50 dark:bg-gray-800/40 border border-gray-100 dark:border-gray-700/60 rounded-xl p-3.5 space-y-2 text-xs">
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-500 dark:text-gray-400 flex items-center gap-1.5"><Building2 size={13} /> Bank</span>
                                        <span className="font-semibold text-gray-900 dark:text-white">{slip.employeeId.bankName}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-500 dark:text-gray-400 flex items-center gap-1.5"><CreditCard size={13} /> A/C No.</span>
                                        <span className="font-semibold text-gray-900 dark:text-white">{slip.employeeId.accountNumber}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-500 dark:text-gray-400 flex items-center gap-1.5"><Hash size={13} /> IFSC</span>
                                        <span className="font-semibold text-gray-900 dark:text-white">{slip.employeeId.ifsc}</span>
                                    </div>
                                    {slip.employeeId.panNumber && (
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-500 dark:text-gray-400 flex items-center gap-1.5"><FileCheck2 size={13} /> PAN</span>
                                            <span className="font-semibold text-gray-900 dark:text-white">{slip.employeeId.panNumber}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* ── REIMBURSEMENTS AUDIT TRAIL ── */}
                        {slip.reimbursementsList && slip.reimbursementsList.length > 0 && (
                            <div>
                                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2.5">
                                    Reimbursements Processed
                                </h3>
                                <div className="space-y-2">
                                    {slip.reimbursementsList.map((item: any, index: number) => (
                                        <div key={`reimburse-${index}`} className="flex items-center justify-between p-3 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl">
                                            <div className="flex items-center gap-3 overflow-hidden">
                                                <div className="w-8 h-8 rounded-full bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center shrink-0">
                                                    <Receipt size={14} className="text-emerald-600 dark:text-emerald-400" />
                                                </div>
                                                <div className="truncate pr-2">
                                                    <p className="text-xs font-semibold text-gray-900 dark:text-white">{formatDate(item.expenseDate)}</p>
                                                    <p className="text-[11px] text-gray-500 dark:text-gray-400 truncate">{item.reason}</p>
                                                </div>
                                            </div>
                                            <span className="text-sm font-bold text-gray-900 dark:text-white shrink-0">+₹{item.amount}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* ── PAID DAYS AUDIT TRAIL ── */}
                        {slip.paidDaysBreakdown && slip.paidDaysBreakdown.length > 0 && (
                            <div>
                                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2.5">
                                    Attendance Breakdown
                                </h3>
                                <div className="divide-y divide-gray-100 dark:divide-gray-800/60 border-t border-b border-gray-100 dark:border-gray-800/60">
                                    {slip.paidDaysBreakdown.map((item: any, index: number) => {
                                        const style = getBadgeStyle(item.type);
                                        const Icon = style.Icon;

                                        return (
                                            <div key={index} className="flex items-center justify-between py-2.5">
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-7 h-7 rounded-full flex items-center justify-center ${style.bg}`}>
                                                        <Icon size={14} className={style.text} />
                                                    </div>
                                                    <span className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-white">
                                                        {formatDate(item.date)}
                                                    </span>
                                                </div>

                                                <div className="flex items-center gap-3">
                                                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wide ${style.bg} ${style.text}`}>
                                                        {item.type}
                                                    </span>
                                                    <span className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white w-8 text-right">
                                                        +{item.value}
                                                    </span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}