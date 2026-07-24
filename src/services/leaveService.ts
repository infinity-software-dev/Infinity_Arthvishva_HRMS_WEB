// src/services/leaveService.ts
import { HR_API, DIRECTOR_API } from "@/constants/API/api";
import apiClient from "@/constants/API/client";
import { PendingLeaveItem } from "@/hooks/leave-hooks/useLeaveInbox";

// Helper to dynamically get the right endpoints
const getEndpoints = () => {
    // Ensure we are in the browser before checking localStorage
    if (typeof window !== "undefined") {
        const role = localStorage.getItem("role");
        if (role === "DIRECTOR") {
            return DIRECTOR_API;
        }
    }
    return HR_API; // Default fallback
};

export const leaveService = {
    async getPendingLeaves(): Promise<PendingLeaveItem[]> {
        const ENDPOINTS = getEndpoints();
        const response = await apiClient.get(ENDPOINTS.GET_PENDING_LEAVES);
        return response.data.data;
    },

    async approveLeave(leaveId: string): Promise<void> {
        const ENDPOINTS = getEndpoints();
        try {
            await apiClient.patch(ENDPOINTS.APPROVE_LEAVE(leaveId));
        } catch (error: any) {
            // Format the error into a clean string for the UI
            const errorMessage = error.response?.data?.message || "Failed to approve leave";

            // You MUST throw it again so the Hook catches it
            throw new Error(errorMessage);
        }
    },

    async rejectLeave(leaveId: string, remarks: string): Promise<void> {
        const ENDPOINTS = getEndpoints();
        await apiClient.patch(ENDPOINTS.REJECT_LEAVE(leaveId), { remarks });
    },

    async getHistoricalLeaves(filters: any) {
        const ENDPOINTS = getEndpoints();
        const params = new URLSearchParams({
            page: filters.page.toString(),
            limit: filters.limit.toString(),
        });

        if (filters.search) params.append('search', filters.search);
        if (filters.startDate) params.append('startDate', filters.startDate);
        if (filters.endDate) params.append('endDate', filters.endDate);
        if (filters.status) params.append('status', filters.status);
        if (filters.department) params.append('department', filters.department);

        const response = await apiClient.get(`${ENDPOINTS.GET_HISTORICAL_LEAVES}?${params.toString()}`);
        return { data: response.data.data, meta: response.data.meta };
    }
};