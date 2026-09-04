"use client";

import { ShieldCheck, Calendar, Activity } from "lucide-react";

interface DirectorHeaderProps {
    idCode: string;
    isActive: boolean;
    createdAt?: string;
}

export default function DirectorProfileHeader({ idCode, isActive, createdAt }: DirectorHeaderProps) {
    // Format the creation date if it exists
    const formattedDate = createdAt
        ? new Date(createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })
        : 'System Initialization';

    return (
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6 bg-white dark:bg-primary p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-secondary/30 transition-colors">

            {/* Root Access Icon */}
            <div className="w-24 h-24 shrink-0 rounded-2xl bg-brand-blue/10 dark:bg-brand-blue/5 border border-brand-blue/20 flex items-center justify-center text-brand-blue relative overflow-hidden">
                <ShieldCheck size={48} strokeWidth={1.5} className="relative z-10" />
            </div>

            <div className="flex-1 text-center md:text-left space-y-2">
                <h2 className="text-2xl font-bold tracking-wide text-gray-900 dark:text-white uppercase ">
                    Director
                </h2>
                <p className="text-gray-500 dark:text-lavender/80 text-sm font-mono uppercase tracking-widest">
                    Root System Administrator
                </p>

                <div className="pt-4 grid grid-cols-1 md:grid-cols-3 gap-3">

                    {/* ID Code */}
                    <div className="flex items-center justify-center md:justify-start gap-2 bg-gray-50 dark:bg-secondary/20 p-2.5 rounded-lg border border-gray-100 dark:border-secondary/40">
                        <span className="text-gray-400 dark:text-lavender/70 font-mono text-xs uppercase tracking-wider">ID Code</span>
                        <span className="font-semibold font-mono text-sm text-gray-900 dark:text-white">{idCode}</span>
                    </div>

                    {/* Active Status */}
                    <div className={`flex items-center justify-center md:justify-start gap-2 p-2.5 rounded-lg border ${isActive
                            ? "bg-brand-green/10 border-brand-green/20 text-brand-green"
                            : "bg-magenta/10 border-magenta/20 text-magenta"
                        }`}>
                        <Activity size={16} />
                        <span className="font-semibold text-sm">
                            {isActive ? "System Active" : "Suspended"}
                        </span>
                    </div>

                    {/* Created At */}
                    {/* <div className="flex items-center justify-center md:justify-start gap-2 bg-gray-50 dark:bg-secondary/20 p-2.5 rounded-lg border border-gray-100 dark:border-secondary/40">
                        <Calendar size={16} className="text-gray-400 dark:text-lavender/70" />
                        <span className="text-gray-700 dark:text-white text-sm font-medium">{formattedDate}</span>
                    </div> */}

                </div>
            </div>
        </div>
    );
}