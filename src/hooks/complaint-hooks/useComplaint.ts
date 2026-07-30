"use client";

import { useState, useEffect } from "react";

export function useComplaint() {
    const [role, setRole] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Runs only on the client after initial hydration
        const storedRole = localStorage.getItem("role");
        setRole(storedRole);
        setIsLoading(false);
    }, []);

    return { role, isLoading };
}