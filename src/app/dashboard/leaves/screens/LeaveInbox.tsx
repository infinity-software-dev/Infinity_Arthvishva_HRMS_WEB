"use client";
import { useLeaveInbox } from "@/hooks/leave-hooks/useLeaveInbox";

export default function LeaveInbox() {
    const { requests, loading, handleApprove, rejectContext } = useLeaveInbox();

    const getLeaveBadgeColor = (category: string) => {
        switch (category) {
            case 'Sick': return 'bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400';
            case 'Casual': return 'bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400';
            case 'Paid': return 'bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400';
            case 'CompOff': return 'bg-purple-100 text-purple-700 dark:bg-purple-500/10 dark:text-purple-400';
            default: return 'bg-gray-100 text-gray-700 dark:bg-white/10 dark:text-gray-300';
        }
    };

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-secondary dark:text-gray-500">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-4"></div>
                <p>Loading pending leaves...</p>
            </div>
        );
    }

    if (requests.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-[400px] text-secondary dark:text-gray-500">
                <div className="p-4 bg-green-50 dark:bg-green-500/5 text-green-500 rounded-full mb-4">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                </div>
                <p className="font-medium text-lg text-primary dark:text-white">All Caught Up!</p>
                <p className="text-sm mt-1">There are no pending leave requests waiting for your approval.</p>
            </div>
        );
    }

    return (
        <div className="w-full">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {requests.map((req) => (
                    <div key={req.leaveId} className="bg-white dark:bg-primary border border-gray-100 dark:border-gray-800 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow duration-300">
                        
                        {/* Header: Employee Info */}
                        <div className="flex justify-between items-start mb-5">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gray-50 dark:bg-white/5 flex items-center justify-center text-secondary dark:text-gray-400 font-bold overflow-hidden shrink-0 border border-gray-100 dark:border-gray-800">
                                    {req.avatar ? (
                                        <img src={req.avatar} alt={req.employeeName} className="w-full h-full object-cover" />
                                    ) : (
                                        req.employeeName.charAt(0)
                                    )}
                                </div>
                                <div>
                                    <h3 className="font-semibold text-primary dark:text-white leading-tight">{req.employeeName}</h3>
                                    <p className="text-xs text-secondary dark:text-gray-400">{req.employeeCode} • {req.department}</p>
                                </div>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${getLeaveBadgeColor(req.leaveCategory)}`}>
                                {req.leaveCategory}
                            </span>
                        </div>

                        {/* Body: Dates and Duration */}
                        <div className="flex items-center justify-between bg-gray-50 dark:bg-white/5 p-4 rounded-xl border border-gray-100 dark:border-gray-800 mb-5">
                            <div className="flex flex-col">
                                <span className="text-[10px] uppercase font-bold text-secondary dark:text-gray-500 tracking-wider mb-1">From</span>
                                <span className="font-medium text-primary dark:text-white text-sm">{formatDate(req.startDate)}</span>
                            </div>
                            
                            <div className="flex flex-col items-center px-4">
                                <div className="w-full flex items-center gap-2 text-secondary dark:text-gray-400">
                                    <div className="h-px w-8 bg-gray-200 dark:bg-gray-700"></div>
                                    <span className="text-xs font-bold bg-white dark:bg-primary px-2 py-0.5 rounded-full border border-gray-200 dark:border-gray-700">
                                        {req.totalDays} {req.totalDays === 1 ? 'Day' : 'Days'}
                                    </span>
                                    <div className="h-px w-8 bg-gray-200 dark:bg-gray-700"></div>
                                </div>
                                {req.isHalfDay && (
                                    <span className="text-[10px] text-secondary dark:text-gray-500 mt-1">({req.halfDayPeriod} Half)</span>
                                )}
                            </div>

                            <div className="flex flex-col text-right">
                                <span className="text-[10px] uppercase font-bold text-secondary dark:text-gray-500 tracking-wider mb-1">To</span>
                                <span className="font-medium text-primary dark:text-white text-sm">{formatDate(req.endDate)}</span>
                            </div>
                        </div>

                        {/* Reason */}
                        <div className="mb-6">
                            <p className="text-xs text-secondary dark:text-gray-500 font-semibold uppercase tracking-wider mb-2">Reason</p>
                            <p className="text-sm text-secondary dark:text-gray-300 italic line-clamp-2">
                                "{req.reason}"
                            </p>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
                            <button
                                onClick={() => rejectContext.initiate(req.leaveId)}
                                className="flex-1 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 dark:bg-red-500/10 dark:hover:bg-red-500/20 rounded-lg transition-colors"
                            >
                                Reject
                            </button>
                            <button
                                onClick={() => handleApprove(req.leaveId)}
                                className="flex-1 py-2 text-sm font-medium text-white bg-gradient-to-r from-brand-blue to-brand-green hover:bg-primary/90 rounded-lg transition-colors shadow-sm shadow-primary/30"
                            >
                                Approve Leave
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Rejection Modal */}
            {rejectContext.isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 dark:bg-black/60 backdrop-blur-md">
                    <div className="bg-white dark:bg-primary rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-gray-100 dark:border-gray-800 transition-colors duration-300">
                        <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800">
                            <h3 className="font-bold text-lg text-primary dark:text-white">Reject Leave Request</h3>
                            <p className="text-xs text-secondary dark:text-gray-400 mt-1">This will return the tokens to the employee's balance.</p>
                        </div>
                        <div className="p-6">
                            <label className="block text-sm font-medium text-primary dark:text-gray-300 mb-2">Reason for Rejection (Required)</label>
                            <textarea
                                value={rejectContext.reason}
                                onChange={(e) => rejectContext.setReason(e.target.value)}
                                placeholder="E.g., Insufficient coverage on these dates..."
                                className="w-full p-3 border border-gray-200 dark:border-gray-800 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 bg-gray-50 dark:bg-white/5 text-primary dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 transition-colors resize-none h-24"
                            />
                        </div>
                        <div className="px-6 py-4 bg-gray-50 dark:bg-white/5 border-t border-gray-100 dark:border-gray-800 flex justify-end gap-3 transition-colors">
                            <button
                                onClick={rejectContext.close}
                                className="px-4 py-2 bg-white dark:bg-primary border border-gray-200 dark:border-gray-800 rounded-lg text-sm font-medium text-primary dark:text-white hover:bg-gray-50 dark:hover:bg-white/10 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={rejectContext.confirm}
                                disabled={!rejectContext.reason.trim()}
                                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Confirm Rejection
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}