import React, { useState, useEffect } from 'react';
import { X, Loader2, AlertCircle } from 'lucide-react';
import { UpsertAlertPayload, AlertType, PlatformType, GlobalAlert } from '@/services/announcement.service';

interface UpsertAlertModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (payload: UpsertAlertPayload) => Promise<unknown>;
    initialData?: GlobalAlert | null;
}

export const UpsertAlertModal: React.FC<UpsertAlertModalProps> = ({
    isOpen,
    onClose,
    onSubmit,
    initialData,
}) => {
    const [formData, setFormData] = useState<UpsertAlertPayload>({
        title: '',
        message: '',
        type: 'info',
        platform: 'both',
        buttonText: 'Okay',
        buttonLink: '',
        imageUrl: '',
        isActive: true,
        isSkippable: true,
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Populate form if editing an existing alert
    useEffect(() => {
        if (isOpen) {
            if (initialData) {
                setFormData({
                    title: initialData.title,
                    message: initialData.message,
                    imageUrl: initialData.imageUrl || '',
                    buttonText: initialData.buttonText || '',
                    buttonLink: initialData.buttonLink || '',
                    isSkippable: initialData.isSkippable,
                    isActive: initialData.isActive,
                    type: initialData.type,
                    platform: initialData.platform,
                });
            } else {
                // Reset form for new entry
                setFormData({
                    title: '',
                    message: '',
                    type: 'info',
                    platform: 'both',
                    buttonText: 'Okay',
                    buttonLink: '',
                    imageUrl: '',
                    isActive: true,
                    isSkippable: true,
                });
            }
            setError(null);
        }
    }, [isOpen, initialData]);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!formData.title.trim() || !formData.message.trim()) {
            setError('Please fill in the title and message fields.');
            return;
        }

        try {
            setIsSubmitting(true);
            await onSubmit(formData);
            onClose();
        } catch (err: any) {
            setError(err.message || 'Failed to save announcement');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
            <div className="bg-white dark:bg-[#16101B] rounded-2xl shadow-xl w-full max-w-2xl border border-secondary/20 dark:border-secondary/30 overflow-hidden max-h-[90vh] flex flex-col">
                <div className="flex items-center justify-between p-6 border-b border-secondary/15 dark:border-secondary/20">
                    <h2 className="text-xl font-bold text-primary dark:text-white">
                        {initialData ? 'Edit Announcement' : 'New Announcement'}
                    </h2>
                    <button
                        onClick={onClose}
                        disabled={isSubmitting}
                        className="text-secondary/70 hover:text-primary dark:text-gray-400 dark:hover:text-white transition-colors cursor-pointer"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="overflow-y-auto p-6">
                    <form id="upsert-alert-form" onSubmit={handleSubmit} className="space-y-5">
                        {error && (
                            <div className="p-3 rounded-lg bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-sm flex items-center gap-2">
                                <AlertCircle size={16} className="flex-shrink-0" />
                                <span>{error}</span>
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            {/* Announcement Type */}
                            <div>
                                <label className="block text-sm font-medium text-primary dark:text-gray-200 mb-1">
                                    Type <span className="text-magenta">*</span>
                                </label>
                                <select
                                    value={formData.type}
                                    onChange={(e) => setFormData({ ...formData, type: e.target.value as AlertType })}
                                    className="w-full bg-white dark:bg-[#0F0B13] border border-secondary/25 dark:border-secondary/40 rounded-xl p-2.5 text-sm text-primary dark:text-white focus:ring-2 focus:ring-brand-blue focus:border-brand-blue outline-none cursor-pointer"
                                >
                                    <option value="info">General Info</option>
                                    <option value="promo">Promotion / Event</option>
                                </select>
                            </div>

                            {/* Platform Target */}
                            <div>
                                <label className="block text-sm font-medium text-primary dark:text-gray-200 mb-1">
                                    Target Platform <span className="text-magenta">*</span>
                                </label>
                                <select
                                    value={formData.platform}
                                    onChange={(e) => setFormData({ ...formData, platform: e.target.value as PlatformType })}
                                    className="w-full bg-white dark:bg-[#0F0B13] border border-secondary/25 dark:border-secondary/40 rounded-xl p-2.5 text-sm text-primary dark:text-white focus:ring-2 focus:ring-brand-blue focus:border-brand-blue outline-none cursor-pointer"
                                >
                                    <option value="both">All Platforms</option>
                                    <option value="android">Android Only</option>
                                    <option value="ios">iOS Only</option>
                                </select>
                            </div>
                        </div>

                        {/* Title */}
                        <div>
                            <label className="block text-sm font-medium text-primary dark:text-gray-200 mb-1">
                                Title <span className="text-magenta">*</span>
                            </label>
                            <input
                                type="text"
                                required
                                placeholder="e.g. Diwali Celebration"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                className="w-full bg-white dark:bg-[#0F0B13] border border-secondary/25 dark:border-secondary/40 rounded-xl p-2.5 text-sm text-primary dark:text-white focus:ring-2 focus:ring-brand-blue focus:border-brand-blue outline-none"
                            />
                        </div>

                        {/* Message */}
                        <div>
                            <label className="block text-sm font-medium text-primary dark:text-gray-200 mb-1">
                                Message <span className="text-magenta">*</span>
                            </label>
                            <textarea
                                required
                                rows={4}
                                placeholder="Enter the announcement details..."
                                value={formData.message}
                                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                className="w-full bg-white dark:bg-[#0F0B13] border border-secondary/25 dark:border-secondary/40 rounded-xl p-2.5 text-sm text-primary dark:text-white focus:ring-2 focus:ring-brand-blue focus:border-brand-blue outline-none resize-none"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            {/* Button Text */}
                            <div>
                                <label className="block text-sm font-medium text-primary dark:text-gray-200 mb-1">
                                    Button Text
                                </label>
                                <input
                                    type="text"
                                    placeholder="e.g. Read More (Default: Okay)"
                                    value={formData.buttonText || ''} // <-- Add || ''
                                    onChange={(e) => setFormData({ ...formData, buttonText: e.target.value })}
                                    className="w-full bg-white dark:bg-[#0F0B13] border border-secondary/25 dark:border-secondary/40 rounded-xl p-2.5 text-sm text-primary dark:text-white focus:ring-2 focus:ring-brand-blue focus:border-brand-blue outline-none"
                                />
                            </div>

                            {/* Button Link */}
                            <div>
                                <label className="block text-sm font-medium text-primary dark:text-gray-200 mb-1">
                                    Button Link (URL)
                                </label>
                                <input
                                    type="url"
                                    placeholder="https://..."
                                    value={formData.buttonLink || ''} // <-- Add || ''
                                    onChange={(e) => setFormData({ ...formData, buttonLink: e.target.value })}
                                    className="w-full bg-white dark:bg-[#0F0B13] border border-secondary/25 dark:border-secondary/40 rounded-xl p-2.5 text-sm text-primary dark:text-white focus:ring-2 focus:ring-brand-blue focus:border-brand-blue outline-none"
                                />
                            </div>
                        </div>

                        {/* Image URL */}
                        <div>
                            <label className="block text-sm font-medium text-primary dark:text-gray-200 mb-1">
                                Image Banner URL (Optional)
                            </label>
                            <input
                                type="url"
                                placeholder="https://..."
                                value={formData.imageUrl || ''} // <-- Add || ''
                                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                                className="w-full bg-white dark:bg-[#0F0B13] border border-secondary/25 dark:border-secondary/40 rounded-xl p-2.5 text-sm text-primary dark:text-white focus:ring-2 focus:ring-brand-blue focus:border-brand-blue outline-none"
                            />
                        </div>

                        {/* Toggles */}
                        <div className="flex items-center gap-6 pt-2">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={formData.isActive}
                                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                                    className="w-4 h-4 text-brand-blue rounded border-secondary/30 focus:ring-brand-blue focus:ring-2 bg-[#0F0B13]"
                                />
                                <span className="text-sm font-medium text-primary dark:text-gray-200">Active (Visible)</span>
                            </label>

                            <label className="flex items-center gap-2 disabled:opacity-50 cursor-not-allowed">
                                <input
                                    type="checkbox"
                                    checked={true}
                                    disabled
                                    onChange={(e) => setFormData({ ...formData, isSkippable: e.target.checked })}
                                    className="w-4 h-4 text-brand-blue rounded border-secondary/30 focus:ring-brand-blue focus:ring-2 bg-[#0F0B13]"
                                />
                                <span className="text-sm font-medium text-primary dark:text-gray-200">User Can Skip/Dismiss</span>
                            </label>
                        </div>

                    </form>
                </div>

                {/* Footer Actions */}
                <div className="flex items-center justify-end gap-3 p-6 border-t border-secondary/15 dark:border-secondary/20 bg-gray-50/50 dark:bg-[#16101B]">
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
                        form="upsert-alert-form"
                        disabled={isSubmitting}
                        className="flex items-center gap-2 bg-gradient-to-r from-brand-blue to-brand-green hover:opacity-90 text-white px-5 py-2 text-sm font-semibold rounded-xl transition-opacity shadow-sm disabled:opacity-50 cursor-pointer"
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 size={16} className="animate-spin" />
                                <span>Saving...</span>
                            </>
                        ) : (
                            <span>Save Announcement</span>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};