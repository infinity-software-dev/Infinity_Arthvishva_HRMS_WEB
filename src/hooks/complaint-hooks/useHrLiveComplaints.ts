"use client";

import { PopulatedComplaint } from "@/app/dashboard/complaints/HR/HrLiveComplaintsList";
import { complaintService } from "@/services/complaintService";
import { useState, useEffect } from "react";

export function useHrLiveComplaints(searchQuery: string) {
    const [complaints, setComplaints] = useState<PopulatedComplaint[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchComplaints = async () => {
        setIsLoading(true);
        try {
            const data = await complaintService.getHrLiveComplaints({ search: searchQuery });
            setComplaints(data);
        } catch (error) {
            console.error("Failed to fetch live complaints:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const refetch = () => {
        fetchComplaints();
    };

    useEffect(() => {
        fetchComplaints();
    }, [searchQuery]);

    return { complaints, isLoading, refetch };
}