import React from 'react';
import { X } from 'lucide-react';
import GradientButton from '../buttons/GradientButton';

interface AddVideoModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (e?: React.FormEvent) => void; // <-- Added onSubmit here
    form: any;
}

export default function AddVideoModal({ isOpen, onClose, onSubmit, form }: AddVideoModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-primary w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] border border-gray-100 dark:border-gray-800">

                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Add New Video</h2>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Fill in the details to add a new learning module.</p>
                    </div>
                    <button onClick={onClose} className="p-2 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 overflow-y-auto">
                    {/* Form now uses onSubmit prop instead of form.handleSubmit directly */}
                    <form id="add-video-form" onSubmit={onSubmit} className="space-y-5">

                        <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-xl border border-gray-100 dark:border-gray-800">
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Video Source Type</label>
                            <div className="flex gap-6">
                                <label className="flex items-center gap-2.5 cursor-pointer">
                                    <input type="radio" name="videoType" value="direct" checked={form.videoType === 'direct'} onChange={() => form.setVideoType('direct')} className="w-4 h-4 text-brand-green focus:ring-brand-green bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600" />
                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-200">Direct / Cloudinary</span>
                                </label>
                                <label className="flex items-center gap-2.5 cursor-pointer">
                                    <input type="radio" name="videoType" value="youtube" checked={form.videoType === 'youtube'} onChange={() => form.setVideoType('youtube')} className="w-4 h-4 text-brand-green focus:ring-brand-green bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600" />
                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-200">YouTube Link</span>
                                </label>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Module Title <span className="text-red-500">*</span></label>
                            <input type="text" required value={form.title} onChange={(e) => form.setTitle(e.target.value)} className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-green dark:text-white transition-all placeholder:text-gray-400" placeholder="Enter video title" />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Video URL <span className="text-red-500">*</span></label>
                            <input type="url" required value={form.videoUrl} onChange={(e) => form.setVideoUrl(e.target.value)} className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-green dark:text-white transition-all placeholder:text-gray-400" placeholder={form.videoType === 'youtube' ? "https://youtube.com/watch?v=..." : "https://res.cloudinary.com/..."} />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Thumbnail URL</label>
                            <input type="url" value={form.thumbnail} onChange={(e) => form.setThumbnail(e.target.value)} className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-green dark:text-white transition-all placeholder:text-gray-400" placeholder="https://image-url.com/thumb.png" />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Description</label>
                            <textarea value={form.description} onChange={(e) => form.setDescription(e.target.value)} rows={3} className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-green dark:text-white transition-all placeholder:text-gray-400 resize-none" placeholder="Enter detailed description" />
                        </div>

                        <div className="flex gap-4">
                            <div className="flex-1">
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Duration (seconds)</label>
                                <input type="number" value={form.duration} onChange={(e) => form.setDuration(e.target.value)} className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-green dark:text-white transition-all placeholder:text-gray-400" placeholder="e.g. 120" />
                            </div>
                            <div className="flex-1 flex items-center mt-7">
                                <label className="flex items-center gap-2.5 cursor-pointer bg-gray-50 dark:bg-gray-900 px-4 py-2.5 rounded-xl border border-gray-100 dark:border-gray-800 w-full">
                                    <input type="checkbox" checked={form.isActive} onChange={(e) => form.setIsActive(e.target.checked)} className="w-4 h-4 text-brand-green rounded border-gray-300 focus:ring-brand-green dark:border-gray-600 dark:bg-gray-800" />
                                    <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                                        Make visible to employees
                                    </span>
                                </label>
                            </div>
                        </div>

                    </form>
                </div>

                {/* Footer */}
                <div className="flex justify-end gap-3 p-6 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50">
                    <button type="button" onClick={onClose} className="px-5 py-2.5 text-sm font-semibold text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-xl transition-colors shadow-sm">
                        Cancel
                    </button>
                    {/* Button triggers the passed onSubmit function */}
                    <GradientButton onClick={onSubmit} type="button">
                        Save Video
                    </GradientButton>
                </div>

            </div>
        </div>
    );
}