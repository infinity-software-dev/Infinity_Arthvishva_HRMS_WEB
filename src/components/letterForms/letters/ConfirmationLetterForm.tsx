import React, { useState } from 'react';
import { FormInput, FormSelect } from '@/components/elements/FormFields';
import { ConfirmationLetterData } from '@/components/templates/letters/ConfirmationLetterTemplate';
import { useEmployees } from '@/hooks/employee-hooks/useEmployees';

interface ConfirmationLetterFormProps {
    onSubmit: (data: ConfirmationLetterData) => void;
}

export const ConfirmationLetterForm: React.FC<ConfirmationLetterFormProps> = ({ onSubmit }) => {
    const [formData, setFormData] = useState<ConfirmationLetterData & { employeeEmail?: string }>({
        date: '',
        financialYear: '2025-2026',
        employeeTitle: 'Mr.',
        employeeName: '',
        designation: '',
        department: '',
        confirmationDate: '',
        employeeEmail: '',
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

        // Auto-fill designation and department when employee is selected
        if (name === 'employeeName') {
            const selected = value ? employees.find(emp => emp.name === value) : null;
            setFormData(prev => ({
                ...prev,
                employeeName: value,
                designation: selected?.position || '',
                department: selected?.department || '',
                employeeEmail: selected?.email || '',
            }));
            return;
        }

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormInput
                    label="Date"
                    name="date"
                    type="date"
                    value={formData.date || ''}
                    onChange={handleChange}
                    textTransform="none"
                    required
                />
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
                        <FormSelect
                            label="Employee Name"
                            name="employeeName"
                            value={formData.employeeName || ''}
                            onChange={handleChange}
                            options={employeeOptions}
                            required
                        />
                    </div>
                </div>
                <FormInput
                    label="Designation"
                    name="designation"
                    type="text"
                    value={formData.designation || ''}
                    onChange={handleChange}
                    required
                />
                <FormInput
                    label="Department"
                    name="department"
                    type="text"
                    value={formData.department || ''}
                    onChange={handleChange}
                    required
                />
                <FormInput
                    label="Confirmation Date"
                    name="confirmationDate"
                    type="date"
                    value={formData.confirmationDate || ''}
                    onChange={handleChange}
                    textTransform="none"
                    required
                />
                <FormInput
                    label="Financial Year"
                    name="financialYear"
                    type="text"
                    value={formData.financialYear || ''}
                    onChange={handleChange}
                    placeholder="e.g. 2025-2026"
                />
            </div>

            <div className="flex justify-end pt-4">
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
