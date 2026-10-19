import React, { useState } from 'react';
import { FormInput, FormSelect, FormTextarea } from '@/components/elements/FormFields';
import { InternshipExperienceLetterData } from '@/components/templates/letters/InternshipExperinceLetterTemplate';
import { useEmployees } from '@/hooks/employee-hooks/useEmployees';

interface InternshipExperienceLetterFormProps {
    onSubmit: (data: InternshipExperienceLetterData & { employeeEmail?: string }) => void;
}

export const InternshipExperienceLetterForm: React.FC<InternshipExperienceLetterFormProps> = ({ onSubmit }) => {
    const [formData, setFormData] = useState({
        date: '',
        employeeTitle: 'Mr.',
        employeeName: '',
        employeeId: '',
        gender: 'male' as 'male' | 'female',
        startDate: '',
        endDate: '',
        duration: '',
        designation: '',
        department: '',
        activitySummary: '',
        responsibilitiesStr: 'Assisting in daily department operations and documentation.\nCoordinating with team members on ongoing projects and reports.\nHandling operational tasks and customer queries diligently.',
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

        if (name === 'employeeName') {
            const selected = value ? employees.find(emp => emp.name === value) : null;
            const joiningDate = selected?.joiningDate
                ? new Date(selected.joiningDate).toISOString().split('T')[0]
                : '';

            setFormData(prev => ({
                ...prev,
                employeeName: value,
                employeeId: selected?.employeeCode || '',
                designation: selected?.position || prev.designation,
                department: selected?.department || prev.department,
                startDate: joiningDate || prev.startDate,
                employeeEmail: selected?.email || prev.employeeEmail,
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

        const responsibilities = formData.responsibilitiesStr
            .split('\n')
            .map(s => s.replace(/^•\s*/, '').trim())
            .filter(s => s.length > 0);

        const submitData: InternshipExperienceLetterData & { employeeEmail?: string } = {
            date: formData.date,
            employeeTitle: formData.employeeTitle,
            employeeName: formData.employeeName,
            employeeId: formData.employeeId || undefined,
            duration: formData.duration,
            startDate: formData.startDate,
            endDate: formData.endDate,
            designation: formData.designation,
            department: formData.department,
            activitySummary: formData.activitySummary || undefined,
            responsibilities: responsibilities.length > 0 ? responsibilities : ['Assisting in operations and project execution.'],
            gender: formData.gender,
            employeeEmail: formData.employeeEmail || undefined,
        };

        onSubmit(submitData);
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

                <FormInput
                    label="Employee ID"
                    name="employeeId"
                    type="text"
                    value={formData.employeeId || ''}
                    onChange={handleChange}
                    placeholder="e.g. IA00014"
                />

                <FormSelect
                    label="Gender (For Pronouns)"
                    name="gender"
                    value={formData.gender || 'male'}
                    onChange={handleChange}
                    options={[
                        { label: 'Male', value: 'male' },
                        { label: 'Female', value: 'female' }
                    ]}
                />

                <FormInput
                    label="Internship Start Date"
                    name="startDate"
                    type="date"
                    value={formData.startDate || ''}
                    onChange={handleChange}
                    textTransform="none"
                    required
                />

                <FormInput
                    label="Internship End Date"
                    name="endDate"
                    type="date"
                    value={formData.endDate || ''}
                    onChange={handleChange}
                    textTransform="none"
                    required
                />

                <FormInput
                    label="Duration"
                    name="duration"
                    type="text"
                    value={formData.duration || ''}
                    onChange={handleChange}
                    placeholder="e.g. two-month, 3 months, 6 months"
                    required
                />

                <FormInput
                    label="Designation"
                    name="designation"
                    type="text"
                    value={formData.designation || ''}
                    onChange={handleChange}
                    placeholder="e.g. Finance Intern, Web Developer Intern"
                    required
                />

                <FormInput
                    label="Department"
                    name="department"
                    type="text"
                    value={formData.department || ''}
                    onChange={handleChange}
                    placeholder="e.g. Motor Insurance, IT"
                    required
                />

                <FormInput
                    label="Activity Summary (Optional)"
                    name="activitySummary"
                    type="text"
                    value={formData.activitySummary || ''}
                    onChange={handleChange}
                    placeholder="e.g. motor insurance operations and customer servicing"
                />
            </div>

            <div className="space-y-6">

                <FormTextarea
                    label="Key Responsibilities (One item per line)"
                    name="responsibilitiesStr"
                    value={formData.responsibilitiesStr || ''}
                    onChange={handleChange as any}
                    placeholder="Enter responsibilities, one per line..."
                    rows={4}
                />
            </div>

            <div className="flex justify-end pt-4">
                <button
                    type="submit"
                    className="px-6 py-2.5 bg-brand-green text-white font-medium rounded-xl hover:bg-brand-green/90 transition-all focus:outline-none focus:ring-2 focus:ring-brand-green focus:ring-offset-2 dark:focus:ring-offset-gray-900 cursor-pointer"
                >
                    Preview & Generate
                </button>
            </div>
        </form>
    );
};
