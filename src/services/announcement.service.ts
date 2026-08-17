import { HR_API, MANAGEMENT_API } from "@/constants/API/api";
import apiClient from "@/constants/API/client";

export type AlertType = 'info' | 'promo'; // Web portal restricted types
export type PlatformType = 'android' | 'ios' | 'both';

export interface GlobalAlert {
    _id: string;
    title: string;
    message: string;
    imageUrl?: string;
    buttonText?: string;
    buttonLink?: string;
    isSkippable: boolean;
    isActive: boolean;
    type: string;
    platform: PlatformType;
    createdAt: string;
    updatedAt: string;
}

export interface UpsertAlertPayload {
    title: string;
    message: string;
    imageUrl?: string;
    buttonText?: string;
    buttonLink?: string;
    isSkippable?: boolean;
    isActive?: boolean;
    type?: string;
    platform: PlatformType;
}

export const alertService = {
    async getAlerts(): Promise<GlobalAlert[]> {
        const response = await apiClient.get<{ success: boolean; data: GlobalAlert[] }>(
            MANAGEMENT_API.GET_ALERTS
        );
        return response.data.data;
    },

    async upsertAlert(payload: UpsertAlertPayload): Promise<GlobalAlert> {
        const response = await apiClient.post<{ success: boolean; data: GlobalAlert }>(
            HR_API.UPSERT_ALERT,
            payload
        );
        return response.data.data;
    },
};