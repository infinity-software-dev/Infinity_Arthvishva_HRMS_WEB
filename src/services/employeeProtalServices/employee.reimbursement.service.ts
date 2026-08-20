import apiClient from '@/constants/API/client';
import { EMPLOYEE_API } from '@/constants/API/api';
import { logToTerminal } from '@/utils/terminalLogger';

export interface ReimbursementClaim {
    _id: string;
    amount: number;
    reason: string;
    expenseDate: string;
    imageProofUrl: string;
    hrStatus: 'Pending' | 'Approved' | 'Rejected';
    paymentStatus: 'Unpaid' | 'Paid';
    createdAt: string;
}

export const employeeReimbursementService = {
    getHistory: async (): Promise<ReimbursementClaim[]> => {
        const response = await apiClient.get(EMPLOYEE_API.GET_REIMBURSEMENT_HISTORY);
        return response.data?.data || [];
    },

    cancelClaim: async (id: string): Promise<void> => {
        await apiClient.delete(EMPLOYEE_API.CANCEL_REIMBURSEMENT(id));
    },

    applyClaim: async (formData: FormData): Promise<any> => {
    const response = await apiClient.post(EMPLOYEE_API.APPLY_REIMBURSEMENT, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};