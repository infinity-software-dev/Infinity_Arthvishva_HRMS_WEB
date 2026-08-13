"use client";

import React from 'react';
import { useEmployeeProfile } from '@/hooks/portal-hooks/profile-hooks/useEmployeeProfile';
import { DataField, DocumentRow } from '@/components/elements/EmployeeDisplayElements';
import { User, MapPin, Briefcase, GraduationCap, ShieldCheck } from 'lucide-react';

export default function ProfilePage() {
  const { employee, loading, formatDate, displayValue } = useEmployeeProfile();

  if (loading) {
    return (
      <div className="w-full max-w-7xl mx-auto py-24 text-center">
        <div className="w-6 h-6 border-2 border-brand-blue border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
        <p className="text-sm font-bold text-gray-500 dark:text-gray-400">Loading your profile...</p>
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="w-full max-w-7xl mx-auto py-24 text-center">
        <p className="text-sm font-bold text-red-500">Failed to load profile details.</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 pb-12">

      {/* 1. Header Title */}
      <div>
        <h1 className="text-2xl md:text-[28px] font-bold text-primary dark:text-white tracking-tight leading-none mb-1">
          My Profile
        </h1>
        <p className="text-xs font-bold text-secondary dark:text-gray-400 uppercase tracking-widest">
          Personal Information & Work Details
        </p>
      </div>

      {/* 2. Hero Card */}
      <div className="bg-white dark:bg-primary border border-gray-100 dark:border-gray-800 rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row items-center sm:items-start gap-6 transition-colors">
        {employee.profileImageUrl ? (
          <img
            src={employee.profileImageUrl}
            alt={employee.name}
            className="w-20 h-20 rounded-2xl object-cover border border-gray-200 dark:border-gray-700 shadow-sm shrink-0"
          />
        ) : (
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-brand-blue to-blue-600 flex items-center justify-center text-white font-black text-2xl uppercase shadow-sm shrink-0">
            {employee.name?.substring(0, 2) || "EM"}
          </div>
        )}
        <div className="space-y-1.5 flex-1 text-center sm:text-left">
          <div>
            <h2 className="text-2xl font-black text-primary dark:text-white tracking-tight uppercase">
              {displayValue(employee.name)}
            </h2>
            <p className="text-xs font-mono font-bold text-brand-blue dark:text-blue-400 mt-0.5">
              {displayValue(employee.employeeCode)}
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
            <span className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-bold rounded-lg text-xs uppercase tracking-wider border border-gray-200 dark:border-gray-700">
              {displayValue(employee.position)}
            </span>
            <span className="px-3 py-1 bg-blue-50 dark:bg-blue-500/10 text-brand-blue dark:text-blue-400 font-bold rounded-lg text-xs uppercase tracking-wider border border-blue-100 dark:border-blue-500/20">
              {displayValue(employee.department)}
            </span>
          </div>
        </div>
      </div>

      {/* 3. Basic Details */}
      <div className="bg-white dark:bg-primary border border-gray-100 dark:border-gray-800 rounded-2xl shadow-sm overflow-hidden transition-colors">
        <div className="flex items-center gap-2 border-b border-gray-100 dark:border-gray-800 px-6 py-4 bg-gray-50/50 dark:bg-gray-800/30">
          <User size={16} className="text-brand-blue dark:text-blue-400" />
          <h3 className="text-xs font-bold text-secondary dark:text-gray-400 uppercase tracking-widest">Basic Details</h3>
        </div>
        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-6 gap-x-6">
          <DataField label="Email" value={employee.email} displayValue={displayValue} />
          <DataField label="Mobile" value={employee.mobileNumber} displayValue={displayValue} />
          <DataField label="Alternate Mobile" value={employee.alternateMobileNumber} displayValue={displayValue} />
          <DataField label="Gender" value={employee.gender} displayValue={displayValue} />
          <DataField label="DOB" value={formatDate(employee.dateOfBirth)} displayValue={displayValue} />
          <DataField label="Marital Status" value={employee.maritalStatus} displayValue={displayValue} />
        </div>
      </div>

      {/* 4. Address Information */}
      <div className="bg-white dark:bg-primary border border-gray-100 dark:border-gray-800 rounded-2xl shadow-sm overflow-hidden transition-colors">
        <div className="flex items-center gap-2 border-b border-gray-100 dark:border-gray-800 px-6 py-4 bg-gray-50/50 dark:bg-gray-800/30">
          <MapPin size={16} className="text-brand-blue dark:text-blue-400" />
          <h3 className="text-xs font-bold text-secondary dark:text-gray-400 uppercase tracking-widest">Address Information</h3>
        </div>
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

      {/* 5. Job Details */}
      <div className="bg-white dark:bg-primary border border-gray-100 dark:border-gray-800 rounded-2xl shadow-sm overflow-hidden transition-colors">
        <div className="flex items-center gap-2 border-b border-gray-100 dark:border-gray-800 px-6 py-4 bg-gray-50/50 dark:bg-gray-800/30">
          <Briefcase size={16} className="text-brand-blue dark:text-blue-400" />
          <h3 className="text-xs font-bold text-secondary dark:text-gray-400 uppercase tracking-widest">Job Details</h3>
        </div>
        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-6 gap-x-6">
          <DataField label="Joining Date" value={formatDate(employee.joiningDate)} displayValue={displayValue} />
          <DataField label="Role" value={employee.role} displayValue={displayValue} />
          <DataField label="Department" value={employee.department} displayValue={displayValue} />
          <DataField label="Position" value={employee.position} displayValue={displayValue} />
          <DataField label="Salary" value={employee.salary ? `₹${Number(employee.salary).toLocaleString('en-IN')}` : undefined} displayValue={displayValue} />
          <DataField label="Status" value={employee.status} displayValue={displayValue} />
        </div>
      </div>

      {/* 6. Work Experience */}
      <div className="bg-white dark:bg-primary border border-gray-100 dark:border-gray-800 rounded-2xl shadow-sm overflow-hidden transition-colors">
        <div className="flex items-center gap-2 border-b border-gray-100 dark:border-gray-800 px-6 py-4 bg-gray-50/50 dark:bg-gray-800/30">
          <Briefcase size={16} className="text-brand-blue dark:text-blue-400" />
          <h3 className="text-xs font-bold text-secondary dark:text-gray-400 uppercase tracking-widest">Work Experience</h3>
        </div>
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-y-6 gap-x-6">
            <DataField label="Experience Type" value={employee.experienceType} displayValue={displayValue} />
            <DataField label="Total Years" value={employee.totalExperienceYears} displayValue={displayValue} />
            <DataField label="Last Company" value={employee.lastCompanyName} displayValue={displayValue} />
          </div>
          <div className="space-y-3 border-t border-gray-100 dark:border-gray-800 pt-5">
            <span className="text-xs font-bold text-primary dark:text-white block uppercase tracking-wider">Experience Certificates</span>
            <DocumentRow title="Experience Certificate" fileUrl={employee.experienceCertificateUrl} />
          </div>
        </div>
      </div>

      {/* 7. Education Details */}
      <div className="bg-white dark:bg-primary border border-gray-100 dark:border-gray-800 rounded-2xl shadow-sm overflow-hidden transition-colors">
        <div className="flex items-center gap-2 border-b border-gray-100 dark:border-gray-800 px-6 py-4 bg-gray-50/50 dark:bg-gray-800/30">
          <GraduationCap size={16} className="text-brand-blue dark:text-blue-400" />
          <h3 className="text-xs font-bold text-secondary dark:text-gray-400 uppercase tracking-widest">Education Details</h3>
        </div>
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-y-6 gap-x-6">
            <DataField label="12th Percentage" value={employee.hscPercent ? `${employee.hscPercent}%` : undefined} displayValue={displayValue} />
            <DataField label="Graduation Course" value={employee.graduationCourse} displayValue={displayValue} />
            <DataField label="Graduation %" value={employee.graduationPercent ? `${employee.graduationPercent}%` : undefined} displayValue={displayValue} />
            <DataField label="Post Graduation" value={employee.postGraduationCourse || "None"} displayValue={displayValue} />
            <DataField label="PG %" value={employee.postGraduationPercent ? `${employee.postGraduationPercent}%` : undefined} displayValue={displayValue} />
          </div>
          <div className="space-y-3 border-t border-gray-100 dark:border-gray-800 pt-5">
            <span className="text-xs font-bold text-primary dark:text-white block uppercase tracking-wider">Marksheets</span>
            <DocumentRow title="12th Marksheet" fileUrl={employee.twelfthMarksheetUrl} />
            <DocumentRow title="Graduation Marksheet" fileUrl={employee.graduationMarksheetUrl} />
            <DocumentRow title="PG Marksheet" fileUrl={employee.postGraduationMarksheetUrl} />
          </div>
        </div>
      </div>

      {/* 8. ID / Bank / Health Documents */}
      <div className="bg-white dark:bg-primary border border-gray-100 dark:border-gray-800 rounded-2xl shadow-sm overflow-hidden transition-colors">
        <div className="flex items-center gap-2 border-b border-gray-100 dark:border-gray-800 px-6 py-4 bg-gray-50/50 dark:bg-gray-800/30">
          <ShieldCheck size={16} className="text-brand-blue dark:text-blue-400" />
          <h3 className="text-xs font-bold text-secondary dark:text-gray-400 uppercase tracking-widest">ID / Bank / Health Documents</h3>
        </div>
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