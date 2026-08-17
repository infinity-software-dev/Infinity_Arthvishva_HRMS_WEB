import React, { useState } from 'react';
import { X, Loader2, AlertCircle } from 'lucide-react';
import { CreateHolidayPayload, HolidayType } from '@/services/holiday.service';

interface AddHolidayModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (payload: CreateHolidayPayload) => Promise<unknown>;
    selectedYear: number;
}

export const AddHolidayModal: React.FC<AddHolidayModalProps> = ({
    isOpen,
    onClose,
    onSubmit,
    selectedYear,
}) => {
    const getTodayDate = () => {
        return new Intl.DateTimeFormat('en-CA', {
            timeZone: 'Asia/Kolkata',
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
        }).format(new Date());
    };

    const [formData, setFormData] = useState<CreateHolidayPayload>({
        date: getTodayDate(),
        name: '',
        type: 'National',
        description: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!formData.name.trim() || !formData.date) {
            setError('Please fill in all required fields.');
            return;
        }

        try {
            setIsSubmitting(true);
            await onSubmit(formData);
            onClose();
        } catch (err: any) {
            setError(err.message || 'Failed to create holiday');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
            <div className="bg-white dark:bg-[#16101B] rounded-2xl shadow-xl w-full max-w-md border border-secondary/20 dark:border-secondary/30 overflow-hidden">
                <div className="flex items-center justify-between p-6 border-b border-secondary/15 dark:border-secondary/20">
                    <h2 className="text-xl font-bold text-primary dark:text-white">Add New Holiday</h2>
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
                            Holiday Name <span className="text-magenta">*</span>
                        </label>
                        <input
                            type="text"
                            required
                            placeholder="e.g. Independence Day"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full bg-white dark:bg-[#0F0B13] border border-secondary/25 dark:border-secondary/40 rounded-xl p-2.5 text-sm text-primary dark:text-white focus:ring-2 focus:ring-brand-blue focus:border-brand-blue outline-none"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-primary dark:text-gray-200 mb-1">
                            Date <span className="text-magenta">*</span>
                        </label>
                        <input
                            type="date"
                            required
                            value={formData.date}
                            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                            className="w-full bg-white dark:bg-[#0F0B13] border border-secondary/25 dark:border-secondary/40 rounded-xl p-2.5 text-sm text-primary dark:text-white focus:ring-2 focus:ring-brand-blue focus:border-brand-blue outline-none"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-primary dark:text-gray-200 mb-1">
                            Holiday Type <span className="text-magenta">*</span>
                        </label>
                        <select
                            value={formData.type}
                            onChange={(e) =>
                                setFormData({ ...formData, type: e.target.value as HolidayType })
                            }
                            className="w-full bg-white dark:bg-[#0F0B13] border border-secondary/25 dark:border-secondary/40 rounded-xl p-2.5 text-sm text-primary dark:text-white focus:ring-2 focus:ring-brand-blue focus:border-brand-blue outline-none cursor-pointer"
                        >
                            <option value="National">National</option>
                            <option value="Company-specific">Company-specific</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-primary dark:text-gray-200 mb-1">
                            Description (Optional)
                        </label>
                        <textarea
                            rows={3}
                            placeholder="Additional remarks or notes..."
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="w-full bg-white dark:bg-[#0F0B13] border border-secondary/25 dark:border-secondary/40 rounded-xl p-2.5 text-sm text-primary dark:text-white focus:ring-2 focus:ring-brand-blue focus:border-brand-blue outline-none resize-none"
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
                                <span>Save Holiday</span>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};