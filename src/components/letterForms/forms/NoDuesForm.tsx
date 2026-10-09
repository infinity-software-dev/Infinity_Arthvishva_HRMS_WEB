import React, { useState } from 'react';
import { FormInput, FormSelect } from '@/components/elements/FormFields';
import { NoDuesFormData, NoDuesRow } from '@/components/templates/forms/NoDuesFormTemplate';
import { useEmployees } from '@/hooks/employee-hooks/useEmployees';

interface NoDuesFormProps {
    onSubmit: (data: NoDuesFormData) => void;
}

export const NoDuesForm: React.FC<NoDuesFormProps> = ({ onSubmit }) => {
    const [formData, setFormData] = useState<NoDuesFormData & { employeeTitle?: string; employeeEmail?: string }>({
        employeeTitle: 'Mr.',
        employeeName: '',
        employeeId: '',
        designation: '',
        department: '',
        joiningDate: '',
        lastWorkingDay: '',
        employeeEmail: '',
        rows: [
            { department: 'HR Department' },
            { department: 'Accounts / Finance' },
            { department: 'IT / Admin' },
        ],
    });

    const { employees } = useEmployees('', '', 'Active', 1, 1000);
    const employeeOptions = [
        { label: 'Select Employee', value: '' },
        ...employees.map(emp => ({
            label: emp.name,
            value: emp.name
        }))
    ];

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        // Auto-fill employee details when employee is selected
        if (name === 'employeeName') {
            const selected = value ? employees.find(emp => emp.name === value) : null;
            const joiningDate = selected?.joiningDate
                ? new Date(selected.joiningDate).toISOString().split('T')[0]
                : '';
            setFormData(prev => ({
                ...prev,
                employeeName: value,
                employeeId: selected?.employeeCode || '',
                designation: selected?.position || '',
                department: selected?.department || '',
                joiningDate: joiningDate || '',
                employeeEmail: selected?.email || '',
            }));
            return;
        }

        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleRowChange = (index: number, field: keyof NoDuesRow, value: string) => {
        const updated = [...(formData.rows || [])];
        updated[index] = { ...updated[index], [field]: value };
        setFormData(prev => ({ ...prev, rows: updated }));
    };

    const addRow = () => {
        setFormData(prev => ({
            ...prev,
            rows: [...(prev.rows || []), { department: '' }]
        }));
    };

    const removeRow = (index: number) => {
        setFormData(prev => ({
            ...prev,
            rows: (prev.rows || []).filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Employee Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex gap-4">
                        <div className="w-1/3">
                            <FormSelect
                                label="Title"
                                name="employeeTitle"
                                value={formData.employeeTitle || 'Mr.'}
                                onChange={handleChange}
                                options={[
                                    { label: 'Mr.', value: 'Mr.' },
                                    { label: 'Ms.', value: 'Ms.' },
                                    { label: 'Mrs.', value: 'Mrs.' }
                                ]}
                                required
                            />
                        </div>
                        <div className="flex-1">
                            <FormSelect label="Employee Name" name="employeeName" value={formData.employeeName} onChange={handleChange} options={employeeOptions} required />
                        </div>
                    </div>
                    <FormInput label="Employee ID" name="employeeId" value={formData.employeeId} onChange={handleChange} required />
                    <FormInput label="Designation" name="designation" value={formData.designation} onChange={handleChange} required />
                    <FormInput label="Department" name="department" value={formData.department} onChange={handleChange} required />
                    <FormInput label="Joining Date" name="joiningDate" type="date" value={formData.joiningDate} onChange={handleChange} textTransform="none" required />
                    <FormInput label="Last Working Day" name="lastWorkingDay" type="date" value={formData.lastWorkingDay} onChange={handleChange} textTransform="none" required />
                </div>
            </div>

            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">Department Dues</h3>
                    <button type="button" onClick={addRow} className="px-3 py-1.5 text-sm bg-brand-blue text-white rounded-lg hover:bg-brand-blue/90">+ Add Department</button>
                </div>
                {(formData.rows || []).map((row, index) => (
                    <div key={index} className="p-4 border border-gray-200 dark:border-gray-700 rounded-xl space-y-4 relative">
                        {index > 2 && (
                            <button type="button" onClick={() => removeRow(index)} className="absolute top-4 right-4 text-red-500 hover:text-red-700 text-sm font-medium">Remove</button>
                        )}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                            <FormInput label="Department" name="department" value={row.department || ''} onChange={(e) => handleRowChange(index, 'department', e.target.value)} />
                            <FormInput label="Dues (Yes/No)" name="dues" value={row.dues || ''} onChange={(e) => handleRowChange(index, 'dues', e.target.value)} />
                            <FormInput label="Amount" name="amount" type="number" value={row.amount || ''} onChange={(e) => handleRowChange(index, 'amount', e.target.value)} />
                            <FormInput label="Remarks" name="remarks" value={row.remarks || ''} onChange={(e) => handleRowChange(index, 'remarks', e.target.value)} />
                            <FormInput label="Signature (Name/Initials)" name="signature" value={row.signature || ''} onChange={(e) => handleRowChange(index, 'signature', e.target.value)} />
                        </div>
                    </div>
                ))}
            </div>

            <div className="flex justify-end pt-4 border-t border-gray-200 dark:border-gray-700">
                <button
                    type="submit"
                    className="px-6 py-2.5 bg-brand-green text-white font-medium rounded-xl hover:bg-brand-green/90 transition-all focus:outline-none focus:ring-2 focus:ring-brand-green focus:ring-offset-2 dark:focus:ring-offset-gray-900"
                >
                    Preview & Generate
                </button>
            </div>
        </form>
    );
};
