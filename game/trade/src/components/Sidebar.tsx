'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, LineChart, Wallet, History, Settings, LogOut } from 'lucide-react';
import { useAuth } from '@/context/AuthProvider';

const NAV_ITEMS = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
    { icon: LineChart, label: 'Market', href: '/market' },
    { icon: Wallet, label: 'Portfolio', href: '/portfolio' },
    { icon: History, label: 'History', href: '/history' },
];

export default function Sidebar() {
    const pathname = usePathname();
    const { logout, user } = useAuth();

    return (
        <aside className="glass" style={{
            width: '240px',
            height: '100vh',
            display: 'flex',
            flexDirection: 'column',
            padding: '1.5rem 1rem',
            position: 'fixed',
            left: 0,
            top: 0,
            zIndex: 100,
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0 0.5rem 2rem', borderBottom: '1px solid var(--divider)', marginBottom: '1.5rem' }}>
                <div style={{ width: '32px', height: '32px', background: 'var(--primary)', borderRadius: '6px' }} />
                <span style={{ fontSize: '1.25rem', fontWeight: 700, letterSpacing: '-0.5px' }}>TradePro</span>
            </div>

            <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                {NAV_ITEMS.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.75rem',
                                padding: '0.75rem 1rem',
                                borderRadius: '8px',
                                color: isActive ? 'white' : 'var(--text-secondary)',
                                background: isActive ? 'rgba(255,255,255,0.05)' : 'transparent',
                                transition: 'all 0.2s ease',
                            }}
                            onMouseOver={(e) => !isActive && (e.currentTarget.style.background = 'rgba(255,255,255,0.02)')}
                            onMouseOut={(e) => !isActive && (e.currentTarget.style.background = 'transparent')}
                        >
                            <item.icon size={20} />
                            <span style={{ fontWeight: 500 }}>{item.label}</span>
                        </Link>
                    );
                })}
            </nav>

            <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px solid var(--border)' }}>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>Signed in as</p>
                    <p style={{ fontSize: '0.875rem', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.name}</p>
                </div>

                <button
                    onClick={logout}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        padding: '0.75rem 1rem',
                        color: 'var(--danger)',
                        width: '100%',
                    }}
                >
                    <LogOut size={20} />
                    <span style={{ fontWeight: 500 }}>Log Out</span>
                </button>
            </div>
        </aside>
    );
}
