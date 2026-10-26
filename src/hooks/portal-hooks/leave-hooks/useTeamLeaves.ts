"use client";

import { useState, useEffect, useCallback } from "react";
import { managerService, TeamLeaveRequest } from "@/services/managerService";
import { portalService } from "@/services/employeeProtalServices/employee.overview.service";

export function useTeamLeaves() {
    const [managerId, setManagerId] = useState<string>("");
    const [isLeadership, setIsLeadership] = useState<boolean>(true);
    const [pendingRequests, setPendingRequests] = useState<TeamLeaveRequest[]>([]);
    const [historyRequests, setHistoryRequests] = useState<TeamLeaveRequest[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

    // Active tab: 'pending' or 'history'
    const [activeTab, setActiveTab] = useState<'pending' | 'history'>('pending');
    // History filter status: 'All' | 'Approved' | 'Rejected'
    const [historyStatus, setHistoryStatus] = useState<string>('All');

    // Pagination for history
    const [historyPage, setHistoryPage] = useState<number>(1);
    const [historyLimit, setHistoryLimit] = useState<number>(10);

    // Reject Modal state
    const [rejectModalOpen, setRejectModalOpen] = useState<boolean>(false);
    const [selectedLeaveId, setSelectedLeaveId] = useState<string | null>(null);
    const [rejectRemarks, setRejectRemarks] = useState<string>("");

    // 1. Resolve managerId on mount
    useEffect(() => {
        const resolveUser = async () => {
            try {
                let id = "";
                const rawUser = localStorage.getItem("user");
                if (rawUser) {
                    try {
                        const parsed = JSON.parse(rawUser);
                        if (parsed?._id) id = parsed._id;
                        if (parsed?.isLeadershipRole !== undefined) {
                            setIsLeadership(parsed.isLeadershipRole);
                        }
                    } catch (e) {
                        console.error("Failed to parse cached user", e);
                    }
                }

                if (!id) {
                    const profile = await portalService.getProfileData();
                    if (profile?._id) {
                        id = profile._id;
                        setIsLeadership(!!profile.isLeadershipRole);
                        localStorage.setItem("user", JSON.stringify(profile));
                    }
                }

                setManagerId(id);
            } catch (err) {
                console.error("Error resolving manager profile:", err);
            }
        };

        resolveUser();
    }, []);

    // 2. Fetch pending requests
    const fetchPending = useCallback(async (mId: string) => {
        if (!mId) return;
        try {
            setLoading(true);
            const data = await managerService.getDetailedRequests(mId);
            setPendingRequests(data || []);
        } catch (error) {
            console.error("Failed to fetch pending team leaves:", error);
            setPendingRequests([]);
        } finally {
            setLoading(false);
        }
    }, []);

    // 3. Fetch history
    const fetchHistory = useCallback(async (mId: string, status: string) => {
        if (!mId) return;
        try {
            setLoading(true);
            const data = await managerService.getRequestsHistory(mId, 1, 500, status);
            setHistoryRequests(data || []);
            setHistoryPage(1); // Reset to page 1 on new filter/fetch
        } catch (error) {
            console.error("Failed to fetch team leave history:", error);
            setHistoryRequests([]);
        } finally {
            setLoading(false);
        }
    }, []);

    // Trigger fetch on tab or filter change
    useEffect(() => {
        if (!managerId) return;

        if (activeTab === 'pending') {
            fetchPending(managerId);
        } else {
            fetchHistory(managerId, historyStatus);
        }
    }, [managerId, activeTab, historyStatus, fetchPending, fetchHistory]);

    // 4. Handle Manager Approval
    const handleApprove = async (leaveId: string) => {
        if (!managerId) return;
        setActionLoadingId(leaveId);

        const prevRequests = [...pendingRequests];
        // Optimistic removal
        setPendingRequests((prev) => prev.filter((r) => r._id !== leaveId));

        try {
            await managerService.approveLeave(managerId, leaveId);
            // Refresh history in background
            fetchHistory(managerId, historyStatus);
        } catch (err: any) {
            console.error("Failed to approve leave:", err);
            alert(err.message || "Failed to approve leave. Please try again.");
            setPendingRequests(prevRequests); // Revert
        } finally {
            setActionLoadingId(null);
        }
    };

    // 5. Open Rejection Modal
    const openRejectModal = (leaveId: string) => {
        setSelectedLeaveId(leaveId);
        setRejectRemarks("");
        setRejectModalOpen(true);
    };

    const closeRejectModal = () => {
        setSelectedLeaveId(null);
        setRejectRemarks("");
        setRejectModalOpen(false);
    };

    // 6. Confirm Manager Rejection
    const handleConfirmReject = async () => {
        if (!managerId || !selectedLeaveId) return;
        if (!rejectRemarks.trim()) {
            alert("Please provide a reason/remark for rejection.");
            return;
        }

        const leaveId = selectedLeaveId;
        setActionLoadingId(leaveId);
        const prevRequests = [...pendingRequests];
        setPendingRequests((prev) => prev.filter((r) => r._id !== leaveId));
        closeRejectModal();

        try {
            await managerService.rejectLeave(managerId, leaveId, rejectRemarks.trim());
            fetchHistory(managerId, historyStatus);
        } catch (err: any) {
            console.error("Failed to reject leave:", err);
            alert(err.message || "Failed to reject leave.");
            setPendingRequests(prevRequests); // Revert
        } finally {
            setActionLoadingId(null);
        }
    };

    const refresh = () => {
        if (managerId) {
            if (activeTab === 'pending') fetchPending(managerId);
            else fetchHistory(managerId, historyStatus);
        }
    };

    // Pagination calculations
    const totalHistoryRecords = historyRequests.length;
    const totalHistoryPages = Math.ceil(totalHistoryRecords / historyLimit) || 1;
    const paginatedHistory = historyRequests.slice(
        (historyPage - 1) * historyLimit,
        historyPage * historyLimit
    );

    return {
        managerId,
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
    };
}
