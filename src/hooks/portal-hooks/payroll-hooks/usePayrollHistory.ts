import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { portalPayrollService } from '@/services/employeeProtalServices/employee.payroll.service';

export const usePayrollHistory = (autoFetch: boolean = true) => {
    const [payrollList, setPayrollList] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedSlip, setSelectedSlip] = useState<any | null>(null);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [isFetchingDetails, setIsFetchingDetails] = useState(false);

    const fetchPayrolls = useCallback(async () => {
        setLoading(true);
        try {
            const res = await portalPayrollService.getPayrollList({ self: 'true' });
            setPayrollList(res.payrolls || []);
        } catch (err: any) {
            toast.error(err.message || "Failed to fetch statements.");
            setPayrollList([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (autoFetch) {
            fetchPayrolls();
        }
    }, [autoFetch, fetchPayrolls]);

    const handleSelectSlip = async (slip: any) => {
        // If the list item already contains full breakdown, open immediately
        if (slip.earnings && slip.paidDaysBreakdown) {
            setSelectedSlip(slip);
            setIsDetailModalOpen(true);
            return;
        }

        // Otherwise, fetch detailed breakdown by ID
        setIsFetchingDetails(true);
        try {
            const detailedData = await portalPayrollService.getPayrollDetails(slip._id);
            setSelectedSlip(detailedData);
            setIsDetailModalOpen(true);
        } catch {
            // Fallback to what we have in the list item
            setSelectedSlip(slip);
            setIsDetailModalOpen(true);
        } finally {
            setIsFetchingDetails(false);
        }
    };

    const closeDetailModal = () => {
        setIsDetailModalOpen(false);
        setSelectedSlip(null);
    };

    return {
        payrollList,
        loading,
        selectedSlip,
        isDetailModalOpen,
        isFetchingDetails,
        fetchPayrolls,
        handleSelectSlip,
        closeDetailModal,
    };
};