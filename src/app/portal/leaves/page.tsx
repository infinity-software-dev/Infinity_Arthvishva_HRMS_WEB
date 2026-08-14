"use client";

import { Calendar, Clock, CheckCircle2, XCircle, Plus, FileText } from 'lucide-react';
import { useLeaves } from '@/hooks/portal-hooks/leave-hooks/useLeaves';
import LeaveSummaryCard from '@/components/portal/leaves/LeaveSummaryCard';
import ViewLeaveModal from '@/components/portal/leaves/ViewLeaveModal';
import { useState } from 'react';
import ApplyLeaveModal from '@/components/portal/leaves/ApplyLeaveModal';

export default function LeaveManagementPage() {
  const { leaves, summary, loading, activeTab, setActiveTab, refresh } = useLeaves();
  const [selectedLeave, setSelectedLeave] = useState<any | null>(null);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);

  const tabs = ['All', 'Pending', 'Approved', 'Rejected', 'Cancelled'];

  // Format date properly (e.g., "28 Jul 2026")
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-GB', {
      day: 'numeric', month: 'short', year: 'numeric'
    });
  };

  const getStatusStyles = (status: string) => {
    switch (status) {
      case 'Approved': return 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20';
      case 'Pending': return 'bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400 border-amber-200 dark:border-amber-500/20';
      case 'Rejected': return 'bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400 border-red-200 dark:border-red-500/20';
      case 'Cancelled': return 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400 border-gray-200 dark:border-gray-700';
      default: return 'bg-gray-50 text-gray-600 border-gray-200';
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 pb-12">

      {/* 1. Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-[28px] font-black text-primary dark:text-white tracking-tight leading-none mb-1">
            My Leaves
          </h1>
          <p className="text-xs font-bold text-secondary dark:text-gray-400 tracking-wide">
            Track your leave applications and real-time status
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => setIsApplyModalOpen(true)} className="px-4 py-2.5 bg-brand-blue hover:bg-blue-700 text-white rounded-xl text-sm font-bold shadow-md shadow-brand-blue/20 transition-all flex items-center gap-2">
            <Plus size={16} /> Apply Leave
          </button>
        </div>
      </div>

      {/* 2. Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <LeaveSummaryCard title="Total Applied" value={summary.total} icon={FileText} borderClass="border-l-brand-blue" iconColor="text-brand-blue" loading={loading} />
        <LeaveSummaryCard title="Approved" value={summary.approved} icon={CheckCircle2} borderClass="border-l-emerald-500" iconColor="text-emerald-500" loading={loading} />
        <LeaveSummaryCard title="Pending" value={summary.pending} icon={Clock} borderClass="border-l-amber-500" iconColor="text-amber-500" loading={loading} />
        <LeaveSummaryCard title="Rejected" value={summary.rejected} icon={XCircle} borderClass="border-l-red-500" iconColor="text-red-500" loading={loading} />
      </div>

      {/* 3. Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-800 flex overflow-x-auto hide-scrollbar">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-3 text-sm font-bold whitespace-nowrap transition-colors relative ${activeTab === tab
              ? 'text-brand-blue dark:text-blue-400'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
              }`}
          >
            {tab}
            {activeTab === tab && (
              <div className="absolute bottom-0 left-0 w-full h-[3px] bg-brand-blue dark:bg-blue-500 rounded-t-full" />
            )}
          </button>
        ))}
      </div>

      {/* 4. Leave List */}
      <div className="space-y-3">
        {loading ? (
          <div className="py-12 text-center text-secondary dark:text-gray-400 font-medium flex flex-col items-center gap-3">
            <div className="w-6 h-6 border-2 border-brand-blue border-t-transparent rounded-full animate-spin"></div>
            Fetching leaves...
          </div>
        ) : leaves.length === 0 ? (
          <div className="py-12 text-center text-secondary dark:text-gray-400 font-medium bg-white dark:bg-primary border border-gray-100 dark:border-gray-800 rounded-2xl">
            No {activeTab !== 'All' ? activeTab.toLowerCase() : ''} leave records found.
          </div>
        ) : (
          leaves.map((leave, idx) => (
            <div
              key={idx}
              onClick={() => setSelectedLeave(leave)}
              className="bg-white dark:bg-primary border cursor-pointer border-gray-100 dark:border-gray-800 rounded-2xl p-5 flex flex-col md:flex-row md:items-center gap-5 hover:border-gray-200 dark:hover:border-gray-700 transition-colors shadow-sm">

              {/* Left: Type & Date */}
              <div className="flex items-start gap-4 md:w-[35%] shrink-0">
                <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center shrink-0">
                  <Calendar size={18} className="text-brand-blue dark:text-blue-400" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-[15px] font-black text-primary dark:text-white leading-none">
                      {leave.leaveCategory}
                    </h3>
                    {leave.isHalfDay && (
                      <span className="px-2 py-0.5 bg-blue-50 dark:bg-blue-500/10 text-brand-blue dark:text-blue-400 text-[9px] font-black uppercase tracking-wider rounded">
                        Half Day ({leave.halfDayPeriod})
                      </span>
                    )}
                  </div>
                  <p className="text-xs font-bold text-secondary dark:text-gray-400">
                    {formatDate(leave.startDate)} {leave.startDate !== leave.endDate && ` - ${formatDate(leave.endDate)}`}
                    <span className="mx-2">•</span>
                    <span className="text-gray-800 dark:text-gray-300">{leave.totalDays} day{leave.totalDays > 1 ? 's' : ''}</span>
                  </p>
                </div>
              </div>

              {/* Middle: Reason */}
              <div className="md:w-[45%]">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Reason</p>
                <p className="text-sm font-medium text-primary dark:text-gray-300 truncate">
                  {leave.reason}
                </p>
              </div>

              {/* Right: Status */}
              <div className="md:ml-auto shrink-0">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1 text-left md:text-right">Status</p>
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${getStatusStyles(leave.overallStatus)}`}>
                  {leave.overallStatus === 'Approved' && <CheckCircle2 size={12} />}
                  {leave.overallStatus === 'Pending' && <Clock size={12} />}
                  {leave.overallStatus === 'Rejected' && <XCircle size={12} />}
                  {leave.overallStatus}
                </span>
              </div>

            </div>
          ))
        )}
      </div>

      <ViewLeaveModal
        isOpen={!!selectedLeave}
        onClose={() => setSelectedLeave(null)}
        leave={selectedLeave}
        onCancelComplete={refresh} // Refresh list if cancelled
      />

      <ApplyLeaveModal
        isOpen={isApplyModalOpen}
        onClose={() => setIsApplyModalOpen(false)}
        onSuccess={refresh}
      />

    </div>
  );
}