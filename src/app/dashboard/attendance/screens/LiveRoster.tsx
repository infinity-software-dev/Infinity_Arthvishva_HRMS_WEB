"use client";

import { useState } from "react";
import { useLiveRoster } from "@/hooks/attendance-hooks/useLiveRoster";
import { MapPin } from "lucide-react";
import MapModal from "@/components/modals/MapModal";

export default function LiveRoster() {
  const { roster, loading, filters } = useLiveRoster();

  // Modal State
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [selectedMapData, setSelectedMapData] = useState<any>(null);

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

  const handleOpenMap = (row: any) => {
    setSelectedMapData(row);
    setIsMapOpen(true);
  };

  return (
    <div className="flex flex-col h-full w-full relative">
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
      <div className="overflow-x-auto rounded-xl border border-gray-300 dark:border-gray-700 shadow-sm">
        <table className="w-full text-left text-sm text-gray-800 dark:text-gray-200">
          <thead className="bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-b border-gray-300 dark:border-gray-700">
            <tr>
              <th className="px-6 py-3.5 font-bold whitespace-nowrap border-r border-gray-200 dark:border-gray-700/60">Emp ID</th>
              <th className="px-6 py-3.5 font-bold whitespace-nowrap border-r border-gray-200 dark:border-gray-700/60">Employee</th>
              <th className="px-6 py-3.5 text-center font-bold whitespace-nowrap border-r border-gray-200 dark:border-gray-700/60">In Time</th>
              <th className="px-6 py-3.5 text-center font-bold whitespace-nowrap border-r border-gray-200 dark:border-gray-700/60">Out Time</th>
              <th className="px-6 py-3.5 text-center font-bold whitespace-nowrap border-r border-gray-200 dark:border-gray-700/60">Mode</th>
              <th className="px-6 py-3.5 text-center font-bold whitespace-nowrap border-r border-gray-200 dark:border-gray-700/60">Status</th>
              <th className="px-6 py-3.5 font-bold whitespace-nowrap text-center">Location</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-900">
            {loading ? (
              <tr>
                <td colSpan={7} className="px-6 py-8 text-center text-gray-600 dark:text-gray-400 font-medium">
                  Loading roster...
                </td>
              </tr>
            ) : roster.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-8 text-center text-gray-600 dark:text-gray-400 font-medium">
                  No active punches found for these filters.
                </td>
              </tr>
            ) : (
              roster.map((row) => (
                <tr key={row.attendanceId} className="hover:bg-gray-100/70 dark:hover:bg-gray-800/50 transition-colors">
                  {/* Employee ID Column */}
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-800 dark:text-gray-200 border-r border-gray-200/60 dark:border-gray-800">
                    {row.employeeCode}
                  </td>

                  {/* Employee Name Column */}
                  <td className="px-6 py-4 whitespace-nowrap border-r border-gray-200/60 dark:border-gray-800 uppercase">
                    <div className="font-semibold text-gray-900 dark:text-white">{row.employeeName}</div>
                  </td>

                  {/* In Time */}
                  <td className="px-6 py-4 text-center whitespace-nowrap font-medium text-gray-800 dark:text-gray-200 border-r border-gray-200/60 dark:border-gray-800">
                    {row.inTime ? new Date(row.inTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--:--'}
                  </td>

                  {/* Out Time */}
                  <td className="px-6 py-4 text-center whitespace-nowrap font-medium text-gray-800 dark:text-gray-200 border-r border-gray-200/60 dark:border-gray-800">
                    {row.outTime ? new Date(row.outTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Working...'}
                  </td>

                  {/* Mode */}
                  <td className="px-6 py-4 text-center whitespace-nowrap font-medium text-gray-800 text-center dark:text-gray-200 border-r border-gray-200/60 dark:border-gray-800">
                    {row.workMode}
                  </td>

                  {/* Status */}
                  <td className="px-6 py-4 whitespace-nowrap border-r border-gray-200/60 text-center dark:border-gray-800">
                    <span className={`px-2.5 py-1 rounded-full  text-xs font-bold border border-green-300 ${getStatusClasses(row.status)}`}>
                      {row.status}
                    </span>
                  </td>

                  {/* Location */}
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    {row.latitude && row.longitude ? (
                      <button
                        onClick={() => handleOpenMap(row)}
                        className="inline-flex cursor-pointer items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-green-800 bg-green-50 border border-green-300 hover:bg-green-100 dark:text-green-300 dark:bg-green-950/50 dark:border-green-800 dark:hover:bg-green-900/60 rounded-lg transition-colors shadow-sm"
                      >
                        <MapPin size={14} />
                        View Map
                      </button>
                    ) : (
                      <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">N/A</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* 3. Render Map Modal */}
      <MapModal
        isOpen={isMapOpen}
        onClose={() => {
          setIsMapOpen(false);
          setSelectedMapData(null);
        }}
        latitude={selectedMapData?.latitude}
        longitude={selectedMapData?.longitude}
        checkOutLatitude={selectedMapData?.checkOutLatitude}
        checkOutLongitude={selectedMapData?.checkOutLongitude}
        locationHistory={selectedMapData?.locationHistory || []}
        workMode={selectedMapData?.workMode}
        employeeName={selectedMapData?.employeeName}
      />
    </div>
  );
}