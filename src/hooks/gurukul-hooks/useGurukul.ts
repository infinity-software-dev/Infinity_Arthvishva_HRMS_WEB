import { useState, useMemo, useEffect, useCallback } from 'react';
import { gurukulService, VideoData } from '@/services/gurukul.service';
import toast from 'react-hot-toast';

const DEFAULT_THUMBNAIL = "https://res.cloudinary.com/diyxmoyuj/image/upload/v1783577195/new_hrms_employees_data/IA11111/vka3akbv5jkdjajxjxwm.png";

export const useGurukul = () => {
    const [videos, setVideos] = useState<VideoData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    // Modal states
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingVideoId, setEditingVideoId] = useState<string | null>(null);

    // Shared Form states
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [videoUrl, setVideoUrl] = useState('');
    const [videoType, setVideoType] = useState<'youtube' | 'direct'>('direct');
    const [thumbnail, setThumbnail] = useState('');
    const [duration, setDuration] = useState('');
    const [isActive, setIsActive] = useState(true);

    // --- FETCH DATA LOGIC ---
    const fetchVideos = useCallback(async () => {
        try {
            setIsLoading(true);
            const data = await gurukulService.getVideos();
            setVideos(data || []);
        } catch (error) {
            console.error('Failed to fetch videos:', error);
            toast.error('Failed to load learning modules.');
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Load videos on component mount
    useEffect(() => {
        fetchVideos();
    }, [fetchVideos]);

    // --- ADD LOGIC ---
    const openAddModal = () => {
        resetForm();
        setIsAddModalOpen(true);
    };

    const closeAddModal = () => setIsAddModalOpen(false);

    const handleAddSubmit = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();

        // Basic frontend validation before hitting the API
        if (!title.trim() || !videoUrl.trim()) {
            toast.error('Title and Video URL are required.');
            return;
        }

        const loadingToast = toast.loading('Adding video module...');

        try {
            // Use default if thumbnail is empty
            const finalThumbnail = thumbnail.trim() || DEFAULT_THUMBNAIL;

            const payload = {
                title,
                description,
                videoUrl,
                videoType,
                thumbnail: finalThumbnail,
                duration: Number(duration) || 0,
                isActive
            };

            await gurukulService.createVideo(payload);
            await fetchVideos();
            closeAddModal();
            toast.success('Video module added successfully!', { id: loadingToast });
        } catch (error) {
            console.error('Failed to add video:', error);
            toast.error('Failed to add video module. Please try again.', { id: loadingToast });
        }
    };

    // --- EDIT LOGIC ---
    const openEditModal = (video: VideoData) => {
        setEditingVideoId(video._id);
        setTitle(video.title);
        setDescription(video.description || '');
        setVideoUrl(video.videoUrl);
        setVideoType(video.videoType);
        setThumbnail(video.thumbnail || '');
        setDuration(video.duration?.toString() || '');
        setIsActive(video.isActive);

        setIsEditModalOpen(true);
    };

    const closeEditModal = () => {
        setIsEditModalOpen(false);
        setEditingVideoId(null);
        resetForm();
    };

    const handleEditSubmit = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (!editingVideoId) return;

        // Basic frontend validation
        if (!title.trim() || !videoUrl.trim()) {
            toast.error('Title and Video URL are required.');
            return;
        }

        const loadingToast = toast.loading('Updating video module...');

        try {
            // Use default if thumbnail is cleared out during edit
            const finalThumbnail = thumbnail.trim() || DEFAULT_THUMBNAIL;

            const payload = {
                title,
                description,
                videoUrl,
                videoType,
                thumbnail: finalThumbnail,
                duration: Number(duration) || 0,
                isActive
            };

            await gurukulService.updateVideo(editingVideoId, payload);
            await fetchVideos();
            closeEditModal();
            toast.success('Video module updated successfully!', { id: loadingToast });
        } catch (error) {
            console.error('Failed to update video:', error);
            toast.error('Failed to update video module. Please try again.', { id: loadingToast });
        }
    };

    const resetForm = () => {
        setTitle('');
        setDescription('');
        setVideoUrl('');
        setVideoType('direct');
        setThumbnail('');
        setDuration('');
        setIsActive(true);
    };

    // Filter for the search bar
    const filteredVideos = useMemo(() => {
        if (!searchQuery) return videos;
        return videos.filter(v => v.title.toLowerCase().includes(searchQuery.toLowerCase()));
    }, [videos, searchQuery]);

    return {
        videos: filteredVideos,
        isLoading,
        filters: { searchQuery, setSearchQuery },
        isAddModalOpen,
        openAddModal,
        closeAddModal,
        handleAddSubmit,
        isEditModalOpen,
        openEditModal,
        closeEditModal,
        handleEditSubmit,
        form: {
            title, setTitle, description, setDescription, videoUrl, setVideoUrl,
            videoType, setVideoType, thumbnail, setThumbnail, duration, setDuration,
            isActive, setIsActive,
        }
    };
};