'use client';

import { useEffect, useState } from 'react';
import { Trophy, Medal, Crown } from 'lucide-react';
import { motion } from 'framer-motion';

export default function LeaderboardPage() {
    const [leaderboard, setLeaderboard] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<string | null>(null);

    useEffect(() => {
        let url = '/api/leaderboard';
        if (filter) url += `?game=${filter}`;

        setLoading(true);
        fetch(url)
            .then(res => res.json())
            .then(data => {
                setLeaderboard(data.leaderboard || []);
                setLoading(false);
            });
    }, [filter]);

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold mb-1">Global Leaderboard</h1>
                    <p className="text-text-secondary">See how you rank against other players.</p>
                </div>

                <div className="flex bg-surface border border-white/5 rounded-xl p-1">
                    <button
                        onClick={() => setFilter(null)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === null ? 'bg-white/10 text-white' : 'text-text-secondary hover:text-white'}`}
                    >
                        All Games
                    </button>
                    <button
                        onClick={() => setFilter('finance-hero-az')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === 'finance-hero-az' ? 'bg-white/10 text-white' : 'text-text-secondary hover:text-white'}`}
                    >
                        A-Z Game
                    </button>
                    <button
                        onClick={() => setFilter('trade')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === 'trade' ? 'bg-white/10 text-white' : 'text-text-secondary hover:text-white'}`}
                    >
                        Paper Trade
                    </button>
                </div>
            </div>

            <div className="bg-surface border border-white/5 rounded-3xl overflow-hidden relative">
                <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
                    <Trophy className="w-64 h-64 text-white" />
                </div>

                {loading ? (
                    <div className="flex h-64 items-center justify-center"><div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin" /></div>
                ) : leaderboard.length === 0 ? (
                    <div className="p-12 text-center text-text-secondary">
                        No entries on the leaderboard yet. Be the first!
                    </div>
                ) : (
                    <div className="divide-y divide-white/5">
                        {/* Header */}
                        <div className="grid grid-cols-[80px_1fr_120px_120px] gap-4 p-4 text-xs font-bold text-text-secondary uppercase tracking-wider hidden sm:grid">
                            <div className="text-center">Rank</div>
                            <div>Player</div>
                            <div className="text-right">Score</div>
                            <div className="text-right">Game</div>
                        </div>

                        {leaderboard.map((entry, index) => (
                            <motion.div
                                key={entry.id}
                                className={`grid grid-cols-1 sm:grid-cols-[80px_1fr_120px_120px] gap-4 p-4 sm:p-6 items-center hover:bg-white/[0.02] transition-colors relative ${index < 3 ? 'bg-white/[0.02]' : ''}`}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                            >
                                {/* Mobile rank overlay */}
                                <div className="absolute top-4 right-4 sm:hidden text-2xl font-black opacity-10">#{index + 1}</div>

                                <div className="flex justify-center mt-2 sm:mt-0">
                                    {index === 0 ? <Crown className="w-8 h-8 text-yellow-400" /> :
                                        index === 1 ? <Medal className="w-8 h-8 text-slate-300" /> :
                                            index === 2 ? <Medal className="w-8 h-8 text-amber-700" /> :
                                                <span className="text-xl font-bold text-text-secondary">#{index + 1}</span>}
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-black/30 overflow-hidden border border-white/10">
                                        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${entry.username}`} alt="Avatar" className="w-full h-full" />
                                    </div>
                                    <div>
                                        <div className="font-bold text-lg">{entry.username}</div>
                                        <div className="text-xs text-text-secondary sm:hidden">Score: {entry.score} • {entry.game}</div>
                                    </div>
                                </div>

                                <div className="hidden sm:block text-right font-black text-xl text-accent">
                                    {entry.score.toLocaleString()}
                                </div>

                                <div className="hidden sm:block text-right text-sm text-text-secondary">
                                    {entry.game === 'finance-hero-az' ? 'A-Z Game' : entry.game === 'trade' ? 'Paper Trade' : entry.game}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
