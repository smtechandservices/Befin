// Client-safe auth methods
export const authService = {
    getProfile: async () => {
        const res = await fetch('/api/user/profile');
        if (!res.ok) throw new Error('Failed to fetch profile');
        return res.json();
    },
    logout: async () => {
        const res = await fetch('/api/auth/logout', { method: 'POST' });
        if (!res.ok) throw new Error('Failed to logout');
        if (typeof window !== 'undefined') {
            window.location.href = '/login';
        }
    }
};
