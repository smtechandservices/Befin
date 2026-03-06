'use client';

import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import { Target, Sparkles } from 'lucide-react';
import LoadingScreen from '../../components/LoadingScreen';

export default function GoalSetterPage() {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 500);
        return () => clearTimeout(timer);
    }, []);

    if (loading) {
        return <LoadingScreen />;
    }

    return (
        <div className="flex h-screen bg-[#0a0a0b] font-sans text-white overflow-hidden">
            {/* Left Sidebar */}
            <Sidebar />

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col h-full overflow-hidden">
                {/* Local Header */}
                <header className="px-10 py-8 shrink-0">
                    <h1 className="text-[2.5rem] font-black tracking-tight text-white leading-tight">Goals</h1>
                    <p className="text-slate-400 font-semibold text-sm tracking-wide opacity-80 uppercase italic">Set, track, and achieve your financial targets</p>
                </header>

                {/* Coming Soon Content */}
                <div className="flex-1 overflow-y-auto px-10 pb-10 flex items-center justify-center">
                    <div className="flex flex-col items-center justify-center max-w-md text-center">
                        <div className="w-24 h-24 bg-[#18181c] rounded-full border border-white/5 flex items-center justify-center mb-6 relative">
                            <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-xl"></div>
                            <Target className="w-10 h-10 text-[#0380f5] relative z-10" />
                            <Sparkles className="w-5 h-5 text-[#FFCA28] absolute top-2 right-2 z-10" />
                        </div>

                        <h2 className="text-4xl font-bold tracking-tight text-white mb-4">
                            Coming Soon
                        </h2>

                        <p className="text-slate-400 text-lg leading-relaxed mb-8">
                            We're working hard to bring you the ultimate tool to set, track, and achieve your financial goals. Stay tuned!
                        </p>
                    </div>
                </div>
            </main>
        </div>
    );
}
