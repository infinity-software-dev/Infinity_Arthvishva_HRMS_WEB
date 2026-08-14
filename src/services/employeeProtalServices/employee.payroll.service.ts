import { EMPLOYEE_API } from "@/constants/API/api";
import apiClient from "@/constants/API/client";


export const portalPayrollService = {
  async previewPayroll(startDate: string, endDate: string): Promise<any> {
    try {
      const response = await apiClient.post(EMPLOYEE_API.PREVIEW_PAYROLL, {
        startDate,
        endDate
      });
      return response.data?.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Failed to generate payroll preview.");
    }
  },

  async getPayrollList(query: Record<string, any> = {}): Promise<{ payrolls: any[]; pagination?: any }> {
    try {
      const response = await apiClient.get(EMPLOYEE_API.GET_PAYROLL_LIST, {
        params: query,
      });

      // Safely extract payrolls array whether it is nested in data.payrolls or directly data
      const rawData = response.data?.data || response.data;
      const payrolls = Array.isArray(rawData?.payrolls)
        ? rawData.payrolls
        : Array.isArray(rawData)
          ? rawData
          : [];

      return {
        payrolls,
        pagination: rawData?.pagination
      };
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Failed to load payroll history.");
    }
  },

  async getPayrollDetails(payrollId: string): Promise<any> {
    try {
      const response = await apiClient.get(EMPLOYEE_API.GET_PAYROLL_DETAILS(payrollId));
      return response.data?.data || response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Failed to load statement details.");
    }
  },
};