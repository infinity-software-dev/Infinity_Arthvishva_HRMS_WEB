import {
    LayoutDashboard,
    CalendarCheck,
    Users,
    CreditCard,
    UserCircle,
    FileText,
    Clock,
    GraduationCap,
    Megaphone,
    FileArchive,
    FileTerminal,
    PlaneTakeoff,
    HandCoins,
} from "lucide-react";

// --- MANAGEMENT STACK (HR & DIRECTOR) ---
export const DASHBOARD_NAV = [
    {
        label: "MAIN MENU",
        items: [
            {
                title: "Overview",
                url: "/dashboard",
                icon: LayoutDashboard,
            },
            {
                title: "Attendance",
                url: "/dashboard/attendance",
                icon: CalendarCheck,
            },
            {
                title: "Employee Management",
                url: "/dashboard/employees",
                icon: Users,
                requiredRoles: ["HR", "DIRECTOR"],
            },
            {
                title: "Leave Management",
                url: "/dashboard/leaves",
                icon: PlaneTakeoff,
                requiredRoles: ["HR", "DIRECTOR"],
            },
            {
                title: "Payroll",
                url: "/dashboard/payroll",
                icon: CreditCard,
                requiredRoles: ["HR", "DIRECTOR"],
            },
            {
                title: "Reimbursement",
                url: "/dashboard/reimbursement",
                icon: HandCoins,
                requiredRoles: ["HR", "DIRECTOR"],
            },
            {
                title: "Gurukul Admin",
                url: "/dashboard/gurukul",
                icon: GraduationCap,
                requiredRoles: ["HR", "DIRECTOR"],
            },
            {
                title: "Announcements",
                url: "/dashboard/announcements",
                icon: Megaphone,
                requiredRoles: ["HR", "DIRECTOR"],
            },
            {
                title: "Holidays",
                url: "/dashboard/holidays",
                icon: CalendarCheck,
                requiredRoles: ["HR", "DIRECTOR"],
            },
            {
                title: "Complaints",
                url: "/dashboard/complaints",
                icon: FileTerminal,
                requiredRoles: ["HR", "DIRECTOR"],
                excludedRoles: ["HR"], // <-- Add this
            },
            // {
            //     title: "Resignation",
            //     url: "/dashboard/resignations",
            //     icon: FileArchive,
            //     requiredRoles: ["HR", "DIRECTOR"],
            // },
        ],
    },
    {
        label: "ACCOUNT",
        items: [
            {
                title: "My Profile",
                url: "/dashboard/profile",
                icon: UserCircle,
            },
        ]
    }
];

// --- SELF-SERVICE STACK (STANDARD EMPLOYEE) ---
export const PORTAL_NAV = [
    {
        label: "MY WORKSPACE",
        items: [
            {
                title: "Overview",
                url: "/portal",
                icon: LayoutDashboard,
            },
            {
                title: "Attendance Center",
                url: "/portal/attendance",
                icon: Clock,
            },
            {
                title: "Leaves Center",
                url: "/portal/leaves",
                icon: PlaneTakeoff,
            },
            {
                title: "Payroll Center",
                url: "/portal/payroll",
                icon: CreditCard,
            },
            {
                title: "Reimbursement Center",
                url: "/portal/reimbursement",
                icon: HandCoins,
            },
            // {
            //     title: "Complaints Center",
            //     url: "/portal/complaints",
            //     icon: FileTerminal,
            // },
        ],
    },
    {
        label: "ACCOUNT",
        items: [
            {
                title: "My Profile",
                url: "/portal/profile",
                icon: UserCircle,
            },
        ]
    }
];