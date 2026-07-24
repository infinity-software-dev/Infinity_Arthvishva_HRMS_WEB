"use client";

import PageTitleHeader from '@/components/elements/PageTitleHeader';
import { FileInputField, FormInput, FormSelect } from '@/components/elements/FormFields';
import GradientButton from '@/components/buttons/GradientButton';
import { useAddEmployee } from '@/hooks/employee-hooks/useAddEmployee';
import { DEPARTMENTS, GRADUATION_COURSES, POSITIONS, POST_GRADUATION_COURSES } from '@/hooks/employee-hooks/useAddEmployee';
import { ArrowLeft } from 'lucide-react';

export default function AddEmployeePage() {
    // Destructure everything from our new custom hook
    const {
        formData,
        errors,
        isSubmitting,
        managerOptions,
        handleChange,
        handleAddressChange,
        handleFileChange,
        handleSyncAddresses,
        handleSubmit,
        handleBack,
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
                        <FormInput name="name" label="Full Name" value={formData.name} onChange={handleChange} error={errors.name} textTransform="capitalize" placeholder="John Doe" required />
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
                        <FileInputField label="Profile Photo" onChange={(e) => handleFileChange(e, 'profileImage')} />
                        <FormSelect name="gender" label="Gender" error={errors.gender} value={formData.gender} onChange={handleChange} options={[{ label: 'Male', value: 'Male' }, { label: 'Female', value: 'Female' }, { label: 'Other', value: 'Other' }]} required />
                        <FormInput name="fatherName" label="Father's Name" value={formData.fatherName} onChange={handleChange} placeholder="John Doe" />
                        <FormInput name="motherName" label="Mother's Name" value={formData.motherName} onChange={handleChange} placeholder="Jane Doe" />
                        <FormInput name="dateOfBirth" label="Date of Birth" error={errors.dateOfBirth} type="date" value={formData.dateOfBirth} onChange={handleChange} textTransform="none" required />
                        <FormSelect name="bloodGroup" label="Blood Group" value={formData.bloodGroup} onChange={handleChange} options={['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => ({ label: bg, value: bg }))} />
                        <FormSelect name="maritalStatus" label="Marital Status" value={formData.maritalStatus} onChange={handleChange} options={['Single', 'Married', 'Divorced', 'Widowed'].map(s => ({ label: s, value: s }))} />
                    </div>

                    <h4 className="text-md font-semibold text-gray-700 dark:text-gray-400 mb-3">Current Address</h4>
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                        <div className="md:col-span-2">
                            <FormInput name="currentAddress" label="Street Address" error={errors.currentAddress} value={formData.address.current.address} onChange={(e) => handleAddressChange('current', 'address', e.target.value)} textTransform="none" placeholder='123, Street Name/Village Name' required />
                        </div>
                        <FormInput name="currentPin" label="Pin Code" error={errors.currentPin} value={formData.address.current.pinCode} onChange={(e) => handleAddressChange('current', 'pinCode', e.target.value)} placeholder='123456' type="number" required />
                        <FormInput name="currentState" label="State" error={errors.currentState} value={formData.address.current.state} onChange={(e) => handleAddressChange('current', 'state', e.target.value)} placeholder='State Name' required />
                        <FormInput name="currentDistrict" label="District" error={errors.currentDistrict} value={formData.address.current.district} onChange={(e) => handleAddressChange('current', 'district', e.target.value)} placeholder='District Name' required />
                        <FormInput name="currentCity" label="City" error={errors.currentCity} value={formData.address.current.city} onChange={(e) => handleAddressChange('current', 'city', e.target.value)} placeholder='City Name' required />

                    </div>

                    <div className="flex items-center space-x-2 my-5 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700">
                        <input type="checkbox" id="syncAddress" onChange={handleSyncAddresses} className="w-4 h-4 rounded border-gray-300 dark:border-gray-600 dark:bg-gray-700 text-brand-blue focus:ring-brand-blue" />
                        <label htmlFor="syncAddress" className="text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer">Permanent address same as current address</label>
                    </div>

                    <h4 className="text-md font-semibold text-gray-700 dark:text-gray-400 mb-3">Permanent Address</h4>
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                        <div className="md:col-span-2">
                            <FormInput name="permanentAddress" label="Street Address" error={errors.permanentAddress} value={formData.address.permanent.address} onChange={(e) => handleAddressChange('permanent', 'address', e.target.value)} textTransform="none" placeholder='123, Street Name/Village Name' required />
                        </div>
                        <FormInput name="permanentPin" label="Pin Code" error={errors.permanentPin} value={formData.address.permanent.pinCode} onChange={(e) => handleAddressChange('permanent', 'pinCode', e.target.value)} placeholder='123456' type="number" required />
                        <FormInput name="permanentState" label="State" error={errors.permanentState} value={formData.address.permanent.state} onChange={(e) => handleAddressChange('permanent', 'state', e.target.value)} placeholder='State Name' required />
                        <FormInput name="permanentDistrict" label="District" error={errors.permanentDistrict} value={formData.address.permanent.district} onChange={(e) => handleAddressChange('permanent', 'district', e.target.value)} placeholder='District Name' required />
                        <FormInput name="permanentCity" label="City" error={errors.permanentCity} value={formData.address.permanent.city} onChange={(e) => handleAddressChange('permanent', 'city', e.target.value)} placeholder='City Name' required />
                    </div>
                </section>

                {/* 3. Experience Details */}
                <section>
                    <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">Experience & Education</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-5">
                        <FormSelect
                            name="experienceType"
                            label="Experience Level"
                            value={formData.experienceType}
                            onChange={handleChange}
                            options={[
                                { label: 'Fresher', value: 'Fresher' },
                                { label: 'Experienced', value: 'Experienced' }
                            ]}
                        />

                        {formData.experienceType === 'Experienced' && (
                            <>
                                <FormInput
                                    name="totalExperienceYears"
                                    label="Total Experience (Years)"
                                    type="number"
                                    value={formData.totalExperienceYears}
                                    onChange={handleChange}
                                    textTransform="none"
                                    placeholder="e.g., 3"
                                />
                                <FormInput
                                    name="lastCompanyName"
                                    label="Last Company Name"
                                    value={formData.lastCompanyName}
                                    onChange={handleChange}
                                    placeholder="e.g., ABC Pvt Ltd"
                                />
                                <FileInputField label="Experience Certificate" onChange={(e) => handleFileChange(e, 'experienceCertificate')} />
                            </>
                        )}
                    </div>
                </section>

                {/* 4. Job Details */}
                <section>
                    <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">Job Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
                        <FormInput name="joiningDate" label="Joining Date" error={errors.joiningDate} type="date" value={formData.joiningDate} onChange={handleChange} textTransform="none" required />
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
                        <FormSelect
                            name="hasDisease"
                            label="Any Known Disease?"
                            value={formData.hasDisease}
                            onChange={handleChange}
                            options={[
                                { label: 'Yes', value: 'Yes' },
                                { label: 'No', value: 'No' }
                            ]}
                        />

                        {formData.hasDisease === 'Yes' && (
                            <>
                                <FormInput name="diseaseName" label="Disease Name" type="text" value={formData.diseaseName} onChange={handleChange} textTransform="none" placeholder="e.g., Diabetes" />
                                <FormInput name="diseaseType" label="Disease Type" type="text" value={formData.diseaseType} onChange={handleChange} textTransform="none" placeholder="e.g., Chronic" />
                                <FormInput name="diseaseSince" label="Disease Since" type="number" value={formData.diseaseSince} onChange={handleChange} textTransform="none" placeholder="e.g., 2020" />
                                <FormInput name="medicinesRequired" label="Medicines Required" type="text" value={formData.medicinesRequired} onChange={handleChange} textTransform="none" placeholder="e.g., Insulin" />
                                <FormInput name="doctorName" label="Doctor Name" type="text" value={formData.doctorName} onChange={handleChange} textTransform="none" placeholder="e.g., Dr. John Doe" />
                                <FormInput name="doctorContact" label="Doctor Contact" type="number" value={formData.doctorContact} onChange={handleChange} textTransform="none" placeholder="e.g., 123-456-7890" />
                                <FileInputField label="Medical Document" onChange={(e) => handleFileChange(e, 'medicalDocument')} />
                            </>
                        )}
                    </div>
                </section>

                {/* 6. Education Details */}
                <section>
                    <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">Experience & Education</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-5">
                        <FormInput name="hscPercent" label="12th Score (%)" error={errors.hscPercent} type="number" value={formData.hscPercent} onChange={handleChange} textTransform="none" placeholder="e.g., 85" required />
                        <FileInputField label="HSC/12th Marksheet" onChange={(e) => handleFileChange(e, 'twelfthMarksheet')} />
                        <FileInputField label="SSC/10th Marksheet" onChange={(e) => handleFileChange(e, 'tenthMarksheet')} />
                        <FormSelect name="graduationCourse" label="Graduation Course" value={formData.graduationCourse} onChange={handleChange} options={GRADUATION_COURSES.map(p => ({ label: p, value: p }))} />
                        <FormInput name="graduationPercent" label="Graduation Score (%)" type="number" value={formData.graduationPercent} onChange={handleChange} textTransform="none" placeholder="e.g., 85" />
                        <FileInputField label="Graduation Marksheet" onChange={(e) => handleFileChange(e, 'graduationMarksheet')} />
                        <FormSelect name="postGraduationCourse" label="Post-Graduation Course" value={formData.postGraduationCourse} onChange={handleChange} options={POST_GRADUATION_COURSES.map(p => ({ label: p, value: p }))} />
                        <FormInput name="postGraduationPercent" label="Post-Graduation Score (%)" type="number" value={formData.postGraduationPercent} onChange={handleChange} textTransform="none" placeholder="e.g., 85" />
                        <FileInputField label="Post-Graduation Marksheet" onChange={(e) => handleFileChange(e, 'postGraduationMarksheet')} />
                    </div>
                </section>

                {/* 7. Identity Proofs */}
                <section>
                    <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">Identity Proofs</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                        <FormInput name="aadhaarNumber" label="Aadhaar Number" value={formData.aadhaarNumber} onChange={handleChange} placeholder="XXXX-XXXX-XXXX" textTransform="none" type="number" error={errors.aadhaarNumber} required />
                        <FileInputField label="Aadhaar Scan" onChange={(e) => handleFileChange(e, 'aadhaarFile')} />
                        <FormInput name="panNumber" label="PAN Number" value={formData.panNumber} onChange={handleChange} textTransform="uppercase" placeholder="ABCDE1234G" error={errors.panNumber} required />
                        <FileInputField label="PAN Scan" onChange={(e) => handleFileChange(e, 'panFile')} />
                    </div>
                </section>

                {/* 8. Bank Details */}
                <section>
                    <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">Bank Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                        <FormInput name="accountHolderName" label="Account Holder Name" value={formData.accountHolderName} onChange={handleChange} placeholder="John Doe" error={errors.accountHolderName} required />
                        <FormInput name="bankName" label="Bank Name" value={formData.bankName} onChange={handleChange} placeholder="HDFC Bank" error={errors.bankName} required />
                        <FormInput name="accountNumber" label="Account Number*" type="number" value={formData.accountNumber} onChange={handleChange} textTransform="none" placeholder="123456789012" error={errors.accountNumber} required />
                        <FormInput name="ifsc" label="IFSC Code*" value={formData.ifsc} onChange={handleChange} textTransform="uppercase" placeholder="HDFC0001234" error={errors.ifsc} required />
                        <FormInput name="branch" label="Branch Name*" value={formData.branch} onChange={handleChange} placeholder="Branch Name" error={errors.branch} required />
                        <FileInputField label="Passbook/Cheque Copy" onChange={(e) => handleFileChange(e, 'passbookFile')} />
                    </div>
                </section>

                {/* 9. Emergency Contact */}
                <section>
                    <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">Emergency Contact</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <FormInput name="emergencyContactName" label="Name" value={formData.emergencyContactName} onChange={handleChange} placeholder="John Doe" error={errors.emergencyContactName} required />
                        <FormInput name="emergencyContactRelationship" label="Relationship" value={formData.emergencyContactRelationship} onChange={handleChange} textTransform="none" placeholder="Brother, Sister, Father, Mother, Friend" />
                        <FormInput name="emergencyContactMobile" label="Mobile Number*" value={formData.emergencyContactMobile} onChange={handleChange} textTransform="none" placeholder="1234567890" type="number" error={errors.emergencyContactMobile} required />
                        <FormInput name="emergencyContactAddress" label="Address" value={formData.emergencyContactAddress} onChange={handleChange} textTransform="none" placeholder="123 Main Street, City, State, ZIP" />
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