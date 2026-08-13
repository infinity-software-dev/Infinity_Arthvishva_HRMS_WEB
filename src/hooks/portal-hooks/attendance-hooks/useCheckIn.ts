// src/hooks/portal-hooks/attendance-hooks/useCheckIn.ts
import { useState, useEffect, useCallback, useMemo } from 'react';
import toast from 'react-hot-toast';
import { portalAttendanceService } from '@/services/employeeProtalServices/employee.attendance.service';
import { SystemConfig } from '@/services/employeeProtalServices/types';
import { logToTerminal } from '@/utils/terminalLogger';

export type GeoStatus = 'checking' | 'valid' | 'invalid' | 'error' | 'permission_denied';
export type WorkMode = 'Office' | 'Field' | 'WFH';

interface Coordinates {
    latitude: number;
    longitude: number;
}

export const useCheckIn = (onSuccessCallback?: () => void) => {
    const [config, setConfig] = useState<SystemConfig | null>(null);
    const [todayRecord, setTodayRecord] = useState<any>(null); // NEW: Holds active check-in data

    const [workMode, setWorkMode] = useState<WorkMode>('Office');
    const [coords, setCoords] = useState<Coordinates | null>(null);
    const [geoStatus, setGeoStatus] = useState<GeoStatus>('checking');
    const [geoDistance, setGeoDistance] = useState<number>(0);
    const [managers, setManagers] = useState<any[]>([]);

    const [loadingConfig, setLoadingConfig] = useState<boolean>(true);
    const [actionLoading, setActionLoading] = useState<boolean>(false);

    // 1. Fetch Config, Status, and Managers on Mount
    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                // Fetch all three concurrently
                const [configData, recordData, managersData] = await Promise.all([
                    portalAttendanceService.getSystemConfig(),
                    portalAttendanceService.getTodayStatus(),
                    portalAttendanceService.getReportingManagers()
                ]);
                setConfig(configData);
                setTodayRecord(recordData);
                setManagers(managersData);

                if (recordData?.workMode) {
                    setWorkMode(recordData.workMode as WorkMode);
                }
            } catch (error: any) {
                toast.error(error.message);
            } finally {
                setLoadingConfig(false);
            }
        };
        fetchInitialData();
    }, []);

    // 2. Geolocation & Haversine Distance Logic
    const fetchGeo = useCallback(() => {
        if (!config || !navigator.geolocation) {
            setGeoStatus('error');
            return;
        }

        setGeoStatus('checking');

        const calcAndSet = (lat: number, lng: number) => {
            setCoords({ latitude: lat, longitude: lng });

            const R = 6371000;
            const tr = (v: number) => (v * Math.PI) / 180;
            const dLat = tr(lat - config.office_lat);
            const dLng = tr(lng - config.office_lon);
            const a =
                Math.sin(dLat / 2) ** 2 +
                Math.cos(tr(config.office_lat)) * Math.cos(tr(lat)) * Math.sin(dLng / 2) ** 2;
            const d = Math.round(R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));

            setGeoDistance(d);

            if (workMode === 'Office') {
                setGeoStatus(d <= config.radius_meters ? 'valid' : 'invalid');
            } else {
                setGeoStatus('valid');
            }
        };

        const onError = (err: GeolocationPositionError) => {
            if (err.code === 1) {
                setGeoStatus('permission_denied');
                toast.error('Location permission denied.');
            } else {
                setGeoStatus('error');
                toast.error('Location unavailable. Check your GPS.');
            }
            setCoords(null);
        };

        navigator.geolocation.getCurrentPosition(
            (pos) => calcAndSet(pos.coords.latitude, pos.coords.longitude),
            onError,
            { enableHighAccuracy: false, timeout: 5000, maximumAge: 30000 }
        );

        setTimeout(() => {
            navigator.geolocation.getCurrentPosition(
                (pos) => calcAndSet(pos.coords.latitude, pos.coords.longitude),
                () => { },
                { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
            );
        }, 200);

    }, [config, workMode]);

    useEffect(() => {
        if (config) fetchGeo();
    }, [config, workMode, fetchGeo]);

    // 3. Validation state for the Check-In/Out button
    const canAct = useMemo(() => {
        if (actionLoading || loadingConfig) return false;
        if (workMode !== 'Office') return true;
        return geoStatus === 'valid' && coords !== null;
    }, [actionLoading, loadingConfig, workMode, geoStatus, coords]);

    // 4. API Submission for Check-In
    const submitCheckIn = async () => {
        if (!canAct) return;

        setActionLoading(true);
        try {
            await portalAttendanceService.checkIn({
                latitude: coords?.latitude,
                longitude: coords?.longitude,
                workMode: workMode
            });

            toast.success('Checked In Successfully! 🎉');

            // 🔄 RE-FETCH STATUS ON SUCCESS
            const updatedRecord = await portalAttendanceService.getTodayStatus();
            setTodayRecord(updatedRecord);

            if (onSuccessCallback) onSuccessCallback();

        } catch (error: any) {
            toast.error(error.message);

            // 🔄 CROSS-DEVICE SYNC: If backend says they already checked in, fix the UI!
            if (error.message?.toLowerCase().includes('already') || error.message?.toLowerCase().includes('exists')) {
                const updatedRecord = await portalAttendanceService.getTodayStatus();
                setTodayRecord(updatedRecord);
            }
        } finally {
            setActionLoading(false);
        }
    };

    // 5. API Submission for Check-Out
    const submitCheckOut = async (reportData: any) => {
        if (!canAct) return;
        setActionLoading(true);

        try {
            const payload: any = {
                todayWork: reportData.todayWork,
                pendingWork: reportData.pendingWork,
                issuesFaced: reportData.issuesFaced,
            };

            if (coords?.latitude && coords?.longitude) {
                payload.latitude = coords.latitude;
                payload.longitude = coords.longitude;
            }

            if (reportData.reportParticipant) {
                payload.reportParticipant = reportData.reportParticipant;
            }

            const data = await portalAttendanceService.checkOut(payload);

            const { overtimeMinutes, shortfallMinutes } = data?.data || {};
            if (overtimeMinutes > 0) toast.success(`Checked out! Overtime: ${overtimeMinutes}m 🚀`);
            else if (shortfallMinutes > 0) toast(`Checked out ${shortfallMinutes}m early`, { icon: '⚠️' });
            else toast.success('Checked Out Successfully! 👋');

            // 🔄 RE-FETCH STATUS ON SUCCESS
            const updatedRecord = await portalAttendanceService.getTodayStatus();
            setTodayRecord(updatedRecord);

            if (onSuccessCallback) onSuccessCallback();

        } catch (error: any) {
            toast.error(error.message);

            // 🔄 CROSS-DEVICE SYNC: If backend says they already checked out, fix the UI!
            if (error.message?.toLowerCase().includes('already')) {
                const updatedRecord = await portalAttendanceService.getTodayStatus();
                setTodayRecord(updatedRecord);
            }
        } finally {
            setActionLoading(false);
        }
    };


    return {
        workMode,
        setWorkMode,
        geoStatus,
        geoDistance,
        coords,
        config,
        todayRecord,
        managers,
        submitCheckOut,
        canAct,
        actionLoading,
        loadingConfig,
        fetchGeo,
        submitCheckIn
    };
};