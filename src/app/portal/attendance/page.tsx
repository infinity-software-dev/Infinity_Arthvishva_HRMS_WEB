"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin, Shield, Fingerprint, Star, FileText, Loader2, CalendarDays, CheckCircle
} from 'lucide-react';

// Hooks & Components
import { useCheckIn } from '@/hooks/portal-hooks/attendance-hooks/useCheckIn';
import FaceVerification from '@/components/portal/attendance/FaceVerification';
import WorkModeSelector from '@/components/portal/attendance/WorkModeSelector';
import GeoLocationBadge from '@/components/portal/attendance/GeoLocationBadge';
import LiveTimer from '@/components/portal/attendance/LiveTimer';
import CheckOutReportModal from '@/components/portal/attendance/CheckOutReportModal';

export default function AttendancePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  // Modal States
  const [isFaceModalOpen, setIsFaceModalOpen] = useState(false);
  const [faceActionType, setFaceActionType] = useState<'checkin' | 'checkout'>('checkin');
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  // Initialize Check-In Hook
  const {
    workMode,
    setWorkMode,
    geoStatus,
    geoDistance,
    config,
    todayRecord,
    managers,
    canAct,
    actionLoading,
    loadingConfig,
    fetchGeo,
    submitCheckIn,
    submitCheckOut
  } = useCheckIn(() => {
    // Optionally redirect, or just let the local state update to show "Shift Complete"
    // router.push('/portal/attendance/logs'); 
  });

  // Load user data for Face Verification
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  // --- FLOW TRIGGERS ---

  // 1. User clicks "Secure Check In"
  const initCheckIn = () => {
    setFaceActionType('checkin');
    setIsFaceModalOpen(true);
  };

  // 2. User clicks "Check Out" from the LiveTimer
  const initCheckOut = () => {
    setFaceActionType('checkout');
    setIsFaceModalOpen(true);
  };

  // 3. Face Verification returns success
  const handleFaceSuccess = () => {
    setIsFaceModalOpen(false);
    if (faceActionType === 'checkin') {
      submitCheckIn(); // Directly submit check-in
    } else {
      setIsReportModalOpen(true); // Open the report modal for check-out
    }
  };

  // 4. User submits the End-of-Day Report
  const handleReportSubmit = (reportData: any) => {
    submitCheckOut(reportData);
    setIsReportModalOpen(false);
  };

  // --- HELPERS ---
  const todayDate = new Date().toLocaleDateString('en-GB', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
  }).toUpperCase();

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 pb-12">

      {/* 1. Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4">
        <div>
          <p className="text-[10px] font-bold text-secondary dark:text-gray-500 uppercase tracking-widest mb-1.5">
            {todayDate}
          </p>
          <h1 className="text-2xl md:text-[28px] font-bold text-primary dark:text-white tracking-tight leading-none">
            Attendance
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/portal/attendance/summary"
            className="h-10 px-4 rounded-xl bg-white dark:bg-primary border border-gray-200 dark:border-gray-800 flex items-center gap-2 text-sm font-bold text-secondary dark:text-gray-400 hover:text-brand-blue dark:hover:text-brand-blue shadow-sm transition-colors shrink-0"
          >
            <CalendarDays size={16} />
            <span className="hidden sm:inline">My Logs</span>
          </Link>

          <GeoLocationBadge status={geoStatus} distance={geoDistance} workMode={workMode} />

          <button
            onClick={fetchGeo}
            className="w-10 h-10 rounded-full bg-white dark:bg-primary border border-gray-200 dark:border-gray-800 flex items-center justify-center text-secondary dark:text-gray-400 hover:text-primary dark:hover:text-white shadow-sm transition-colors shrink-0"
            title="Refresh Location"
          >
            <MapPin size={16} />
          </button>
        </div>
      </div>

      {/* 2. Permission Banner */}
      <AnimatePresence>
        {geoStatus === 'permission_denied' && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-600 flex items-center justify-center shrink-0">
                <MapPin size={18} color="#fff" />
              </div>
              <div>
                <p className="text-sm font-bold text-red-900 dark:text-red-400">Location access required</p>
                <p className="text-xs font-medium text-red-700 dark:text-red-300 mt-0.5">
                  Click the 🔒 icon in your browser's address bar to allow location.
                </p>
              </div>
            </div>
            <button onClick={fetchGeo} className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-lg transition-colors whitespace-nowrap">
              Retry Location
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3. Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left: Hero Action Card */}
        <div className="lg:col-span-2 relative bg-gradient-to-br from-[#0F1E3C] via-[#183e7a] to-[#0D4A48] rounded-[2rem] p-8 md:p-12 text-white overflow-hidden shadow-2xl flex flex-col items-center justify-center min-h-[400px]">
          {/* Decorative Orbs */}
          <div className="absolute top-[-20%] right-[-10%] w-72 h-72 bg-brand-blue/30 rounded-full blur-[80px] pointer-events-none" />
          <div className="absolute bottom-[-20%] left-[-10%] w-60 h-60 bg-brand-green/20 rounded-full blur-[60px] pointer-events-none" />

          {loadingConfig ? (
            <div className="flex flex-col items-center z-10">
              <Loader2 size={36} className="animate-spin text-white/50 mb-4" />
              <p className="text-sm font-medium text-white/70">Initializing secure portal...</p>
            </div>
          ) : (
            <div className="z-10 w-full flex flex-col items-center">

              {/* STATE A: CHECKED IN (Show Timer) */}
              {todayRecord?.inTime && !todayRecord?.outTime && (
                <LiveTimer
                  inTime={todayRecord.inTime}
                  shiftHours={config?.shift_hours || 8.5}
                  canAct={canAct}
                  onCheckOut={initCheckOut}
                />
              )}

              {/* STATE B: ALREADY CHECKED OUT (Shift Complete) */}
              {todayRecord?.inTime && todayRecord?.outTime && (
                <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center">
                  <div className="w-20 h-20 bg-brand-green/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-brand-green/30">
                    <CheckCircle size={36} className="text-brand-green" />
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-2">Shift Complete 🎉</h2>
                  <p className="text-white/60 text-sm">You have successfully logged your attendance for today.</p>
                </motion.div>
              )}

              {/* STATE C: NOT CHECKED IN YET (Show Check In Button) */}
              {!todayRecord?.inTime && (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col items-center w-full"
                >
                  <div className="relative w-20 h-20 flex items-center justify-center mb-6">
                    <div className="absolute inset-0 rounded-full border-2 border-white/10 animate-[ping_2.5s_cubic-bezier(0,0,0.2,1)_infinite]" />
                    <div className="absolute inset-2 rounded-full border border-white/20 animate-[ping_2.5s_cubic-bezier(0,0,0.2,1)_infinite] animation-delay-500" />
                    <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 flex items-center justify-center">
                      <Fingerprint size={32} className="text-white" />
                    </div>
                  </div>

                  <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-3 text-center">Ready to Begin?</h2>
                  <p className="text-sm text-white/60 text-center max-w-sm mb-8 leading-relaxed">
                    {workMode === 'Office'
                      ? "Ensure you're within the office zone, then check in securely with face verification."
                      : `Check in securely from any location using ${workMode} mode.`}
                  </p>

                  <div className="flex flex-col items-center w-full max-w-xs gap-6">
                    <WorkModeSelector currentMode={workMode} onModeChange={setWorkMode} />

                    <button
                      onClick={initCheckIn}
                      disabled={!canAct || actionLoading}
                      className={`w-full py-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all duration-300 ${canAct
                          ? 'bg-white text-[#0F1E3C] shadow-[0_8px_30px_rgba(0,0,0,0.12)] hover:shadow-[0_8px_40px_rgba(0,0,0,0.2)] hover:-translate-y-0.5 active:scale-95'
                          : 'bg-white/10 text-white/40 cursor-not-allowed'
                        }`}
                    >
                      {actionLoading ? <Loader2 size={18} className="animate-spin" /> : <Shield size={18} />}
                      Secure Check In
                    </button>

                    {/* Sub-hint for disabled states */}
                    {!canAct && !actionLoading && (
                      <p className="text-xs text-white/50 text-center mt-[-10px]">
                        {geoStatus === 'checking' && '📡 Verifying your location...'}
                        {geoStatus === 'invalid' && workMode === 'Office' && `📍 You are ${geoDistance}m from office (out of range)`}
                        {geoStatus === 'error' && '⚠️ GPS unavailable — tap refresh above'}
                      </p>
                    )}
                  </div>
                </motion.div>
              )}

            </div>
          )}
        </div>

        {/* Right: Side Panel Info */}
        <div className="flex flex-col gap-5">

          {/* Office Zone Config Card */}
          {config && (
            <div className="bg-white dark:bg-primary border border-gray-100 dark:border-gray-800 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <MapPin size={14} className="text-secondary dark:text-gray-400" />
                <h3 className="text-xs font-bold text-secondary dark:text-gray-400 uppercase tracking-widest">Office Zone</h3>
              </div>
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${geoStatus === 'valid' ? 'bg-green-50 text-green-600 dark:bg-green-500/10 dark:text-green-400' : 'bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400'
                  }`}>
                  <MapPin size={20} />
                </div>
                <div>
                  <p className="font-bold text-primary dark:text-white text-sm">Radius: {config.radius_meters}m</p>
                  <p className="text-xs font-medium text-secondary dark:text-gray-500 mt-1">
                    {geoStatus === 'checking' ? 'Calculating distance...' : `You are ${geoDistance}m away`}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Quick Tips Card */}
          <div className="bg-white dark:bg-primary border border-gray-100 dark:border-gray-800 rounded-2xl p-6 shadow-sm flex-1">
            <div className="flex items-center gap-2 mb-5">
              <Star size={14} className="text-secondary dark:text-gray-400" />
              <h3 className="text-xs font-bold text-secondary dark:text-gray-400 uppercase tracking-widest">Quick Tips</h3>
            </div>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <Shield size={16} className="text-brand-blue shrink-0 mt-0.5" />
                <p className="text-xs font-medium text-secondary dark:text-gray-400 leading-relaxed">
                  Face ID auto-verifies when detected. Keep your face well-lit.
                </p>
              </li>
              <li className="flex items-start gap-3">
                <MapPin size={16} className="text-brand-green shrink-0 mt-0.5" />
                <p className="text-xs font-medium text-secondary dark:text-gray-400 leading-relaxed">
                  Stay within {config?.radius_meters || 50}m of the office coordinates for standard check-ins.
                </p>
              </li>
              <li className="flex items-start gap-3">
                <FileText size={16} className="text-amber-500 shrink-0 mt-0.5" />
                <p className="text-xs font-medium text-secondary dark:text-gray-400 leading-relaxed">
                  You will be prompted to submit a work summary when checking out later today.
                </p>
              </li>
            </ul>
          </div>

        </div>
      </div>

      {/* 4. Modals */}
      <FaceVerification
        isOpen={isFaceModalOpen}
        onClose={() => setIsFaceModalOpen(false)}
        onSuccess={handleFaceSuccess}
        userDescriptor={user?.faceDescriptors}
        actionType={faceActionType}
      />

      <CheckOutReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        onSubmit={handleReportSubmit}
        managers={managers}
        isLoading={actionLoading}
      />

    </div>
  );
}