export interface PayrollCycle {
    label: string; // e.g. "Jul–Aug 2026"
    startDate: string; // "2026-07-21"
    endDate: string; // "2026-08-20"
    formattedRange: string; // "21 Jul 2026 → 20 Aug 2026"
}

export function generatePayrollCycles(pastMonthsCount: number = 10): PayrollCycle[] {
    const cycles: PayrollCycle[] = [];
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth(); // 0-indexed

    // Generate from 1 upcoming month down to pastMonthsCount
    for (let i = -1; i < pastMonthsCount; i++) {
        const cycleStart = new Date(currentYear, currentMonth - i - 1, 21);
        const cycleEnd = new Date(currentYear, currentMonth - i, 20);

        const startMonthName = cycleStart.toLocaleString('en-US', { month: 'short' });
        const endMonthName = cycleEnd.toLocaleString('en-US', { month: 'short' });
        const startYear = cycleStart.getFullYear();
        const endYear = cycleEnd.getFullYear();

        const labelYear = startYear === endYear ? `${startYear}` : `${startYear}-${endYear}`;
        const label = `${startMonthName}-${endMonthName} ${labelYear}`;

        const formatToDateString = (d: Date) => {
            const year = d.getFullYear();
            const month = String(d.getMonth() + 1).padStart(2, '0');
            const day = String(d.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
        };

        const formatReadable = (d: Date) =>
            d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

        cycles.push({
            label,
            startDate: formatToDateString(cycleStart),
            endDate: formatToDateString(cycleEnd),
            formattedRange: `${formatReadable(cycleStart)} → ${formatReadable(cycleEnd)}`
        });
    }

    return cycles;
}