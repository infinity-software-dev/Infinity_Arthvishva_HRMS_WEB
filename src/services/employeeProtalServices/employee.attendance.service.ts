// src/services/employeeProtalServices/employee.attendance.service.ts
import client from "@/constants/API/client";
import { CheckInPayload, RawAttendanceDocument, SystemConfig } from "./types";
import { EMPLOYEE_API } from "@/constants/API/api";

export const portalAttendanceService = {
    // Fetch the office coordinates and radius rules
    async getSystemConfig(): Promise<SystemConfig> {
        try {
            // Adjust the URL if your prefix differs
            const response = await client.get(EMPLOYEE_API.SYSTEM_CONFIGS);
            return response.data.data; // Assuming it directly returns the object you mentioned
        } catch (error: any) {
            throw new Error(error.response?.data?.message || "Failed to fetch system configurations");
        }
    },

    // Post the check-in data
    async checkIn(payload: CheckInPayload): Promise<any> {
        try {
            const response = await client.post(EMPLOYEE_API.CHECK_IN, payload);
            return response.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.message || "Check-in failed. Please try again.");
        }
    },

    async getTodayStatus(): Promise<RawAttendanceDocument | null> {
        try {
            const response = await client.get(EMPLOYEE_API.GET_ATTENDANCE_STATUS);

            return response.data.data.record || null;

        } catch (error: any) {
            throw new Error(error.response?.data?.message || "Failed to fetch punch status");
        }
    },

    // Add these to portalAttendanceService in src/services/employeeProtalServices/employee.attendance.service.ts

    async getReportingManagers(): Promise<any[]> {
        try {
            const response = await client.get('/api/web/attendance/reporting-managers');
            return response.data?.data || response.data || [];
        } catch (error: any) {
            console.error("Failed to fetch reporting managers", error);
            return []; // Return empty array to fail gracefully
        }
    },

    async checkOut(payload: any): Promise<any> {
        try {
            const response = await client.post('/api/web/attendance/check-out', payload);
            return response.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.message || "Check-out failed. Please try again.");
        }
    },

    async getMonthlyAttendance(year: string, month: string): Promise<any> {
        try {
            const response = await client.get(`${EMPLOYEE_API.GET_MONTHLY_ATTENDANCE}?year=${year}&month=${month}`);
            return response.data?.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.message || "Failed to fetch attendance summary.");
        }
    },

    async requestCorrection(
        attendanceId: string,
        payload: { requestedInTime: string; requestedOutTime: string; reason: string; proofUrl?: string }
    ): Promise<any> {
        try {
            const response = await client.patch(EMPLOYEE_API.REQUEST_CORRECTION(attendanceId), payload);
            return response.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.message || "Failed to submit correction request.");
        }
    }
};