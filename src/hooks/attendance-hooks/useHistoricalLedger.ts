"use client";
import { useState, useEffect, useCallback } from "react";
import { attendanceService } from "@/services/attendanceService";

export interface LedgerItem {
    attendanceId: string;
    date: string;
    employeeName: string;
    employeeCode: string;
    department: string;
    avatar?: string;
    inTime?: string;
    outTime?: string;
    status: string;
    workMode: string;
    totalHours?: number;
    isLate: boolean;
    lateMinutes?: number;
    todayWork?: string;
    pendingWork?: string;
    issuesFaced?: string;

    // ─── ADDED LOCATION FIELDS ───
    latitude?: number | null;
    longitude?: number | null;
    checkOutLatitude?: number | null;
    checkOutLongitude?: number | null;
    locationHistory?: any[]; // Array of { latitude, longitude, timestamp }
}

export interface HistoricalLedgerFilters {
    page: number;
    limit: number;
    search?: string;
    startDate?: string;
    endDate?: string;
    status?: string;
    department?: string;
}

// Define the shape of a paginated response
export interface PaginatedResponse<T> {
    data: T[];
    meta: {
        totalRecords: number;
        totalPages: number;
        currentPage: number;
        limit: number;
    };
}

// Helper to get default date range (Last 1 Month)
const getDefaultDateRange = () => {
    const today = new Date();
    const end = today.toISOString().split("T")[0]; // YYYY-MM-DD

    const lastMonth = new Date(today);
    lastMonth.setMonth(today.getMonth() - 1);
    const start = lastMonth.toISOString().split("T")[0]; // YYYY-MM-DD

    return { start, end };
};

export function useHistoricalLedger() {
    const [data, setData] = useState<LedgerItem[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    // Pagination State
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const [totalRecords, setTotalRecords] = useState(0);

    // Filter States - Initialize dates with our helper
    const defaultDates = getDefaultDateRange();
    const [searchQuery, setSearchQuery] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [startDate, setStartDate] = useState(defaultDates.start);
    const [endDate, setEndDate] = useState(defaultDates.end);
    const [status, setStatus] = useState("");
    const [department, setDepartment] = useState("");

    // Details Modal State
    const [selectedRecord, setSelectedRecord] = useState<LedgerItem | null>(null);

    // Map Modal State
    const [isMapOpen, setIsMapOpen] = useState(false);
    const [selectedMapData, setSelectedMapData] = useState<LedgerItem | null>(null);

    const handleOpenMap = (row: LedgerItem) => {
        setSelectedMapData(row);
        setIsMapOpen(true);
    };

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => setDebouncedSearch(searchQuery), 500);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    // Reset page to 1 when filters change
    useEffect(() => {
        setPage(1);
    }, [debouncedSearch, startDate, endDate, status, department, limit]);

    const fetchLedger = useCallback(async () => {
        // setLoading(true);
        try {
            // Call our clean service method
            const result = await attendanceService.getHistoricalLedger({
                page,
                limit,
                search: debouncedSearch,
                startDate,
                endDate,
                status,
                department
            });

            // Set the states using the strongly-typed result
            setData(result.data);
            setTotalPages(result.meta.totalPages);
            setTotalRecords(result.meta.totalRecords);
        } catch (error) {
            console.error("Failed to fetch historical ledger:", error);
            setData([]);
        } finally {
            setLoading(false);
        }
    }, [page, limit, debouncedSearch, startDate, endDate, status, department]);

    useEffect(() => {
        fetchLedger();
    }, [fetchLedger]);

    return {
        data,
        loading,
        pagination: { page, setPage, limit, setLimit, totalPages, totalRecords },
        filters: {
            searchQuery, setSearchQuery,
            startDate, setStartDate,
            endDate, setEndDate,
            status, setStatus,
            department, setDepartment
        },
        modal: { selectedRecord, setSelectedRecord },
        // ─── EXPORTED MAP MODAL HELPERS ───
        mapModal: { isMapOpen, setIsMapOpen, selectedMapData, setSelectedMapData, handleOpenMap }
    };
}