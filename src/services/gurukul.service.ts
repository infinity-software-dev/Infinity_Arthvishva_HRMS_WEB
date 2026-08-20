import apiClient from '@/constants/API/client';
import { HR_API, MANAGEMENT_API } from '@/constants/API/api';

// Types based on the Mongoose schema and Hook we built
export interface VideoData {
    _id: string;
    title: string;
    description?: string;
    videoUrl: string;
    videoType: 'youtube' | 'direct';
    thumbnail?: string;
    duration?: number;
    isActive: boolean;
    createdAt?: string;
}

export interface CreateVideoPayload {
    title: string;
    description: string;
    videoUrl: string;
    videoType: 'youtube' | 'direct';
    thumbnail: string;
    duration: number;
    isActive: boolean;
}

export const gurukulService = {
    // 1. Fetch all videos
    async getVideos(): Promise<VideoData[]> {
        const response = await apiClient.get(MANAGEMENT_API.GET_VIDEOS);
        // Assuming your backend returns { data: [...] } or just the array directly. 
        // Adjust based on your standard backend response wrapper.
        return response.data?.docs || response.data;
    },

    // 2. Create a new video
    async createVideo(payload: CreateVideoPayload): Promise<VideoData> {
        const response = await apiClient.post(HR_API.CREATE_VIDEO, payload);
        return response.data;
    },

    // 3. Update an existing video
    async updateVideo(id: string, payload: Partial<CreateVideoPayload>): Promise<VideoData> {
        const response = await apiClient.put(HR_API.UPDATE_VIDEO(id), payload);
        return response.data;
    },

    // 4. Delete a video (optional, but good to have)
    async deleteVideo(id: string): Promise<any> {
        const response = await apiClient.delete(HR_API.DELETE_VIDEO(id));
        return response.data;
    }
};