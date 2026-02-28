'use client';

import React from 'react';
import { Target, Clock } from 'lucide-react';

export default function GoalsPage() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-white p-10">
            <div className="w-24 h-24 bg-blue-500/10 rounded-full flex items-center justify-center mb-6">
                <Target className="w-12 h-12 text-blue-400" />
            </div>
            <h1 className="text-4xl font-black mb-4">Goal Setter</h1>
            <div className="flex items-center gap-2 bg-[#1C1F26] px-6 py-2 rounded-full border border-white/5 shadow-xl">
                <Clock className="w-4 h-4 text-orange-400" />
                <span className="text-lg font-bold uppercase tracking-widest text-slate-300">Coming Soon</span>
            </div>
            <p className="mt-8 text-slate-500 text-center max-w-md font-medium">
                We're building a smarter way to help you reach your financial milestones. Stay tuned for personalized goal tracking and automated savings!
            </p>
        </div>
    );
}
