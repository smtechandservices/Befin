import api from './api';

// Client-safe auth methods
export const authService = {
    getProfile: async () => {
        const res = await api.get('/users/profile/');
        return res.data;
    },
    logout: async () => {
        if (typeof window !== 'undefined') {
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            window.location.href = '/login';
        }
    }
};
