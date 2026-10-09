import React from "react";
import { Edit2, Trash2, Loader2, Undo2 } from "lucide-react";

export default function DepartmentsTab({
  deptRole,
  deptError,
  isDeptLoading,
  departments,
  handleDeptRestore,
  handleDeptEditClick,
  handleDeptDelete,
}: any) {
  return (
    <>
      {deptError && (
        <div className="mb-4 p-4 text-sm text-red-600 bg-red-50 dark:bg-red-900/30 rounded-xl">
          {deptError}
        </div>
      )}
      <div className="bg-white dark:bg-[#111] rounded-2xl border border-gray-100 dark:border-white/10 shadow-sm overflow-hidden">
        <div className="overflow-x-auto overflow-y-auto max-h-[60vh]">
          <table className="w-full text-left border-collapse relative">
            <thead className="sticky top-0 z-10 bg-gray-50/95 dark:bg-[#1a1a2e]/95 backdrop-blur-sm shadow-sm">
              <tr className="border-b border-gray-200 dark:border-white/10">
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Department Name</th>
                {deptRole === 'HR' && (
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right w-32">Actions</th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-white/5">
              {isDeptLoading ? (
                <tr>
                  <td colSpan={2} className="px-6 py-12 text-center">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto text-brand-blue" />
                  </td>
                </tr>
              ) : departments.length === 0 ? (
                <tr>
                  <td colSpan={2} className="px-6 py-12 text-center text-sm text-gray-500">No departments found.</td>
                </tr>
              ) : (
                departments.map((dept: any) => (
                  <tr key={dept._id} className={`transition-colors group ${dept.isActive === false ? 'bg-red-50/60 dark:bg-red-950/20 hover:bg-red-100/60' : 'hover:bg-gray-50/50 dark:hover:bg-white/5'}`}>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                      <span className={dept.isActive === false ? 'text-gray-400 line-through' : ''}>{dept.name}</span>
                      {dept.isActive === false && (
                        <span className="ml-2 text-[10px] bg-red-100 text-red-600 px-2 py-0.5 rounded-full">Deleted</span>
                      )}
                    </td>
                    {deptRole === 'HR' && (
                      <td className="px-6 py-4 text-sm text-right">
                        <div className="flex items-center justify-end gap-2">
                          {dept.isActive === false ? (
                            <button onClick={() => handleDeptRestore(dept._id)} className="p-2 text-gray-400 hover:text-green-500 hover:bg-green-50 dark:hover:bg-green-500/10 rounded-lg transition-colors cursor-pointer" title="Restore">
                              <Undo2 className="w-4 h-4" />
                            </button>
                          ) : (
                            <>
                              <button onClick={() => handleDeptEditClick(dept)} className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-lg transition-colors cursor-pointer" title="Edit">
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button onClick={() => handleDeptDelete(dept._id)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer" title="Delete">
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
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
