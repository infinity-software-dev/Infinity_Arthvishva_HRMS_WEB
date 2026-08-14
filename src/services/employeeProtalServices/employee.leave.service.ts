import { EMPLOYEE_API } from "@/constants/API/api";
import apiClient from "@/constants/API/client";

export const portalLeaveService = {
    async getMyLeaves(limit: number = 50): Promise<any> {
        try {
            const response = await apiClient.get(`${EMPLOYEE_API.GET_MY_LEAVES}?limit=${limit}`);
            return response.data?.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.message || "Failed to fetch leave history.");
        }
    },

    async cancelLeave(leaveId: string): Promise<any> {
        try {
            const response = await apiClient.patch(EMPLOYEE_API.CANCEL_LEAVE(leaveId));
            return response.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.message || "Failed to cancel leave.");
        }
    },

    async getActiveTokens(): Promise<any[]> {
        try {
            const response = await apiClient.get(EMPLOYEE_API.GET_ACTIVE_TOKENS);
            return response.data?.data || response.data || [];
        } catch (error: any) {
            throw new Error(error.response?.data?.message || "Failed to load leave tokens.");
        }
    },

    async applyLeave(payload: {
        leaveCategory: string;
        startDate: string;
        endDate: string;
        totalDays: number;
        isHalfDay: boolean;
        halfDayPeriod?: string;
        reason: string;
        consumedLedgerIds: string[];
    }): Promise<any> {
        try {
            const response = await apiClient.post(EMPLOYEE_API.APPLY_LEAVE, payload);
            return response.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.message || "Failed to submit leave application.");
        }
    },
};