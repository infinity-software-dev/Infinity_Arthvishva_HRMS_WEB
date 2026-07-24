
import { HR_API, MANAGEMENT_API } from "@/constants/API/api";
import apiClient from "@/constants/API/client";

export interface GetPayrollParams {
    month?: number;
    year?: number;
    status?: string;
    startDate?: string;
    endDate?: string;
    employeeId?: string;
    self?: string;
    page?: number;
    limit?: number;
    search?: string;
}

export const payrollService = {
    // Fetch paginated payroll list (supports filters, search, and permissions)
    getPayrollList: async (params: GetPayrollParams) => {
        const response = await apiClient.get(MANAGEMENT_API.GET_PAYROLL_LIST, { params });
        return response.data;
    },

    // Triggers the batch processing loop for all active employees
    processAllActive: async (fromDate: string, toDate: string, month: number, year: number, processedById: string) => {
        const response = await apiClient.post(MANAGEMENT_API.PROCESS_ALL_ACTIVE_PAYROLL, {
            fromDate,
            toDate,
            targetMonth: month,
            targetYear: year,
            processedById,
        });
        return response.data;
    },

    exportPayrollExcel: async (month: number, year: number) => {
        const response = await apiClient.get(MANAGEMENT_API.EXPORT_PAYROLL, {
            params: { targetMonth: month, targetYear: year },
            responseType: 'blob',
        });
        return response.data;
    },

    // Add this to your exported service object
    downloadSalarySlipPdf: async (payrollId: string, employeeId: string) => {
        const response = await apiClient.get(MANAGEMENT_API.DOWNLOAD_SALARY_SLIP_PDF(payrollId), {
            params: { employeeId },
            responseType: 'blob',
        });
        return response.data;
    },
};