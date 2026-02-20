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
        const saved = localStorage.getItem('paper_trading_user');
        if (saved) {
            setUser(JSON.parse(saved));
        }
        setIsLoading(false);
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
        router.push('/login');
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
