"use client";

import { WorkMode } from '@/hooks/portal-hooks/attendance-hooks/useCheckIn';

interface WorkModeSelectorProps {
    currentMode: WorkMode;
    onModeChange: (mode: WorkMode) => void;
}

export default function WorkModeSelector({ currentMode, onModeChange }: WorkModeSelectorProps) {
    const modes: WorkMode[] = ['Office', 'Field', 'WFH'];

    return (
        <div className="flex bg-gray-100 dark:bg-gray-800/80 p-1 rounded-xl w-full max-w-[340px]">
            {modes.map((mode) => (
                <button
                    key={mode}
                    onClick={() => onModeChange(mode)}
                    className={`flex-1 py-3 text-sm font-bold rounded-lg transition-all ${currentMode === mode
                            ? 'bg-white dark:bg-primary text-brand-blue shadow-sm'
                            : 'text-secondary dark:text-gray-400 hover:text-primary dark:hover:text-gray-200'
                        }`}
                >
                    {mode}
                </button>
            ))}
        </div>
    );
}