import { HR_API, MANAGEMENT_API } from "@/constants/API/api";
import apiClient from "@/constants/API/client";
import { PendingCorrectionItem } from "@/hooks/attendance-hooks/usePendingCorrections";
import { LiveRosterItem } from "@/hooks/attendance-hooks/useLiveRoster";
import { HistoricalLedgerFilters, LedgerItem, PaginatedResponse } from "@/hooks/attendance-hooks/useHistoricalLedger";
import { logToTerminal } from "@/utils/terminalLogger";

export const attendanceService = {
    async getPendingCorrectionsCount(): Promise<number> {
        const response = await apiClient.get(MANAGEMENT_API.GET_PENDING_CORRECTIONS_COUNT);
        return response.data.data.count || 0;
    },

    async getLiveRoster(filters?: { department?: string; workMode?: string; search?: string }): Promise<LiveRosterItem[]> {
        const params = new URLSearchParams();
        if (filters?.department) params.append('department', filters.department);
        if (filters?.workMode) params.append('workMode', filters.workMode);
        if (filters?.search) params.append('search', filters.search);

        const response = await apiClient.get(`${MANAGEMENT_API.GET_LIVE_ROSTER}?${params.toString()}`);
        return response.data.data;
    },

    // UPDATED: Now accepts a status parameter (defaults to Pending)
    async getCorrections(status: 'Pending' | 'Resolved' = 'Pending'): Promise<PendingCorrectionItem[]> {
        const response = await apiClient.get(`${MANAGEMENT_API.GET_CORRECTIONS}?status=${status}`);
        return response.data.data;
    },

    async approveCorrection(attendanceId: string): Promise<void> {
        await apiClient.patch(HR_API.APPROVE_CORRECTION(attendanceId));
    },

    async rejectCorrection(attendanceId: string, remark: string): Promise<void> {
        await apiClient.patch(HR_API.REJECT_CORRECTION(attendanceId), {
            remark: remark
        });
    },

    async getHistoricalLedger(filters: HistoricalLedgerFilters): Promise<PaginatedResponse<LedgerItem>> {
        const params = new URLSearchParams({
            page: filters.page.toString(),
            limit: filters.limit.toString(),
        });

        if (filters.search) params.append('search', filters.search);
        if (filters.startDate) params.append('startDate', filters.startDate);
        if (filters.endDate) params.append('endDate', filters.endDate);
        if (filters.status) params.append('status', filters.status);
        if (filters.department) params.append('department', filters.department);

        const response = await apiClient.get(`${MANAGEMENT_API.GET_HISTORICAL_LEDGER}?${params.toString()}`);

        // await logToTerminal(response.data);

        // Return both the data array and the meta object for pagination
        return {
            data: response.data.data,
            meta: response.data.meta
        };
    }
};