"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { employeeService } from '@/services/employee.service';
import imageCompression from 'browser-image-compression';
import apiClient from '@/constants/API/client';
import { KYC_API } from '@/constants/API/api';

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
        aadhaarName: '', panName: '', panDob: '',
        aadhaarVerified: false, panVerified: false, bankVerified: false,
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
                            aadhaarName: emp.aadhaarName || '',
                            panNumber: emp.panNumber || '',
                            panName: emp.panName || emp.name || '',
                            panDob: emp.panDob || (emp.dateOfBirth ? new Date(emp.dateOfBirth).toISOString().split('T')[0] : ''),
                            aadhaarVerified: !!emp.aadhaarVerified,
                            panVerified: !!emp.panVerified,
                            bankVerified: !!emp.bankVerified,
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

    // Sync verification status and fields from loaded employee data
    useEffect(() => {
        if (formData.aadhaarVerified) {
            setAadhaarVerified(true);
            const nameToDisplay = formData.aadhaarName || formData.name || '';
            if (nameToDisplay) setAadhaarRegisteredName(nameToDisplay);
        } else if (formData.aadhaarName) {
            setAadhaarRegisteredName(formData.aadhaarName);
        }

        if (formData.panVerified) setPanVerified(true);
        if (formData.panName) {
            setPanName(formData.panName);
        } else if (formData.panVerified && formData.name) {
            setPanName(formData.name);
        }
        if (formData.panDob) setPanDob(formData.panDob);

        if (formData.bankVerified) {
            setBankVerified(true);
            if (formData.accountHolderName) setBankRegisteredName(formData.accountHolderName);
        }
    }, [formData.aadhaarVerified, formData.aadhaarName, formData.name, formData.panVerified, formData.panName, formData.panDob, formData.bankVerified, formData.accountHolderName]);

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

    // ── KYC API HANDLERS ──
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
            if (verifiedName) setAadhaarRegisteredName(verifiedName);

            setAadhaarVerified(true);
            setFormData(prev => ({ ...prev, aadhaarVerified: true, aadhaarName: verifiedName }));

            await employeeService.updateKycStatus(employeeId, {
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
            setFormData(prev => ({ ...prev, panVerified: true, panName, panDob }));

            await employeeService.updateKycStatus(employeeId, {
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
            setBankError('Please enter Account Number.'); return;
        }
        if (!formData.ifsc || !String(formData.ifsc).trim()) {
            setBankError('Please enter IFSC Code.'); return;
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
            if (regName) setBankRegisteredName(regName);

            if (result?.bank_name && !formData.bankName) {
                setFormData(prev => ({ ...prev, bankName: result.bank_name }));
            }
            if (result?.branch && !formData.branch) {
                setFormData(prev => ({ ...prev, branch: result.branch }));
            }

            setBankVerified(true);
            setFormData(prev => ({ ...prev, bankVerified: true }));

            await employeeService.updateKycStatus(employeeId, {
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const localErrors: Record<string, string> = {};

        if (!formData.name.trim()) localErrors.name = "Full Name is required.";
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!formData.email.trim()) localErrors.email = "Email address is required.";
        else if (!emailRegex.test(formData.email)) localErrors.email = "Please enter a valid email format.";

        const mobileRegex = /^\d{10}$/;
        if (!formData.mobileNumber.trim()) localErrors.mobileNumber = "Mobile number is required.";
        else if (!mobileRegex.test(formData.mobileNumber.trim())) localErrors.mobileNumber = "Mobile number must be exactly 10 digits.";
        if (formData.alternateMobileNumber?.trim() && !mobileRegex.test(formData.alternateMobileNumber.trim())) {
            localErrors.alternateMobileNumber = "Alternate mobile number must be exactly 10 digits.";
        }

        if (formData.password) {
            if (formData.password.length < 6) localErrors.password = "Password must be at least 6 characters long.";
            if (formData.password !== formData.confirmPassword) localErrors.confirmPassword = "Passwords do not match.";
        }

        if (!formData.gender) localErrors.gender = "Gender selection is required.";
        if (!formData.dateOfBirth) {
            localErrors.dateOfBirth = "Date of Birth is required.";
        } else {
            if (new Date(formData.dateOfBirth) >= new Date()) localErrors.dateOfBirth = "Date of Birth must be in the past.";
        }

        if (!formData.address.current.address.trim()) localErrors.currentAddress = "Street address is required.";
        if (!formData.address.current.pinCode.trim()) localErrors.currentPin = "Pin Code is required.";
        else if (!/^\d{6}$/.test(formData.address.current.pinCode.trim())) localErrors.currentPin = "Pin Code must be exactly 6 digits.";
        if (!formData.address.current.city.trim()) localErrors.currentCity = "City is required.";
        if (!formData.address.current.state.trim()) localErrors.currentState = "State is required.";
        if (!formData.address.current.district.trim()) localErrors.currentDistrict = "District is required.";

        if (!formData.address.permanent.address.trim()) localErrors.permanentAddress = "Permanent street address is required.";
        if (!formData.address.permanent.pinCode.trim()) localErrors.permanentPin = "Permanent Pin Code is required.";
        else if (!/^\d{6}$/.test(formData.address.permanent.pinCode.trim())) localErrors.permanentPin = "Permanent Pin Code must be exactly 6 digits.";
        if (!formData.address.permanent.city.trim()) localErrors.permanentCity = "Permanent City is required.";
        if (!formData.address.permanent.state.trim()) localErrors.permanentState = "Permanent State is required.";
        if (!formData.address.permanent.district.trim()) localErrors.permanentDistrict = "Permanent District is required.";

        if (formData.experienceType === "Experienced") {
            if (!formData.totalExperienceYears) localErrors.totalExperienceYears = "Total experience track history is required.";
            if (!formData.lastCompanyName.trim()) localErrors.lastCompanyName = "Last corporate entity name is required.";
        }

        if (!formData.joiningDate) localErrors.joiningDate = "Joining date is required.";
        if (formData.role === "Employee" && !formData.employmentDate) localErrors.employmentDate = "Employment date is required for regular employees.";
        if (!formData.department) localErrors.department = "Department routing config is required.";

        if (formData.hasDisease === "Yes" && !formData.diseaseName?.trim()) {
            localErrors.diseaseName = "Disease condition profile summary name is required.";
        }

        if (!formData.hscPercent) {
            localErrors.hscPercent = "12th standard score percentage is required.";
        } else {
            const hscNum = Number(formData.hscPercent);
            if (hscNum < 0 || hscNum > 100) localErrors.hscPercent = "Percentage score must map cleanly between 0 and 100.";
        }

        if (!formData.aadhaarNumber?.trim()) localErrors.aadhaarNumber = "Aadhaar evaluation identification number is required.";
        else if (!/^\d{12}$/.test(formData.aadhaarNumber.trim())) localErrors.aadhaarNumber = "Aadhaar registration sequences must be exactly 12 digits.";

        const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
        if (!formData.panNumber?.trim()) localErrors.panNumber = "PAN layout identification alphanumeric string is required.";
        else if (!panRegex.test(formData.panNumber.toUpperCase().trim())) localErrors.panNumber = "Invalid format structure layout guidelines (Expected: ABCDE1234F).";

        if (!formData.accountHolderName.trim()) localErrors.accountHolderName = "Account holder verification title string is required.";
        if (!formData.bankName.trim()) localErrors.bankName = "Banking clear clearing string node identity title is required.";
        if (!formData.accountNumber.trim()) localErrors.accountNumber = "Settlement account banking system distribution numeric line string is required.";
        const ifscRegex = /^[A-Z]{4}0[A-Z0-9]{6}$/;
        if (!formData.ifsc.trim()) localErrors.ifsc = "IFSC banking branch system clear verification routing string sequence is required.";
        else if (!ifscRegex.test(formData.ifsc.toUpperCase().trim())) localErrors.ifsc = "Invalid system standard core code pattern formatting (Expected: HDFC0001234).";
        if (!formData.branch.trim()) localErrors.branch = "Branch structural settlement context locator label string required.";

        if (!formData.emergencyContactName.trim()) localErrors.emergencyContactName = "Emergency contact name node identity is required.";
        if (!formData.emergencyContactMobile.trim()) localErrors.emergencyContactMobile = "Emergency backup callback sequence mobile target line is required.";
        else if (!mobileRegex.test(formData.emergencyContactMobile.trim())) localErrors.emergencyContactMobile = "Emergency connectivity mobile contact number target lines require exactly 10 digits.";

        if (Object.keys(localErrors).length > 0) {
            setErrors(localErrors);
            const firstErrorKey = Object.keys(localErrors)[0];
            const errorInputNode = document.getElementsByName(firstErrorKey)[0];
            if (errorInputNode) {
                errorInputNode.scrollIntoView({ behavior: "smooth", block: "center" });
                errorInputNode.focus();
            }
            return;
        }

        setErrors({});

        try {
            setIsSubmitting(true);
            const data = new FormData();

            // Uppercase ID & Name
            data.append("employeeCode", formData.employeeCode.toUpperCase().trim());
            data.append("name", formData.name.toUpperCase().trim());

            // Password only appended if populated
            if (formData.password) data.append("password", formData.password);

            // Exact / Lowercase / Enums
            data.append("email", formData.email.toLowerCase().trim());
            data.append("role", formData.role);
            data.append("status", formData.status);
            data.append("isAppAdmin", String(formData.isAppAdmin));
            data.append("mobileNumber", formData.mobileNumber.trim());
            data.append("alternateMobileNumber", formData.alternateMobileNumber ? formData.alternateMobileNumber.trim() : "");
            data.append("gender", formData.gender);
            data.append("bloodGroup", formData.bloodGroup);
            data.append("dateOfBirth", formData.dateOfBirth);
            data.append("maritalStatus", formData.maritalStatus);
            data.append("joiningDate", formData.joiningDate);
            if (formData.role === 'Employee' && formData.employmentDate) {
                data.append("employmentDate", formData.employmentDate);
            }
            data.append("department", formData.department);
            data.append("position", formData.position);
            data.append("isLeadershipRole", String(formData.isLeadershipRole));

            // Uppercase Parents
            data.append("fatherName", formData.fatherName.toUpperCase().trim());
            data.append("motherName", formData.motherName.toUpperCase().trim());

            // Experience & Education
            if (formData.managerId) data.append("managerId", formData.managerId);
            data.append("experienceType", formData.experienceType);

            if (formData.lastCompanyName) {
                data.append("lastCompanyName", formData.lastCompanyName.toUpperCase().trim());
            }

            if (formData.graduationCourse) data.append("graduationCourse", formData.graduationCourse);
            if (formData.postGraduationCourse) data.append("postGraduationCourse", formData.postGraduationCourse);

            // Numbers
            if (formData.salary) data.append("salary", String(Number(formData.salary)));
            if (formData.fixedAllowance) data.append("fixedAllowance", String(Number(formData.fixedAllowance)));
            if (formData.totalExperienceYears) data.append("totalExperienceYears", String(Number(formData.totalExperienceYears)));
            if (formData.hscPercent) data.append("hscPercent", String(Number(formData.hscPercent)));
            if (formData.graduationPercent) data.append("graduationPercent", String(Number(formData.graduationPercent)));
            if (formData.postGraduationPercent) data.append("postGraduationPercent", String(Number(formData.postGraduationPercent)));

            // KYC & Identity
            data.append("aadhaarNumber", formData.aadhaarNumber.trim());
            data.append("aadhaarVerified", String(formData.aadhaarVerified));
            if (formData.aadhaarName) {
                data.append("aadhaarName", formData.aadhaarName.toUpperCase().trim());
            }

            data.append("panNumber", formData.panNumber.toUpperCase().trim());
            data.append("panVerified", String(formData.panVerified));
            if (formData.panName) {
                data.append("panName", formData.panName.toUpperCase().trim());
            }
            if (formData.panDob) data.append("panDob", formData.panDob);

            // Banking
            data.append("accountHolderName", formData.accountHolderName.toUpperCase().trim());
            data.append("bankName", formData.bankName.toUpperCase().trim());
            data.append("accountNumber", formData.accountNumber.trim());
            data.append("ifsc", formData.ifsc.toUpperCase().trim());
            data.append("branch", formData.branch.toUpperCase().trim());
            data.append("bankVerified", String(formData.bankVerified));

            // Emergency Contact
            data.append("emergencyContactName", formData.emergencyContactName.toUpperCase().trim());
            data.append("emergencyContactRelationship", formData.emergencyContactRelationship.toUpperCase().trim());
            data.append("emergencyContactMobile", formData.emergencyContactMobile.trim());
            if (formData.emergencyContactAddress) {
                data.append("emergencyContactAddress", formData.emergencyContactAddress.toUpperCase().trim());
            }

            // Health
            data.append("hasDisease", formData.hasDisease);
            if (formData.hasDisease === "Yes") {
                data.append("diseaseName", formData.diseaseName.toUpperCase().trim());
                data.append("diseaseType", formData.diseaseType.toUpperCase().trim());
                data.append("diseaseSince", formData.diseaseSince.trim());
                if (formData.medicinesRequired) data.append("medicinesRequired", formData.medicinesRequired.toUpperCase().trim());
                if (formData.doctorName) data.append("doctorName", formData.doctorName.toUpperCase().trim());
                if (formData.doctorContact) data.append("doctorContact", formData.doctorContact.trim());
            }

            // Address Parsing & Uppercase Transformation
            const uppercaseAddress = {
                current: {
                    address: formData.address.current.address.toUpperCase().trim(),
                    pinCode: formData.address.current.pinCode.trim(),
                    state: formData.address.current.state.toUpperCase().trim(),
                    district: formData.address.current.district.toUpperCase().trim(),
                    city: formData.address.current.city.toUpperCase().trim()
                },
                permanent: {
                    address: formData.address.permanent.address.toUpperCase().trim(),
                    pinCode: formData.address.permanent.pinCode.trim(),
                    state: formData.address.permanent.state.toUpperCase().trim(),
                    district: formData.address.permanent.district.toUpperCase().trim(),
                    city: formData.address.permanent.city.toUpperCase().trim()
                }
            };
            data.append("address", JSON.stringify(uppercaseAddress));

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
        formData, setFormData, existingUrls, errors, isLoading, isSubmitting, managerOptions,
        handleChange, handleAddressChange, handleFileChange, handleSyncAddresses, handleSubmit, handleBack,

        // KYC Exports
        aadhaarOtpSent, setAadhaarOtpSent, aadhaarOtp, setAadhaarOtp,
        aadhaarVerified, aadhaarLoading, aadhaarError, aadhaarRegisteredName, setAadhaarReferenceId, setAadhaarError,
        handleSendAadhaarOtp, handleVerifyAadhaarOtp,
        panName, setPanName, panDob, setPanDob, panVerified, panLoading, panError, handleVerifyPan,
        bankVerified, bankLoading, bankError, bankRegisteredName, handleVerifyBank
    };
};