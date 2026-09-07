"use client";

import { Download, Grid, List, Loader2, Search } from 'lucide-react';
import EmployeeCard from '@/components/cards/Employee/EmployeeCard';
import EmployeeTable from '@/components/cards/Employee/EmployeeTable';
import GradientButton from '@/components/buttons/GradientButton';
import { useEmployeeDirectory } from '@/hooks/employee-hooks/useEmployeeDirectory';
import PageTitleHeader from '@/components/elements/PageTitleHeader';
import { useRouter } from 'next/navigation';
import { DEPARTMENTS } from '@/hooks/employee-hooks/useAddEmployee';
import { useEffect, useState } from 'react';


export default function EmployeePage() {
  const router = useRouter();
  const { data, isLoading, viewMode, setViewMode, handleExportToExcel, filters, pagination } = useEmployeeDirectory();
  const [isHr, setIsHr] = useState<boolean>(false);

  // Safely read role on client mount and store as boolean
  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    setIsHr(storedRole === "HR");
  }, []);

  const handleNewEmployee = () => {
    router.push('/dashboard/employees/new');
  }

  return (
    <div className="w-full mx-auto p-6 md:p-8 space-y-8 font-sans">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <PageTitleHeader
          title=" Employee Directory"
          description="Manage team members, roles, and view detailed profiles."
        />
        {isHr &&
          <GradientButton onClick={handleNewEmployee} >
            + Add Employee
          </GradientButton>

        }
      </div>

      {/*MAIN DATA VIEW */}
      <div className="flex-1 w-full bg-white dark:bg-primary rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-gray-100 dark:border-gray-800 p-6 transition-colors duration-300 ">
        <div className="sticky top-0 z-20 flex flex-col xl:flex-row items-center justify-between mb-4 gap-4 bg-white dark:bg-gray-900 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">

          {/* Global Search */}
          <div className="relative w-full xl:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by name, code (IA12345)"
              value={filters.searchQuery}
              onChange={(e) => filters.setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-green dark:text-white transition-all placeholder:text-gray-400"
            />
          </div>

          {/* Filters & View Toggles */}
          <div className="flex items-center gap-3 w-full xl:w-auto overflow-x-auto pb-2 xl:pb-0 hide-scrollbar">

            {/* Department Dropdown */}
            <select className="px-4 mx-1 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green min-w-[140px] cursor-pointer" onChange={(e) => filters.setDepartment(e.target.value)}>
              <option value="">All Departments</option>
              {DEPARTMENTS.map((dept) => {
                const upperDept = dept.toUpperCase();
                return (
                  <option key={dept} value={upperDept}>
                    {upperDept}
                  </option>
                );
              })}
            </select>

            {/* Status Dropdown */}
            <select className="px-4 mx-1 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green min-w-[140px] cursor-pointer" onChange={(e) => filters.setStatus(e.target.value)}>
              <option value="">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>

            {/* Export Button */}
            <button
              onClick={handleExportToExcel}
              className="flex items-center gap-2 px-4 mx-1 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-brand-green transition-colors shadow-sm cursor-pointer"
            >
              <Download className="w-4 h-4" />
              Export Excel
            </button>

            {/* Visual Divider */}
            <div className="w-px h-8 bg-gray-200 dark:bg-gray-700 mx-2 hidden sm:block"></div>

            {/* Grid / List View Toggles */}
            <div className="flex items-center bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-1 flex-shrink-0">
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-all duration-200 ${viewMode === 'list'
                  ? 'bg-white dark:bg-gray-800 shadow-sm text-brand-green'
                  : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-800'
                  }`}
              >
                <List className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-all duration-200 ${viewMode === 'grid'
                  ? 'bg-white dark:bg-gray-800 shadow-sm text-brand-blue'
                  : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-800'
                  }`}
              >
                <Grid className="w-4 h-4" />
              </button>

            </div>
          </div>
        </div>
        {isLoading ? (
          <Loader2 className="animate-spin mx-auto" />
        ) : (
          viewMode === 'grid'
            ? <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {data.map(emp => <EmployeeCard key={emp._id} employee={emp} onClick={() => { }} />)}
            </div>
            : <EmployeeTable employees={data} />
        )}

        <div className="flex flex-col sm:flex-row items-center justify-between text-sm text-secondary dark:text-gray-400 gap-4 mt-6">
          <div>Showing {data.length} of {pagination.totalRecords} records</div>
          <div className="flex items-center gap-4">
            <select value={pagination.limit} onChange={(e) => pagination.setLimit(Number(e.target.value))} className="px-2 py-1 border border-gray-200 dark:border-gray-800 rounded-md bg-white dark:bg-primary text-primary dark:text-white focus:outline-none transition-colors">
              <option value={10}>10 per page</option>
              <option value={20}>20 per page</option>
              <option value={50}>50 per page</option>
            </select>

            <div className="flex gap-2">
              <button disabled={pagination.page === 1} onClick={() => pagination.setPage(p => p - 1)} className="px-3 py-1 border border-gray-200 dark:border-gray-800 rounded-md disabled:opacity-50 text-primary dark:text-white hover:bg-gray-50 dark:hover:bg-white/5 transition-colors disabled:hover:bg-transparent dark:disabled:hover:bg-transparent">Prev</button>
              <span className="px-3 py-1 font-medium text-primary dark:text-white">{pagination.page} / {pagination.totalPages || 1}</span>
              <button disabled={pagination.page === pagination.totalPages || pagination.totalPages === 0} onClick={() => pagination.setPage(p => p + 1)} className="px-3 py-1 border border-gray-200 dark:border-gray-800 rounded-md disabled:opacity-50 text-primary dark:text-white hover:bg-gray-50 dark:hover:bg-white/5 transition-colors disabled:hover:bg-transparent dark:disabled:hover:bg-transparent">Next</button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}