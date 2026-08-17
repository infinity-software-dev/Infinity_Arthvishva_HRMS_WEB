'use client';

import React, { useState } from 'react';
import { Calendar as CalendarIcon, Plus, Loader2, AlertCircle } from 'lucide-react';
import { useHolidays } from '@/hooks/holiday-hooks/useHolidays';
import { HolidayCard } from '@/components/cards/Holiday/HolidayCard';
import { AddHolidayModal } from '@/components/modals/AddHolidayModal';

export default function HolidaysPage() {
  const isHR = localStorage.getItem('role') === 'HR'; // Check if the user is HR
  const currentYear = new Date().getFullYear();
  const {
    holidays,
    selectedYear,
    setSelectedYear,
    isLoading,
    error,
    addHoliday,
    removeHoliday,
  } = useHolidays({ initialYear: currentYear });

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to remove "${name}" from the holiday calendar?`)) {
      return;
    }

    try {
      await removeHoliday(id);
    } catch (err: any) {
      alert(err.message || 'Failed to delete holiday');
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 font-sans">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-primary dark:text-white">Holiday Calendar</h1>
          <p className="text-secondary dark:text-gray-400 mt-1">
            Manage official holidays and non-working days for payroll & attendance.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className="bg-white dark:bg-[#16101B] border border-secondary/25 dark:border-secondary/40 text-primary dark:text-white text-sm rounded-xl focus:ring-2 focus:ring-brand-blue focus:border-brand-blue block p-2.5 outline-none cursor-pointer"
          >
            {[selectedYear - 1, selectedYear, selectedYear + 1].map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>

          {isHR && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 bg-gradient-to-r from-brand-blue to-brand-green hover:opacity-90 text-white px-4 py-2.5 rounded-xl font-medium transition-opacity shadow-sm cursor-pointer"
            >
              <Plus size={18} />
              <span>Add Holiday</span>
            </button>
          )}
        </div>
      </div>

      {/* Global Error Banner */}
      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 flex items-center gap-3">
          <AlertCircle size={20} className="flex-shrink-0" />
          <p className="text-sm">{error}</p>
        </div>
      )}

      {/* Main Content Area */}
      <div className="bg-white dark:bg-[#16101B] rounded-2xl shadow-sm border border-secondary/20 dark:border-secondary/30 overflow-hidden">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 text-secondary dark:text-gray-400">
            <Loader2 className="animate-spin mb-4 text-brand-green" size={32} />
            <p>Loading {selectedYear} holidays...</p>
          </div>
        ) : holidays.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-secondary dark:text-gray-400 text-center px-4">
            <CalendarIcon size={48} className="mb-4 text-secondary/40 opacity-50" />
            <h3 className="text-lg font-semibold text-primary dark:text-white mb-1">
              No holidays found
            </h3>
            <p className="text-sm">There are no holidays configured for {selectedYear} yet.</p>
          </div>
        ) : (
          <ul className="divide-y divide-secondary/15 dark:divide-secondary/20">
            {holidays.map((holiday) => (
              <HolidayCard
                key={holiday._id}
                holiday={holiday}
                onDelete={handleDelete}
              />
            ))}
          </ul>
        )}
      </div>

      {/* Add Holiday Modal */}
      <AddHolidayModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={addHoliday}
        selectedYear={selectedYear}
      />
    </div>
  );
}