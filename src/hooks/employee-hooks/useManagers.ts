import { useState, useEffect, useCallback } from "react";
import { employeeService } from "@/services/employee.service";

export interface Manager {
    _id: string;
    name: string;
    position?: string;
    department?: string;
}

export function useManagers() {
    const [managers, setManagers] = useState<Manager[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchManagers = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await employeeService.getManagerList();
            setManagers(data?.data || data || []);
        } catch (err: any) {
            const message = err.response?.data?.message || err.message || "Failed to load managers";
            setError(Array.isArray(message) ? message.join(", ") : message);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchManagers();
    }, [fetchManagers]);

    return {
        managers,
        isLoading,
        error,
        refresh: fetchManagers,
    };
}
