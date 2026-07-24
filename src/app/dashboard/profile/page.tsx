"use client";

import { useEffect, useState } from "react";
import DirectorProfileScreen from "./screens/DirectorProfileScreen";
import HrProfileScreen from "./screens/HrProfileScreen";

export default function ProfilePage() {
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    setRole(localStorage.getItem("role"));
  }, []);

  // Show nothing or a generic loader while reading localStorage to prevent hydration mismatch
  if (!role) {
    return (
      <div className="w-full mx-auto p-6 md:p-8 space-y-8 animate-pulse">
        <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded-lg w-1/4" />
        <div className="h-32 bg-gray-200 dark:bg-gray-800 rounded-2xl w-full" />
      </div>
    );
  }

  // Mount the specific screen based on the decoupled role
  return role === "DIRECTOR" ? <DirectorProfileScreen /> : <HrProfileScreen />;
}