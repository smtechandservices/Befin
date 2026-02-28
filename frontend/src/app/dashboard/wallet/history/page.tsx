'use client';

import React from 'react';
import { History, Clock, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function HistoryComingSoon() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[70vh] text-white p-10 bg-[#111115]">
            <div className="w-24 h-24 bg-[#0380f5]/10 rounded-full flex items-center justify-center mb-6">
                <History className="w-12 h-12 text-[#0380f5]" />
            </div>

            <h1 className="text-4xl font-black mb-4 uppercase tracking-tighter">Transaction History</h1>

            <div className="flex items-center gap-2 bg-[#1C1F26] px-6 py-2 rounded-full border border-white/5 shadow-xl mb-8">
                <Clock className="w-4 h-4 text-orange-400" />
                <span className="text-lg font-bold uppercase tracking-widest text-[#888888]">Feature Coming Soon</span>
            </div>

            <p className="text-slate-500 text-center max-w-md font-medium mb-10 leading-relaxed">
                We're building a comprehensive ledger to help you track every single BeCoin with advanced filtering, PDF exports, and detailed analytics.
            </p>

            <Link href="/dashboard" className="flex items-center gap-2 bg-white/5 hover:bg-white/10 px-8 py-3 rounded-2xl transition-all border border-white/5 text-sm font-bold">
                <ArrowLeft size={16} />
                Back to Dashboard
            </Link>
        </div>
    );
}
