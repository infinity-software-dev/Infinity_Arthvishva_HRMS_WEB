'use client';

import React, { useState } from 'react';
import { Megaphone, Plus, Loader2, AlertCircle } from 'lucide-react';
import { useAnnouncements } from '@/hooks/announcement-hooks/useAnnouncement';
import { GlobalAlert } from '@/services/announcement.service';
import { AnnouncementCard } from '@/components/cards/Announcement/AnnouncementCard';
import { UpsertAlertModal } from '@/components/modals/UpsertAlertModal';

export default function AnnouncementsPage() {
  const { alerts, isLoading, error, upsertAlert } = useAnnouncements();
  const isHr = localStorage.getItem('role') === 'HR';

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAlert, setEditingAlert] = useState<GlobalAlert | null>(null);

  const handleOpenNew = () => {
    setEditingAlert(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (alert: GlobalAlert) => {
    setEditingAlert(alert);
    setIsModalOpen(true);
  };

  return (
    <div className="max-w-6xl mx-auto p-6 font-sans">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-primary dark:text-white">Announcements</h1>
          <p className="text-secondary dark:text-gray-400 mt-1">
            Broadcast updates, news, and promotional events to employee mobile apps.
          </p>
        </div>

        {
          isHr && (
            <div className="flex items-center gap-3">
              <button
                onClick={handleOpenNew}
                className="flex items-center gap-2 bg-gradient-to-r from-brand-blue to-brand-green hover:opacity-90 text-white px-5 py-2.5 rounded-xl font-medium transition-opacity shadow-sm cursor-pointer"
              >
                <Plus size={18} />
                <span>Create Alert</span>
              </button>
            </div>
          )
        }
      </div>

      {/* Global Error Banner */}
      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 flex items-center gap-3">
          <AlertCircle size={20} className="flex-shrink-0" />
          <p className="text-sm">{error}</p>
        </div>
      )}

      {/* Main Content Area */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-32 text-secondary dark:text-gray-400 bg-white dark:bg-[#16101B] rounded-2xl border border-secondary/20 dark:border-secondary/30">
          <Loader2 className="animate-spin mb-4 text-brand-green" size={32} />
          <p>Loading announcements...</p>
        </div>
      ) : alerts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-32 text-secondary dark:text-gray-400 text-center px-4 bg-white dark:bg-[#16101B] rounded-2xl border border-secondary/20 dark:border-secondary/30">
          <Megaphone size={48} className="mb-4 text-secondary/40 opacity-50" />
          <h3 className="text-lg font-semibold text-primary dark:text-white mb-1">
            No active announcements
          </h3>
          <p className="text-sm max-w-sm">Create an announcement to instantly notify employees on their mobile devices.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {alerts.map((alert) => (
            <AnnouncementCard
              key={alert._id}
              alert={alert}
              onEdit={handleOpenEdit}
            />
          ))}
        </div>
      )}

      {/* Upsert Modal */}
      <UpsertAlertModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={upsertAlert}
        initialData={editingAlert}
      />
    </div>
  );
}