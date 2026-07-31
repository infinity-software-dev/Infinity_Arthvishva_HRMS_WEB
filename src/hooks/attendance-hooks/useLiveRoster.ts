"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { attendanceService } from "@/services/attendanceService";

export interface LiveRosterItem {
    attendanceId: string;
    employeeId: string;
    employeeCode: string;
    employeeName: string;
    department: string;     // Merged from Employee collection
    designation: string;    // Merged from Employee collection
    avatar?: string;        // Merged from Employee collection
    inTime: string | null;  // ISO Date string or null
    outTime: string | null; // ISO Date string or null
    status: string;         // 'P', 'Half', 'A', etc.
    workMode: string;       // 'Office', 'WFH', 'Field'
    isLate: boolean;
    lateMinutes: number;
    latitude: number | null;
    longitude: number | null;
}

export function useLiveRoster() {
    // 1. Store the COMPLETE list of today's attendance here
    const [allRoster, setAllRoster] = useState<LiveRosterItem[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    // Filter States
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedDepartment, setSelectedDepartment] = useState("");
    const [selectedWorkMode, setSelectedWorkMode] = useState("");

    // 2. Fetch EVERYTHING once when the component mounts
    const fetchFullRoster = useCallback(async () => {
        setLoading(true);
        try {
            // No parameters passed! Fetch everyone.
            const data = await attendanceService.getLiveRoster();
            setAllRoster(data);
        } catch (error) {
            console.error("Failed to fetch full live roster:", error);
            setAllRoster([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchFullRoster();
    }, [fetchFullRoster]);

    // 3. The Magic: Instantly filter the array using useMemo. 
    // This runs in milliseconds on the user's device. No debounce needed!
    const filteredRoster = useMemo(() => {
        return allRoster.filter((emp) => {
            // Search Match (checks name or code, case-insensitive)
            const matchesSearch = searchQuery === "" ||
                emp.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                emp.employeeCode.toLowerCase().includes(searchQuery.toLowerCase());

            // Department Match
            const matchesDept = selectedDepartment === "" || emp.department === selectedDepartment;

            // Work Mode Match
            const matchesMode = selectedWorkMode === "" || emp.workMode === selectedWorkMode;

            return matchesSearch && matchesDept && matchesMode;
        });
    }, [allRoster, searchQuery, selectedDepartment, selectedWorkMode]);

    return {
        // Return the locally filtered array to the UI
        roster: filteredRoster,
        loading,
        filters: {
            searchQuery,
            setSearchQuery,
            selectedDepartment,
            setSelectedDepartment,
            selectedWorkMode,
            setSelectedWorkMode,
        },
        refresh: fetchFullRoster, // Manual refresh button fetches from server again
    };
}