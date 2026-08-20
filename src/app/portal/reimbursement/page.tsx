"use client";

import React, { useState } from 'react';
import PageTitleHeader from '@/components/elements/PageTitleHeader';
import ReimbursementHistory from './screens/ReimbursementHistory';
import ApplyReimbursement from './screens/ApplyReimbursement';

// We will build this file next!
// import ApplyReimbursement from './screens/ApplyReimbursement'; 

export default function ReimbursementPage() {
    const [activeTab, setActiveTab] = useState<'apply' | 'history'>('apply');

    return (
        <div className="w-full mx-auto p-4 sm:p-6 md:p-8 space-y-6 md:space-y-8 font-sans">

            {/* Page Header */}
            <PageTitleHeader
                title="Reimbursements"
                description="Submit new expense claims and track your reimbursement history."
            />

            {/* Mobile-App Style Tab Navigation */}
            <div className="flex justify-center w-full">
                <div className="flex bg-gray-100/80 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full p-1 w-full max-w-sm shadow-inner">
                    <button
                        onClick={() => setActiveTab('apply')}
                        className={`flex-1 py-2.5 text-sm font-bold rounded-full transition-all duration-300 ${activeTab === 'apply'
                            ? 'bg-white dark:bg-gray-900 text-brand-green shadow-[0_2px_8px_rgba(0,0,0,0.08)]'
                            : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                            }`}
                    >
                        Apply
                    </button>
                    <button
                        onClick={() => setActiveTab('history')}
                        className={`flex-1 py-2.5 text-sm font-bold rounded-full transition-all duration-300 ${activeTab === 'history'
                            ? 'bg-white dark:bg-gray-900 text-brand-green shadow-[0_2px_8px_rgba(0,0,0,0.08)]'
                            : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                            }`}
                    >
                        History
                    </button>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="mt-6">
                {activeTab === 'history' ? (
                    <ReimbursementHistory />
                ) : (
                    <ApplyReimbursement onSuccess={() => setActiveTab('history')} />
                )}
            </div>

        </div>
    );
}