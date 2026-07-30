"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { Eye, AlertTriangle, CheckCircle2, XCircle, MinusCircle, History, Crown } from 'lucide-react';
import { useHrHistoricalComplaints } from '@/hooks/complaint-hooks/useHrHistoricalComplaints';
import { PopulatedComplaint } from './HrLiveComplaintsList';
import HrComplaintDetailsModal from '@/components/modals/HrComplaintDetailsModal';

interface HrHistoryComplaintsListProps {
    searchQuery: string;
}

export default function HrHistoryComplaintsList({ searchQuery }: HrHistoryComplaintsListProps) {
    // ─── HOOK DATA & INTERNAL MODAL STATE ───
    const { complaints, isLoading, refetch } = useHrHistoricalComplaints(searchQuery);
    const [selectedComplaint, setSelectedComplaint] = useState<PopulatedComplaint | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleViewClick = (complaint: PopulatedComplaint) => {
        setSelectedComplaint(complaint);
        setIsModalOpen(true);
    };

    // Priority Styling
    const getPriorityStyles = (priority: string) => {
        switch (priority) {
            case 'High':
                return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800/50';
            case 'Medium':
                return 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 border-orange-200 dark:border-orange-800/50';
            case 'Low':
                return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800/50';
            default:
                return 'bg-gray-100 text-gray-700';
        }
    };

    // Historical Status Badges (Resolved, Rejected, Withdrawn)
    const getHistoricalStatusBadge = (status: string) => {
        switch (status) {
            case 'Resolved':
                return (
                    <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 flex items-center w-fit gap-1.5">
                        <CheckCircle2 size={12} />
                        Resolved
                    </span>
                );
            case 'Rejected':
                return (
                    <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 flex items-center w-fit gap-1.5">
                        <XCircle size={12} />
                        Rejected
                    </span>
                );
            case 'Withdrawn':
                return (
                    <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 flex items-center w-fit gap-1.5">
                        <MinusCircle size={12} />
                        Withdrawn
                    </span>
                );
            default:
                return (
                    <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-700">
                        {status}
                    </span>
                );
        }
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center h-64 w-full">
                <div className="animate-spin text-brand-green text-3xl mb-4">⏳</div>
                <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">Loading complaint history...</p>
            </div>
        );
    }

    if (!complaints || complaints.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-64 w-full border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-xl bg-gray-50/50 dark:bg-white/5">
                <History size={48} className="text-gray-300 dark:text-gray-600 mb-4" />
                <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">No History Records Found</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                    {searchQuery ? 'No resolved or closed tickets match your search query.' : 'There are currently no closed or historical complaint records.'}
                </p>
            </div>
        );
    }

    return (
        <>
            {/* ─── HISTORY TABLE ─── */}
            <div className="w-full overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-primary [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-gradient-to-r [&::-webkit-scrollbar-thumb]:from-brand-blue [&::-webkit-scrollbar-thumb]:to-brand-green [&::-webkit-scrollbar-thumb]:rounded-full">
                <table className="w-full text-left border-collapse whitespace-nowrap">
                    <thead>
                        <tr className="bg-gray-50 dark:bg-secondary border-b border-gray-200 dark:border-gray-800 text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider font-semibold">
                            <th className="p-4">Ticket Details</th>
                            <th className="p-4">Employee</th>
                            <th className="p-4">Category</th>
                            <th className="p-4">Priority</th>
                            <th className="p-4">Final Status</th>
                            <th className="p-4">Executive Directive</th>
                            <th className="p-4">Submitted On</th>
                            <th className="p-4 text-center">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-800 text-primary dark:text-white">
                        {complaints.map((complaint) => {
                            const employee = complaint.employee;
                            const hasDirectorDirective = Boolean(complaint.directorComments?.trim());

                            return (
                                <tr key={complaint._id} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group">
                                    {/* Ticket Details */}
                                    <td className="p-4">
                                        <p className="font-bold text-gray-900 dark:text-white truncate max-w-[200px]" title={complaint.title}>
                                            {complaint.title}
                                        </p>
                                        <p className="text-[11px] text-gray-400 mt-0.5 font-mono">
                                            #{complaint._id.slice(-6).toUpperCase()}
                                        </p>
                                    </td>

                                    {/* Employee Info */}
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            {employee?.profileImageUrl ? (
                                                <div className="relative w-9 h-9 rounded-full overflow-hidden shrink-0 border border-gray-200 dark:border-gray-700">
                                                    <Image
                                                        src={employee.profileImageUrl}
                                                        alt={employee.name || 'Employee Profile'}
                                                        fill
                                                        className="object-cover"
                                                        unoptimized
                                                    />
                                                </div>
                                            ) : (
                                                <div className="w-9 h-9 rounded-full bg-brand-blue/10 text-brand-blue font-bold text-xs flex items-center justify-center shrink-0">
                                                    {employee?.name ? employee.name.slice(0, 2).toUpperCase() : 'EM'}
                                                </div>
                                            )}

                                            <div>
                                                <p className="font-semibold text-gray-800 dark:text-gray-200 text-sm leading-tight">
                                                    {employee?.name || 'Unknown Employee'}
                                                </p>
                                                <div className="flex items-center gap-2 mt-0.5">
                                                    <span className="text-xs text-gray-500 font-mono">
                                                        {employee?.employeeCode || 'N/A'}
                                                    </span>
                                                    {employee?.department && (
                                                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 font-medium">
                                                            {employee.department}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </td>

                                    {/* Category */}
                                    <td className="p-4 text-sm text-gray-600 dark:text-gray-300 font-medium">
                                        {complaint.category}
                                    </td>

                                    {/* Priority Badge */}
                                    <td className="p-4">
                                        <span className={`px-2.5 py-1 text-xs font-bold rounded-md border ${getPriorityStyles(complaint.priority)} flex items-center w-fit gap-1.5`}>
                                            {complaint.priority === 'High' && <AlertTriangle size={12} />}
                                            {complaint.priority}
                                        </span>
                                    </td>

                                    {/* Final Status Badge */}
                                    <td className="p-4">
                                        {getHistoricalStatusBadge(complaint.status)}
                                    </td>

                                    {/* Director Directive Badge */}
                                    <td className="p-4">
                                        {hasDirectorDirective ? (
                                            <span className="px-2 py-0.5 text-[11px] font-semibold rounded bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 flex items-center w-fit gap-1">
                                                <Crown size={11} /> Directive Recorded
                                            </span>
                                        ) : (
                                            <span className="text-xs text-gray-400 italic">None</span>
                                        )}
                                    </td>

                                    {/* Date */}
                                    <td className="p-4 text-sm text-gray-500 dark:text-gray-400 font-medium">
                                        {new Date(complaint.createdAt).toLocaleDateString('en-IN', {
                                            day: '2-digit',
                                            month: 'short',
                                            year: 'numeric',
                                        })}
                                    </td>

                                    {/* Actions */}
                                    <td className="p-4 text-center">
                                        <button
                                            onClick={() => handleViewClick(complaint)}
                                            className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-brand-blue hover:text-blue-700 bg-blue-50 hover:bg-blue-100 dark:text-blue-400 dark:bg-blue-900/20 dark:hover:bg-blue-900/40 rounded-lg transition-colors cursor-pointer"
                                            title="View Details & Timeline"
                                        >
                                            <Eye size={18} />
                                            View
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* ─── MODAL RENDERED IN LIST ─── */}
            <HrComplaintDetailsModal
                complaint={selectedComplaint}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={() => {
                    if (refetch) refetch();
                }}
            />
        </>
    );
}