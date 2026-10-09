import React, { useState } from 'react';
import { FormInput, FormSelect, FormTextarea } from '@/components/elements/FormFields';
import { ExperienceLetterData } from '@/components/templates/letters/ExperienceLetterTemplate';
import { useEmployees } from '@/hooks/employee-hooks/useEmployees';

interface ExperienceLetterFormProps {
    onSubmit: (data: ExperienceLetterData) => void;
}

export const ExperienceLetterForm: React.FC<ExperienceLetterFormProps> = ({ onSubmit }) => {
    const [formData, setFormData] = useState<ExperienceLetterData & { employeeEmail?: string }>({
        date: '',
        employeeTitle: 'Mr.',
        employeeName: '',
        joiningDate: '',
        lastWorkingDate: '',
        designation: '',
        department: '',
        responsibilities: '',
        gender: 'male',
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
            const joiningDate = selected?.joiningDate
                ? new Date(selected.joiningDate).toISOString().split('T')[0]
                : '';
            setFormData(prev => ({
                ...prev,
                employeeName: value,
                designation: selected?.position || '',
                department: selected?.department || '',
                joiningDate: joiningDate || '',
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
                            value={formData.employeeTitle}
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

                <FormSelect
                    label="Gender (For Pronouns)"
                    name="gender"
                    value={formData.gender || ''}
                    onChange={handleChange}
                    options={[
                        { label: 'Male', value: 'male' },
                        { label: 'Female', value: 'female' }
                    ]}
                />
                
                <FormInput
                    label="Joining Date"
                    name="joiningDate"
                    type="date"
                    value={formData.joiningDate || ''}
                    onChange={handleChange}
                    textTransform="none"
                    required
                />
                <FormInput
                    label="Last Working Date"
                    name="lastWorkingDate"
                    type="date"
                    value={formData.lastWorkingDate || ''}
                    onChange={handleChange}
                    textTransform="none"
                    required
                />
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
            </div>
            
            <div className="mt-6">
                <FormTextarea
                    label="Responsibilities (Optional)"
                    name="responsibilities"
                    value={formData.responsibilities || ''}
                    onChange={handleChange as any}
                    placeholder="e.g. managing the backend development team and database architecture."
                    rows={3}
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
