import React, { useState } from 'react';
import { FormInput, FormSelect } from '@/components/elements/FormFields';
import { AppointmentLetterData } from '@/components/templates/letters/AppoiontmentLetterTemplate';
import { usePositions } from '@/hooks/department-hooks/usePositions';
import { SalaryAnnexureInput } from '@/components/letterForms/letters/SalaryAnnexureInput';
import { SalaryAnnexureData } from '@/components/templates/letters/SalaryAnnexureTable';
import { ExtraPointsInput } from '@/components/letterForms/letters/ExtraPointsInput';
import { ExtraPoint } from '@/types/letterTypes';

interface AppointmentLetterFormProps {
    onSubmit: (data: AppointmentLetterData & { annexureB?: SalaryAnnexureData | null }) => void;
}

export const AppointmentLetterForm: React.FC<AppointmentLetterFormProps> = ({ onSubmit }) => {
    const [formData, setFormData] = useState<AppointmentLetterData>({
        date: '',
        employeeTitle: 'Mr.',
        employeeName: '',
        designation: '',
        joiningDate: '',
        location: '',
        reportingDesignation: '',
        monthlyGross: '',
        reportingTime: '',
        reportingManager: '',
    });

    const [annexureData, setAnnexureData] = useState<SalaryAnnexureData | null>(null);
    const [extraPoints, setExtraPoints] = useState<ExtraPoint[]>([]);

    const { positions } = usePositions();
    const positionOptions = [
        { label: 'Select Designation', value: '' },
        ...positions.filter(p => p.isActive).map(p => ({
            label: p.name,
            value: p.name
        }))
    ];

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({ ...formData, extraPoints, annexureB: annexureData });
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
                        <FormInput
                            label="Employee Name"
                            name="employeeName"
                            type="text"
                            value={formData.employeeName || ''}
                            onChange={handleChange}
                            placeholder="Enter Employee Name"
                            required
                        />
                    </div>
                </div>

                <FormSelect
                    label="Designation"
                    name="designation"
                    value={formData.designation}
                    onChange={handleChange}
                    options={positionOptions}
                    required
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
                    label="Location"
                    name="location"
                    type="text"
                    value={formData.location || ''}
                    onChange={handleChange}
                    required
                />
                <FormInput
                    label="Reporting Manager Designation"
                    name="reportingDesignation"
                    type="text"
                    value={formData.reportingDesignation || ''}
                    onChange={handleChange}
                    required
                />
                <FormInput
                    label="Monthly Gross Amount"
                    name="monthlyGross"
                    type="number"
                    value={formData.monthlyGross || ''}
                    onChange={handleChange}
                    required
                />
                <FormInput
                    label="Reporting Time (Annexure A)"
                    name="reportingTime"
                    type="text"
                    value={formData.reportingTime || ''}
                    onChange={handleChange}
                    required
                />
                <FormInput
                    label="Reporting Manager Name (Annexure A)"
                    name="reportingManager"
                    type="text"
                    value={formData.reportingManager || ''}
                    onChange={handleChange}
                    required
                />
            </div>

            {/* Salary Annexure Table */}
            <SalaryAnnexureInput
                data={annexureData}
                onChange={setAnnexureData}
            />

            {/* Extra Points */}
            <ExtraPointsInput
                points={extraPoints}
                onChange={setExtraPoints}
                hint="These will appear above the Termination section in Annexure A."
            />

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
