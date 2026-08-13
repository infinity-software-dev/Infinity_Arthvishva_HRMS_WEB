import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { employeeProfileService } from '@/services/employeeProtalServices/employee.profile.service';

export const useEmployeeProfile = () => {
    const [employee, setEmployee] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const data = await employeeProfileService.getProfile();
                setEmployee(data);
            } catch (err: any) {
                toast.error(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    const formatDate = (dateString?: string) => {
        if (!dateString) return "-";
        return new Date(dateString).toLocaleDateString('en-GB', {
            day: 'numeric', month: 'short', year: 'numeric'
        });
    };

    const displayValue = (val: any) => {
        if (val === null || val === undefined || val === "") return "-";
        return val;
    };

    return {
        employee,
        loading,
        formatDate,
        displayValue
    };
};