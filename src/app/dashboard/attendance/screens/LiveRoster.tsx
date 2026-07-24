"use client";

import { useLiveRoster } from "@/hooks/attendance-hooks/useLiveRoster";


export default function LiveRoster() {
  const { roster, loading, filters } = useLiveRoster();

  const getStatusClasses = (status: string) => {
    switch (status) {
      case 'P':
        return 'bg-green-100 text-green-700';
      case 'L':
        return 'bg-yellow-100 text-yellow-700';
      case 'Half':
        return 'bg-blue-100 text-blue-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };



  return (
    <div className="flex flex-col h-full w-full">
      {/* 1. Action Bar (Filters & Search) */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <input
          type="text"
          placeholder="Search employee..."
          value={filters.searchQuery}
          onChange={(e) => filters.setSearchQuery(e.target.value)}
          className="w-full sm:w-72 px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green"
        />

        <div className="flex gap-3 w-full sm:w-auto">
          <select
            value={filters.selectedWorkMode}
            onChange={(e) => filters.setSelectedWorkMode(e.target.value)}
            className="px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green"
          >
            <option value="">All Modes</option>
            <option value="Office">Office</option>
            <option value="WFH">WFH</option>
            <option value="Field">Field</option>
          </select>
          {/* Add Department Dropdown here similarly */}
        </div>
      </div>

      {/* 2. Data Table */}
      <div className="overflow-x-auto rounded-xl border border-gray-100 dark:border-gray-700">
        <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400">
          <thead className="bg-gray-50/50 dark:bg-gray-800/50 text-gray-700 dark:text-gray-300">
            <tr>
              <th className="px-6 py-4 font-medium">Employee</th>
              <th className="px-6 py-4 font-medium">In Time</th>
              <th className="px-6 py-4 font-medium">Out Time</th>
              <th className="px-6 py-4 font-medium">Mode</th>
              <th className="px-6 py-4 font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700 bg-white dark:bg-gray-900">
            {loading ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-gray-400">Loading roster...</td>
              </tr>
            ) : roster.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-gray-400">No active punches found for these filters.</td>
              </tr>
            ) : (
              roster.map((row) => (
                <tr key={row.attendanceId} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/20 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="font-medium text-gray-900 dark:text-white">{row.employeeName}</div>
                      <div className="text-xs text-gray-400">{row.employeeCode}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={row.isLate ? "text-red-500 font-medium" : "text-gray-600 dark:text-gray-300"}>
                      {row.inTime ? new Date(row.inTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--:--'}
                    </span>
                    {row.isLate && <span className="ml-2 text-xs bg-red-100 text-red-600 px-1.5 py-0.5 rounded-md">Late {row.lateMinutes}m</span>}
                  </td>
                  <td className="px-6 py-4">
                    {row.outTime ? new Date(row.outTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Working...'}
                  </td>
                  <td className="px-6 py-4">{row.workMode}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${getStatusClasses(row.status)}`}>
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}