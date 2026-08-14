"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Calendar as CalendarIcon, 
  Clock, 
  Coins, 
  Send, 
  Loader2, 
  Check, 
  AlertCircle, 
  Sun, 
  Moon 
} from 'lucide-react';
import { useApplyLeave } from '@/hooks/portal-hooks/leave-hooks/useApplyLeave';

interface ApplyLeaveModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function ApplyLeaveModal({ isOpen, onClose, onSuccess }: ApplyLeaveModalProps) {
  const { form, balances, status, actions } = useApplyLeave({ isOpen, onSuccess, onClose });

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 sm:p-6 bg-slate-900/70 backdrop-blur-md">
        <motion.div
          initial={{ scale: 0.94, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.94, opacity: 0, y: 20 }}
          transition={{ type: 'spring', damping: 28, stiffness: 350 }}
          className="relative bg-white dark:bg-primary rounded-3xl w-full max-w-[560px] flex flex-col shadow-2xl overflow-hidden max-h-[92dvh]"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-5 sm:p-6 border-b border-gray-100 dark:border-gray-800 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-brand-blue flex items-center justify-center text-white shadow-md shadow-brand-blue/20">
                <CalendarIcon size={18} />
              </div>
              <div>
                <h2 className="text-lg font-black text-primary dark:text-white tracking-tight leading-none">
                  Apply for Leave
                </h2>
                <p className="text-xs font-bold text-secondary dark:text-gray-400 mt-0.5">
                  Submit a new time-off request
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg bg-gray-50 dark:bg-gray-800 flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors"
            >
              <X size={16} />
            </button>
          </div>

          {/* Body */}
          <div className="p-5 sm:p-6 overflow-y-auto space-y-5">
            
            {/* 1. Available Tokens Cards */}
            <div>
              <span className="text-[10px] font-bold text-secondary dark:text-gray-400 uppercase tracking-widest flex items-center gap-1.5 mb-2">
                <Coins size={12} className="text-brand-blue" /> Available Tokens
              </span>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-50/80 dark:bg-gray-800/40 border border-gray-100 dark:border-gray-700/60 rounded-2xl p-3.5 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-500/10 text-brand-blue dark:text-blue-400 flex items-center justify-center font-bold">
                    <CalendarIcon size={16} />
                  </div>
                  <div>
                    <h4 className="text-lg font-black text-primary dark:text-white leading-none">
                      {balances.loadingTokens ? '-' : balances.totalPaidBalance}
                    </h4>
                    <p className="text-[10px] font-bold text-secondary dark:text-gray-400 uppercase tracking-wider mt-0.5">Paid Leaves</p>
                  </div>
                </div>

                <div className="bg-gray-50/80 dark:bg-gray-800/40 border border-gray-100 dark:border-gray-700/60 rounded-2xl p-3.5 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
                    <Clock size={16} />
                  </div>
                  <div>
                    <h4 className="text-lg font-black text-primary dark:text-white leading-none">
                      {balances.loadingTokens ? '-' : balances.totalCompOffBalance}
                    </h4>
                    <p className="text-[10px] font-bold text-secondary dark:text-gray-400 uppercase tracking-wider mt-0.5">Comp-Offs</p>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Leave Category Selector */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold text-secondary dark:text-gray-400 uppercase tracking-wider">
                Leave Category
              </label>
              <select
                value={form.leaveCategory}
                onChange={(e) => actions.setLeaveCategory(e.target.value)}
                className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl px-3.5 py-2.5 text-sm font-bold text-primary dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-blue/30 focus:border-brand-blue transition-all"
              >
                <option value="Casual">Casual (Unpaid)</option>
                <option value="Sick">Sick (Unpaid)</option>
                <option value="Paid">Paid (Uses Paid Token)</option>
                <option value="CompOff">CompOff (Uses CompOff Token)</option>
                <option value="Unpaid">Unpaid Leave</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* 3. Token Selection (Only for Paid / CompOff) */}
            {form.requiresTokens && (
              <div className="bg-blue-50/60 dark:bg-blue-500/5 border border-blue-100 dark:border-blue-500/20 rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-brand-blue dark:text-blue-400 uppercase tracking-wider">
                    Select {form.leaveCategory} Tokens to Consume
                  </span>
                  <span className="text-xs font-bold text-secondary dark:text-gray-400">
                    Need: <strong className="text-primary dark:text-white">{form.totalDays}</strong> | Selected: <strong className="text-brand-blue dark:text-blue-400">{form.selectedTokenValueSum}</strong>
                  </span>
                </div>

                {balances.relevantTokens.length === 0 ? (
                  <div className="py-4 text-center text-xs font-medium text-amber-600 dark:text-amber-400 flex items-center justify-center gap-1.5">
                    <AlertCircle size={14} /> You have no active {form.leaveCategory} tokens available.
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2.5 max-h-[140px] overflow-y-auto pr-1">
                    {balances.relevantTokens.map((token: any) => {
                      const isSelected = form.selectedTokenIds.includes(token._id);
                      return (
                        <button
                          key={token._id}
                          type="button"
                          onClick={() => actions.toggleTokenSelection(token._id)}
                          className={`p-3 rounded-xl border text-left transition-all flex items-start justify-between ${
                            isSelected
                              ? 'bg-brand-blue text-white border-brand-blue shadow-sm'
                              : 'bg-white dark:bg-gray-800/80 border-gray-200 dark:border-gray-700 hover:border-brand-blue/50'
                          }`}
                        >
                          <div>
                            <span className={`text-xs font-black block ${isSelected ? 'text-white' : 'text-primary dark:text-white'}`}>
                              {token.value || 1} Day Token
                            </span>
                            {token.expiryDate ? (
                              <span className={`text-[10px] font-medium block mt-0.5 ${isSelected ? 'text-blue-100' : 'text-red-500'}`}>
                                Exp: {new Date(token.expiryDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                              </span>
                            ) : token.fixedAllowanceMonth ? (
                              <span className={`text-[10px] font-medium block mt-0.5 ${isSelected ? 'text-blue-100' : 'text-gray-400'}`}>
                                Month: {token.fixedAllowanceMonth}
                              </span>
                            ) : null}
                          </div>
                          <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                            isSelected ? 'bg-white text-brand-blue border-white' : 'border-gray-300 dark:border-gray-600'
                          }`}>
                            {isSelected && <Check size={12} strokeWidth={3} />}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* 4. Date Pickers & Half-Day Row */}
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-[11px] font-bold text-secondary dark:text-gray-400 uppercase tracking-wider">
                    From Date
                  </label>
                  <input
                    type="date"
                    value={form.startDate}
                    onChange={(e) => actions.setStartDate(e.target.value)}
                    className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2 text-sm font-bold text-primary dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-blue/30"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[11px] font-bold text-secondary dark:text-gray-400 uppercase tracking-wider">
                    To Date
                  </label>
                  <input
                    type="date"
                    disabled={form.isHalfDay}
                    value={form.isHalfDay ? form.startDate : form.endDate}
                    onChange={(e) => actions.setEndDate(e.target.value)}
                    className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2 text-sm font-bold text-primary dark:text-white disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-brand-blue/30"
                  />
                </div>
              </div>

              {/* Duration Pill & Half Day Toggle */}
              <div className="flex items-center justify-between pt-1">
                <div className="px-3 py-1.5 bg-blue-50 dark:bg-blue-500/10 text-brand-blue dark:text-blue-400 border border-blue-100 dark:border-blue-500/20 rounded-xl text-xs font-bold flex items-center gap-1.5">
                  <Clock size={13} /> {form.totalDays} Day{form.totalDays !== 1 ? 's' : ''} Selected
                </div>

                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <span className="text-xs font-bold text-secondary dark:text-gray-400">Half Day</span>
                  <input
                    type="checkbox"
                    checked={form.isHalfDay}
                    onChange={(e) => actions.setIsHalfDay(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-brand-blue relative"></div>
                </label>
              </div>

              {/* Session Selector for Half-Day */}
              {form.isHalfDay && (
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => actions.setHalfDayPeriod('Morning')}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                      form.halfDayPeriod === 'Morning'
                        ? 'bg-brand-blue text-white border-brand-blue shadow-sm'
                        : 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-secondary dark:text-gray-400'
                    }`}
                  >
                    <Sun size={14} /> Morning Session
                  </button>
                  <button
                    type="button"
                    onClick={() => actions.setHalfDayPeriod('Afternoon')}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                      form.halfDayPeriod === 'Afternoon'
                        ? 'bg-brand-blue text-white border-brand-blue shadow-sm'
                        : 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-secondary dark:text-gray-400'
                    }`}
                  >
                    <Moon size={14} /> Afternoon Session
                  </button>
                </div>
              )}
            </div>

            {/* 5. Reason for Leave */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold text-secondary dark:text-gray-400 uppercase tracking-wider">
                Reason for Leave <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={3}
                value={form.reason}
                onChange={(e) => actions.setReason(e.target.value)}
                placeholder="Explain why you're taking time off..."
                className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl p-3 text-sm text-primary dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-blue/30 focus:border-brand-blue resize-none transition-all placeholder:text-gray-400 dark:placeholder:text-gray-600"
              />
            </div>

          </div>

          {/* Footer Actions */}
          <div className="p-5 sm:p-6 border-t border-gray-100 dark:border-gray-800 flex items-center gap-3 shrink-0 bg-gray-50 dark:bg-gray-900/50">
            <button
              onClick={onClose}
              disabled={status.submitting}
              className="flex-1 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-secondary dark:text-gray-300 rounded-xl text-sm font-bold hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={actions.handleSubmit}
              disabled={status.submitting}
              className="flex-1 py-3 bg-brand-blue hover:bg-blue-700 text-white rounded-xl text-sm font-bold shadow-md shadow-brand-blue/20 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {status.submitting ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
              Submit Leave Request
            </button>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
}