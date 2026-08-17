import { alertService, GlobalAlert, UpsertAlertPayload } from "@/services/announcement.service";
import { useState, useEffect, useCallback } from "react";

export function useAnnouncements() {
  const [alerts, setAlerts] = useState<GlobalAlert[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAlerts = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await alertService.getAlerts();
      setAlerts(data);
    } catch (err: any) {
      const message = err.response?.data?.message || err.message || "Failed to load announcements";
      setError(Array.isArray(message) ? message.join(", ") : message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAlerts();
  }, [fetchAlerts]);

  const upsertAlert = async (payload: UpsertAlertPayload): Promise<GlobalAlert> => {
    setIsSubmitting(true);
    setError(null);
    try {
      const updatedAlert = await alertService.upsertAlert(payload);
      
      // The backend uses findOneAndUpdate by type, so we replace the existing alert of the same type
      setAlerts((prev) => {
        const exists = prev.find(a => a.type === updatedAlert.type);
        if (exists) {
          return prev.map(a => a.type === updatedAlert.type ? updatedAlert : a);
        }
        return [updatedAlert, ...prev];
      });

      return updatedAlert;
    } catch (err: any) {
      const message = err.response?.data?.message || err.message || "Failed to save announcement";
      const formattedError = Array.isArray(message) ? message.join(", ") : message;
      setError(formattedError);
      throw new Error(formattedError);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    alerts,
    isLoading,
    isSubmitting,
    error,
    upsertAlert,
    refresh: fetchAlerts,
  };
}