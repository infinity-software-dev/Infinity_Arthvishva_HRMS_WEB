// services/employeeProtalServices/employee.overview.service.ts

import apiClient from "@/constants/API/client";
import { EmployeeProfile, RawAttendanceDocument, RawPerformanceInsights } from "./types";
import { EMPLOYEE_API } from "@/constants/API/api";

export const portalService = {

  async getProfileData(): Promise<EmployeeProfile> {
    try {
      const response = await apiClient.get(EMPLOYEE_API.GET_PROFILE);
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Failed to fetch profile");
    }
  },



  async getPerformanceInsights(): Promise<RawPerformanceInsights> {
    try {
      const response = await apiClient.get(EMPLOYEE_API.GET_PERFORMANCE);
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Failed to fetch performance stats");
    }
  }
};