import { useState, useEffect } from 'react';
import { employeeService, EmployeeCardTypes } from '@/services/employee.service';

// EXPORT as a named function
// useEmployees.ts
export function useEmployees(searchQuery: string, department: string, status: string, page: number, limit: number) {
    const [employees, setEmployees] = useState<EmployeeCardTypes[]>([]);
    const [meta, setMeta] = useState<any>({}); // Capture meta here
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchEmployees = async () => {
            // setIsLoading(true);
            try {
                // Pass page and limit here
                const { data, meta } = await employeeService.getEmployees(searchQuery, department, status, page, limit);
                setEmployees(data);
                setMeta(meta);
            } catch (err: any) {
                setError(err.message || 'Failed to fetch employees');
            } finally {
                setIsLoading(false);
            }
        };

        const timeoutId = setTimeout(fetchEmployees, 300);
        return () => clearTimeout(timeoutId);

    }, [searchQuery, department, status, page, limit]);

    return { employees, isLoading, error,setError, meta };
}