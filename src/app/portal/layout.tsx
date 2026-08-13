import ToastProvider from "@/components/providers/ToastProvider";
import AuthGuard from "../auth/AuthGuard";
import PortalSidebar from "@/components/bars/PortalSidebar";

export default function PortalLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (


        <AuthGuard>
            <div className="min-h-screen bg-background w-full transition-colors duration-300 flex">

                <PortalSidebar />

                {/* Main Content Area 
            - On mobile: Add top padding (pt-20) to account for the mobile header.
            - On desktop: Add left margin (md:ml-64) to account for the fixed sidebar.
        */}
                <ToastProvider />
                <main className="flex-1 w-full p-4 pt-20 md:p-8 md:pt-8 md:ml-64">
                    {children}
                </main>

            </div>
        </AuthGuard>
    );
}