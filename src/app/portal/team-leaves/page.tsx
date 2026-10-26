"use client";

import { useState } from "react";
import { useTeamLeaves } from "@/hooks/portal-hooks/leave-hooks/useTeamLeaves";
import {
    Users,
    Clock,
    CheckCircle2,
    XCircle,
    Calendar,
    MessageSquare,
    Check,
    X,
    AlertCircle,
    User,
    RefreshCw,
    Eye
} from "lucide-react";

export default function TeamLeavesPage() {
    const [selectedDetail, setSelectedDetail] = useState<any | null>(null);
    const {
        isLeadership,
        pendingRequests,
        historyRequests,
        paginatedHistory,
        historyPage,
        setHistoryPage,
        historyLimit,
        setHistoryLimit,
        totalHistoryRecords,
        totalHistoryPages,
        loading,
        actionLoadingId,
        activeTab,
        setActiveTab,
        historyStatus,
        setHistoryStatus,
        handleApprove,
        openRejectModal,
        closeRejectModal,
        handleConfirmReject,
        rejectModalOpen,
        rejectRemarks,
        setRejectRemarks,
        refresh,
    } = useTeamLeaves();

    const formatDate = (dateStr: string) => {
        if (!dateStr) return "N/A";
        return new Date(dateStr).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    };

    const getLeaveBadgeStyle = (category: string) => {
        switch (category) {
            case "Sick":
                return "bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400 border-red-200 dark:border-red-500/20";
            case "Casual":
                return "bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400 border-blue-200 dark:border-blue-500/20";
            case "Paid":
                return "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20";
            case "CompOff":
                return "bg-purple-100 text-purple-700 dark:bg-purple-500/10 dark:text-purple-400 border-purple-200 dark:border-purple-500/20";
            default:
                return "bg-gray-100 text-gray-700 dark:bg-white/10 dark:text-gray-300 border-gray-200 dark:border-gray-700";
        }
    };

    const getStatusBadgeStyle = (status: string) => {
        switch (status) {
            case "Approved":
                return "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20";
            case "Rejected":
                return "bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400 border-red-200 dark:border-red-500/20";
            case "Pending":
                return "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400 border-amber-200 dark:border-amber-500/20";
            default:
                return "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400 border-gray-200 dark:border-gray-700";
        }
    };

    if (!isLeadership) {
        return (
            <div className="w-full max-w-4xl mx-auto py-16 px-4">
                <div className="bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 rounded-2xl p-8 text-center flex flex-col items-center">
                    <AlertCircle className="w-12 h-12 text-amber-500 mb-4" />
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Manager Access Required</h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400 max-w-md">
                        This section is reserved for reporting managers and leadership roles. Your account is currently not configured as a reporting supervisor.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full max-w-7xl mx-auto space-y-6 pb-12">
            {/* 1. Header Section */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-brand-blue/10 flex items-center justify-center text-brand-blue">
                            <Users className="w-5 h-5" />
                        </div>
                        <div>
                            <h1 className="text-2xl md:text-[28px] font-black text-primary dark:text-white tracking-tight leading-tight">
                                Team Leave Management
                            </h1>
                            <p className="text-xs font-semibold text-secondary dark:text-gray-400 tracking-wide mt-0.5">
                                Review and approve leave applications submitted by your direct reportees.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={refresh}
                        disabled={loading}
                        className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 dark:bg-white/5 dark:hover:bg-white/10 text-primary dark:text-white rounded-xl text-xs font-bold transition-all flex items-center gap-2 disabled:opacity-50"
                    >
                        <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
                        Refresh
                    </button>
                </div>
            </div>

            {/* 2. Top Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-white dark:bg-primary border border-gray-100 dark:border-gray-800 rounded-2xl p-5 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-xs font-bold text-secondary dark:text-gray-400 uppercase tracking-wider">
                            Pending Requests
                        </p>
                        <h3 className="text-2xl font-black text-amber-500 mt-1">
                            {pendingRequests.length}
                        </h3>
                        <p className="text-[11px] text-gray-500 mt-0.5">Awaiting your approval</p>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500">
                        <Clock className="w-6 h-6" />
                    </div>
                </div>

                <div className="bg-white dark:bg-primary border border-gray-100 dark:border-gray-800 rounded-2xl p-5 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-xs font-bold text-secondary dark:text-gray-400 uppercase tracking-wider">
                            Actioned History
                        </p>
                        <h3 className="text-2xl font-black text-brand-blue mt-1">
                            {historyRequests.length}
                        </h3>
                        <p className="text-[11px] text-gray-500 mt-0.5">Reviewed applications</p>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-brand-blue/10 flex items-center justify-center text-brand-blue">
                        <CheckCircle2 className="w-6 h-6" />
                    </div>
                </div>

                <div className="bg-white dark:bg-primary border border-gray-100 dark:border-gray-800 rounded-2xl p-5 shadow-sm flex items-center justify-between sm:col-span-2 lg:col-span-1">
                    <div>
                        <p className="text-xs font-bold text-secondary dark:text-gray-400 uppercase tracking-wider">
                            Workflow Role
                        </p>
                        <h3 className="text-lg font-black text-emerald-500 mt-1">
                            First-Level Approver
                        </h3>
                        <p className="text-[11px] text-gray-500 mt-0.5">Step 1 of Multi-Tier Workflow</p>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                        <Users className="w-6 h-6" />
                    </div>
                </div>
            </div>

            {/* 3. Navigation Tabs */}
            <div className="border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
                <div className="flex gap-2">
                    <button
                        onClick={() => setActiveTab("pending")}
                        className={`px-5 py-3 text-sm font-bold transition-all relative flex items-center gap-2 ${activeTab === "pending"
                            ? "text-brand-blue dark:text-blue-400"
                            : "text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                            }`}
                    >
                        Pending Approvals
                        {pendingRequests.length > 0 && (
                            <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-amber-500 text-white">
                                {pendingRequests.length}
                            </span>
                        )}
                        {activeTab === "pending" && (
                            <div className="absolute bottom-0 left-0 w-full h-[3px] bg-brand-blue dark:bg-blue-500 rounded-t-full" />
                        )}
                    </button>

                    <button
                        onClick={() => setActiveTab("history")}
                        className={`px-5 py-3 text-sm font-bold transition-all relative flex items-center gap-2 ${activeTab === "history"
                            ? "text-brand-blue dark:text-blue-400"
                            : "text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                            }`}
                    >
                        Approval History
                        {activeTab === "history" && (
                            <div className="absolute bottom-0 left-0 w-full h-[3px] bg-brand-blue dark:bg-blue-500 rounded-t-full" />
                        )}
                    </button>
                </div>

                {/* Status filter for history */}
                {activeTab === "history" && (
                    <div className="flex items-center gap-1.5 pb-2">
                        {["All", "Approved", "Rejected"].map((s) => (
                            <button
                                key={s}
                                onClick={() => setHistoryStatus(s)}
                                className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${historyStatus === s
                                    ? "bg-brand-blue text-white shadow-sm"
                                    : "bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-white/10"
                                    }`}
                            >
                                {s}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* 4. Tab Content */}
            {activeTab === "pending" ? (
                /* ── PENDING REQUESTS INBOX ── */
                <div className="space-y-4">
                    {loading ? (
                        <div className="py-16 text-center text-secondary dark:text-gray-400 font-medium flex flex-col items-center gap-3">
                            <div className="w-7 h-7 border-2 border-brand-blue border-t-transparent rounded-full animate-spin"></div>
                            <p className="text-sm">Fetching team leave requests...</p>
                        </div>
                    ) : pendingRequests.length === 0 ? (
                        <div className="py-16 text-center bg-white dark:bg-primary border border-gray-100 dark:border-gray-800 rounded-2xl p-8 flex flex-col items-center justify-center">
                            <div className="w-14 h-14 rounded-full bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center text-emerald-500 mb-3">
                                <Check className="w-7 h-7" />
                            </div>
                            <h3 className="font-bold text-lg text-primary dark:text-white">All Caught Up!</h3>
                            <p className="text-sm text-secondary dark:text-gray-400 mt-1 max-w-sm">
                                You have no pending leave applications waiting for your approval.
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
                            {pendingRequests.map((req) => {
                                const isActing = actionLoadingId === req._id;
                                const applicant = req.employeeId;

                                return (
                                    <div
                                        key={req._id}
                                        className="bg-white dark:bg-primary border border-gray-100 dark:border-gray-800 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between"
                                    >
                                        <div>
                                            {/* Employee info header */}
                                            <div className="flex items-start justify-between gap-3 mb-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-11 h-11 rounded-full bg-gray-100 dark:bg-white/5 flex items-center justify-center overflow-hidden border border-gray-200 dark:border-gray-700 shrink-0">
                                                        {applicant?.profileImageUrl ? (
                                                            <img
                                                                src={applicant.profileImageUrl}
                                                                alt={applicant?.name || "Employee"}
                                                                className="w-full h-full object-cover"
                                                            />
                                                        ) : (
                                                            <span className="text-sm font-black text-brand-blue">
                                                                {applicant?.name?.charAt(0) || "E"}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <h3 className="font-bold text-primary dark:text-white text-base leading-tight">
                                                            {applicant?.name || "Team Member"}
                                                        </h3>
                                                        <p className="text-xs font-semibold text-secondary dark:text-gray-400 mt-0.5">
                                                            {applicant?.position || "Employee"} {applicant?.employeeCode ? `• ${applicant.employeeCode}` : ""}
                                                        </p>
                                                    </div>
                                                </div>

                                                <span
                                                    className={`px-3 py-1 rounded-full text-xs font-bold border ${getLeaveBadgeStyle(
                                                        req.leaveCategory
                                                    )}`}
                                                >
                                                    {req.leaveCategory} Leave
                                                </span>
                                            </div>

                                            {/* Leave duration & details */}
                                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-3.5 bg-gray-50 dark:bg-white/5 rounded-xl border border-gray-100 dark:border-gray-800 mb-4 text-xs font-semibold">
                                                <div>
                                                    <p className="text-gray-400 uppercase text-[10px] tracking-wider mb-0.5">Start Date</p>
                                                    <p className="text-primary dark:text-white font-bold">{formatDate(req.startDate)}</p>
                                                </div>
                                                <div>
                                                    <p className="text-gray-400 uppercase text-[10px] tracking-wider mb-0.5">End Date</p>
                                                    <p className="text-primary dark:text-white font-bold">{formatDate(req.endDate)}</p>
                                                </div>
                                                <div>
                                                    <p className="text-gray-400 uppercase text-[10px] tracking-wider mb-0.5">Duration</p>
                                                    <p className="text-brand-blue font-bold">
                                                        {req.totalDays} Day{req.totalDays > 1 ? "s" : ""}{" "}
                                                        {req.isHalfDay ? `(${req.halfDayPeriod || "Half Day"})` : ""}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Reason */}
                                            <div className="mb-5">
                                                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                                                    <MessageSquare className="w-3.5 h-3.5" />
                                                    Reason for leave
                                                </p>
                                                <p className="text-xs font-medium text-gray-700 dark:text-gray-300 bg-gray-50/50 dark:bg-white/[0.02] p-3 rounded-lg border border-gray-100 dark:border-gray-800/50 italic">
                                                    "{req.reason || "No reason specified"}"
                                                </p>
                                            </div>
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="pt-3 border-t border-gray-100 dark:border-gray-800/80 flex items-center justify-between gap-3">
                                            <span className="text-[11px] text-gray-400 font-medium">
                                                Applied on {formatDate(req.createdAt)}
                                            </span>

                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => openRejectModal(req._id)}
                                                    disabled={isActing}
                                                    className="px-3.5 py-2 border border-red-200 dark:border-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 disabled:opacity-50"
                                                >
                                                    <X className="w-3.5 h-3.5" />
                                                    Reject
                                                </button>

                                                <button
                                                    onClick={() => handleApprove(req._id)}
                                                    disabled={isActing}
                                                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/20 transition-all flex items-center gap-1.5 disabled:opacity-50"
                                                >
                                                    {isActing ? (
                                                        <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                    ) : (
                                                        <Check className="w-3.5 h-3.5" />
                                                    )}
                                                    Approve
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            ) : (
                /* ── APPROVAL HISTORY ── */
                <div className="space-y-3">
                    {loading ? (
                        <div className="py-16 text-center text-secondary dark:text-gray-400 font-medium flex flex-col items-center gap-3">
                            <div className="w-7 h-7 border-2 border-brand-blue border-t-transparent rounded-full animate-spin"></div>
                            <p className="text-sm">Fetching approval history...</p>
                        </div>
                    ) : historyRequests.length === 0 ? (
                        <div className="py-16 text-center bg-white dark:bg-primary border border-gray-100 dark:border-gray-800 rounded-2xl p-8">
                            <Calendar className="w-10 h-10 text-gray-400 mx-auto mb-2 opacity-50" />
                            <h3 className="font-bold text-base text-primary dark:text-white">No Records Found</h3>
                            <p className="text-xs text-secondary dark:text-gray-400 mt-1">
                                No processed leave applications matching the filter.
                            </p>
                        </div>
                    ) : (
                        <div className="bg-white dark:bg-primary border border-gray-100 dark:border-gray-800 rounded-2xl overflow-hidden shadow-sm">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-xs">
                                    <thead className="bg-gray-50 dark:bg-white/5 border-b border-gray-100 dark:border-gray-800 text-gray-500 uppercase tracking-wider font-bold">
                                        <tr>
                                            <th className="py-3.5 px-4">Employee</th>
                                            <th className="py-3.5 px-4">Category</th>
                                            <th className="py-3.5 px-4">Dates</th>
                                            <th className="py-3.5 px-4">Duration</th>
                                            <th className="py-3.5 px-4">Status</th>
                                            <th className="py-3.5 px-4">Manager Remarks</th>
                                            <th className="py-3.5 px-4">Processed Date</th>
                                            <th className="py-3.5 px-4 text-right">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100 dark:divide-gray-800/50">
                                        {paginatedHistory.map((req) => {
                                            const applicant = req.employeeId;
                                            const managerRemarks = req.workflowSteps?.find((s: any) => s.remarks)?.remarks;

                                            return (
                                                <tr
                                                    key={req._id}
                                                    onClick={() => setSelectedDetail(req)}
                                                    className="hover:bg-gray-50/70 dark:hover:bg-white/[0.03] transition-colors cursor-pointer group"
                                                >
                                                    <td className="py-3.5 px-4">
                                                        <div className="flex items-center gap-2.5">
                                                            <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-white/5 flex items-center justify-center font-bold text-xs text-primary dark:text-white shrink-0 overflow-hidden border border-gray-200 dark:border-gray-700">
                                                                {applicant?.profileImageUrl ? (
                                                                    <img src={applicant.profileImageUrl} alt="" className="w-full h-full object-cover" />
                                                                ) : (
                                                                    applicant?.name?.charAt(0) || "E"
                                                                )}
                                                            </div>
                                                            <div>
                                                                <p className="font-bold text-primary dark:text-white text-xs group-hover:text-brand-blue transition-colors">
                                                                    {applicant?.name || "Employee"}
                                                                </p>
                                                                <p className="text-[10px] text-gray-400">{applicant?.position || ""}</p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="py-3.5 px-4">
                                                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getLeaveBadgeStyle(req.leaveCategory)}`}>
                                                            {req.leaveCategory}
                                                        </span>
                                                    </td>
                                                    <td className="py-3.5 px-4 font-semibold text-gray-700 dark:text-gray-300">
                                                        {formatDate(req.startDate)} - {formatDate(req.endDate)}
                                                    </td>
                                                    <td className="py-3.5 px-4 font-bold text-brand-blue">
                                                        {req.totalDays} Day{req.totalDays > 1 ? "s" : ""}
                                                    </td>
                                                    <td className="py-3.5 px-4">
                                                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getStatusBadgeStyle(req.overallStatus)}`}>
                                                            {req.overallStatus}
                                                        </span>
                                                    </td>
                                                    <td className="py-3.5 px-4 max-w-[200px]">
                                                        {managerRemarks ? (
                                                            <span
                                                                className={`inline-block text-[11px] font-semibold px-2.5 py-1 rounded-lg border truncate max-w-full ${
                                                                    req.overallStatus === "Rejected"
                                                                        ? "bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400 border-red-200 dark:border-red-900/30"
                                                                        : "bg-gray-50 text-gray-700 dark:bg-white/5 dark:text-gray-300 border-gray-100 dark:border-gray-800"
                                                                }`}
                                                                title={managerRemarks}
                                                            >
                                                                "{managerRemarks}"
                                                            </span>
                                                        ) : (
                                                            <span className="text-gray-400 font-medium">-</span>
                                                        )}
                                                    </td>
                                                    <td className="py-3.5 px-4 text-gray-400 font-medium whitespace-nowrap">
                                                        {formatDate(req.updatedAt || req.createdAt)}
                                                    </td>
                                                    <td className="py-3.5 px-4 text-right">
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setSelectedDetail(req);
                                                            }}
                                                            className="px-2.5 py-1 rounded-lg bg-gray-100 dark:bg-white/5 hover:bg-brand-blue hover:text-white dark:hover:bg-brand-blue text-gray-600 dark:text-gray-300 text-xs font-bold transition-all inline-flex items-center gap-1"
                                                        >
                                                            <Eye className="w-3 h-3" />
                                                            View
                                                        </button>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination Bar */}
                            {totalHistoryRecords > 0 && (
                                <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-secondary dark:text-gray-400 gap-4 p-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-white/[0.02]">
                                    <div className="font-medium">
                                        Showing <span className="font-bold text-primary dark:text-white">{(historyPage - 1) * historyLimit + 1}</span> to{" "}
                                        <span className="font-bold text-primary dark:text-white">{Math.min(historyPage * historyLimit, totalHistoryRecords)}</span> of{" "}
                                        <span className="font-bold text-primary dark:text-white">{totalHistoryRecords}</span> records
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <select
                                            value={historyLimit}
                                            onChange={(e) => {
                                                setHistoryLimit(Number(e.target.value));
                                                setHistoryPage(1);
                                            }}
                                            className="px-2.5 py-1.5 border border-gray-200 dark:border-gray-800 rounded-xl bg-white dark:bg-primary text-primary dark:text-white text-xs font-semibold focus:outline-none transition-colors"
                                        >
                                            <option value={5}>5 per page</option>
                                            <option value={10}>10 per page</option>
                                            <option value={20}>20 per page</option>
                                            <option value={50}>50 per page</option>
                                        </select>

                                        <div className="flex items-center gap-1.5">
                                            <button
                                                disabled={historyPage === 1}
                                                onClick={() => setHistoryPage((p) => Math.max(1, p - 1))}
                                                className="px-3 py-1.5 border border-gray-200 dark:border-gray-800 rounded-xl disabled:opacity-40 text-primary dark:text-white hover:bg-gray-100 dark:hover:bg-white/5 text-xs font-bold transition-all disabled:hover:bg-transparent"
                                            >
                                                Prev
                                            </button>

                                            <div className="flex items-center gap-1">
                                                {Array.from({ length: totalHistoryPages }, (_, idx) => idx + 1)
                                                    .filter((p) => {
                                                        if (totalHistoryPages <= 5) return true;
                                                        return Math.abs(p - historyPage) <= 1 || p === 1 || p === totalHistoryPages;
                                                    })
                                                    .map((p, idx, arr) => {
                                                        const prev = arr[idx - 1];
                                                        const showEllipsis = prev && p - prev > 1;

                                                        return (
                                                            <div key={p} className="flex items-center">
                                                                {showEllipsis && <span className="px-1 text-gray-400">...</span>}
                                                                <button
                                                                    onClick={() => setHistoryPage(p)}
                                                                    className={`w-7 h-7 rounded-lg text-xs font-bold transition-all ${
                                                                        historyPage === p
                                                                            ? "bg-brand-blue text-white shadow-sm"
                                                                            : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5"
                                                                    }`}
                                                                >
                                                                    {p}
                                                                </button>
                                                            </div>
                                                        );
                                                    })}
                                            </div>

                                            <button
                                                disabled={historyPage >= totalHistoryPages}
                                                onClick={() => setHistoryPage((p) => Math.min(totalHistoryPages, p + 1))}
                                                className="px-3 py-1.5 border border-gray-200 dark:border-gray-800 rounded-xl disabled:opacity-40 text-primary dark:text-white hover:bg-gray-100 dark:hover:bg-white/5 text-xs font-bold transition-all disabled:hover:bg-transparent"
                                            >
                                                Next
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}

            {/* 5. Reject Confirmation Modal */}
            {rejectModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-[#121212] border border-gray-200 dark:border-gray-800 rounded-2xl w-full max-w-md p-6 shadow-2xl">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2.5 text-red-600 dark:text-red-400 font-bold">
                                <XCircle className="w-5 h-5" />
                                <h3>Reject Leave Application</h3>
                            </div>
                            <button
                                onClick={closeRejectModal}
                                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                            Please explain why this leave application is being rejected. Your remarks will be shared with the employee.
                        </p>

                        <div className="mb-5">
                            <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block mb-1.5">
                                Remarks / Reason <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                value={rejectRemarks}
                                onChange={(e) => setRejectRemarks(e.target.value)}
                                rows={3}
                                placeholder="e.g. Critical project delivery scheduled during this timeframe..."
                                className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-gray-800 rounded-xl p-3 text-xs text-primary dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-blue resize-none"
                            />
                        </div>

                        <div className="flex items-center justify-end gap-2.5">
                            <button
                                onClick={closeRejectModal}
                                className="px-4 py-2 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 rounded-xl text-xs font-bold hover:bg-gray-100 dark:hover:bg-white/5 transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleConfirmReject}
                                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold shadow-md shadow-red-600/20 transition-all flex items-center gap-1.5"
                            >
                                Confirm Rejection
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* 6. Leave Details Modal */}
            {selectedDetail && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-[#121212] border border-gray-200 dark:border-gray-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl space-y-5 max-h-[85vh] overflow-y-auto">
                        <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-gray-800">
                            <div>
                                <h3 className="text-base font-bold text-primary dark:text-white">Leave Application Details</h3>
                                <p className="text-[11px] text-gray-500 mt-0.5">Full audit details and manager decision</p>
                            </div>
                            <button
                                onClick={() => setSelectedDetail(null)}
                                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-1 rounded-lg"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Applicant Card */}
                        <div className="flex items-center justify-between p-3.5 bg-gray-50 dark:bg-white/5 rounded-xl border border-gray-100 dark:border-gray-800">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-white dark:bg-primary flex items-center justify-center font-bold text-sm text-brand-blue border border-gray-200 dark:border-gray-700 overflow-hidden shrink-0">
                                    {selectedDetail.employeeId?.profileImageUrl ? (
                                        <img src={selectedDetail.employeeId.profileImageUrl} alt="" className="w-full h-full object-cover" />
                                    ) : (
                                        selectedDetail.employeeId?.name?.charAt(0) || "E"
                                    )}
                                </div>
                                <div>
                                    <h4 className="font-bold text-primary dark:text-white text-sm">{selectedDetail.employeeId?.name || "Employee"}</h4>
                                    <p className="text-xs text-gray-400">{selectedDetail.employeeId?.position || "Employee"} {selectedDetail.employeeId?.employeeCode ? `• ${selectedDetail.employeeId.employeeCode}` : ""}</p>
                                </div>
                            </div>
                            <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${getStatusBadgeStyle(selectedDetail.overallStatus)}`}>
                                {selectedDetail.overallStatus}
                            </span>
                        </div>

                        {/* Info Grid */}
                        <div className="grid grid-cols-2 gap-3 text-xs">
                            <div className="p-3 bg-gray-50 dark:bg-white/5 rounded-xl border border-gray-100 dark:border-gray-800">
                                <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-1">Leave Category</p>
                                <p className="font-bold text-primary dark:text-white">{selectedDetail.leaveCategory} Leave</p>
                            </div>
                            <div className="p-3 bg-gray-50 dark:bg-white/5 rounded-xl border border-gray-100 dark:border-gray-800">
                                <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-1">Duration</p>
                                <p className="font-bold text-brand-blue">
                                    {selectedDetail.totalDays} Day{selectedDetail.totalDays > 1 ? "s" : ""}{" "}
                                    {selectedDetail.isHalfDay && `(${selectedDetail.halfDayPeriod || "Half Day"})`}
                                </p>
                            </div>
                            <div className="p-3 bg-gray-50 dark:bg-white/5 rounded-xl border border-gray-100 dark:border-gray-800">
                                <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-1">Dates</p>
                                <p className="font-bold text-primary dark:text-white">
                                    {formatDate(selectedDetail.startDate)} - {formatDate(selectedDetail.endDate)}
                                </p>
                            </div>
                            <div className="p-3 bg-gray-50 dark:bg-white/5 rounded-xl border border-gray-100 dark:border-gray-800">
                                <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-1">Applied Date</p>
                                <p className="font-bold text-primary dark:text-white">{formatDate(selectedDetail.createdAt)}</p>
                            </div>
                        </div>

                        {/* Reason for Leave */}
                        <div>
                            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                                <MessageSquare className="w-3.5 h-3.5" />
                                Reason for Application
                            </p>
                            <div className="p-3 bg-gray-50 dark:bg-white/5 rounded-xl border border-gray-100 dark:border-gray-800 text-xs text-primary dark:text-gray-300 italic">
                                "{selectedDetail.reason || "No reason specified"}"
                            </div>
                        </div>

                        {/* Manager Remarks Block */}
                        {(() => {
                            const remarks = selectedDetail.workflowSteps?.find((s: any) => s.remarks)?.remarks;
                            const isRejected = selectedDetail.overallStatus === "Rejected";

                            if (remarks) {
                                return (
                                    <div>
                                        <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                                            <AlertCircle className={`w-3.5 h-3.5 ${isRejected ? "text-red-500" : "text-brand-blue"}`} />
                                            {isRejected ? "Manager Rejection Remarks" : "Manager Decision Remarks"}
                                        </p>
                                        <div
                                            className={`p-3.5 rounded-xl border text-xs font-medium ${
                                                isRejected
                                                    ? "bg-red-50 dark:bg-red-500/10 border-red-200 dark:border-red-900/30 text-red-700 dark:text-red-300"
                                                    : "bg-blue-50 dark:bg-blue-500/10 border-blue-200 dark:border-blue-900/30 text-blue-700 dark:text-blue-300"
                                            }`}
                                        >
                                            "{remarks}"
                                        </div>
                                    </div>
                                );
                            }

                            return (
                                <div className="text-[11px] text-gray-400 italic">
                                    No special manager remarks recorded for this application.
                                </div>
                            );
                        })()}

                        <div className="pt-2 flex justify-end">
                            <button
                                onClick={() => setSelectedDetail(null)}
                                className="px-5 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-white/5 dark:hover:bg-white/10 text-primary dark:text-white rounded-xl text-xs font-bold transition-all"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
