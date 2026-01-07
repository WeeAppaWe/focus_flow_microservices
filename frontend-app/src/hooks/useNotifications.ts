import { useState, useEffect, useCallback } from 'react';
import { notificationApi } from '@/api/notification.api';
import { Notification } from '@/types';

export const useNotifications = () => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(false);

    const fetchNotifications = useCallback(async () => {
        try {
            setLoading(true);
            const response = await notificationApi.getAll();
            if (response.status === 'success' && response.data) {
                setNotifications(response.data.notifications);
            }
        } catch (error) {
            console.error('Failed to fetch notifications:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchUnreadCount = useCallback(async () => {
        try {
            const response = await notificationApi.getUnreadCount();
            if (response.status === 'success' && response.data) {
                setUnreadCount(response.data.unread_count);
            }
        } catch (error) {
            console.error('Failed to fetch unread count:', error);
        }
    }, []);

    const markAsRead = async (id: number) => {
        try {
            await notificationApi.markAsRead(id);
            setNotifications(prev =>
                prev.map(notif =>
                    notif.id === id ? { ...notif, is_read: true } : notif
                )
            );
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (error) {
            console.error('Failed to mark as read:', error);
        }
    };

    const markAllAsRead = async () => {
        try {
            await notificationApi.markAllAsRead();
            setNotifications(prev =>
                prev.map(notif => ({ ...notif, is_read: true }))
            );
            setUnreadCount(0);
        } catch (error) {
            console.error('Failed to mark all as read:', error);
        }
    };

    const refetch = useCallback(() => {
        fetchNotifications();
        fetchUnreadCount();
    }, [fetchNotifications, fetchUnreadCount]);

    useEffect(() => {
        fetchNotifications();
        fetchUnreadCount();
    }, [fetchNotifications, fetchUnreadCount]);

    return {
        notifications,
        unreadCount,
        loading,
        markAsRead,
        markAllAsRead,
        refetch,
    };
};
