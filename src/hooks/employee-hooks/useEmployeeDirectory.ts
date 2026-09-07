import { useState } from 'react';
import { useEmployees } from './useEmployees';
import { employeeService } from '@/services/employee.service';

export function useEmployeeDirectory() {
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
    const [searchQuery, setSearchQuery] = useState('');
    const [department, setDepartment] = useState('');
    const [status, setStatus] = useState('');
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);

    // Connect the hook to your existing data fetcher
    const { employees, isLoading, error, setError, meta } = useEmployees(searchQuery, department, status, page, limit);

    const handleExportToExcel = async () => {
        try {
            // 1. Fetch the raw blob data from your API
            const blobData = await employeeService.exportEmployeesToExcel(department, status);

            // 2. Create a URL for the Blob object
            const url = window.URL.createObjectURL(new Blob([blobData]));

            // 3. Create a temporary hidden anchor tag
            const link = document.createElement('a');
            link.href = url;

            // 4. Set the download attribute with a dynamic filename
            const dateStr = new Date().toISOString().split('T')[0];
            link.setAttribute('download', `Employee_Master_Data_${dateStr}.xlsx`);

            // 5. Append to body, trigger click, and clean up
            document.body.appendChild(link);
            link.click();

            // 6. Remove the element and release memory
            link.parentNode?.removeChild(link);
            window.URL.revokeObjectURL(url);

        } catch (err: any) {
            console.error("Export Error: ", err);
            setError(err.message || 'Failed to export employees to Excel');
        }
    };

    return {
        viewMode,
        setViewMode,
        handleExportToExcel,
        filters: {
            searchQuery, setSearchQuery,
            department, setDepartment,
            status, setStatus
        },
        pagination: {
            page,
            setPage,
            limit,
            setLimit,
            totalRecords: meta?.totalRecords || 0,
            totalPages: meta?.totalPages || 0
        },
        data: employees,
        isLoading,
        error
    };
}