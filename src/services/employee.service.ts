import { HR_API, MANAGEMENT_API } from "@/constants/API/api";
import apiClient from "@/constants/API/client";
import { logToTerminal } from "@/utils/terminalLogger";


export interface EmployeeCardTypes {
    _id: string;
    employeeCode: string;
    name: string;
    email: string;
    role: 'Employee' | 'Intern';
    department?: string;
    position?: string;
    status: 'Active' | 'Inactive';
    profileImageUrl?: string;
    managerName?: string;
}

export const employeeService = {
    async getEmployees(searchQuery: string, department: string, status: string, page: number, limit: number) {

        const response = await apiClient.get(MANAGEMENT_API.GET_ALL_EMPLOYEES, {
            params: {
                search: searchQuery || undefined,
                department: department || undefined,
                status: status || undefined,
                page: page,
                limit: limit
            }
        });

        return { data: response.data.data, meta: response.data.meta };
    },

    async getManagerList() {
        const response = await apiClient.get(HR_API.GET_MANAGER_LIST);
        return response.data;
    },

    async getNewEmployeeCode() {
        const response = await apiClient.get(HR_API.GET_NEW_EMPLOYEE_CODE);
        return response.data;
    },

    // Add this inside your employeeService object
    async createEmployee(formDataPayload: FormData) {

        // await logToTerminal("Form data payload from frontend: ",formDataPayload)

        const response = await apiClient.post(HR_API.CREATE_EMPLOYEE, formDataPayload, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            timeout: 60000,
        });
        return response.data;
    },

    async getEmployeeById(id: string, fields?: string[]) {
        let url = `${MANAGEMENT_API.GET_SINGLE_EMPLOYEE}/${id}`;

        if (fields && fields.length > 0) {
            url += `?fields=${fields.join(',')}`;
        }

        const response = await apiClient.get(url);
        // await logToTerminal("Response from getEmployeeById: ", response.data);
        return response.data;
    },

    async updateEmployee(id: string, formDataPayload: FormData) {
        const response = await apiClient.put(HR_API.UPDATE_EMPLOYEE(id), formDataPayload, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            timeout: 30000,
        });
        return response.data;
    }
};