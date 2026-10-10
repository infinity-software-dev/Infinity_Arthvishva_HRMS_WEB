import React, { useState } from 'react';
import { FormInput, FormSelect, FormTextarea } from '@/components/elements/FormFields';
import { WarningLetterData } from '@/components/templates/letters/WarningLetterTemplate';
import { useEmployees } from '@/hooks/employee-hooks/useEmployees';

interface WarningLetterFormProps {
    onSubmit: (data: WarningLetterData) => void;
}

export const WarningLetterForm: React.FC<WarningLetterFormProps> = ({ onSubmit }) => {
    const [formData, setFormData] = useState<WarningLetterData & { employeeEmail?: string }>({
        date: '',
        employeeTitle: 'Mr.',
        employeeName: '',
        designation: '',
        department: '',
        subject: '',
        misconduct: '',
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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;

        // Auto-fill when employee is selected
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
                <div className="md:col-span-2">
                    <FormInput
                        label="Subject (Optional)"
                        name="subject"
                        type="text"
                        value={formData.subject || ''}
                        onChange={handleChange}
                        placeholder="e.g. Warning for unprofessional conduct"
                    />
                </div>
            </div>

            <div className="mt-6">
                <FormTextarea
                    label="Misconduct Description"
                    name="misconduct"
                    value={formData.misconduct || ''}
                    onChange={handleChange as any}
                    placeholder="e.g. taking unauthorized leave for 3 consecutive days without prior information."
                    rows={3}
                    required
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
