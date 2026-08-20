"use client";

import Image from "next/image";
import Link from "next/link";
import { useLogin } from "@/hooks/useLogin";
import { User, Lock, Eye, EyeOff } from "lucide-react";
import GradientButton from "@/components/buttons/GradientButton";

export default function LoginPage() {
  // Destructure everything we need from our custom hook
  const {
    employeeCode,
    setEmployeeCode,
    password,
    setPassword,
    loading,
    error,
    showPassword,
    togglePasswordVisibility,
    handleLogin,
  } = useLogin();

  return (
    <div className="min-h-screen w-full flex bg-white dark:bg-primary">
      {/* LEFT SIDE: LOGIN FORM */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 md:px-20 lg:px-24 xl:px-32 py-12 transition-colors duration-300">

        {/* Logo */}
        <div className="flex-col w-full justify-center flex items-center gap-2 text-2xl font-bold text-primary dark:text-white mb-12 tracking-tight">
          <Image src="/images/icon.png" alt="IA HRMS" width={100} height={100} />
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-primary dark:text-white mb-2">
            Welcome Back
          </h1>
          <p className="text-secondary dark:text-gray-400">
            Enter your credentials to access the administrative panel.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-6">

          <div className="space-y-2">
            <label className="text-sm font-bold text-secondary dark:text-gray-400 uppercase tracking-wide">
              Employee Code
            </label>
            <div className="relative">
              <input
                type="text"
                autoFocus
                placeholder="e.g. IAHR001"
                value={employeeCode}
                onChange={(e) => setEmployeeCode(e.target.value.toUpperCase())}
                maxLength={9}
                required
                className="required w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3.5 text-sm font-medium text-primary dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-blue hover:border-gray-300 dark:hover:border-white/20 transition-all pl-11"
              />

              <User className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" strokeWidth={2} />
            </div>
          </div>

          {/* Password Input */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-bold text-secondary dark:text-gray-400 uppercase tracking-wide">
                Password
              </label>
              {/* <Link href="#" className="text-xs font-bold text-brand-blue hover:underline">
                Forgot Password?
              </Link> */}
            </div>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                required
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3.5 text-sm font-medium text-primary dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-blue hover:border-gray-300 dark:hover:border-white/20 transition-all pl-11 pr-12 required"
              />

              <Lock className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" strokeWidth={2} />

              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-4 top-3.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors focus:outline-none"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" strokeWidth={2} />
                ) : (
                  <Eye className="w-5 h-5" strokeWidth={2} />
                )}
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm font-medium text-center animate-in fade-in slide-in-from-top-1">
              {error}
            </div>
          )}

          <GradientButton className="w-full" disabled={loading} type="submit">
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 dark:border-primary/30 border-t-white dark:border-t-primary rounded-full animate-spin"></div>
                Authenticating...
              </>
            ) : (
              "Sign In"
            )}
          </GradientButton>

        </form>

        {/* Footer */}
        <p className="text-center text-xs text-secondary dark:text-gray-500 mt-8 font-medium">
          Need access?{" "}
          <Link href="#" className="text-brand-blue hover:underline">
            Contact System Administrator
          </Link>
        </p>
      </div>

      {/* RIGHT SIDE: CORPORATE BANNER */}
      <div className="hidden lg:block lg:w-1/2 relative bg-[#F3F4F6] dark:bg-black">
        <Image
          src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=1742&auto=format&fit=crop"
          alt="Corporate HR Management"
          fill
          className="object-cover opacity-90 grayscale-[20%]"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end p-16">
          <h2 className="text-4xl font-bold text-white mb-4">
            Manage Your Workforce.
          </h2>
          <p className="text-lg text-gray-200 max-w-md leading-relaxed">
            Streamline employee onboarding, track attendance precisely, and automate payroll operations from a single unified dashboard.
          </p>
        </div>
      </div>
    </div>
  );
}