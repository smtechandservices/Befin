'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthProvider';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useAuth();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (email && password) {
            login(email);
        }
    };

    return (
        <div className="flex-center" style={{ minHeight: '100vh', padding: '1rem' }}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="card"
                style={{ width: '100%', maxWidth: '400px', padding: '2.5rem' }}
            >
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>Welcome Back</h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Log in to your paper trading account</p>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label style={{ fontSize: '0.875rem', fontWeight: 500 }}>Email Address</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="name@company.com"
                            required
                            style={{
                                background: 'var(--background)',
                                border: '1px solid var(--border)',
                                borderRadius: '6px',
                                padding: '0.75rem 1rem',
                                color: 'white',
                                outline: 'none'
                            }}
                        />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label style={{ fontSize: '0.875rem', fontWeight: 500 }}>Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            required
                            style={{
                                background: 'var(--background)',
                                border: '1px solid var(--border)',
                                borderRadius: '6px',
                                padding: '0.75rem 1rem',
                                color: 'white',
                                outline: 'none'
                            }}
                        />
                    </div>

                    <button
                        type="submit"
                        style={{
                            background: 'var(--primary)',
                            color: 'white',
                            padding: '0.75rem',
                            borderRadius: '6px',
                            fontWeight: 600,
                            marginTop: '0.5rem'
                        }}
                        onMouseOver={(e) => e.currentTarget.style.background = 'var(--primary-hover)'}
                        onMouseOut={(e) => e.currentTarget.style.background = 'var(--primary)'}
                    >
                        Sign In
                    </button>
                </form>

                <div style={{ marginTop: '2rem', textAlign: 'center', fontSize: '0.875rem' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Don&apos;t have an account? </span>
                    <Link href="/signup" style={{ color: 'var(--primary)', fontWeight: 500 }}>Create one</Link>
                </div>
            </motion.div>
        </div>
    );
}
