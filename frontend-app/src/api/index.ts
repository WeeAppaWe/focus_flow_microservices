import axios from 'axios';
import { toast } from 'sonner';

// When using NGINX gateway, set NEXT_PUBLIC_API_URL to '/api'
// When running directly, set to 'http://localhost:3001'
const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
    withCredentials: true,
    timeout: 10000,
});

api.interceptors.request.use((config) => {
    if (typeof window !== 'undefined') {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        // CSRF Protection: Add custom header
        config.headers['X-Requested-With'] = 'XMLHttpRequest';
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (typeof window !== 'undefined') {
            const status = error.response?.status;
            const errorData = error.response?.data;

            // Extract error details from BE response
            const errorCode = errorData?.errorCode || 'UNKNOWN_ERROR';
            const message = errorData?.message || 'An unexpected error occurred';
            const layer = errorData?.layer || 'unknown';

            if (status === 401) {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                window.location.href = '/auth/login';
            } else if (status === 429) {
                toast.error('Too Many Requests', {
                    description: message,
                });
            } else if (status >= 400) {
                // Show detailed error from BE
                toast.error(`Error: ${errorCode}`, {
                    description: `${message} (${layer} layer)`,
                });
            }
        }
        return Promise.reject(error);
    }
);

export default api;
