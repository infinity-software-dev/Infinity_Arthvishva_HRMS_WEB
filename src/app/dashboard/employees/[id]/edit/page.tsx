"use client";

import { use, useState, useEffect } from 'react';
import { Loader2, ExternalLink, ArrowLeft } from 'lucide-react';
import PageTitleHeader from '@/components/elements/PageTitleHeader';
import { FileInputField, FormInput, FormSelect } from '@/components/elements/FormFields';
import GradientButton from '@/components/buttons/GradientButton';
import { useEditEmployee } from '@/hooks/employee-hooks/useEditEmployee';
import { DEPARTMENTS, GRADUATION_COURSES, POSITIONS, POST_GRADUATION_COURSES } from '@/hooks/employee-hooks/useAddEmployee';
import apiClient from '@/constants/API/client';
import { KYC_API } from '@/constants/API/api';
import { employeeService } from '@/services/employee.service';

// Helper component to show existing files above your FileInputField
const FileSlot = ({ label, fileKey, existingUrl, onChange }: { label: string, fileKey: string, existingUrl?: string, onChange: any }) => (
    <div className="flex flex-col gap-1.5 w-full min-w-0 max-w-full">
        <div className="flex justify-between items-end gap-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate">{label}</span>
            {existingUrl && (
                <a href={existingUrl} target="_blank" rel="noopener noreferrer" className="text-xs flex items-center gap-1 text-brand-blue hover:underline font-semibold shrink-0">
                    <ExternalLink size={12} /> View Current
                </a>
            )}
        </div>
        <FileInputField label="" onChange={(e) => onChange(e, fileKey)} />
    </div>
);

export default function EditEmployeePage({ params }: { params: Promise<{ id: string }> | { id: string } }) {
    const resolvedParams = 'then' in params ? use(params) : params;
    const { id } = resolvedParams;

    const {
        formData, setFormData, existingUrls, errors, isLoading, isSubmitting, managerOptions,
        handleChange, handleAddressChange, handleFileChange, handleSyncAddresses, handleSubmit, handleBack,
    } = useEditEmployee(id);

    // ── KYC States ──
    const [aadhaarOtpSent, setAadhaarOtpSent] = useState(false);
    const [aadhaarReferenceId, setAadhaarReferenceId] = useState('');
    const [aadhaarOtp, setAadhaarOtp] = useState('');
    const [aadhaarVerified, setAadhaarVerified] = useState(false);
    const [aadhaarLoading, setAadhaarLoading] = useState(false);
    const [aadhaarError, setAadhaarError] = useState('');
    const [aadhaarRegisteredName, setAadhaarRegisteredName] = useState('');
    const [panName, setPanName] = useState('');
    const [panDob, setPanDob] = useState('');
    const [panVerified, setPanVerified] = useState(false);
    const [panLoading, setPanLoading] = useState(false);
    const [panError, setPanError] = useState('');
    const [bankVerified, setBankVerified] = useState(false);
    const [bankLoading, setBankLoading] = useState(false);
    const [bankError, setBankError] = useState('');
    const [bankRegisteredName, setBankRegisteredName] = useState('');

    // Sync verification status and fields from loaded employee data
    useEffect(() => {
        if (formData.aadhaarVerified) {
            setAadhaarVerified(true);
            const nameToDisplay = formData.aadhaarName || formData.name || '';
            if (nameToDisplay) {
                setAadhaarRegisteredName(nameToDisplay);
            }
        } else if (formData.aadhaarName) {
            setAadhaarRegisteredName(formData.aadhaarName);
        }
        if (formData.panVerified) {
            setPanVerified(true);
        }
        if (formData.panName) {
            setPanName(formData.panName);
        } else if (formData.panVerified && formData.name) {
            setPanName(formData.name);
        }
        if (formData.panDob) {
            setPanDob(formData.panDob);
        }
        if (formData.bankVerified) {
            setBankVerified(true);
            if (formData.accountHolderName) {
                setBankRegisteredName(formData.accountHolderName);
            }
        }
    }, [formData.aadhaarVerified, formData.aadhaarName, formData.name, formData.panVerified, formData.panName, formData.panDob, formData.bankVerified, formData.accountHolderName]);

    const handleSendAadhaarOtp = async () => {
        setAadhaarError('');
        if (!/^\d{12}$/.test(String(formData.aadhaarNumber))) { setAadhaarError('Aadhaar must be 12 digits.'); return; }
        try {
            setAadhaarLoading(true);
            const res = await apiClient.post(KYC_API.AADHAAR_SEND_OTP, { aadhaar_number: String(formData.aadhaarNumber) });
            setAadhaarReferenceId(res.data?.reference_id || '');
            setAadhaarOtpSent(true);
        } catch (err: any) {
            setAadhaarError(err?.response?.data?.message || 'Failed to send OTP.');
        } finally { setAadhaarLoading(false); }
    };

    const handleVerifyAadhaarOtp = async () => {
        setAadhaarError('');
        if (!aadhaarOtp.trim()) { setAadhaarError('Please enter the OTP.'); return; }
        try {
            setAadhaarLoading(true);
            const res = await apiClient.post(KYC_API.AADHAAR_VERIFY_OTP, {
                reference_id: aadhaarReferenceId,
                otp: aadhaarOtp,
                employee_name: formData.name?.trim(),
            });

            const verifiedName = res.data?.verified_name || res.data?.data?.name || res.data?.data?.full_name || res.data?.data?.user_name || formData.name?.trim() || '';
            if (verifiedName) {
                setAadhaarRegisteredName(verifiedName);
            }

            setAadhaarVerified(true);
            setFormData(prev => ({
                ...prev,
                aadhaarVerified: true,
                aadhaarName: verifiedName,
            }));

            // Instantly save to database so refresh won't remove verification
            await employeeService.updateKycStatus(id, {
                aadhaarVerified: true,
                aadhaarNumber: String(formData.aadhaarNumber),
                aadhaarName: verifiedName,
            });
        } catch (err: any) {
            setAadhaarError(err?.response?.data?.message || 'OTP verification failed.');
        } finally { setAadhaarLoading(false); }
    };

    const handleVerifyPan = async () => {
        setPanError('');
        if (!panName.trim()) { setPanError('Please enter name as per PAN.'); return; }
        if (!panDob) { setPanError('Please enter date of birth.'); return; }
        try {
            setPanLoading(true);
            const [y, m, d] = panDob.split('-');
            await apiClient.post(KYC_API.PAN_VERIFY, {
                pan: String(formData.panNumber).trim().toUpperCase(),
                name_as_per_pan: panName.trim().toUpperCase(),
                date_of_birth: `${d}/${m}/${y}`,
            });
            setPanVerified(true);
            setFormData(prev => ({
                ...prev,
                panVerified: true,
                panName,
                panDob,
            }));

            // Instantly save to database so refresh won't remove verification
            await employeeService.updateKycStatus(id, {
                panVerified: true,
                panNumber: String(formData.panNumber),
                panName,
                panDob,
            });
        } catch (err: any) {
            setPanError(err?.response?.data?.message || 'PAN verification failed.');
        } finally { setPanLoading(false); }
    };

    const handleVerifyBank = async () => {
        setBankError('');
        if (!formData.accountNumber || !String(formData.accountNumber).trim()) {
            setBankError('Please enter Account Number.');
            return;
        }
        if (!formData.ifsc || !String(formData.ifsc).trim()) {
            setBankError('Please enter IFSC Code.');
            return;
        }

        try {
            setBankLoading(true);
            const res = await apiClient.post(KYC_API.BANK_VERIFY, {
                account_number: String(formData.accountNumber).trim(),
                ifsc: String(formData.ifsc).trim().toUpperCase(),
                account_holder_name: formData.accountHolderName?.trim() || '',
            });

            const result = res.data?.data ?? res.data;
            const regName = result?.registered_name || result?.name_at_bank || result?.account_holder_name || '';
            if (regName) {
                setBankRegisteredName(regName);
            }
            if (result?.bank_name && !formData.bankName) {
                setFormData(prev => ({ ...prev, bankName: result.bank_name }));
            }
            if (result?.branch && !formData.branch) {
                setFormData(prev => ({ ...prev, branch: result.branch }));
            }

            setBankVerified(true);
            setFormData(prev => ({ ...prev, bankVerified: true }));

            // Instantly save to database so refresh won't remove verification
            await employeeService.updateKycStatus(id, {
                bankVerified: true,
                accountNumber: String(formData.accountNumber).trim(),
                ifsc: String(formData.ifsc).trim().toUpperCase(),
                accountHolderName: formData.accountHolderName,
                bankName: formData.bankName,
                branch: formData.branch,
            });
        } catch (err: any) {
            setBankError(err?.response?.data?.message || 'Bank account verification failed.');
        } finally {
            setBankLoading(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center p-24 space-y-4">
                <Loader2 className="w-8 h-8 animate-spin text-brand-blue" />
                <p className="text-sm font-medium text-gray-500">Loading Employee Data...</p>
            </div>
        );
    }

    return (
        <div className="p-8">

            <PageTitleHeader
                title="Edit Employee Profile"
                description="Update team member details, roles, and uploaded documents."
            />

            <button
                onClick={handleBack}
                className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-800 dark:hover:text-white transition-colors cursor-pointer"
            >
                <ArrowLeft className="w-4 h-4" /> Back to View
            </button>

            <form onSubmit={handleSubmit} className="mt-6 w-full mx-auto bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-sm p-8 space-y-10">

                {/* 1. Basic Details */}
                <section>
                    <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">Basic Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                        <FormInput name="employeeCode" label="Employee Code" value={formData.employeeCode} disabled textTransform="uppercase" />
                        <FormInput name="name" label="Full Name" value={formData.name} onChange={handleChange} error={errors.name} required textTransform="uppercase" />
                        <FormInput name="email" label="Email Address" type="email" value={formData.email} onChange={handleChange} error={errors.email} textTransform="lowercase" required />
                        <FormInput name="mobileNumber" label="Mobile Number" value={formData.mobileNumber} onChange={handleChange} error={errors.mobileNumber} required />
                        <FormInput name="alternateMobileNumber" label="Alternate Mobile" value={formData.alternateMobileNumber} onChange={handleChange} />
                        <FormSelect name="status" label="Account Status" value={formData.status} onChange={handleChange} options={[{ label: 'Active', value: 'Active' }, { label: 'Inactive', value: 'Inactive' }]} required />
                    </div>

                    <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-5 p-4 bg-orange-50 dark:bg-gray-800/50 rounded-xl border border-orange-100 dark:border-gray-700">
                        <div className="md:col-span-2 text-xs font-semibold text-orange-600 dark:text-orange-400">Leave blank to keep existing password.</div>
                        <FormInput name="password" label="New Password" type="password" value={formData.password} onChange={handleChange} error={errors.password} textTransform="none" />
                        <FormInput name="confirmPassword" label="Confirm New Password" type="password" value={formData.confirmPassword} onChange={handleChange} error={errors.confirmPassword} textTransform="none" />
                    </div>
                </section>

                {/* 2. Personal Details */}
                <section>
                    <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">Personal Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-6 items-end">
                        <FileSlot label="Profile Photo" fileKey="profileImage" existingUrl={existingUrls.profileImage} onChange={handleFileChange} />
                        <FormSelect name="gender" label="Gender" value={formData.gender} onChange={handleChange} options={[{ label: 'Male', value: 'Male' }, { label: 'Female', value: 'Female' }, { label: 'Other', value: 'Other' }]} required />
                        <FormInput name="fatherName" label="Father's Name" value={formData.fatherName} onChange={handleChange} />
                        <FormInput name="motherName" label="Mother's Name" value={formData.motherName} onChange={handleChange} />
                        <FormInput name="dateOfBirth" label="Date of Birth" type="date" value={formData.dateOfBirth} onChange={handleChange} textTransform="none" required />
                        <FormSelect name="bloodGroup" label="Blood Group" value={formData.bloodGroup} onChange={handleChange} options={['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => ({ label: bg, value: bg }))} />
                        <FormSelect name="maritalStatus" label="Marital Status" value={formData.maritalStatus} onChange={handleChange} options={['Single', 'Married', 'Divorced', 'Widowed'].map(s => ({ label: s, value: s }))} />
                    </div>

                    <h4 className="text-md font-semibold text-gray-700 dark:text-gray-400 mb-3">Current Address</h4>
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                        <div className="md:col-span-2">
                            <FormInput name="currentAddress" label="Street Address" value={formData.address.current.address} onChange={(e) => handleAddressChange('current', 'address', e.target.value)} textTransform="none" required />
                        </div>
                        <FormInput name="currentPin" label="Pin Code" value={formData.address.current.pinCode} onChange={(e) => handleAddressChange('current', 'pinCode', e.target.value)} type="number" required />
                        <FormInput name="currentState" label="State" value={formData.address.current.state} onChange={(e) => handleAddressChange('current', 'state', e.target.value)} required />
                        <FormInput name="currentDistrict" label="District" value={formData.address.current.district} onChange={(e) => handleAddressChange('current', 'district', e.target.value)} required />
                        <FormInput name="currentCity" label="City" value={formData.address.current.city} onChange={(e) => handleAddressChange('current', 'city', e.target.value)} required />
                    </div>

                    <div className="flex items-center space-x-2 my-5 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700">
                        <input type="checkbox" id="syncAddress" onChange={handleSyncAddresses} className="w-4 h-4 rounded text-brand-blue focus:ring-brand-blue" />
                        <label htmlFor="syncAddress" className="text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer">Permanent address same as current address</label>
                    </div>

                    <h4 className="text-md font-semibold text-gray-700 dark:text-gray-400 mb-3">Permanent Address</h4>
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                        <div className="md:col-span-2">
                            <FormInput name="permanentAddress" label="Street Address" value={formData.address.permanent.address} onChange={(e) => handleAddressChange('permanent', 'address', e.target.value)} textTransform="none" required />
                        </div>
                        <FormInput name="permanentPin" label="Pin Code" value={formData.address.permanent.pinCode} onChange={(e) => handleAddressChange('permanent', 'pinCode', e.target.value)} type="number" required />
                        <FormInput name="permanentState" label="State" value={formData.address.permanent.state} onChange={(e) => handleAddressChange('permanent', 'state', e.target.value)} required />
                        <FormInput name="permanentDistrict" label="District" value={formData.address.permanent.district} onChange={(e) => handleAddressChange('permanent', 'district', e.target.value)} required />
                        <FormInput name="permanentCity" label="City" value={formData.address.permanent.city} onChange={(e) => handleAddressChange('permanent', 'city', e.target.value)} required />
                    </div>
                </section>

                {/* 3. Job Details */}
                <section>
                    <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">Job Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
                        <FormInput name="joiningDate" label="Joining Date" type="date" value={formData.joiningDate} onChange={handleChange} textTransform="none" required />
                        <FormSelect
                            name="role"
                            label="Role (Access Level)"
                            error={errors.role}
                            value={formData.role}
                            onChange={handleChange}
                            options={[
                                { label: 'Employee', value: 'Employee' },
                                { label: 'Intern', value: 'Intern' }
                            ]}
                            required
                        />
                        {formData.role === 'Employee' && (
                            <FormInput
                                name="employmentDate"
                                label="Employment Date"
                                type="date"
                                value={formData.employmentDate}
                                onChange={handleChange}
                                error={errors.employmentDate}
                                textTransform="none"
                                required
                            />
                        )}
                        <FormSelect name="department" label="Department" value={formData.department} onChange={handleChange} options={DEPARTMENTS.map(d => ({ label: d, value: d }))} required />
                        <FormSelect name="position" label="Position" value={formData.position} onChange={handleChange} options={POSITIONS.map(p => ({ label: p, value: p }))} required />
                        <FormSelect name="managerId" label="Reporting Manager" value={formData.managerId} onChange={handleChange} options={managerOptions} required />
                        <FormInput name="salary" label="Base Salary (₹)" type="number" value={formData.salary} onChange={handleChange} textTransform="none" required />
                        <FormInput name="fixedAllowance" label="Fixed Allowance (₹)" type="number" value={formData.fixedAllowance} onChange={handleChange} textTransform="none" />
                        <div className="flex items-center space-x-2 mt-7">
                            <input type="checkbox" id="isLeadershipRole" name="isLeadershipRole" checked={formData.isLeadershipRole} onChange={handleChange} className="w-4 h-4 rounded text-brand-blue" />
                            <label htmlFor="isLeadershipRole" className="text-sm font-medium text-gray-700">Leadership Role</label>
                        </div>
                    </div>
                </section>

                {/* 4. Experience & Education */}
                <section>
                    <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">Experience & Education</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-5 items-end">
                        <FormSelect name="experienceType" label="Experience Level" value={formData.experienceType} onChange={handleChange} options={[{ label: 'Fresher', value: 'Fresher' }, { label: 'Experienced', value: 'Experienced' }]} />
                        {formData.experienceType === 'Experienced' && (
                            <>
                                <FormInput name="totalExperienceYears" label="Total Experience (Years)" type="number" value={formData.totalExperienceYears} onChange={handleChange} textTransform="none" />
                                <FormInput name="lastCompanyName" label="Last Company Name" value={formData.lastCompanyName} onChange={handleChange} />
                                <FileSlot label="Experience Certificate" fileKey="experienceCertificate" existingUrl={existingUrls.experienceCertificate} onChange={handleFileChange} />
                            </>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-5 items-end border-t border-gray-100 dark:border-gray-800 pt-5">
                        <FormInput name="hscPercent" label="12th Score (%)" type="number" value={formData.hscPercent} onChange={handleChange} textTransform="none" required />
                        <FileSlot label="12th Marksheet" fileKey="twelfthMarksheet" existingUrl={existingUrls.twelfthMarksheet} onChange={handleFileChange} />
                        <FileSlot label="10th Marksheet" fileKey="tenthMarksheet" existingUrl={existingUrls.tenthMarksheet} onChange={handleFileChange} />
                        <FormSelect name="graduationCourse" label="Graduation Course" value={formData.graduationCourse} onChange={handleChange} options={GRADUATION_COURSES.map(p => ({ label: p, value: p }))} />
                        <FormInput name="graduationPercent" label="Graduation Score (%)" type="number" value={formData.graduationPercent} onChange={handleChange} textTransform="none" />
                        <FileSlot label="Graduation Marksheet" fileKey="graduationMarksheet" existingUrl={existingUrls.graduationMarksheet} onChange={handleFileChange} />
                        <FormSelect name="postGraduationCourse" label="Post-Graduation Course" value={formData.postGraduationCourse} onChange={handleChange} options={POST_GRADUATION_COURSES.map(p => ({ label: p, value: p }))} />
                        <FormInput name="postGraduationPercent" label="Post-Graduation Score (%)" type="number" value={formData.postGraduationPercent} onChange={handleChange} textTransform="none" />
                        <FileSlot label="Post-Graduation Marksheet" fileKey="postGraduationMarksheet" existingUrl={existingUrls.postGraduationMarksheet} onChange={handleFileChange} />
                    </div>
                </section>

                {/* 5. Documents & Bank */}
                <section>
                    <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-5 border-b border-gray-200 dark:border-gray-700 pb-2">Identity & Banking</h3>

                    {/* ── Aadhaar Card ── */}
                    <div className={`mb-5 p-5 rounded-2xl border transition-all overflow-hidden ${aadhaarVerified ? 'bg-emerald-50/30 dark:bg-emerald-950/10 border-emerald-200 dark:border-emerald-800' : 'bg-white dark:bg-gray-900/40 border-gray-100 dark:border-gray-800'} shadow-sm`}>
                        <div className="flex flex-wrap items-end gap-6">
                            <div className="w-full sm:flex-1 min-w-0 max-w-full">
                                <div className="flex items-center justify-between">
                                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Aadhaar Number <span className="text-red-500">*</span>
                                    </label>
                                    {aadhaarVerified && (
                                        <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                                            🔒 Locked
                                        </span>
                                    )}
                                </div>
                                <input
                                    name="aadhaarNumber"
                                    value={formData.aadhaarNumber}
                                    onChange={handleChange}
                                    type="text"
                                    inputMode="numeric"
                                    pattern="[0-9]*"
                                    maxLength={12}
                                    placeholder="XXXX XXXX XXXX"
                                    disabled={aadhaarVerified}
                                    readOnly={aadhaarVerified}
                                    className="mt-2 w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-blue disabled:bg-gray-100 dark:disabled:bg-gray-800/60 disabled:text-gray-500 disabled:cursor-not-allowed transition-all"
                                />
                            </div>

                            <div className="flex gap-2 items-center pb-0.5">
                                {aadhaarVerified ? (
                                    <span className="flex items-center gap-1 px-5 py-3 rounded-xl bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-sm font-semibold border border-green-200 dark:border-green-800">
                                        ✓ Verified
                                    </span>
                                ) : !aadhaarOtpSent ? (
                                    <button type="button" onClick={handleSendAadhaarOtp} disabled={aadhaarLoading}
                                        className="px-6 py-3 rounded-xl bg-teal-500 hover:bg-teal-600 disabled:opacity-50 text-white text-sm font-semibold whitespace-nowrap transition-colors cursor-pointer">
                                        {aadhaarLoading ? 'Sending...' : 'Get OTP'}
                                    </button>
                                ) : (
                                    <>
                                        <input value={aadhaarOtp} onChange={e => setAadhaarOtp(e.target.value)}
                                            inputMode="numeric" maxLength={6} placeholder="Enter OTP"
                                            className="w-28 px-3 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-sm focus:outline-none" />
                                        <button type="button" onClick={handleVerifyAadhaarOtp} disabled={aadhaarLoading}
                                            className="px-6 py-3 rounded-xl bg-teal-500 hover:bg-teal-600 disabled:opacity-50 text-white text-sm font-semibold whitespace-nowrap transition-colors cursor-pointer">
                                            {aadhaarLoading ? 'Verifying...' : 'Verify OTP'}
                                        </button>
                                    </>
                                )}
                            </div>

                            <div className="w-full sm:flex-1 min-w-0 max-w-full">
                                <FileSlot label="Aadhaar Scan" fileKey="aadhaarFile" existingUrl={existingUrls.aadhaarFile} onChange={handleFileChange} />
                            </div>
                        </div>
                        {aadhaarError && <p className="text-xs text-red-500 mt-2">{aadhaarError}</p>}
                        {(aadhaarRegisteredName || (aadhaarVerified && (formData.aadhaarName || formData.name))) && (
                            <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium mt-2">
                                ✓ Name verified as per Aadhaar: <strong>{aadhaarRegisteredName || formData.aadhaarName || formData.name}</strong>
                            </p>
                        )}
                        {aadhaarOtpSent && !aadhaarVerified && (
                            <div className="flex items-center justify-between mt-2">
                                <p className="text-xs text-gray-500">OTP sent to Aadhaar-linked mobile number.</p>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setAadhaarOtpSent(false);
                                        setAadhaarOtp('');
                                        setAadhaarError('');
                                        setAadhaarReferenceId('');
                                    }}
                                    className="text-xs font-semibold text-brand-blue hover:underline cursor-pointer"
                                >
                                    Change Aadhaar Number / Resend OTP
                                </button>
                            </div>
                        )}
                    </div>

                    {/* ── PAN Card ── */}
                    <div className={`mb-6 p-5 rounded-2xl border transition-all overflow-hidden ${panVerified ? 'bg-emerald-50/30 dark:bg-emerald-950/10 border-emerald-200 dark:border-emerald-800' : 'bg-white dark:bg-gray-900/40 border-gray-100 dark:border-gray-800'} shadow-sm`}>
                        <div className="flex flex-wrap items-end gap-6">
                            <div className="w-full sm:w-44 min-w-0">
                                <div className="flex items-center justify-between">
                                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                        PAN Number <span className="text-red-500">*</span>
                                    </label>
                                    {panVerified && (
                                        <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                                            🔒 Locked
                                        </span>
                                    )}
                                </div>
                                <input name="panNumber" value={formData.panNumber} onChange={handleChange}
                                    placeholder="ABCDE1234G" maxLength={10}
                                    disabled={panVerified}
                                    readOnly={panVerified}
                                    style={{ textTransform: 'uppercase' }}
                                    className="mt-2 w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-blue disabled:bg-gray-100 dark:disabled:bg-gray-800/60 disabled:text-gray-500 disabled:cursor-not-allowed transition-all" />
                            </div>

                            <div className="w-full sm:flex-1 min-w-0 max-w-full">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Name as per PAN</label>
                                <input value={panName} onChange={e => setPanName(e.target.value.toUpperCase())} placeholder="FULL NAME ON PAN CARD" disabled={panVerified} readOnly={panVerified}
                                    style={{ textTransform: 'uppercase' }}
                                    className="mt-2 w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue disabled:bg-gray-100 dark:disabled:bg-gray-800/60 disabled:text-gray-500 disabled:cursor-not-allowed transition-all" />
                            </div>

                            <div className="w-full sm:w-44 min-w-0">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Date of Birth</label>
                                <input type="date" value={panDob} onChange={e => setPanDob(e.target.value)} disabled={panVerified} readOnly={panVerified}
                                    className="mt-2 w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue disabled:bg-gray-100 dark:disabled:bg-gray-800/60 disabled:text-gray-500 disabled:cursor-not-allowed transition-all" />
                            </div>

                            <div className="pb-0.5">
                                {!panVerified ? (
                                    <button type="button" onClick={handleVerifyPan} disabled={panLoading}
                                        className="px-6 py-3 rounded-xl bg-teal-500 hover:bg-teal-600 disabled:opacity-50 text-white text-sm font-semibold whitespace-nowrap transition-colors cursor-pointer">
                                        {panLoading ? 'Verifying...' : 'Verify'}
                                    </button>
                                ) : (
                                    <span className="flex items-center gap-1 px-5 py-3 rounded-xl bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-sm font-semibold border border-green-200 dark:border-green-800">✓ Verified</span>
                                )}
                            </div>

                            <div className="w-full sm:flex-1 min-w-0 max-w-full">
                                <FileSlot label="PAN Scan" fileKey="panFile" existingUrl={existingUrls.panFile} onChange={handleFileChange} />
                            </div>
                        </div>
                        {panError && <p className="text-xs text-red-500 mt-2">{panError}</p>}
                    </div>

                    {/* ── Bank Account Verification ── */}
                    <div className={`p-5 rounded-2xl border transition-all overflow-hidden ${bankVerified ? 'bg-emerald-50/30 dark:bg-emerald-950/10 border-emerald-200 dark:border-emerald-800' : 'bg-white dark:bg-gray-900/40 border-gray-100 dark:border-gray-800'} shadow-sm`}>
                        <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-100 dark:border-gray-800">
                            <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200">Bank Account Details</h4>
                            {bankVerified && (
                                <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                                    🔒 Locked
                                </span>
                            )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-end">
                            <FormInput name="accountHolderName" label="Account Holder Name" value={formData.accountHolderName} onChange={handleChange} required />
                            <FormInput name="accountNumber" label="Account Number" type="number" value={formData.accountNumber} onChange={handleChange} disabled={bankVerified} textTransform="none" required />
                            <FormInput name="ifsc" label="IFSC Code" value={formData.ifsc} onChange={handleChange} disabled={bankVerified} textTransform="uppercase" required />
                            <FormInput name="bankName" label="Bank Name" value={formData.bankName} onChange={handleChange} required />
                            <FormInput name="branch" label="Branch Name" value={formData.branch} onChange={handleChange} required />
                            <div className="w-full min-w-0 max-w-full">
                                <FileSlot label="Passbook/Cheque Copy" fileKey="passbookFile" existingUrl={existingUrls.passbookFile} onChange={handleFileChange} />
                            </div>
                        </div>

                        <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800 flex flex-wrap items-center justify-between gap-3">
                            <div>
                                {bankError && <p className="text-xs text-red-500 font-medium">{bankError}</p>}
                                {bankRegisteredName && (
                                    <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                                        ✓ Name verified as per bank: <strong>{bankRegisteredName}</strong>
                                    </p>
                                )}
                            </div>

                            <div>
                                {!bankVerified ? (
                                    <button
                                        type="button"
                                        onClick={handleVerifyBank}
                                        disabled={bankLoading}
                                        className="px-6 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-600 disabled:opacity-50 text-white text-sm font-semibold whitespace-nowrap transition-colors cursor-pointer"
                                    >
                                        {bankLoading ? 'Verifying Account...' : 'Verify Bank Account'}
                                    </button>
                                ) : (
                                    <span className="flex items-center gap-1 px-5 py-2.5 rounded-xl bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-sm font-semibold border border-green-200 dark:border-green-800">
                                        ✓ Bank Account Verified
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                </section>

                {/* 6. Health & Emergency */}
                <section>
                    <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">Health & Emergency</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-5 items-end">
                        <FormSelect name="hasDisease" label="Any Known Disease?" value={formData.hasDisease} onChange={handleChange} options={[{ label: 'Yes', value: 'Yes' }, { label: 'No', value: 'No' }]} />
                        {formData.hasDisease === 'Yes' && (
                            <>
                                <FormInput name="diseaseName" label="Disease Name" value={formData.diseaseName} onChange={handleChange} textTransform="none" />
                                <FormInput name="diseaseType" label="Disease Type" value={formData.diseaseType} onChange={handleChange} textTransform="none" />
                                <FormInput name="diseaseSince" label="Disease Since (Year)" type="number" value={formData.diseaseSince} onChange={handleChange} textTransform="none" />
                                <FormInput name="medicinesRequired" label="Medicines Required" value={formData.medicinesRequired} onChange={handleChange} textTransform="none" />
                                <FormInput name="doctorName" label="Doctor Name" value={formData.doctorName} onChange={handleChange} textTransform="none" />
                                <FormInput name="doctorContact" label="Doctor Contact" type="number" value={formData.doctorContact} onChange={handleChange} textTransform="none" />
                                <FileSlot label="Medical Document" fileKey="medicalDocument" existingUrl={existingUrls.medicalDocument} onChange={handleFileChange} />
                            </>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5 border-t border-gray-100 dark:border-gray-800 pt-5">
                        <FormInput name="emergencyContactName" label="Emergency Contact Name" value={formData.emergencyContactName} onChange={handleChange} required />
                        <FormInput name="emergencyContactRelationship" label="Relationship" value={formData.emergencyContactRelationship} onChange={handleChange} textTransform="none" />
                        <FormInput name="emergencyContactMobile" label="Emergency Mobile Number" type="number" value={formData.emergencyContactMobile} onChange={handleChange} textTransform="none" required />
                        <FormInput name="emergencyContactAddress" label="Address" value={formData.emergencyContactAddress} onChange={handleChange} textTransform="none" />
                    </div>
                </section>

                <div className="pt-6 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-4">
                    <button type="button" onClick={() => window.history.back()} className="px-6 py-2.5 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200">
                        Cancel
                    </button>
                    <GradientButton type="submit" disabled={isSubmitting}>
                        {isSubmitting ? "Updating..." : "Update Profile"}
                    </GradientButton>
                </div>
            </form>
        </div>
    );
}