// src/services/reimbursementService.ts

import apiClient from "@/constants/API/client";
import { HR_API, MANAGEMENT_API } from "@/constants/API/api";

export const reimbursementService = {
    // Fetch incoming items for the admin inbox view
    getPendingClaims: async () => {
        const response = await apiClient.get(MANAGEMENT_API.GET_PENDING_REIMBURSEMENTS);
        return response.data;
    },

    // Approve a specific expense claim item
    approveClaim: async (id: string) => {
        const response = await apiClient.patch(HR_API.APPROVE_REIMBURSEMENT(id));
        return response.data;
    },

    // Reject an expense claim requiring a mandatory reason statement specification
    rejectClaim: async (id: string, rejectionReason: string) => {
        const response = await apiClient.patch(HR_API.REJECT_REIMBURSEMENT(id), {
            rejectionReason,
        });
        return response.data;
    },

    // Fetch all historical non-pending claims (Approved / Rejected) for the ledger
    getHistoricalClaims: async () => {
        const response = await apiClient.get(MANAGEMENT_API.GET_HISTORICAL_REIMBURSEMENTS);
        return response.data;
    },

};