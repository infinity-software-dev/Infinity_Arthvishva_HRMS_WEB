"use client";

import React from 'react';
import { Loader2, Receipt } from 'lucide-react';
import ReimbursementCard from '@/components/portal/reimbursment/ReimbursementCard';
import { useReimbursementHistory } from '@/hooks/portal-hooks/reimbursment-hooks/useReimbursementHistory';

export default function ReimbursementHistory() {
    const { claims, isLoading, handleCancel } = useReimbursementHistory();

    if (isLoading) {
        return (
            <div className="w-full h-64 flex justify-center items-center">
                <Loader2 className="w-8 h-8 animate-spin text-brand-blue" />
            </div>
        );
    }

    if (claims.length === 0) {
        return (
            <div className="w-full h-80 flex flex-col justify-center items-center bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4">
                    <Receipt className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-gray-900 font-bold text-lg">No Reimbursements Yet</h3>
                <p className="text-gray-500 text-sm mt-1">Your expense claim history will appear here.</p>
            </div>
        );
    }

    return (
        <div className="w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {claims.map((claim) => (
                    <ReimbursementCard
                        key={claim._id}
                        claim={claim}
                        onCancel={handleCancel}
                    />
                ))}
            </div>
        </div>
    );
}