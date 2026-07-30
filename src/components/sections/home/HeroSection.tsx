import { ArrowRightIcon } from "@/components/icons/Icons"
import Link from "next/link"
import DashboardMockup from "./DashboardMockup"

function HeroSection() {
    return (
        <div className="flex-1 flex flex-col items-center relative">
            {/* Version Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-blue/10 border border-brand-blue/20 text-brand-blue text-xs font-bold uppercase tracking-wider mb-8 animate-fade-in-up">
                <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-green opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-green"></span>
                </span>
                IA HRMS V3.0 is live
            </div>

            {/* Main Heading */}
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold text-center tracking-tight mb-6 max-w-5xl leading-[1.1]">
                People Operations <br className="hidden md:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-blue to-brand-green bg-300% animate-gradient">
                    Simplified.
                </span>
            </h1>

            {/* Subheading */}
            <p className="text-lg md:text-xl text-secondary dark:text-gray-400 text-center max-w-2xl mb-10 leading-relaxed">
                Stop juggling spreadsheets. Manage employee directories, automate attendance tracking, streamline leave requests, and oversee your entire workforce from one unified dashboard.
            </p>

            {/* Call to Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto px-4">
                <Link
                    href="/dashboard"
                    className="h-12 px-8 rounded-full bg-gradient-to-r from-brand-blue to-brand-green  text-white dark:bg-white dark:text-black font-semibold flex items-center justify-center gap-2 hover:translate-y-[-2px] transition-all shadow-xl shadow-primary/20 dark:shadow-white/5 w-full sm:w-auto"
                >
                    Launch Workspace <ArrowRightIcon className="w-4 h-4" />
                </Link>
                {/* <button className="h-12 px-8 rounded-full bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 font-medium hover:bg-gray-50 dark:hover:bg-white/10 transition-colors flex items-center justify-center gap-2 w-full sm:w-auto">
                    View Interactive Demo
                </button> */}
            </div>

            {/* Dashboard Mockup Graphic */}
            <DashboardMockup />
        </div>
    )
}

export default HeroSection