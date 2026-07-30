import { PopulatedComplaint } from "@/app/dashboard/complaints/HR/HrLiveComplaintsList";
import { DIRECTOR_API, HR_API } from "@/constants/API/api";
import apiClient from "@/constants/API/client";
import { logToTerminal } from "@/utils/terminalLogger";


export interface GetComplaintsParams {
    search?: string;
    page?: number;
    limit?: number;
}

export interface UpdateComplaintStatusPayload {
    status: 'Acknowledged' | 'In Review' | 'Resolved' | 'Rejected' | 'Withdrawn';
    comments?: string;
}

export const complaintService = {
    // ─── HR COMPLAINT ACTIONS ───
    getHrLiveComplaints: async (params?: GetComplaintsParams): Promise<PopulatedComplaint[]> => {
        const response = await apiClient.get(HR_API.GET_LIVE_COMPLAINTS, { params });
        return response.data;
    },

    getHrHistoricalComplaints: async (params?: GetComplaintsParams): Promise<PopulatedComplaint[]> => {
        const response = await apiClient.get(HR_API.GET_HISTORICAL_COMPLAINTS, { params });
        return response.data;
    },

    updateHrComplaintStatus: async (
        complaintId: string,
        payload: UpdateComplaintStatusPayload
    ): Promise<PopulatedComplaint> => {
        const response = await apiClient.patch(HR_API.UPDATE_COMPLAINT_STATUS(complaintId), payload);
        return response.data;
    },

    // ─── DIRECTOR COMPLAINT ACTIONS ───
    getDirectorLiveComplaints: async (params?: GetComplaintsParams): Promise<PopulatedComplaint[]> => {
        const response = await apiClient.get(DIRECTOR_API.GET_LIVE_COMPLAINTS, { params });
        return response.data;
    },

    getDirectorHistoryComplaints: async (params?: GetComplaintsParams): Promise<PopulatedComplaint[]> => {
        const response = await apiClient.get(DIRECTOR_API.GET_HISTORICAL_COMPLAINTS, { params });
        return response.data;
    },

    updateDirectorComplaintStatus: async (
        complaintId: string,
        payload: UpdateComplaintStatusPayload
    ): Promise<PopulatedComplaint> => {
        const response = await apiClient.patch(DIRECTOR_API.UPDATE_COMPLAINT_STATUS(complaintId), payload);
        return response.data;
    }
};