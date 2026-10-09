import React from 'react';
import { FormInput } from '@/components/elements/FormFields';
import { SalaryAnnexureData } from '@/components/templates/letters/SalaryAnnexureTable';

interface SalaryAnnexureInputProps {
    data: SalaryAnnexureData | null;
    onChange: (data: SalaryAnnexureData | null) => void;
}

export const defaultSalaryAnnexureData: SalaryAnnexureData = {
    basic: { monthly: '', yearly: '' },
    da: { monthly: '', yearly: '' },
    hra: { monthly: '', yearly: '' },
    conveyance: { monthly: '', yearly: '' },
    medical: { monthly: '', yearly: '' },
    mobile: { monthly: '', yearly: '' },
    grossEarnings: { monthly: '', yearly: '' },

    empPf: { monthly: '--', yearly: '--' },
    empEsic: { monthly: '--', yearly: '--' },
    pt: { monthly: '', yearly: '' },
    tds: { monthly: '0', yearly: '0' },
    grossDeduction: { monthly: '', yearly: '' },

    netSalary: { monthly: '', yearly: '' },

    employerPf: { monthly: '--', yearly: '--' },
    employerEsic: { monthly: '--', yearly: '--' },
    gratuity: { monthly: '', yearly: '0' },
    bonus: { monthly: '', yearly: '0' },

    ctc: { monthly: '', yearly: '' },
};

export const SalaryAnnexureInput: React.FC<SalaryAnnexureInputProps> = ({ data, onChange }) => {
    const isEnabled = data !== null;

    const handleToggle = () => {
        onChange(isEnabled ? null : defaultSalaryAnnexureData);
    };

    const handleChange = (field: keyof SalaryAnnexureData, type: 'monthly' | 'yearly', value: string) => {
        if (!data) return;
        onChange({
            ...data,
            [field]: { ...data[field], [type]: value }
        });
    };

    if (!isEnabled) {
        return (
            <div className="py-4">
                <button
                    type="button"
                    onClick={handleToggle}
                    className="px-4 py-2 bg-brand-blue text-white rounded-lg text-sm"
                >
                    + Add Salary Annexure Table
                </button>
            </div>
        );
    }

    const renderField = (label: string, field: keyof SalaryAnnexureData) => (
        <div className="flex gap-4 items-center">
            <div className="w-1/3 text-sm font-medium">{label}</div>
            <div className="flex-1">
                <FormInput
                    label=""
                    name={`${field}-monthly`}
                    type="number"
                    value={data[field].monthly.toString()}
                    onChange={(e) => handleChange(field, 'monthly', e.target.value)}
                    placeholder="Monthly"
                />
            </div>
            <div className="flex-1">
                <FormInput
                    label=""
                    name={`${field}-yearly`}
                    type="number"
                    value={data[field].yearly.toString()}
                    onChange={(e) => handleChange(field, 'yearly', e.target.value)}
                    placeholder="Yearly"
                />
            </div>
        </div>
    );

    return (
        <div className="space-y-6 border border-gray-200 dark:border-gray-700 p-4 rounded-xl mt-4">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold">Salary Annexure Details</h3>
                <button
                    type="button"
                    onClick={handleToggle}
                    className="text-red-500 text-sm font-medium hover:underline"
                >
                    Remove Annexure
                </button>
            </div>

            <div className="space-y-4">
                <h4 className="font-semibold text-brand-blue">Earnings</h4>
                {renderField('Basic', 'basic')}
                {renderField('DA (Dearness Allow)', 'da')}
                {renderField('HRA (House Rent Allow)', 'hra')}
                {renderField('Conveyance Allow', 'conveyance')}
                {renderField('Medical Allow', 'medical')}
                {renderField('Mobile & Other Allow', 'mobile')}
                <div className="bg-blue-50 dark:bg-blue-900/20 p-2 rounded">
                    {renderField('Gross Earnings', 'grossEarnings')}
                </div>
                
                <h4 className="font-semibold text-brand-blue mt-6">Deductions</h4>
                {renderField('Employee PF (12%)', 'empPf')}
                {renderField('Employee ESIC (0.75%)', 'empEsic')}
                {renderField('PT (Professional Tax)', 'pt')}
                {renderField('Income Tax/ TDS', 'tds')}
                <div className="bg-yellow-50 dark:bg-yellow-900/20 p-2 rounded">
                    {renderField('Gross Deduction', 'grossDeduction')}
                </div>

                <div className="bg-green-50 dark:bg-green-900/20 p-2 rounded mt-6">
                    {renderField('Net in Hand Salary', 'netSalary')}
                </div>

                <h4 className="font-semibold text-brand-blue mt-6">Employer Contributions</h4>
                {renderField('Employer PF (13%)', 'employerPf')}
                {renderField('Employer ESIC (3.25%)', 'employerEsic')}
                {renderField('Gratuity', 'gratuity')}
                {renderField('Satuatory Bonus', 'bonus')}

                <div className="bg-blue-50 dark:bg-blue-900/20 p-2 rounded mt-6">
                    {renderField('Total CTC', 'ctc')}
                </div>
            </div>
        </div>
    );
};
