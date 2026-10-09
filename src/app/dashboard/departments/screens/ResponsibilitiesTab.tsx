import React from "react";
import { Edit2, Trash2, Plus, Loader2, X, Check } from "lucide-react";

export default function ResponsibilitiesTab({
  deptRole,
  activePositions,
  selectedPosId,
  handlePositionSelect,
  newResp,
  setNewResp,
  handleAddResp,
  responsibilities,
  editingIndex,
  editValue,
  setEditValue,
  handleSaveEditResp,
  handleCancelEditResp,
  handleEditRespClick,
  handleRemoveResp,
  respError,
  respSuccessMsg,
  isSavingResp,
}: any) {
  return (
    <div className="space-y-8">
      {deptRole === 'HR' && (
        <div className="bg-white dark:bg-[#111] rounded-2xl border border-gray-100 dark:border-white/10 shadow-sm p-6 space-y-6">

          {/* Position Dropdown */}
          <div className="w-full sm:max-w-sm">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Select Position
            </label>
            <select
              value={selectedPosId}
              onChange={(e) => handlePositionSelect(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-900 text-sm text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-blue cursor-pointer"
            >
              <option value="">-- Select a Position --</option>
              {activePositions.map((pos: any) => (
                <option key={pos._id} value={pos._id}>{pos.name}</option>
              ))}
            </select>
          </div>

          {/* Editor — shown only when position is selected */}
          {selectedPosId && (
            <div className="space-y-4">
              {/* Add input */}
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  value={newResp}
                  onChange={(e) => setNewResp(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddResp(); } }}
                  placeholder="e.g. Manage backend API development"
                  className="flex-1 px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-900 text-sm text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-blue"
                />
                <button
                  type="button"
                  onClick={handleAddResp}
                  disabled={!newResp.trim()}
                  className="flex items-center gap-2 px-4 py-2.5 bg-brand-blue text-white text-sm font-medium rounded-xl hover:bg-brand-blue/90 transition-colors disabled:opacity-50 cursor-pointer"
                >
                  <Plus className="w-4 h-4" /> Add
                </button>
              </div>

              {/* List */}
              {responsibilities.length > 0 ? (
                <div className="space-y-2">
                  {responsibilities.map((resp: any, idx: number) => (
                    <div key={idx} className="flex items-center justify-between gap-3 px-4 py-3 bg-gray-50 dark:bg-gray-900/60 border border-gray-100 dark:border-white/10 rounded-xl group">
                      {editingIndex === idx ? (
                        <div className="flex flex-col sm:flex-row sm:items-center gap-3 w-full">
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <span className="text-xs font-bold text-brand-blue w-5 text-center">{idx + 1}</span>
                          </div>
                          <input
                            type="text"
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleSaveEditResp(idx); } else if (e.key === 'Escape') { e.preventDefault(); handleCancelEditResp(); } }}
                            autoFocus
                            className="flex-1 w-full sm:w-auto px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-blue"
                          />
                          <div className="flex items-center gap-1 self-end sm:self-auto">
                            <button
                              type="button"
                              onClick={() => handleSaveEditResp(idx)}
                              className="p-1.5 text-green-600 hover:bg-green-100 dark:hover:bg-green-900/30 rounded-lg transition-colors cursor-pointer"
                              title="Save"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={handleCancelEditResp}
                              className="p-1.5 text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors cursor-pointer"
                              title="Cancel"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="flex items-start sm:items-center gap-3 flex-1 overflow-hidden">
                            <span className="text-xs font-bold text-brand-blue w-5 text-center pt-0.5 sm:pt-0 shrink-0">{idx + 1}</span>
                            <span className="text-sm text-gray-800 dark:text-gray-200 break-words">{resp}</span>
                          </div>
                          <div className="flex items-center gap-1 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity mt-2 sm:mt-0 self-end sm:self-auto">
                            <button
                              type="button"
                              onClick={() => handleEditRespClick(idx, resp)}
                              className="p-1.5 text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-lg transition-colors cursor-pointer"
                              title="Edit"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleRemoveResp(idx)}
                              className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-400 dark:text-gray-500 italic">
                  No responsibilities added yet. Type above and press Add.
                </p>
              )}

              {/* Messages */}
              {respError && <p className="text-sm text-red-600 dark:text-red-400">{respError}</p>}
              {respSuccessMsg && <p className="text-sm text-green-600 dark:text-green-400 font-medium">✓ {respSuccessMsg}</p>}
              {isSavingResp && <p className="text-sm text-gray-500 font-medium flex items-center gap-2"><Loader2 className="w-4 h-4 animate-spin" /> Saving...</p>}
            </div>
          )}
        </div>
      )}

      {/* Master Table of Responsibilities */}
      <div className="mt-8">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">All Positions & Responsibilities</h3>
        <div className="bg-white dark:bg-[#111] rounded-2xl border border-gray-100 dark:border-white/10 shadow-sm overflow-hidden">
          <div className="overflow-x-auto overflow-y-auto max-h-[60vh]">
            <table className="w-full text-left border-collapse relative">
              <thead className="sticky top-0 z-10 bg-gray-50/95 dark:bg-[#1a1a2e]/95 backdrop-blur-sm shadow-sm">
                <tr className="border-b border-gray-200 dark:border-white/10">
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider w-1/3">Position</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Responsibilities</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                {activePositions.length === 0 ? (
                  <tr>
                    <td colSpan={2} className="px-6 py-12 text-center text-sm text-gray-500">No positions found.</td>
                  </tr>
                ) : (
                  activePositions.map((pos: any) => (
                    <tr key={pos._id} className="hover:bg-gray-50/50 dark:hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white align-top">
                        {pos.name}
                      </td>
                      <td className="px-6 py-4">
                        {pos.responsibilities && pos.responsibilities.length > 0 ? (
                          <ul className="list-disc list-inside space-y-1">
                            {pos.responsibilities.map((r: any, i: number) => (
                              <li key={i} className="text-sm text-gray-700 dark:text-gray-300">{r}</li>
                            ))}
                          </ul>
                        ) : (
                          <span className="text-sm text-gray-400 italic">No responsibilities assigned.</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
