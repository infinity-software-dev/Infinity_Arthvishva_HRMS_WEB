"use client";

import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { employeeReimbursementService, ReimbursementClaim } from '@/services/employeeProtalServices/employee.reimbursement.service';

export const useReimbursementHistory = () => {
    const [claims, setClaims] = useState<ReimbursementClaim[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchClaims = useCallback(async () => {
        setIsLoading(true);
        try {
            const data = await employeeReimbursementService.getHistory();
            setClaims(data);
        } catch (error) {
            console.error('Failed to fetch reimbursement history:', error);
            toast.error('Failed to load your reimbursements.');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchClaims();
    }, [fetchClaims]);

    const handleCancel = async (id: string) => {
        const isConfirmed = window.confirm("Are you sure you want to cancel this reimbursement application?");

        if (!isConfirmed) return;

        const loadingToast = toast.loading('Cancelling application...');

        try {
            await employeeReimbursementService.cancelClaim(id);
            toast.success('Application cancelled successfully', { id: loadingToast });

            // Optimistically remove the item from the UI without needing a refetch
            setClaims(prev => prev.filter(claim => claim._id !== id));
        } catch (error: any) {
            console.error('Failed to cancel claim:', error);
            toast.error(error?.response?.data?.message || 'Failed to cancel application', { id: loadingToast });
        }
    };

    return {
        claims,
        isLoading,
        handleCancel,
        refreshClaims: fetchClaims
    };
};