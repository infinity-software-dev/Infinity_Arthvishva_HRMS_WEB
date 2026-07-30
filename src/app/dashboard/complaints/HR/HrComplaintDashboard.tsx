"use client";

import React, { useState } from 'react';
import { Search, AlertCircle, CheckCircle2 } from 'lucide-react';
import HrLiveComplaintsList from './HrLiveComplaintsList';
import HrHistoryComplaintsList from './HrHistoryComplaintsList';

export default function HrComplaintDashboard() {
    const [activeTab, setActiveTab] = useState<'Live' | 'History'>('Live');
    const [searchQuery, setSearchQuery] = useState('');

    // Only forward the search query to child lists if its length is > 1 character
    const activeSearchQuery = searchQuery.trim().length > 1 ? searchQuery : '';

    return (
        <div className="flex-1 w-full bg-white dark:bg-primary rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] dark:shadow-none border border-gray-100 dark:border-gray-800 p-6 transition-colors duration-300">

            {/* ─── HEADER & TABS ─── */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 border-b border-gray-100 dark:border-gray-800 pb-4">

                {/* Segmented Control Tabs */}
                <div className="flex space-x-1 bg-slate-50 dark:bg-gray-800/50 p-1 rounded-xl w-fit border border-gray-100 dark:border-gray-700/50">
                    <button
                        onClick={() => setActiveTab('Live')}
                        className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${activeTab === 'Live'
                            ? 'bg-white dark:bg-gray-700 text-brand-blue shadow-sm'
                            : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 hover:bg-gray-200/50 dark:hover:bg-gray-700/50'
                            }`}
                    >
                        <AlertCircle size={16} />
                        Live Complaints
                    </button>
                    <button
                        onClick={() => setActiveTab('History')}
                        className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${activeTab === 'History'
                            ? 'bg-white dark:bg-gray-700 text-brand-green shadow-sm'
                            : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 hover:bg-gray-200/50 dark:hover:bg-gray-700/50'
                            }`}
                    >
                        <CheckCircle2 size={16} />
                        History
                    </button>
                </div>

                {/* ─── SEARCH BAR ─── */}
                <div className="relative w-full sm:w-64">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                        <Search size={16} />
                    </div>
                    <input
                        type="text"
                        placeholder="Search employee or ticket..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-white/5 text-primary dark:text-white text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue transition-colors"
                    />
                </div>
            </div>

            {/* ─── TAB CONTENT AREA ─── */}
            <div className="min-h-[400px]">
                {activeTab === 'Live' ? (
                    <div className="w-full pt-4">
                        <HrLiveComplaintsList searchQuery={activeSearchQuery} />
                    </div>
                ) : (
                    <div className="w-full pt-4">
                        <HrHistoryComplaintsList searchQuery={activeSearchQuery} />
                    </div>
                )}
            </div>

        </div>
    );
}