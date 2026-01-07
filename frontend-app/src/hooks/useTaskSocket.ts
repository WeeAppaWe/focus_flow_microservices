import { useEffect } from 'react';
import socket from '@/api/socket';
import { NotificationPayload } from '@/types';
import { toast } from 'sonner';

export const useTaskSocket = (userId: number | undefined, onTaskUpdate: () => void) => {
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token || !userId) return;

        socket.auth = { token };
        socket.connect();

        socket.emit('join_room', userId);

        socket.on('task_update', () => {
            onTaskUpdate();
        });

        socket.on('notification', (data: NotificationPayload) => {
            toast.info(data.message, {
                description: data.title,
                duration: 8000,
            });
        });

        return () => {
            socket.off('task_update');
            socket.off('notification');
            socket.disconnect();
        };
    }, [userId, onTaskUpdate]);
};
