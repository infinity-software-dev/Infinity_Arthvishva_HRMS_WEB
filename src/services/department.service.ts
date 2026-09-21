import apiClient from "@/constants/API/client";
import { HR_API } from "@/constants/API/api";

export interface Department {
    _id: string;
    name: string;
    isActive: boolean;
    createdAt?: string;
    updatedAt?: string;
}

export interface CreateDepartmentPayload {
    name: string;
}

export interface DeleteDepartmentResponse {
    message: string;
}

export const departmentService = {
    // READ ALL
    getAllDepartments: async (showAll: boolean = false): Promise<Department[]> => {
        try {
            const url = showAll ? HR_API.GET_ALL_DEPARTMENTS : HR_API.GET_ACTIVE_DEPARTMENTS;
            const response = await apiClient.get<Department[]>(url);
            const data = Array.isArray(response.data) ? response.data : (response.data as any).data || [];
            return data;
        } catch (error) {
            console.error("Error fetching departments:", error);
            throw error;
        }
    },

    // CREATE
    createDepartment: async (payload: CreateDepartmentPayload): Promise<Department> => {
        try {
            const response = await apiClient.post<Department>(HR_API.CREATE_DEPARTMENT, payload);
            return response.data;
        } catch (error) {
            console.error("Error creating department:", error);
            throw error;
        }
    },

    // UPDATE
    updateDepartment: async (id: string, name: string): Promise<Department> => {
        try {
            const response = await apiClient.put<Department>(HR_API.UPDATE_DEPARTMENT(id), { name });
            return response.data;
        } catch (error) {
            console.error("Error updating department:", error);
            throw error;
        }
    },

    // DELETE (Soft Delete)
    deleteDepartment: async (id: string): Promise<DeleteDepartmentResponse> => {
        try {
            const response = await apiClient.delete<DeleteDepartmentResponse>(HR_API.DELETE_DEPARTMENT(id));
            return response.data;
        } catch (error) {
            console.error("Error deleting department:", error);
            throw error;
        }
    },

    // RESTORE (Undo Soft Delete)
    restoreDepartment: async (id: string): Promise<void> => {
        try {
            await apiClient.patch(HR_API.RESTORE_DEPARTMENT(id));
        } catch (error) {
            console.error("Error restoring department:", error);
            throw error;
        }
    }
};
