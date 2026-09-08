"use client";

import MapModal from "@/components/modals/MapModal";
import { useHistoricalLedger } from "@/hooks/attendance-hooks/useHistoricalLedger";
import { DEPARTMENTS } from "@/hooks/employee-hooks/useAddEmployee";
import { formatHours } from "@/utils/Date-TimeHelpers";
import { MapPin } from "lucide-react";

export default function HistoricalLedger() {
    const { data, loading, pagination, filters, modal, mapModal } = useHistoricalLedger();

    console.log(data)

    const formatTime = (isoString?: string) => {
        if (!isoString) return "--:--";
        return new Date(isoString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const getStatusClasses = (status: string) => {
        switch (status) {
            case 'P':
                return 'bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400';
            case 'A':
                return 'bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400';
            case 'L':
                return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-500/10 dark:text-yellow-400';
            case 'Half':
                return 'bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400';
            default:
                return 'bg-gray-100 text-gray-700 dark:bg-white/10 dark:text-gray-300';
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
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-secondary dark:text-gray-400">
                        🔍
                    </div>
                </div>

                <input
                    type="date"
                    value={filters.startDate}
                    onChange={(e) => filters.setStartDate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 dark:border-gray-800 rounded-lg text-sm bg-gray-50 dark:bg-white/5 text-primary dark:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-brand-green"
                />

                <input
                    type="date"
                    value={filters.endDate}
                    onChange={(e) => filters.setEndDate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 dark:border-gray-800 rounded-lg text-sm bg-gray-50 dark:bg-white/5 text-primary dark:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-brand-green"
                />

                <select
                    value={filters.status}
                    onChange={(e) => filters.setStatus(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 dark:border-gray-800 rounded-lg text-sm bg-gray-50 dark:bg-white/5 text-primary dark:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-brand-green"
                >
                    <option value="" className="dark:bg-primary">All Statuses</option>
                    <option value="P" className="dark:bg-primary">Present (P)</option>
                    <option value="A" className="dark:bg-primary">Absent (A)</option>
                    {/* <option value="WO" className="dark:bg-primary">Week Off (WO)</option> */}
                    <option value="L" className="dark:bg-primary">Leave (L)</option>
                    <option value="Half" className="dark:bg-primary">Half Day</option>
                </select>

                {/* THE FIX: Added the missing Department Dropdown */}
                <select
                    value={filters.department}
                    onChange={(e) => filters.setDepartment(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 dark:border-gray-800 rounded-lg text-sm bg-gray-50 dark:bg-white/5 text-primary dark:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-brand-green"
                >
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
            <div className="bg-white dark:bg-primary overflow-x-auto rounded-xl border border-gray-300 dark:border-gray-700 mb-6 flex-1 shadow-sm transition-colors duration-300">
                <table className="w-full text-left text-sm text-gray-800 dark:text-gray-200">
                    <thead className="bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-b border-gray-300 dark:border-gray-700 transition-colors">
                        <tr>
                            <th className="px-6 py-3.5 font-bold whitespace-nowrap border-r border-gray-200 dark:border-gray-700/60 ">Date</th>
                            <th className="px-6 py-3.5 font-bold whitespace-nowrap border-r border-gray-200 dark:border-gray-700/60">Employee</th>
                            <th className="px-6 py-3.5 font-bold whitespace-nowrap border-r border-gray-200 dark:border-gray-700/60 text-center">Punches</th>
                            <th className="px-6 py-3.5 font-bold whitespace-nowrap border-r border-gray-200 dark:border-gray-700/60 text-center">Working Hours</th>
                            <th className="px-6 py-3.5 font-bold whitespace-nowrap border-r border-gray-200 dark:border-gray-700/60 text-center">Mode</th>
                            <th className="px-6 py-3.5 font-bold whitespace-nowrap border-r border-gray-200 dark:border-gray-700/60 text-center">Status</th>
                            <th className="px-6 py-3.5 font-bold whitespace-nowrap border-r border-gray-200 dark:border-gray-700/60 text-center">Actions</th>
                            <th className="px-6 py-3.5 font-bold whitespace-nowrap text-center">Location</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-transparent transition-colors">
                        {loading ? (
                            <tr>
                                <td colSpan={6} className="px-6 py-8 text-center text-gray-600 dark:text-gray-400 font-medium">
                                    Loading ledger...
                                </td>
                            </tr>
                        ) : data.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="px-6 py-8 text-center text-gray-600 dark:text-gray-400 font-medium">
                                    No records found for this period.
                                </td>
                            </tr>
                        ) : (
                            data.map((row) => (
                                <tr key={row.attendanceId} className="hover:bg-gray-100/70 dark:hover:bg-gray-800/50 transition-colors">
                                    {/* Date */}
                                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900 dark:text-white border-r border-gray-200/60 dark:border-gray-800">
                                        {row.date}
                                    </td>

                                    {/* Employee */}
                                    <td className="px-6 py-4 whitespace-nowrap border-r border-gray-200/60 dark:border-gray-800 uppercase">
                                        <div className="font-semibold text-gray-900 dark:text-white">{row.employeeName}</div>
                                        <div className="text-xs font-semibold text-gray-600 dark:text-gray-400">
                                            {row.employeeCode} • {row.department}
                                        </div>
                                    </td>

                                    {/* Punches */}
                                    <td className="px-6 py-4 whitespace-nowrap text-xs border-r text-center border-gray-200/60 dark:border-gray-800">
                                        <div className="text-gray-700 dark:text-gray-300">
                                            In: <span className="font-semibold text-gray-900 dark:text-white">{formatTime(row.inTime)}</span>
                                        </div>
                                        <div className="text-gray-700 dark:text-gray-300">
                                            Out: <span className="font-semibold text-gray-900 dark:text-white">{formatTime(row.outTime)}</span>
                                        </div>
                                    </td>

                                    <td className="px-6 py-4 whitespace-nowrap border-r text-center border-gray-200/60 dark:border-gray-800">
                                        {row.totalHours ? (
                                            <span className="font-semibold text-gray-900 dark:text-white">{formatHours(row.totalHours)}</span>
                                        ) : (
                                            <span className="font-semibold text-gray-900 dark:text-white">N/A</span>
                                        )}
                                    </td>

                                    {/* Mode */}
                                    <td className="px-6 py-4 whitespace-nowrap border-r text-center border-gray-200/60 dark:border-gray-800">
                                        {row.workMode}
                                    </td>

                                    {/* Status */}
                                    <td className="px-6 py-4 whitespace-nowrap border-r text-center border-gray-200/60 dark:border-gray-800">
                                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${getStatusClasses(row.status)}`}>
                                            {row.status}
                                        </span>
                                    </td>

                                    {/* Actions */}
                                    <td className="px-6 py-4 whitespace-nowrap text-center border-r border-gray-200/60 dark:border-gray-800">
                                        <button
                                            onClick={() => modal.setSelectedRecord(row)}
                                            className="text-primary hover:text-brand-blue cursor-pointer dark:hover:text-brand-blue dark:text-white font-semibold text-sm transition-colors"
                                        >
                                            View Details
                                        </button>
                                    </td>

                                    {/* Location */}
                                    <td className="px-6 py-4 whitespace-nowrap text-center">
                                        {row.latitude && row.longitude ? (
                                            <button
                                                onClick={() => mapModal.handleOpenMap(row)}
                                                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-green-800 bg-green-50 border border-green-300 hover:bg-green-100 dark:text-green-300 dark:bg-green-950/50 dark:border-green-800 dark:hover:bg-green-900/60 rounded-lg transition-colors cursor-pointer shadow-sm"
                                            >
                                                <MapPin size={14} />
                                                View Map
                                            </button>
                                        ) : (
                                            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">N/A</span>
                                        )}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* 3. Pagination Footer */}
            <div className="flex items-center justify-between text-sm text-secondary dark:text-gray-400">
                <div>
                    Showing {data.length} of {pagination.totalRecords} records
                </div>
                <div className="flex items-center gap-4">
                    <select
                        value={pagination.limit}
                        onChange={(e) => pagination.setLimit(Number(e.target.value))}
                        className="px-2 py-1 border border-gray-200 dark:border-gray-800 rounded-md bg-white dark:bg-primary text-primary dark:text-white focus:outline-none transition-colors"
                    >
                        <option value={10}>10 per page</option>
                        <option value={31}>31 per page</option>
                        <option value={50}>50 per page</option>
                    </select>

                    <div className="flex gap-2">
                        <button
                            disabled={pagination.page === 1}
                            onClick={() => pagination.setPage(p => p - 1)}
                            className="px-3 py-1 border border-gray-200 dark:border-gray-800 rounded-md disabled:opacity-50 text-primary dark:text-white hover:bg-gray-50 dark:hover:bg-white/5 transition-colors disabled:hover:bg-transparent dark:disabled:hover:bg-transparent"
                        >
                            Prev
                        </button>
                        <span className="px-3 py-1 font-medium text-primary dark:text-white">
                            {pagination.page} / {pagination.totalPages || 1}
                        </span>
                        <button
                            disabled={pagination.page === pagination.totalPages || pagination.totalPages === 0}
                            onClick={() => pagination.setPage(p => p + 1)}
                            className="px-3 py-1 border border-gray-200 dark:border-gray-800 rounded-md disabled:opacity-50 text-primary dark:text-white hover:bg-gray-50 dark:hover:bg-white/5 transition-colors disabled:hover:bg-transparent dark:disabled:hover:bg-transparent"
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>

            {/* 4. EOD Report Details Modal */}
            {modal.selectedRecord && (
                // ✅ THE FIX: Adjusted backdrop to be slightly darker/blurrier for better contrast against dark themes
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 dark:bg-black/60 backdrop-blur-md">
                    <div className="bg-white dark:bg-primary rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-gray-100 dark:border-gray-800 transition-colors duration-300">
                        {/* Header */}
                        <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
                            <h3 className="font-bold text-lg text-primary dark:text-white">Attendance Details</h3>
                            <button onClick={() => modal.setSelectedRecord(null)} className="text-secondary dark:text-gray-400 hover:text-primary dark:hover:text-white transition-colors">✕</button>
                        </div>

                        {/* Content */}
                        <div className="p-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
                            <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-100 dark:border-gray-800 border-dashed">
                                <div>
                                    <p className="font-semibold text-primary dark:text-white">{modal.selectedRecord.employeeName}</p>
                                    <p className="text-xs text-secondary dark:text-gray-400">{modal.selectedRecord.date} • {modal.selectedRecord.workMode}</p>
                                </div>
                                <div className="text-right">
                                    <span className="bg-primary/10 dark:bg-white/10 text-primary dark:text-white px-3 py-1 rounded-md font-medium text-sm">
                                        Status: {modal.selectedRecord.status}
                                    </span>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <p className="text-xs font-semibold text-secondary dark:text-gray-500 uppercase tracking-wider mb-1">Total Hours</p>
                                    <p className="text-primary dark:text-white font-medium">
                                        {formatHours(modal.selectedRecord.totalHours ?? 0)}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-xs font-semibold text-secondary dark:text-gray-500 uppercase tracking-wider mb-1">Today's Work</p>
                                    <p className="text-sm text-secondary dark:text-gray-300 bg-gray-50 dark:bg-white/5 p-3 rounded-lg border border-gray-100 dark:border-gray-800">
                                        {modal.selectedRecord.todayWork || "No work details submitted."}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-xs font-semibold text-secondary dark:text-gray-500 uppercase tracking-wider mb-1">Pending Work</p>
                                    <p className="text-sm text-secondary dark:text-gray-300 bg-gray-50 dark:bg-white/5 p-3 rounded-lg border border-gray-100 dark:border-gray-800">
                                        {modal.selectedRecord.pendingWork || "None reported."}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-xs font-semibold text-secondary dark:text-gray-500 uppercase tracking-wider mb-1">Issues Faced</p>
                                    <p className="text-sm text-secondary dark:text-gray-300 bg-gray-50 dark:bg-white/5 p-3 rounded-lg border border-gray-100 dark:border-gray-800">
                                        {modal.selectedRecord.issuesFaced || "No issues reported."}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="px-6 py-4 bg-gray-50 dark:bg-white/5 border-t border-gray-100 dark:border-gray-800 text-right transition-colors">
                            <button
                                onClick={() => modal.setSelectedRecord(null)}
                                className="px-4 py-2 bg-white dark:bg-primary border border-gray-200 dark:border-gray-800 rounded-lg text-sm font-medium text-primary dark:text-white hover:bg-gray-50 dark:hover:bg-white/10 transition-colors"
                            >
                                Close Window
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <MapModal
                isOpen={mapModal.isMapOpen}
                onClose={() => {
                    mapModal.setIsMapOpen(false);
                    mapModal.setSelectedMapData(null);
                }}
                latitude={mapModal.selectedMapData?.latitude}
                longitude={mapModal.selectedMapData?.longitude}
                checkOutLatitude={mapModal.selectedMapData?.checkOutLatitude}
                checkOutLongitude={mapModal.selectedMapData?.checkOutLongitude}
                locationHistory={mapModal.selectedMapData?.locationHistory || []}
                workMode={mapModal.selectedMapData?.workMode}
                employeeName={mapModal.selectedMapData?.employeeName}
            />
        </div>
    );
}