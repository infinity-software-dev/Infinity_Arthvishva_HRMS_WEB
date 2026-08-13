"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Edit3, AlertCircle, Link as LinkIcon, Send, Loader2, XCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { portalAttendanceService } from '@/services/employeeProtalServices/employee.attendance.service';

interface RequestCorrectionModalProps {
    isOpen: boolean;
    onClose: () => void;
    record: any; // The attendance row object
    onSuccess: () => void;
}

export default function RequestCorrectionModal({ isOpen, onClose, record, onSuccess }: RequestCorrectionModalProps) {
    const [inTime, setInTime] = useState('09:30');
    const [outTime, setOutTime] = useState('18:30');
    const [reason, setReason] = useState('');
    const [proofUrl, setProofUrl] = useState('');
    const [submitting, setSubmitting] = useState(false);

    // 1. Extract Rejection Info & Previous Active Request (if any)
    const attendanceData = record?.myAttendance;
    const activeRequest = attendanceData?.activeCorrectionRequest;

    // Find the latest 'Rejected' history entry
    const rejectionEntry = attendanceData?.correctionHistory
        ?.slice()
        ?.reverse()
        ?.find((item: any) => item.action === 'Rejected');

    const isRejectedState = attendanceData?.correctionStatus === 'Rejected' || Boolean(rejectionEntry);

    // 2. Pre-fill form fields (Prioritizes previous requested values if rejected)
    useEffect(() => {
        if (!attendanceData) return;

        // Check if we have proposed times from the active/previous request
        const proposedIn = activeRequest?.requestedInTime || attendanceData.inTime;
        const proposedOut = activeRequest?.requestedOutTime || attendanceData.outTime;

        if (proposedIn) {
            const d = new Date(proposedIn);
            setInTime(`${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`);
        }
        if (proposedOut) {
            const d = new Date(proposedOut);
            setOutTime(`${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`);
        }

        if (activeRequest?.reason) setReason(activeRequest.reason);
        if (activeRequest?.proofUrl) setProofUrl(activeRequest.proofUrl);
    }, [record, attendanceData, activeRequest]);

    if (!isOpen || !record) return null;

    const formattedDate = new Date(record.date).toLocaleDateString('en-GB', {
        day: 'numeric', month: 'long', year: 'numeric'
    });

    const handleSubmit = async () => {
        if (!reason.trim()) {
            toast.error("Please provide a valid reason for correction.");
            return;
        }

        if (!attendanceData?._id) {
            toast.error("Attendance record ID not found.");
            return;
        }

        setSubmitting(true);

        try {
            const baseDateStr = record.date; // "YYYY-MM-DD"
            const requestedInISO = new Date(`${baseDateStr}T${inTime}:00`).toISOString();
            const requestedOutISO = new Date(`${baseDateStr}T${outTime}:00`).toISOString();

            const payload = {
                requestedInTime: requestedInISO,
                requestedOutTime: requestedOutISO,
                reason: reason.trim(),
                proofUrl: proofUrl.trim() || undefined
            };

            await portalAttendanceService.requestCorrection(attendanceData._id, payload);

            toast.success("Correction request submitted for approval! 🚀");
            onSuccess();
            onClose();
        } catch (err: any) {
            toast.error(err.message);
        } finally {
            setSubmitting(false);
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
                    className="relative bg-white dark:bg-primary rounded-3xl w-full max-w-[500px] flex flex-col shadow-2xl overflow-hidden max-h-[92dvh]"
                >
                    {/* Header */}
                    <div className="flex items-center gap-3 p-5 sm:p-6 border-b border-gray-100 dark:border-gray-800 shrink-0">
                        <div className="w-10 h-10 rounded-xl bg-brand-blue flex items-center justify-center shrink-0 shadow-md shadow-brand-blue/20">
                            <Edit3 size={18} color="#fff" />
                        </div>
                        <div>
                            <h2 className="text-lg font-black text-primary dark:text-white tracking-tight">Request Correction</h2>
                            <p className="text-xs font-bold text-secondary dark:text-gray-400 mt-0.5">{formattedDate}</p>
                        </div>
                        <button
                            onClick={onClose}
                            className="ml-auto w-8 h-8 rounded-lg bg-gray-50 dark:bg-gray-800 flex items-center justify-center text-gray-500 hover:text-red-500 transition-colors"
                        >
                            <X size={16} />
                        </button>
                    </div>

                    {/* Body */}
                    <div className="p-5 sm:p-6 overflow-y-auto flex flex-col gap-5">

                        {/* 🔴 REJECTION REASON BANNER (Rendered if previous request was rejected) */}
                        {isRejectedState && rejectionEntry && (
                            <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-2xl p-4 flex flex-col gap-2">
                                <div className="flex items-center gap-2 text-red-700 dark:text-red-400 font-bold text-xs uppercase tracking-wider">
                                    <XCircle size={16} className="shrink-0" />
                                    <span>Previous Request Rejected</span>
                                </div>
                                {rejectionEntry.remark && (
                                    <p className="text-xs text-red-900 dark:text-red-200 font-semibold pl-6 leading-relaxed">
                                        <span className="text-red-600 dark:text-red-400 font-bold">Manager Remark:</span> "{rejectionEntry.remark}"
                                    </p>
                                )}
                                {rejectionEntry.timestamp && (
                                    <p className="text-[10px] text-red-500/80 dark:text-red-400/60 pl-6 font-medium">
                                        Rejected on: {new Date(rejectionEntry.timestamp).toLocaleString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                )}
                            </div>
                        )}

                        {/* Time Pickers Grid */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex flex-col gap-1.5">
                                <label className="text-[11px] font-bold text-secondary dark:text-gray-400 uppercase tracking-wider">
                                    Correct In-Time
                                </label>
                                <div className="relative flex items-center">
                                    <input
                                        type="time"
                                        value={inTime}
                                        onChange={(e) => setInTime(e.target.value)}
                                        className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2.5 text-sm font-bold text-primary dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-blue/30 focus:border-brand-blue transition-all"
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <label className="text-[11px] font-bold text-secondary dark:text-gray-400 uppercase tracking-wider">
                                    Correct Out-Time
                                </label>
                                <div className="relative flex items-center">
                                    <input
                                        type="time"
                                        value={outTime}
                                        onChange={(e) => setOutTime(e.target.value)}
                                        className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2.5 text-sm font-bold text-primary dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-blue/30 focus:border-brand-blue transition-all"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Reason */}
                        <div className="flex flex-col gap-1.5">
                            <label className="text-[11px] font-bold text-secondary dark:text-gray-400 uppercase tracking-wider">
                                Reason for Correction <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                rows={3}
                                value={reason}
                                onChange={(e) => setReason(e.target.value)}
                                placeholder="Please provide a valid reason..."
                                className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl p-3 text-sm text-primary dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-blue/30 focus:border-brand-blue resize-none transition-all placeholder:text-gray-400 dark:placeholder:text-gray-600"
                            />
                        </div>

                        {/* Supporting Proof */}
                        <div className="flex flex-col gap-1.5">
                            <label className="text-[11px] font-bold text-secondary dark:text-gray-400 uppercase tracking-wider">
                                Supporting Proof (URL)
                            </label>
                            <div className="relative flex items-center">
                                <input
                                    type="url"
                                    value={proofUrl}
                                    onChange={(e) => setProofUrl(e.target.value)}
                                    placeholder="Link to document or image"
                                    className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl pl-3 pr-9 py-2.5 text-sm text-primary dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-blue/30 focus:border-brand-blue transition-all placeholder:text-gray-400 dark:placeholder:text-gray-600"
                                />
                                <LinkIcon size={16} className="absolute right-3 text-gray-400 pointer-events-none" />
                            </div>
                        </div>

                        {/* Warning Banner */}
                        <div className="bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 rounded-xl p-3 flex items-start gap-2.5">
                            <AlertCircle size={16} className="text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                            <p className="text-xs text-amber-800 dark:text-amber-300 font-medium leading-relaxed">
                                Correction requests are subject to manager approval and may take 1–2 business days.
                            </p>
                        </div>

                    </div>

                    {/* Footer Actions */}
                    <div className="p-5 sm:p-6 border-t border-gray-100 dark:border-gray-800 flex items-center gap-3 shrink-0 bg-gray-50 dark:bg-gray-900/50">
                        <button
                            onClick={onClose}
                            disabled={submitting}
                            className="flex-1 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-secondary dark:text-gray-300 rounded-xl text-sm font-bold hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={submitting}
                            className="flex-1 py-3 bg-brand-blue hover:bg-blue-700 text-white rounded-xl text-sm font-bold shadow-md shadow-brand-blue/20 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {submitting ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                            {isRejectedState ? 'Re-submit Request' : 'Submit Request'}
                        </button>
                    </div>

                </motion.div>
            </div>
        </AnimatePresence>
    );
}