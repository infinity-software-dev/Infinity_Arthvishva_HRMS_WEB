"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Image from "next/image";
import { Menu, X, LogOut } from "lucide-react";
import GradientText from "../elements/GradientText";
import { PORTAL_NAV } from "@/constants/Sidebar/navigation";
import ThemeToggleSwitch from "../buttons/ThemeToggle";

export default function PortalSidebar() {
    const pathname = usePathname();
    const router = useRouter();

    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const closeMobileMenu = () => setIsMobileMenuOpen(false);

    const handleLogout = () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("role");
        localStorage.removeItem("user");
        router.replace("/auth");
    };

    return (
        <>
            <header className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white dark:bg-primary border-b border-gray-100 dark:border-white/5 flex items-center justify-between px-4 z-40">
                <Link href="/portal" className="flex items-center gap-2 font-bold">
                    <Image src="/images/icon.png" alt="IA Portal" width={28} height={28} className="rounded-md" />
                    <GradientText from="var(--color-brand-blue)" to="var(--color-brand-green)" className="tracking-widest text-xl font-extrabold uppercase">
                        HRMS
                    </GradientText>
                </Link>
                <button
                    onClick={() => setIsMobileMenuOpen(true)}
                    className="p-2 text-primary dark:text-white focus:outline-none"
                >
                    <Menu className="w-6 h-6" />
                </button>
            </header>

            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity"
                    onClick={closeMobileMenu}
                />
            )}

            <aside
                className={`fixed inset-y-0 left-0 w-64 bg-white dark:bg-[#0A0A0A] border-r border-gray-100 dark:border-white/5 shadow-xl md:shadow-none z-50 flex flex-col transition-transform duration-300 ease-in-out ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
                    }`}
            >
                <div className="h-16 md:h-24 flex items-center justify-between px-6 border-b border-gray-100 dark:border-white/5 shrink-0">
                    <Link href="/portal" className="flex items-center gap-2 text-xl font-bold tracking-tight">
                        <Image src="/images/icon.png" alt="IA Portal" width={32} height={32} className="rounded-md" />
                        <GradientText from="var(--color-brand-blue)" to="var(--color-brand-green)" className="uppercase tracking-widest font-extrabold">
                            HRMS
                        </GradientText>
                    </Link>
                    <button onClick={closeMobileMenu} className="md:hidden text-gray-500 hover:text-primary dark:hover:text-white">
                        <X className="w-6 h-6" />
                    </button>
                    <ThemeToggleSwitch />
                </div>

                <div className="flex-1 overflow-y-auto py-6 space-y-8">
                    {isMounted && PORTAL_NAV.map((section) => (
                        <div key={section.label} className="px-4">
                            <p className="px-4 text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                                {section.label}
                            </p>
                            <div className="space-y-1">
                                {section.items.map((item) => {
                                    const isBaseRoute = item.url === "/portal" || item.url === "/";
                                    const isActive = isBaseRoute
                                        ? pathname === item.url
                                        : pathname === item.url || pathname.startsWith(`${item.url}/`);

                                    const Icon = item.icon;

                                    return (
                                        <Link
                                            key={item.url}
                                            href={item.url}
                                            onClick={closeMobileMenu}
                                            className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${isActive
                                                ? "bg-gradient-to-r from-brand-blue to-brand-green text-white dark:bg-white dark:text-primary shadow-md"
                                                : "text-secondary dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-primary dark:hover:text-white"
                                                }`}
                                        >
                                            <Icon className={`w-5 h-5 ${isActive ? "" : "opacity-70"}`} />
                                            {item.title}
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="p-4 border-t border-gray-100 dark:border-white/5 shrink-0">
                    <button
                        onClick={handleLogout}
                        className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-white/10 text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all duration-200 group"
                    >
                        <LogOut className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        Logout
                    </button>
                </div>
            </aside>
        </>
    );
}