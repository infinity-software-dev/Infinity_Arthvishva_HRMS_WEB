import React, { useState, useEffect } from 'react';
import { X, Loader2, AlertCircle } from 'lucide-react';

interface PositionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (name: string) => Promise<unknown>;
    initialData?: { _id: string; name: string } | null;
}

export const PositionModal: React.FC<PositionModalProps> = ({
    isOpen,
    onClose,
    onSubmit,
    initialData,
}) => {
    const isEditMode = !!initialData;
    const [name, setName] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (isOpen) {
            if (initialData) {
                setName(initialData.name);
            } else {
                setName('');
            }
            setError(null);
        }
    }, [isOpen, initialData]);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!name.trim()) {
            setError('Please enter a position name.');
            return;
        }

        try {
            setIsSubmitting(true);
            await onSubmit(name);
            onClose();
        } catch (err: any) {
            setError(err.message || `Failed to ${isEditMode ? 'update' : 'create'} position`);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
            <div className="bg-white dark:bg-[#16101B] rounded-2xl shadow-xl w-full max-w-md border border-secondary/20 dark:border-secondary/30 overflow-hidden">
                <div className="flex items-center justify-between p-6 border-b border-secondary/15 dark:border-secondary/20">
                    <h2 className="text-xl font-bold text-primary dark:text-white">
                        {isEditMode ? 'Edit Position' : 'Add New Position'}
                    </h2>
                    <button
                        onClick={onClose}
                        disabled={isSubmitting}
                        className="text-secondary/70 hover:text-primary dark:text-gray-400 dark:hover:text-white transition-colors cursor-pointer"
                    >
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {error && (
                        <div className="p-3 rounded-lg bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-sm flex items-center gap-2">
                            <AlertCircle size={16} className="flex-shrink-0" />
                            <span>{error}</span>
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-primary dark:text-gray-200 mb-1">
                            Position Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            required
                            placeholder="e.g. Software Engineer"
                            value={name}
                            onChange={(e) => {
                                setName(e.target.value.toUpperCase());
                            }}
                            className="w-full bg-white dark:bg-[#0F0B13] border border-secondary/25 dark:border-secondary/40 rounded-xl p-2.5 text-sm text-primary dark:text-white focus:ring-2 focus:ring-brand-blue focus:border-brand-blue outline-none"
                        />
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-secondary/15 dark:border-secondary/20">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isSubmitting}
                            className="px-4 py-2 text-sm font-medium text-secondary dark:text-gray-300 hover:bg-secondary/10 dark:hover:bg-secondary/20 rounded-xl transition-colors cursor-pointer"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex items-center gap-2 bg-gradient-to-r from-brand-blue to-brand-green hover:opacity-90 text-white px-5 py-2 text-sm font-semibold rounded-xl transition-opacity shadow-sm disabled:opacity-50 cursor-pointer"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 size={16} className="animate-spin" />
                                    <span>Saving...</span>
                                </>
                            ) : (
                                <span>{isEditMode ? 'Update' : 'Save'} Position</span>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
