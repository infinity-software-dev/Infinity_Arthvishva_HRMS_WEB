"use client";

import { useEmployeeProfile } from '@/hooks/employee-hooks/useEmployeeProfile';
import { DataField, DocumentRow } from '@/components/elements/EmployeeDisplayElements';
import { ArrowLeft } from 'lucide-react';
import GradientButton from '@/components/buttons/GradientButton';
import PageTitleHeader from '@/components/elements/PageTitleHeader';
import { useEffect, useState } from 'react';

export default function ViewEmployeeProfilePage() {
    const {
        employee,
        loading,
        managerName,
        formatDate,
        displayValue,
        handleBack,
        handleEdit
    } = useEmployeeProfile();

    const [isHr, setIsHr] = useState<boolean>(false);

    // Safely read role on client mount and store as boolean
    useEffect(() => {
        const storedRole = localStorage.getItem("role");
        setIsHr(storedRole === "HR");
    }, []);

    if (loading) {
        return <div className="p-12 text-center text-gray-500">Loading profile configurations...</div>;
    }

    if (!employee) {
        return <div className="p-12 text-center text-red-500">Employee configuration context not found.</div>;
    }

    return (
        <div className="p-8 space-y-6 w-full mx-auto bg-gray-50/50 dark:bg-gray-900/20 min-h-screen">

            <PageTitleHeader
                title="Employee Details"
                description="Manage team members, roles, and view detailed profiles."
            />

            {/* Header Navigation Block */}
            <div className="flex items-center justify-between">
                <button
                    onClick={handleBack}
                    className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-800 dark:hover:text-white transition-colors cursor-pointer"
                >
                    <ArrowLeft className="w-4 h-4" /> Back to List
                </button>
                {isHr && (
                    <GradientButton onClick={handleEdit}>
                        Edit Profile
                    </GradientButton>
                )}
            </div>

            {/* Profile Header Card */}
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 shadow-sm flex items-center gap-5">
                {employee.profileImageUrl ? (
                    <img src={employee.profileImageUrl} alt="" className="w-16 h-16 rounded-xl object-cover border border-gray-200" />
                ) : (
                    <div className="w-16 h-16 rounded-xl bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-400 font-bold text-xl uppercase">
                        {employee.name?.substring(0, 2) || "EM"}
                    </div>
                )}
                <div className="space-y-1 flex-1">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white uppercase tracking-wide">{displayValue(employee.name)}</h2>
                    <div className="text-xs font-medium text-gray-500 space-y-0.5">
                        <p>Employee Code: <span className="font-mono font-bold text-gray-700 dark:text-gray-300">{displayValue(employee.employeeCode)}</span></p>
                        <span className="inline-block mt-1 px-2 py-0.5 bg-gray-600 text-white dark:bg-gray-700 font-bold rounded text-[10px] uppercase tracking-wide">
                            {displayValue(employee.position)}
                        </span>
                    </div>
                </div>
            </div>

            {/* Basic Details Section */}
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-sm overflow-hidden">
                <h3 className="text-sm font-bold text-brand-blue dark:text-blue-400 border-b border-gray-100 dark:border-gray-700 px-6 py-4 bg-gray-50/50 dark:bg-gray-800/40">Basic Details</h3>
                <div className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-6 gap-x-4">
                    <DataField label="Email" value={employee.email} displayValue={displayValue} />
                    <DataField label="Mobile" value={employee.mobileNumber} displayValue={displayValue} />
                    <DataField label="Alternate Mobile" value={employee.alternateMobileNumber} displayValue={displayValue} />
                    <DataField label="Gender" value={employee.gender} displayValue={displayValue} />
                    <DataField label="DOB" value={formatDate(employee.dateOfBirth)} displayValue={displayValue} />
                    <DataField label="Marital Status" value={employee.maritalStatus} displayValue={displayValue} />
                </div>
            </div>

            {/* Address Section */}
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-sm overflow-hidden">
                <h3 className="text-sm font-bold text-brand-blue dark:text-blue-400 border-b border-gray-100 dark:border-gray-700 px-6 py-4 bg-gray-50/50 dark:bg-gray-800/40">Address</h3>
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <span className="text-xs font-semibold text-gray-400 block uppercase tracking-wider mb-1">Current Address</span>
                        <span className="text-sm font-medium text-gray-900 dark:text-gray-100 leading-relaxed">
                            {employee.address?.current?.address
                                ? `${employee.address.current.address}, ${employee.address.current.city}, ${employee.address.current.state} ${employee.address.current.pinCode}`
                                : "-"}
                        </span>
                    </div>
                    <div>
                        <span className="text-xs font-semibold text-gray-400 block uppercase tracking-wider mb-1">Permanent Address</span>
                        <span className="text-sm font-medium text-gray-900 dark:text-gray-100 leading-relaxed">
                            {employee.address?.permanent?.address
                                ? `${employee.address.permanent.address}, ${employee.address.permanent.city}, ${employee.address.permanent.state} ${employee.address.permanent.pinCode}`
                                : "-"}
                        </span>
                    </div>
                </div>
            </div>

            {/* Job Details Section */}
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-sm overflow-hidden">
                <h3 className="text-sm font-bold text-brand-blue dark:text-blue-400 border-b border-gray-100 dark:border-gray-700 px-6 py-4 bg-gray-50/50 dark:bg-gray-800/40">Job Details</h3>
                <div className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-6 gap-x-4">
                    <DataField label="Joining Date" value={formatDate(employee.joiningDate)} displayValue={displayValue} />
                    <DataField label="Role" value={employee.role} displayValue={displayValue} />
                    <DataField label="Department" value={employee.department} displayValue={displayValue} />
                    <DataField label="Position" value={employee.position} displayValue={displayValue} />
                    <DataField label="Salary" value={employee.salary ? Number(employee.salary).toFixed(2) : undefined} displayValue={displayValue} />
                    <DataField label="Reporting Manager" value={managerName} displayValue={displayValue} />
                    <DataField label="Status" value={employee.status} displayValue={displayValue} />
                </div>
            </div>

            {/* Experience Section */}
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-sm overflow-hidden">
                <h3 className="text-sm font-bold text-brand-blue dark:text-blue-400 border-b border-gray-100 dark:border-gray-700 px-6 py-4 bg-gray-50/50 dark:bg-gray-800/40">Experience</h3>
                <div className="p-6 space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <DataField label="Experience Type" value={employee.experienceType} displayValue={displayValue} />
                        <DataField label="Total Years" value={employee.totalExperienceYears} displayValue={displayValue} />
                        <DataField label="Last Company" value={employee.lastCompanyName} displayValue={displayValue} />
                    </div>
                    <div className="space-y-2 border-t border-gray-100 dark:border-gray-700 pt-4">
                        <span className="text-xs font-bold text-gray-900 dark:text-white block mb-2">Experience Certificates</span>
                        <DocumentRow title="Experience Certificate" fileUrl={employee.experienceCertificateUrl} />
                    </div>
                </div>
            </div>

            {/* Education Section */}
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-sm overflow-hidden">
                <h3 className="text-sm font-bold text-brand-blue dark:text-blue-400 border-b border-gray-100 dark:border-gray-700 px-6 py-4 bg-gray-50/50 dark:bg-gray-800/40">Education</h3>
                <div className="p-6 space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-y-6 gap-x-4">
                        <DataField label="12th Percentage" value={employee.hscPercent} displayValue={displayValue} />
                        <DataField label="Graduation Course" value={employee.graduationCourse} displayValue={displayValue} />
                        <DataField label="Graduation %" value={employee.graduationPercent} displayValue={displayValue} />
                        <DataField label="Post Graduation" value={employee.postGraduationCourse || "None"} displayValue={displayValue} />
                        <DataField label="PG %" value={employee.postGraduationPercent} displayValue={displayValue} />
                    </div>
                    <div className="space-y-2 border-t border-gray-100 dark:border-gray-700 pt-4">
                        <span className="text-xs font-bold text-gray-900 dark:text-white block mb-2">Marksheet Documents</span>
                        <DocumentRow title="12th Marksheet" fileUrl={employee.twelfthMarksheetUrl} />
                        <DocumentRow title="Graduation Marksheet" fileUrl={employee.graduationMarksheetUrl} />
                        <DocumentRow title="PG Marksheet" fileUrl={employee.postGraduationMarksheetUrl} />
                    </div>
                </div>
            </div>

            {/* ID / Bank / Health Documents Section */}
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-sm overflow-hidden">
                <h3 className="text-sm font-bold text-brand-blue dark:text-blue-400 border-b border-gray-100 dark:border-gray-700 px-6 py-4 bg-gray-50/50 dark:bg-gray-800/40">ID / Bank / Health Documents</h3>
                <div className="p-6 space-y-3">
                    <DocumentRow title="Aadhaar Card" fileUrl={employee.aadhaarFileUrl} />
                    <DocumentRow title="PAN Card" fileUrl={employee.panFileUrl} />
                    <DocumentRow title="Bank Passbook" fileUrl={employee.passbookFileUrl} />
                    <DocumentRow title="Medical Document" fileUrl={employee.medicalDocumentUrl} />
                </div>
            </div>

        </div>
    );
}