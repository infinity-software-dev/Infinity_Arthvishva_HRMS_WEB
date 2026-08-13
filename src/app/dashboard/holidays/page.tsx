'use client'

import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, Plus, Trash2, MapPin, Building2, Loader2 } from 'lucide-react';

// Matches your NestJS Mongoose Schema
interface Holiday {
  _id: string;
  date: string;
  year: number;
  name: string;
  type: 'National' | 'Company-specific';
  description?: string;
  isActive: boolean;
  createdBy?: { _id: string; name: string };
}

export default function HolidaysPage() {
  const [holidays, setHolidays] = useState<Holiday[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  // Fetch holidays based on the selected year (Maps to findAllByYear in NestJS)
  useEffect(() => {
    const fetchHolidays = async () => {
      setIsLoading(true);
      try {
        // Replace with your actual API endpoint
        const response = await fetch(`/api/holidays?year=${selectedYear}`);
        const data = await response.json();
        setHolidays(data);
      } catch (error) {
        console.error('Failed to fetch holidays:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHolidays();
  }, [selectedYear]);

  // Maps to softDelete in NestJS
  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to remove this holiday?')) return;
    
    try {
      // Replace with your actual DELETE endpoint
      await fetch(`/api/holidays/${id}`, { method: 'DELETE' });
      setHolidays((prev) => prev.filter((holiday) => holiday._id !== id));
    } catch (error) {
      console.error('Failed to delete holiday:', error);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 font-sans">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Holiday Calendar</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Manage national and company-specific holidays.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <select 
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white text-sm rounded-lg focus:ring-[#573CFF] focus:border-[#573CFF] block p-2.5 outline-none"
          >
            {[selectedYear - 1, selectedYear, selectedYear + 1].map((year) => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>

          <button className="flex items-center gap-2 bg-[#573CFF] hover:bg-[#482ee0] text-white px-4 py-2.5 rounded-lg font-medium transition-colors">
            <Plus size={18} />
            <span>Add Holiday</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-500">
            <Loader2 className="animate-spin mb-4 text-[#573CFF]" size={32} />
            <p>Loading {selectedYear} holidays...</p>
          </div>
        ) : holidays.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-500 text-center px-4">
            <CalendarIcon size={48} className="mb-4 text-gray-400 opacity-50" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">No holidays found</h3>
            <p>There are no holidays configured for {selectedYear} yet.</p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-200 dark:divide-gray-800">
            {holidays.map((holiday) => {
              const dateObj = new Date(holiday.date);
              const month = dateObj.toLocaleString('default', { month: 'short' });
              const day = dateObj.getDate();

              return (
                <li key={holiday._id} className="p-4 sm:p-6 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors flex items-start gap-4 sm:gap-6 group">
                  
                  {/* Date Badge */}
                  <div className="flex-shrink-0 flex flex-col items-center justify-center w-16 h-16 rounded-lg border-2 border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm overflow-hidden">
                    <div className="bg-[#FF0069] text-white text-xs font-bold w-full text-center py-1 uppercase tracking-wider">
                      {month}
                    </div>
                    <div className="text-xl font-bold text-gray-900 dark:text-white mt-1">
                      {day}
                    </div>
                  </div>

                  {/* Holiday Details */}
                  <div className="flex-grow min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white truncate">
                        {holiday.name}
                      </h3>
                      <span className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-0.5 rounded-full ${
                        holiday.type === 'National' 
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                          : 'bg-purple-100 text-[#573CFF] dark:bg-purple-900/30 dark:text-[#573CFF]'
                      }`}>
                        {holiday.type === 'National' ? <MapPin size={12} /> : <Building2 size={12} />}
                        {holiday.type}
                      </span>
                    </div>
                    
                    {holiday.description && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">
                        {holiday.description}
                      </p>
                    )}
                    
                    {holiday.createdBy && (
                      <p className="text-xs text-gray-400 dark:text-gray-500">
                        Added by {holiday.createdBy.name}
                      </p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => handleDelete(holiday._id)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                      title="Remove Holiday"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}