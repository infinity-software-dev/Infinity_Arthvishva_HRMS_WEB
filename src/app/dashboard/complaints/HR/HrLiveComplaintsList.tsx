"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { Eye, Clock, AlertTriangle, ShieldAlert } from 'lucide-react';
import { useHrLiveComplaints } from '@/hooks/complaint-hooks/useHrLiveComplaints';
import HrComplaintDetailsModal from '@/components/modals/HrComplaintDetailsModal';

// ─── DEFINITIONS ───
export interface TimelineEntry {
    action: string;
    actionBy: {
        _id: string;
        name: string;
        profileImageUrl?: string;
    };
    role: string;
    comments?: string;
    previousStatus?: string;
    updatedStatus?: string;
    timestamp: string;
}

export interface PopulatedComplaint {
    _id: string;
    title: string;
    category: string;
    priority: 'Low' | 'Medium' | 'High';
    description: string;
    status: 'Pending' | 'Acknowledged' | 'In Review' | 'Resolved' | 'Rejected' | 'Withdrawn';
    directorComments?: string;
    employee: {
        _id: string;
        name: string;
        employeeCode: string;
        profileImageUrl?: string;
        department?: string;
    };
    timeline: TimelineEntry[];
    createdAt: string;
    updatedAt?: string;
}

interface HrLiveComplaintsListProps {
    searchQuery: string;
}

export default function HrLiveComplaintsList({ searchQuery }: HrLiveComplaintsListProps) {
    // ─── HOOK DATA & INTERNAL MODAL STATE ───
    const { complaints, isLoading, refetch } = useHrLiveComplaints(searchQuery);
    const [selectedComplaint, setSelectedComplaint] = useState<PopulatedComplaint | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Open modal and pass the exact complaint object from the map loop
    const handleViewClick = (complaint: PopulatedComplaint) => {
        setSelectedComplaint(complaint);
        setIsModalOpen(true);
    };

    // Helper styling functions
    const getPriorityStyles = (priority: string) => {
        switch (priority) {
            case 'High': return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800/50';
            case 'Medium': return 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 border-orange-200 dark:border-orange-800/50';
            case 'Low': return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800/50';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    const getStatusStyles = (status: string) => {
        switch (status) {
            case 'Pending': return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400';
            case 'Acknowledged': return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400';
            case 'In Review': return 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center h-64 w-full">
                <div className="animate-spin text-brand-blue text-3xl mb-4">⏳</div>
                <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">Loading live complaints...</p>
            </div>
        );
    }

    if (!complaints || complaints.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-64 w-full border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-xl bg-gray-50/50 dark:bg-white/5">
                <ShieldAlert size={48} className="text-gray-300 dark:text-gray-600 mb-4" />
                <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">No Live Complaints</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                    {searchQuery ? 'No complaints found matching your search.' : 'There are currently no active tickets requiring attention.'}
                </p>
            </div>
        );
    }

    return (
        <>
            {/* ─── LIST TABLE ─── */}
            <div className="w-full overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-primary [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-gradient-to-r [&::-webkit-scrollbar-thumb]:from-brand-blue [&::-webkit-scrollbar-thumb]:to-brand-green [&::-webkit-scrollbar-thumb]:rounded-full">
                <table className="w-full text-left border-collapse whitespace-nowrap">
                    <thead>
                        <tr className="bg-gray-50 dark:bg-secondary border-b border-gray-200 dark:border-gray-800 text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider font-semibold">
                            <th className="p-4">Ticket Details</th>
                            <th className="p-4">Employee</th>
                            <th className="p-4">Category</th>
                            <th className="p-4">Priority</th>
                            <th className="p-4">Status</th>
                            <th className="p-4">Submitted On</th>
                            <th className="p-4 text-center">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-800 text-primary dark:text-white">
                        {complaints.map((complaint) => {
                            const employee = complaint.employee;

                            return (
                                <tr key={complaint._id} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group">
                                    <td className="p-4">
                                        <p className="font-bold text-gray-900 dark:text-white truncate max-w-[200px]" title={complaint.title}>
                                            {complaint.title}
                                        </p>
                                        <p className="text-[11px] text-gray-400 mt-0.5 font-mono">
                                            #{complaint._id.slice(-6).toUpperCase()}
                                        </p>
                                    </td>

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

                                    <td className="p-4 text-sm text-gray-600 dark:text-gray-300 font-medium">
                                        {complaint.category}
                                    </td>

                                    <td className="p-4">
                                        <span className={`px-2.5 py-1 text-xs font-bold rounded-md border ${getPriorityStyles(complaint.priority)} flex items-center w-fit gap-1.5`}>
                                            {complaint.priority === 'High' && <AlertTriangle size={12} />}
                                            {complaint.priority}
                                        </span>
                                    </td>

                                    <td className="p-4">
                                        <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${getStatusStyles(complaint.status)} flex items-center w-fit gap-1.5`}>
                                            <Clock size={12} className={complaint.status === 'Pending' ? 'animate-pulse' : ''} />
                                            {complaint.status}
                                        </span>
                                    </td>

                                    <td className="p-4 text-sm text-gray-500 dark:text-gray-400 font-medium">
                                        {new Date(complaint.createdAt).toLocaleDateString('en-IN', {
                                            day: '2-digit', month: 'short', year: 'numeric'
                                        })}
                                    </td>

                                    <td className="p-4 text-center">
                                        {/* Button updates local state to open modal */}
                                        <button
                                            onClick={() => handleViewClick(complaint)}

                                            title="View & Resolve"
                                            className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-brand-blue hover:text-blue-700 bg-blue-50 hover:bg-blue-100 dark:text-blue-400 dark:bg-blue-900/20 dark:hover:bg-blue-900/40 rounded-lg transition-colors cursor-pointer"
                                        >
                                            <Eye className="w-4 h-4" />
                                            View
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* ─── MODAL COMPONENT RENDERED HERE ─── */}
            <HrComplaintDetailsModal
                complaint={selectedComplaint}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={() => {
                    // Refresh data after a successful action
                    if (refetch) refetch();
                }}
            />
        </>
    );
}