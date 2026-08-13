import React from 'react';

export default function PerformanceCard({ title, value, subtitle, icon }: { title: string, value: string, subtitle: string, icon: React.ReactNode }) {
  return (
    <div className="bg-white dark:bg-primary rounded-2xl p-5 shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-gray-100 dark:border-gray-800">
      <div className="text-[10px] font-bold text-secondary uppercase tracking-widest mb-3">
        {title}
      </div>
      <div className="flex items-end justify-between">
        <div>
          <div className="text-3xl font-bold text-primary dark:text-white leading-none mb-1">
            {value}
          </div>
          <div className="text-xs font-medium text-secondary">
            {subtitle}
          </div>
        </div>
      </div>
    </div>
  );
}
