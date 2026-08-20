"use client";

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { Search, PlayCircle, Edit, Loader2 } from 'lucide-react';
import { useGurukul } from '@/hooks/gurukul-hooks/useGurukul';
import AddVideoModal from '@/components/modals/AddVideoModal';
import EditVideoModal from '@/components/modals/EditVideoModal';
import PageTitleHeader from '@/components/elements/PageTitleHeader';
import GradientButton from '@/components/buttons/GradientButton';

export default function GurukulPage() {
  const {
    videos, filters, form, isLoading,
    isAddModalOpen, openAddModal, closeAddModal, handleAddSubmit,
    isEditModalOpen, openEditModal, closeEditModal, handleEditSubmit
  } = useGurukul();
  const [isHr, setIsHr] = useState<boolean>(false);

  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    // Assuming HR or Admin can add videos
    setIsHr(storedRole === "HR" || storedRole === "ADMIN");
  }, []);

  return (
    // Responsive padding: p-4 on mobile, p-6 on tablet, p-8 on desktop
    <div className="w-full mx-auto p-4 sm:p-6 md:p-8 space-y-6 md:space-y-8 font-sans">

      {/* Page Header */}
      {/* Changed to flex-col on mobile, flex-row on sm (tablet) and above */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <PageTitleHeader
          title="Gurukul Modules"
          description="Manage learning materials, training videos, and onboarding modules."
        />
        {isHr && (
          // Wrapped button to make it full width on mobile, auto width on tablet+
          <div className="w-full sm:w-auto">
            <GradientButton onClick={openAddModal} className="w-full sm:w-auto justify-center">
              + Add Video
            </GradientButton>
          </div>
        )}
      </div>

      {/* Main Data View */}
      {/* Reduced padding on mobile (p-4 to p-6) */}
      <div className="flex-1 w-full bg-white dark:bg-primary rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-gray-100 dark:border-gray-800 p-4 sm:p-6 transition-colors duration-300">

        {/* Toolbar */}
        {/* Switched from xl:flex-row to sm:flex-row so it looks better on tablets */}
        <div className="sticky top-0 z-20 flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4 bg-white dark:bg-gray-900 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">

          <div className="relative w-full sm:w-72 md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search videos by title..."
              value={filters.searchQuery}
              onChange={(e) => filters.setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-green dark:text-white transition-all placeholder:text-gray-400"
            />
          </div>

          {/* Aligned to the left on mobile, right on tablet+ */}
          <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400 font-medium w-full sm:w-auto justify-start sm:justify-end">
            Total Modules: <span className="text-gray-900 dark:text-white">{videos.length}</span>
          </div>
        </div>

        {/* Content States */}
        {isLoading ? (
          <div className="flex-1 flex justify-center items-center py-12">
            <Loader2 className="animate-spin text-brand-blue w-8 h-8" />
          </div>
        ) : videos.length === 0 ? (
          <div className="flex-1 flex justify-center items-center flex-col py-12 px-4 text-center">
            <Image src="/images/animation-gif.gif" alt="No videos" width={200} height={200} unoptimized />
            <p className="text-gray-500 dark:text-gray-400 mt-4 font-medium">No learning modules found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {videos.map((video) => (
              <div key={video._id} className="group flex flex-col bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden hover:shadow-md transition-all duration-300">

                {/* Thumbnail Section */}
                <div className="relative h-44 sm:h-48 w-full bg-gray-200 dark:bg-gray-800 overflow-hidden shrink-0">
                  {video.thumbnail ? (
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <PlayCircle className="w-12 h-12 opacity-50" />
                    </div>
                  )}

                  {/* Overlay Tags */}
                  <div className="absolute top-3 left-3 flex flex-wrap gap-2">
                    <span className={`px-2.5 py-1 text-[10px] font-bold rounded uppercase tracking-wider shadow-sm ${video.videoType === 'youtube' ? 'bg-red-500/95 text-white' : 'bg-brand-blue/95 text-white'}`}>
                      {video.videoType}
                    </span>
                    {!video.isActive && (
                      <span className="px-2.5 py-1 text-[10px] font-bold rounded bg-gray-900/95 text-white uppercase tracking-wider backdrop-blur-sm shadow-sm">
                        Draft
                      </span>
                    )}
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-4 sm:p-5 flex flex-col flex-1 space-y-3">
                  <h3 className="font-bold text-base sm:text-lg text-gray-900 dark:text-white line-clamp-2 sm:line-clamp-1">{video.title}</h3>
                  <p className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm line-clamp-2 flex-1 leading-relaxed">
                    {video.description}
                  </p>

                  {isHr && (
                    <div className="pt-3 sm:pt-4 mt-auto border-t border-gray-200 dark:border-gray-800 flex justify-end">
                      <button
                        onClick={() => openEditModal(video)}
                        className="flex items-center gap-1.5 text-xs cursor-pointer font-semibold text-brand-blue hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors py-1 px-2 -mr-2 rounded-md hover:bg-blue-50 dark:hover:bg-blue-900/30"
                      >
                        <Edit className="w-3.5 h-3.5" /> Edit Details
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modals remain structurally the same */}
      <AddVideoModal
        isOpen={isAddModalOpen}
        onClose={closeAddModal}
        onSubmit={handleAddSubmit}
        form={form}
      />
      <EditVideoModal
        isOpen={isEditModalOpen}
        onClose={closeEditModal}
        onSubmit={handleEditSubmit}
        form={form}
      />

    </div>
  );
}