"use client";

import { useRecentEmployees } from "@/hooks/dashboard-hooks/useRecentEmployees";
import Image from "next/image";

export default function RecentJoinedEmployees() {
  // 1. Consume business logic from the hook
  const { employees, loading } = useRecentEmployees();

  return (
    <div className="bg-white dark:bg-primary p-5 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col h-full transition-colors duration-300">
      <div className="flex justify-between items-center mb-4 shrink-0">
        <h3 className="text-lg font-bold text-primary dark:text-white">
          Recently Joined
        </h3>
        <span className="text-xs font-bold text-brand-blue px-2 py-1 rounded-md">
          New Hires
        </span>
      </div>

      <div className="flex flex-col gap-3 flex-1 pr-1">
        {loading ? (
          // --- LOADING SKELETON ---
          Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center justify-between p-2 animate-pulse"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700"></div>
                <div className="flex flex-col gap-1">
                  <div className="w-24 h-3 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  <div className="w-16 h-2 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </div>
              </div>
              <div className="w-16 h-3 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
          ))
        ) : employees.length === 0 ? (
          // --- NO DATA STATE ---
          <div className="flex flex-col items-center justify-center h-full py-8 text-center opacity-70">
            <div className="bg-gray-50 dark:bg-white/5 p-4 rounded-full mb-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-gray-400 dark:text-gray-500"
              >
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <line x1="19" y1="8" x2="19" y2="14" />
                <line x1="22" y1="11" x2="16" y2="11" />
              </svg>
            </div>
            <p className="text-sm font-semibold text-primary dark:text-white">
              No New Hires
            </p>
            <p className="text-xs text-secondary dark:text-gray-400 mt-1 max-w-[150px]">
              New employees will appear here once onboarded.
            </p>
          </div>
        ) : (
          // --- DATA LIST ---
          employees.map((employee) => (
            <div
              key={employee.id}
              className="flex items-center justify-between group cursor-pointer hover:bg-gray-50 dark:hover:bg-white/5 p-2 rounded-xl transition-colors gap-2"
            >
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <div className="relative w-10 h-10 rounded-full overflow-hidden border border-gray-100 dark:border-gray-700 shadow-sm bg-gray-100 shrink-0">
                  <Image
                    src={
                      employee.avatar ||
                      `https://ui-avatars.com/api/?name=${employee.name}&background=random`
                    }
                    alt={employee.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex flex-col min-w-0 flex-1">
                  <span className="text-sm font-bold text-primary dark:text-white group-hover:text-brand-blue transition-colors truncate">
                    {employee.name}
                  </span>

                  <span className="text-[10px] md:text-xs text-secondary dark:text-gray-400 font-medium truncate">
                    {employee.role}
                  </span>
                </div>
              </div>

              <div className="flex items-center shrink-0">
                <span className="text-xs font-bold text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-white/5 px-2 py-1 rounded-md whitespace-nowrap">
                  {employee.joinDate}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}