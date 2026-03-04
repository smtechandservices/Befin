'use client';

import React from 'react';

export default function LoadingScreen() {
    return (
        <div className="flex h-screen bg-[#0a0a0b] items-center justify-center font-sans">
            <div className="flex flex-col items-center gap-6">
                <div className="relative">
                    <div className="w-16 h-16 rounded-full border-t-2 border-b-2 border-blue-500 animate-spin"></div>
                    <div className="absolute inset-0 bg-blue-500/10 rounded-full blur-xl"></div>
                </div>
                <div className="flex flex-col items-center gap-1">
                    <h2 className="text-white font-black tracking-widest uppercase text-xs opacity-80">BeFin</h2>
                    <div className="flex gap-1">
                        <div className="w-1 h-1 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                        <div className="w-1 h-1 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                        <div className="w-1 h-1 bg-blue-500 rounded-full animate-bounce"></div>
                    </div>
                </div>
            </div>
        </div>
    );
}
