"use client";

import React, { useRef } from 'react';
import { X, Receipt, Loader2 } from 'lucide-react';
import { useApplyReimbursement } from '@/hooks/portal-hooks/reimbursment-hooks/useApplyReimbursement';

interface ApplyReimbursementProps {
    onSuccess: () => void;
}

export default function ApplyReimbursement({ onSuccess }: ApplyReimbursementProps) {
    const { form, file, isSubmitting, handleSubmit } = useApplyReimbursement(onSuccess);
    const fileInputRef = useRef<HTMLInputElement>(null);

    return (
        <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto space-y-6">
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-6 sm:p-8 space-y-6">

                {/* Amount & Date Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                            Claim Amount (INR) <span className="text-red-500">*</span>
                        </label>
                        {/* REPLACED InputElement with standard input */}
                        <input
                            type="number"
                            placeholder="0.00"
                            value={form.amount}
                            onChange={(e) => form.setAmount(e.target.value)}
                            step="0.01"
                            min="0"
                            required
                            className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-green/20 focus:border-brand-green dark:text-white transition-all placeholder:text-gray-400"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                            Expense Date <span className="text-red-500">*</span>
                        </label>
                        {/* REPLACED InputElement with standard input */}
                        <input
                            type="date"
                            value={form.expenseDate}
                            onChange={(e) => form.setExpenseDate(e.target.value)}
                            max={new Date().toISOString().split('T')[0]}
                            required
                            className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-green/20 focus:border-brand-green dark:text-white transition-all placeholder:text-gray-400"
                        />
                    </div>
                </div>

                {/* Reason */}
                <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                        Reason for Expense <span className="text-red-500">*</span>
                    </label>
                    <textarea
                        placeholder="Brief details about what this expense covers..."
                        value={form.reason}
                        onChange={(e) => form.setReason(e.target.value)}
                        required
                        rows={3}
                        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-green/20 focus:border-brand-green dark:text-white transition-all placeholder:text-gray-400 resize-none"
                    />
                </div>

                {/* File Upload Zone */}
                <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                        Receipt Image Proof <span className="text-red-500">*</span>
                    </label>

                    <input
                        type="file"
                        accept="image/jpeg, image/png, image/webp"
                        ref={fileInputRef}
                        onChange={file.handleFileChange}
                        className="hidden"
                    />

                    {file.proofPreview ? (
                        <div className="relative w-full h-48 rounded-xl overflow-hidden border border-gray-200 shadow-sm group">
                            <img
                                src={file.proofPreview}
                                alt="Receipt Preview"
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <button
                                    type="button"
                                    onClick={file.clearFile}
                                    className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors shadow-lg flex items-center gap-2 px-4"
                                >
                                    <X className="w-4 h-4" /> Remove Image
                                </button>
                            </div>
                        </div>
                    ) : (
                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="w-full h-32 flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-brand-green/40 bg-brand-green/5 hover:bg-brand-green/10 transition-colors"
                        >
                            <Receipt className="w-6 h-6 text-brand-green" />
                            <span className="text-sm font-medium text-brand-green">
                                + Upload Receipt / Bill
                            </span>
                            <span className="text-xs text-gray-400">JPG, PNG up to 5MB</span>
                        </button>
                    )}
                </div>
            </div>

            {/* Submit Button */}
            <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 bg-brand-green hover:bg-brand-green/90 text-white font-bold rounded-xl shadow-lg shadow-brand-green/20 transition-all flex justify-center items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
                {isSubmitting ? (
                    <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Submitting...
                    </>
                ) : (
                    'Submit Claim'
                )}
            </button>
        </form>
    );
}