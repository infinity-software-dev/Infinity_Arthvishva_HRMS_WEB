import { useState, useEffect } from 'react';
import { generateLetterPages, GeneratedDocument } from '@/utils/sendPdfEmail';

interface UseLetterPreviewProps {
    isOpen: boolean;
    data: any;
    selectedLetter: string;
    containerId?: string;
}

export function useLetterPreview({
    isOpen,
    data,
    selectedLetter,
    containerId = 'pdf-preview-source-container'
}: UseLetterPreviewProps) {
    const [pages, setPages] = useState<string[]>([]);
    const [generatedDoc, setGeneratedDoc] = useState<GeneratedDocument | null>(null);
    const [isLoadingPreview, setIsLoadingPreview] = useState(true);
    const [previewError, setPreviewError] = useState<string | null>(null);

    useEffect(() => {
        if (!isOpen || !data) {
            setPages([]);
            setGeneratedDoc(null);
            setIsLoadingPreview(false);
            return;
        }

        let isCancelled = false;
        setIsLoadingPreview(true);
        setPreviewError(null);
        setPages([]);
        setGeneratedDoc(null);

        // Small debounce to ensure DOM is mounted & image elements are ready
        const timer = setTimeout(async () => {
            try {
                const doc = await generateLetterPages(containerId);
                if (!isCancelled) {
                    setGeneratedDoc(doc);
                    setPages(doc.pageImages);
                    setIsLoadingPreview(false);
                }
            } catch (err: any) {
                console.error('Failed to generate preview pages:', err);
                if (!isCancelled) {
                    setPreviewError(err?.message || 'Failed to render preview');
                    setIsLoadingPreview(false);
                }
            }
        }, 200);

        return () => {
            isCancelled = true;
            clearTimeout(timer);
        };
    }, [isOpen, data, selectedLetter, containerId]);

    const handleDownload = () => {
        if (generatedDoc?.pdf) {
            generatedDoc.pdf.save(`${selectedLetter}.pdf`);
        }
    };

    return {
        pages,
        generatedDoc,
        isLoadingPreview,
        previewError,
        handleDownload
    };
}
