'use client';

import React from 'react';
import Sidebar from '../../components/Sidebar';
import Navbar from '../../components/Navbar';
import { Target, Sparkles } from 'lucide-react';

export default function GoalSetterPage() {
    return (
        <div className="flex h-screen bg-[#111115] font-sans text-white overflow-hidden">
            {/* Left Sidebar */}
            <Sidebar />

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col h-full overflow-hidden">
                {/* Header Navbar */}
                <Navbar title="Goal Setter" />

                {/* Coming Soon Content */}
                <div className="flex-1 overflow-y-auto px-10 pb-10 no-scrollbar flex items-center justify-center">
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
