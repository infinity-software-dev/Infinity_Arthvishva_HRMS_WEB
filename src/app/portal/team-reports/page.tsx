"use client";

import { useTeamReports } from "@/hooks/portal-hooks/useTeamReports";
import {
    ClipboardList,
    Calendar,
    Clock,
    CheckCircle2,
    Eye,
    EyeOff,
    Search,
    AlertCircle,
    MapPin,
    RefreshCw,
    Briefcase,
    AlertTriangle,
    ChevronLeft,
    ChevronRight,
    UserCheck,
    Check
} from "lucide-react";

export default function TeamReportsPage() {
    const {
        selectedDate,
        setSelectedDate,
        reports,
        rawReportsCount,
        loading,
        actionLoadingId,
        isLeadership,
        searchQuery,
        setSearchQuery,
        filterStatus,
        setFilterStatus,
        metrics,
        toggleReadStatus,
        refresh,
    } = useTeamReports();

    // Quick Date navigation helpers
    const changeDate = (days: number) => {
        const d = new Date(selectedDate);
        d.setDate(d.getDate() + days);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, "0");
        const day = String(d.getDate()).padStart(2, "0");
        setSelectedDate(`${year}-${month}-${day}`);
    };

    const isToday = () => {
        const today = new Date();
        const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
        return selectedDate === todayStr;
    };

    const formatDisplayDate = (dateStr: string) => {
        if (!dateStr) return "N/A";
        return new Date(dateStr).toLocaleDateString("en-GB", {
            weekday: "short",
            day: "numeric",
            month: "short",
            year: "numeric",
        });
    };

    const formatTime = (timeStr?: string) => {
        if (!timeStr) return "--:--";
        return new Date(timeStr).toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
        });
    };

    if (!isLeadership) {
        return (
            <div className="w-full max-w-4xl mx-auto py-16 px-4">
                <div className="bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 rounded-2xl p-8 text-center flex flex-col items-center">
                    <AlertCircle className="w-12 h-12 text-amber-500 mb-4" />
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Manager Access Required</h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400 max-w-md">
                        This section is reserved for reporting supervisors. Your account does not currently hold leadership/manager privileges.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full max-w-7xl mx-auto space-y-6 pb-16">
            {/* 1. Header Section */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-brand-blue/10 flex items-center justify-center text-brand-blue shrink-0">
                            <ClipboardList className="w-5 h-5" />
                        </div>
                        <div>
                            <h1 className="text-2xl md:text-[28px] font-black text-primary dark:text-white tracking-tight leading-tight">
                                Team Work Reports
                            </h1>
                            <p className="text-xs font-semibold text-secondary dark:text-gray-400 tracking-wide mt-0.5">
                                Review daily task submissions, logged hours, and progress from your direct reports.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Date Controls & Refresh */}
                <div className="flex items-center gap-2">
                    <div className="flex items-center bg-white dark:bg-primary border border-gray-200 dark:border-gray-800 rounded-xl p-1 shadow-sm">
                        <button
                            onClick={() => changeDate(-1)}
                            className="p-1.5 hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg text-gray-500 hover:text-primary dark:hover:text-white transition-colors"
                            title="Previous Day"
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </button>

                        <div className="relative px-2">
                            <input
                                type="date"
                                value={selectedDate}
                                onChange={(e) => setSelectedDate(e.target.value)}
                                className="text-xs font-bold bg-transparent text-primary dark:text-white focus:outline-none cursor-pointer"
                            />
                        </div>

                        <button
                            onClick={() => changeDate(1)}
                            className="p-1.5 hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg text-gray-500 hover:text-primary dark:hover:text-white transition-colors"
                            title="Next Day"
                        >
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>

                    {!isToday() && (
                        <button
                            onClick={() => {
                                const today = new Date();
                                const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
                                setSelectedDate(todayStr);
                            }}
                            className="px-3 py-2 bg-brand-blue/10 hover:bg-brand-blue/20 text-brand-blue rounded-xl text-xs font-bold transition-all"
                        >
                            Today
                        </button>
                    )}

                    <button
                        onClick={refresh}
                        disabled={loading}
                        className="p-2.5 bg-gray-100 hover:bg-gray-200 dark:bg-white/5 dark:hover:bg-white/10 text-primary dark:text-white rounded-xl transition-all disabled:opacity-50"
                        title="Refresh"
                    >
                        <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
                    </button>
                </div>
            </div>

            {/* 2. Metrics Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white dark:bg-primary border border-gray-100 dark:border-gray-800 rounded-2xl p-5 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-xs font-bold text-secondary dark:text-gray-400 uppercase tracking-wider">
                            Reports for {formatDisplayDate(selectedDate)}
                        </p>
                        <h3 className="text-2xl font-black text-brand-blue mt-1">
                            {metrics.total}
                        </h3>
                        <p className="text-[11px] text-gray-500 mt-0.5">Submitted entries</p>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-brand-blue/10 flex items-center justify-center text-brand-blue">
                        <Briefcase className="w-6 h-6" />
                    </div>
                </div>

                <div className="bg-white dark:bg-primary border border-gray-100 dark:border-gray-800 rounded-2xl p-5 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-xs font-bold text-secondary dark:text-gray-400 uppercase tracking-wider">
                            Reviewed Reports
                        </p>
                        <h3 className="text-2xl font-black text-emerald-500 mt-1">
                            {metrics.reviewed}
                        </h3>
                        <p className="text-[11px] text-gray-500 mt-0.5">Marked as read</p>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                        <CheckCircle2 className="w-6 h-6" />
                    </div>
                </div>

                <div className="bg-white dark:bg-primary border border-gray-100 dark:border-gray-800 rounded-2xl p-5 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-xs font-bold text-secondary dark:text-gray-400 uppercase tracking-wider">
                            Pending Review
                        </p>
                        <h3 className="text-2xl font-black text-amber-500 mt-1">
                            {metrics.pending}
                        </h3>
                        <p className="text-[11px] text-gray-500 mt-0.5">Awaiting your feedback</p>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500">
                        <Clock className="w-6 h-6" />
                    </div>
                </div>
            </div>

            {/* 3. Filter & Search Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white dark:bg-primary p-3 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
                <div className="relative w-full sm:w-72">
                    <Search className="w-4 h-4 absolute left-3.5 top-3 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search employee..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-gray-800 rounded-xl pl-9 pr-3 py-2 text-xs text-primary dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-blue"
                    />
                </div>

                <div className="flex items-center gap-1.5 w-full sm:w-auto">
                    {(["All", "PendingReview", "Reviewed"] as const).map((status) => (
                        <button
                            key={status}
                            onClick={() => setFilterStatus(status)}
                            className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all ${
                                filterStatus === status
                                    ? "bg-brand-blue text-white shadow-sm"
                                    : "bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-white/10"
                            }`}
                        >
                            {status === "All" ? "All" : status === "PendingReview" ? "Pending Review" : "Reviewed"}
                        </button>
                    ))}
                </div>
            </div>

            {/* 4. Team Reports List / Feed */}
            {loading ? (
                <div className="py-20 text-center text-secondary dark:text-gray-400 font-medium flex flex-col items-center gap-3">
                    <div className="w-7 h-7 border-2 border-brand-blue border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-sm">Fetching team reports for {formatDisplayDate(selectedDate)}...</p>
                </div>
            ) : reports.length === 0 ? (
                <div className="py-20 text-center bg-white dark:bg-primary border border-gray-100 dark:border-gray-800 rounded-2xl p-8 flex flex-col items-center justify-center">
                    <div className="w-14 h-14 rounded-full bg-gray-50 dark:bg-white/5 flex items-center justify-center text-gray-400 mb-3">
                        <ClipboardList className="w-7 h-7 opacity-50" />
                    </div>
                    <h3 className="font-bold text-lg text-primary dark:text-white">No Reports Found</h3>
                    <p className="text-xs text-secondary dark:text-gray-400 mt-1 max-w-sm">
                        {rawReportsCount === 0
                            ? `None of your team members have submitted a work report for ${formatDisplayDate(selectedDate)}.`
                            : "No reports matching your search/filter criteria."}
                    </p>
                </div>
            ) : (
                <div className="space-y-4">
                    {reports.map((report) => {
                        const employee = report.employeeId || report.reportParticipant;
                        const isActing = actionLoadingId === report._id;

                        return (
                            <div
                                key={report._id}
                                className={`bg-white dark:bg-primary border rounded-2xl p-6 shadow-sm transition-all duration-200 space-y-4 ${
                                    report.isReportRead
                                        ? "border-gray-100 dark:border-gray-800 opacity-95"
                                        : "border-brand-blue/30 dark:border-brand-blue/30 shadow-brand-blue/5"
                                }`}
                            >
                                {/* Card Header */}
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-gray-100 dark:border-gray-800/80">
                                    <div className="flex items-center gap-3.5">
                                        <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-white/5 flex items-center justify-center font-black text-sm text-brand-blue border border-gray-200 dark:border-gray-700 overflow-hidden shrink-0">
                                            {employee?.profileImageUrl ? (
                                                <img src={employee.profileImageUrl} alt="" className="w-full h-full object-cover" />
                                            ) : (
                                                employee?.name?.charAt(0) || "E"
                                            )}
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <h3 className="font-bold text-primary dark:text-white text-base">
                                                    {employee?.name || "Team Member"}
                                                </h3>
                                                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-gray-100 dark:bg-white/5 text-gray-500 border border-gray-200 dark:border-gray-800 flex items-center gap-1">
                                                    <MapPin className="w-2.5 h-2.5" />
                                                    {report.workMode || "Office"}
                                                </span>
                                            </div>
                                            <p className="text-xs text-gray-400 mt-0.5">
                                                {employee?.position || "Employee"}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Timings & Review Button */}
                                    <div className="flex items-center gap-3">
                                        <div className="text-right text-xs bg-gray-50 dark:bg-white/5 px-3 py-1.5 rounded-xl border border-gray-100 dark:border-gray-800">
                                            <p className="text-gray-400 text-[10px] uppercase font-bold tracking-wider">Attendance</p>
                                            <p className="font-bold text-primary dark:text-white">
                                                {formatTime(report.inTime)} - {formatTime(report.outTime)}
                                                {report.totalHours ? ` (${report.totalHours.toFixed(1)} hrs)` : ""}
                                            </p>
                                        </div>

                                        <button
                                            onClick={() => toggleReadStatus(report._id, report.isReportRead)}
                                            disabled={isActing}
                                            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 disabled:opacity-50 ${
                                                report.isReportRead
                                                    ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20 hover:bg-emerald-100"
                                                    : "bg-brand-blue hover:bg-blue-600 text-white shadow-md shadow-brand-blue/20"
                                            }`}
                                        >
                                            {isActing ? (
                                                <div className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                                            ) : report.isReportRead ? (
                                                <>
                                                    <Check className="w-3.5 h-3.5" />
                                                    Reviewed
                                                </>
                                            ) : (
                                                <>
                                                    <Eye className="w-3.5 h-3.5" />
                                                    Mark as Reviewed
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>

                                {/* Report Content Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                                    {/* Work Accomplished */}
                                    <div className="space-y-1.5 md:col-span-2">
                                        <p className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                                            <Briefcase className="w-3.5 h-3.5 text-brand-blue" />
                                            Work Completed Today
                                        </p>
                                        <div className="p-3.5 bg-gray-50 dark:bg-white/5 rounded-xl border border-gray-100 dark:border-gray-800/60 text-primary dark:text-gray-200 leading-relaxed whitespace-pre-wrap">
                                            {report.todayWork || "No detailed work summary entered."}
                                        </div>
                                    </div>

                                    {/* Pending Work */}
                                    {report.pendingWork && (
                                        <div className="space-y-1.5">
                                            <p className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                                                <Clock className="w-3.5 h-3.5 text-amber-500" />
                                                Pending Tasks / Plan
                                            </p>
                                            <div className="p-3 bg-gray-50 dark:bg-white/5 rounded-xl border border-gray-100 dark:border-gray-800/60 text-primary dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                                                {report.pendingWork}
                                            </div>
                                        </div>
                                    )}

                                    {/* Issues / Roadblocks */}
                                    {report.issuesFaced && (
                                        <div className="space-y-1.5">
                                            <p className="text-[11px] font-bold text-red-500 uppercase tracking-wider flex items-center gap-1.5">
                                                <AlertTriangle className="w-3.5 h-3.5 text-red-500" />
                                                Issues / Blockers Faced
                                            </p>
                                            <div className="p-3 bg-red-50/50 dark:bg-red-950/20 rounded-xl border border-red-100 dark:border-red-900/40 text-red-700 dark:text-red-300 leading-relaxed whitespace-pre-wrap">
                                                {report.issuesFaced}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
