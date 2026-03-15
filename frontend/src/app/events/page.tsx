'use client';

import React from 'react';
import Sidebar from '../../components/Sidebar';
import { Calendar, Trophy, Zap, Clock, ArrowRight, Menu } from 'lucide-react';
import { useState } from 'react';

export default function EventsPage() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const upcomingTypes = [
        { name: 'Hackathons', icon: Zap, description: 'Build innovative solutions and compete for prizes.', color: 'text-yellow-400', bg: 'bg-yellow-400/10' },
        { name: 'Contests', icon: Trophy, description: 'Test your financial knowledge in real-time challenges.', color: 'text-blue-400', bg: 'bg-blue-400/10' },
        { name: 'Workshops', icon: Calendar, description: 'Learn from industry experts in interactive sessions.', color: 'text-purple-400', bg: 'bg-purple-400/10' },
    ];

    return (
        <div className="flex h-screen bg-[#0a0a0b] font-sans text-white overflow-hidden relative">
            <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

            <main className="flex-1 flex flex-col h-full overflow-hidden">
                <div className="flex-1 overflow-y-auto px-6 md:px-10 pb-10 flex flex-col items-center justify-center text-center">
                    <div className="w-full">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-black uppercase tracking-widest mb-8 animate-pulse">
                            <Clock size={14} />
                            Coming Soon
                        </div>

                        <h2 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight">
                            Something Big is <span className="text-blue-500">Coming</span>
                        </h2>
                        
                        <p className="text-slate-400 text-lg md:text-xl font-medium mb-12 max-w-5xl mx-auto leading-relaxed">
                            We're crafting an elite space for hackathons, trading contests, and financial workshops. Get ready to showcase your skills and win big.
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 text-left">
                            {upcomingTypes.map((type) => (
                                <div key={type.name} className="bg-[#18181c] border border-white/5 rounded-3xl p-6 hover:border-blue-500/20 transition-all group">
                                    <div className={`w-12 h-12 ${type.bg} ${type.color} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                                        <type.icon size={24} />
                                    </div>
                                    <h3 className="text-lg font-bold text-white mb-2">{type.name}</h3>
                                    <p className="text-sm text-slate-500 font-medium leading-relaxed">
                                        {type.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
