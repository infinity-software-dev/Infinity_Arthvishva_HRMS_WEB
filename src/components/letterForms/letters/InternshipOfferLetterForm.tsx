import React, { useState } from 'react';
import { FormInput, FormSelect, FormTextarea } from '@/components/elements/FormFields';
import { InternshipOfferLetterData } from '@/components/templates/letters/InternshipOfferLetter';
import { useDepartments } from '@/hooks/department-hooks/useDepartments';
import { usePositions } from '@/hooks/department-hooks/usePositions';
interface InternshipOfferLetterFormProps {
    onSubmit: (data: InternshipOfferLetterData) => void;
}

export const InternshipOfferLetterForm: React.FC<InternshipOfferLetterFormProps> = ({ onSubmit }) => {
    // Keep local string state for textarea fields to make editing easier
    const [formData, setFormData] = useState({
        date: '',
        internTitle: 'Mr.',
        internName: '',
        designation: '',
        department: '',
        startDate: '',
        endDate: '',
        focusAreas: '',
        projectTitle: '',
        reportingTo: '',
        stipend: '',
        workingHours: '',
        signatory: '',
        projectScopeStr: 'Scope item 1\nScope item 2',
        responsibilitiesStr: 'Responsibility 1\nResponsibility 2',
    });

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

    React.useEffect(() => {
        if (formData.designation) {
            const selectedPosition = positions.find(p => p.name === formData.designation);
            if (selectedPosition && selectedPosition.responsibilities && selectedPosition.responsibilities.length > 0) {
                const formattedRes = selectedPosition.responsibilities.map(r => `• ${r}`).join('\n');
                setFormData(prev => ({ ...prev, responsibilitiesStr: formattedRes }));
            } else {
                setFormData(prev => ({ ...prev, responsibilitiesStr: '' }));
            }
        }
    }, [formData.designation, positions]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Convert strings to arrays and strip bullets if present
        const projectScope = formData.projectScopeStr.split('\n').map(s => s.replace(/^•\s*/, '').trim()).filter(s => s);
        const responsibilities = formData.responsibilitiesStr.split('\n').map(s => s.replace(/^•\s*/, '').trim()).filter(s => s);

        const submitData: InternshipOfferLetterData = {
            date: formData.date,
            internTitle: formData.internTitle,
            internName: formData.internName,
            designation: formData.designation,
            department: formData.department,
            startDate: formData.startDate,
            endDate: formData.endDate,
            focusAreas: formData.focusAreas,
            projectTitle: formData.projectTitle,
            reportingTo: formData.reportingTo,
            stipend: formData.stipend,
            workingHours: formData.workingHours,
            signatory: formData.signatory,
            projectScope,
            responsibilities,
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
                            name="internTitle"
                            value={formData.internTitle || 'Mr.'}
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
                            label="Intern Name"
                            name="internName"
                            type="text"
                            value={formData.internName || ''}
                            onChange={handleChange}
                            required
                        />
                    </div>
                </div>
                <FormSelect
                    label="Department"
                    name="department"
                    value={formData.department || ''}
                    onChange={handleChange}
                    options={departmentOptions}
                    required
                />
                <FormSelect
                    label="Designation"
                    name="designation"
                    value={formData.designation || ''}
                    onChange={handleChange}
                    options={positionOptions}
                    required
                />
                <FormInput
                    label="Start Date"
                    name="startDate"
                    type="date"
                    value={formData.startDate || ''}
                    onChange={handleChange}
                    textTransform="none"
                    required
                />
                <FormInput
                    label="End Date"
                    name="endDate"
                    type="date"
                    value={formData.endDate || ''}
                    onChange={handleChange}
                    textTransform="none"
                    required
                />
                <FormInput
                    label="Focus Areas"
                    name="focusAreas"
                    type="text"
                    value={formData.focusAreas || ''}
                    onChange={handleChange}
                    required
                />
                <FormInput
                    label="Project Title"
                    name="projectTitle"
                    type="text"
                    value={formData.projectTitle || ''}
                    onChange={handleChange}
                    required
                />
                <FormInput
                    label="Reporting To"
                    name="reportingTo"
                    type="text"
                    value={formData.reportingTo || ''}
                    onChange={handleChange}
                    required
                />
                <FormInput
                    label="Stipend Amount"
                    name="stipend"
                    type="number"
                    value={formData.stipend || ''}
                    onChange={handleChange}
                    required
                />
                <FormInput
                    label="Working Hours"
                    name="workingHours"
                    type="text"
                    value={formData.workingHours || ''}
                    onChange={handleChange}
                    required
                />
                <FormInput
                    label="Signatory"
                    name="signatory"
                    type="text"
                    value={formData.signatory || ''}
                    onChange={handleChange}
                    required
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <FormTextarea
                    label="Project Scope (Enter each item on a new line)"
                    name="projectScopeStr"
                    value={formData.projectScopeStr}
                    onChange={handleChange as any}
                    rows={4}
                    required
                />
                <FormTextarea
                    label="Responsibilities (Enter each item on a new line)"
                    name="responsibilitiesStr"
                    value={formData.responsibilitiesStr}
                    onChange={handleChange as any}
                    rows={4}
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
