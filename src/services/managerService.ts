import apiClient from "@/constants/API/client";
import { MANAGER_API } from "@/constants/API/api";

export interface TeamLeaveRequest {
    _id: string;
    employeeId: {
        _id: string;
        name: string;
        position?: string;
        profileImageUrl?: string;
        department?: string;
        employeeCode?: string;
    };
    leaveCategory: string; // 'Sick' | 'Casual' | 'Paid' | 'CompOff' etc.
    startDate: string;
    endDate: string;
    totalDays: number;
    isHalfDay: boolean;
    halfDayPeriod?: string;
    reason: string;
    overallStatus: 'Pending' | 'Approved' | 'Rejected' | 'Cancelled';
    workflowSteps?: {
        approverId?: string;
        status: string;
        actedById?: string;
        remarks?: string;
        updatedAt?: string;
    }[];
    createdAt: string;
    updatedAt: string;
}

export interface ManagerApprovalMetrics {
    isLeadership: boolean;
    pendingApprovalsCount: number;
}

export const managerService = {
    // 1. Fetch metrics (isLeadership flag & pending count)
    async getApprovalMetrics(managerId: string): Promise<ManagerApprovalMetrics> {
        const response = await apiClient.get(MANAGER_API.GET_APPROVAL_METRICS(managerId));
        return response.data?.data || response.data;
    },

    // 2. Fetch pending leave requests for direct reports
    async getDetailedRequests(managerId: string): Promise<TeamLeaveRequest[]> {
        const response = await apiClient.get(MANAGER_API.GET_DETAILED_REQUESTS(managerId));
        return response.data?.data || response.data || [];
    },

    // 3. Fetch historically actioned requests by this manager
    async getRequestsHistory(
        managerId: string,
        page = 1,
        limit = 10,
        status?: string
    ): Promise<TeamLeaveRequest[]> {
        const params = new URLSearchParams({
            page: page.toString(),
            limit: limit.toString(),
        });
        if (status && status !== 'All') {
            params.append('status', status);
        }

        const response = await apiClient.get(
            `${MANAGER_API.GET_REQUESTS_HISTORY(managerId)}?${params.toString()}`
        );
        return response.data?.data || response.data || [];
    },

    // 4. Manager approves leave step
    async approveLeave(managerId: string, leaveId: string): Promise<any> {
        try {
            const response = await apiClient.patch(
                MANAGER_API.APPROVE_LEAVE(managerId, leaveId)
            );
            return response.data;
        } catch (error: any) {
            const message = error.response?.data?.message || "Failed to approve leave";
            throw new Error(message);
        }
    },

    // 5. Manager rejects leave step
    async rejectLeave(managerId: string, leaveId: string, remarks: string): Promise<any> {
        try {
            const response = await apiClient.patch(
                MANAGER_API.REJECT_LEAVE(managerId, leaveId),
                { remarks }
            );
            return response.data;
        } catch (error: any) {
            const message = error.response?.data?.message || "Failed to reject leave";
            throw new Error(message);
        }
    },

    // 6. Fetch team daily work reports for a specific date (YYYY-MM-DD)
    async getTeamReports(date: string): Promise<TeamWorkReport[]> {
        try {
            const response = await apiClient.get(MANAGER_API.GET_TEAM_REPORTS(date));
            return response.data?.data || response.data || [];
        } catch (error: any) {
            console.error("Failed to fetch team work reports:", error);
            return [];
        }
    },

    // 7. Update read/reviewed status of a work report
    async updateReportReadStatus(reportId: string, isReportRead: boolean): Promise<any> {
        try {
            const response = await apiClient.patch(
                MANAGER_API.UPDATE_REPORT_READ_STATUS(reportId),
                { isReportRead }
            );
            return response.data;
        } catch (error: any) {
            const message = error.response?.data?.message || "Failed to update report status";
            throw new Error(message);
        }
    },
};

export interface TeamWorkReport {
    _id: string;
    employeeId: {
        _id: string;
        name: string;
        position?: string;
        profileImageUrl?: string;
    };
    reportParticipant?: {
        _id: string;
        name: string;
        position?: string;
        profileImageUrl?: string;
    };
    date: string;
    inTime?: string;
    outTime?: string;
    totalHours?: number;
    totalMinutes?: number;
    status: string;
    workMode: string;
    todayWork?: string;
    pendingWork?: string;
    issuesFaced?: string;
    isReportRead: boolean;
    createdAt?: string;
    updatedAt?: string;
}
