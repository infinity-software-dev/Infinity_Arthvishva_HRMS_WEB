import React from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { ExtraPoint } from '@/types/letterTypes';

interface ExtraPointsInputProps {
    points: ExtraPoint[];
    onChange: (points: ExtraPoint[]) => void;
    label?: string;
    hint?: string;
}

export const ExtraPointsInput: React.FC<ExtraPointsInputProps> = ({
    points,
    onChange,
    label = 'Extra Points',
    hint = 'These will appear above the Termination section in the letter.',
}) => {
    const addPoint = () => {
        onChange([...points, { title: '', description: '' }]);
    };

    const removePoint = (idx: number) => {
        onChange(points.filter((_, i) => i !== idx));
    };

    const updateTitle = (idx: number, value: string) => {
        onChange(points.map((ep, i) => i === idx ? { ...ep, title: value } : ep));
    };

    const updateDescription = (idx: number, value: string) => {
        onChange(points.map((ep, i) => i === idx ? { ...ep, description: value } : ep));
    };

    return (
        <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-5 space-y-4 bg-gray-50 dark:bg-gray-900/50">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-sm font-semibold text-gray-800 dark:text-white">{label}</h3>
                    {hint && <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{hint}</p>}
                </div>
                <button
                    type="button"
                    onClick={addPoint}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-brand-green text-white rounded-lg hover:bg-brand-green/90 transition-all"
                >
                    <Plus size={14} /> Add Point
                </button>
            </div>

            {points.length === 0 && (
                <p className="text-xs text-gray-400 dark:text-gray-500 italic text-center py-2">
                    No extra points added. Click "Add Point" to add one.
                </p>
            )}

            {points.map((ep, idx) => (
                <div key={idx} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 space-y-3 bg-white dark:bg-gray-800">
                    {/* Title */}
                    <div className="flex items-center gap-2">
                        <div className="flex-1">
                            <label className="text-xs font-medium text-gray-600 dark:text-gray-300 mb-1 block">
                                Point {idx + 1} — Title
                            </label>
                            <input
                                type="text"
                                value={ep.title}
                                onChange={(e) => updateTitle(idx, e.target.value)}
                                placeholder="e.g. Code of Conduct:"
                                className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-green"
                            />
                        </div>
                        <button
                            type="button"
                            onClick={() => removePoint(idx)}
                            className="mt-5 p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                            title="Remove this point"
                        >
                            <Trash2 size={15} />
                        </button>
                    </div>

                    {/* Description */}
                    <div>
                        <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 block">Description</label>
                        <textarea
                            value={ep.description}
                            onChange={(e) => updateDescription(idx, e.target.value)}
                            placeholder="Enter the description for this point..."
                            rows={3}
                            className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-green resize-none"
                        />
                    </div>
                </div>
            ))}
        </div>
    );
};
