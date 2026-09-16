"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAttendanceSummary } from '@/hooks/portal-hooks/attendance-hooks/useAttendanceSummary';
import {
    ChevronLeft, ChevronRight, Calendar, CheckCircle2,
    AlertCircle, BarChart2, Clock, TrendingUp, FileText, Edit3,
    ArrowLeft,
} from 'lucide-react';
import ViewReportModal from '@/components/portal/attendance/ViewReportModal';
import RequestCorrectionModal from '@/components/portal/attendance/RequestCorrectionModal';

export default function AttendanceSummaryPage() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [selectedReport, setSelectedReport] = useState<{ data: any, date: string } | null>(null);
    const [selectedCorrectionRecord, setSelectedCorrectionRecord] = useState<any | null>(null);
    const {
        startDate,
        setStartDate,
        endDate,
        setEndDate,
        currentDate,
        nextMonth,
        prevMonth,
        data,
        uiStats,
        loading
    } = useAttendanceSummary();

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) setUser(JSON.parse(storedUser));
    }, []);

    // Formatters
    const formatTime = (isoString?: string) => {
        if (!isoString) return '—';
        return new Date(isoString).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }).toLowerCase();
    };

    const formatHours = (minutes?: number) => {
        if (!minutes) return '—';
        const h = Math.floor(minutes / 60);
        const m = minutes % 60;
        return `${h}h ${m}m`;
    };

    const getStatusPill = (status: string) => {
        switch (status) {
            case 'P': return <span className="px-3 py-1 bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400 border border-green-200 dark:border-green-500/20 rounded-full text-[11px] font-bold tracking-wide">Present</span>;
            case 'Half': return <span className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700 rounded-full text-[11px] font-bold tracking-wide">Half</span>;
            case 'A': return <span className="px-3 py-1 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-500/20 rounded-full text-[11px] font-bold tracking-wide">Absent</span>;
            case 'WO': return <span className="px-3 py-1 bg-blue-50 dark:bg-blue-500/10 text-brand-blue dark:text-blue-400 border border-blue-200 dark:border-blue-500/20 rounded-full text-[11px] font-bold tracking-wide">Week Off</span>;
            case 'H': return <span className="px-3 py-1 bg-pink-50 dark:bg-pink-500/10 text-pink-600 dark:text-pink-400 border border-pink-200 dark:border-pink-500/20 rounded-full text-[11px] font-bold tracking-wide">Holiday</span>;
            case 'L': return <span className="px-3 py-1 bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-500/20 rounded-full text-[11px] font-bold tracking-wide">Leave</span>;
            default: return <span className="px-3 py-1 bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-200 dark:border-orange-500/20 rounded-full text-[11px] font-bold tracking-wide">{status}</span>;
        }
    };

    const monthYearString = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

    // Reusable Stat Card Component
    const StatCard = ({ title, value, colorClass, borderClass, icon: Icon }: any) => (
        <div className={`bg-white dark:bg-primary rounded-xl shadow-sm border-x border-b border-gray-100 dark:border-gray-800 ${borderClass} p-5 flex flex-col transition-colors`}>
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-3 ${colorClass} shadow-sm`}>
                <Icon size={16} className="text-white" />
            </div>
            <h3 className="text-2xl font-black text-primary dark:text-white leading-none mb-1">{value}</h3>
            <p className="text-[10px] font-bold text-secondary dark:text-gray-400 uppercase tracking-widest">{title}</p>
        </div>
    );

    return (
        <div className="w-full max-w-7xl mx-auto space-y-6 pb-12">

            {/* 1. Header Card */}
            <div className="bg-white dark:bg-primary rounded-2xl shadow-sm border-x border-b border-gray-100 dark:border-gray-800 border-t-[5px] border-t-brand-blue p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors">

                {/* Left: Back Button & Title */}
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => router.back()}
                        className="w-10 h-10 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700 flex items-center justify-center text-secondary dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-primary dark:hover:text-white transition-colors shrink-0"
                        title="Go Back"
                    >
                        <ArrowLeft size={18} />
                    </button>
                    <div>
                        <h1 className="text-2xl font-black text-primary dark:text-white tracking-tight leading-none mb-1.5">
                            My Attendance
                        </h1>
                        <p className="text-xs font-bold text-secondary dark:text-gray-400 uppercase tracking-widest">
                            {user?.name || "Employee"} · {user?.employeeCode || "N/A"}
                        </p>
                    </div>
                </div>

                {/* Right: Date Range Filter & Month Quick Navigator */}
                <div className="flex flex-wrap items-center gap-3">
                    <div className="flex items-center gap-2">
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-xl text-sm bg-gray-50 dark:bg-gray-800/50 text-primary dark:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-brand-blue shadow-sm cursor-pointer"
                            title="Start Date"
                        />
                        <span className="text-secondary dark:text-gray-400 text-xs font-bold uppercase tracking-wider">to</span>
                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-xl text-sm bg-gray-50 dark:bg-gray-800/50 text-primary dark:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-brand-blue shadow-sm cursor-pointer"
                            title="End Date"
                        />
                    </div>

                    {/* Month Navigator */}
                    <div className="flex items-center gap-1.5 bg-gray-50 dark:bg-gray-800/50 p-1.5 rounded-xl border border-gray-100 dark:border-gray-700">
                        <button
                            onClick={prevMonth}
                            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white dark:hover:bg-gray-700 text-secondary dark:text-gray-400 transition-colors shadow-sm"
                            title="Previous Month"
                        >
                            <ChevronLeft size={16} />
                        </button>
                        <div className="flex items-center gap-1.5 px-2 text-xs font-bold text-primary dark:text-white whitespace-nowrap">
                            <Calendar size={14} className="text-brand-blue dark:text-blue-400" />
                            {monthYearString}
                        </div>
                        <button
                            onClick={nextMonth}
                            disabled={new Date().getMonth() === currentDate.getMonth() && new Date().getFullYear() === currentDate.getFullYear()}
                            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white dark:hover:bg-gray-700 text-secondary dark:text-gray-400 transition-colors shadow-sm disabled:opacity-30"
                            title="Next Month"
                        >
                            <ChevronRight size={16} />
                        </button>
                    </div>
                </div>
            </div>

            {/* 2. Stat Cards Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                <StatCard title="Present" value={loading ? "-" : uiStats.present} colorClass="bg-[#059669] dark:bg-emerald-600" borderClass="border-t-[4px] border-t-[#059669] dark:border-t-emerald-600" icon={CheckCircle2} />
                <StatCard title="Absent" value={loading ? "-" : uiStats.absent} colorClass="bg-[#DC2626] dark:bg-red-600" borderClass="border-t-[4px] border-t-[#DC2626] dark:border-t-red-600" icon={AlertCircle} />
                <StatCard title="Holiday" value={loading ? "-" : uiStats.holiday} colorClass="bg-[#EC4899] dark:bg-pink-600" borderClass="border-t-[4px] border-t-[#EC4899] dark:border-t-pink-600" icon={Calendar} />
                <StatCard title="Week Off" value={loading ? "-" : uiStats.weekOff} colorClass="bg-[#0891B2] dark:bg-cyan-600" borderClass="border-t-[4px] border-t-[#0891B2] dark:border-t-cyan-600" icon={BarChart2} />
                <StatCard title="Late Ins" value={loading ? "-" : uiStats.lateIns} colorClass="bg-[#D97706] dark:bg-amber-600" borderClass="border-t-[4px] border-t-[#D97706] dark:border-t-amber-600" icon={Clock} />
                <StatCard title="Avg Hours" value={loading ? "-" : uiStats.avgHours} colorClass="bg-[#8B5CF6] dark:bg-purple-600" borderClass="border-t-[4px] border-t-[#8B5CF6] dark:border-t-purple-600" icon={TrendingUp} />
            </div>

            {/* 3. Table Section */}
            <div>
                <div className="flex items-center justify-between mb-3 px-1">
                    <h2 className="text-sm font-black text-primary dark:text-white tracking-tight">Attendance Log</h2>
                    <span className="text-xs font-medium text-secondary dark:text-gray-400">{data?.records?.length || 0} records</span>
                </div>

                <div className="bg-white dark:bg-primary rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden transition-colors">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm whitespace-nowrap">
                            <thead className="bg-gray-50/50 dark:bg-gray-800/40 text-[10px] font-bold text-secondary dark:text-gray-400 uppercase tracking-widest border-b border-gray-100 dark:border-gray-800">
                                <tr>
                                    <th className="px-6 py-4">Date</th>
                                    <th className="px-6 py-4">Day</th>
                                    <th className="px-6 py-4">Check In</th>
                                    <th className="px-6 py-4">Check Out</th>
                                    <th className="px-6 py-4">Hours</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                                {loading ? (
                                    <tr>
                                        <td colSpan={7} className="px-6 py-12 text-center text-secondary dark:text-gray-400">
                                            <div className="flex flex-col items-center gap-2">
                                                <div className="w-6 h-6 border-2 border-brand-blue dark:border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                                                Loading logs...
                                            </div>
                                        </td>
                                    </tr>
                                ) : data?.records?.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="px-6 py-12 text-center font-medium text-secondary dark:text-gray-400">
                                            No attendance records found for the selected date range ({startDate} to {endDate}).
                                        </td>
                                    </tr>
                                ) : (
                                    data?.records?.map((row: any, idx: number) => {
                                        const rowDate = new Date(row.date);
                                        const formattedDate = rowDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
                                        const dayOfWeek = rowDate.toLocaleDateString('en-GB', { weekday: 'short' });

                                        return (
                                            <tr key={idx} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors">
                                                <td className="px-6 py-4 font-bold text-primary dark:text-white">{formattedDate}</td>
                                                <td className="px-6 py-4 font-medium text-secondary dark:text-gray-400">{dayOfWeek}</td>
                                                {/* FIX: Adjusted text colors for Dark Mode legibility */}
                                                <td className="px-6 py-4 font-bold text-brand-green dark:text-green-400">{formatTime(row.myAttendance?.inTime)}</td>
                                                <td className="px-6 py-4 font-bold text-brand-blue dark:text-blue-400">{formatTime(row.myAttendance?.outTime)}</td>
                                                <td className="px-6 py-4 font-bold text-purple-600 dark:text-purple-400">
                                                    {formatHours(row.myAttendance?.totalMinutes)}
                                                </td>
                                                <td className="px-6 py-4">{getStatusPill(row.status)}</td>
                                                <td className="px-6 py-4">
                                                    {(() => {
                                                        // 1. Strict Eligibility Checks
                                                        const hasCheckedIn = Boolean(row.myAttendance?.inTime);
                                                        const isExcludedDay = row.status === 'WO' || row.status === 'H' || row.status === 'Pending';
                                                        const canRequestCorrection = hasCheckedIn && !isExcludedDay;
                                                        const isCorrectionPending = row.myAttendance?.correctionStatus === 'Pending';

                                                        return (
                                                            <div className="flex items-center gap-2">
                                                                {/* View Report Button - Only if attendance record exists */}
                                                                {row.myAttendance && (
                                                                    <button
                                                                        onClick={() => setSelectedReport({ data: row.myAttendance, date: row.date })}
                                                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-secondary dark:text-gray-300 rounded-lg text-[11px] font-bold transition-colors"
                                                                    >
                                                                        <FileText size={12} /> View Report
                                                                    </button>
                                                                )}

                                                                {/* Correction Badge or Button according to strict rules */}
                                                                {isCorrectionPending ? (
                                                                    <span className="px-3 py-1 bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-500/20 rounded-lg text-[11px] font-bold">
                                                                        Correction Pending
                                                                    </span>
                                                                ) : canRequestCorrection ? (
                                                                    <button
                                                                        onClick={() => setSelectedCorrectionRecord(row)}
                                                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-brand-blue dark:bg-blue-500/10 dark:hover:bg-blue-500/20 dark:text-blue-400 rounded-lg text-[11px] font-bold transition-colors"
                                                                    >
                                                                        <Edit3 size={12} /> Request Correction
                                                                    </button>
                                                                ) : null}
                                                            </div>
                                                        );
                                                    })()}
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <ViewReportModal
                isOpen={!!selectedReport}
                onClose={() => setSelectedReport(null)}
                reportData={selectedReport?.data}
                dateStr={selectedReport?.date || ''}
            />
            <RequestCorrectionModal
                isOpen={!!selectedCorrectionRecord}
                onClose={() => setSelectedCorrectionRecord(null)}
                record={selectedCorrectionRecord}
                onSuccess={() => {
                    // Refresh monthly summary data
                    window.location.reload();
                }}
            />
        </div>
    );
}