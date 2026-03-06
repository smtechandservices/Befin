'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { Home, Wallet, Target, BookOpen, User, LogOut, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { authService } from '../lib/api';

interface SidebarProps {
    isOpen?: boolean;
    onClose?: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
    const pathname = usePathname();
    const router = useRouter();
    const [collapsed, setCollapsed] = useState(false);

    useEffect(() => {
        const stored = localStorage.getItem('sidebar_collapsed');
        if (stored === 'true') setCollapsed(true);
    }, []);

    const toggleCollapse = () => {
        const next = !collapsed;
        setCollapsed(next);
        localStorage.setItem('sidebar_collapsed', String(next));
    };

    const handleLogout = () => {
        authService.logout();
        router.push('/login');
    };

    const links = [
        { name: 'Home', icon: Home, href: '/dashboard' },
        { name: 'Wallet', icon: Wallet, href: '/wallet' },
        { name: 'Goals', icon: Target, href: '/goals' },
        { name: 'Learning', icon: BookOpen, href: '/learning' },
        { name: 'Profile', icon: User, href: '/profile' },
    ];

    const sidebarContent = (isMobile = false) => (
        <div className="flex flex-col h-full bg-[#14141d]">
            {/* Header */}
            <div className={`flex items-center px-4 pt-10 pb-4 ${collapsed && !isMobile ? 'justify-center' : 'justify-between px-6'}`}>
                {(!collapsed || isMobile) && (
                    <div className="flex items-center gap-3">
                        <Image src="/images/logo.png" alt="BeFin Logo" width={46} height={46} className="object-contain" />
                        <span className="text-3xl tracking-tight text-white">BeFin</span>
                    </div>
                )}
                {collapsed && !isMobile && (
                    <Image src="/images/logo.png" alt="BeFin Logo" width={36} height={36} className="object-contain" />
                )}
                {isMobile && onClose && (
                    <button onClick={onClose} className="p-2 text-slate-400 hover:text-white transition-colors">
                        <X size={24} />
                    </button>
                )}
            </div>

            {/* Nav Links */}
            <nav className="flex flex-col gap-2 px-2 mt-4 flex-1">
                <hr className='text-white/15' />
                {links.map((link) => {
                    const Icon = link.icon;
                    const isActive = pathname === link.href;
                    return (
                        <Link
                            key={link.name}
                            href={link.href}
                            onClick={isMobile ? onClose : undefined}
                            title={collapsed && !isMobile ? link.name : undefined}
                            className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl font-medium transition-all ${collapsed && !isMobile ? 'justify-center' : ''} ${isActive ? 'bg-[#1c1c24] text-[#0380f5]' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
                        >
                            <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'opacity-100' : 'opacity-60'}`} />
                            {(!collapsed || isMobile) && <span>{link.name}</span>}
                        </Link>
                    );
                })}
            </nav>

            {/* Bottom: Logout + Collapse Toggle */}
            <div className="p-4 mb-4 flex flex-col gap-2">
                <hr className='text-white/15 my-2' />
                <button
                    onClick={handleLogout}
                    title={collapsed && !isMobile ? 'Logout' : undefined}
                    className={`flex items-center gap-4 w-full px-4 py-3.5 rounded-2xl font-medium text-red-400 hover:bg-red-400/10 transition-all ${collapsed && !isMobile ? 'justify-center' : ''}`}
                >
                    <LogOut className="w-5 h-5 shrink-0" />
                    {(!collapsed || isMobile) && <span>Logout</span>}
                </button>

                {/* Desktop-only collapse toggle */}
                {!isMobile && (
                    <button
                        onClick={toggleCollapse}
                        className={`hidden md:flex items-center gap-3 w-full px-4 py-3 rounded-2xl font-medium text-slate-500 hover:text-white hover:bg-white/5 transition-all ${collapsed ? 'justify-center' : ''}`}
                        title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                    >
                        {collapsed ? <ChevronRight className="w-4 h-4 shrink-0" /> : <ChevronLeft className="w-4 h-4 shrink-0" />}
                        {!collapsed && <span className="text-sm">Collapse</span>}
                    </button>
                )}
            </div>
        </div>
    );

    return (
        <>
            {/* Desktop Sidebar */}
            <aside
                className={`bg-[#14141d] hidden md:flex shrink-0 border-r border-white/5 h-full transition-all duration-300 ease-in-out ${collapsed ? 'w-[72px]' : 'w-[200px]'}`}
            >
                {sidebarContent(false)}
            </aside>

            {/* Mobile Sidebar Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm md:hidden transition-opacity duration-300"
                    onClick={onClose}
                />
            )}

            {/* Mobile Sidebar Drawer */}
            <aside className={`fixed inset-y-0 left-0 z-[101] w-[280px] bg-[#14141d] md:hidden transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                {sidebarContent(true)}
            </aside>
        </>
    );
}
