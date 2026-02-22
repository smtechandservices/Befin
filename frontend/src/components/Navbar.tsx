'use client';

import React from 'react';
import { Search, Bell, CircleHelp } from 'lucide-react';

interface NavbarProps {
    title: string;
}

export default function Navbar({ title }: NavbarProps) {
    return (
        <header className="flex justify-between items-center px-10 py-8 shrink-0">
            <h1 className="text-3xl font-semibold tracking-tight text-white">{title}</h1>
            <div className="flex items-center gap-4">
                <button className="w-10 h-10 rounded-full bg-[#1c1c24] flex items-center justify-center text-slate-400 hover:text-white transition-colors border border-white/5">
                    <Search className="w-4 h-4" />
                </button>
                <button className="w-10 h-10 rounded-full bg-[#1c1c24] flex items-center justify-center text-slate-400 hover:text-white transition-colors border border-white/5">
                    <Bell className="w-4 h-4" />
                </button>
                <button className="w-10 h-10 rounded-full bg-[#1c1c24] flex items-center justify-center text-slate-400 hover:text-white transition-colors border border-white/5">
                    <CircleHelp className="w-4 h-4" />
                </button>
            </div>
        </header>
    );
}
