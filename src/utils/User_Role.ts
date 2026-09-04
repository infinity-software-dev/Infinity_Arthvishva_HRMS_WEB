import { DASHBOARD_NAV } from "@/constants/Sidebar/navigation";

export function getFilteredNav(navGroups: typeof DASHBOARD_NAV) {
    if (typeof window === "undefined") return navGroups;

    // Adjust the key according to how your role is stored:
    // e.g., localStorage.getItem("role") OR JSON.parse(localStorage.getItem("user") || "{}").role
    const rawUser = localStorage.getItem("user");
    const role = rawUser ? JSON.parse(rawUser)?.role : localStorage.getItem("role");

    return navGroups.map((group) => ({
        ...group,
        items: group.items.filter((item: any) => {
            // Hide if the user's role is explicitly excluded
            if (item.excludedRoles?.includes(role)) {
                return false;
            }

            // Hide if requiredRoles is defined and user's role is not included
            if (item.requiredRoles && !item.requiredRoles.includes(role)) {
                return false;
            }

            return true;
        }),
    }));
}