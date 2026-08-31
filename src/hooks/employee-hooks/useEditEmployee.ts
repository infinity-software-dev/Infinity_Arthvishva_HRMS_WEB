"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { employeeService } from '@/services/employee.service';
import imageCompression from 'browser-image-compression';

export const useEditEmployee = (employeeId: string) => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [managerOptions, setManagerOptions] = useState<{ label: string, value: string }[]>([]);
    const [errors, setErrors] = useState<Record<string, string>>({});

    // Existing URLs mapped for UI preview
    const [existingUrls, setExistingUrls] = useState<Record<string, string>>({});

    const [formData, setFormData] = useState({
        employeeCode: '', password: '', confirmPassword: '', role: 'Employee',
        isAppAdmin: false, status: 'Active', name: '', email: '', mobileNumber: '',
        alternateMobileNumber: '', gender: '', bloodGroup: '', dateOfBirth: '',
        maritalStatus: '', fatherName: '', motherName: '',
        address: {
            current: { address: '', pinCode: '', state: '', district: '', city: '' },
            permanent: { address: '', pinCode: '', state: '', district: '', city: '' }
        },
        joiningDate: '', employmentDate: '', department: '', position: '', isLeadershipRole: false,
        salary: '', fixedAllowance: '', managerId: '', experienceType: 'Fresher',
        totalExperienceYears: '', lastCompanyName: '', hscPercent: '',
        graduationCourse: '', graduationPercent: '', postGraduationCourse: '',
        postGraduationPercent: '', aadhaarNumber: '', panNumber: '',
        accountHolderName: '', bankName: '', accountNumber: '', ifsc: '', branch: '',
        emergencyContactName: '', emergencyContactRelationship: '',
        emergencyContactMobile: '', emergencyContactAddress: '', hasDisease: 'No',
        diseaseName: '', diseaseType: '', diseaseSince: '', medicinesRequired: '',
        doctorName: '', doctorContact: '',
    });

    const [files, setFiles] = useState<{ [key: string]: File | null }>({
        profileImage: null, experienceCertificate: null, tenthMarksheet: null,
        twelfthMarksheet: null, graduationMarksheet: null, postGraduationMarksheet: null,
        aadhaarFile: null, panFile: null, passbookFile: null, medicalDocument: null,
    });

    useEffect(() => {
        let isMounted = true;
        const fetchInitialData = async () => {
            try {
                const [empRes, managersRes] = await Promise.all([
                    employeeService.getEmployeeById(employeeId),
                    employeeService.getManagerList()
                ]);

                if (isMounted) {
                    const emp = empRes?.data || empRes;
                    const managers = managersRes?.data || managersRes || [];

                    setManagerOptions(managers.map((m: any) => ({ label: m.name, value: m._id })));

                    if (emp) {
                        setFormData({
                            employeeCode: emp.employeeCode || '',
                            password: '', // Keep blank on edit unless modifying
                            confirmPassword: '',
                            role: emp.role || 'Employee',
                            isAppAdmin: !!emp.isAppAdmin,
                            status: emp.status || 'Active',
                            name: emp.name || '',
                            email: emp.email || '',
                            mobileNumber: emp.mobileNumber || '',
                            alternateMobileNumber: emp.alternateMobileNumber || '',
                            gender: emp.gender || '',
                            bloodGroup: emp.bloodGroup || '',
                            dateOfBirth: emp.dateOfBirth ? new Date(emp.dateOfBirth).toISOString().split('T')[0] : '',
                            maritalStatus: emp.maritalStatus || '',
                            fatherName: emp.fatherName || '',
                            motherName: emp.motherName || '',
                            address: {
                                current: emp.address?.current || { address: '', pinCode: '', state: '', district: '', city: '' },
                                permanent: emp.address?.permanent || { address: '', pinCode: '', state: '', district: '', city: '' }
                            },
                            joiningDate: emp.joiningDate ? new Date(emp.joiningDate).toISOString().split('T')[0] : '',
                            employmentDate: emp.employmentDate ? new Date(emp.employmentDate).toISOString().split('T')[0] : '',
                            department: emp.department || '',
                            position: emp.position || '',
                            isLeadershipRole: !!emp.isLeadershipRole,
                            salary: emp.salary ? String(emp.salary) : '',
                            fixedAllowance: emp.fixedAllowance ? String(emp.fixedAllowance) : '',
                            managerId: emp.managerId?._id || emp.managerId || '',
                            experienceType: emp.experienceType || 'Fresher',
                            totalExperienceYears: emp.totalExperienceYears ? String(emp.totalExperienceYears) : '',
                            lastCompanyName: emp.lastCompanyName || '',
                            hscPercent: emp.hscPercent ? String(emp.hscPercent) : '',
                            graduationCourse: emp.graduationCourse || '',
                            graduationPercent: emp.graduationPercent ? String(emp.graduationPercent) : '',
                            postGraduationCourse: emp.postGraduationCourse || '',
                            postGraduationPercent: emp.postGraduationPercent ? String(emp.postGraduationPercent) : '',
                            aadhaarNumber: emp.aadhaarNumber || '',
                            panNumber: emp.panNumber || '',
                            accountHolderName: emp.accountHolderName || '',
                            bankName: emp.bankName || '',
                            accountNumber: emp.accountNumber || '',
                            ifsc: emp.ifsc || '',
                            branch: emp.branch || '',
                            emergencyContactName: emp.emergencyContactName || '',
                            emergencyContactRelationship: emp.emergencyContactRelationship || '',
                            emergencyContactMobile: emp.emergencyContactMobile || '',
                            emergencyContactAddress: emp.emergencyContactAddress || '',
                            hasDisease: emp.hasDisease || 'No',
                            diseaseName: emp.diseaseName || '',
                            diseaseType: emp.diseaseType || '',
                            diseaseSince: emp.diseaseSince || '',
                            medicinesRequired: emp.medicinesRequired || '',
                            doctorName: emp.doctorName || '',
                            doctorContact: emp.doctorContact || '',
                        });

                        setExistingUrls({
                            profileImage: emp.profileImageUrl,
                            experienceCertificate: emp.experienceCertificateUrl,
                            tenthMarksheet: emp.tenthMarksheetUrl,
                            twelfthMarksheet: emp.twelfthMarksheetUrl,
                            graduationMarksheet: emp.graduationMarksheetUrl,
                            postGraduationMarksheet: emp.postGraduationMarksheetUrl,
                            aadhaarFile: emp.aadhaarFileUrl,
                            panFile: emp.panFileUrl,
                            passbookFile: emp.passbookFileUrl,
                            medicalDocument: emp.medicalDocumentUrl,
                        });
                    }
                }
            } catch (error) {
                console.error("Error fetching employee data:", error);
            } finally {
                if (isMounted) setIsLoading(false);
            }
        };

        fetchInitialData();
        return () => { isMounted = false };
    }, [employeeId]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
        setFormData(prev => ({ ...prev, [name]: val }));
    };

    const handleAddressChange = (type: 'current' | 'permanent', field: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            address: { ...prev.address, [type]: { ...prev.address[type], [field]: value } }
        }));
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>, key: string) => {
        if (e.target.files && e.target.files[0]) {
            const originalFile = e.target.files[0];
            if (originalFile.type.startsWith("image/")) {
                try {
                    const compressedBlob = await imageCompression(originalFile, { maxSizeMB: 0.4, maxWidthOrHeight: 1200, useWebWorker: true });
                    const compressedFile = new File([compressedBlob], originalFile.name, { type: originalFile.type });
                    setFiles(prev => ({ ...prev, [key]: compressedFile }));
                } catch (error) {
                    setFiles(prev => ({ ...prev, [key]: originalFile }));
                }
            } else {
                setFiles(prev => ({ ...prev, [key]: originalFile }));
            }
        }
    };

    const handleSyncAddresses = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            setFormData(prev => ({ ...prev, address: { ...prev.address, permanent: { ...prev.address.current } } }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const localErrors: Record<string, string> = {};

        // ── 1. BASIC DETAILS VALIDATION ──
        if (!formData.name.trim()) localErrors.name = "Full Name is required.";

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!formData.email.trim())
            localErrors.email = "Email address is required.";
        else if (!emailRegex.test(formData.email))
            localErrors.email = "Please enter a valid email format.";

        const mobileRegex = /^\d{10}$/;
        if (!formData.mobileNumber.trim())
            localErrors.mobileNumber = "Mobile number is required.";
        else if (!mobileRegex.test(formData.mobileNumber.trim()))
            localErrors.mobileNumber = "Mobile number must be exactly 10 digits.";

        if (
            formData.alternateMobileNumber?.trim() &&
            !mobileRegex.test(formData.alternateMobileNumber.trim())
        ) {
            localErrors.alternateMobileNumber =
                "Alternate mobile number must be exactly 10 digits.";
        }

        // [EDIT SPECIFIC]: Only validate password if the user is attempting to change it
        if (formData.password) {
            if (formData.password.length < 6)
                localErrors.password = "Password must be at least 6 characters long.";
            if (formData.password !== formData.confirmPassword)
                localErrors.confirmPassword = "Passwords do not match.";
        }

        // ── 2. PERSONAL DETAILS VALIDATION ──
        if (!formData.gender) localErrors.gender = "Gender selection is required.";
        if (!formData.dateOfBirth) {
            localErrors.dateOfBirth = "Date of Birth is required.";
        } else {
            const dob = new Date(formData.dateOfBirth);
            const today = new Date();
            if (dob >= today)
                localErrors.dateOfBirth = "Date of Birth must be in the past.";
        }

        // Address Validations
        if (!formData.address.current.address.trim())
            localErrors.currentAddress = "Street address is required.";
        if (!formData.address.current.pinCode.trim())
            localErrors.currentPin = "Pin Code is required.";
        else if (!/^\d{6}$/.test(formData.address.current.pinCode.trim()))
            localErrors.currentPin = "Pin Code must be exactly 6 digits.";
        if (!formData.address.current.city.trim())
            localErrors.currentCity = "City is required.";
        if (!formData.address.current.state.trim())
            localErrors.currentState = "State is required.";
        if (!formData.address.current.district.trim())
            localErrors.currentDistrict = "District is required.";

        if (!formData.address.permanent.address.trim())
            localErrors.permanentAddress = "Permanent street address is required.";
        if (!formData.address.permanent.pinCode.trim())
            localErrors.permanentPin = "Permanent Pin Code is required.";
        else if (!/^\d{6}$/.test(formData.address.permanent.pinCode.trim()))
            localErrors.permanentPin = "Permanent Pin Code must be exactly 6 digits.";
        if (!formData.address.permanent.city.trim())
            localErrors.permanentCity = "Permanent City is required.";
        if (!formData.address.permanent.state.trim())
            localErrors.permanentState = "Permanent State is required.";
        if (!formData.address.permanent.district.trim())
            localErrors.permanentDistrict = "Permanent District is required.";

        // ── 3. EXPERIENCE CONDITIONAL VALIDATION ──
        if (formData.experienceType === "Experienced") {
            if (!formData.totalExperienceYears)
                localErrors.totalExperienceYears =
                    "Total experience track history is required.";
            if (!formData.lastCompanyName.trim())
                localErrors.lastCompanyName = "Last corporate entity name is required.";
        }

        // ── 4. JOB DETAILS VALIDATION ──
        if (!formData.joiningDate)
            localErrors.joiningDate = "Joining date is required.";
        if (formData.role === "Employee" && !formData.employmentDate) {
            localErrors.employmentDate = "Employment date is required for regular employees.";
        }
        if (!formData.department)
            localErrors.department = "Department routing config is required.";

        // ── 5. HEALTH CONDITIONAL VALIDATION ──
        if (formData.hasDisease === "Yes" && !formData.diseaseName?.trim()) {
            localErrors.diseaseName =
                "Disease condition profile summary name is required.";
        }

        // ── 6. EDUCATION VALIDATION ──
        if (!formData.hscPercent) {
            localErrors.hscPercent = "12th standard score percentage is required.";
        } else {
            const hscNum = Number(formData.hscPercent);
            if (hscNum < 0 || hscNum > 100)
                localErrors.hscPercent =
                    "Percentage score must map cleanly between 0 and 100.";
        }

        // ── 7. IDENTITY PROOFS VALIDATION ──
        if (!formData.aadhaarNumber?.trim())
            localErrors.aadhaarNumber =
                "Aadhaar evaluation identification number is required.";
        else if (!/^\d{12}$/.test(formData.aadhaarNumber.trim()))
            localErrors.aadhaarNumber =
                "Aadhaar registration sequences must be exactly 12 digits.";

        const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
        if (!formData.panNumber?.trim())
            localErrors.panNumber =
                "PAN layout identification alphanumeric string is required.";
        else if (!panRegex.test(formData.panNumber.toUpperCase().trim()))
            localErrors.panNumber =
                "Invalid format structure layout guidelines (Expected: ABCDE1234F).";

        // ── 8. BANK DETAILS VALIDATION ──
        if (!formData.accountHolderName.trim())
            localErrors.accountHolderName =
                "Account holder verification title string is required.";
        if (!formData.bankName.trim())
            localErrors.bankName =
                "Banking clear clearing string node identity title is required.";
        if (!formData.accountNumber.trim())
            localErrors.accountNumber =
                "Settlement account banking system distribution numeric line string is required.";

        const ifscRegex = /^[A-Z]{4}0[A-Z0-9]{6}$/;
        if (!formData.ifsc.trim())
            localErrors.ifsc =
                "IFSC banking branch system clear verification routing string sequence is required.";
        else if (!ifscRegex.test(formData.ifsc.toUpperCase().trim()))
            localErrors.ifsc =
                "Invalid system standard core code pattern formatting (Expected: HDFC0001234).";

        if (!formData.branch.trim())
            localErrors.branch =
                "Branch structural settlement context locator label string required.";

        // ── 9. EMERGENCY CONTACT VALIDATION ──
        if (!formData.emergencyContactName.trim())
            localErrors.emergencyContactName =
                "Emergency contact name node identity is required.";
        if (!formData.emergencyContactMobile.trim())
            localErrors.emergencyContactMobile =
                "Emergency backup callback sequence mobile target line is required.";
        else if (!mobileRegex.test(formData.emergencyContactMobile.trim()))
            localErrors.emergencyContactMobile =
                "Emergency connectivity mobile contact number target lines require exactly 10 digits.";

        // ── EVALUATE CRITICAL RUNTIME ERRORS INTERCEPTION ──
        if (Object.keys(localErrors).length > 0) {
            setErrors(localErrors);
            const firstErrorKey = Object.keys(localErrors)[0];
            const errorInputNode = document.getElementsByName(firstErrorKey)[0];
            if (errorInputNode) {
                errorInputNode.scrollIntoView({
                    behavior: "smooth",
                    block: "center",
                });
                errorInputNode.focus();
            }
            return;
        }

        setErrors({});

        try {
            setIsSubmitting(true);
            const data = new FormData();

            // Append textual data using the dynamic loop you provided
            Object.entries(formData).forEach(([key, value]) => {
                if (key === "address") {
                    data.append("address", JSON.stringify(value));
                } else if (key === "password" || key === "confirmPassword") {
                    if (value) data.append(key, String(value)); // Only send password if modified
                } else if (value !== undefined && value !== null) {
                    data.append(key, String(value));
                }
            });

            // Append NEW files
            Object.entries(files).forEach(([key, file]) => {
                if (file) data.append(key, file);
            });

            await employeeService.updateEmployee(employeeId, data);
            handleBack();
        } catch (error: any) {
            console.error("API Error Details:", error);
            const backendErrorMsg =
                error.response?.data?.message || error.message || "An unknown error occurred.";
            const displayMsg = Array.isArray(backendErrorMsg)
                ? backendErrorMsg.join("\n")
                : backendErrorMsg;
            alert(`Update Failed:\n\n${displayMsg}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleBack = () => router.back();

    return {
        formData, existingUrls, errors, isLoading, isSubmitting, managerOptions,
        handleChange, handleAddressChange, handleFileChange, handleSyncAddresses, handleSubmit, handleBack
    };
};