import { useState, useEffect, FormEvent } from 'react';
import { PopulatedComplaint } from '@/app/dashboard/complaints/HR/HrLiveComplaintsList';
import { complaintService } from '@/services/complaintService';

interface UseDirectorComplaintDetailsProps {
    complaint: PopulatedComplaint | null;
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
}

export function useDirectorComplaintDetails({
    complaint,
    isOpen,
    onClose,
    onSuccess,
}: UseDirectorComplaintDetailsProps) {
    const [selectedStatus, setSelectedStatus] = useState<string>('');
    const [comments, setComments] = useState<string>('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    // Animation States
    const [shouldRender, setShouldRender] = useState(isOpen);
    const [isVisible, setIsVisible] = useState(false);

    // Smooth Mount/Unmount Animation Lifecycle
    useEffect(() => {
        if (isOpen) {
            setShouldRender(true);
            const timer = setTimeout(() => setIsVisible(true), 10);
            return () => clearTimeout(timer);
        } else {
            setIsVisible(false);
            const timer = setTimeout(() => setShouldRender(false), 300);
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    // Sync form state when active complaint changes
    useEffect(() => {
        if (complaint) {
            setSelectedStatus(complaint.status);
            setComments(complaint.directorComments || '');
            setErrorMsg(null);
        }
    }, [complaint]);

    const handleSubmitAction = async (e: FormEvent) => {
        e.preventDefault();
        setErrorMsg(null);

        if (!complaint) return;

        if (selectedStatus === complaint.status && !comments.trim()) {
            setErrorMsg('Please either change the status or add a directive comment.');
            return;
        }

        try {
            setIsSubmitting(true);
            await complaintService.updateDirectorComplaintStatus(complaint._id, {
                status: selectedStatus as any,
                comments: comments.trim(),
            });

            if (onSuccess) onSuccess();
            onClose();
        } catch (err: any) {
            console.error('Failed to update complaint by Director:', err);
            setErrorMsg(err?.response?.data?.message || 'Failed to update complaint status.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return {
        selectedStatus,
        setSelectedStatus,
        comments,
        setComments,
        isSubmitting,
        errorMsg,
        shouldRender,
        isVisible,
        handleSubmitAction,
    };
}