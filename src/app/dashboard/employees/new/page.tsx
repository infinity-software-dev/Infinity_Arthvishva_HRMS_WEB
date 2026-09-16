"use client";

import PageTitleHeader from '@/components/elements/PageTitleHeader';
import { FileInputField, FormInput, FormSelect } from '@/components/elements/FormFields';
import GradientButton from '@/components/buttons/GradientButton';
import { useAddEmployee, DEPARTMENTS, GRADUATION_COURSES, POSITIONS, POST_GRADUATION_COURSES } from '@/hooks/employee-hooks/useAddEmployee';
import { ArrowLeft } from 'lucide-react';

// Helper component for file inputs in Identity & Banking
const FileSlot = ({ label, fileKey, onChange }: { label: string; fileKey: string; onChange: any }) => (
    <div className="flex flex-col gap-1.5 w-full min-w-0 max-w-full">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate">{label}</span>
        {/* Added accept="image/*" to enforce image-only uploads everywhere */}
        <FileInputField label="" accept="image/*" onChange={(e) => onChange(e, fileKey)} />
    </div>
);

export default function AddEmployeePage() {
    const {
        formData, setFormData, errors, isSubmitting, managerOptions,
        handleChange, handleAddressChange, handleFileChange, handleSyncAddresses, handleSubmit, handleBack,

        // Destructured KYC state
        aadhaarOtpSent, setAadhaarOtpSent, aadhaarOtp, setAadhaarOtp,
        aadhaarVerified, aadhaarLoading, aadhaarError, aadhaarRegisteredName, setAadhaarReferenceId, setAadhaarError,
        handleSendAadhaarOtp, handleVerifyAadhaarOtp,
        panName, setPanName, panDob, setPanDob, panVerified, panLoading, panError, handleVerifyPan,
        bankVerified, bankLoading, bankError, bankRegisteredName, handleVerifyBank
    } = useAddEmployee();

    return (
        <div className="p-8">
            <PageTitleHeader
                title="Onboard New Employee"
                description="Add new team members, roles, and view detailed profiles."
            />

            <button
                onClick={handleBack}
                className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-800 dark:hover:text-white transition-colors cursor-pointer"
            >
                <ArrowLeft className="w-4 h-4" /> Back to List
            </button>

            <form onSubmit={handleSubmit} className="mt-6 w-full mx-auto bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-sm p-8 space-y-10">

                {/* 1. Basic Details */}
                <section>
                    <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">Basic Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                        <FormInput name="employeeCode" label="Employee Code" value={formData.employeeCode} onChange={handleChange} disabled textTransform="uppercase" required />
                        <FormInput name="name" label="Full Name" value={formData.name} onChange={handleChange} error={errors.name} textTransform="uppercase" placeholder="John Doe" required />
                        <FormInput name="email" label="Email Address" type="email" value={formData.email} onChange={handleChange} error={errors.email} textTransform="lowercase" placeholder="user@example.com" required />
                        <FormInput name="mobileNumber" label="Mobile Number" value={formData.mobileNumber} onChange={handleChange} error={errors.mobileNumber} placeholder='9876543210' required />
                        <FormInput name="alternateMobileNumber" label="Alternate Mobile Number" value={formData.alternateMobileNumber} onChange={handleChange} error={errors.alternateMobileNumber} placeholder='9876543210' />
                        <FormInput name="password" label="Password" type="password" value={formData.password} onChange={handleChange} error={errors.password} textTransform="none" placeholder="******" required />
                        <FormInput name="confirmPassword" label="Confirm Password" type="password" value={formData.confirmPassword} onChange={handleChange} error={errors.confirmPassword} textTransform="none" placeholder="******" required />
                    </div>
                </section>

                {/* 2. Personal Details */}
                <section>
                    <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">Personal Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-6">
                        <FileSlot label="Profile Photo" fileKey="profileImage" onChange={handleFileChange} />
                        <FormSelect name="gender" label="Gender" error={errors.gender} value={formData.gender} onChange={handleChange} options={[{ label: 'Male', value: 'Male' }, { label: 'Female', value: 'Female' }, { label: 'Other', value: 'Other' }]} required />
                        <FormInput name="fatherName" label="Father's Name" value={formData.fatherName} textTransform="uppercase" onChange={handleChange} placeholder="John Doe" required />
                        <FormInput name="motherName" label="Mother's Name" value={formData.motherName} textTransform="uppercase" onChange={handleChange} placeholder="Jane Doe" required />
                        <FormInput name="dateOfBirth" label="Date of Birth" error={errors.dateOfBirth} type="date" value={formData.dateOfBirth} onChange={handleChange} textTransform="none" required />
                        <FormSelect name="bloodGroup" label="Blood Group" value={formData.bloodGroup} onChange={handleChange} options={['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => ({ label: bg, value: bg }))} required />
                        <FormSelect name="maritalStatus" label="Marital Status" value={formData.maritalStatus} onChange={handleChange} options={['Single', 'Married', 'Divorced', 'Widowed'].map(s => ({ label: s, value: s }))} />
                    </div>

                    <h4 className="text-md font-semibold text-gray-700 dark:text-gray-400 mb-3">Current Address</h4>
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                        <div className="md:col-span-2">
                            <FormInput name="currentAddress" label="Street Address" error={errors.currentAddress} value={formData.address.current.address} onChange={(e) => handleAddressChange('current', 'address', e.target.value)} textTransform="uppercase" placeholder='123, Street Name/Village Name' required />
                        </div>
                        <FormInput name="currentPin" label="Pin Code" error={errors.currentPin} value={formData.address.current.pinCode} onChange={(e) => handleAddressChange('current', 'pinCode', e.target.value)} placeholder='123456' type="number" required />
                        <FormInput name="currentState" label="State" error={errors.currentState} value={formData.address.current.state} onChange={(e) => handleAddressChange('current', 'state', e.target.value)} placeholder='State Name' textTransform="uppercase" required />
                        <FormInput name="currentDistrict" label="District" error={errors.currentDistrict} value={formData.address.current.district} onChange={(e) => handleAddressChange('current', 'district', e.target.value)} placeholder='District Name' textTransform="uppercase" required />
                        <FormInput name="currentCity" label="City" error={errors.currentCity} value={formData.address.current.city} onChange={(e) => handleAddressChange('current', 'city', e.target.value)} placeholder='City Name' textTransform="uppercase" required />
                    </div>

                    <div className="flex items-center space-x-2 my-5 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700">
                        <input type="checkbox" id="syncAddress" onChange={handleSyncAddresses} className="w-4 h-4 rounded border-gray-300 dark:border-gray-600 dark:bg-gray-700 text-brand-blue focus:ring-brand-blue" />
                        <label htmlFor="syncAddress" className="text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer">Permanent address same as current address</label>
                    </div>

                    <h4 className="text-md font-semibold text-gray-700 dark:text-gray-400 mb-3">Permanent Address</h4>
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                        <div className="md:col-span-2">
                            <FormInput name="permanentAddress" label="Street Address" error={errors.permanentAddress} value={formData.address.permanent.address} onChange={(e) => handleAddressChange('permanent', 'address', e.target.value)} textTransform="uppercase" placeholder='123, Street Name/Village Name' required />
                        </div>
                        <FormInput name="permanentPin" label="Pin Code" error={errors.permanentPin} value={formData.address.permanent.pinCode} onChange={(e) => handleAddressChange('permanent', 'pinCode', e.target.value)} placeholder='123456' type="number" required />
                        <FormInput name="permanentState" label="State" error={errors.permanentState} value={formData.address.permanent.state} onChange={(e) => handleAddressChange('permanent', 'state', e.target.value)} placeholder='State Name' textTransform="uppercase" required />
                        <FormInput name="permanentDistrict" label="District" error={errors.permanentDistrict} value={formData.address.permanent.district} onChange={(e) => handleAddressChange('permanent', 'district', e.target.value)} placeholder='District Name' textTransform="uppercase" required />
                        <FormInput name="permanentCity" label="City" error={errors.permanentCity} value={formData.address.permanent.city} onChange={(e) => handleAddressChange('permanent', 'city', e.target.value)} placeholder='City Name' textTransform="uppercase" required />
                    </div>
                </section>

                {/* 3. Experience Details */}
                <section>
                    <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">Experience & Education</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-5">
                        <FormSelect name="experienceType" label="Experience Level" value={formData.experienceType} onChange={handleChange} options={[{ label: 'Fresher', value: 'Fresher' }, { label: 'Experienced', value: 'Experienced' }]} />
                        {formData.experienceType === 'Experienced' && (
                            <>
                                <FormInput name="totalExperienceYears" label="Total Experience (Years)" type="number" value={formData.totalExperienceYears} onChange={handleChange} textTransform="none" placeholder="e.g., 3" />
                                <FormInput name="lastCompanyName" label="Last Company Name" value={formData.lastCompanyName} onChange={handleChange} placeholder="e.g., ABC Pvt Ltd" />
                                <FileSlot label="Experience Certificate" fileKey="experienceCertificate" onChange={handleFileChange} />
                            </>
                        )}
                    </div>
                </section>

                {/* 4. Job Details */}
                <section>
                    <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">Job Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
                        <FormInput name="joiningDate" label="Joining Date" error={errors.joiningDate} type="date" value={formData.joiningDate} onChange={handleChange} textTransform="none" required />
                        <FormSelect name="role" label="Role (Access Level)" error={errors.role} value={formData.role} onChange={handleChange} options={[{ label: 'Employee', value: 'Employee' }, { label: 'Intern', value: 'Intern' }]} required />
                        <FormSelect name="department" label="Department" error={errors.department} value={formData.department} onChange={handleChange} options={DEPARTMENTS.map(d => ({ label: d, value: d }))} required />
                        <FormSelect name="position" label="Position" error={errors.position} value={formData.position} onChange={handleChange} options={POSITIONS.map(p => ({ label: p, value: p }))} required />
                        <FormSelect name="managerId" label="Reporting Manager" error={errors.managerId} value={formData.managerId} onChange={handleChange} options={managerOptions} required />
                        <FormInput name="salary" label="Base Salary (₹)" error={errors.salary} type="number" value={formData.salary} onChange={handleChange} textTransform="none" placeholder='30000' required />
                        <FormInput name="fixedAllowance" label="Fixed Allowance (₹)" error={errors.fixedAllowance} type="number" value={formData.fixedAllowance} onChange={handleChange} textTransform="none" placeholder='5000' />
                        <div className="flex items-center space-x-2 mt-7">
                            <input type="checkbox" id="isLeadershipRole" name="isLeadershipRole" checked={formData.isLeadershipRole} onChange={handleChange} className="w-4 h-4 rounded border-gray-300 dark:border-gray-600 dark:bg-gray-800 text-brand-blue focus:ring-brand-blue" />
                            <label htmlFor="isLeadershipRole" className="text-sm font-medium text-gray-700 dark:text-gray-300">Leadership Role</label>
                        </div>
                    </div>
                </section>

                {/* 5. Health Information */}
                <section>
                    <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">Health Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-5">
                        <FormSelect name="hasDisease" label="Any Known Disease?" value={formData.hasDisease} onChange={handleChange} options={[{ label: 'Yes', value: 'Yes' }, { label: 'No', value: 'No' }]} />
                        {formData.hasDisease === 'Yes' && (
                            <>
                                <FormInput name="diseaseName" label="Disease Name" type="text" value={formData.diseaseName} onChange={handleChange} textTransform="none" placeholder="e.g., Diabetes" />
                                <FormInput name="diseaseType" label="Disease Type" type="text" value={formData.diseaseType} onChange={handleChange} textTransform="none" placeholder="e.g., Chronic" />
                                <FormInput name="diseaseSince" label="Disease Since" type="number" value={formData.diseaseSince} onChange={handleChange} textTransform="none" placeholder="e.g., 2020" />
                                <FormInput name="medicinesRequired" label="Medicines Required" type="text" value={formData.medicinesRequired} onChange={handleChange} textTransform="none" placeholder="e.g., Insulin" />
                                <FormInput name="doctorName" label="Doctor Name" type="text" value={formData.doctorName} onChange={handleChange} textTransform="none" placeholder="e.g., Dr. John Doe" />
                                <FormInput name="doctorContact" label="Doctor Contact" type="number" value={formData.doctorContact} onChange={handleChange} textTransform="none" placeholder="e.g., 123-456-7890" />
                                <FileSlot label="Medical Document" fileKey="medicalDocument" onChange={handleFileChange} />
                            </>
                        )}
                    </div>
                </section>

                {/* 6. Education Details */}
                <section>
                    <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">Experience & Education</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-5">
                        <FormInput name="hscPercent" label="12th Score (%)" error={errors.hscPercent} type="number" value={formData.hscPercent} onChange={handleChange} textTransform="none" placeholder="e.g., 85" required />
                        <FileSlot label="HSC/12th Marksheet" fileKey="twelfthMarksheet" onChange={handleFileChange} />
                        <FileSlot label="SSC/10th Marksheet" fileKey="tenthMarksheet" onChange={handleFileChange} />
                        <FormSelect name="graduationCourse" label="Graduation Course" value={formData.graduationCourse} onChange={handleChange} options={GRADUATION_COURSES.map(p => ({ label: p, value: p }))} />
                        <FormInput name="graduationPercent" label="Graduation Score (%)" type="number" value={formData.graduationPercent} onChange={handleChange} textTransform="none" placeholder="e.g., 85" />
                        <FileSlot label="Graduation Marksheet" fileKey="graduationMarksheet" onChange={handleFileChange} />
                        <FormSelect name="postGraduationCourse" label="Post-Graduation Course" value={formData.postGraduationCourse} onChange={handleChange} options={POST_GRADUATION_COURSES.map(p => ({ label: p, value: p }))} />
                        <FormInput name="postGraduationPercent" label="Post-Graduation Score (%)" type="number" value={formData.postGraduationPercent} onChange={handleChange} textTransform="none" placeholder="e.g., 85" />
                        <FileSlot label="Post-Graduation Marksheet" fileKey="postGraduationMarksheet" onChange={handleFileChange} />
                    </div>
                </section>

                {/* 7. Identity & Banking */}
                <section>
                    <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-5 border-b border-gray-200 dark:border-gray-700 pb-2">Identity & Banking</h3>

                    {/* Aadhaar Card */}
                    <div className={`mb-5 p-5 rounded-2xl border transition-all overflow-hidden ${aadhaarVerified ? 'bg-emerald-50/30 dark:bg-emerald-950/10 border-emerald-200 dark:border-emerald-800' : 'bg-white dark:bg-gray-900/40 border-gray-100 dark:border-gray-800'} shadow-sm`}>
                        <div className="flex flex-wrap items-end gap-6">
                            <div className="w-full sm:flex-1 min-w-0 max-w-full">
                                <div className="flex items-center justify-between">
                                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Aadhaar Number <span className="text-red-500">*</span></label>
                                    {aadhaarVerified && <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">🔒 Locked</span>}
                                </div>
                                <input name="aadhaarNumber" value={formData.aadhaarNumber} onChange={handleChange} type="text" inputMode="numeric" pattern="[0-9]*" maxLength={12} placeholder="XXXX XXXX XXXX" disabled={aadhaarVerified} readOnly={aadhaarVerified} className="mt-2 w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-blue disabled:bg-gray-100 dark:disabled:bg-gray-800/60 disabled:text-gray-500 disabled:cursor-not-allowed transition-all" />
                            </div>

                            <div className="flex gap-2 items-center pb-0.5">
                                {aadhaarVerified ? (
                                    <span className="flex items-center gap-1 px-5 py-3 rounded-xl bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-sm font-semibold border border-green-200 dark:border-green-800">✓ Verified</span>
                                ) : !aadhaarOtpSent ? (
                                    <button type="button" onClick={handleSendAadhaarOtp} disabled={aadhaarLoading} className="px-6 py-3 rounded-xl bg-teal-500 hover:bg-teal-600 disabled:opacity-50 text-white text-sm font-semibold whitespace-nowrap transition-colors cursor-pointer">{aadhaarLoading ? 'Sending...' : 'Get OTP'}</button>
                                ) : (
                                    <>
                                        <input value={aadhaarOtp} onChange={e => setAadhaarOtp(e.target.value)} inputMode="numeric" maxLength={6} placeholder="Enter OTP" className="w-28 px-3 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-sm focus:outline-none" />
                                        <button type="button" onClick={handleVerifyAadhaarOtp} disabled={aadhaarLoading} className="px-6 py-3 rounded-xl bg-teal-500 hover:bg-teal-600 disabled:opacity-50 text-white text-sm font-semibold whitespace-nowrap transition-colors cursor-pointer">{aadhaarLoading ? 'Verifying...' : 'Verify OTP'}</button>
                                    </>
                                )}
                            </div>

                            <div className="w-full sm:flex-1 min-w-0 max-w-full">
                                <FileSlot label="Aadhaar Scan" fileKey="aadhaarFile" onChange={handleFileChange} />
                            </div>
                        </div>
                        {aadhaarError && <p className="text-xs text-red-500 mt-2">{aadhaarError}</p>}
                        {(aadhaarRegisteredName || (aadhaarVerified && (formData.aadhaarName || formData.name))) && (
                            <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium mt-2">✓ Name verified as per Aadhaar: <strong>{aadhaarRegisteredName || formData.aadhaarName || formData.name}</strong></p>
                        )}
                        {aadhaarOtpSent && !aadhaarVerified && (
                            <div className="flex items-center justify-between mt-2">
                                <p className="text-xs text-gray-500">OTP sent to Aadhaar-linked mobile number.</p>
                                <button type="button" onClick={() => { setAadhaarOtpSent(false); setAadhaarOtp(''); setAadhaarError(''); setAadhaarReferenceId(''); }} className="text-xs font-semibold text-brand-blue hover:underline cursor-pointer">Change Aadhaar Number / Resend OTP</button>
                            </div>
                        )}
                    </div>

                    {/* PAN Card */}
                    <div className={`mb-6 p-5 rounded-2xl border transition-all overflow-hidden ${panVerified ? 'bg-emerald-50/30 dark:bg-emerald-950/10 border-emerald-200 dark:border-emerald-800' : 'bg-white dark:bg-gray-900/40 border-gray-100 dark:border-gray-800'} shadow-sm`}>
                        <div className="flex flex-wrap items-end gap-6">
                            <div className="w-full sm:w-44 min-w-0">
                                <div className="flex items-center justify-between">
                                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">PAN Number <span className="text-red-500">*</span></label>
                                    {panVerified && <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">🔒 Locked</span>}
                                </div>
                                <input name="panNumber" value={formData.panNumber} onChange={handleChange} placeholder="ABCDE1234G" maxLength={10} disabled={panVerified} readOnly={panVerified} style={{ textTransform: 'uppercase' }} className="mt-2 w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-blue disabled:bg-gray-100 dark:disabled:bg-gray-800/60 disabled:text-gray-500 disabled:cursor-not-allowed transition-all" />
                            </div>

                            <div className="w-full sm:flex-1 min-w-0 max-w-full">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Name as per PAN</label>
                                <input value={panName} onChange={e => setPanName(e.target.value.toUpperCase())} placeholder="FULL NAME ON PAN CARD" disabled={panVerified} readOnly={panVerified} style={{ textTransform: 'uppercase' }} className="mt-2 w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue disabled:bg-gray-100 dark:disabled:bg-gray-800/60 disabled:text-gray-500 disabled:cursor-not-allowed transition-all" />
                            </div>

                            <div className="w-full sm:w-44 min-w-0">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Date of Birth</label>
                                <input type="date" value={panDob} onChange={e => setPanDob(e.target.value)} disabled={panVerified} readOnly={panVerified} className="mt-2 w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue disabled:bg-gray-100 dark:disabled:bg-gray-800/60 disabled:text-gray-500 disabled:cursor-not-allowed transition-all" />
                            </div>

                            <div className="pb-0.5">
                                {!panVerified ? (
                                    <button type="button" onClick={handleVerifyPan} disabled={panLoading} className="px-6 py-3 rounded-xl bg-teal-500 hover:bg-teal-600 disabled:opacity-50 text-white text-sm font-semibold whitespace-nowrap transition-colors cursor-pointer">{panLoading ? 'Verifying...' : 'Verify'}</button>
                                ) : (
                                    <span className="flex items-center gap-1 px-5 py-3 rounded-xl bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-sm font-semibold border border-green-200 dark:border-green-800">✓ Verified</span>
                                )}
                            </div>

                            <div className="w-full sm:flex-1 min-w-0 max-w-full">
                                <FileSlot label="PAN Scan" fileKey="panFile" onChange={handleFileChange} />
                            </div>
                        </div>
                        {panError && <p className="text-xs text-red-500 mt-2">{panError}</p>}
                    </div>

                    {/* Bank Account Verification */}
                    <div className={`p-5 rounded-2xl border transition-all overflow-hidden ${bankVerified ? 'bg-emerald-50/30 dark:bg-emerald-950/10 border-emerald-200 dark:border-emerald-800' : 'bg-white dark:bg-gray-900/40 border-gray-100 dark:border-gray-800'} shadow-sm`}>
                        <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-100 dark:border-gray-800">
                            <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200">Bank Account Details</h4>
                            {bankVerified && <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">🔒 Locked</span>}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-end">
                            <FormInput name="accountHolderName" label="Account Holder Name" placeholder='john doe' value={formData.accountHolderName} textTransform="uppercase" onChange={handleChange} required />
                            <FormInput name="accountNumber" label="Account Number" type="number" value={formData.accountNumber} placeholder="1234567890" onChange={handleChange} disabled={bankVerified} textTransform="none" required />
                            <FormInput name="ifsc" label="IFSC Code" value={formData.ifsc} onChange={handleChange} placeholder="BANK0000000" disabled={bankVerified} textTransform="uppercase" required />
                            <FormInput name="bankName" label="Bank Name" value={formData.bankName} textTransform="uppercase" placeholder="STATE BANK OF INDIA" onChange={handleChange} required />
                            <FormInput name="branch" label="Branch Name" value={formData.branch} placeholder="NEW DELHI" textTransform="uppercase" onChange={handleChange} required />
                            <div className="w-full min-w-0 max-w-full">
                                <FileSlot label="Passbook/Cheque Copy" fileKey="passbookFile" onChange={handleFileChange} />
                            </div>
                        </div>

                        <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800 flex flex-wrap items-center justify-between gap-3">
                            <div>
                                {bankError && <p className="text-xs text-red-500 font-medium">{bankError}</p>}
                                {bankRegisteredName && (
                                    <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">✓ Name verified as per bank: <strong>{bankRegisteredName}</strong></p>
                                )}
                            </div>
                            <div>
                                {!bankVerified ? (
                                    <button type="button" onClick={handleVerifyBank} disabled={bankLoading} className="px-6 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-600 disabled:opacity-50 text-white text-sm font-semibold whitespace-nowrap transition-colors cursor-pointer">{bankLoading ? 'Verifying Account...' : 'Verify Bank Account'}</button>
                                ) : (
                                    <span className="flex items-center gap-1 px-5 py-2.5 rounded-xl bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-sm font-semibold border border-green-200 dark:border-green-800">✓ Bank Account Verified</span>
                                )}
                            </div>
                        </div>
                    </div>
                </section>

                {/* 9. Emergency Contact */}
                <section>
                    <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">Emergency Contact</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <FormInput name="emergencyContactName" label="Name" value={formData.emergencyContactName} textTransform="uppercase" onChange={handleChange} placeholder="John Doe" error={errors.emergencyContactName} required />
                        <FormInput name="emergencyContactRelationship" label="Relationship" value={formData.emergencyContactRelationship} textTransform="uppercase" onChange={handleChange} placeholder="Brother, Sister, Father, Mother, Friend" />
                        <FormInput name="emergencyContactMobile" label="Mobile Number*" value={formData.emergencyContactMobile} textTransform="none" onChange={handleChange} placeholder="1234567890" type="number" error={errors.emergencyContactMobile} required />
                        <FormInput name="emergencyContactAddress" label="Address" value={formData.emergencyContactAddress} textTransform="uppercase" onChange={handleChange} placeholder="123 Main Street, City, State, ZIP" />
                    </div>
                </section>

                {/* Submit Action */}
                <div className="pt-6 border-t border-gray-200 dark:border-gray-700 flex justify-end">
                    <GradientButton type="submit" disabled={isSubmitting}>
                        {isSubmitting ? "Saving..." : "Save Employee Profile"}
                    </GradientButton>
                </div>
            </form>
        </div>
    );
}