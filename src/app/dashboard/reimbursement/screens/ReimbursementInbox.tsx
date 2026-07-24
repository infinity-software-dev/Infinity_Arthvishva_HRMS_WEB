// src/screens/ReimbursementInbox.tsx

"use client";

import { useAdminReimbursementInbox } from "@/hooks/reimbursement-hooks/useReimbursementInbox";
import { useEffect, useState } from "react";

export default function ReimbursementInbox() {
    const {
        claims,
        rejectingId,
        rejectionReason,
        setRejectionReason,
        handleApprove,
        handleRejectSubmit,
        initiateReject,
        cancelReject,
    } = useAdminReimbursementInbox();

    const [isHr, setIsHr] = useState<boolean>(false);

    // Safely read role on client mount and store as boolean
    useEffect(() => {
        const storedRole = localStorage.getItem("role");
        setIsHr(storedRole === "HR");
    }, []);

    return (
        <div className="w-full h-full">
            {claims.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                    <p className="text-gray-400 dark:text-gray-500 text-sm font-medium">
                        Your inbox is empty. No pending claims to review.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 animate-fadeIn">
                    {claims.map((item) => {
                        const expDate = new Date(item.expenseDate).toLocaleDateString("en-IN", {
                            day: "2-digit", month: "short", year: "numeric"
                        });
                        const appliedDate = new Date(item.createdAt).toLocaleDateString("en-IN", {
                            day: "2-digit", month: "short", year: "numeric"
                        });

                        return (
                            <div
                                key={item._id}
                                className="flex flex-col md:flex-row bg-gray-50 dark:bg-black/20 border border-gray-100 dark:border-gray-800 rounded-xl overflow-hidden shadow-sm transition-all duration-200"
                            >
                                {/* Visual Image Proof section */}
                                {item.imageProofUrl && (
                                    <div className="relative w-full md:w-44 h-44 md:h-auto bg-gray-200 dark:bg-gray-800 flex-shrink-0">
                                        <img
                                            src={item.imageProofUrl}
                                            alt="Receipt Proof"
                                            className="w-full h-full object-cover"
                                        />
                                        <a
                                            href={item.imageProofUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="absolute bottom-2 left-2 px-2.5 py-1 text-xs font-semibold bg-black/70 backdrop-blur-sm text-white rounded hover:bg-black transition-colors"
                                        >
                                            Maximize ↗
                                        </a>
                                    </div>
                                )}

                                {/* Information Layout Wrapper */}
                                <div className="flex-1 p-5 flex flex-col justify-between">
                                    <div>
                                        <div className="flex items-start justify-between gap-2 mb-2">
                                            <div>
                                                <h4 className="font-bold text-gray-900 dark:text-gray-100 text-base">
                                                    {item.employee.name}
                                                </h4>
                                                <p className="text-xs text-gray-400 dark:text-gray-500 font-mono">
                                                    {item.employee.code}
                                                </p>
                                            </div>
                                            <span className="text-lg font-extrabold text-teal-600 dark:text-teal-400">
                                                ₹{item.amount.toLocaleString("en-IN")}
                                            </span>
                                        </div>

                                        <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 mb-4">
                                            {item.reason}
                                        </p>
                                    </div>

                                    {/* Actions & Dates Footer section */}
                                    <div className="mt-2 pt-3 border-t border-gray-200/60 dark:border-gray-800/60">
                                        <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-gray-400 dark:text-gray-500 mb-4">
                                            <span>Expense Date: <strong className="text-gray-600 dark:text-gray-400">{expDate}</strong></span>
                                            <span>Applied: <strong className="text-gray-600 dark:text-gray-400">{appliedDate}</strong></span>
                                        </div>

                                        {/* Conditionally Render Action Buttons for HR Only */}
                                        {isHr ? (
                                            rejectingId === item._id ? (
                                                <div className="space-y-2 animate-slideDown">
                                                    <textarea
                                                        placeholder="Provide a mandatory reason for rejecting this claim..."
                                                        value={rejectionReason}
                                                        onChange={(e) => setRejectionReason(e.target.value)}
                                                        className="w-full text-xs p-2.5 rounded-lg border border-red-200 dark:border-red-900/40 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-red-400"
                                                        rows={2}
                                                    />
                                                    <div className="flex justify-end gap-2">
                                                        <button
                                                            onClick={cancelReject}
                                                            className="px-3 py-1.5 text-xs font-medium text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                                                        >
                                                            Back
                                                        </button>
                                                        <button
                                                            onClick={() => handleRejectSubmit(item._id)}
                                                            disabled={!rejectionReason.trim()}
                                                            className="px-4 py-1.5 text-xs font-medium bg-red-500 hover:bg-red-600 text-white rounded-md disabled:opacity-40"
                                                        >
                                                            Confirm Reject
                                                        </button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        onClick={() => initiateReject(item._id)}
                                                        className="px-4 py-2 text-xs font-semibold text-red-500 border border-red-200/60 dark:border-red-900/30 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg transition-colors"
                                                    >
                                                        Reject
                                                    </button>
                                                    <button
                                                        onClick={() => handleApprove(item._id)}
                                                        className="px-5 py-2 text-xs font-semibold bg-teal-500 hover:bg-teal-600 text-white rounded-lg transition-colors shadow-sm"
                                                    >
                                                        Approve
                                                    </button>
                                                </div>
                                            )
                                        ) : (
                                            <div className="flex items-center justify-end py-1">
                                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400">
                                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                    Pending HR Review
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}