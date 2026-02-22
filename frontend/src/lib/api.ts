import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

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

export default api;
