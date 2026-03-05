'use client';

import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import { Gamepad2, Sparkles, TrendingUp, Coins, BarChart2, PieChart, Play, MousePointer2 } from 'lucide-react';
import LoadingScreen from '@/components/LoadingScreen';
import GamePlayModal from '@/components/GamePlayModal';
import { gamesService, authService, walletService } from '@/lib/api';

export default function LearningPage() {
    const [loading, setLoading] = useState(true);
    const [games, setGames] = useState<any[]>([]);
    const [user, setUser] = useState<any>(null);
    const [walletBalance, setWalletBalance] = useState<number>(0);
    const [selectedGame, setSelectedGame] = useState<any>(null);
    const [isGameModalOpen, setIsGameModalOpen] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [gamesData, profileData, walletData] = await Promise.all([
                    gamesService.getGames(),
                    authService.getProfile(),
                    walletService.getBalance(),
                    new Promise(resolve => setTimeout(resolve, 500))
                ]);
                setGames(Array.isArray(gamesData) ? gamesData : []);
                setUser(profileData);
                if (walletData && walletData.balance) {
                    setWalletBalance(parseFloat(walletData.balance));
                }
            } catch (error) {
                console.error("Error fetching games/profile:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

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
                    {(() => {
                        let userAge = 18; // Default
                        if (user?.dob) {
                            const birthDate = new Date(user.dob);
                            const today = new Date();
                            userAge = today.getFullYear() - birthDate.getFullYear();
                            const m = today.getMonth() - birthDate.getMonth();
                            if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
                                userAge--;
                            }
                        }

                        const suggestedGames = games.filter(g => userAge >= (g.age_req || 0));
                        const moreGamesToTry = games.filter(g => userAge < (g.age_req || 0));

                        const liveSuggestedGames = suggestedGames.filter(g => g.is_live !== false);
                        const nonLiveSuggestedGames = suggestedGames.filter(g => g.is_live === false);

                        const topSuggested = liveSuggestedGames.slice(0, 2);
                        const remainingSuggested = [...liveSuggestedGames.slice(2), ...nonLiveSuggestedGames];

                        const renderGameCard = (game: any) => {
                            const isLive = game.is_live !== false;
                            return (
                                <div
                                    key={game.id}
                                    onClick={() => { if (isLive) { setSelectedGame(game); setIsGameModalOpen(true); } }}
                                    className={`group relative bg-[#111] rounded-[2rem] border border-white/5 ${isLive ? 'hover:border-blue-500/20 hover:shadow-xl hover:shadow-blue-500/5 cursor-pointer' : 'opacity-70 cursor-not-allowed'} transition-all overflow-hidden flex flex-col`}
                                >
                                    {!isLive && (
                                        <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px] z-20 flex items-center justify-center">
                                            <div className="px-5 py-2.5 bg-[#18181c] border border-white/10 rounded-xl shadow-2xl transform -rotate-6">
                                                <span className="text-white font-black uppercase tracking-widest text-xs flex items-center gap-2">
                                                    <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                                                    Coming Soon
                                                </span>
                                            </div>
                                        </div>
                                    )}
                                    {/* Top Banner Image */}
                                    <div className="w-full h-36 relative overflow-hidden bg-[#18181c] shrink-0">
                                        {game.game_banner ? (
                                            <div
                                                className={`absolute inset-0 bg-cover bg-center ${isLive ? 'group-hover:scale-105 transition-transform duration-700' : ''}`}
                                                style={{ backgroundImage: `url(${game.game_banner})` }}
                                            />
                                        ) : (
                                            <div className={`absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 ${isLive ? 'group-hover:scale-105 transition-transform duration-700' : ''}`} />
                                        )}
                                        {/* Bottom gradient fade into card body */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-[#111] to-transparent opacity-90"></div>

                                        {/* Tag on top right */}
                                        <div className="absolute top-4 right-4 px-2.5 py-1 rounded-lg bg-black/40 backdrop-blur-md border border-white/10 flex items-center shadow-sm z-10">
                                            <span className="text-[9px] font-black text-white uppercase tracking-widest">{game.genre}</span>
                                        </div>
                                    </div>

                                    <div className="relative p-6 pt-0 flex flex-col gap-3 flex-1">
                                        {/* Logo overlapping the banner */}
                                        <div className={`w-16 h-16 bg-[#111] rounded-2xl flex items-center justify-center overflow-hidden shadow-xl border border-white/10 shrink-0 -mt-8 relative z-10 ${isLive ? 'group-hover:-translate-y-1 transition-transform duration-500' : ''}`}>
                                            <div className="absolute inset-0 bg-white/5"></div>
                                            {game.game_logo ? (
                                                <img src={game.game_logo} alt={game.name} className="w-full h-full object-cover relative z-10" />
                                            ) : (
                                                <Gamepad2 className="w-8 h-8 text-blue-400 relative z-10" />
                                            )}
                                        </div>

                                        <div className="flex flex-col flex-1">
                                            <h4 className={`text-xl font-black text-white leading-tight mb-1 ${isLive ? 'group-hover:text-blue-400 transition-colors' : ''}`}>{game.name}</h4>
                                            <p className="text-[10px] font-black tracking-wider uppercase text-slate-500 mb-3">Age {game.age_req}+</p>
                                            {game.description && <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">{game.description}</p>}
                                        </div>
                                    </div>
                                </div>
                            );
                        };

                        return (
                            <div className="mx-auto flex flex-col gap-10 py-4">
                                {/* Top Suggested Games (Above Banner) */}
                                {topSuggested.length > 0 && (
                                    <div className="flex flex-col gap-6">
                                        <h3 className="text-xl font-black text-white uppercase tracking-tight flex items-center gap-2">
                                            <span className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></span>
                                            Top Picks for You
                                        </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            {topSuggested.map(renderGameCard)}
                                        </div>
                                    </div>
                                )}

                                {/* Hero Banner */}
                                <div className="relative rounded-[2.5rem] overflow-hidden bg-[#111] border border-white/5 p-8 lg:p-12">
                                    <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-transparent to-purple-600/10"></div>
                                    <div className="absolute -right-20 -top-20 w-80 h-80 bg-blue-500/10 rounded-full blur-[100px]"></div>

                                    <div className="relative z-10 flex flex-col lg:flex-row items-center gap-10">
                                        <div className="flex-1 text-center lg:text-left">
                                            <h2 className="text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight mb-4">
                                                Level up your <span className="text-blue-500 text-glow">Finance IQ</span>
                                            </h2>
                                            <p className="text-slate-400 text-base font-medium leading-relaxed mb-6 max-w-md mx-auto lg:mx-0">
                                                Master the stock market, budgeting, and investment strategies through interactive challenges. Gaming meets financial freedom.
                                            </p>
                                            <button className="bg-white text-black px-8 py-3 rounded-full font-black text-xs uppercase tracking-widest opacity-80">
                                                Games Every Finance Lover Will Enjoy
                                            </button>
                                        </div>
                                        <div className="w-48 h-48 lg:w-64 lg:h-64 bg-[#18181c] rounded-[3rem] border border-white/5 flex items-center justify-center relative group">
                                            <div className="absolute inset-4 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[2rem] opacity-20 filter blur-2xl group-hover:opacity-40 transition-opacity"></div>
                                            <Gamepad2 className="w-20 h-20 text-[#0380f5] relative z-10 animate-pulse" />
                                        </div>
                                    </div>
                                </div>

                                {/* Games Section (Below Banner) */}
                                {(remainingSuggested.length > 0 || moreGamesToTry.length > 0 || games.length === 0) && (
                                    <div className="flex flex-col gap-6">
                                        <div className="flex items-center justify-between px-2">
                                            <div className="flex flex-col gap-1">
                                                <h3 className="text-xl font-black text-white uppercase tracking-tight">
                                                    {games.length > 0 ? 'Interactive Games' : 'Available Games'}
                                                </h3>
                                                <p className="text-xs font-bold text-slate-500">
                                                    {games.length > 0 ? 'Interactive financial experiences' : 'Coming soon to the BeFin ecosystem'}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex flex-col gap-10">
                                            {/* Remaining Suggested Games */}
                                            {remainingSuggested.length > 0 && (
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                    {remainingSuggested.map(renderGameCard)}
                                                </div>
                                            )}

                                            {/* More to Try */}
                                            {moreGamesToTry.length > 0 && (
                                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 opacity-80 hover:opacity-100 transition-opacity">
                                                    {moreGamesToTry.map(renderGameCard)}
                                                </div>
                                            )}

                                            {games.length === 0 && (
                                                <div className="p-12 text-center text-slate-500 font-medium italic bg-[#111] rounded-[2rem] border border-white/5">
                                                    No games available right now. Check back later!
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })()}
                </div>
            </main>

            <GamePlayModal
                isOpen={isGameModalOpen}
                onClose={() => setIsGameModalOpen(false)}
                game={selectedGame}
                balance={walletBalance}
            />
        </div>
    );
}
