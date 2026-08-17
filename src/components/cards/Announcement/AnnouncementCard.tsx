import React, { useState } from 'react';
import { Megaphone, Edit2, Ban, ExternalLink, Smartphone, Sparkles, Info } from 'lucide-react';
import { GlobalAlert } from '@/services/announcement.service';

interface AnnouncementCardProps {
    alert: GlobalAlert;
    onEdit: (alert: GlobalAlert) => void;
}

export const AnnouncementCard: React.FC<AnnouncementCardProps> = ({ alert, onEdit }) => {
    // Track if the image fails to load (fixes the broken image issue seen in your UI)
    const [imageError, setImageError] = useState(false);
    const isHr = localStorage.getItem('role') === 'HR';

    const isActive = alert.isActive !== false;
    const isPromo = alert.type === 'promo';

    return (
        <div className={`group flex flex-col bg-white dark:bg-[#16101B] rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 border ${isActive ? 'border-secondary/15 dark:border-secondary/30' : 'border-gray-200 dark:border-gray-800 grayscale opacity-75'
            } overflow-hidden transition-all duration-300`}
        >
            {/* Image Banner / Fallback */}
            {alert.imageUrl && !imageError ? (
                <div className="h-40 w-full relative overflow-hidden bg-gray-100 dark:bg-gray-800 border-b border-secondary/10 dark:border-secondary/20">
                    <img
                        src={alert.imageUrl}
                        alt={alert.title}
                        onError={() => setImageError(true)}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    {/* Subtle inner shadow for text readability if you ever overlay text */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent pointer-events-none"></div>
                </div>
            ) : (
                <div className={`h-40 w-full flex items-center justify-center relative overflow-hidden border-b border-secondary/10 dark:border-secondary/20 ${isPromo
                        ? 'bg-gradient-to-br from-magenta/20 via-fuchsia-50 to-magenta/5 dark:from-magenta/900/30 dark:via-fuchsia-900/10 dark:to-magenta/5'
                        : 'bg-gradient-to-br from-brand-blue/20 via-cyan-50 to-brand-green/10 dark:from-brand-blue/900/30 dark:via-cyan-900/10 dark:to-brand-green/5'
                    }`}>
                    {/* Decorative abstract circles in the background */}
                    <div className="absolute top-0 right-0 -mt-6 -mr-6 w-32 h-32 bg-white/40 dark:bg-white/5 rounded-full blur-2xl pointer-events-none"></div>
                    <div className="absolute bottom-0 left-0 -mb-6 -ml-6 w-24 h-24 bg-white/40 dark:bg-white/5 rounded-full blur-2xl pointer-events-none"></div>

                    {isPromo ? (
                        <Sparkles className="text-magenta/50 dark:text-magenta/40 z-10" size={44} strokeWidth={1.5} />
                    ) : (
                        <Megaphone className="text-brand-blue/50 dark:text-brand-blue/40 z-10" size={44} strokeWidth={1.5} />
                    )}
                </div>
            )}

            <div className="p-6 flex flex-col flex-grow">
                {/* Header Row: Title & Badge */}
                <div className="flex items-start justify-between mb-3 gap-4">
                    <h3 className="text-xl font-bold text-primary dark:text-white line-clamp-2 leading-tight">
                        {alert.title}
                    </h3>
                    <div className="flex-shrink-0 mt-0.5">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest ${isPromo
                                ? 'bg-magenta/10 text-magenta border border-magenta/20 dark:border-magenta/30'
                                : 'bg-brand-blue/10 text-brand-blue border border-brand-blue/20 dark:border-brand-blue/30'
                            }`}>
                            {isPromo ? <Sparkles size={12} /> : <Info size={12} />}
                            {alert.type}
                        </span>
                    </div>
                </div>

                {/* Message Body */}
                <p className="text-sm text-secondary/90 dark:text-gray-300 line-clamp-3 mb-6 flex-grow leading-relaxed">
                    {alert.message}
                </p>

                {/* Footer Controls */}
                <div className="flex items-end justify-between pt-4 border-t border-secondary/15 dark:border-secondary/20">
                    <div className="flex flex-col gap-2.5">

                        <div className="flex flex-wrap items-center gap-2">
                            {/* Platform Target */}
                            <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold bg-secondary/5 dark:bg-secondary/10 text-secondary dark:text-gray-300 px-2.5 py-1.5 rounded-md border border-secondary/10 dark:border-secondary/20">
                                <Smartphone size={13} className="text-secondary/70" />
                                {alert.platform === 'both' ? 'All Platforms' : alert.platform === 'android' ? 'Android Only' : 'iOS Only'}
                            </span>

                            {/* Link Indicator */}
                            {alert.buttonLink && (
                                <span className="inline-flex items-center gap-1 text-[11px] font-semibold bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 px-2.5 py-1.5 rounded-md border border-blue-100 dark:border-blue-900/50" title="Contains redirect link">
                                    <ExternalLink size={13} /> Link
                                </span>
                            )}
                        </div>

                        {/* Inactive State Indicator */}
                        {!isActive && (
                            <span className="inline-flex w-fit items-center gap-1 text-[11px] font-semibold bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 px-2 py-1 rounded-md border border-red-100 dark:border-red-900/50">
                                <Ban size={12} /> Draft / Inactive
                            </span>
                        )}
                    </div>

                    {/* Action Button */}
                    {isHr && (
                        <button
                            onClick={() => onEdit(alert)}
                            className="flex-shrink-0 flex items-center justify-center gap-2 p-2 px-4 bg-secondary/5 hover:bg-brand-blue hover:text-white dark:bg-secondary/10 dark:hover:bg-brand-blue text-primary dark:text-white rounded-xl transition-colors duration-200 cursor-pointer font-semibold shadow-sm hover:shadow"
                        >
                            <Edit2 size={15} />
                            <span className="text-sm">Edit</span>
                        </button>)
                    }
                </div>
            </div>
        </div>
    );
};