"use client";

import { usePortalOverview } from "@/hooks/portal-hooks/overview-hooks/usePortalOverview";
import Link from "next/link";
import QuickActionCard from "@/components/portal/overview/QuickActionCard";
import PerformanceCard from "@/components/portal/overview/PerformanceCard";
import {
  Sun, Clock, ClipboardList, Calendar, FileText,
  Activity, CalendarDays, Zap, CheckCircle2, XCircle, Timer, TrendingUp, ArrowRight, MapPin
} from "lucide-react";

export default function PortalOverviewPage() {
  const { loading, data, error, profileData } = usePortalOverview();

  const today = new Date();
  const dateOptions: Intl.DateTimeFormatOptions = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
  const formattedDate = today.toLocaleDateString('en-US', dateOptions);

  const currentHour = today.getHours();
  let greeting = "Good Morning";
  if (currentHour >= 12 && currentHour < 17) {
    greeting = "Good Afternoon";
  } else if (currentHour >= 17) {
    greeting = "Good Evening";
  }

  if (loading && !data) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-white dark:bg-primary rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm transition-colors">
        <div className="w-8 h-8 border-4 border-brand-green border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-sm font-semibold text-secondary dark:text-gray-400">Loading your portal...</p>
      </div>
    );
  }

  if (error && !data) {
    return (
      <div className="w-full h-64 flex flex-col items-center justify-center bg-red-50 dark:bg-red-500/10 rounded-xl border border-red-200 dark:border-red-500/20 transition-colors">
        <span className="text-4xl mb-3">⚠️</span>
        <p className="font-bold text-lg text-red-600 dark:text-red-400">Failed to Load Dashboard</p>
        <p className="text-sm font-medium text-red-500/80 dark:text-red-400/80 mt-1">{error}</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col space-y-8">

      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="w-14 h-14 bg-white dark:bg-primary rounded-xl flex items-center justify-center border border-gray-100 dark:border-gray-800 shadow-sm transition-colors shrink-0">
          <Sun className="w-7 h-7 text-brand-green" />
        </div>
        <div>
          <h1 className="text-2xl md:text-[28px] font-bold text-primary dark:text-white tracking-tight">
            {greeting}, <span className="text-brand-blue">
              {profileData?.name
                ? profileData.name.split(' ')[0].charAt(0).toUpperCase() + profileData.name.split(' ')[0].slice(1).toLowerCase()
                : "Employee"
              }
            </span> 👋
          </h1>
          <p className="text-sm font-medium text-secondary dark:text-gray-400 mt-1">
            {formattedDate} <span className="mx-2 text-gray-300 dark:text-gray-700">|</span> Employee ID: {profileData?.employeeCode || "N/A"}
          </p>
        </div>
      </div>

      {/* 2. Quick Actions */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <Zap className="w-4 h-4 text-secondary dark:text-gray-400" />
          <h2 className="text-xs font-bold text-secondary dark:text-gray-400 uppercase tracking-widest">Quick Actions</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <QuickActionCard
            icon={<Clock className="w-5 h-5" />}
            title="Mark Attendance"
            desc="Check in or check out"
            href="/portal/attendance"
          />
          <QuickActionCard
            icon={<ClipboardList className="w-5 h-5" />}
            title="Attendance Summary"
            desc="View your monthly logs"
            href="/portal/attendance/summary"
          />
          <QuickActionCard
            icon={<Calendar className="w-5 h-5" />}
            title="Apply Leave"
            desc="Request time off"
            href="/portal/leaves"
          />
          <QuickActionCard
            icon={<FileText className="w-5 h-5" />}
            title="View Salary Slip"
            desc="Download payslip"
            href="/portal/payroll"
          />
        </div>
      </section>

      {/* 3. Today's Attendance */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <Activity className="w-4 h-4 text-secondary dark:text-gray-400" />
          <h2 className="text-xs font-bold text-secondary dark:text-gray-400 uppercase tracking-widest">Today's Attendance</h2>
        </div>

        <div className="bg-white dark:bg-primary rounded-xl p-6 md:p-8 border border-gray-100 dark:border-gray-800 shadow-sm transition-colors duration-300">
          <div className="flex flex-col xl:flex-row justify-between gap-8">

            {/* Left Side: Time or Call to Action */}
            <div className="flex-1 flex flex-col justify-center">
              {data?.punchStatus?.inTime ? (
                <div className="flex items-center gap-16 md:gap-32">

                  {/* CHECK IN BLOCK */}
                  <div>
                    <p className="text-[10px] font-bold text-secondary dark:text-gray-500 uppercase tracking-widest mb-2.5">Check In</p>

                    {/* Fixed CSS Mismatch: Using items-baseline for perfect AM/PM alignment */}
                    <div className="flex items-baseline gap-1.5 mb-4">
                      <span className="text-[44px] font-extrabold text-primary dark:text-white leading-none tabular-nums tracking-tight">
                        {data.punchStatus.inTime.split(" ")[0]}
                      </span>
                      <span className="text-lg font-bold text-secondary dark:text-gray-400 uppercase">
                        {data.punchStatus.inTime.split(" ")[1]}
                      </span>
                    </div>

                    {/* Status Badges */}
                    <div className="flex flex-wrap items-center gap-2">
                      <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border shadow-sm ${data.punchStatus.isPunchedIn
                          ? "bg-brand-green/10 text-brand-green border-brand-green/20"
                          : "bg-gray-50 text-secondary dark:bg-white/5 dark:text-gray-400 border-gray-200 dark:border-gray-700"
                        }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${data.punchStatus.isPunchedIn ? "bg-brand-green animate-pulse" : "bg-gray-400"}`}></span>
                        {data.punchStatus.isPunchedIn ? "ON DUTY" : "OFF DUTY"}
                      </div>

                      {/* Dynamic Extra Fields */}
                      <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-gray-50 text-secondary dark:bg-white/5 dark:text-gray-400 border border-gray-200 dark:border-gray-700">
                        <MapPin className="w-3 h-3" />
                        {data.punchStatus.workMode}
                      </div>

                      {data.punchStatus.isLate && (
                        <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400 border border-red-200 dark:border-red-900/30">
                          <Timer className="w-3 h-3" />
                          LATE
                        </div>
                      )}
                    </div>
                  </div>

                  {/* CHECK OUT BLOCK */}
                  <div>
                    <p className="text-[10px] font-bold text-secondary dark:text-gray-500 uppercase tracking-widest mb-2.5">Check Out</p>

                    {/* Fixed CSS Mismatch */}
                    <div className={`flex items-baseline gap-1.5 mb-4 ${data.punchStatus.outTime ? "text-primary dark:text-white" : "text-gray-300 dark:text-gray-700"}`}>
                      <span className="text-[44px] font-extrabold leading-none tabular-nums tracking-tight">
                        {data.punchStatus.outTime ? data.punchStatus.outTime.split(" ")[0] : "-- : --"}
                      </span>
                      <span className="text-lg font-bold uppercase text-secondary dark:text-gray-500">
                        {data.punchStatus.outTime ? data.punchStatus.outTime.split(" ")[1] : ""}
                      </span>
                    </div>

                    {/* Total Logged Info */}
                    {data.punchStatus.outTime && (
                      <p className="text-xs font-semibold text-secondary dark:text-gray-400">
                        Logged: <span className="text-brand-blue">{data.punchStatus.loggedHours}</span>
                      </p>
                    )}
                  </div>

                </div>
              ) : (
                <div>
                  <p className="text-[10px] font-bold text-secondary dark:text-gray-500 uppercase tracking-widest mb-3">Status</p>
                  <h3 className="text-2xl font-bold text-primary dark:text-white mb-2">Not Checked In</h3>
                  <p className="text-sm font-medium text-secondary dark:text-gray-400 mb-6">
                    You haven't marked your attendance for today.
                  </p>
                  <Link href="/portal/attendance" className="inline-flex items-center gap-2 px-6 py-3 bg-brand-blue text-white rounded-xl text-sm font-bold shadow-md shadow-brand-blue/20 hover:bg-opacity-90 transition-all active:scale-95">
                    <Clock className="w-4 h-4" />
                    Go to Attendance
                  </Link>
                </div>
              )}
            </div>

            {/* Right Side: Links */}
            <div className="flex flex-col justify-center gap-3 xl:w-[320px]">
              <Link href="/portal/attendance/summary" className="flex items-center justify-between p-4 bg-gray-50 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 rounded-xl border border-gray-100 dark:border-gray-800 transition-colors group">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-brand-blue/10 flex items-center justify-center">
                    <CalendarDays className="w-5 h-5 text-brand-blue" />
                  </div>
                  <div>
                    <h3 className="font-bold text-primary dark:text-white text-sm">My Logs</h3>
                    <p className="text-xs font-medium text-secondary dark:text-gray-400 mt-0.5">Attendance history</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-secondary dark:text-gray-400 group-hover:text-brand-blue transition-colors" />
              </Link>

              {/* <Link href="/portal/reports" className="flex items-center justify-between p-4 bg-gray-50 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 rounded-xl border border-gray-100 dark:border-gray-800 transition-colors group">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-brand-green/10 flex items-center justify-center">
                    <Zap className="w-5 h-5 text-brand-green" />
                  </div>
                  <div>
                    <h3 className="font-bold text-primary dark:text-white text-sm">Work Portal</h3>
                    <p className="text-xs font-medium text-secondary dark:text-gray-400 mt-0.5">Daily reports</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-secondary dark:text-gray-400 group-hover:text-brand-green transition-colors" />
              </Link> */}
            </div>

          </div>
        </div>
      </section>

      {/* 4. Monthly Performance */}
      <section className="pb-6">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-4 h-4 text-secondary dark:text-gray-400" />
          <h2 className="text-xs font-bold text-secondary dark:text-gray-400 uppercase tracking-widest">
            Monthly Performance
            <span className="text-[9px] font-bold bg-gray-100 dark:bg-white/10 px-2 py-0.5 rounded-full normal-case tracking-normal border border-gray-200 dark:border-gray-700">1-30/31</span>
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <PerformanceCard
            title="Present"
            value={data?.stats?.presentDays?.toString() || "0"}
            subtitle="Working days"
            icon={<CheckCircle2 className="w-5 h-5" />}
          />
          <PerformanceCard
            title="Absent"
            value={data?.stats?.workingDays ? (data.stats.workingDays - data.stats.presentDays).toString() : "0"}
            subtitle="Missed days"
            icon={<XCircle className="w-5 h-5 text-red-500" />}
          />
          <PerformanceCard
            title="Late Arrivals"
            value={data?.stats?.lateArrivals?.toString() || "0"}
            subtitle="Late logins"
            icon={<Timer className="w-5 h-5 text-orange-500" />}
          />
          <PerformanceCard
            title="Avg Hours"
            value={data?.stats?.avgHours || "0h"}
            subtitle="Per working day"
            icon={<TrendingUp className="w-5 h-5 text-brand-blue" />}
          />
        </div>
      </section>

    </div>
  );
}