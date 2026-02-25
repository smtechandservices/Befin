'use client';

import React from 'react';
import { Search, Bell, CircleHelp } from 'lucide-react';

interface NavbarProps {
    title: string;
    subtitle?: string;
    showProfile?: boolean;
    showSearch?: boolean;
    showHelp?: boolean;
    className?: string;
}

export default function Navbar({
    title,
    subtitle,
    showProfile = false,
    showSearch = true,
    showHelp = true,
    className = ''
}: NavbarProps) {
    return (
        <header className={`flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0 ${className}`}>
            <div>
                <h1 className="text-3xl font-black tracking-tight text-white">{title}</h1>
                {subtitle && (
                    <p className="text-slate-500 font-medium mt-1">{subtitle}</p>
                )}
            </div>

            <div className="flex items-center gap-3">
                {showSearch && (
                    <button className="p-3 bg-[#111] rounded-2xl border border-white/5 hover:bg-[#16161c] transition-colors relative flex items-center justify-center">
                        <Search className="w-5 h-5 text-slate-400" />
                    </button>
                )}

                <button className="p-3 bg-[#111] rounded-2xl border border-white/5 hover:bg-[#16161c] transition-colors relative flex items-center justify-center">
                    <Bell className="w-5 h-5 text-slate-400" />
                    <span className="absolute top-3 right-3 w-2 h-2 bg-blue-500 rounded-full border-2 border-[#111]"></span>
                </button>

                {showHelp && (
                    <button className="p-3 bg-[#111] rounded-2xl border border-white/5 hover:bg-[#16161c] transition-colors relative flex items-center justify-center">
                        <CircleHelp className="w-5 h-5 text-slate-400" />
                    </button>
                )}

                {showProfile && (
                    <div className="w-11 h-11 ml-2 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 border-2 border-white/10 shrink-0"></div>
                )}
            </div>
        </header>
    );
}
