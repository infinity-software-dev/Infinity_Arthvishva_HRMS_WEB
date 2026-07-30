import { useState, useEffect, FormEvent } from 'react';
import { PopulatedComplaint } from '@/app/dashboard/complaints/HR/HrLiveComplaintsList';
import { complaintService } from '@/services/complaintService';

interface UseHrComplaintDetailsProps {
    complaint: PopulatedComplaint | null;
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
}

export function useHrComplaintDetails({
    complaint,
    isOpen,
    onClose,
    onSuccess,
}: UseHrComplaintDetailsProps) {
    // Form States
    const [selectedStatus, setSelectedStatus] = useState<string>('');
    const [comments, setComments] = useState<string>('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    // Animation States
    const [shouldRender, setShouldRender] = useState(isOpen);
    const [isVisible, setIsVisible] = useState(false);

    // Handle Smooth Mount/Unmount Animation
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

    // Sync state whenever selected complaint changes
    useEffect(() => {
        if (complaint) {
            setSelectedStatus(complaint.status);
            setComments('');
            setErrorMsg(null);
        }
    }, [complaint]);

    const handleSubmitAction = async (e: FormEvent) => {
        e.preventDefault();
        setErrorMsg(null);

        if (!complaint) return;

        if (selectedStatus === complaint.status && !comments.trim()) {
            setErrorMsg('Please either change the status or add a comment.');
            return;
        }

        try {
            setIsSubmitting(true);
            await complaintService.updateHrComplaintStatus(complaint._id, {
                status: selectedStatus as any,
                comments: comments.trim(),
            });

            if (onSuccess) onSuccess();
            onClose();
        } catch (err: any) {
            console.error('Failed to update complaint:', err);
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