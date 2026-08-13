// services/employeeProtalServices/types.ts

export interface AddressDetail {
    address: string;
    pinCode: string;
    state: string;
    district: string;
    city: string;
}

export interface EmployeeAddress {
    current: AddressDetail;
    permanent: AddressDetail;
}

export interface EmployeeProfile {
    _id: string;
    employeeCode: string;
    status: 'Active' | 'Inactive' | string;
    name: string;
    email: string;
    mobileNumber: string;
    alternateMobileNumber?: string;
    gender: 'Male' | 'Female' | 'Other' | string;
    bloodGroup: string;
    dateOfBirth: string; // ISO date string
    maritalStatus: string;
    profileImageUrl: string;
    fatherName: string;
    motherName: string;
    district: string;
    state: string;
    pincode: string;
    currentAddress: string;
    permanentAddress: string;
    joiningDate: string; // ISO date string
    department: string;
    position: string;
    lastCompanyName?: string;
    totalExperienceYears: number | null;
    hscPercent: number;
    graduationCourse: string;
    graduationPercent: number;
    postGraduationCourse?: string;
    postGraduationPercent: number | null;
    panNumber: string;
    accountHolderName: string;
    bankName: string;
    accountNumber: string;
    ifsc: string;
    branch: string;
    bankVerified: boolean;
    aadhaarVerified: boolean;
    panVerified: boolean;
    emergencyContactName: string;
    emergencyContactRelationship: string;
    emergencyContactMobile: string;
    emergencyContactAddress: string;
    hasDisease: 'Yes' | 'No' | string;
    diseaseName?: string;
    compOffBalance: number;
    paidLeaveBalance: number;
    lastLeaveAccrualDate: string | null;
    lastWorkingDate: string | null;
    refreshToken: string | null;
    fcmToken: string;
    createdAt: string; // ISO date string
    updatedAt: string; // ISO date string
    salary: number;
    fixedAllowance: number;
    isLeadershipRole: boolean;
    isAppAdmin: boolean;
    role: string;
    managerId: string;
    address: EmployeeAddress;
    aadhaarNumber: string;
    experienceType: 'Fresher' | 'Experienced' | string;
    faceDescriptors?: number[][];
}

// Wrapper for API responses matching your controller structure
export interface ApiResponse<T> {
    statusCode: number;
    message: string;
    data: T;
}

// ----------------------------------------------------
// RAW DATA (Directly from NestJS Backend)
// ----------------------------------------------------
export interface RawAttendanceDocument {
    _id?: string;
    inTime?: string;  // ISO String
    outTime?: string; // ISO String
    totalHours?: number;
    isLate?: boolean;
    lateMinutes?: number;
    status?: string;
    workMode:string;
}

export interface RawPerformanceInsights {
    present: number;
    absent: number;
    working: number;
    late: number;
    totalHours: number;
}

// ----------------------------------------------------
// UI FORMATTED DATA (Used by React Components)
// ----------------------------------------------------
export interface UIFormattedPunchStatus {
    isPunchedIn: boolean;
    inTime: string | null;
    outTime: string | null;
    loggedHours: string;
}

export interface UIFormattedStats {
    presentDays: number;
    workingDays: number;
    lateArrivals: number;
    totalHours: string;
}

export interface PortalDashboardData {
    punchStatus: UIFormattedPunchStatus | null;
    stats: UIFormattedStats | null;
}

export interface SystemConfig {
    office_lat: number;
    office_lon: number;
    radius_meters: number;
    shift_hours: number;
}

export interface CheckInPayload {
    latitude?: number;
    longitude?: number;
    workMode: 'Office' | 'Field' | 'WFH' | string;
}