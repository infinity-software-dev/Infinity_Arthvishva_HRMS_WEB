"use client";

import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, X, Loader2, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export interface LocationPoint {
    latitude: number;
    longitude: number;
}

export interface MapModalProps {
    isOpen: boolean;
    onClose: () => void;
    latitude?: number | null;
    longitude?: number | null;
    checkOutLatitude?: number | null;
    checkOutLongitude?: number | null;
    locationHistory?: LocationPoint[];
    workMode?: string;
    employeeName?: string;
}

export default function MapModal({
    isOpen,
    onClose,
    latitude,
    longitude,
    checkOutLatitude,
    checkOutLongitude,
    locationHistory = [],
    workMode,
    employeeName
}: MapModalProps) {
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const mapInstanceRef = useRef<any>(null);
    const [libReady, setLibReady] = useState(false);
    const [mapError, setMapError] = useState(false);

    useEffect(() => {
        if (!isOpen) {
            setLibReady(false);
            setMapError(false);
            return;
        }
        const loadAssets = async () => {
            try {
                if (!document.querySelector('link[href*="leaflet.css"]')) {
                    const link = document.createElement('link');
                    link.rel = 'stylesheet';
                    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
                    document.head.appendChild(link);
                }
                if (!(window as any).L) {
                    await new Promise((resolve, reject) => {
                        const script = document.createElement('script');
                        script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
                        script.onload = resolve;
                        script.onerror = reject;
                        document.head.appendChild(script);
                    });
                }
                setLibReady(true);
            } catch (err) {
                console.error('Leaflet load error:', err);
                setMapError(true);
                toast.error('Failed to load map library');
            }
        };
        loadAssets();
    }, [isOpen]);

    useEffect(() => {
        if (!isOpen || !libReady || !mapContainerRef.current || mapInstanceRef.current) return;
        const initMap = () => {
            try {
                const L = (window as any).L;
                if (!L || latitude == null || longitude == null) return;

                const map = L.map(mapContainerRef.current, { zoomControl: true, scrollWheelZoom: true }).setView([latitude, longitude], 15);
                L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19, attribution: '© OpenStreetMap' }).addTo(map);

                const createDivIcon = (color: string) => L.divIcon({
                    className: 'custom-div-icon',
                    html: `<div style="background-color: ${color}; width: 14px; height: 14px; border: 2.5px solid white; border-radius: 50%; box-shadow: 0 0 10px rgba(0,0,0,0.3);"></div>`,
                    iconSize: [14, 14], iconAnchor: [7, 7]
                });

                L.marker([latitude, longitude], { icon: createDivIcon('#059669') }).addTo(map)
                    .bindPopup(`<strong>Check-in</strong><br>${employeeName}<br>${latitude.toFixed(5)}, ${longitude.toFixed(5)}`);

                if (checkOutLatitude && checkOutLongitude) {
                    L.marker([checkOutLatitude, checkOutLongitude], { icon: createDivIcon('#DC2626') }).addTo(map)
                        .bindPopup(`<strong>Check-out</strong><br>${checkOutLatitude.toFixed(5)}, ${checkOutLongitude.toFixed(5)}`);
                }

                const bounds = L.latLngBounds([[latitude, longitude]]);
                if (checkOutLatitude && checkOutLongitude) bounds.extend([checkOutLatitude, checkOutLongitude]);

                const trailPoints = [[latitude, longitude]];
                if (Array.isArray(locationHistory)) {
                    locationHistory.forEach(loc => {
                        if (loc.latitude && loc.longitude) {
                            trailPoints.push([loc.latitude, loc.longitude]);
                            bounds.extend([loc.latitude, loc.longitude]);
                        }
                    });
                }

                if (checkOutLatitude && checkOutLongitude) trailPoints.push([checkOutLatitude, checkOutLongitude]);

                if (trailPoints.length > 1) {
                    L.polyline(trailPoints, { color: '#2076C7', weight: 3, opacity: 0.6, dashArray: '5, 10' }).addTo(map);
                    map.fitBounds(bounds, { padding: [50, 50] });
                } else {
                    map.fitBounds(bounds, { padding: [100, 100], maxZoom: 16 });
                }

                setTimeout(() => map.invalidateSize(), 500);
                mapInstanceRef.current = map;
            } catch (err) {
                console.error('Map init error:', err);
                setMapError(true);
            }
        };
        initMap();

        return () => {
            if (mapInstanceRef.current) {
                mapInstanceRef.current.remove();
                mapInstanceRef.current = null;
            }
        };
    }, [isOpen, libReady, latitude, longitude, checkOutLatitude, checkOutLongitude, locationHistory, employeeName]);

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                    />
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.95, opacity: 0, y: 20 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 350 }}
                        className="relative w-full max-w-4xl bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden flex flex-col z-10 max-h-[95dvh]"
                    >
                        {/* Header */}
                        <div className="h-1 w-full bg-brand-green flex-shrink-0" />
                        <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-brand-green/10 flex items-center justify-center">
                                    <MapPin size={20} className="text-brand-green" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">{employeeName} · Movement</h2>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Mode: <span className="font-semibold text-brand-green">{workMode || 'Office'}</span></p>
                                </div>
                            </div>
                            <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
                                <X size={20} className="text-gray-500" />
                            </button>
                        </div>

                        {/* Map Area */}
                        <div className="p-4 flex-1 bg-gray-50 dark:bg-gray-800/50 relative min-h-[450px]">
                            {!libReady && !mapError && (
                                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                                    <Loader2 className="animate-spin text-brand-green" size={32} />
                                    <p className="text-sm text-gray-500">Loading map assets...</p>
                                </div>
                            )}
                            {mapError && (
                                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-red-50 dark:bg-red-900/10">
                                    <AlertCircle size={32} className="text-red-600" />
                                    <p className="font-semibold text-red-600">Failed to load map</p>
                                    <button onClick={() => window.location.reload()} className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm">Retry</button>
                                </div>
                            )}
                            <div
                                ref={mapContainerRef}
                                className={`h-[450px] w-full rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 bg-gray-200 dark:bg-gray-800 ${libReady && !mapError ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300 z-0`}
                            />
                        </div>

                        {/* Footer Legend */}
                        <div className="px-6 py-4 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 flex flex-wrap gap-6 items-center">
                            <div className="flex items-center gap-2 text-sm">
                                <div className="w-3 h-3 rounded-full bg-[#059669] border-2 border-white shadow-sm" />
                                <span className="font-semibold text-gray-700 dark:text-gray-300">Check-in</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                                <div className="w-3 h-3 rounded-full bg-[#DC2626] border-2 border-white shadow-sm" />
                                <span className="font-semibold text-gray-700 dark:text-gray-300">Check-out</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                                <div className="w-5 h-[3px] bg-[#2076C7]/60 border-b-[1.5px] border-dashed border-white" />
                                <span className="font-semibold text-gray-700 dark:text-gray-300">Path Trail</span>
                            </div>
                            <div className="ml-auto">
                                <button onClick={onClose} className="px-5 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 rounded-lg transition-colors">
                                    Close
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}