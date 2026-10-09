"use client";

import React, { useState } from "react";
import { Edit2, Trash2, Plus, Loader2, Undo2, Save, X, Check } from "lucide-react";
import { DepartmentModal } from "@/components/modals/DepartmentModal";
import { PositionModal } from "@/components/modals/PositionModal";
import { useDepartments } from "@/hooks/department-hooks/useDepartments";
import { usePositions } from "@/hooks/department-hooks/usePositions";
import DepartmentsTab from "./screens/DepartmentsTab";
import PositionsTab from "./screens/PositionsTab";
import ResponsibilitiesTab from "./screens/ResponsibilitiesTab";

type ActiveTab = 'departments' | 'positions' | 'responsibilities';

export default function DepartmentsAndPositionsPage() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('departments');

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
    deletePositionResponsibility,

    selectedPosId,
    responsibilities,
    newResp,
    setNewResp,
    editingIndex,
    editValue,
    setEditValue,
    isSavingResp,
    respError,
    respSuccessMsg,
    handlePositionSelect,
    handleAddResp,
    handleRemoveResp,
    handleEditRespClick,
    handleSaveEditResp,
    handleCancelEditResp,
  } = usePositions();

  const activePositions = positions.filter(p => p.isActive !== false);


  const tabs: { key: ActiveTab; label: string }[] = [
    { key: 'departments', label: 'Departments' },
    { key: 'positions', label: 'Positions' },
    { key: 'responsibilities', label: 'Responsibilities' },
  ];

  return (
    <div className="p-4 sm:p-6 md:p-8 w-full max-w-5xl mx-auto">

      {/* ─── Header ─────────────────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {activeTab === 'departments' ? 'Departments' :
              activeTab === 'positions' ? 'Positions' :
                'Position Responsibilities'}
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {activeTab === 'departments' ? 'Manage company departments.' :
              activeTab === 'positions' ? 'Manage company positions.' :
                'Define responsibilities for each position.'}
          </p>
        </div>

        {/* Add button — only for dept and pos tabs */}
        {deptRole === 'HR' && activeTab === 'departments' && (
          <button
            onClick={handleDeptAddClick}
            className="flex items-center gap-2 bg-gradient-to-r from-brand-blue to-brand-green text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:shadow-lg transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Add Department
          </button>
        )}
        {deptRole === 'HR' && activeTab === 'positions' && (
          <button
            onClick={handlePosAddClick}
            className="flex items-center gap-2 bg-gradient-to-r from-brand-blue to-brand-green text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:shadow-lg transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Add Position
          </button>
        )}
      </div>

      {/* ─── Tabs ───────────────────────────────────────────────────────────── */}
      <div className="flex gap-1 bg-gray-100 dark:bg-white/5 rounded-xl p-1 mb-6 w-fit">
        {tabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer ${activeTab === tab.key
              ? 'bg-white dark:bg-[#1a1a2e] text-gray-900 dark:text-white shadow-sm'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
              }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ─── DEPARTMENTS TABLE ───────────────────────────────────────────────── */}
      {activeTab === 'departments' && (
        <DepartmentsTab
          deptRole={deptRole}
          deptError={deptError}
          isDeptLoading={isDeptLoading}
          departments={departments}
          handleDeptRestore={handleDeptRestore}
          handleDeptEditClick={handleDeptEditClick}
          handleDeptDelete={handleDeptDelete}
        />
      )}

      {/* ─── POSITIONS TABLE ─────────────────────────────────────────────────── */}
      {activeTab === 'positions' && (
        <PositionsTab
          deptRole={deptRole}
          posError={posError}
          isPosLoading={isPosLoading}
          positions={positions}
          handlePosRestore={handlePosRestore}
          handlePosEditClick={handlePosEditClick}
          handlePosDelete={handlePosDelete}
        />
      )}

      {/* ─── RESPONSIBILITIES SECTION ─────────────────────────────────────────── */}
      {activeTab === 'responsibilities' && (
        <ResponsibilitiesTab
          deptRole={deptRole}
          activePositions={activePositions}
          selectedPosId={selectedPosId}
          handlePositionSelect={handlePositionSelect}
          newResp={newResp}
          setNewResp={setNewResp}
          handleAddResp={handleAddResp}
          responsibilities={responsibilities}
          editingIndex={editingIndex}
          editValue={editValue}
          setEditValue={setEditValue}
          handleSaveEditResp={handleSaveEditResp}
          handleCancelEditResp={handleCancelEditResp}
          handleEditRespClick={handleEditRespClick}
          handleRemoveResp={handleRemoveResp}
          respError={respError}
          respSuccessMsg={respSuccessMsg}
          isSavingResp={isSavingResp}
        />
      )}

      {/* ─── Modals ──────────────────────────────────────────────────────────── */}
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
