// hooks/portal-hooks/overview-hooks/usePortalOverview.ts
import { portalAttendanceService } from "@/services/employeeProtalServices/employee.attendance.service";
import { portalService } from "@/services/employeeProtalServices/employee.overview.service";
import { EmployeeProfile, PortalDashboardData, RawAttendanceDocument, RawPerformanceInsights } from "@/services/employeeProtalServices/types";
import { useState, useEffect } from "react";

// Helper utility to convert MongoDB ISO dates to "09:11 AM" format
const formatMongoDate = (isoString?: string | null): string | null => {
  if (!isoString) return null;
  const date = new Date(isoString);
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

export const usePortalOverview = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [profileData, setProfileData] = useState<EmployeeProfile | null>(null);
  const [data, setData] = useState<PortalDashboardData | any>({ punchStatus: null, stats: null });

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      setError("");

      try {
        const [profileRes, rawStatusRes, rawPerformanceRes] = await Promise.all([
          portalService.getProfileData(),
          portalAttendanceService.getTodayStatus() as Promise<RawAttendanceDocument | null>,
          portalService.getPerformanceInsights() as Promise<RawPerformanceInsights | null>
        ]);

        localStorage.setItem('user', JSON.stringify(profileRes));
        setProfileData(profileRes);

        const isPunchedIn = !!rawStatusRes?.inTime && !rawStatusRes?.outTime;

        setData({
          punchStatus: {
            isPunchedIn,
            inTime: formatMongoDate(rawStatusRes?.inTime) || null,
            outTime: formatMongoDate(rawStatusRes?.outTime) || null,
            loggedHours: rawStatusRes?.totalHours ? `${rawStatusRes.totalHours.toFixed(1)}h` : "0h",
            // NEW FIELDS EXTRACTED:
            workMode: rawStatusRes?.workMode || "Office",
            isLate: rawStatusRes?.isLate || false,
            status: rawStatusRes?.status || "N/A"
          },
          // Inside usePortalOverview.ts
          stats: {
            presentDays: rawPerformanceRes?.present || 0,
            workingDays: rawPerformanceRes?.working || ((rawPerformanceRes?.present || 0) + (rawPerformanceRes?.absent || 0)),
            lateArrivals: rawPerformanceRes?.late || 0,
            avgHours: rawPerformanceRes?.totalHours ? `${rawPerformanceRes.totalHours.toFixed(1)}h` : "0h"
          }
        });

      } catch (err: any) {
        setError(err.message || "Failed to load dashboard data.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return { loading, error, data, profileData };
};