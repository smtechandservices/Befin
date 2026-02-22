'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { Home, Wallet, Target, BookOpen, History, User, LogOut } from 'lucide-react';
import { authService } from '../lib/auth';

export default function Sidebar() {
    const pathname = usePathname();
    const router = useRouter();

    const handleLogout = () => {
        authService.logout();
        router.push('/login');
    };

    const links = [
        { name: 'Home', icon: Home, href: '/dashboard' },
        { name: 'Wallet', icon: Wallet, href: '/wallet' },
        { name: 'Goal Setter', icon: Target, href: '#' },
        { name: 'Learning', icon: BookOpen, href: '#' },
        { name: 'History', icon: History, href: '#' },
        { name: 'Profile', icon: User, href: '#' },
    ];

    return (
        <aside className="w-[240px] bg-[#14141d] flex flex-col justify-between hidden md:flex shrink-0 border-r border-white/5">
            <div>
                <div className="flex items-center gap-3 px-8 py-8">
                    <Image src="/images/logo.png" alt="BeFin Logo" width={32} height={32} className="object-contain" />
                    <span className="text-2xl font-bold tracking-tight text-white">BeFin</span>
                </div>

                <nav className="flex flex-col gap-2 px-4 mt-4">
                    {links.map((link) => {
                        const Icon = link.icon;
                        const isActive = pathname === link.href;
                        return (
                            <Link key={link.name} href={link.href} className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl font-medium transition-all ${isActive ? 'bg-[#1c1c24] text-[#0380f5]' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>
                                <Icon className={`w-5 h-5 ${isActive ? 'opacity-100' : 'opacity-60'}`} />
                                {link.name}
                            </Link>
                        );
                    })}
                </nav>
            </div>

            <div className="p-4 mb-4">
                <button onClick={handleLogout} className="flex items-center gap-4 w-full px-4 py-3.5 rounded-2xl font-medium text-red-400 hover:bg-red-400/10 transition-all">
                    <LogOut className="w-5 h-5" />
                    Logout
                </button>
            </div>
        </aside>
    );
}
