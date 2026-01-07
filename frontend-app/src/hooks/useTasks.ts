import { useState, useCallback, useEffect } from 'react';
import { taskApi } from '@/api/task.api';
import { Task } from '@/types';
import { useTaskSocket } from './useTaskSocket';
import { toast } from 'sonner';

export function useTasks(userId?: number) {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchTasks = useCallback(async () => {
        try {
            const response = await taskApi.getAll();
            setTasks(response.data || []);
        } catch (error) {
            console.error(error);
            toast.error('Failed to sync tasks');
        } finally {
            setLoading(false);
        }
    }, []);

    // Initial Fetch
    useEffect(() => {
        fetchTasks();
    }, [fetchTasks]);

    // Socket Connection
    useTaskSocket(userId, fetchTasks);

    const createTask = async (title: string, deadline: string) => {
        try {
            await taskApi.create({ title, deadline });
            toast.success('Task created successfully');
            fetchTasks();
        } catch (error) {
            console.error(error);
            throw error;
        }
    };

    const updateTask = async (id: number, title: string, deadline: string) => {
        try {
            await taskApi.update(id, { title, deadline });
            toast.success('Task updated');
            setTasks(prev => prev.map(t => t.id === id ? { ...t, title, deadline } : t));
        } catch (error) {
            console.error(error);
            throw error;
        }
    };

    const toggleTaskCompletion = async (task: Task) => {
        try {
            const updatedTask = { ...task, is_completed: !task.is_completed };
            setTasks(prev => prev.map(t => t.id === task.id ? updatedTask : t));
            await taskApi.update(task.id, { is_completed: !task.is_completed });
        } catch (error) {
            console.error(error);
            setTasks(prev => prev.map(t => t.id === task.id ? task : t));
            throw error;
        }
    };

    const deleteTask = async (id: number) => {
        try {
            setTasks(prev => prev.filter(t => t.id !== id));
            await taskApi.delete(id);
            toast.success('Task deleted');
        } catch (error) {
            console.error(error);
            fetchTasks();
            throw error;
        }
    };

    return {
        tasks,
        loading,
        fetchTasks,
        createTask,
        updateTask,
        toggleTaskCompletion,
        deleteTask
    };
}
