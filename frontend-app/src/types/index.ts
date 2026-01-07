// User Types
export interface User {
    id: number;
    name: string;
    email: string;
}

// Auth Types
export interface LoginPayload {
    email: string;
    password: string;
}

export interface RegisterPayload {
    name: string;
    email: string;
    password: string;
}

export interface AuthResponse {
    status: string;
    message: string;
    data: {
        token: string;
        user: User;
    };
}

// Task Types
export interface Task {
    id: number;
    title: string;
    deadline: string;
    is_completed: boolean;
    is_notified: boolean;
    created_at?: string;
    updated_at?: string;
}

export interface CreateTaskPayload {
    title: string;
    deadline: string;
}

export interface UpdateTaskPayload {
    title?: string;
    deadline?: string;
    is_completed?: boolean;
}

// API Response Types
export interface ApiResponse<T = unknown> {
    status: 'success' | 'fail' | 'error';
    message: string;
    data?: T;
}

export interface ApiErrorResponse {
    status: 'fail' | 'error';
    errorCode: string;
    message: string;
    layer: string;
    timestamp: string;
}

// Socket Types
export interface NotificationPayload {
    title: string;
    message: string;
    taskId: number;
}

// Notification Types
export interface Notification {
    id: number;
    user_id: number;
    title: string;
    message: string;
    type: 'task_reminder' | 'system' | 'info';
    is_read: boolean;
    task_id: number | null;
    created_at: string;
    updated_at: string;
}

export interface NotificationListResponse {
    notifications: Notification[];
    pagination: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}
