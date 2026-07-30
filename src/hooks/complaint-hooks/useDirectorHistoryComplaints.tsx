import { useState, useEffect, useCallback } from 'react';
import { complaintService } from '@/services/complaintService';
import { PopulatedComplaint } from '@/app/dashboard/complaints/HR/HrLiveComplaintsList';

export function useDirectorHistoryComplaints(searchQuery: string) {
    const [complaints, setComplaints] = useState<PopulatedComplaint[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchComplaints = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);
            const data = await complaintService.getDirectorHistoryComplaints({ search : searchQuery });
            setComplaints(data);
        } catch (err: any) {
            console.error('Failed to fetch director history complaints:', err);
            setError(err?.response?.data?.message || 'Failed to load complaint history.');
        } finally {
            setIsLoading(false);
        }
    }, [searchQuery]);

    useEffect(() => {
        fetchComplaints();
    }, [fetchComplaints]);

    return { complaints, isLoading, error, refetch: fetchComplaints };
}