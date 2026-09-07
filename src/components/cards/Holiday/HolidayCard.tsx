import React, { useState, useEffect } from 'react';
import { Trash2, MapPin, Building2, Ban } from 'lucide-react';
import { Holiday } from '@/services/holiday.service';

interface HolidayCardProps {
    holiday: Holiday;
    onDelete: (id: string, name: string) => void;
}

export const HolidayCard: React.FC<HolidayCardProps> = ({ holiday, onDelete }) => {
    const [isHR, setIsHR] = useState(false);

    useEffect(() => {
        setIsHR(localStorage.getItem('role') === 'HR');
    }, []);

    const isActive = holiday.isActive !== false;

    const dateObj = new Date(holiday.date);
    const month = dateObj.toLocaleDateString('en-US', {
        month: 'short',
        timeZone: 'Asia/Kolkata',
    });
    const day = dateObj.toLocaleDateString('en-US', {
        day: '2-digit',
        timeZone: 'Asia/Kolkata',
    });
    const weekday = dateObj.toLocaleDateString('en-US', {
        weekday: 'short',
        timeZone: 'Asia/Kolkata',
    });

    return (
        <li
            className={`p-4 sm:p-6 transition-colors flex items-start gap-4 sm:gap-6 group ${isActive
                    ? 'hover:bg-secondary/5 dark:hover:bg-secondary/15'
                    : 'grayscale opacity-60 bg-gray-100/40 dark:bg-gray-900/30'
                }`}
        >
            {/* Date Badge */}
            <div className="flex-shrink-0 flex flex-col items-center justify-center w-16 h-16 rounded-xl border border-secondary/20 dark:border-secondary/30 bg-white dark:bg-[#16101B] shadow-sm overflow-hidden">
                <div
                    className={`text-white text-[11px] font-bold w-full text-center py-0.5 uppercase tracking-wider ${isActive
                            ? 'bg-gradient-to-r from-brand-blue to-brand-green'
                            : 'bg-gray-500 dark:bg-gray-600'
                        }`}
                >
                    {month}
                </div>
                <div
                    className={`text-lg font-bold leading-none mt-1 ${isActive ? 'text-primary dark:text-white' : 'text-gray-500 dark:text-gray-400'
                        }`}
                >
                    {day}
                </div>
                <div className="text-[10px] text-secondary dark:text-gray-400 font-medium">
                    {weekday}
                </div>
            </div>

            {/* Holiday Details */}
            <div className="flex-grow min-w-0">
                <div className="flex items-center gap-3 mb-1 flex-wrap">
                    <h3
                        className={`text-lg font-bold truncate ${isActive
                                ? 'text-primary dark:text-white'
                                : 'text-gray-500 dark:text-gray-400 line-through'
                            }`}
                    >
                        {holiday.name}
                    </h3>

                    {/* Type Badge */}
                    <span
                        className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full ${!isActive
                                ? 'bg-gray-200 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
                                : holiday.type === 'National'
                                    ? 'bg-brand-blue/10 text-brand-blue dark:bg-brand-blue/20 dark:text-brand-blue'
                                    : 'bg-magenta/10 text-magenta dark:bg-magenta/20 dark:text-lavender'
                            }`}
                    >
                        {holiday.type === 'National' ? <MapPin size={12} /> : <Building2 size={12} />}
                        {holiday.type}
                    </span>

                    {/* Inactive Tag */}
                    {!isActive && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-gray-200 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
                            <Ban size={10} />
                            Inactive
                        </span>
                    )}
                </div>

                {holiday.description && (
                    <p className="text-sm text-secondary dark:text-gray-300 mb-2 line-clamp-2">
                        {holiday.description}
                    </p>
                )}

                {holiday.createdBy && (
                    <p className="text-xs text-secondary/70 dark:text-gray-400">
                        Added by HR Department.
                    </p>
                )}
            </div>

            {/* Actions */}
            {isHR && isActive && (
                <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                        onClick={() => onDelete(holiday._id, holiday.name)}
                        className="p-2 text-secondary/60 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-colors cursor-pointer"
                        title="Remove Holiday"
                    >
                        <Trash2 size={18} />
                    </button>
                </div>
            )}
        </li>
    );
};