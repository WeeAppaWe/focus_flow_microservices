import { io } from 'socket.io-client';

// When using NGINX gateway, socket connects to same origin (NGINX handles routing)
// When running directly, connects to backend port
const getSocketUrl = () => {
    if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_USE_GATEWAY === 'true') {
        return window.location.origin;
    }
    return process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001';
};

const socket = io(getSocketUrl(), {
    withCredentials: true,
    autoConnect: false,
    path: '/socket.io',
});

export default socket;
