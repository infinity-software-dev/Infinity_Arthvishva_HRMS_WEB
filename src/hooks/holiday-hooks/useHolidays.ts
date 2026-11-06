import { useState, useEffect, useCallback } from "react";
import {
    holidayService,
    Holiday,
    CreateHolidayPayload,
} from "@/services/holiday.service";

interface UseHolidaysOptions {
    initialYear?: number;
}

export function useHolidays({
    initialYear = new Date().getFullYear(),
}: UseHolidaysOptions = {}) {
    const [selectedYear, setSelectedYear] = useState<number>(initialYear);
    const [holidays, setHolidays] = useState<Holiday[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const fetchHolidays = useCallback(async (year: number) => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await holidayService.getHolidaysByYear(year);
            // Sort chronologically (earliest to latest in the year)
            const sorted = [...data].sort(
                (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
            );
            setHolidays(sorted);
        } catch (err: any) {
            const message =
                err.response?.data?.message || err.message || "Failed to load holidays";
            setError(Array.isArray(message) ? message.join(", ") : message);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchHolidays(selectedYear);
    }, [selectedYear, fetchHolidays]);

    const addHoliday = async (payload: CreateHolidayPayload): Promise<Holiday> => {
        setIsSubmitting(true);
        setError(null);
        try {
            const created = await holidayService.createHoliday(payload);
            const holidayYear = new Date(created.date).getFullYear();

            if (holidayYear === selectedYear) {
                setHolidays((prev) =>
                    [...prev, created].sort(
                        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
                    )
                );
            }
            return created;
        } catch (err: any) {
            const message =
                err.response?.data?.message || err.message || "Failed to add holiday";
            const formattedError = Array.isArray(message) ? message.join(", ") : message;
            setError(formattedError);
            throw new Error(formattedError);
        } finally {
            setIsSubmitting(false);
        }
    };

    const removeHoliday = async (id: string): Promise<void> => {
        setError(null);
        try {
            await holidayService.deleteHoliday(id);
            setHolidays((prev) => prev.filter((h) => h._id !== id));
        } catch (err: any) {
            const message =
                err.response?.data?.message || err.message || "Failed to remove holiday";
            const formattedError = Array.isArray(message) ? message.join(", ") : message;
            setError(formattedError);
            throw new Error(formattedError);
        }
    };

    const refresh = () => fetchHolidays(selectedYear);

    return {
        holidays,
        selectedYear,
        setSelectedYear,
        isLoading,
        isSubmitting,
        error,
        addHoliday,
        removeHoliday,
        refresh,
    };
}