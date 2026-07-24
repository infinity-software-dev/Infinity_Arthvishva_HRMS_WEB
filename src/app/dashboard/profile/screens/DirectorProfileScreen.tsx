// src/screens/DirectorProfileScreen.tsx
"use client";

import PageTitleHeader from "@/components/elements/PageTitleHeader";
import ChangePasswordCard from "@/components/cards/Profile/ChangePasswordCard";
import { useProfile } from "@/hooks/profile-hooks/useProfile";
import { AlertCircle } from "lucide-react";
import DirectorProfileHeader from "@/components/profile/DirectorProfileHeader";

export default function DirectorProfileScreen() {
    const { profileData, isLoading, error } = useProfile();
    

    if (isLoading) {
        return (
            <div className="w-full mx-auto p-6 md:p-8 space-y-8 animate-pulse">
                <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded-lg w-1/4" />
                <div className="h-32 bg-gray-200 dark:bg-gray-800 rounded-2xl w-full" />
                <div className="h-64 bg-gray-200 dark:bg-gray-800 rounded-2xl w-full" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="w-full mx-auto p-6 md:p-8 space-y-4">
                <PageTitleHeader
                    title="Director Security Profile"
                    description="Manage root access credentials and view authorization tokens."
                />
                <div className="flex items-center gap-3 p-4 bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30 text-red-700 dark:text-red-400 rounded-2xl text-sm font-medium">
                    <AlertCircle size={20} className="shrink-0" />
                    <span>{error}</span>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full mx-auto p-6 md:p-8 space-y-8 font-sans relative overflow-hidden">

            <PageTitleHeader
                title="Director Security Profile"
                description="Manage root access credentials and view system authorization variables."
            />

            <div className="space-y-6">

                {/* Pass ONLY the fields that exist in the DirectorProfile Schema */}
                <DirectorProfileHeader
                    idCode={profileData?.idCode || "UNKNOWN"}
                    isActive={profileData?.isActive ?? false}
                    createdAt={profileData?.createdAt}
                />

                {/* Reusing the same password component since both schemas have a password field */}
                <ChangePasswordCard />

            </div>
        </div>
    );
}