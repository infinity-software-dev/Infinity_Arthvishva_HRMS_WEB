"use client";

import React from 'react';
import { CheckCircle, WifiOff, AlertCircle, Loader2, MapPin } from 'lucide-react';
import { GeoStatus, WorkMode } from '@/hooks/portal-hooks/attendance-hooks/useCheckIn';

interface GeoLocationBadgeProps {
    status: GeoStatus;
    distance: number;
    workMode: WorkMode;
}

export default function GeoLocationBadge({ status, distance, workMode }: GeoLocationBadgeProps) {
    const isRemote = workMode !== 'Office';

    const getStatusConfig = () => {
        switch (status) {
            case 'checking':
                return {
                    wrapper: 'bg-brand-blue/10 border-brand-blue/20 text-brand-blue',
                    icon: <Loader2 size={12} className="animate-spin" />,
                    text: 'Verifying location...'
                };
            case 'valid':
                return {
                    wrapper: 'bg-brand-green/10 border-brand-green/20 text-brand-green',
                    icon: <CheckCircle size={12} />,
                    text: isRemote ? 'Flexible Zone ✓' : `In zone · ${distance}m`
                };
            case 'invalid':
                return {
                    wrapper: isRemote
                        ? 'bg-brand-green/10 border-brand-green/20 text-brand-green'
                        : 'bg-red-50 dark:bg-red-500/10 border-red-200 dark:border-red-900/30 text-red-600 dark:text-red-400',
                    icon: isRemote ? <CheckCircle size={12} /> : <WifiOff size={12} />,
                    text: isRemote ? 'Remote Mode ✓' : `Out of range · ${distance}m`
                };
            case 'error':
                return {
                    wrapper: isRemote
                        ? 'bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-900/30 text-amber-600 dark:text-amber-400'
                        : 'bg-red-50 dark:bg-red-500/10 border-red-200 dark:border-red-900/30 text-red-600 dark:text-red-400',
                    icon: <AlertCircle size={12} />,
                    text: isRemote ? 'GPS Weak (Remote)' : 'GPS error'
                };
            case 'permission_denied':
                return {
                    wrapper: 'bg-red-50 dark:bg-red-500/10 border-red-200 dark:border-red-900/30 text-red-600 dark:text-red-400',
                    icon: <AlertCircle size={12} />,
                    text: 'Location blocked'
                };
            default:
                return {
                    wrapper: 'bg-gray-100 border-gray-200 text-gray-500',
                    icon: <MapPin size={12} />,
                    text: 'Unknown'
                };
        }
    };

    const config = getStatusConfig();

    return (
        <div className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold border transition-colors ${config.wrapper}`}>
            {config.icon}
            {config.text}
        </div>
    );
}