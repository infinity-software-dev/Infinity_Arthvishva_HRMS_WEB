"use client";

import { PendingCorrectionItem } from "@/hooks/attendance-hooks/usePendingCorrections";
import { useEffect, useState } from "react";

interface CorrectionCardProps {
    req: PendingCorrectionItem;
    isHistory?: boolean; // If true, shows resolution badges.
    onApprove?: (id: string) => void;
    onReject?: (id: string) => void;
}

export default function CorrectionCard({
    req,
    isHistory = false,
    onApprove,
    onReject,
}: CorrectionCardProps) {
    const [role, setRole] = useState<string | null>(null);

    // Safely read role on client mount
    useEffect(() => {
        const storedRole = localStorage.getItem("role");
        setRole(storedRole);
    }, []);

    // Shared time formatter
    const formatTime = (isoString?: string) => {
        if (!isoString) return "--:--";
        return new Date(isoString).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    return (
        <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
            {/* Header: Employee Info */}
            <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 font-bold overflow-hidden shrink-0">
                        {req.avatar ? (
                            <img
                                src={req.avatar}
                                alt={req.employeeName}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            req.employeeName.charAt(0)
                        )}
                    </div>
                    <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white leading-tight">
                            {req.employeeName}
                        </h3>
                        <p className="text-xs text-gray-500">
                            {req.employeeCode} • {req.department}
                        </p>
                    </div>
                </div>
                <span className="text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2.5 py-1 rounded-md">
                    {req.date}
                </span>
            </div>

            {/* Body: Time Comparison */}
            <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
                <div className="bg-gray-50 dark:bg-gray-900/50 p-3 rounded-xl border border-gray-100 dark:border-gray-800">
                    <p className="text-xs text-gray-400 mb-1 font-medium uppercase tracking-wider">
                        Original
                    </p>
                    <div className="flex justify-between items-center text-gray-600 dark:text-gray-300">
                        <span>In: {formatTime(req.originalInTime)}</span>
                    </div>
                    <div className="flex justify-between items-center text-gray-600 dark:text-gray-300">
                        <span>Out: {formatTime(req.originalOutTime)}</span>
                    </div>
                </div>
                <div className="bg-primary/5 dark:bg-primary/10 p-3 rounded-xl border border-primary/10">
                    <p className="text-xs text-primary dark:text-white mb-1 font-medium uppercase tracking-wider">
                        Requested
                    </p>
                    <div className="flex justify-between items-center font-medium text-gray-900 dark:text-white">
                        <span>In: {formatTime(req.requestedInTime)}</span>
                    </div>
                    <div className="flex justify-between items-center font-medium text-gray-900 dark:text-white">
                        <span>Out: {formatTime(req.requestedOutTime)}</span>
                    </div>
                </div>
            </div>

            {/* Reason */}
            <div className="mb-6">
                <p className="text-xs text-gray-500 font-medium mb-1">REASON</p>
                <p className="text-sm text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700/30 p-3 rounded-lg italic">
                    "{req.reason}"
                </p>
                {req.proofUrl && (
                    <a
                        href={req.proofUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-primary hover:underline mt-2 inline-block font-medium"
                    >
                        📎 View Attached Proof
                    </a>
                )}
            </div>

            {/* Footer: Dynamic Actions based on isHistory & HR Role */}
            <div className="pt-4 border-t border-gray-100 dark:border-gray-700">
                {!isHistory ? (
                    role === "HR" ? (
                        /* Show Action Buttons ONLY for HR */
                        <div className="flex gap-3">
                            <button
                                onClick={() => onReject && onReject(req.attendanceId)}
                                className="flex-1 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 dark:bg-red-500/10 dark:hover:bg-red-500/20 rounded-lg transition-colors"
                            >
                                Reject
                            </button>
                            <button
                                onClick={() => onApprove && onApprove(req.attendanceId)}
                                className="flex-1 py-2 text-sm font-medium text-white bg-gradient-to-r from-brand-blue to-brand-green rounded-lg transition-colors shadow-sm shadow-primary/30"
                            >
                                Approve
                            </button>
                        </div>
                    ) : (
                        /* Non-HR status badge for pending requests */
                        <div className="flex justify-center items-center py-2">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400">
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Pending HR Approval
                            </span>
                        </div>
                    )
                ) : (
                    /* History Status Badges */
                    <div className="flex justify-center items-center py-2">
                        {req.resolutionStatus === "Approved" ? (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400">
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                </svg>
                                Approved on {req.date}
                            </span>
                        ) : (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400">
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                                Rejected on {req.date}
                            </span>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}