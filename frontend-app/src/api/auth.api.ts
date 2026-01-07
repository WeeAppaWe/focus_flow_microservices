import api from './index';
import { AuthResponse, LoginPayload, RegisterPayload } from '@/types';

export const authApi = {
    login: async (payload: LoginPayload): Promise<AuthResponse> => {
        const response = await api.post('/auth/login', payload);
        return response.data;
    },

    register: async (payload: RegisterPayload): Promise<AuthResponse> => {
        const response = await api.post('/auth/register', payload);
        return response.data;
    }
};
