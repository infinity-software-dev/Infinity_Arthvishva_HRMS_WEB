import React, { useState } from 'react';
import { FormInput, FormSelect } from '@/components/elements/FormFields';
import { IncrementLetterData } from '@/components/templates/letters/IncrementLetterTemplate';
import { useEmployees } from '@/hooks/employee-hooks/useEmployees';
import { SalaryAnnexureInput } from '@/components/letterForms/letters/SalaryAnnexureInput';
import { SalaryAnnexureData } from '@/components/templates/letters/SalaryAnnexureTable';
import { ExtraPointsInput } from '@/components/letterForms/letters/ExtraPointsInput';
import { ExtraPoint } from '@/types/letterTypes';

interface IncrementLetterFormProps {
    onSubmit: (data: IncrementLetterData & { employeeEmail?: string; annexure?: SalaryAnnexureData | null }) => void;
}

export const IncrementLetterForm: React.FC<IncrementLetterFormProps> = ({ onSubmit }) => {
    const [formData, setFormData] = useState<IncrementLetterData & { employeeEmail?: string }>({
        // letterNumber: '',
        financialYear: '2025-2026',
        date: '',
        candidateTitle: 'Mr.',
        candidateName: '',
        effectiveMonth: '',
        joiningDate: '',
        employeeId: '',
        existingSalary: '',
        revisedAnnualCTC: '',
        designation: '',
        revisedTerms: '',
        employeeEmail: '',
    });

    const [annexureData, setAnnexureData] = useState<SalaryAnnexureData | null>(null);
    const [extraPoints, setExtraPoints] = useState<ExtraPoint[]>([]);

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
        if (name === 'candidateName') {
            const selected = value ? employees.find(emp => emp.name === value) : null;
            const joiningDate = selected?.joiningDate
                ? new Date(selected.joiningDate).toISOString().split('T')[0]
                : '';
            setFormData(prev => ({
                ...prev,
                candidateName: value,
                designation: selected?.position || '',
                employeeId: selected?.employeeCode || '',
                joiningDate: joiningDate || '',
                employeeEmail: selected?.email || '',
                existingSalary: selected?.salary ? String(selected.salary) : prev.existingSalary || '',
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
        onSubmit({ ...formData, annexure: annexureData, extraPoints });
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
                <FormInput
                    label="Financial Year (Optional)"
                    name="financialYear"
                    type="text"
                    value={formData.financialYear || ''}
                    onChange={handleChange}
                    placeholder="e.g. 2025-2026"
                />
                <div className="flex gap-4">
                    <div className="w-1/3">
                        <FormSelect
                            label="Title"
                            name="candidateTitle"
                            value={formData.candidateTitle || 'Mr.'}
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
                            name="candidateName"
                            value={formData.candidateName || ''}
                            onChange={handleChange}
                            options={employeeOptions}
                            required
                        />
                    </div>
                </div>
                <FormInput
                    label="Effective Month"
                    name="effectiveMonth"
                    type="text"
                    value={formData.effectiveMonth || ''}
                    onChange={handleChange}
                    placeholder="e.g. April 2026"
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
                    label="Employee ID"
                    name="employeeId"
                    type="text"
                    value={formData.employeeId || ''}
                    onChange={handleChange}
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
                    label="Existing Salary"
                    name="existingSalary"
                    type="number"
                    value={formData.existingSalary || ''}
                    onChange={handleChange}
                    placeholder="e.g. 500000"
                />
                <FormInput
                    label="Revised Annual CTC"
                    name="revisedAnnualCTC"
                    type="number"
                    value={formData.revisedAnnualCTC || ''}
                    onChange={handleChange}
                    placeholder="e.g. 600000"
                    required
                />
                <FormInput
                    label="Revised Terms & Conditions (Optional)"
                    name="revisedTerms"
                    type="text"
                    value={formData.revisedTerms || ''}
                    onChange={handleChange}
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
                hint="These will appear above the Notice Period section in the letter."
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
