"use client";

import { Toaster } from 'react-hot-toast';

export default function ToastProvider() {
    return (
        <Toaster
            position="top-center"
            reverseOrder={false}
            toastOptions={{
                // Default options for all toasts
                duration: 4000,
                style: {
                    background: '#1e293b', // matches dark mode surface
                    color: '#fff',
                    fontSize: '14px',
                    fontWeight: '600',
                    borderRadius: '12px',
                    padding: '12px 16px',
                    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.2)',
                },
                // Specific styles for Success toasts
                success: {
                    iconTheme: {
                        primary: '#10B981', // Brand Green
                        secondary: '#fff',
                    },
                },
                // Specific styles for Error toasts
                error: {
                    iconTheme: {
                        primary: '#EF4444', // Red
                        secondary: '#fff',
                    },
                },
            }}
        />
    );
}