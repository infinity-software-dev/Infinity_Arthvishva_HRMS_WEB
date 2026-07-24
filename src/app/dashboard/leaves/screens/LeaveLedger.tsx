"use client";
import { DEPARTMENTS } from "@/hooks/employee-hooks/useAddEmployee";
import { useLeaveLedger } from "@/hooks/leave-hooks/useLeaveLedger";

export default function LeaveLedger() {
    const { data, loading, pagination, filters, modal } = useLeaveLedger();

    const formatDate = (dateStr?: string) => {
        if (!dateStr) return "--/--/----";
        return new Date(dateStr).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'Approved': return 'bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400';
            case 'Rejected': return 'bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400';
            case 'Pending': return 'bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400';
            case 'Cancelled': return 'bg-gray-100 text-gray-700 dark:bg-white/10 dark:text-gray-400';
            default: return 'bg-gray-100 text-gray-700 dark:bg-white/10 dark:text-gray-400';
        }
    };

    return (
        <div className="flex flex-col h-full w-full">
            {/* 1. Filter Bar */}
            <div className="bg-white dark:bg-primary p-4 rounded-xl mb-6 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 border border-gray-100 dark:border-gray-800 shadow-sm transition-colors duration-300">
                <div className="lg:col-span-2 relative">
                    <input
                        type="text"
                        placeholder="Search employee name or code..."
                        value={filters.searchQuery}
                        onChange={(e) => filters.setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-800 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-green bg-gray-50 dark:bg-white/5 text-primary dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 transition-colors"
                    />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-secondary dark:text-gray-400">🔍</div>
                </div>

                <input type="date" value={filters.startDate} onChange={(e) => filters.setStartDate(e.target.value)} className="w-full px-3 py-2 border border-gray-200 dark:border-gray-800 rounded-lg text-sm bg-gray-50 dark:bg-white/5 text-primary dark:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-brand-green" />
                <input type="date" value={filters.endDate} onChange={(e) => filters.setEndDate(e.target.value)} className="w-full px-3 py-2 border border-gray-200 dark:border-gray-800 rounded-lg text-sm bg-gray-50 dark:bg-white/5 text-primary dark:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-brand-green" />

                <select value={filters.status} onChange={(e) => filters.setStatus(e.target.value)} className="w-full px-3 py-2 border border-gray-200 dark:border-gray-800 rounded-lg text-sm bg-gray-50 dark:bg-white/5 text-primary dark:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-brand-green">
                    <option value="" className="dark:bg-primary">All Statuses</option>
                    <option value="Approved" className="dark:bg-primary">Approved</option>
                    <option value="Rejected" className="dark:bg-primary">Rejected</option>
                    <option value="Cancelled" className="dark:bg-primary">Cancelled</option>
                </select>

                <select value={filters.department} onChange={(e) => filters.setDepartment(e.target.value)} className="w-full px-3 py-2 border border-gray-200 dark:border-gray-800 rounded-lg text-sm bg-gray-50 dark:bg-white/5 text-primary dark:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-brand-green">
                    <option value="">All Departments</option>
                    {DEPARTMENTS.map((dept) => {
                        const upperDept = dept.toUpperCase();
                        return (
                            <option key={dept} value={upperDept}>
                                {upperDept}
                            </option>
                        );
                    })}
                </select>
            </div>

            {/* 2. Data Table */}
            <div className="bg-white dark:bg-primary overflow-x-auto rounded-xl border border-gray-100 dark:border-gray-800 mb-6 flex-1 shadow-sm transition-colors duration-300">
                <table className="w-full text-left text-sm text-secondary dark:text-gray-400">
                    <thead className="bg-gray-50 dark:bg-white/5 text-secondary dark:text-gray-400 border-b border-gray-100 dark:border-gray-800 transition-colors whitespace-nowrap">
                        <tr>
                            {/* CHANGED: Leave Dates is now the primary column */}
                            <th className="px-6 py-4 font-medium">Leave Dates</th>
                            <th className="px-6 py-4 font-medium">Employee</th>
                            <th className="px-6 py-4 font-medium">Application Details</th>
                            <th className="px-6 py-4 font-medium">Overall Status</th>
                            <th className="px-6 py-4 font-medium text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-800 bg-transparent transition-colors">
                        {loading ? (
                            <tr><td colSpan={5} className="px-6 py-8 text-center text-secondary dark:text-gray-500">Loading ledger...</td></tr>
                        ) : data.length === 0 ? (
                            <tr><td colSpan={5} className="px-6 py-8 text-center text-secondary dark:text-gray-500">No records found for these filters.</td></tr>
                        ) : (
                            data.map((row) => (
                                <tr key={row.leaveId} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">

                                    {/* COL 1: LEAVE DATES (Bold & Prominent) */}
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="font-bold text-primary dark:text-white text-base">
                                            {formatDate(row.startDate)}
                                            {row.startDate !== row.endDate && <span className="text-secondary dark:text-gray-400 font-medium text-sm"> to {formatDate(row.endDate)}</span>}
                                        </div>
                                        <div className="text-xs font-semibold text-brand-blue dark:text-blue-400 mt-1 uppercase tracking-wide">
                                            {row.leaveCategory} • {row.totalDays} Day{row.totalDays > 1 ? 's' : ''} {row.isHalfDay && `(${row.halfDayPeriod})`}
                                        </div>
                                    </td>

                                    {/* COL 2: EMPLOYEE INFO */}
                                    <td className="px-6 py-4 min-w-[200px]">
                                        <div className="font-medium text-primary dark:text-white">{row.employeeName}</div>
                                        <div className="text-xs text-secondary dark:text-gray-400">{row.employeeCode} • {row.department}</div>
                                    </td>

                                    {/* COL 3: APPLIED ON (Moved here, smaller text) */}
                                    <td className="px-6 py-4 text-xs whitespace-nowrap text-secondary dark:text-gray-500">
                                        Applied on:<br />
                                        <span className="font-medium text-primary dark:text-gray-300">{formatDate(row.appliedOn)}</span>
                                    </td>

                                    {/* COL 4: STATUS */}
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold tracking-wide ${getStatusBadge(row.overallStatus)}`}>
                                            {row.overallStatus}
                                        </span>
                                    </td>

                                    {/* COL 5: ACTIONS */}
                                    <td className="px-6 py-4 text-right">
                                        <button onClick={() => modal.setSelectedRecord(row)} className="hover:text-brand-blue dark:text-blue-400 dark:hover:text-blue-300 font-medium text-sm transition-colors whitespace-nowrap cursor-pointer">
                                            View Details
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* 3. Pagination */}
            <div className="flex flex-col sm:flex-row items-center justify-between text-sm text-secondary dark:text-gray-400 gap-4">
                <div>Showing {data.length} of {pagination.totalRecords} records</div>
                <div className="flex items-center gap-4">
                    <select value={pagination.limit} onChange={(e) => pagination.setLimit(Number(e.target.value))} className="px-2 py-1 border border-gray-200 dark:border-gray-800 rounded-md bg-white dark:bg-primary text-primary dark:text-white focus:outline-none transition-colors">
                        <option value={10}>10 per page</option>
                        <option value={20}>20 per page</option>
                        <option value={50}>50 per page</option>
                    </select>

                    <div className="flex gap-2">
                        <button disabled={pagination.page === 1} onClick={() => pagination.setPage(p => p - 1)} className="px-3 py-1 border border-gray-200 dark:border-gray-800 rounded-md disabled:opacity-50 text-primary dark:text-white hover:bg-gray-50 dark:hover:bg-white/5 transition-colors disabled:hover:bg-transparent dark:disabled:hover:bg-transparent">Prev</button>
                        <span className="px-3 py-1 font-medium text-primary dark:text-white">{pagination.page} / {pagination.totalPages || 1}</span>
                        <button disabled={pagination.page === pagination.totalPages || pagination.totalPages === 0} onClick={() => pagination.setPage(p => p + 1)} className="px-3 py-1 border border-gray-200 dark:border-gray-800 rounded-md disabled:opacity-50 text-primary dark:text-white hover:bg-gray-50 dark:hover:bg-white/5 transition-colors disabled:hover:bg-transparent dark:disabled:hover:bg-transparent">Next</button>
                    </div>
                </div>
            </div>

            {/* 4. Details Modal */}
            {modal.selectedRecord && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 dark:bg-black/60 backdrop-blur-md">
                    <div className="bg-white dark:bg-primary rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-gray-100 dark:border-gray-800 transition-colors duration-300">
                        {/* Header */}
                        <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
                            <h3 className="font-bold text-lg text-primary dark:text-white">Leave Application Details</h3>
                            <button onClick={() => modal.setSelectedRecord(null)} className="text-secondary dark:text-gray-400 hover:text-primary dark:hover:text-white transition-colors">✕</button>
                        </div>

                        {/* Content Body */}
                        <div className="p-6 max-h-[70vh] overflow-y-auto custom-scrollbar space-y-6">

                            {/* Employee Profile Header Block */}
                            <div className="flex justify-between items-center pb-4 border-b border-gray-100 dark:border-gray-800 border-dashed">
                                <div className="flex items-center gap-3">
                                    {modal.selectedRecord.avatar ? (
                                        <img
                                            src={modal.selectedRecord.avatar}
                                            alt={modal.selectedRecord.employeeName}
                                            className="w-12 h-12 rounded-full object-cover border border-gray-200 dark:border-gray-700"
                                        />
                                    ) : (
                                        <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-white/10 flex items-center justify-center font-bold text-primary dark:text-white">
                                            {modal.selectedRecord.employeeName?.charAt(0)}
                                        </div>
                                    )}
                                    <div>
                                        <p className="font-semibold text-primary dark:text-white">{modal.selectedRecord.employeeName}</p>
                                        <p className="text-xs text-secondary dark:text-gray-400">{modal.selectedRecord.employeeCode} • {modal.selectedRecord.department}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className={`px-3 py-1 rounded-full font-medium text-sm ${getStatusBadge(modal.selectedRecord.overallStatus)}`}>
                                        {modal.selectedRecord.overallStatus}
                                    </span>
                                </div>
                            </div>

                            {/* Primary Leave Information Cards */}
                            <div className="grid grid-cols-2 gap-4 bg-gray-50 dark:bg-white/5 p-4 rounded-xl border border-gray-100 dark:border-gray-800">
                                <div>
                                    <p className="text-xs font-semibold text-secondary dark:text-gray-500 uppercase tracking-wider mb-1">Category</p>
                                    <p className="text-primary dark:text-white font-medium">{modal.selectedRecord.leaveCategory}</p>
                                </div>
                                <div>
                                    <p className="text-xs font-semibold text-secondary dark:text-gray-500 uppercase tracking-wider mb-1">Duration</p>
                                    <p className="text-primary dark:text-white font-medium">
                                        {modal.selectedRecord.totalDays} {modal.selectedRecord.totalDays === 1 ? 'Day' : 'Days'}
                                        {modal.selectedRecord.isHalfDay && ` (${modal.selectedRecord.halfDayPeriod || 'Half Day'})`}
                                    </p>
                                </div>
                                <div className="col-span-2 pt-2 border-t border-gray-200/50 dark:border-gray-700/50">
                                    <p className="text-xs font-semibold text-secondary dark:text-gray-500 uppercase tracking-wider mb-1">Timeline Duration</p>
                                    <p className="text-sm text-primary dark:text-white font-medium">
                                        {new Date(modal.selectedRecord.startDate).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                                        {modal.selectedRecord.startDate !== modal.selectedRecord.endDate && ` — ${new Date(modal.selectedRecord.endDate).toLocaleDateString(undefined, { dateStyle: 'medium' })}`}
                                    </p>
                                </div>
                            </div>

                            {/* Applied On Metadata */}
                            <p className="text-xs text-right text-gray-400 dark:text-gray-500">
                                Applied on: {new Date(modal.selectedRecord.appliedOn).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}
                            </p>

                            {/* User Description Reason Section */}
                            <div>
                                <p className="text-xs font-semibold text-secondary dark:text-gray-500 uppercase tracking-wider mb-1">Reason for Application</p>
                                <p className="text-sm text-secondary dark:text-gray-300 bg-gray-50 dark:bg-white/5 p-3 rounded-lg border border-gray-100 dark:border-gray-800">
                                    {modal.selectedRecord.reason}
                                </p>
                            </div>

                            {/* Dynamic Rejection Remarks Block */}
                            {modal.selectedRecord.overallStatus === 'Rejected' && modal.selectedRecord.workflowSteps?.find((s: any) => s.status === 'Rejected')?.remarks && (
                                <div className="bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/50 rounded-xl p-4">
                                    <p className="text-xs font-bold text-red-600 dark:text-red-400 uppercase tracking-wider mb-1">Reason for Rejection</p>
                                    <p className="text-sm text-red-700 dark:text-red-300 font-medium">
                                        "{modal.selectedRecord.workflowSteps.find((s: any) => s.status === 'Rejected').remarks}"
                                    </p>
                                </div>
                            )}

                            {/* Step Routing Audit Trail Tracker Layout */}
                            <div>
                                <p className="text-xs font-semibold text-secondary dark:text-gray-500 uppercase tracking-wider mb-3">Approval Steps & History</p>
                                <div className="space-y-4 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-gray-200 dark:before:bg-gray-800">
                                    {modal.selectedRecord.workflowSteps?.map((step: any, idx: number) => {
                                        const isApproved = step.status === 'Approved';
                                        const isRejected = step.status === 'Rejected';
                                        let roleTitle = "Manager Approval";
                                        if (step.isHRProfileStep) roleTitle = "HR Review Sign-off";
                                        if (step.isDirectorProfileStep) roleTitle = "Director Executive Decision";

                                        return (
                                            <div key={idx} className="flex items-start gap-4 relative">
                                                <div className={`w-7 h-7 rounded-full flex items-center justify-center z-10 text-xs font-bold shrink-0 ${isApproved ? 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400' :
                                                    isRejected ? 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400' :
                                                        'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400'
                                                    }`}>
                                                    {isApproved ? '✓' : isRejected ? '✕' : idx + 1}
                                                </div>
                                                <div className="flex-1 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-gray-800 p-3 rounded-xl">
                                                    <div className="flex justify-between items-center mb-1">
                                                        <p className="text-sm font-semibold text-primary dark:text-white">{roleTitle}</p>
                                                        <span className={`text-xs font-bold uppercase ${isApproved ? 'text-green-600' : isRejected ? 'text-red-600' : 'text-gray-400'
                                                            }`}>{step.status}</span>
                                                    </div>
                                                    {step.actedAt && (
                                                        <p className="text-[11px] text-gray-400 dark:text-gray-500">
                                                            Processed: {new Date(step.actedAt).toLocaleString(undefined, { dateStyle: 'short', timeStyle: 'short' })}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="px-6 py-4 bg-gray-50 dark:bg-white/5 border-t border-gray-100 dark:border-gray-800 text-right transition-colors">
                            <button onClick={() => modal.setSelectedRecord(null)} className="px-4 py-2 bg-white dark:bg-primary border border-gray-200 dark:border-gray-800 rounded-lg text-sm font-medium text-primary dark:text-white hover:bg-gray-50 dark:hover:bg-white/10 transition-colors">Close</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}