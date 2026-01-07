import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface User {
    id: number;
    name: string;
    email: string;
}

export const useAuth = () => {
    const [user, setUser] = useState<User | null>(null);
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/auth/login');
            return;
        }

        const userData = JSON.parse(localStorage.getItem('user') || '{}');
        // eslint-disable-next-line
        setUser(userData);
    }, [router]);

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        router.push('/auth/login');
    };

    return { user, logout };
};
