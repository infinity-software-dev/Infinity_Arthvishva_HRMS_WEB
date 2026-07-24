"use client";

import { useState, useEffect, useCallback } from "react";
import { profileService, SystemProfileData } from "@/services/profile.service";

export function useProfile() {
    // Change state type to the new Union Type
    const [profileData, setProfileData] = useState<SystemProfileData | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchProfile = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await profileService.getMasterProfile();
            setProfileData(data);
        } catch (err: any) {
            // Make error logging role-agnostic
            console.error("Failed to load System profile configuration matrix:", err);
            setError(err.response?.data?.message || "Failed to load profile details.");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchProfile();
    }, [fetchProfile]);

    return {
        profileData,
        isLoading,
        error,
        refreshProfile: fetchProfile
    };
}