import api from './index';
import { ApiResponse, Notification, NotificationListResponse } from '@/types';

export const notificationApi = {
    getAll: async (page = 1, limit = 20, unreadOnly = false): Promise<ApiResponse<NotificationListResponse>> => {
        const response = await api.get('/notifications', {
            params: { page, limit, unread_only: unreadOnly }
        });
        return response.data;
    },

    getUnreadCount: async (): Promise<ApiResponse<{ unread_count: number }>> => {
        const response = await api.get('/notifications/unread-count');
        return response.data;
    },

    markAsRead: async (id: number): Promise<ApiResponse<Notification>> => {
        const response = await api.patch(`/notifications/${id}/read`);
        return response.data;
    },

    markAllAsRead: async (): Promise<ApiResponse<{ message: string }>> => {
        const response = await api.patch('/notifications/read-all');
        return response.data;
    },

    delete: async (id: number): Promise<ApiResponse<null>> => {
        const response = await api.delete(`/notifications/${id}`);
        return response.data;
    },

    deleteAll: async (): Promise<ApiResponse<{ message: string }>> => {
        const response = await api.delete('/notifications');
        return response.data;
    }
};
