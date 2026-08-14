import { useState, useMemo } from 'react';
import toast from 'react-hot-toast';
import { generatePayrollCycles, PayrollCycle } from '@/utils/payrollCycles';
import { portalPayrollService } from '@/services/employeeProtalServices/employee.payroll.service';

export const usePayrollPreview = () => {
    const cycles = useMemo(() => generatePayrollCycles(12), []);

    // Default to the current active cycle (index 1 because index 0 is upcoming)
    const defaultCycle = cycles[1] || cycles[0];

    const [startDate, setStartDate] = useState<string>(defaultCycle.startDate);
    const [endDate, setEndDate] = useState<string>(defaultCycle.endDate);
    const [isCycleModalOpen, setIsCycleModalOpen] = useState<boolean>(false);
    const [previewData, setPreviewData] = useState<any | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const handleSelectCycle = (cycle: PayrollCycle) => {
        setStartDate(cycle.startDate);
        setEndDate(cycle.endDate);
        setIsCycleModalOpen(false);
    };

    const handleGeneratePreview = async () => {
        if (!startDate || !endDate) {
            toast.error("Please select both start and end dates.");
            return;
        }

        if (new Date(startDate) > new Date(endDate)) {
            toast.error("Start date cannot be after end date.");
            return;
        }

        setLoading(true);
        try {
            const data = await portalPayrollService.previewPayroll(startDate, endDate);
            setPreviewData(data);
            toast.success("Payroll statement generated! 📊");
        } catch (err: any) {
            toast.error(err.message);
        } finally {
            setLoading(false);
        }
    };

    return {
        startDate,
        endDate,
        setStartDate,
        setEndDate,
        cycles,
        isCycleModalOpen,
        setIsCycleModalOpen,
        handleSelectCycle,
        previewData,
        loading,
        handleGeneratePreview
    };
};