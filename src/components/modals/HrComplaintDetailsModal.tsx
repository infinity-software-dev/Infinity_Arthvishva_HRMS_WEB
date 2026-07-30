"use client";

import React from 'react';
import Image from 'next/image';
import {
    X,
    Clock,
    ShieldCheck,
    MessageSquare,
    Send,
    User,
    Building2,
    FileText,
    CheckCircle2,
    XCircle,
    MinusCircle,
    RotateCcw
} from 'lucide-react';
import { PopulatedComplaint } from '@/app/dashboard/complaints/HR/HrLiveComplaintsList';
import { useHrComplaintDetails } from '@/hooks/complaint-hooks/useHrComplaintDetails';

interface HrComplaintDetailsModalProps {
    complaint: PopulatedComplaint | null;
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
}

export default function HrComplaintDetailsModal(props: HrComplaintDetailsModalProps) {
    const { complaint, onClose } = props;

    // Destructure logic from custom hook
    const {
        selectedStatus,
        setSelectedStatus,
        comments,
        setComments,
        isSubmitting,
        errorMsg,
        shouldRender,
        isVisible,
        handleSubmitAction
    } = useHrComplaintDetails(props);

    // Only return null if it shouldn't render AND it's fully invisible
    if (!shouldRender || !complaint) return null;

    const employee = complaint.employee;
    const isClosed = ['Resolved', 'Rejected', 'Withdrawn'].includes(complaint.status);

    // Available statuses for HR action on live complaints
    const hrStatusOptions = [
        { label: 'Acknowledged', value: 'Acknowledged', color: 'hover:border-blue-500 hover:text-blue-500' },
        { label: 'In Review', value: 'In Review', color: 'hover:border-purple-500 hover:text-purple-500' },
        { label: 'Resolve Ticket', value: 'Resolved', color: 'hover:border-green-500 hover:text-green-500' },
        { label: 'Reject Ticket', value: 'Rejected', color: 'hover:border-red-500 hover:text-red-500' },
    ];

    // Helper to style priority badges
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

    return (
        <div
            className={`fixed inset-0 z-50 flex items-center justify-end bg-black/40 backdrop-blur-sm transition-opacity duration-300 ease-in-out ${isVisible ? 'opacity-100' : 'opacity-0'
                }`}
        >
            {/* Modal Overlay Click to Close */}
            <div className="absolute inset-0" onClick={onClose} />

            {/* Slide-over Drawer Panel */}
            <div
                className={`relative w-full max-w-2xl h-full bg-white dark:bg-primary border-l border-gray-200 dark:border-gray-800 shadow-2xl flex flex-col z-10 overflow-hidden font-sans transition-transform duration-300 ease-in-out transform ${isVisible ? 'translate-x-0' : 'translate-x-full'
                    }`}
            >

                {/* ─── 1. HEADER ─── */}
                <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-secondary/50">
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-mono font-bold text-brand-blue bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 rounded">
                                #{complaint._id.slice(-6).toUpperCase()}
                            </span>
                            <span className={`px-2.5 py-0.5 text-xs font-bold rounded-md border ${getPriorityStyles(complaint.priority)}`}>
                                {complaint.priority} Priority
                            </span>
                        </div>
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mt-1">
                            {complaint.title}
                        </h2>
                    </div>

                    <button
                        onClick={onClose}
                        className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* ─── 2. SCROLLABLE CONTENT BODY ─── */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-gray-200 dark:[&::-webkit-scrollbar-thumb]:bg-gray-800 [&::-webkit-scrollbar-thumb]:rounded-full">

                    {/* Employee Profile Card */}
                    <div className="p-4 rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-white/5 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            {employee?.profileImageUrl ? (
                                <div className="relative w-12 h-12 rounded-full overflow-hidden border border-gray-200 dark:border-gray-700">
                                    <Image src={employee.profileImageUrl} alt={employee.name} fill className="object-cover" unoptimized />
                                </div>
                            ) : (
                                <div className="w-12 h-12 rounded-full bg-brand-blue/10 text-brand-blue font-bold text-base flex items-center justify-center">
                                    {employee?.name ? employee.name.slice(0, 2).toUpperCase() : 'EM'}
                                </div>
                            )}

                            <div>
                                <h4 className="font-bold text-gray-900 dark:text-white text-base leading-tight">
                                    {employee?.name || 'Unknown Employee'}
                                </h4>
                                <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400 mt-1">
                                    <span className="font-mono flex items-center gap-1">
                                        <User size={12} /> {employee?.employeeCode || 'N/A'}
                                    </span>
                                    {employee?.department && (
                                        <span className="flex items-center gap-1 font-medium text-gray-600 dark:text-gray-300">
                                            <Building2 size={12} /> {employee.department}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="text-right">
                            <span className="text-[11px] text-gray-400 block">Category</span>
                            <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                                {complaint.category}
                            </span>
                        </div>
                    </div>

                    {/* Complaint Description */}
                    <div className="space-y-2">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
                            <FileText size={14} /> Description
                        </h4>
                        <div className="p-4 rounded-xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-primary text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
                            {complaint.description}
                        </div>
                    </div>

                    {/* Director Comments (if present) */}
                    {complaint.directorComments && (
                        <div className="p-4 rounded-xl border border-purple-200 dark:border-purple-900/50 bg-purple-50/50 dark:bg-purple-900/10 space-y-1">
                            <span className="text-xs font-bold text-purple-700 dark:text-purple-400 flex items-center gap-1">
                                <ShieldCheck size={14} /> Director Directives
                            </span>
                            <p className="text-sm text-purple-900 dark:text-purple-300 italic">
                                &quot;{complaint.directorComments}&quot;
                            </p>
                        </div>
                    )}

                    {/* ─── 3. ACTION SECTION (LIVE vs HISTORICAL) ─── */}
                    {isClosed ? (
                        /* READ-ONLY CLOSED TICKET BANNER */
                        <div className="p-5 rounded-2xl border border-gray-200 dark:border-gray-800 bg-gray-50/80 dark:bg-white/5 space-y-3">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    {complaint.status === 'Resolved' && <CheckCircle2 size={18} className="text-green-500" />}
                                    {complaint.status === 'Rejected' && <XCircle size={18} className="text-red-500" />}
                                    {complaint.status === 'Withdrawn' && <MinusCircle size={18} className="text-gray-400" />}
                                    <span className="text-sm font-bold text-gray-900 dark:text-white">
                                        Complaint is {complaint.status}
                                    </span>
                                </div>
                                <span className="text-[11px] font-mono text-gray-400 uppercase tracking-wider bg-gray-200/50 dark:bg-gray-800 px-2 py-0.5 rounded">
                                    Archived Record
                                </span>
                            </div>
                            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                                This ticket is closed. All actions and activity timeline records are preserved for auditing purposes.
                            </p>

                            <div className="pt-2 flex items-center justify-between border-t border-gray-200/60 dark:border-gray-800/60">
                                <span className="text-[11px] text-gray-400 italic">Need to review further?</span>
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        setSelectedStatus('In Review');
                                        handleSubmitAction(e as any);
                                    }}
                                    disabled={isSubmitting}
                                    className="text-xs font-semibold text-brand-blue cursor-pointer hover:underline flex items-center gap-1.5 transition-colors disabled:opacity-50"
                                >
                                    <RotateCcw size={13} />
                                    {isSubmitting ? 'Re-opening...' : 'Re-open Ticket'}
                                </button>
                            </div>
                        </div>
                    ) : (
                        /* INTERACTIVE HR ACTION FORM (FOR LIVE COMPLAINTS) */
                        <form onSubmit={handleSubmitAction} className="p-5 rounded-2xl border border-brand-blue/20 bg-blue-50/30 dark:bg-blue-950/10 space-y-4">
                            <h4 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                <MessageSquare size={16} className="text-brand-blue" />
                                Take HR Action
                            </h4>

                            {/* Status Radio Pills */}
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                {hrStatusOptions.map((opt) => (
                                    <button
                                        key={opt.value}
                                        type="button"
                                        onClick={() => setSelectedStatus(opt.value)}
                                        className={`py-2 px-3 text-xs font-semibold rounded-lg border transition-all text-center ${selectedStatus === opt.value
                                            ? 'bg-brand-blue text-white border-brand-blue shadow-sm'
                                            : `bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700 ${opt.color}`
                                            }`}
                                    >
                                        {opt.label}
                                    </button>
                                ))}
                            </div>

                            {/* Comment Textarea */}
                            <div>
                                <textarea
                                    rows={3}
                                    value={comments}
                                    onChange={(e) => setComments(e.target.value)}
                                    placeholder="Add investigation notes, feedback, or resolution details..."
                                    className="w-full p-3 text-sm rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-primary dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-blue transition-colors resize-none"
                                />
                            </div>

                            {errorMsg && (
                                <p className="text-xs text-red-500 font-medium">{errorMsg}</p>
                            )}

                            <div className="flex justify-end">
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="flex items-center gap-2 px-5 py-2.5 bg-brand-blue text-white font-medium text-sm rounded-xl hover:bg-blue-600 active:scale-95 transition-all disabled:opacity-50"
                                >
                                    {isSubmitting ? (
                                        <span>Updating...</span>
                                    ) : (
                                        <>
                                            <Send size={15} /> Submit Action
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    )}

                    {/* ─── 4. TIMELINE / HISTORY ─── */}
                    <div className="space-y-3 pt-2">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
                            <Clock size={14} /> Activity Timeline
                        </h4>

                        <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-200 dark:before:bg-gray-800">
                            {complaint.timeline?.map((item, idx) => (
                                <div key={idx} className="relative group">
                                    {/* Timeline Dot */}
                                    <div className="absolute -left-6 top-1 w-5 h-5 rounded-full border-2 border-white dark:border-primary bg-brand-blue flex items-center justify-center text-white">
                                        <div className="w-1.5 h-1.5 rounded-full bg-white" />
                                    </div>

                                    <div className="bg-gray-50/80 dark:bg-white/5 border border-gray-100 dark:border-gray-800 p-3 rounded-xl space-y-1">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <span className="font-bold text-xs text-gray-900 dark:text-white">
                                                    {item.actionBy?.name || 'System'}
                                                </span>
                                                <span className="text-[10px] px-1.5 py-0.2 rounded bg-gray-200 dark:bg-gray-800 text-gray-600 dark:text-gray-400 font-medium">
                                                    {item.role}
                                                </span>
                                            </div>

                                            <span className="text-[11px] text-gray-400">
                                                {new Date(item.timestamp).toLocaleString('en-IN', {
                                                    day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit'
                                                })}
                                            </span>
                                        </div>

                                        <p className="text-xs text-gray-600 dark:text-gray-300">
                                            <strong className="text-brand-blue">{item.action}</strong>
                                            {item.updatedStatus && ` • Status set to ${item.updatedStatus}`}
                                        </p>

                                        {item.comments && (
                                            <p className="text-xs text-gray-500 dark:text-gray-400 italic bg-white dark:bg-gray-900/50 p-2 rounded-lg border border-gray-100 dark:border-gray-800 mt-1">
                                                &quot;{item.comments}&quot;
                                            </p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>

            </div>
        </div>
    );
}