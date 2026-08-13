"use client";

import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as faceapi from 'face-api.js';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, CheckCircle, AlertCircle, X, Loader2, Fingerprint } from 'lucide-react';
import toast from 'react-hot-toast';

type VerifyStatus = 'idle' | 'loading_models' | 'scanning' | 'detected' | 'verifying' | 'success' | 'fail' | 'no_camera';

interface FaceVerificationProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    userDescriptor: number[] | Float32Array | null | undefined;
    actionType?: 'checkin' | 'checkout';
}

export default function FaceVerification({
    isOpen,
    onClose,
    onSuccess,
    userDescriptor,
    actionType = 'checkin'
}: FaceVerificationProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const detectionIntervalRef = useRef<NodeJS.Timeout | null>(null);
    const autoVerifyTimerRef = useRef<NodeJS.Timeout | null>(null);
    const verifyLockRef = useRef<boolean>(false);

    const [modelsLoaded, setModelsLoaded] = useState(false);
    const [verifyStatus, setVerifyStatus] = useState<VerifyStatus>('idle');
    const [faceConfidence, setFaceConfidence] = useState(0);
    const [autoVerifyCountdown, setAutoVerifyCountdown] = useState<number | null>(null);

    // 1. Cleanup Function (Stops camera and intervals)
    const stopVideoAndCleanup = useCallback(() => {
        if (detectionIntervalRef.current) clearInterval(detectionIntervalRef.current);
        if (autoVerifyTimerRef.current) clearInterval(autoVerifyTimerRef.current);

        if (videoRef.current?.srcObject) {
            const stream = videoRef.current.srcObject as MediaStream;
            stream.getTracks().forEach(track => track.stop());
            videoRef.current.srcObject = null;
        }

        setFaceConfidence(0);
        setAutoVerifyCountdown(null);
        verifyLockRef.current = false;
    }, []);

    // 2. Load Models
    useEffect(() => {
        const loadFaceModels = async () => {
            if (modelsLoaded) return;
            setVerifyStatus('loading_models');
            try {
                await Promise.all([
                    faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
                    faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
                    faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
                ]);
                setModelsLoaded(true);
                if (isOpen) startCamera();
            } catch (err) {
                console.error("Failed to load models:", err);
                toast.error('Failed to load face verification models.');
                onClose();
            }
        };

        if (isOpen && !modelsLoaded) {
            loadFaceModels();
        }
    }, [isOpen, modelsLoaded, onClose]);

    // 3. Start Camera & Detection Loop
    const startCamera = async () => {
        setVerifyStatus('idle');
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 480 } },
            });

            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                videoRef.current.onloadedmetadata = () => {
                    startFaceDetectionLoop();
                };
            }
        } catch (err) {
            setVerifyStatus('no_camera');
            toast.error('Camera access denied or unavailable.');
        }
    };

    const startFaceDetectionLoop = () => {
        if (detectionIntervalRef.current) clearInterval(detectionIntervalRef.current);
        if (autoVerifyTimerRef.current) clearInterval(autoVerifyTimerRef.current);

        setVerifyStatus('scanning');
        const options = new faceapi.TinyFaceDetectorOptions({ inputSize: 224, scoreThreshold: 0.5 });

        detectionIntervalRef.current = setInterval(async () => {
            if (!videoRef.current || verifyLockRef.current) return;

            try {
                const detection = await faceapi
                    .detectSingleFace(videoRef.current, options)
                    .withFaceLandmarks()
                    .withFaceDescriptor();

                if (detection) {
                    const score = Math.round(detection.detection.score * 100);
                    setFaceConfidence(score);

                    if (!verifyLockRef.current) {
                        setVerifyStatus('detected');

                        // Auto Verify Countdown (2 seconds)
                        if (!autoVerifyTimerRef.current) {
                            setAutoVerifyCountdown(2);
                            let count = 2;

                            autoVerifyTimerRef.current = setInterval(() => {
                                count -= 1;
                                setAutoVerifyCountdown(count);
                                if (count <= 0) {
                                    clearInterval(autoVerifyTimerRef.current!);
                                    autoVerifyTimerRef.current = null;
                                    setAutoVerifyCountdown(null);
                                    handleVerifyIdentity(); // Trigger comparison
                                }
                            }, 1000);
                        }
                    }
                } else {
                    // Face Lost
                    setFaceConfidence(0);
                    setVerifyStatus('scanning');
                    if (autoVerifyTimerRef.current) {
                        clearInterval(autoVerifyTimerRef.current);
                        autoVerifyTimerRef.current = null;
                        setAutoVerifyCountdown(null);
                    }
                }
            } catch (e) {
                // Ignore detection errors to keep loop alive
            }
        }, 500);
    };

    // 4. Verify Identity against User Descriptor
    const handleVerifyIdentity = async () => {
        if (!videoRef.current || verifyLockRef.current) return;

        verifyLockRef.current = true;
        if (detectionIntervalRef.current) clearInterval(detectionIntervalRef.current);

        setVerifyStatus('verifying');

        try {
            // Check if the descriptor exists AND has at least one array of numbers inside it
            if (!userDescriptor || !Array.isArray(userDescriptor) || userDescriptor.length === 0 || !userDescriptor[0]) {
                toast.error('Face ID not registered. Please contact HR.');
                setVerifyStatus('fail');
                return;
            }

            const options = new faceapi.TinyFaceDetectorOptions({ inputSize: 320, scoreThreshold: 0.45 });
            const detection = await faceapi
                .detectSingleFace(videoRef.current, options)
                .withFaceLandmarks()
                .withFaceDescriptor();

            if (!detection) {
                toast.error('No face detected. Please try again.');
                handleFailAndRestart();
                return;
            }

            // FIX: Extract the first array from the 2D array [[ ... ]] and convert to Float32
            const storedDescriptor = new Float32Array(userDescriptor[0]);

            const distance = faceapi.euclideanDistance(detection.descriptor, storedDescriptor);

            if (distance <= 0.50) {
                setVerifyStatus('success');
                toast.success('Identity Verified ✓');

                // Wait briefly for UX, then trigger success
                setTimeout(() => {
                    stopVideoAndCleanup();
                    onSuccess();
                }, 1000);
            } else {
                toast.error('Face mismatch. Please try again.');
                handleFailAndRestart();
            }
        } catch (err) {
            toast.error('Verification failed. Please try again.');
            handleFailAndRestart();
        }
    };

    const handleFailAndRestart = () => {
        setVerifyStatus('fail');
        verifyLockRef.current = false;
        setTimeout(() => {
            if (isOpen) startFaceDetectionLoop();
        }, 2000);
    };

    // 5. Initialize/Teardown based on isOpen prop
    useEffect(() => {
        if (isOpen) {
            if (modelsLoaded) startCamera();
        } else {
            stopVideoAndCleanup();
        }
        return () => stopVideoAndCleanup();
    }, [isOpen, modelsLoaded]);

    // UI Helpers
    const ringColor = {
        idle: '#94A3B8',
        loading_models: '#94A3B8',
        scanning: '#2076C7',
        detected: '#F59E0B',
        verifying: '#8B5CF6',
        success: '#059669',
        fail: '#DC2626',
        no_camera: '#DC2626'
    }[verifyStatus];

    const verifyStatusText = {
        idle: 'Initializing camera...',
        loading_models: 'Loading AI Models...',
        scanning: 'Scanning for face...',
        detected: autoVerifyCountdown ? `Verifying in ${autoVerifyCountdown}s...` : 'Face detected!',
        verifying: 'Verifying identity...',
        success: 'Identity confirmed ✓',
        fail: 'Verification failed',
        no_camera: 'Camera blocked or unavailable'
    }[verifyStatus];

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-5 bg-slate-900/70 backdrop-blur-md">
            <motion.div
                initial={{ scale: 0.88, opacity: 0, y: 28 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.88, opacity: 0, y: 24 }}
                transition={{ type: 'spring', damping: 28, stiffness: 380 }}
                className="relative bg-white dark:bg-primary rounded-3xl w-full max-w-[420px] p-7 text-center shadow-2xl overflow-y-auto max-h-[95dvh]"
            >
                {/* Close Button */}
                <button
                    className="absolute top-4 right-4 w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                    onClick={() => {
                        stopVideoAndCleanup();
                        onClose();
                    }}
                >
                    <X size={16} />
                </button>

                {/* Header */}
                <div className="flex flex-col items-center mb-5">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-3 shadow-lg" style={{ background: `linear-gradient(135deg, ${ringColor}, ${ringColor}88)` }}>
                        <Shield size={22} color="#fff" />
                    </div>
                    <h2 className="text-xl font-bold text-primary dark:text-white tracking-tight">Identity Verification</h2>
                    <p className="text-sm font-medium text-secondary dark:text-gray-400 mt-1">
                        Secure {actionType === 'checkin' ? 'Check In' : 'Check Out'}
                    </p>
                </div>

                {/* Camera Viewport */}
                <div
                    className="relative w-[clamp(160px,45vw,220px)] h-[clamp(160px,45vw,220px)] mx-auto mb-4 rounded-full overflow-hidden border-4 bg-black"
                    style={{
                        borderColor: ringColor,
                        boxShadow: `0 0 0 6px ${ringColor}1F, 0 10px 15px -3px rgba(0,0,0,0.08)`
                    }}
                >
                    <video
                        ref={videoRef}
                        autoPlay
                        muted
                        playsInline
                        className="w-full h-full object-cover -scale-x-100"
                    />

                    {/* Scan Animation */}
                    {(verifyStatus === 'scanning' || verifyStatus === 'detected') && (
                        <div
                            className="absolute inset-0 animate-[att-scan_2s_ease-in-out_infinite] pointer-events-none"
                            style={{ background: `linear-gradient(180deg, transparent 0%, ${ringColor}44 48%, transparent 100%)` }}
                        />
                    )}

                    {/* Overlays */}
                    {verifyStatus === 'success' && (
                        <div className="absolute inset-0 flex items-center justify-center bg-emerald-600/75 animate-in fade-in zoom-in duration-300">
                            <CheckCircle size={52} color="#fff" />
                        </div>
                    )}
                    {verifyStatus === 'fail' && (
                        <div className="absolute inset-0 flex items-center justify-center bg-red-600/75 animate-in fade-in zoom-in duration-300">
                            <AlertCircle size={52} color="#fff" />
                        </div>
                    )}
                </div>

                {/* Status indicator */}
                <div className="flex items-center justify-center gap-2 mb-3">
                    <div className="w-4 h-4 rounded-full flex items-center justify-center" style={{ background: ringColor, boxShadow: `0 0 8px ${ringColor}66` }}>
                        {(verifyStatus === 'verifying' || verifyStatus === 'loading_models') && <Loader2 size={10} className="animate-spin text-white" />}
                    </div>
                    <span className="text-sm font-bold" style={{ color: ringColor }}>
                        {verifyStatusText}
                    </span>
                </div>

                {/* Confidence Bar */}
                {faceConfidence > 0 && verifyStatus !== 'success' && verifyStatus !== 'fail' && (
                    <div className="flex items-center gap-2 mb-4 px-2">
                        <div className="flex-1 h-1.5 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                            <div
                                className="h-full rounded-full transition-all duration-300 ease-out"
                                style={{
                                    width: `${faceConfidence}%`,
                                    background: faceConfidence > 70 ? '#059669' : faceConfidence > 40 ? '#F59E0B' : '#DC2626'
                                }}
                            />
                        </div>
                        <span className="text-[11px] font-bold text-secondary dark:text-gray-400 whitespace-nowrap">{faceConfidence}%</span>
                    </div>
                )}

                {/* Action Buttons */}
                <div className="w-full mt-4">
                    <p className="text-xs text-secondary dark:text-gray-400 mb-3 min-h-[20px]">
                        {verifyStatus === 'scanning' ? 'Position your face clearly in the frame' : ''}
                        {verifyStatus === 'detected' ? `Auto-verifying in ${autoVerifyCountdown ?? '...'}s` : ''}
                        {verifyStatus === 'verifying' ? 'Comparing with registered face ID...' : ''}
                        {verifyStatus === 'fail' ? 'Scanning will restart automatically' : ''}
                        {verifyStatus === 'loading_models' ? 'Downloading secure AI assets...' : ''}
                    </p>

                    <div className="flex gap-2.5">
                        <button
                            className="flex-1 py-2.5 px-4 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-secondary dark:text-gray-300 text-sm font-bold rounded-xl transition-colors"
                            onClick={() => { stopVideoAndCleanup(); onClose(); }}
                        >
                            Cancel
                        </button>
                        {/* FIX: Included 'verifying' in the render condition so the button shows a spinner */}
                        {(verifyStatus === 'detected' || verifyStatus === 'scanning' || verifyStatus === 'verifying') && (
                            <button
                                className="flex-1 py-2.5 px-4 bg-brand-blue hover:bg-blue-700 text-white text-sm font-bold rounded-xl shadow-md shadow-brand-blue/20 transition-all active:scale-95 flex items-center justify-center gap-1.5 disabled:opacity-80 disabled:cursor-not-allowed disabled:active:scale-100"
                                onClick={handleVerifyIdentity}
                                disabled={verifyStatus === 'verifying'}
                            >
                                {verifyStatus === 'verifying' ? (
                                    <Loader2 size={16} className="animate-spin" />
                                ) : (
                                    <Fingerprint size={16} />
                                )}
                                {verifyStatus === 'verifying' ? 'Verifying...' : 'Verify Now'}
                            </button>
                        )}
                    </div>
                </div>
            </motion.div>

            {/* Global override for the scanner line animation if not globally defined */}
            <style dangerouslySetInnerHTML={{
                __html: `
        @keyframes att-scan {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
        }
      `}} />
        </div>
    );
}