import { useState, useEffect, useMemo } from 'react';
import { portalLeaveService } from '@/services/employeeProtalServices/employee.leave.service';
import toast from 'react-hot-toast';

export const useLeaves = () => {
    const [leaves, setLeaves] = useState<any[]>([]);
    const [summary, setSummary] = useState({ total: 0, approved: 0, pending: 0, rejected: 0, cancelled: 0 });
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('All');

    const fetchLeaves = async () => {
        try {
            setLoading(true);
            const data = await portalLeaveService.getMyLeaves();
            setLeaves(data.leaves || []);
            if (data.summary) setSummary(data.summary);
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLeaves();
    }, []);

    // Filter leaves based on active tab
    const filteredLeaves = useMemo(() => {
        if (activeTab === 'All') return leaves;
        return leaves.filter(leave => leave.overallStatus === activeTab);
    }, [leaves, activeTab]);

    return {
        leaves: filteredLeaves,
        summary,
        loading,
        activeTab,
        setActiveTab,
        refresh: fetchLeaves
    };
};