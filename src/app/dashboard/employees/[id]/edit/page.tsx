"use client";

import { use } from 'react';
import { Loader2, ExternalLink, ArrowLeft } from 'lucide-react';
import PageTitleHeader from '@/components/elements/PageTitleHeader';
import { FileInputField, FormInput, FormSelect } from '@/components/elements/FormFields';
import GradientButton from '@/components/buttons/GradientButton';
import { useEditEmployee } from '@/hooks/employee-hooks/useEditEmployee';
import { DEPARTMENTS, GRADUATION_COURSES, POSITIONS, POST_GRADUATION_COURSES } from '@/hooks/employee-hooks/useAddEmployee';

// Helper component to show existing files above your FileInputField
const FileSlot = ({ label, fileKey, existingUrl, onChange }: { label: string, fileKey: string, existingUrl?: string, onChange: any }) => (
    <div className="flex flex-col gap-1.5 w-full">
        <div className="flex justify-between items-end">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</span>
            {existingUrl && (
                <a href={existingUrl} target="_blank" rel="noopener noreferrer" className="text-xs flex items-center gap-1 text-brand-blue hover:underline font-semibold">
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
        formData, existingUrls, errors, isLoading, isSubmitting, managerOptions,
        handleChange, handleAddressChange, handleFileChange, handleSyncAddresses, handleSubmit, handleBack,
    } = useEditEmployee(id);

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
                    <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">Identity & Banking</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5 items-end">
                        <FormInput name="aadhaarNumber" label="Aadhaar Number" value={formData.aadhaarNumber} onChange={handleChange} type="number" textTransform="none" required />
                        <FileSlot label="Aadhaar Scan" fileKey="aadhaarFile" existingUrl={existingUrls.aadhaarFile} onChange={handleFileChange} />
                        <FormInput name="panNumber" label="PAN Number" value={formData.panNumber} onChange={handleChange} textTransform="uppercase" required />
                        <FileSlot label="PAN Scan" fileKey="panFile" existingUrl={existingUrls.panFile} onChange={handleFileChange} />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-5 border-t border-gray-100 dark:border-gray-800 pt-5 items-end">
                        <FormInput name="accountHolderName" label="Account Holder Name" value={formData.accountHolderName} onChange={handleChange} required />
                        <FormInput name="bankName" label="Bank Name" value={formData.bankName} onChange={handleChange} required />
                        <FormInput name="accountNumber" label="Account Number" type="number" value={formData.accountNumber} onChange={handleChange} textTransform="none" required />
                        <FormInput name="ifsc" label="IFSC Code" value={formData.ifsc} onChange={handleChange} textTransform="uppercase" required />
                        <FormInput name="branch" label="Branch Name" value={formData.branch} onChange={handleChange} required />
                        <FileSlot label="Passbook/Cheque Copy" fileKey="passbookFile" existingUrl={existingUrls.passbookFile} onChange={handleFileChange} />
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