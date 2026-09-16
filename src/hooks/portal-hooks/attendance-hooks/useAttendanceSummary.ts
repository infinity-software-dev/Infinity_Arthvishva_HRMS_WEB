import { useState, useEffect, useMemo } from 'react';
import toast from 'react-hot-toast';
import { portalAttendanceService } from '@/services/employeeProtalServices/employee.attendance.service';

const getMonthStartEnd = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const start = `${year}-${String(month + 1).padStart(2, '0')}-01`;
    const lastDay = new Date(year, month + 1, 0).getDate();
    const end = `${year}-${String(month + 1).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`;
    return { start, end };
};

const getYearMonthPairs = (startDateStr: string, endDateStr: string) => {
    if (!startDateStr || !endDateStr) return [];
    const [startYear, startMonth] = startDateStr.split('-').map(Number);
    const [endYear, endMonth] = endDateStr.split('-').map(Number);

    if (!startYear || !startMonth || !endYear || !endMonth) return [];

    const pairs: { year: string; month: string }[] = [];
    let curYear = startYear;
    let curMonth = startMonth;

    while (curYear < endYear || (curYear === endYear && curMonth <= endMonth)) {
        pairs.push({
            year: curYear.toString(),
            month: curMonth.toString()
        });
        curMonth++;
        if (curMonth > 12) {
            curMonth = 1;
            curYear++;
        }
    }
    return pairs;
};

export const useAttendanceSummary = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const initialDates = useMemo(() => getMonthStartEnd(new Date()), []);
    const [startDate, setStartDate] = useState<string>(initialDates.start);
    const [endDate, setEndDate] = useState<string>(initialDates.end);

    const [data, setData] = useState<{ summary: any, records: any[] } | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        if (!startDate || !endDate) return;

        const fetchData = async () => {
            setLoading(true);
            try {
                const pairs = getYearMonthPairs(startDate, endDate);
                if (pairs.length === 0) {
                    setData({ summary: {}, records: [] });
                    return;
                }

                // Fetch all needed months in parallel
                const responses = await Promise.all(
                    pairs.map(p => portalAttendanceService.getMonthlyAttendance(p.year, p.month))
                );

                // Combine records
                const allRecords: any[] = [];
                responses.forEach(res => {
                    if (res && Array.isArray(res.records)) {
                        allRecords.push(...res.records);
                    }
                });

                // Deduplicate by date in case of overlaps
                const recordMap = new Map();
                allRecords.forEach(r => {
                    if (r && r.date) {
                        recordMap.set(r.date, r);
                    }
                });
                const uniqueRecords = Array.from(recordMap.values());

                // Filter strictly between startDate and endDate
                const filtered = uniqueRecords.filter(r => r.date >= startDate && r.date <= endDate);

                // Sort ascending by date
                filtered.sort((a, b) => a.date.localeCompare(b.date));

                setData({
                    summary: responses[responses.length - 1]?.summary || {},
                    records: filtered
                });
            } catch (err: any) {
                toast.error(err.message || 'Failed to fetch attendance summary');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [startDate, endDate]);

    // Quick navigation handlers for jumping months
    const prevMonth = () => {
        const d = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
        setCurrentDate(d);
        const { start, end } = getMonthStartEnd(d);
        setStartDate(start);
        setEndDate(end);
    };

    const nextMonth = () => {
        const d = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);
        setCurrentDate(d);
        const { start, end } = getMonthStartEnd(d);
        setStartDate(start);
        setEndDate(end);
    };

    // Calculate specific stats dynamically for the filtered date range
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
        startDate,
        setStartDate,
        endDate,
        setEndDate,
        currentDate,
        nextMonth,
        prevMonth,
        data,
        uiStats,
        loading
    };
};