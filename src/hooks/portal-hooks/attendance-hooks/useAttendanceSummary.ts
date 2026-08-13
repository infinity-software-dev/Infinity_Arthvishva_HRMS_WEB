import { useState, useEffect, useMemo } from 'react';
import toast from 'react-hot-toast';
import { portalAttendanceService } from '@/services/employeeProtalServices/employee.attendance.service';

export const useAttendanceSummary = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [data, setData] = useState<{ summary: any, records: any[] } | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    // Derive year and month for the API
    const year = currentDate.getFullYear().toString();
    const month = (currentDate.getMonth() + 1).toString();

    useEffect(() => {
        const fetchMonthlyData = async () => {
            setLoading(true);
            try {
                const res = await portalAttendanceService.getMonthlyAttendance(year, month);
                setData(res);
            } catch (err: any) {
                toast.error(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchMonthlyData();
    }, [year, month]);

    // Navigation handlers
    const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));

    // Calculate specific stats for the UI cards
    const uiStats = useMemo(() => {
        if (!data || !data.records) {
            return { present: 0, absent: 0, holiday: 0, weekOff: 0, lateIns: 0, avgHours: "0.0h" };
        }

        let present = 0, absent = 0, holiday = 0, weekOff = 0, lateIns = 0;
        let totalMinutesWorked = 0, workingDaysCount = 0;

        data.records.forEach((r: any) => {
            if (r.status === 'P' || r.status === 'Half') present++;
            if (r.status === 'A') absent++;
            if (r.status === 'H') holiday++;
            if (r.status === 'WO') weekOff++;

            if (r.myAttendance) {
                if (r.myAttendance.isLate) lateIns++;
                if (r.myAttendance.totalMinutes) {
                    totalMinutesWorked += r.myAttendance.totalMinutes;
                    workingDaysCount++;
                }
            }
        });

        const avgH = workingDaysCount > 0
            ? (totalMinutesWorked / 60 / workingDaysCount).toFixed(1)
            : "0.0";

        return {
            present,
            absent,
            holiday,
            weekOff,
            lateIns,
            avgHours: `${avgH}h`
        };
    }, [data]);

    return {
        currentDate,
        nextMonth,
        prevMonth,
        data,
        uiStats,
        loading
    };
};