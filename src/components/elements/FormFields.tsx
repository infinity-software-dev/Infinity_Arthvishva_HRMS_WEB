import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';

interface InputProps {
    name: string;
    label: string;
    value?: string | number;
    onChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    error?: string;
    type?: string;
    textTransform?: "uppercase" | "lowercase" | "capitalize" | "none";
    placeholder?: string;
    disabled?: boolean;
    isAutoFocus?: boolean;
    minLength?: number;
    maxLength?: number;
    required?: boolean;
}

export const FormInput = ({
    name,
    label,
    value,
    onChange,
    error,
    type = "text",
    placeholder,
    disabled,
    textTransform = 'capitalize',
    minLength,
    maxLength,
    required,
}: InputProps) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === "password";
    const inputType = isPassword ? (showPassword ? "text" : "password") : type;
    const isNumberType = type === "number";

    return (
        <div className="flex flex-col gap-1.5 w-full">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {label} {required && <span className="text-red-500">*</span>}
            </label>
            <div className="relative">
                <input
                    name={name}
                    value={value}
                    onChange={onChange}
                    type={inputType}
                    placeholder={placeholder}
                    disabled={disabled}
                    minLength={minLength}
                    maxLength={maxLength}
                    style={{ textTransform: textTransform }}
                    className={`w-full px-4 py-2.5 rounded-xl border ${error ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'
                        } bg-gray-50 dark:bg-gray-900 disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none ${!error && 'focus:ring-2 focus:ring-brand-blue'
                        } transition-all pr-10 ${isNumberType ? 'no-spinner' : ''}`}
                />
                {isPassword && (
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors cursor-pointer"
                    >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                )}
            </div>
            {error && <span className="text-xs text-red-500">{error}</span>}
        </div>
    );
};

export const FormSelect = ({
    name,
    label,
    value,
    onChange,
    error,
    options,
    disabled,
    required
}: InputProps & { options: { label: string, value: string }[] }) => {
    return (
        <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {label} {required && <span className="text-red-500">*</span>}
            </label>
            <select
                name={name}
                value={value}
                onChange={onChange}
                disabled={disabled}
                className={`w-full px-4 py-2.5 rounded-xl border ${error ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'
                    } bg-gray-50 dark:bg-gray-900 disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none ${!error && 'focus:ring-2 focus:ring-brand-blue'
                    } transition-all`}
            >
                <option value="">-- Select --</option>
                {options.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
            </select>
            {error && <span className="text-xs text-red-500">{error}</span>}
        </div>
    );
};


interface FileInputFieldProps {
    label?: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    disabled?: boolean;
    accept?: string; // 1. Add accept to the interface
}

export function FileInputField({ label, onChange, disabled = false, accept }: FileInputFieldProps) {
    return (
        <div className="w-full min-w-0 max-w-full flex flex-col gap-1.5">
            {label ? <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label> : null}
            <input
                type="file"
                accept={accept} // 2. Pass it to the input element
                onChange={onChange}
                disabled={disabled}
                className="w-full min-w-0 max-w-full text-sm text-gray-500 file:mr-3 file:py-2.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-gray-100 dark:file:bg-gray-800 file:text-gray-700 dark:file:text-gray-200 hover:file:bg-gray-200 dark:hover:file:bg-gray-700 disabled:opacity-50 transition-all border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-900 cursor-pointer overflow-hidden"
            />
        </div>
    );
}