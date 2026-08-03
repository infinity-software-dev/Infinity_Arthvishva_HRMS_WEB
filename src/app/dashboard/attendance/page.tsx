"use client";

import { useState } from "react";
import LiveRoster from "./screens/LiveRoster";
import CorrectionInbox from "./screens/CorrectionInbox";
import HistoricalLedger from "./screens/HistoricalLedger";
import { usePendingCorrectionsCount } from "@/hooks/attendance-hooks/usePendingCorrectionsCount";
import PageTitleHeader from "@/components/elements/PageTitleHeader";

type TabID = "roster" | "corrections" | "historical";

interface Tab {
  id: TabID;
  label: string;
  badge?: number;
}

export default function AttendancePage() {
  const [activeTab, setActiveTab] = useState<TabID>("roster");

  // 1. Consume the hook
  const { pendingCount } = usePendingCorrectionsCount();

  // 2. Define TABS inside the component so it reacts to state changes
  const TABS: Tab[] = [
    { id: "roster", label: "Live Roster (Today)" },
    {
      id: "corrections",
      label: "Correction Inbox",
      badge: pendingCount > 0 ? pendingCount : undefined
    },
    { id: "historical", label: "Historical Ledger" },
  ];

  return (
    <div className="flex flex-col w-full h-full p-6 md:p-8">
      {/* 1. Page Header */}
      <PageTitleHeader
        title="Attendance Management"
        description="Monitor daily punches, handle regularizations, and view past records."
      />

      {/* 2. Premium Tab Navigation */}
      <div className="mb-6 w-full overflow-x-auto hide-scrollbar">
  <div className="inline-flex w-max items-center p-1.5 bg-gray-100/80 dark:bg-gray-800/50 rounded-xl gap-1">
    {TABS.map((tab) => {
      const isActive = activeTab === tab.id;
      return (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`
            relative flex items-center justify-center gap-2 px-6 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ease-in-out whitespace-nowrap
            ${isActive
              ? "bg-white dark:bg-gray-700 text-brand-blue dark:text-white shadow-sm"
              : "text-gray-500 hover:text-gray-700 hover:bg-gray-200/50 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-700/50"
            }
          `}
        >
          {tab.label}

          {/* Dynamic Notification Badge */}
          {tab.badge ? (
            <span
              className={`inline-flex items-center justify-center px-2 py-0.5 rounded-full text-xs font-semibold transition-colors duration-200
              ${isActive
                  ? "bg-[#FF0069]/10 text-[#FF0069]"
                  : "bg-gray-200 text-gray-500 dark:bg-gray-600 dark:text-gray-300"
                }`}
            >
              {tab.badge}
            </span>
          ) : null}
        </button>
      );
    })}
  </div>
</div>

      {/* 3. Conditional Rendering */}
      <div className="flex-1 w-full bg-whitedark:bg-primary rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-gray-100 dark:border-gray-700 p-6">
        {activeTab === "roster" && <LiveRoster />}
        {activeTab === "corrections" && <CorrectionInbox />}
        {activeTab === "historical" && <HistoricalLedger />}
      </div>
    </div>
  );
}