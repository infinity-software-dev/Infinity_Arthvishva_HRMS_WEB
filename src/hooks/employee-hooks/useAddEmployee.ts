"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { employeeService } from "@/services/employee.service";
import imageCompression from "browser-image-compression";

// ── STATIC SCHEMAS ──
export const DEPARTMENTS = [
  "Director",
  "Engineering",
  "Sales",
  "Marketing",
  "Finance",
  "Operations",
  "HR",
  "IT",
  "Accountant",
  "Area Manager",
  "Driver",
  "Helper",
  "Office Boy",
  "Wealth Advisor",
  "BDM",
];

export const POSITIONS = [
  "Intern",
  "Junior Developer",
  "Software Developer",
  "Tester",
  "Android Developer",
  "iOS Developer",
  "App Developer",
  "Senior Developer",
  "Manager",
  "Director",
  "VP",
  "General Manager",
  "Specialist",
  "HR Executive",
  "System Administrator",
];

export const GRADUATION_COURSES = [
  "B.Tech",
  "BE",
  "BCA",
  "B.Sc",
  "BCS",
  "B.Com",
  "B.A",
  "BBA",
  "B.Ed",
  "Other",
];

export const POST_GRADUATION_COURSES = [
  "M.Tech",
  "ME",
  "MCA",
  "M.Sc",
  "MCS",
  "M.Com",
  "M.A",
  "MBA",
  "M.Ed",
  "Other",
];

export const useAddEmployee = () => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [managerOptions, setManagerOptions] = useState<
    { label: string; value: string }[]
  >([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState({
    employeeCode: "",
    password: "",
    confirmPassword: "",
    role: "Employee",
    isAppAdmin: false,
    status: "Active",
    name: "",
    email: "",
    mobileNumber: "",
    alternateMobileNumber: "",
    gender: "",
    bloodGroup: "",
    dateOfBirth: "",
    maritalStatus: "",
    fatherName: "",
    motherName: "",
    address: {
      current: { address: "", pinCode: "", state: "", district: "", city: "" },
      permanent: {
        address: "",
        pinCode: "",
        state: "",
        district: "",
        city: "",
      },
    },
    joiningDate: "",
    department: "",
    position: "",
    isLeadershipRole: false,
    salary: "",
    fixedAllowance: "",
    managerId: "",
    experienceType: "Fresher",
    totalExperienceYears: "",
    lastCompanyName: "",
    hscPercent: "",
    graduationCourse: "",
    graduationPercent: "",
    postGraduationCourse: "",
    postGraduationPercent: "",
    aadhaarNumber: "",
    panNumber: "",
    accountHolderName: "",
    bankName: "",
    accountNumber: "",
    ifsc: "",
    branch: "",
    emergencyContactName: "",
    emergencyContactRelationship: "",
    emergencyContactMobile: "",
    emergencyContactAddress: "",
    hasDisease: "No",
    diseaseName: "",
    diseaseType: "",
    diseaseSince: "",
    medicinesRequired: "",
    doctorName: "",
    doctorContact: "",
  });

  const [files, setFiles] = useState<{ [key: string]: File | null }>({
    profileImage: null,
    experienceCertificate: null,
    tenthMarksheet: null,
    twelfthMarksheet: null,
    graduationMarksheet: null,
    postGraduationMarksheet: null,
    aadhaarFile: null,
    panFile: null,
    passbookFile: null,
    medicalDocument: null,
  });

  // ── INITIAL DATA FETCHING ──
  useEffect(() => {
    let isMounted = true;

    const fetchInitialData = async () => {
      try {
        const [codeRes, managersRes] = await Promise.all([
          employeeService.getNewEmployeeCode(),
          employeeService.getManagerList(),
        ]);

        if (isMounted) {
          setFormData((prev) => ({
            ...prev,
            employeeCode: codeRes?.data || codeRes || "",
          }));

          const managers = managersRes?.data || managersRes || [];
          setManagerOptions(
            managers.map((m: any) => ({
              label: m.name,
              value: m._id,
            })),
          );
        }
      } catch (error) {
        console.error("Error fetching initial form data:", error);
      }
    };

    fetchInitialData();
    return () => {
      isMounted = false;
    };
  }, []);

  // ── HANDLERS ──
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value, type } = e.target;
    const val =
      type === "checkbox" ? (e.target as HTMLInputElement).checked : value;

    setFormData((prev) => ({
      ...prev,
      [name]: val,
    }));
  };

  const handleAddressChange = (
    type: "current" | "permanent",
    field: string,
    value: string,
  ) => {
    setFormData((prev) => ({
      ...prev,
      address: {
        ...prev.address,
        [type]: {
          ...prev.address[type],
          [field]: value,
        },
      },
    }));
  };

  const handleFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
    key: string,
  ) => {
    if (e.target.files && e.target.files[0]) {
      const originalFile = e.target.files[0];

      // Only compress image files (skip PDFs etc.)
      if (originalFile.type.startsWith("image/")) {
        const options = {
          maxSizeMB: 0.1, // Max file size 100KB
          maxWidthOrHeight: 1200,
          useWebWorker: true,
        };

        try {
          const compressedBlob = await imageCompression(originalFile, options);
          // Convert Blob back to File to keep Multer happy on backend
          const compressedFile = new File([compressedBlob], originalFile.name, {
            type: originalFile.type,
          });
          setFiles((prev) => ({ ...prev, [key]: compressedFile }));
        } catch (error) {
          console.error("Compression failed, using original", error);
          setFiles((prev) => ({ ...prev, [key]: originalFile }));
        }
      } else {
        setFiles((prev) => ({ ...prev, [key]: originalFile }));
      }
    }
  };

  const handleSyncAddresses = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setFormData((prev) => ({
        ...prev,
        address: {
          ...prev.address,
          permanent: { ...prev.address.current },
        },
      }));
    }
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const localErrors: Record<string, string> = {};

    //     // ── 1. BASIC DETAILS VALIDATION ──
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

    if (!formData.password) localErrors.password = "Password is required.";
    else if (formData.password.length < 6)
      localErrors.password = "Password must be at least 6 characters long.";

    if (formData.password !== formData.confirmPassword)
      localErrors.confirmPassword = "Passwords do not match.";

    //     // ── 2. PERSONAL DETAILS VALIDATION ──
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

    //     // ── 3. EXPERIENCE CONDITIONAL VALIDATION ──
    if (formData.experienceType === "Experienced") {
      if (!formData.totalExperienceYears)
        localErrors.totalExperienceYears =
          "Total experience track history is required.";
      if (!formData.lastCompanyName.trim())
        localErrors.lastCompanyName = "Last corporate entity name is required.";
    }

    //     // ── 4. JOB DETAILS VALIDATION ──
    if (!formData.joiningDate)
      localErrors.joiningDate = "Joining date is required.";
    if (!formData.department)
      localErrors.department = "Department routing config is required.";

    //     // ── 5. HEALTH CONDITIONAL VALIDATION ──
    if (formData.hasDisease === "Yes" && !formData.diseaseName?.trim()) {
      localErrors.diseaseName =
        "Disease condition profile summary name is required.";
    }

    //     // ── 6. EDUCATION VALIDATION ──
    if (!formData.hscPercent) {
      localErrors.hscPercent = "12th standard score percentage is required.";
    } else {
      const hscNum = Number(formData.hscPercent);
      if (hscNum < 0 || hscNum > 100)
        localErrors.hscPercent =
          "Percentage score must map cleanly between 0 and 100.";
    }

    //     // ── 7. IDENTITY PROOFS VALIDATION ──
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

    //     // ── 8. BANK DETAILS VALIDATION ──
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

    //     // ── EVALUATE CRITICAL RUNTIME ERRORS INTERCEPTION ──
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

      // Append flat text fields and flags
      data.append("employeeCode", formData.employeeCode);
      data.append("password", formData.password);
      data.append("role", formData.role);
      data.append("status", formData.status);
      data.append("isAppAdmin", String(formData.isAppAdmin));
      data.append("name", formData.name);
      data.append("email", formData.email.toLowerCase().trim());
      data.append("mobileNumber", formData.mobileNumber);
      data.append(
        "alternateMobileNumber",
        formData.alternateMobileNumber || "",
      );
      data.append("gender", formData.gender);
      data.append("bloodGroup", formData.bloodGroup);
      data.append("dateOfBirth", formData.dateOfBirth);
      data.append("maritalStatus", formData.maritalStatus);
      data.append("fatherName", formData.fatherName);
      data.append("motherName", formData.motherName);
      data.append("joiningDate", formData.joiningDate);
      data.append("department", formData.department);
      data.append("position", formData.position);
      data.append("isLeadershipRole", String(formData.isLeadershipRole));

      // Only append managerId if it actually has a value to prevent sending empty strings
      if (formData.managerId) data.append("managerId", formData.managerId);

      data.append("experienceType", formData.experienceType);
      if (formData.lastCompanyName)
        data.append("lastCompanyName", formData.lastCompanyName);
      if (formData.graduationCourse)
        data.append("graduationCourse", formData.graduationCourse);
      if (formData.postGraduationCourse)
        data.append("postGraduationCourse", formData.postGraduationCourse);

      // Format and typecast safe numeric data strings
      if (formData.salary)
        data.append("salary", String(Number(formData.salary)));
      if (formData.fixedAllowance)
        data.append("fixedAllowance", String(Number(formData.fixedAllowance)));
      if (formData.totalExperienceYears)
        data.append(
          "totalExperienceYears",
          String(Number(formData.totalExperienceYears)),
        );
      if (formData.hscPercent)
        data.append("hscPercent", String(Number(formData.hscPercent)));
      if (formData.graduationPercent)
        data.append(
          "graduationPercent",
          String(Number(formData.graduationPercent)),
        );
      if (formData.postGraduationPercent)
        data.append(
          "postGraduationPercent",
          String(Number(formData.postGraduationPercent)),
        );

      // Handle specific ID Proofs and Banking Info safely
      data.append("aadhaarNumber", formData.aadhaarNumber);
      data.append("panNumber", formData.panNumber.toUpperCase().trim());
      data.append("accountHolderName", formData.accountHolderName);
      data.append("bankName", formData.bankName);
      data.append("accountNumber", formData.accountNumber);
      data.append("ifsc", formData.ifsc.toUpperCase().trim());
      data.append("branch", formData.branch);

      // Handle Emergency Details
      data.append("emergencyContactName", formData.emergencyContactName);
      data.append(
        "emergencyContactRelationship",
        formData.emergencyContactRelationship,
      );
      data.append("emergencyContactMobile", formData.emergencyContactMobile);
      data.append("emergencyContactAddress", formData.emergencyContactAddress);

      // Handle Health fields
      data.append("hasDisease", formData.hasDisease);
      if (formData.hasDisease === "Yes") {
        data.append("diseaseName", formData.diseaseName);
        data.append("diseaseType", formData.diseaseType);
        data.append("diseaseSince", formData.diseaseSince);
        data.append("medicinesRequired", formData.medicinesRequired);
        data.append("doctorName", formData.doctorName);
        data.append("doctorContact", formData.doctorContact);
      }

      // 2. THE FIX: Send address as a single stringified JSON object
      data.append("address", JSON.stringify(formData.address));

      // Append raw dynamic files
      if (files.profileImage) data.append("profileImage", files.profileImage);
      if (files.experienceCertificate)
        data.append("experienceCertificate", files.experienceCertificate);
      if (files.tenthMarksheet)
        data.append("tenthMarksheet", files.tenthMarksheet);
      if (files.twelfthMarksheet)
        data.append("twelfthMarksheet", files.twelfthMarksheet);
      if (files.graduationMarksheet)
        data.append("graduationMarksheet", files.graduationMarksheet);
      if (files.postGraduationMarksheet)
        data.append("postGraduationMarksheet", files.postGraduationMarksheet);
      if (files.aadhaarFile) data.append("aadhaarFile", files.aadhaarFile);
      if (files.panFile) data.append("panFile", files.panFile);
      if (files.passbookFile) data.append("passbookFile", files.passbookFile);
      if (files.medicalDocument)
        data.append("medicalDocument", files.medicalDocument);

      await employeeService.createEmployee(data);
      router.back();
    } catch (error: any) {
      // await logToTerminal("API Error Details:", error);
      console.error("API Error Details:", error);

      // 3. THE FIX: Display the actual backend error so you know exactly what failed
      const backendErrorMsg =
        error.response?.data?.message ||
        error.message ||
        "An unknown error occurred.";

      // Format array messages nicely if NestJS class-validator sends an array
      const displayMsg = Array.isArray(backendErrorMsg)
        ? backendErrorMsg.join("\n")
        : backendErrorMsg;

      alert(`Save Failed:\n\n${displayMsg}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => router.back();

  return {
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
  };
};
