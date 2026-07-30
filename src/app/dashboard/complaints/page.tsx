"use client";

import PageTitleHeader from "@/components/elements/PageTitleHeader";
import HrComplaintDashboard from './HR/HrComplaintDashboard';
import DirectorComplaintDashboard from './Director/DirectorComplaintDashboard';
import { useComplaint } from "@/hooks/complaint-hooks/useComplaint";

export default function ComplaintPage() {
  const { role, isLoading } = useComplaint();

  // Traffic Controller: Render specific views based on roles
  const renderDashboard = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center h-[40vh]">
          <div className="animate-spin text-brand-blue text-2xl">⏳</div>
        </div>
      );
    }

    switch (role) {
      case 'HR':
        return <HrComplaintDashboard />;
      case 'DIRECTOR':
        return <DirectorComplaintDashboard />;
      default:
        return (
          <div className="flex justify-center items-center h-[40vh] flex-col bg-white dark:bg-primary rounded-2xl border border-gray-100 dark:border-gray-800">
            <h2 className="text-xl font-bold text-gray-400">Unauthorized role or access denied.</h2>
          </div>
        );
    }
  };

  return (
    <div className="w-full mx-auto p-6 md:p-8 space-y-8 font-sans relative overflow-hidden">
      <PageTitleHeader
        title="Complaints & Grievances"
        description="Manage, review, and resolve workplace complaints securely."
      />

      {/* Render the specific role-based stack */}
      {renderDashboard()}
    </div>
  );
}