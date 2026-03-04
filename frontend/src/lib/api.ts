import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';

export const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

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

    updateProfile: async (data: any) => {
        const response = await api.put('/users/profile/', data);
        return response.data;
    },


    getReferralCode: async () => {
        const response = await api.get('/users/referral-code/');
        return response.data;
    },

    generateReferralCode: async () => {
        const response = await api.post('/users/referral-code/');
        return response.data;
    },
};

export const walletService = {
    getBalance: async () => {
        const response = await api.get('/wallet/balance/');
        return response.data;
    },

    getTransactions: async () => {
        const response = await api.get('/wallet/transactions/');
        return response.data;
    },

    getDiscounts: async () => {
        const response = await api.get('/wallet/discounts/');
        return response.data;
    },

    transferMoney: async (identifier: string, amount: number) => {
        const response = await api.post('/wallet/transfer/', { identifier, amount });
        return response.data;
    },

    searchUsers: async (query: string) => {
        const response = await api.get(`/wallet/search-users/?q=${query}`);
        return response.data;
    },
};

export const gamesService = {
    getGames: async () => {
        const response = await api.get('/games/');
        return response.data;
    },
};

// Add a request interceptor to add the JWT token
api.interceptors.request.use(
    (config) => {
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem('access_token');
            if (token && config.headers) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Add a response interceptor to handle token refresh or unauthorized errors
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // If error is 401 and we haven't already retried
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                if (typeof window !== 'undefined') {
                    const refreshToken = localStorage.getItem('refresh_token');
                    if (refreshToken) {
                        const response = await axios.post(`${API_BASE_URL}/users/token/refresh/`, {
                            refresh: refreshToken
                        });

                        const newAccessToken = response.data.access;
                        localStorage.setItem('access_token', newAccessToken);

                        // Retry the original request with new token
                        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                        return api(originalRequest);
                    }
                }
            } catch (refreshError) {
                // If refresh fails, clear tokens and redirect to login
                if (typeof window !== 'undefined') {
                    localStorage.removeItem('access_token');
                    localStorage.removeItem('refresh_token');
                    window.location.href = '/login';
                }
            }
        }
        return Promise.reject(error);
    }
);

