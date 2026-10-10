import React, { useState } from 'react';
import { FormInput, FormSelect } from '@/components/elements/FormFields';
import {
    EmployeeHandoverFormData,
    HandoverTaskRow,
    HandoverItemRow,
    HandoverFileRow,
    HandoverLoginRow
} from '@/components/templates/forms/EmployeeHandoverFormTemplate';
import { useEmployees } from '@/hooks/employee-hooks/useEmployees';

interface EmployeeHandoverFormProps {
    onSubmit: (data: EmployeeHandoverFormData) => void;
}

export const EmployeeHandoverForm: React.FC<EmployeeHandoverFormProps> = ({ onSubmit }) => {
    const [formData, setFormData] = useState<EmployeeHandoverFormData & { employeeTitle?: string; employeeEmail?: string }>({
        employeeTitle: 'Mr.',
        employeeName: '',
        employeeId: '',
        designation: '',
        department: '',
        reportingManager: '',
        lastWorkingDate: '',
        employeeEmail: '',
        tasks: [{}],
        documents: [
            { item: 'Files / Documents' },
            { item: 'Laptop / System' },
            { item: 'Email / Software Access' },
            { item: 'Other (Specify)' }
        ],
        fileHandover: [{}],
        loginHandover: [{}],
        handedOverByName: '',
        handedOverToName: '',
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

        // Auto-fill employee details when employee is selected
        if (name === 'employeeName') {
            const selected = value ? employees.find(emp => emp.name === value) : null;
            setFormData(prev => ({
                ...prev,
                employeeName: value,
                employeeId: selected?.employeeCode || '',
                designation: selected?.position || '',
                department: selected?.department || '',
                reportingManager: selected?.managerName || '',
                handedOverByName: selected?.name || '',
                employeeEmail: selected?.email || '',
            }));
            return;
        }

        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleTaskChange = (index: number, field: keyof HandoverTaskRow, value: string) => {
        const updated = [...(formData.tasks || [])];
        updated[index] = { ...updated[index], [field]: value };
        setFormData(prev => ({ ...prev, tasks: updated }));
    };

    const handleDocumentChange = (index: number, field: keyof HandoverItemRow, value: string) => {
        const updated = [...(formData.documents || [])];
        updated[index] = { ...updated[index], [field]: value };
        setFormData(prev => ({ ...prev, documents: updated }));
    };

    const handleFileChange = (index: number, field: keyof HandoverFileRow, value: string) => {
        const updated = [...(formData.fileHandover || [])];
        updated[index] = { ...updated[index], [field]: value };
        setFormData(prev => ({ ...prev, fileHandover: updated }));
    };

    const handleLoginChange = (index: number, field: keyof HandoverLoginRow, value: string) => {
        const updated = [...(formData.loginHandover || [])];
        updated[index] = { ...updated[index], [field]: value };
        setFormData(prev => ({ ...prev, loginHandover: updated }));
    };

    const addRow = (type: 'tasks' | 'documents' | 'fileHandover' | 'loginHandover') => {
        setFormData(prev => ({
            ...prev,
            [type]: [...(prev[type] || []), {}]
        }));
    };

    const removeRow = (type: 'tasks' | 'documents' | 'fileHandover' | 'loginHandover', index: number) => {
        setFormData(prev => ({
            ...prev,
            [type]: (prev[type] as any[]).filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            {/* Employee Details Section */}
            <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Employee Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                            <FormSelect label="Employee Name" name="employeeName" value={formData.employeeName} onChange={handleChange} options={employeeOptions} required />
                        </div>
                    </div>
                    <FormInput label="Employee ID" name="employeeId" value={formData.employeeId} onChange={handleChange} required />
                    <FormInput label="Designation" name="designation" value={formData.designation} onChange={handleChange} required />
                    <FormInput label="Department" name="department" value={formData.department} onChange={handleChange} required />
                    <FormInput label="Reporting Manager" name="reportingManager" value={formData.reportingManager} onChange={handleChange} required />
                    <FormInput label="Last Working Date" name="lastWorkingDate" type="date" value={formData.lastWorkingDate} onChange={handleChange} textTransform="none" required />
                </div>
            </div>

            {/* Handover Details Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormInput label="Handed Over By (Name)" name="handedOverByName" value={formData.handedOverByName} onChange={handleChange} />
                <FormInput label="Handed Over To (Name)" name="handedOverToName" value={formData.handedOverToName} onChange={handleChange} />
            </div>

            {/* Tasks Section */}
            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">Work &amp; Responsibility Handover</h3>
                    <button type="button" onClick={() => addRow('tasks')} className="px-3 py-1.5 text-sm bg-brand-blue text-white rounded-lg hover:bg-brand-blue/90">+ Add Task</button>
                </div>
                {(formData.tasks || []).length === 0 ? (
                    <p className="text-sm text-gray-500 dark:text-gray-400 italic p-4 border border-dashed border-gray-300 dark:border-gray-700 rounded-xl text-center">
                        No tasks added. (Click "+ Add Task" to add, or leave empty to exclude this section from the letter)
                    </p>
                ) : (
                    (formData.tasks || []).map((row, index) => (
                        <div key={index} className="p-4 border border-gray-200 dark:border-gray-700 rounded-xl space-y-4 relative">
                            <button type="button" onClick={() => removeRow('tasks', index)} className="absolute top-4 right-4 text-red-500 hover:text-red-700 text-sm font-medium">Remove</button>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                <FormInput label="Task / Responsibility" name="task" value={row.task || ''} onChange={(e) => handleTaskChange(index, 'task', e.target.value)} />
                                <FormInput label="Status (Completed/Pending)" name="status" value={row.status || ''} onChange={(e) => handleTaskChange(index, 'status', e.target.value)} />
                                <FormInput label="Handover To (Name & Dept)" name="handoverTo" value={row.handoverTo || ''} onChange={(e) => handleTaskChange(index, 'handoverTo', e.target.value)} />
                                <FormInput label="Remarks" name="remarks" value={row.remarks || ''} onChange={(e) => handleTaskChange(index, 'remarks', e.target.value)} />
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Documents Section */}
            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">Documents / System / Access Handover</h3>
                    <button type="button" onClick={() => addRow('documents')} className="px-3 py-1.5 text-sm bg-brand-blue text-white rounded-lg hover:bg-brand-blue/90">+ Add Item</button>
                </div>
                {(formData.documents || []).length === 0 ? (
                    <p className="text-sm text-gray-500 dark:text-gray-400 italic p-4 border border-dashed border-gray-300 dark:border-gray-700 rounded-xl text-center">
                        No documents added. (Click "+ Add Item" to add, or leave empty to exclude this section from the letter)
                    </p>
                ) : (
                    (formData.documents || []).map((row, index) => (
                        <div key={index} className="p-4 border border-gray-200 dark:border-gray-700 rounded-xl space-y-4 relative">
                            <button type="button" onClick={() => removeRow('documents', index)} className="absolute top-4 right-4 text-red-500 hover:text-red-700 text-sm font-medium">Remove</button>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                <FormInput label="Item" name="item" value={row.item || ''} onChange={(e) => handleDocumentChange(index, 'item', e.target.value)} />
                                <FormInput label="Handed Over (Yes/No)" name="handedOver" value={row.handedOver || ''} onChange={(e) => handleDocumentChange(index, 'handedOver', e.target.value)} />
                                <FormInput label="Receiver Name" name="receiverName" value={row.receiverName || ''} onChange={(e) => handleDocumentChange(index, 'receiverName', e.target.value)} />
                                <FormInput label="Remarks" name="remarks" value={row.remarks || ''} onChange={(e) => handleDocumentChange(index, 'remarks', e.target.value)} />
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* File Handover Section */}
            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">File / System Handover</h3>
                    <button type="button" onClick={() => addRow('fileHandover')} className="px-3 py-1.5 text-sm bg-brand-blue text-white rounded-lg hover:bg-brand-blue/90">+ Add File/System</button>
                </div>
                {(formData.fileHandover || []).length === 0 ? (
                    <p className="text-sm text-gray-500 dark:text-gray-400 italic p-4 border border-dashed border-gray-300 dark:border-gray-700 rounded-xl text-center">
                        No File / System handover added. (Click "+ Add File/System" to add, or leave empty to exclude this section from the letter)
                    </p>
                ) : (
                    (formData.fileHandover || []).map((row, index) => (
                        <div key={index} className="p-4 border border-gray-200 dark:border-gray-700 rounded-xl space-y-4 relative">
                            <button type="button" onClick={() => removeRow('fileHandover', index)} className="absolute top-4 right-4 text-red-500 hover:text-red-700 text-sm font-medium">Remove</button>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                <FormInput label="System / Access" name="systemAccess" value={row.systemAccess || ''} onChange={(e) => handleFileChange(index, 'systemAccess', e.target.value)} />
                                <FormInput label="Handed Over (Yes/No)" name="handedOver" value={row.handedOver || ''} onChange={(e) => handleFileChange(index, 'handedOver', e.target.value)} />
                                <FormInput label="File Path / Location" name="filePath" value={row.filePath || ''} onChange={(e) => handleFileChange(index, 'filePath', e.target.value)} />
                                <FormInput label="Remarks" name="remarks" value={row.remarks || ''} onChange={(e) => handleFileChange(index, 'remarks', e.target.value)} />
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Login Handover Section */}
            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">Email / Login / Password Handover</h3>
                    <button type="button" onClick={() => addRow('loginHandover')} className="px-3 py-1.5 text-sm bg-brand-blue text-white rounded-lg hover:bg-brand-blue/90">+ Add Login Details</button>
                </div>
                {(formData.loginHandover || []).length === 0 ? (
                    <p className="text-sm text-gray-500 dark:text-gray-400 italic p-4 border border-dashed border-gray-300 dark:border-gray-700 rounded-xl text-center">
                        No login details added. (Click "+ Add Login Details" to add, or leave empty to exclude this section from the letter)
                    </p>
                ) : (
                    (formData.loginHandover || []).map((row, index) => (
                        <div key={index} className="p-4 border border-gray-200 dark:border-gray-700 rounded-xl space-y-4 relative">
                            <button type="button" onClick={() => removeRow('loginHandover', index)} className="absolute top-4 right-4 text-red-500 hover:text-red-700 text-sm font-medium">Remove</button>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                <FormInput label="Email ID / Login ID" name="loginId" value={row.loginId || ''} onChange={(e) => handleLoginChange(index, 'loginId', e.target.value)} />
                                <FormInput label="Handed Over (Yes/No)" name="handedOver" value={row.handedOver || ''} onChange={(e) => handleLoginChange(index, 'handedOver', e.target.value)} />
                                <FormInput label="Password" name="password" value={row.password || ''} onChange={(e) => handleLoginChange(index, 'password', e.target.value)} />
                                <FormInput label="Remarks" name="remarks" value={row.remarks || ''} onChange={(e) => handleLoginChange(index, 'remarks', e.target.value)} />
                            </div>
                        </div>
                    ))
                )}
            </div>

            <div className="flex justify-end pt-4 border-t border-gray-200 dark:border-gray-700">
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
