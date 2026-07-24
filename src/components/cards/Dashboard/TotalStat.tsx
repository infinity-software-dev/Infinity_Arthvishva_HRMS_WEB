"use client";

import { useState, useEffect } from "react";
import { BarChart3 } from "lucide-react";
import { useTotalStat } from "@/hooks/dashboard-hooks/useTotalStat";

export default function TotalStat() {
  const { chartData, loading, viewMode, setViewMode } = useTotalStat();
  const [activeLabel, setActiveLabel] = useState<string>("");

  useEffect(() => {
    if (chartData.length > 0) {
      // FIX 1: Find the last month that actually has data (isn't null)
      // We create a shallow copy so .reverse() doesn't mutate the original array
      const lastValidItem = [...chartData].reverse().find(item => item.value !== null);
      if (lastValidItem) {
        setActiveLabel(lastValidItem.label);
      } else {
        // Fallback if all are somehow null
        setActiveLabel(chartData[chartData.length - 1].label);
      }
    }
  }, [chartData]);

  return (
    <div className="w-full bg-white dark:bg-primary p-4 md:p-6 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col transition-colors duration-300 h-full">

      {/* Header & Controls */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-lg md:text-xl font-bold text-primary dark:text-white">
            Average Attendance
          </h3>
          <p className="text-xs text-secondary dark:text-gray-400 mt-1">
            {viewMode === "monthly"
              ? "Attendance Rate by Month"
              : "Attendance Rate by Year"}
          </p>
        </div>

        <div className="flex bg-gray-100 dark:bg-white/5 p-1 rounded-full text-xs font-medium shrink-0">
          <button
            onClick={() => setViewMode("monthly")}
            className={`px-3 py-1.5 rounded-full transition-all ${viewMode === "monthly"
              ? "bg-white dark:bg-primary text-primary dark:text-white shadow-sm"
              : "text-secondary dark:text-gray-400 hover:text-primary dark:hover:text-white"
              }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setViewMode("yearly")}
            className={`px-3 py-1.5 rounded-full transition-all ${viewMode === "yearly"
              ? "bg-white dark:bg-primary text-primary dark:text-white shadow-sm"
              : "text-secondary dark:text-gray-400 hover:text-primary dark:hover:text-white"
              }`}
          >
            Yearly
          </button>
        </div>
      </div>

      {/* Content Area */}
      {loading ? (
        <div className="w-full h-72 flex flex-col items-center justify-center gap-2 text-secondary dark:text-gray-500 animate-pulse">
          <div className="w-8 h-8 border-2 border-brand-green border-t-transparent rounded-full animate-spin"></div>
          <span className="text-xs">Loading stats...</span>
        </div>
      ) : chartData.length === 0 ? (
        <div className="w-full h-72 flex flex-col items-center justify-center text-center opacity-70">
          <div className="bg-brand-green/10 dark:bg-brand-green/20 p-4 rounded-full mb-3 text-brand-green">
            <BarChart3 className="w-6 h-6" />
          </div>
          <p className="text-sm font-semibold text-primary dark:text-white">
            No Attendance Data
          </p>
          <p className="text-xs text-secondary dark:text-gray-400 mt-1">
            Data for this period is currently unavailable.
          </p>
        </div>
      ) : (
        <div className="flex gap-2 md:gap-4 h-72 w-full">
          {/* Y-Axis Labels */}
          <div className="flex flex-col justify-between text-xs font-medium text-secondary dark:text-gray-500 py-6 pt-12 shrink-0">
            <span>100%</span>
            <span>75%</span>
            <span>50%</span>
            <span>25%</span>
            <span>0%</span>
          </div>

          {/* Chart Area */}
          <div className="flex-1 overflow-x-auto pb-2 pt-10 no-scrollbar">
            <div className="flex items-end justify-around gap-3 h-full min-w-max md:min-w-0 pl-2 pr-2">
              {chartData.map((item) => {
                // FIX 2: Identify if data exists for this month
                const hasData = item.value !== null;
                const isActive = hasData && activeLabel === item.label;
                const percentage = hasData ? Math.min(item.value as number, 100) : 0;

                return (
                  <div
                    key={item.label}
                    // FIX 3: Disable pointer events if there is no data
                    className={`flex flex-col items-center gap-1 w-full min-w-[2.5rem] group relative ${hasData ? 'cursor-pointer' : 'cursor-default'}`}
                    onMouseEnter={() => hasData && setActiveLabel(item.label)}
                    onClick={() => hasData && setActiveLabel(item.label)}
                  >
                    {/* Tooltip - Only render if data exists */}
                    {hasData && (
                      <div
                        className={`absolute -top-10 left-1/2 -translate-x-1/2 transition-all duration-300 z-20 ${isActive
                          ? "opacity-100 -translate-y-1 scale-100"
                          : "opacity-0 translate-y-2 scale-90 pointer-events-none"
                          }`}
                      >
                        <div className="bg-brand-green dark:bg-white text-white dark:text-brand-green text-[10px] font-bold py-1.5 px-3 rounded-full shadow-xl whitespace-nowrap relative">
                          {percentage}%
                          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-brand-green dark:bg-white rotate-45"></div>
                        </div>
                      </div>
                    )}

                    {/* Bar */}
                    <div className="relative w-full max-w-[2.5rem] h-48 flex items-end rounded-t-xl bg-transparent">
                      <div
                        className={`w-full rounded-t-md md:rounded-t-xl transition-all duration-300 ease-out ${isActive
                          ? "bg-gradient-to-t from-brand-green to-brand-blue shadow-lg shadow-brand-green/40 dark:shadow-brand-green/60 scale-[1.05]"
                          : hasData
                            ? "bg-brand-green/20 hover:bg-brand-green/30 dark:bg-white/5 dark:hover:bg-white/10"
                            : "bg-transparent" // Keep future months completely invisible
                          }`}
                        style={{ height: `${percentage}%` }}
                      ></div>
                    </div>

                    {/* X-Axis Label */}
                    <span
                      className={`text-[10px] md:text-xs font-medium text-center transition-colors whitespace-nowrap ${isActive
                        ? "text-primary dark:text-white font-bold"
                        : "text-secondary dark:text-gray-500"
                        }`}
                    >
                      {item.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}