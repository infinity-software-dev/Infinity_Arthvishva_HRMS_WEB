"use client";

import React from "react";
import { Edit2, Trash2, Plus, Loader2, Undo2 } from "lucide-react";
import { DepartmentModal } from "@/components/modals/DepartmentModal";
import { PositionModal } from "@/components/modals/PositionModal";
import { useDepartments } from "@/hooks/department-hooks/useDepartments";
import { usePositions } from "@/hooks/department-hooks/usePositions";

export default function DepartmentsAndPositionsPage() {
  const {
    role: deptRole,
    departments,
    isLoading: isDeptLoading,
    error: deptError,
    handleAddClick: handleDeptAddClick,
    handleEditClick: handleDeptEditClick,
    handleDelete: handleDeptDelete,
    isModalOpen: isDeptModalOpen,
    setIsModalOpen: setIsDeptModalOpen,
    selectedDepartment,
    handleModalSubmit: handleDeptModalSubmit,
    handleRestore: handleDeptRestore,
  } = useDepartments();

  const {
    positions,
    isLoading: isPosLoading,
    error: posError,
    handleAddClick: handlePosAddClick,
    handleEditClick: handlePosEditClick,
    handleDelete: handlePosDelete,
    isModalOpen: isPosModalOpen,
    setIsModalOpen: setIsPosModalOpen,
    selectedPosition,
    handleModalSubmit: handlePosModalSubmit,
    handleRestore: handlePosRestore,
  } = usePositions();

  return (
    <div className="p-4 sm:p-6 md:p-8 w-full max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* DEPARTMENTS SECTION */}
        <div>
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Departments
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Manage company departments.
              </p>
            </div>
            {deptRole === "HR" && (
              <div className="flex items-center gap-4">
                <button
                  onClick={handleDeptAddClick}
                  className="flex items-center gap-2 bg-gradient-to-r from-brand-blue to-brand-green text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:shadow-lg transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  Add
                </button>
              </div>
            )}
          </div>

          {deptError && (
            <div className="mb-4 p-4 text-sm text-red-600 bg-red-50 dark:bg-red-900/30 rounded-xl">
              {deptError}
            </div>
          )}

          <div className="bg-white dark:bg-[#111] rounded-2xl border border-gray-100 dark:border-white/10 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50/80 dark:bg-white/5 border-b border-gray-100 dark:border-white/10">
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                      Department Name
                    </th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right w-32">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                  {isDeptLoading ? (
                    <tr>
                      <td
                        colSpan={2}
                        className="px-6 py-12 text-center text-sm text-gray-500"
                      >
                        <Loader2 className="w-6 h-6 animate-spin mx-auto text-brand-blue" />
                      </td>
                    </tr>
                  ) : (
                    departments.map((dept) => (
                      <tr
                        key={dept._id}
                        className={`transition-colors group ${dept.isActive === false ? 'bg-red-50/60 dark:bg-red-950/20 hover:bg-red-100/60 dark:hover:bg-red-950/30' : 'hover:bg-gray-50/50 dark:hover:bg-white/5'}`}
                      >
                        <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                          <span className={dept.isActive === false ? 'text-gray-400 line-through' : ''}>
                            {dept.name}
                          </span>
                          {dept.isActive === false && (
                            <span className="ml-2 text-[10px] bg-red-100 text-red-600 px-2 py-0.5 rounded-full">Deleted</span>
                          )}
                        </td>
                        {deptRole === "HR" && (
                        <td className="px-6 py-4 text-sm text-right">
                          <div className="flex items-center justify-end gap-2">
                            {dept.isActive === false ? (
                              <button
                                onClick={() => handleDeptRestore(dept._id)}
                                className="p-2 text-gray-400 hover:text-green-500 hover:bg-green-50 dark:hover:bg-green-500/10 rounded-lg transition-colors cursor-pointer"
                                title="Restore"
                              >
                                <Undo2 className="w-4 h-4" />
                              </button>
                            ) : (
                              <>
                                <button
                                  onClick={() => handleDeptEditClick(dept)}
                                  className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-lg transition-colors cursor-pointer"
                                  title="Edit"
                                >
                                  <Edit2 className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleDeptDelete(dept._id)}
                                  className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer"
                                  title="Delete"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                        )}
                      </tr>
                    ))
                  )}
                  {!isDeptLoading && departments.length === 0 && (
                    <tr>
                      <td
                        colSpan={2}
                        className="px-6 py-12 text-center text-sm text-gray-500"
                      >
                        No departments found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* POSITIONS SECTION */}
        <div>
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Positions
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Manage company positions.
              </p>
            </div>
            {deptRole === "HR" && (
              <div className="flex items-center gap-4">
                <button
                  onClick={handlePosAddClick}
                  className="flex items-center gap-2 bg-gradient-to-r from-brand-blue to-brand-green text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:shadow-lg transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  Add
                </button>
              </div>
            )}
          </div>

          {posError && (
            <div className="mb-4 p-4 text-sm text-red-600 bg-red-50 dark:bg-red-900/30 rounded-xl">
              {posError}
            </div>
          )}

          <div className="bg-white dark:bg-[#111] rounded-2xl border border-gray-100 dark:border-white/10 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50/80 dark:bg-white/5 border-b border-gray-100 dark:border-white/10">
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                      Position Name
                    </th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right w-32">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                  {isPosLoading ? (
                    <tr>
                      <td
                        colSpan={2}
                        className="px-6 py-12 text-center text-sm text-gray-500"
                      >
                        <Loader2 className="w-6 h-6 animate-spin mx-auto text-brand-blue" />
                      </td>
                    </tr>
                  ) : (
                    positions.map((pos) => (
                      <tr
                        key={pos._id}
                        className={`transition-colors group ${pos.isActive === false ? 'bg-red-50/60 dark:bg-red-950/20 hover:bg-red-100/60 dark:hover:bg-red-950/30' : 'hover:bg-gray-50/50 dark:hover:bg-white/5'}`}
                      >
                        <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                          <span className={pos.isActive === false ? 'text-gray-400 line-through' : ''}>
                            {pos.name}
                          </span>
                          {pos.isActive === false && (
                            <span className="ml-2 text-[10px] bg-red-100 text-red-600 px-2 py-0.5 rounded-full">Deleted</span>
                          )}
                        </td>
                        {deptRole === "HR" && (
                        <td className="px-6 py-4 text-sm text-right">
                          <div className="flex items-center justify-end gap-2">
                            {pos.isActive === false ? (
                              <button
                                onClick={() => handlePosRestore(pos._id)}
                                className="p-2 text-gray-400 hover:text-green-500 hover:bg-green-50 dark:hover:bg-green-500/10 rounded-lg transition-colors cursor-pointer"
                                title="Restore"
                              >
                                <Undo2 className="w-4 h-4" />
                              </button>
                            ) : (
                              <>
                                <button
                                  onClick={() => handlePosEditClick(pos)}
                                  className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-lg transition-colors cursor-pointer"
                                  title="Edit"
                                >
                                  <Edit2 className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handlePosDelete(pos._id)}
                                  className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer"
                                  title="Delete"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                        )}
                      </tr>
                    ))
                  )}
                  {!isPosLoading && positions.length === 0 && (
                    <tr>
                      <td
                        colSpan={2}
                        className="px-6 py-12 text-center text-sm text-gray-500"
                      >
                        No positions found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>

      <DepartmentModal
        isOpen={isDeptModalOpen}
        onClose={() => setIsDeptModalOpen(false)}
        onSubmit={handleDeptModalSubmit}
        initialData={selectedDepartment}
      />

      <PositionModal
        isOpen={isPosModalOpen}
        onClose={() => setIsPosModalOpen(false)}
        onSubmit={handlePosModalSubmit}
        initialData={selectedPosition}
      />
    </div>
  );
}
