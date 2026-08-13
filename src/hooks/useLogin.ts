import { useState } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/services/auth.service";

export const useLogin = () => {
    const router = useRouter();

    const [employeeCode, setEmployeeCode] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        if (!employeeCode || !password) {
            setError("Please enter valid credentials.");
            setLoading(false);
            return;
        }

        // Updated Regex: The '?' makes (HR|DT) optional. 
        const codeRegex = /^IA(HR|DT)?\d{3,5}$/;

        // const codeRegex = /^IA(HR|DT)\d{3}$/;

        if (!codeRegex.test(employeeCode)) {
            setError("Invalid code format. Expected: IA00141, IAHR001, or IADT001.");
            setLoading(false);
            return;
        }

        try {
            // Determine the role based on the prefix
            const isHR = employeeCode.startsWith("IAHR");
            const isDirector = employeeCode.startsWith("IADT");

            let data;
            let roleToStore = "EMPLOYEE"; // Default fallback

            // Route to the correct service based on the prefix and role
            if (isHR) {
                roleToStore = "HR";
                data = await authService.loginHR(employeeCode, password);
            } else if (isDirector) {
                roleToStore = "DIRECTOR";
                data = await authService.loginDirector(employeeCode, password);
            } else {
                data = await authService.loginEmployee(employeeCode, password);
            }

            if (!data) {
                setError("Login failed.");
                setLoading(false);
                return;
            }

            // Store the token and role
            localStorage.setItem("accessToken", data.data.accessToken);
            localStorage.setItem("refreshToken", data.data.refreshToken);
            localStorage.setItem("role", roleToStore);

            if (roleToStore === "EMPLOYEE") {
                router.replace("/portal");
            } else {
                router.replace("/dashboard");
            }
        } catch (err: any) {
            const message = err.response?.data?.message || "Login failed. Please check your credentials.";
            setError(message);
            console.error("Login error:", err);
        } finally {
            setLoading(false);
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword((prev) => !prev);
    };

    return {
        employeeCode,
        setEmployeeCode,
        password,
        setPassword,
        loading,
        error,
        showPassword,
        togglePasswordVisibility,
        handleLogin,
    };
};