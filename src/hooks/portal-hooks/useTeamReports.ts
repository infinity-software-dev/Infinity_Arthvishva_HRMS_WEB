"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { managerService, TeamWorkReport } from "@/services/managerService";
import { portalService } from "@/services/employeeProtalServices/employee.overview.service";

// Helper to format Date to 'YYYY-MM-DD'
const getTodayDateString = (): string => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
};

export function useTeamReports() {
    const [selectedDate, setSelectedDate] = useState<string>(getTodayDateString());
    const [reports, setReports] = useState<TeamWorkReport[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
    const [isLeadership, setIsLeadership] = useState<boolean>(true);
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [filterStatus, setFilterStatus] = useState<"All" | "Reviewed" | "PendingReview">("All");

    // 1. Resolve manager identity & leadership status on mount
    useEffect(() => {
        const checkLeadership = async () => {
            try {
                const rawUser = localStorage.getItem("user");
                if (rawUser) {
                    try {
                        const parsed = JSON.parse(rawUser);
                        if (parsed?.isLeadershipRole !== undefined) {
                            setIsLeadership(parsed.isLeadershipRole);
                        }
                    } catch (e) {
                        console.error("Error reading cached user", e);
                    }
                }

                const profile = await portalService.getProfileData();
                if (profile?.isLeadershipRole !== undefined) {
                    setIsLeadership(!!profile.isLeadershipRole);
                }
            } catch (err) {
                console.error("Error checking leadership role:", err);
            }
        };

        checkLeadership();
    }, []);

    // 2. Fetch team work reports for the selected date
    const fetchReports = useCallback(async (date: string) => {
        setLoading(true);
        try {
            const data = await managerService.getTeamReports(date);
            setReports(data || []);
        } catch (err) {
            console.error("Error fetching team reports:", err);
            setReports([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchReports(selectedDate);
    }, [selectedDate, fetchReports]);

    // 3. Toggle read / reviewed status
    const toggleReadStatus = async (reportId: string, currentStatus: boolean) => {
        setActionLoadingId(reportId);
        const newStatus = !currentStatus;

        // Optimistic UI update
        setReports((prev) =>
            prev.map((r) => (r._id === reportId ? { ...r, isReportRead: newStatus } : r))
        );

        try {
            await managerService.updateReportReadStatus(reportId, newStatus);
        } catch (err: any) {
            console.error("Failed to update report read status:", err);
            alert(err.message || "Failed to update report status.");
            // Revert on failure
            setReports((prev) =>
                prev.map((r) => (r._id === reportId ? { ...r, isReportRead: currentStatus } : r))
            );
        } finally {
            setActionLoadingId(null);
        }
    };

    // 4. Computed metrics & filtered records
    const metrics = useMemo(() => {
        const total = reports.length;
        const reviewed = reports.filter((r) => r.isReportRead).length;
        const pending = total - reviewed;
        return { total, reviewed, pending };
    }, [reports]);

    const filteredReports = useMemo(() => {
        return reports.filter((r) => {
            const employeeName = r.employeeId?.name || r.reportParticipant?.name || "";
            const matchesSearch = employeeName.toLowerCase().includes(searchQuery.toLowerCase());

            if (!matchesSearch) return false;

            if (filterStatus === "Reviewed") return r.isReportRead === true;
            if (filterStatus === "PendingReview") return r.isReportRead === false;

            return true;
        });
    }, [reports, searchQuery, filterStatus]);

    return {
        selectedDate,
        setSelectedDate,
        reports: filteredReports,
        rawReportsCount: reports.length,
        loading,
        actionLoadingId,
        isLeadership,
        searchQuery,
        setSearchQuery,
        filterStatus,
        setFilterStatus,
        metrics,
        toggleReadStatus,
        refresh: () => fetchReports(selectedDate),
    };
}
