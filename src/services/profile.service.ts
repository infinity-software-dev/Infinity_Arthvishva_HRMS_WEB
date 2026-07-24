import { HR_API, DIRECTOR_API } from "@/constants/API/api";
import apiClient from "@/constants/API/client";

// ─── DATA TYPES & INTERFACES ───
export interface BaseProfileData {
    idCode: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

// HR has the nested employeeAccount
export interface HrProfileData extends BaseProfileData {
    employeeAccount: {
        _id: string;
        name: string;
        employeeCode: string;
        email: string;
        department?: string;
        position?: string;
        status?: string;
        role?: string;
    };
}

// Director explicitly lacks the employeeAccount
export interface DirectorProfileData extends BaseProfileData {
    employeeAccount: null; 
}

// Union type covering both possibilities
export type SystemProfileData = HrProfileData | DirectorProfileData;

export interface ChangePasswordParams {
    oldPassword: string;
    newPassword: string;
}

// ─── ENDPOINT ROUTER ───
const getEndpoints = () => {
    if (typeof window !== "undefined" && localStorage.getItem("role") === "DIRECTOR") {
        return DIRECTOR_API;
    }
    return HR_API;
};

// ─── OBJECT EXPORT PATTERN MAPPED TO SYSTEM CONSTANTS ───
export const profileService = {
    getMasterProfile: async (): Promise<SystemProfileData> => {
        const ENDPOINTS = getEndpoints();
        const response = await apiClient.get(ENDPOINTS.GET_PROFILE);
        
        // Return .data.data if your backend wraps the response, otherwise fallback to .data
        return response.data?.data || response.data; 
    },

    /**
     * Coordinates execution sequence to rotate credentials across the shared document
     */
    changeMasterPassword: async (payload: ChangePasswordParams) => {
        const ENDPOINTS = getEndpoints();
        const response = await apiClient.patch(ENDPOINTS.CHANGE_PASSWORD, payload);
        return response.data; 
    }
};