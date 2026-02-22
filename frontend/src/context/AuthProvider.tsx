'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { useRouter } from 'next/navigation';

interface AuthContextType {
    user: User | null;
    login: (email: string) => void;
    signup: (email: string, name: string) => void;
    logout: () => void;
    completeOnboarding: () => void;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        // Read the shared befin_token cookie set by the Dashboard on localhost
        const getCookie = (name: string) => {
            const value = `; ${document.cookie}`;
            const parts = value.split(`; ${name}=`);
            if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
            return null;
        };

        const token = getCookie('befin_token');

        if (token) {
            // 2. Fetch User Profile from Django
            fetch('http://localhost:8000/api/users/profile/', {
                headers: { 'Authorization': `Bearer ${token}` }
            })
                .then(res => {
                    if (!res.ok) throw new Error('Auth failed');
                    return res.json();
                })
                .then(data => {
                    setUser({
                        id: data.id?.toString() || '1',
                        email: data.email,
                        name: data.username,
                        isDematActive: true, // Auto-skip onboarding for SSO users
                        balance: 100000,
                    });
                    setIsLoading(false);
                })
                .catch(() => {
                    localStorage.removeItem('befin_token');
                    setIsLoading(false);
                });
        } else {
            // Fallback to local mock if no token (for dev purposes)
            const saved = localStorage.getItem('paper_trading_user');
            if (saved) {
                setUser(JSON.parse(saved));
            }
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        if (user) {
            localStorage.setItem('paper_trading_user', JSON.stringify(user));
        } else {
            localStorage.removeItem('paper_trading_user');
        }
    }, [user]);

    const login = (email: string) => {
        // Mock login
        const mockUser: User = {
            id: '1',
            email,
            name: email.split('@')[0],
            isDematActive: true,
            balance: 100000,
        };
        setUser(mockUser);
        router.push('/dashboard');
    };

    const signup = (email: string, name: string) => {
        // Mock signup
        const mockUser: User = {
            id: Math.random().toString(36).substr(2, 9),
            email,
            name,
            isDematActive: false,
            balance: 100000,
        };
        setUser(mockUser);
        router.push('/onboarding');
    };

    const logout = () => {
        setUser(null);
        document.cookie = 'befin_token=; Max-Age=0; path=/; domain=localhost;';
        router.push('http://localhost:3000/login');
    };

    const completeOnboarding = () => {
        if (user) {
            setUser({ ...user, isDematActive: true });
            router.push('/dashboard');
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, signup, logout, completeOnboarding, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
