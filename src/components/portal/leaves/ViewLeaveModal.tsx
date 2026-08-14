"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Clock, CheckCircle2, XCircle, AlertCircle, Trash2, Loader2, User } from 'lucide-react';
import toast from 'react-hot-toast';
import { portalLeaveService } from '@/services/employeeProtalServices/employee.leave.service';

interface ViewLeaveModalProps {
    isOpen: boolean;
    onClose: () => void;
    leave: any;
    onCancelComplete?: () => void;
}

export default function ViewLeaveModal({ isOpen, onClose, leave, onCancelComplete }: ViewLeaveModalProps) {
    const [isCancelling, setIsCancelling] = useState(false);

    if (!isOpen || !leave) return null;

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('en-GB', {
            day: 'numeric', month: 'short', year: 'numeric'
        });
    };

    const formatDateTime = (dateStr: string) => {
        return new Date(dateStr).toLocaleString('en-GB', {
            day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
        });
    };

    const getStatusPill = (status: string) => {
        switch (status) {
            case 'Approved': return <span className="px-3 py-1 bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20 rounded-full text-[11px] font-bold uppercase tracking-wider flex items-center gap-1"><CheckCircle2 size={12} /> Approved</span>;
            case 'Pending': return <span className="px-3 py-1 bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400 border border-amber-200 dark:border-amber-500/20 rounded-full text-[11px] font-bold uppercase tracking-wider flex items-center gap-1"><Clock size={12} /> Pending</span>;
            case 'Rejected': return <span className="px-3 py-1 bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400 border border-red-200 dark:border-red-500/20 rounded-full text-[11px] font-bold uppercase tracking-wider flex items-center gap-1"><XCircle size={12} /> Rejected</span>;
            case 'Cancelled': return <span className="px-3 py-1 bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400 border border-gray-200 dark:border-gray-700 rounded-full text-[11px] font-bold uppercase tracking-wider flex items-center gap-1"><AlertCircle size={12} /> Cancelled</span>;
            default: return null;
        }
    };

    const canCancel = leave.overallStatus === 'Pending' ||
        (leave.overallStatus === 'Approved' && new Date(leave.startDate) > new Date());

    const handleCancel = async () => {
        const confirmMsg = window.confirm("Are you sure you want to cancel this leave application?");
        if (!confirmMsg) return;

        setIsCancelling(true);
        try {
            await portalLeaveService.cancelLeave(leave._id);
            toast.success("Leave cancelled successfully.");
            if (onCancelComplete) onCancelComplete();
            onClose();
        } catch (error: any) {
            toast.error(error.message || "Failed to cancel leave.");
        } finally {
            setIsCancelling(false);
        }
    };

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[1000] flex items-center justify-center p-5 bg-slate-900/70 backdrop-blur-md">
                <motion.div
                    initial={{ scale: 0.92, opacity: 0, y: 24 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.92, opacity: 0, y: 24 }}
                    transition={{ type: 'spring', damping: 30, stiffness: 400 }}
                    className="relative bg-white dark:bg-primary rounded-3xl w-full max-w-[600px] flex flex-col shadow-2xl overflow-hidden max-h-[92dvh]"
                >
                    {/* Header */}
                    <div className="flex items-center justify-between p-5 sm:p-6 border-b border-gray-100 dark:border-gray-800 shrink-0 bg-gray-50/50 dark:bg-gray-800/20">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-brand-blue flex items-center justify-center shadow-md shadow-brand-blue/20">
                                <Calendar size={20} color="#fff" />
                            </div>
                            <div>
                                <h2 className="text-xl font-black text-primary dark:text-white tracking-tight leading-none mb-1.5">
                                    {leave.leaveCategory} Leave
                                </h2>
                                {getStatusPill(leave.overallStatus)}
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                        >
                            <X size={16} />
                        </button>
                    </div>

                    {/* Body */}
                    <div className="p-5 sm:p-6 overflow-y-auto flex flex-col gap-6">

                        {/* Dates & Duration Box */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700/50 rounded-2xl p-4 flex flex-col items-center justify-center text-center">
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Duration</span>
                                <span className="text-xl font-black text-primary dark:text-white">
                                    {formatDate(leave.startDate)}
                                </span>
                                {leave.startDate !== leave.endDate && (
                                    <span className="text-sm font-bold text-secondary dark:text-gray-400 mt-0.5">
                                        to {formatDate(leave.endDate)}
                                    </span>
                                )}
                            </div>
                            <div className="bg-blue-50 dark:bg-blue-500/5 border border-blue-100 dark:border-blue-500/10 rounded-2xl p-4 flex flex-col items-center justify-center text-center">
                                <span className="text-[10px] font-bold text-blue-400 dark:text-blue-500 uppercase tracking-wider mb-1">Total Days</span>
                                <span className="text-2xl font-black text-brand-blue dark:text-blue-400">
                                    {leave.totalDays}
                                </span>
                                {leave.isHalfDay && (
                                    <span className="text-[10px] font-bold bg-brand-blue text-white px-2 py-0.5 rounded mt-1 uppercase tracking-wider">
                                        Half Day ({leave.halfDayPeriod})
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Reason */}
                        <div>
                            <h4 className="text-[11px] font-bold text-secondary dark:text-gray-400 uppercase tracking-wider mb-2">Reason for Leave</h4>
                            <div className="bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700/50 rounded-xl p-4 text-sm font-medium text-primary dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                                {leave.reason}
                            </div>
                        </div>

                        {/* Workflow Timeline */}
                        <div>
                            <h4 className="text-[11px] font-bold text-secondary dark:text-gray-400 uppercase tracking-wider mb-4">Approval Workflow</h4>
                            <div className="space-y-0 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-200 dark:before:via-gray-700 before:to-transparent">

                                {leave.workflowSteps?.map((step: any, index: number) => {

                                    // LOGIC: If the overall leave is rejected/cancelled, but this specific step is "Pending",
                                    // it means this step was never reached. We should visually dim it.
                                    const isDeadStep = (leave.overallStatus === 'Rejected' || leave.overallStatus === 'Cancelled') && step.status === 'Pending';

                                    const isApproved = step.status === 'Approved';
                                    const isRejected = step.status === 'Rejected';

                                    // Determine Step Name based on boolean flags
                                    const stepName = step.isHRProfileStep ? 'HR Approval' :
                                        step.isDirectorProfileStep ? 'Director Approval' :
                                            'Manager Approval';

                                    return (
                                        <div key={index} className={`relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group transition-opacity ${isDeadStep ? 'opacity-40' : 'opacity-100'}`}>

                                            {/* Timeline Icon */}
                                            <div className={`flex items-center justify-center w-10 h-10 rounded-full border-4 border-white dark:border-primary shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm z-10 ${isApproved ? 'bg-emerald-500 text-white' :
                                                    isRejected ? 'bg-red-500 text-white' :
                                                        'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                                                }`}>
                                                {isApproved ? <CheckCircle2 size={16} /> :
                                                    isRejected ? <XCircle size={16} /> :
                                                        isDeadStep ? <X size={16} /> : <Clock size={16} />}
                                            </div>

                                            {/* Card Content */}
                                            <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-800/50 shadow-sm mb-4">
                                                <div className="flex items-center justify-between mb-1">
                                                    <span className="text-xs font-bold text-primary dark:text-white uppercase tracking-wider">
                                                        Step {index + 1}
                                                    </span>
                                                    <span className={`text-[10px] font-bold uppercase tracking-wider ${isApproved ? 'text-emerald-500' :
                                                            isRejected ? 'text-red-500' :
                                                                isDeadStep ? 'text-gray-500' : 'text-amber-500'
                                                        }`}>
                                                        {isDeadStep ? 'Skipped' : step.status}
                                                    </span>
                                                </div>

                                                <p className="text-[11px] font-semibold text-secondary dark:text-gray-400 mb-2 flex items-center gap-1.5">
                                                    <User size={12} /> {stepName}
                                                </p>

                                                {step.remarks && (
                                                    <p className="text-xs text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-900/50 p-2 rounded-lg border border-gray-100 dark:border-gray-700/50 italic mb-2">
                                                        "{step.remarks}"
                                                    </p>
                                                )}

                                                {step.actedAt && (
                                                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">
                                                        {formatDateTime(step.actedAt)}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}

                            </div>
                        </div>

                    </div>

                    {/* Footer Actions (Cancellation) */}
                    {canCancel && (
                        <div className="p-5 sm:p-6 border-t border-gray-100 dark:border-gray-800 flex items-center gap-3 shrink-0 bg-gray-50 dark:bg-gray-900/50">
                            <button
                                onClick={handleCancel}
                                disabled={isCancelling}
                                className="w-full py-3 bg-white dark:bg-gray-800 border border-red-200 dark:border-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 disabled:opacity-70 shadow-sm"
                            >
                                {isCancelling ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                                Cancel Leave Request
                            </button>
                        </div>
                    )}

                </motion.div>
            </div>
        </AnimatePresence>
    );
}