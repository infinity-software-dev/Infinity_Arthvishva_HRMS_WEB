"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { Eye, AlertTriangle, ShieldAlert, Crown, Clock } from 'lucide-react';
import { useDirectorLiveComplaints } from '@/hooks/complaint-hooks/useDirectorLiveComplaints';
import { PopulatedComplaint } from '@/app/dashboard/complaints/HR/HrLiveComplaintsList';
import DirectorComplaintDetailsModal from '@/components/modals/DirectorComplaintDetailsModal';

interface DirectorLiveComplaintsListProps {
    searchQuery: string;
}

export default function DirectorLiveComplaintsList({ searchQuery }: DirectorLiveComplaintsListProps) {
    const { complaints, isLoading, refetch } = useDirectorLiveComplaints(searchQuery);
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
                return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800/50 animate-pulse';
            case 'Medium':
                return 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 border-orange-200 dark:border-orange-800/50';
            case 'Low':
                return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800/50';
            default:
                return 'bg-gray-100 text-gray-700';
        }
    };

    // Live Status Pill Colors
    const getStatusStyles = (status: string) => {
        switch (status) {
            case 'Pending':
                return 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400';
            case 'Acknowledged':
                return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400';
            case 'In Review':
                return 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400';
            default:
                return 'bg-gray-100 text-gray-700';
        }
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center h-64 w-full">
                <div className="animate-spin text-purple-600 text-3xl mb-4">⏳</div>
                <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">Loading live escalated complaints...</p>
            </div>
        );
    }

    if (!complaints || complaints.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-64 w-full border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-xl bg-gray-50/50 dark:bg-white/5">
                <ShieldAlert size={48} className="text-gray-300 dark:text-gray-600 mb-4" />
                <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">No Active Escalated Complaints</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                    {searchQuery ? 'No live complaints match your search query.' : 'There are currently no active complaints requiring executive attention.'}
                </p>
            </div>
        );
    }

    return (
        <>
            {/* ─── LIVE COMPLAINTS TABLE ─── */}
            <div className="w-full overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-primary [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-gradient-to-r [&::-webkit-scrollbar-thumb]:from-purple-600 [&::-webkit-scrollbar-thumb]:to-red-500 [&::-webkit-scrollbar-thumb]:rounded-full">
                <table className="w-full text-left border-collapse whitespace-nowrap">
                    <thead>
                        <tr className="bg-purple-50/40 dark:bg-purple-950/20 border-b border-gray-200 dark:border-gray-800 text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider font-semibold">
                            <th className="p-4">Ticket</th>
                            <th className="p-4">Employee</th>
                            <th className="p-4">Category</th>
                            <th className="p-4">Priority</th>
                            <th className="p-4">Status</th>
                            <th className="p-4">Directive Status</th>
                            <th className="p-4">Submitted</th>
                            <th className="p-4 text-center">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-800 text-primary dark:text-white">
                        {complaints.map((complaint) => {
                            const employee = complaint.employee;
                            const hasDirectorDirective = Boolean(complaint.directorComments?.trim());

                            return (
                                <tr
                                    key={complaint._id}
                                    className={`hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group ${complaint.priority === 'High' ? 'bg-red-50/20 dark:bg-red-950/10' : ''
                                        }`}
                                >
                                    {/* Ticket Title & Code */}
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
                                                <div className="w-9 h-9 rounded-full bg-purple-100 text-purple-700 font-bold text-xs flex items-center justify-center shrink-0">
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

                                    {/* Status Badge */}
                                    <td className="p-4">
                                        <span className={`px-2.5 py-1 text-xs font-bold rounded-full ${getStatusStyles(complaint.status)}`}>
                                            {complaint.status}
                                        </span>
                                    </td>

                                    {/* Director Directive Indicator */}
                                    <td className="p-4">
                                        {hasDirectorDirective ? (
                                            <span className="px-2 py-0.5 text-[11px] font-semibold rounded bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 flex items-center w-fit gap-1">
                                                <Crown size={11} /> Directive Issued
                                            </span>
                                        ) : (
                                            <span className="text-xs text-gray-400 italic">No directives</span>
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
                                            title="Inspect Escalation & Take Action"
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

            {/* ─── DIRECTOR MODAL ─── */}
            <DirectorComplaintDetailsModal
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