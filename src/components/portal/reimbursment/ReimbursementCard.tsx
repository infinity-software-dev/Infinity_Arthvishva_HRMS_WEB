import React from 'react';
import { ExternalLink, Calendar, Clock, ReceiptText } from 'lucide-react';
import { ReimbursementClaim } from '@/services/employeeProtalServices/employee.reimbursement.service';

interface ReimbursementCardProps {
    claim: ReimbursementClaim;
    onCancel: (id: string) => void;
}

export default function ReimbursementCard({ claim, onCancel }: ReimbursementCardProps) {
    // Format Date helpers
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            day: '2-digit', month: 'short', year: 'numeric'
        });
    };

    const formatDateTime = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            day: '2-digit', month: 'short', year: 'numeric',
            hour: '2-digit', minute: '2-digit'
        });
    };

    // Status Color Mapping
    const statusColors = {
        Pending: 'bg-amber-100 text-amber-700 border-amber-200',
        Approved: 'bg-emerald-100 text-emerald-700 border-emerald-200',
        Rejected: 'bg-red-100 text-red-700 border-red-200',
    };

    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col transition-all hover:shadow-md">

            {/* Header: Amount & Status */}
            <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold text-gray-900">
                    ₹ {claim.amount.toFixed(2)}
                </h3>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${statusColors[claim.hrStatus]}`}>
                    {claim.hrStatus}
                </span>
            </div>

            {/* Reason */}
            <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                {claim.reason}
            </p>

            {/* View Receipt Link (Opens in new tab) */}
            {claim.imageProofUrl && (
                <a
                    href={claim.imageProofUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-brand-blue hover:text-blue-700 text-sm font-medium mb-5 w-max transition-colors"
                >
                    <ReceiptText className="w-4 h-4" />
                    View Uploaded Receipt
                    <ExternalLink className="w-3 h-3 ml-0.5" />
                </a>
            )}

            {/* Footer: Dates & Actions */}
            <div className="mt-auto pt-4 border-t border-gray-100 space-y-3">
                <div className="flex flex-col gap-1.5 text-xs text-gray-500">
                    <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5" />
                        <span className="font-medium">Expensed: {formatDate(claim.expenseDate)}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" />
                        <span>Applied: {formatDateTime(claim.createdAt)}</span>
                    </div>
                </div>

                {/* Conditional Action: Only allow cancel if pending */}
                {claim.hrStatus === 'Pending' ? (
                    <button
                        onClick={() => onCancel(claim._id)}
                        className="w-full mt-2 py-2.5 rounded-xl border-2 border-red-50 text-red-600 font-semibold text-sm hover:bg-red-50 hover:border-red-100 transition-colors"
                    >
                        Cancel Application
                    </button>
                ) : (
                    <div className="w-full mt-2 py-2.5 rounded-xl bg-gray-50 text-gray-500 font-semibold text-xs text-center border border-gray-100 uppercase tracking-wider">
                        {claim.paymentStatus === 'Paid' ? 'Disbursed in Payroll' : claim.hrStatus}
                    </div>
                )}
            </div>
        </div>
    );
}