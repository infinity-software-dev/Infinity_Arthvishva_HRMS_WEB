import { useState } from 'react';
import { sendPdfEmail } from '@/utils/sendPdfEmail';

export function useSendLetterEmail() {
    const [isSending, setIsSending] = useState(false);
    const [isSent, setIsSent] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const sendEmail = async (
        elementOrBlob: string | HTMLElement | Blob, 
        recipientEmail: string, 
        filename: string, 
        subject: string, 
        text: string
    ) => {
        setIsSending(true);
        setError(null);
        try {
            await sendPdfEmail(elementOrBlob, recipientEmail, filename, subject, text);
            setIsSent(true);
            
            // Auto-reset the success state after 2 seconds
            setTimeout(() => {
                setIsSent(false);
            }, 2000);
            
            return true;
        } catch (err: any) {
            setError(err.message || 'Failed to send email');
            return false;
        } finally {
            setIsSending(false);
        }
    };

    return { sendEmail, isSending, isSent, error };
}
