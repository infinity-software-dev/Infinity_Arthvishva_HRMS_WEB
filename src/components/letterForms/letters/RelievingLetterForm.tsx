import React, { useState } from 'react';
import { FormInput, FormSelect } from '@/components/elements/FormFields';
import { RelievingLetterData } from '@/components/templates/letters/RelivingLetterTemplate';
import { useEmployees } from '@/hooks/employee-hooks/useEmployees';

interface RelievingLetterFormProps {
    onSubmit: (data: RelievingLetterData) => void;
}

export const RelievingLetterForm: React.FC<RelievingLetterFormProps> = ({ onSubmit }) => {
    const [formData, setFormData] = useState<RelievingLetterData & { employeeEmail?: string }>({
        date: '',
        employeeTitle: 'Mr.',
        employeeName: '',
        designation: '',
        lastWorkingDate: '',
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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        // Auto-fill when employee is selected
        if (name === 'employeeName') {
            const selected = value ? employees.find(emp => emp.name === value) : null;
            setFormData(prev => ({
                ...prev,
                employeeName: value,
                designation: selected?.position || '',
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
                    label="Designation"
                    name="designation"
                    type="text"
                    value={formData.designation || ''}
                    onChange={handleChange}
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
