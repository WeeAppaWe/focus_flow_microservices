import api from './index';
import { Task, CreateTaskPayload, UpdateTaskPayload, ApiResponse } from '@/types';

export const taskApi = {
    getAll: async (): Promise<ApiResponse<Task[]>> => {
        const response = await api.get('/tasks');
        return response.data;
    },

    create: async (payload: CreateTaskPayload): Promise<ApiResponse<Task>> => {
        const response = await api.post('/tasks', payload);
        return response.data;
    },

    update: async (id: number, payload: UpdateTaskPayload): Promise<ApiResponse<Task>> => {
        const response = await api.put(`/tasks/${id}`, payload);
        return response.data;
    },

    delete: async (id: number): Promise<ApiResponse<null>> => {
        const response = await api.delete(`/tasks/${id}`);
        return response.data;
    }
};
