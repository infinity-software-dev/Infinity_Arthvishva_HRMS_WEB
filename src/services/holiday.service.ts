import apiClient from "@/constants/API/client";
import { HR_API, MANAGEMENT_API } from "@/constants/API/api";

export type HolidayType = "National" | "Company-specific";

export interface Holiday {
    _id: string;
    date: string;
    year: number;
    name: string;
    type: HolidayType;
    description?: string;
    isActive: boolean;
    createdBy?: {
        _id: string;
        name: string;
    };
    createdAt?: string;
    updatedAt?: string;
}

export interface CreateHolidayPayload {
    date: string;
    name: string;
    type: HolidayType;
    description?: string;
}

export interface DeleteHolidayResponse {
    message: string;
}

export const holidayService = {
    async getHolidaysByYear(year: number): Promise<Holiday[]> {
        const response = await apiClient.get<{ success: boolean; data: Holiday[] }>(
            `${MANAGEMENT_API.GET_HOLIDAYS}?year=${year}`
        );
        return response.data.data;
    },

    async createHoliday(payload: CreateHolidayPayload): Promise<Holiday> {
        const response = await apiClient.post<{ success: boolean; data: Holiday }>(
            HR_API.CREATE_HOLIDAY,
            payload
        );
        return response.data.data;
    },


    async deleteHoliday(id: string): Promise<DeleteHolidayResponse> {
        const response = await apiClient.delete<DeleteHolidayResponse>(
            HR_API.DELETE_HOLIDAY(id)
        );
        return response.data;
    },
};