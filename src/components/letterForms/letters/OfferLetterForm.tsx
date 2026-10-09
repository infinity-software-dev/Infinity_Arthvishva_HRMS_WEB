import React, { useState } from 'react';
import { FormInput, FormSelect, FormTextarea } from '@/components/elements/FormFields';
import { OfferLetterData } from '@/components/templates/letters/OfferLetterTemplate';
import { useDepartments } from '@/hooks/department-hooks/useDepartments';
import { usePositions } from '@/hooks/department-hooks/usePositions';
import { employeeService } from '@/services/employee.service';
import { SalaryAnnexureInput } from '@/components/letterForms/letters/SalaryAnnexureInput';
import { SalaryAnnexureData } from '@/components/templates/letters/SalaryAnnexureTable';
import { ExtraPointsInput } from '@/components/letterForms/letters/ExtraPointsInput';
import { ExtraPoint } from '@/types/letterTypes';

interface OfferLetterFormProps {
    onSubmit: (data: OfferLetterData & { annexure?: SalaryAnnexureData | null }) => void;
}

export const OfferLetterForm: React.FC<OfferLetterFormProps> = ({ onSubmit }) => {
    const [formData, setFormData] = useState<OfferLetterData>({
        refNo: '',
        date: '',
        candidateTitle: 'Mr.',
        candidateName: '',
        designation: '',
        department: '',
        joiningDate: '',
        reportingTo: '',
        monthlyCTC: '',
        monthlyCTCWords: '',
        annualCTC: '',
        annualCTCWords: '',
        acceptanceDate: '',
        responsibilities: '',
    });

    const [annexureData, setAnnexureData] = useState<SalaryAnnexureData | null>(null);
    const [extraPoints, setExtraPoints] = useState<ExtraPoint[]>([]);

    const { departments } = useDepartments();
    const departmentOptions = [
        { label: 'Select Department', value: '' },
        ...departments.filter(d => d.isActive).map(d => ({
            label: d.name,
            value: d.name
        }))
    ];

    const { positions } = usePositions();
    const positionOptions = [
        { label: 'Select Designation', value: '' },
        ...positions.filter(p => p.isActive).map(p => ({
            label: p.name,
            value: p.name
        }))
    ];

    const [managerOptions, setManagerOptions] = useState<{ label: string; value: string }[]>([]);

    React.useEffect(() => {
        let isMounted = true;
        const fetchManagers = async () => {
            try {
                const managersRes = await employeeService.getManagerList();
                if (isMounted) {
                    const managers = managersRes?.data || managersRes || [];
                    setManagerOptions([
                        { label: 'Select Manager', value: '' },
                        ...managers.map((m: any) => ({
                            label: `${m.name} (${m.position || 'Manager'})`,
                            value: `${m.name} (${m.position || 'Manager'})`
                        }))
                    ]);
                }
            } catch (error) {
                console.error("Error fetching managers:", error);
            }
        };

        fetchManagers();
        return () => { isMounted = false; };
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    React.useEffect(() => {
        if (formData.designation) {
            const selectedPosition = positions.find(p => p.name === formData.designation);
            if (selectedPosition && selectedPosition.responsibilities && selectedPosition.responsibilities.length > 0) {
                const formattedRes = selectedPosition.responsibilities.map(r => `• ${r}`).join('\n');
                setFormData(prev => ({ ...prev, responsibilities: formattedRes }));
            } else {
                setFormData(prev => ({ ...prev, responsibilities: '' }));
            }
        }
    }, [formData.designation, positions]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({ ...formData, annexure: annexureData, extraPoints });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormInput
                    label="Offer Letter Ref No"
                    name="refNo"
                    value={formData.refNo}
                    onChange={handleChange}
                    placeholder="HR/OfferLetter/.../2025-2026"
                    required
                />
                <FormInput
                    label="Date"
                    name="date"
                    type="date"
                    value={formData.date}
                    onChange={handleChange}
                    textTransform="none"
                    required
                />

                <div className="flex gap-4">
                    <div className="w-1/3">
                        <FormSelect
                            label="Title"
                            name="candidateTitle"
                            value={formData.candidateTitle}
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
                            name="candidateName"
                            value={formData.candidateName}
                            onChange={handleChange}
                            placeholder="Full Name"
                            required
                        />
                    </div>
                </div>

                <FormSelect
                    label="Department"
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    options={departmentOptions}
                    required
                />
                <FormSelect
                    label="Designation"
                    name="designation"
                    value={formData.designation}
                    onChange={handleChange}
                    options={positionOptions}
                    required
                />
                <FormSelect
                    label="Reporting To (Designation)"
                    name="reportingTo"
                    value={formData.reportingTo}
                    onChange={handleChange}
                    options={managerOptions}
                    required
                />

                <FormInput
                    label="Joining Date"
                    name="joiningDate"
                    type="date"
                    value={formData.joiningDate}
                    onChange={handleChange}
                    textTransform="none"
                    required
                />
                <FormInput
                    label="Acceptance Date (Before)"
                    name="acceptanceDate"
                    type="date"
                    value={formData.acceptanceDate}
                    onChange={handleChange}
                    textTransform="none"
                    required
                />

                <FormInput
                    label="Monthly CTC (Numbers)"
                    name="monthlyCTC"
                    type="number"
                    value={formData.monthlyCTC}
                    onChange={handleChange}
                    placeholder="e.g. 50000"
                    required
                />
                <FormInput
                    label="Monthly CTC (Words)"
                    name="monthlyCTCWords"
                    value={formData.monthlyCTCWords}
                    onChange={handleChange}
                    placeholder="e.g. Fifty Thousand"
                    required
                />

                <FormInput
                    label="Annual CTC (Numbers)"
                    name="annualCTC"
                    type="number"
                    value={formData.annualCTC}
                    onChange={handleChange}
                    placeholder="e.g. 600000"
                    required
                />
                <FormInput
                    label="Annual CTC (Words)"
                    name="annualCTCWords"
                    value={formData.annualCTCWords}
                    onChange={handleChange}
                    placeholder="e.g. Six Lakhs"
                    required
                />

                <div className="md:col-span-2">
                    <FormTextarea
                        label="Key Responsibilities (Optional)"
                        name="responsibilities"
                        value={formData.responsibilities}
                        onChange={handleChange}
                        placeholder="Enter responsibilities, one per line..."
                        rows={4}
                    />
                </div>
            </div>

            {/* Salary Annexure Table */}
            <div className="md:col-span-2">
                <SalaryAnnexureInput
                    data={annexureData}
                    onChange={setAnnexureData}
                />
            </div>

            {/* Extra Points */}
            <ExtraPointsInput
                points={extraPoints}
                onChange={setExtraPoints}
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
