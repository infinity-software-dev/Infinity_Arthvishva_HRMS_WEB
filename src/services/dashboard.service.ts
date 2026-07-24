// src/services/dashboard.service.ts
import { Stats } from "@/hooks/dashboard-hooks/useDashboardStats";
import { HR_API, MANAGEMENT_API } from "@/constants/API/api";
import apiClient from "@/constants/API/client";
import { ChartData } from "@/hooks/dashboard-hooks/useTotalStat";
import { RawDepartmentStat } from "@/hooks/dashboard-hooks/useDepartmentStats";
import { Employee } from "@/hooks/dashboard-hooks/useRecentEmployees";
import { Birthday, UpcomingBirthdaysResponse } from "@/hooks/dashboard-hooks/useUpcomingBirthdays";


export const dashboardService = {
    async getDashboardStats(): Promise<Stats[]> {
        const response = await apiClient.get(MANAGEMENT_API.GET_GENERAL_STATS);
        return response.data;
    },

    async getAverageAttendance(viewMode: "monthly" | "yearly"): Promise<ChartData[]> {
        const response = await apiClient.get(`${MANAGEMENT_API.GET_ATTENDANCE_STATS}?type=${viewMode}`);
        return response.data;
    },

    async getDepartmentStats(): Promise<RawDepartmentStat[]> {
        const response = await apiClient.get(MANAGEMENT_API.GET_DEPARTMENT_STATS);
        return response.data;
    },

    async getRecentEmployees(): Promise<Employee[]> {
        const response = await apiClient.get(MANAGEMENT_API.GET_RECENT_JOINED_EMPLOYEES);
        return response.data;
    },

    async getUpcomingBirthdays(): Promise<UpcomingBirthdaysResponse> {
        const response = await apiClient.get(MANAGEMENT_API.GET_UPCOMING_BIRTHDAYS);
        return response.data;
    }
}