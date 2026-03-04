'use client';

import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import { Gamepad2, Sparkles, TrendingUp, Coins, BarChart2, PieChart, Play, MousePointer2 } from 'lucide-react';
import LoadingScreen from '@/components/LoadingScreen';
import { gamesService } from '@/lib/api';

export default function LearningPage() {
    const [loading, setLoading] = useState(true);
    const [games, setGames] = useState<any[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [gamesData] = await Promise.all([
                    gamesService.getGames(),
                    new Promise(resolve => setTimeout(resolve, 500))
                ]);
                setGames(Array.isArray(gamesData) ? gamesData : []);
            } catch (error) {
                console.error("Error fetching games:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const upcoming = [
        { icon: TrendingUp, label: 'Stock Market Simulator', color: 'text-blue-400', bg: 'bg-blue-500/10', desc: 'Real-time market training with virtual currency' },
        { icon: Coins, label: 'A-Z of Money', color: 'text-yellow-400', bg: 'bg-yellow-500/10', desc: 'Master the basics of personal finance management' },
        { icon: BarChart2, label: 'Finance Wordle', color: 'text-green-400', bg: 'bg-green-500/10', desc: 'Daily puzzles to test your financial vocabulary' },
        { icon: PieChart, label: 'Portfolio Optimizer', color: 'text-purple-400', bg: 'bg-purple-500/10', desc: 'Learn asset allocation and risk management' },
    ];

    if (loading) {
        return <LoadingScreen />;
    }

    return (
        <div className="flex h-screen bg-[#0a0a0b] font-sans text-white overflow-hidden">
            <Sidebar />

            <main className="flex-1 flex flex-col h-full overflow-hidden">
                <header className="px-10 py-8 shrink-0">
                    <h1 className="text-[2.5rem] font-black tracking-tight text-white leading-tight">Learning</h1>
                    <p className="text-slate-400 font-semibold text-sm tracking-wide opacity-80 uppercase italic">Finance games & interactive challenges</p>
                </header>

                <div className="flex-1 overflow-y-auto px-10 pb-10 no-scrollbar">
                    <div className="mx-auto flex flex-col gap-10 py-4">

                        {/* Hero Banner */}
                        <div className="relative rounded-[2.5rem] overflow-hidden bg-[#111] border border-white/5 p-8 lg:p-12">
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-transparent to-purple-600/10"></div>
                            <div className="absolute -right-20 -top-20 w-80 h-80 bg-blue-500/10 rounded-full blur-[100px]"></div>

                            <div className="relative z-10 flex flex-col lg:flex-row items-center gap-10">
                                <div className="flex-1 text-center lg:text-left">
                                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-black uppercase tracking-[0.2em] mb-4">
                                        <Sparkles className="w-3 h-3" /> Educational Gaming
                                    </div>
                                    <h2 className="text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight mb-4">
                                        Level up your <span className="text-blue-500 text-glow">Finance IQ</span>
                                    </h2>
                                    <p className="text-slate-400 text-base font-medium leading-relaxed mb-6 max-w-md mx-auto lg:mx-0">
                                        Master the stock market, budgeting, and investment strategies through interactive challenges. Gaming meets financial freedom.
                                    </p>
                                    <button className="bg-white text-black px-8 py-3 rounded-full font-black text-xs uppercase tracking-widest hover:scale-105 transition-transform cursor-not-allowed opacity-80">
                                        Explore Games
                                    </button>
                                </div>
                                <div className="w-48 h-48 lg:w-64 lg:h-64 bg-[#18181c] rounded-[3rem] border border-white/5 flex items-center justify-center relative group">
                                    <div className="absolute inset-4 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[2rem] opacity-20 filter blur-2xl group-hover:opacity-40 transition-opacity"></div>
                                    <Gamepad2 className="w-20 h-20 text-[#0380f5] relative z-10 animate-pulse" />
                                </div>
                            </div>
                        </div>

                        {/* Games Section */}
                        <div className="flex flex-col gap-6">
                            <div className="flex items-center justify-between px-2">
                                <div className="flex flex-col gap-1">
                                    <h3 className="text-xl font-black text-white uppercase tracking-tight">
                                        {games.length > 0 ? 'Featured Games' : 'Available Games'}
                                    </h3>
                                    <p className="text-xs font-bold text-slate-500">
                                        {games.length > 0 ? 'Interactive financial experiences ready to play' : 'Coming soon to the BeFin ecosystem'}
                                    </p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Live Games from Model */}
                                {games.map((game: any) => (
                                    <a
                                        key={game.id}
                                        href={game.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="group relative p-6 bg-[#111] rounded-[2rem] border border-white/5 hover:border-blue-500/20 hover:bg-blue-500/[0.02] transition-all cursor-pointer overflow-hidden"
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>

                                        <div className="relative z-10 flex flex-col gap-4">
                                            <div className="flex items-center justify-between">
                                                <div className={`w-14 h-14 bg-blue-500/10 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 duration-500`}>
                                                    <Gamepad2 className={`w-7 h-7 text-blue-400`} />
                                                </div>
                                                <div className="flex gap-2">
                                                    <div className="px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-[9px] font-black text-blue-400 uppercase tracking-widest">
                                                        Live
                                                    </div>
                                                </div>
                                            </div>

                                            <div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <h4 className="text-lg font-black text-white">{game.name}</h4>
                                                    <span className="text-[10px] font-bold text-slate-500 bg-white/5 px-2 py-0.5 rounded-md">{game.genre}</span>
                                                </div>
                                                <p className="text-xs font-medium text-slate-400">Age: {game.age_req}+</p>
                                            </div>

                                            <div className="mt-2 flex items-center gap-2 text-blue-500 text-[10px] font-black uppercase tracking-widest group-hover:translate-x-1 transition-transform">
                                                Play Now <MousePointer2 className="w-3 h-3" />
                                            </div>
                                        </div>
                                    </a>
                                ))}

                                {/* Upcoming games (coming soon) */}
                                {(games.length === 0 ? upcoming : upcoming.slice(0, 2)).map(({ icon: Icon, label, color, bg, desc }) => (
                                    <div key={label} className="group relative p-6 bg-[#111] rounded-[2rem] border border-white/5 hover:border-white/10 transition-all cursor-pointer overflow-hidden opacity-60 hover:opacity-100">
                                        <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>

                                        <div className="relative z-10 flex flex-col gap-4">
                                            <div className="flex items-center justify-between">
                                                <div className={`w-14 h-14 ${bg} rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 duration-500`}>
                                                    <Icon className={`w-7 h-7 ${color}`} />
                                                </div>
                                                <div className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[9px] font-black text-slate-400 uppercase tracking-widest">
                                                    Soon
                                                </div>
                                            </div>

                                            <div>
                                                <h4 className="text-lg font-black text-white mb-1">{label}</h4>
                                                <p className="text-xs font-medium text-slate-500 leading-relaxed">{desc}</p>
                                            </div>

                                            <div className="mt-2 flex items-center gap-2 text-slate-600 text-[10px] font-black uppercase tracking-widest">
                                                Coming Soon
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
