import { EMPLOYEE_API } from "@/constants/API/api";
import apiClient from "@/constants/API/client";
import { ApiResponse, EmployeeProfile } from "./types";
import { AxiosResponse } from "axios";


export const employeeProfileService = {
    getProfile: async (): Promise<EmployeeProfile> => {
        const response: AxiosResponse<ApiResponse<EmployeeProfile>> = await apiClient.get(EMPLOYEE_API.GET_PROFILE);
        return response.data?.data || (response.data as unknown as EmployeeProfile);
    }
};