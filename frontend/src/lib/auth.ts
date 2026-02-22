import api from './api';

export const authService = {
    register: async (userData: any) => {
        const response = await api.post('/users/register/', userData);
        return response.data;
    },

    login: async (credentials: any) => {
        const response = await api.post('/users/login/', credentials);
        if (response.data.access) {
            if (typeof window !== 'undefined') {
                localStorage.setItem('access_token', response.data.access);
                localStorage.setItem('refresh_token', response.data.refresh);
            }
        }
        return response.data;
    },

    logout: () => {
        if (typeof window !== 'undefined') {
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
        }
    },

    getProfile: async () => {
        const response = await api.get('/users/profile/');
        return response.data;
    },
};
