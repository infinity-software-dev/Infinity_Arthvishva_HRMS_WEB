"use client";

import { useState } from 'react';
import toast from 'react-hot-toast';
import { employeeReimbursementService } from '@/services/employeeProtalServices/employee.reimbursement.service';

export const useApplyReimbursement = (onSuccess: () => void) => {
    const [amount, setAmount] = useState('');
    const [expenseDate, setExpenseDate] = useState('');
    const [reason, setReason] = useState('');

    // File states
    const [proofFile, setProofFile] = useState<File | null>(null);
    const [proofPreview, setProofPreview] = useState<string | null>(null);

    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Check if it's an image
            if (!file.type.startsWith('image/')) {
                toast.error('Please upload an image file (JPG, PNG).');
                return;
            }
            // Check size (e.g., max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                toast.error('Image size should be less than 5MB.');
                return;
            }

            setProofFile(file);
            setProofPreview(URL.createObjectURL(file));
        }
    };

    const clearFile = () => {
        setProofFile(null);
        setProofPreview(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Frontend Validations matching your backend rules
        if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
            toast.error('Please enter a valid amount greater than 0.');
            return;
        }
        if (!expenseDate) {
            toast.error('Please select the expense date.');
            return;
        }
        if (!reason.trim()) {
            toast.error('Please provide a reason for the expense.');
            return;
        }
        if (!proofFile) {
            toast.error('A physical receipt image proof is mandatory.');
            return;
        }

        setIsSubmitting(true);
        const loadingToast = toast.loading('Submitting reimbursement claim...');

        try {
            // Append data to FormData as required by @UseInterceptors(FileInterceptor('proof'))
            const formData = new FormData();
            formData.append('amount', amount);
            formData.append('expenseDate', expenseDate);
            formData.append('reason', reason);
            formData.append('proof', proofFile); // 'proof' matches your backend FileInterceptor key

            await employeeReimbursementService.applyClaim(formData);

            toast.success('Reimbursement claim submitted successfully!', { id: loadingToast });

            // Clear form
            setAmount('');
            setExpenseDate('');
            setReason('');
            clearFile();

            // Trigger callback (usually to switch tab back to History)
            onSuccess();
        } catch (error: any) {
            console.error('Failed to submit claim:', error);
            toast.error(error?.response?.data?.message || 'Failed to submit claim. Please try again.', { id: loadingToast });
        } finally {
            setIsSubmitting(false);
        }
    };

    return {
        form: { amount, setAmount, expenseDate, setExpenseDate, reason, setReason },
        file: { proofFile, proofPreview, handleFileChange, clearFile },
        isSubmitting,
        handleSubmit
    };
};