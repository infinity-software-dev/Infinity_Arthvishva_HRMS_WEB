"use client";

import { useState } from "react";

export default function DashboardSnippetMockup() {
    // Local state just for the mockup visual
    const [isMockDark, setIsMockDark] = useState(false);

    return (
        /* The wrapper controls the dark mode strictly for its children */
        <div className={isMockDark ? "dark" : ""}>
            <div className="mt-20 relative w-full max-w-[1400px] mx-auto perspective-1000">
                {/* Background Glow - shifts slightly in dark mode */}
                <div className={`absolute -inset-4 blur-3xl rounded-[3rem] -z-10 transition-colors duration-700 ${isMockDark ? 'bg-gradient-to-r from-indigo-500/20 to-purple-500/20' : 'bg-gradient-to-r from-[#0D8C8C]/30 to-blue-500/20'}`}></div>

                {/* Browser Window Wrapper */}
                <div className="relative bg-[#F4F7F9] dark:bg-[#0a0a0c] rounded-2xl border border-gray-200 dark:border-white/10 shadow-2xl overflow-hidden aspect-[16/10] sm:aspect-[21/9] transform rotate-x-12 transition-all duration-700 hover:rotate-x-0 group">

                    {/* Mockup Browser Bar */}
                    <div className="absolute top-0 left-0 right-0 h-10 bg-white dark:bg-[#151518] border-b border-gray-200 dark:border-white/5 flex items-center px-4 gap-2 z-30 transition-colors duration-500">
                        <div className="flex gap-1.5">
                            <div className="w-2.5 h-2.5 rounded-full bg-[#FF5F56]"></div>
                            <div className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E]"></div>
                            <div className="w-2.5 h-2.5 rounded-full bg-[#27C93F]"></div>
                        </div>
                        <div className="mx-auto w-1/3 h-5 bg-slate-100 dark:bg-white/5 rounded-md text-[9px] flex items-center justify-center text-gray-400 font-medium tracking-wide transition-colors duration-500">
                            hrms.infinityarthvishva.com
                        </div>
                    </div>

                    {/* Main Application Interface */}
                    <div className="flex h-full pt-10">

                        {/* Left Sidebar */}
                        <div className="w-[200px] flex-shrink-0 bg-white border-r border-gray-100 dark:bg-[#0F0F11] dark:border-white/5 hidden sm:flex flex-col z-20 transition-colors duration-500">
                            {/* Logo & Toggle */}
                            <div className="flex items-center justify-between p-4 border-b border-gray-50 dark:border-white/5 transition-colors duration-500">
                                <div className="flex items-center gap-1.5">
                                    <div className="h-7 w-7 rounded-full bg-[#0FA4A4] text-white flex items-center justify-center text-[10px] font-bold tracking-wider">IA</div>
                                    <span className="text-[#0FA4A4] font-extrabold text-sm tracking-wide">HRMS</span>
                                </div>

                                {/* INTERACTIVE MOCK TOGGLE */}
                                <button
                                    onClick={() => setIsMockDark(!isMockDark)}
                                    className={`relative flex h-5 w-10 items-center rounded-full p-0.5 border transition-colors duration-500 ease-in-out focus:outline-none ${isMockDark ? "bg-[#1A1A1E] border-gray-700" : "bg-amber-100 border-amber-200"
                                        }`}
                                >
                                    <div
                                        className={`flex h-4 w-4 items-center justify-center rounded-full shadow-sm transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${isMockDark ? "translate-x-4.5 bg-indigo-500" : "translate-x-0 bg-amber-400"
                                            }`}
                                    >
                                        {isMockDark ? (
                                            <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                                            </svg>
                                        ) : (
                                            <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4.22 1.32a1 1 0 011.415 0l.708.708a1 1 0 01-1.414 1.414l-.708-.708a1 1 0 010-1.414zM16 10a1 1 0 011 1h1a1 1 0 110-2h-1a1 1 0 01-1 1zm-1.32 4.22a1 1 0 010 1.415l-.708.708a1 1 0 01-1.414-1.414l.708-.708a1 1 0 011.415 0zM10 16a1 1 0 01-1-1v-1a1 1 0 112 0v1a1 1 0 01-1 1zm-4.22-1.32a1 1 0 01-1.415 0l-.708-.708a1 1 0 011.414-1.414l.708.708a1 1 0 010 1.414zM4 10a1 1 0 01-1-1H2a1 1 0 110 2h1a1 1 0 011-1zM5.32 5.78a1 1 0 010-1.415l.708-.708a1 1 0 011.414 1.414l-.708.708a1 1 0 01-1.415 0zM10 5a5 5 0 100 10 5 5 0 000-10z" clipRule="evenodd" />
                                            </svg>
                                        )}
                                    </div>
                                </button>
                            </div>

                            {/* Navigation Links Skeletons */}
                            <div className="flex-1 px-3 py-4 overflow-hidden">
                                <div className="h-2 w-16 bg-gray-200 dark:bg-gray-800 rounded mb-4 animate-pulse transition-colors duration-500"></div>
                                <div className="space-y-2">
                                    <div className="flex items-center gap-3 bg-[#0FA4A4] text-white px-3 py-2 rounded-xl text-[10px] font-medium shadow-md">
                                        <div className="w-3.5 h-3.5 bg-white/40 rounded-sm"></div>
                                        <div className="h-2.5 w-16 bg-white/40 rounded"></div>
                                    </div>
                                    {[1, 2, 3, 4, 5].map((item) => (
                                        <div key={item} className="flex items-center gap-3 px-3 py-2 rounded-xl text-[10px]">
                                            <div className="w-3.5 h-3.5 bg-gray-200 dark:bg-gray-800 rounded-sm animate-pulse transition-colors duration-500"></div>
                                            <div className="h-2 w-24 bg-gray-200 dark:bg-gray-800 rounded animate-pulse transition-colors duration-500"></div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Main Dashboard Canvas Skeletons */}
                        <div className="flex-1 p-6 md:p-8 overflow-hidden relative z-10">

                            <div className="mb-6">
                                <div className="h-7 w-40 bg-gray-300 dark:bg-gray-700 rounded-md animate-pulse mb-2 transition-colors duration-500"></div>
                                <div className="h-3 w-60 bg-gray-200 dark:bg-gray-800 rounded animate-pulse transition-colors duration-500"></div>
                            </div>

                            <div className="grid grid-cols-12 gap-5 mb-5">
                                <div className="col-span-5 grid grid-cols-2 gap-4">
                                    {[1, 2, 3, 4].map((card) => (
                                        <div key={card} className="bg-white dark:bg-[#151518] rounded-[20px] p-4 flex flex-col justify-between shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-100 dark:border-white/5 h-[104px] transition-colors duration-500">
                                            <div className="flex justify-between items-start">
                                                <div className="h-8 w-12 bg-gray-200 dark:bg-gray-800 rounded-md animate-pulse transition-colors duration-500"></div>
                                                <div className="w-6 h-6 bg-gray-100 dark:bg-gray-800/50 rounded-full animate-pulse transition-colors duration-500"></div>
                                            </div>
                                            <div className="flex justify-between items-end mt-4">
                                                <div className="h-2 w-16 bg-gray-200 dark:bg-gray-800 rounded animate-pulse transition-colors duration-500"></div>
                                                <div className="flex gap-1 items-end h-5">
                                                    <div className="w-1.5 h-3 bg-gray-200 dark:bg-gray-800 rounded-t-sm animate-pulse transition-colors duration-500"></div>
                                                    <div className="w-1.5 h-5 bg-gray-200 dark:bg-gray-800 rounded-t-sm animate-pulse delay-75 transition-colors duration-500"></div>
                                                    <div className="w-1.5 h-2 bg-gray-200 dark:bg-gray-800 rounded-t-sm animate-pulse delay-150 transition-colors duration-500"></div>
                                                    <div className="w-1.5 h-4 bg-gray-200 dark:bg-gray-800 rounded-t-sm animate-pulse delay-200 transition-colors duration-500"></div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="col-span-7 bg-white dark:bg-[#151518] rounded-[20px] p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-100 dark:border-white/5 flex flex-col h-[224px] transition-colors duration-500">
                                    <div className="flex justify-between items-start mb-6">
                                        <div className="space-y-2">
                                            <div className="h-4 w-32 bg-gray-300 dark:bg-gray-700 rounded animate-pulse transition-colors duration-500"></div>
                                            <div className="h-2 w-24 bg-gray-200 dark:bg-gray-800 rounded animate-pulse transition-colors duration-500"></div>
                                        </div>
                                        <div className="h-6 w-24 bg-gray-100 dark:bg-gray-800/50 rounded-full animate-pulse transition-colors duration-500"></div>
                                    </div>
                                    <div className="flex-1 flex w-full relative pl-8">
                                        <div className="absolute left-0 top-0 bottom-6 flex flex-col justify-between pb-2">
                                            {[1, 2, 3, 4, 5].map((y) => (
                                                <div key={y} className="h-1.5 w-6 bg-gray-200 dark:bg-gray-800 rounded animate-pulse transition-colors duration-500"></div>
                                            ))}
                                        </div>
                                        <div className="flex-1 flex justify-between items-end pb-6 border-b border-gray-50 dark:border-gray-800/50 gap-2 h-full transition-colors duration-500">
                                            {[60, 80, 40, 90, 70, 50, 30, 85, 45, 75, 65, 55].map((height, i) => (
                                                <div key={i} className="flex flex-col items-center flex-1 h-full justify-end relative group">
                                                    <div className="w-full max-w-[20px] rounded-t-md bg-gray-100 dark:bg-gray-800 animate-pulse transition-colors duration-500" style={{ height: `${height}%` }}></div>
                                                    <div className="absolute -bottom-4 h-1.5 w-4 bg-gray-200 dark:bg-gray-800 rounded animate-pulse transition-colors duration-500"></div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-12 gap-5">
                                <div className="col-span-4 bg-white dark:bg-[#151518] rounded-[20px] p-5 border border-gray-100 dark:border-white/5 h-[180px] transition-colors duration-500">
                                    <div className="h-4 w-36 bg-gray-300 dark:bg-gray-700 rounded animate-pulse mb-6 transition-colors duration-500"></div>
                                    <div className="flex items-center justify-between">
                                        <div className="space-y-4 flex-1">
                                            {[1, 2, 3, 4].map((item) => (
                                                <div key={item} className="flex justify-between items-center pr-6">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-2 h-2 rounded-full bg-gray-200 dark:bg-gray-800 animate-pulse transition-colors duration-500"></div>
                                                        <div className="h-2 w-16 bg-gray-200 dark:bg-gray-800 rounded animate-pulse transition-colors duration-500"></div>
                                                    </div>
                                                    <div className="h-2 w-4 bg-gray-200 dark:bg-gray-800 rounded animate-pulse transition-colors duration-500"></div>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="w-24 h-24 rounded-full border-[8px] border-gray-100 dark:border-gray-800 animate-pulse shrink-0 transition-colors duration-500"></div>
                                    </div>
                                </div>
                                {/* Duplicated smaller skeleton boxes for remaining columns follow the same transition-colors logic */}
                            </div>
                        </div>

                        {/* Master Fade Overlay */}
                        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#F4F7F9] dark:from-[#0a0a0c] via-[#F4F7F9]/80 dark:via-[#0a0a0c]/80 to-transparent z-40 rounded-b-2xl pointer-events-none transition-colors duration-700"></div>
                    </div>
                </div>
            </div>
        </div>
    );
}