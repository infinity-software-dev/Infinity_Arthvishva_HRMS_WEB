"use client";

import React from 'react';
import Image from 'next/image';
import {
    X,
    Clock,
    ShieldCheck,
    Send,
    User,
    Building2,
    FileText,
    CheckCircle2,
    XCircle,
    MinusCircle,
    RotateCcw,
    Crown
} from 'lucide-react';
import { PopulatedComplaint } from '@/app/dashboard/complaints/HR/HrLiveComplaintsList';
import { useDirectorComplaintDetails } from '@/hooks/complaint-hooks/useDirectorComplaintDetails';

interface DirectorComplaintDetailsModalProps {
    complaint: PopulatedComplaint | null;
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
}

export default function DirectorComplaintDetailsModal(props: DirectorComplaintDetailsModalProps) {
    const { complaint, onClose } = props;

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
    } = useDirectorComplaintDetails(props);

    if (!shouldRender || !complaint) return null;

    const employee = complaint.employee;
    const isClosed = ['Resolved', 'Rejected', 'Withdrawn'].includes(complaint.status);

    const directorStatusOptions = [
        { label: 'Acknowledge', value: 'Acknowledged', color: 'hover:border-blue-500 hover:text-blue-500' },
        { label: 'In Review', value: 'In Review', color: 'hover:border-brand-blue hover:text-brand-blue' },
        { label: 'Resolve Ticket', value: 'Resolved', color: 'hover:border-brand-green hover:text-brand-green' },
        { label: 'Reject Ticket', value: 'Rejected', color: 'hover:border-red-500 hover:text-red-500' },
    ];

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
            <div className="absolute inset-0" onClick={onClose} />

            <div
                className={`relative w-full max-w-2xl h-full bg-white dark:bg-primary border-l border-gray-200 dark:border-gray-800 shadow-2xl flex flex-col z-10 overflow-hidden font-sans transition-transform duration-300 ease-in-out transform ${isVisible ? 'translate-x-0' : 'translate-x-full'
                    }`}
            >
                {/* ─── 1. HEADER ─── */}
                <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-800 bg-blue-50/30 dark:bg-blue-950/20">
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-mono font-bold text-brand-blue dark:text-blue-400 bg-blue-100 dark:bg-blue-900/50 px-2 py-0.5 rounded flex items-center gap-1">
                                <Crown size={12} /> Executive Review
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

                {/* ─── 2. SCROLLABLE BODY ─── */}
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

                    {/* ─── 3. DIRECTOR ACTION / DIRECTIVES FORM ─── */}
                    {isClosed ? (
                        <div className="p-5 rounded-2xl border border-gray-200 dark:border-gray-800 bg-gray-50/80 dark:bg-white/5 space-y-3">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    {complaint.status === 'Resolved' && <CheckCircle2 size={18} className="text-brand-green" />}
                                    {complaint.status === 'Rejected' && <XCircle size={18} className="text-red-500" />}
                                    {complaint.status === 'Withdrawn' && <MinusCircle size={18} className="text-gray-400" />}
                                    <span className="text-sm font-bold text-gray-900 dark:text-white">
                                        Complaint is {complaint.status}
                                    </span>
                                </div>
                                <span className="text-[11px] font-mono text-gray-400 uppercase tracking-wider bg-gray-200/50 dark:bg-gray-800 px-2 py-0.5 rounded">
                                    Director Archive
                                </span>
                            </div>

                            {complaint.directorComments && (
                                <div className="p-3 rounded-xl border border-blue-200 dark:border-blue-900/50 bg-blue-50/50 dark:bg-blue-900/10 text-xs text-brand-blue dark:text-blue-300 italic">
                                    &quot;{complaint.directorComments}&quot;
                                </div>
                            )}

                            <div className="pt-2 flex items-center justify-between border-t border-gray-200/60 dark:border-gray-800/60">
                                <span className="text-[11px] text-gray-400 italic">Re-evaluate escalation?</span>
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        setSelectedStatus('In Review');
                                        handleSubmitAction(e as any);
                                    }}
                                    disabled={isSubmitting}
                                    className="text-xs font-semibold cursor-pointer text-brand-blue dark:text-blue-400 hover:underline flex items-center gap-1.5 transition-colors disabled:opacity-50"
                                >
                                    <RotateCcw size={13} />
                                    {isSubmitting ? 'Re-opening...' : 'Re-open Ticket'}
                                </button>
                            </div>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmitAction} className="p-5 rounded-2xl border border-brand-blue/20 bg-blue-50/30 dark:bg-blue-950/10 space-y-4">
                            <h4 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                <ShieldCheck size={16} className="text-brand-blue" />
                                Executive Directive & Status Change
                            </h4>

                            {/* Status Buttons */}
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                {directorStatusOptions.map((opt) => (
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

                            {/* Director Comment Area */}
                            <div>
                                <textarea
                                    rows={3}
                                    value={comments}
                                    onChange={(e) => setComments(e.target.value)}
                                    placeholder="Provide executive directives or comments (will be highlighted to HR & Employee)..."
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
                                    className="flex items-center gap-2 px-5 py-2.5 bg-brand-blue text-white font-medium text-sm rounded-xl hover:bg-blue-600 active:scale-95 transition-all disabled:opacity-50 shadow-md shadow-blue-500/10"
                                >
                                    {isSubmitting ? (
                                        <span>Saving Directive...</span>
                                    ) : (
                                        <>
                                            <Send size={15} /> Issue Directive
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    )}

                    {/* ─── 4. ACTIVITY TIMELINE ─── */}
                    <div className="space-y-3 pt-2">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
                            <Clock size={14} /> Activity Timeline
                        </h4>

                        <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-200 dark:before:bg-gray-800">
                            {complaint.timeline?.map((item, idx) => (
                                <div key={idx} className="relative group">
                                    <div className="absolute -left-6 top-1 w-5 h-5 rounded-full border-2 border-white dark:border-primary bg-brand-blue flex items-center justify-center text-white">
                                        <div className="w-1.5 h-1.5 rounded-full bg-white" />
                                    </div>

                                    <div className="bg-gray-50/80 dark:bg-white/5 border border-gray-100 dark:border-gray-800 p-3 rounded-xl space-y-1">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <span className="font-bold text-xs text-gray-900 dark:text-white">
                                                    {item.actionBy?.name || 'System'}
                                                </span>
                                                <span className="text-[10px] px-1.5 py-0.2 rounded bg-blue-100 dark:bg-blue-900/40 text-brand-blue dark:text-blue-300 font-semibold">
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