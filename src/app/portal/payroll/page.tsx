"use client";

import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  ListFilter,
  Sparkles,
  ArrowRight,
  Clock,
  Loader2,
  ReceiptText,
  FileText,
  RefreshCw
} from 'lucide-react';
import { usePayrollPreview } from '@/hooks/portal-hooks/payroll-hooks/usePayrollPreview';
import { usePayrollHistory } from '@/hooks/portal-hooks/payroll-hooks/usePayrollHistory';
import SelectPayrollCycleModal from '@/components/portal/payroll/SelectPayrollCycleModal';
import PayrollDetailModal from '@/components/portal/payroll/PayrollDetailModal';
import HistoricalPayrollModal from '@/components/portal/payroll/HistoricalPayrollModal';
import PayrollHistoryCard from '@/components/portal/payroll/PayrollHistoryCard';

export default function PayslipsCenterPage() {
  const [activeTab, setActiveTab] = useState<'generate' | 'history'>('generate');
  const [isPreviewDetailOpen, setIsPreviewDetailOpen] = useState(false);

  // 1. Live Preview Hook
  const {
    startDate,
    endDate,
    setStartDate,
    setEndDate,
    cycles,
    isCycleModalOpen,
    setIsCycleModalOpen,
    handleSelectCycle,
    previewData,
    loading: previewLoading,
    handleGeneratePreview
  } = usePayrollPreview();

  // 2. Historical Payroll Hook
  const {
    payrollList,
    loading: historyLoading,
    selectedSlip,
    isDetailModalOpen: isHistoryDetailOpen,
    fetchPayrolls,
    handleSelectSlip,
    closeDetailModal: closeHistoryDetailModal
  } = usePayrollHistory(true);

  const formatDateLabel = (dateStr: string) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 pb-12 px-3 sm:px-6">

      {/* Header */}
      <div className="pt-2">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white tracking-tight leading-none mb-1.5">
          Payslips & Statements
        </h1>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Generate live salary estimates & review monthly payroll statements
        </p>
      </div>

      {/* Tabs */}
      <div className="flex p-1 bg-gray-100/80 dark:bg-gray-800/60 rounded-xl w-full sm:w-fit border border-gray-200/50 dark:border-gray-700/50">
        <button
          onClick={() => setActiveTab('generate')}
          className={`flex-1 sm:flex-initial px-5 py-2 rounded-lg text-xs font-semibold transition-all ${activeTab === 'generate'
              ? 'bg-white dark:bg-primary text-brand-blue dark:text-blue-400 shadow-sm'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
        >
          Generate Statement
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`flex-1 sm:flex-initial px-5 py-2 rounded-lg text-xs font-semibold transition-all ${activeTab === 'history'
              ? 'bg-white dark:bg-primary text-brand-blue dark:text-blue-400 shadow-sm'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
        >
          Payroll History
        </button>
      </div>

      {/* ── TAB 1: GENERATE NEW STATEMENT ── */}
      {activeTab === 'generate' ? (
        <div className="space-y-5">

          <div className="bg-white dark:bg-primary border border-gray-100 dark:border-gray-800 rounded-2xl p-4 sm:p-6 shadow-sm space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-1 border-b border-gray-50 dark:border-gray-800/60">
              <div>
                <h3 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white tracking-tight leading-none">
                  Select Statement Period
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Choose custom dates or select a standard monthly cycle
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsCycleModalOpen(true)}
                className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 bg-blue-50/80 hover:bg-blue-100 dark:bg-blue-500/10 dark:hover:bg-blue-500/20 text-brand-blue dark:text-blue-400 border border-blue-200/60 dark:border-blue-500/20 rounded-xl text-xs font-semibold transition-colors shrink-0 cursor-pointer"
              >
                <ListFilter size={13} />
                <span>Monthly Cycles</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  From Date
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full bg-gray-50/70 dark:bg-gray-800/40 border border-gray-200/80 dark:border-gray-700/80 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-medium text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue transition-all"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  To Date
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full bg-gray-50/70 dark:bg-gray-800/40 border border-gray-200/80 dark:border-gray-700/80 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-medium text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue transition-all"
                />
              </div>
            </div>

            <button
              onClick={handleGeneratePreview}
              disabled={previewLoading}
              className="w-full py-3 bg-brand-blue hover:bg-blue-700 text-white rounded-xl text-xs sm:text-sm font-semibold shadow-sm shadow-brand-blue/20 transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
            >
              {previewLoading ? (
                <>
                  <Loader2 size={15} className="animate-spin" />
                  <span>Calculating Statement...</span>
                </>
              ) : (
                <>
                  <Sparkles size={15} />
                  <span>Preview Payslip</span>
                </>
              )}
            </button>
          </div>

          {/* Generated Result Statement Card */}
          {previewData && (
            <div className="relative overflow-hidden bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800 rounded-2xl p-5 sm:p-6 shadow-sm transition-all">
              <div className="absolute -top-12 -right-12 w-32 h-32 bg-brand-blue/5 dark:bg-brand-blue/10 rounded-full blur-2xl pointer-events-none" />

              <div className="flex items-center justify-between relative z-10">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-blue-50/80 dark:bg-blue-500/10 text-brand-blue dark:text-blue-400 border border-blue-100/80 dark:border-blue-500/20 rounded-full text-[11px] font-medium tracking-wide">
                  <ReceiptText size={12} />
                  <span>Calculated Statement</span>
                </div>

                <button
                  type="button"
                  onClick={() => setIsPreviewDetailOpen(true)}
                  className="w-8 h-8 rounded-xl bg-gray-50 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700/80 border border-gray-200/60 dark:border-gray-700/60 flex items-center justify-center text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors group cursor-pointer"
                  title="View Breakdown"
                >
                  <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>

              <div className="my-4 relative z-10">
                <p className="text-[11px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                  Net Take Home Pay
                </p>
                <div className="mt-1 flex items-baseline">
                  <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                    ₹{Number(previewData.netSalary || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </h2>
                </div>
              </div>

              <div className="pt-3.5 border-t border-gray-100 dark:border-gray-800 flex flex-wrap items-center justify-between gap-2 text-xs text-gray-500 dark:text-gray-400 font-medium relative z-10">
                <div className="flex items-center gap-1.5">
                  <CalendarIcon size={13} className="text-gray-400 dark:text-gray-500" />
                  <span>{formatDateLabel(startDate)} – {formatDateLabel(endDate)}</span>
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-1 bg-gray-50 dark:bg-gray-800/80 border border-gray-100 dark:border-gray-700/60 rounded-lg text-gray-700 dark:text-gray-300 font-semibold">
                  <Clock size={12} className="text-brand-blue dark:text-blue-400" />
                  <span>{previewData.paidDays} Paid Days</span>
                </div>
              </div>
            </div>
          )}

        </div>
      ) : (
        /* ── TAB 2: PAYROLL HISTORY ── */
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
              Statement History ({payrollList.length})
            </h3>
            <button
              onClick={fetchPayrolls}
              disabled={historyLoading}
              className="text-xs text-brand-blue dark:text-blue-400 font-semibold flex items-center gap-1 hover:underline cursor-pointer disabled:opacity-50"
            >
              <RefreshCw size={12} className={historyLoading ? 'animate-spin' : ''} />
              Refresh
            </button>
          </div>

          {historyLoading ? (
            <div className="py-16 flex flex-col items-center justify-center gap-2 text-gray-400">
              <Loader2 size={24} className="animate-spin text-brand-blue" />
              <span className="text-xs font-medium">Loading statement history...</span>
            </div>
          ) : payrollList.length === 0 ? (
            <div className="bg-white dark:bg-primary border border-gray-100 dark:border-gray-800 rounded-2xl p-12 text-center flex flex-col items-center justify-center">
              <div className="w-12 h-12 rounded-full bg-gray-50 dark:bg-gray-800 flex items-center justify-center text-gray-400 mb-3">
                <FileText size={20} />
              </div>
              <h4 className="text-sm font-bold text-gray-800 dark:text-gray-200">No statements found</h4>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 max-w-xs">
                You haven't generated or received any payroll slips yet.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {payrollList.map((slip) => (
                <PayrollHistoryCard
                  key={slip._id}
                  item={slip}
                  onPress={() => handleSelectSlip(slip)}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Cycle Selector Modal */}
      <SelectPayrollCycleModal
        isOpen={isCycleModalOpen}
        onClose={() => setIsCycleModalOpen(false)}
        cycles={cycles}
        selectedStartDate={startDate}
        selectedEndDate={endDate}
        onSelect={handleSelectCycle}
      />

      {/* Preview Detail Modal */}
      <PayrollDetailModal
        isOpen={isPreviewDetailOpen}
        onClose={() => setIsPreviewDetailOpen(false)}
        slip={previewData}
      />

      {/* Historical Detail Modal */}
      <HistoricalPayrollModal
        isOpen={isHistoryDetailOpen}
        onClose={closeHistoryDetailModal}
        slip={selectedSlip}
      />

    </div>
  );
}