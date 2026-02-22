'use client';

import { useEffect, useState } from 'react';
import { User, Mail, Shield, Award, Calendar } from 'lucide-react';

export default function ProfilePage() {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/user/profile')
            .then(res => res.json())
            .then(d => {
                setData(d);
                setLoading(false);
            });
    }, []);

    if (loading) return <div className="flex h-64 items-center justify-center"><div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin" /></div>;
    if (!data || data.error) return <div>Error loading profile</div>;

    const { user, wallet, completedQuests } = data;

    return (
        <div className="max-w-3xl mx-auto space-y-8">
            <div>
                <h1 className="text-3xl font-extrabold mb-1">Your Profile</h1>
                <p className="text-text-secondary">Manage your BeFin account settings.</p>
            </div>

            <div className="bg-surface border border-white/5 rounded-3xl p-8 relative overflow-hidden">
                {/* Abstract background shape */}
                <div className="absolute -top-24 -right-24 w-64 h-64 bg-accent/10 rounded-full blur-[80px] pointer-events-none" />

                <div className="flex flex-col md:flex-row items-center md:items-start gap-8 relative z-10">
                    <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-surface shadow-2xl bg-black/50 shrink-0">
                        <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" />
                    </div>

                    <div className="flex-1 text-center md:text-left">
                        <h2 className="text-3xl font-bold mb-2">{user.username}</h2>
                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-text-secondary mb-6 mt-3">
                            <span className="flex items-center gap-1"><Mail className="w-4 h-4" /> {user.email}</span>
                            <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> Joined {new Date(user.createdAt).toLocaleDateString()}</span>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-8 border-t border-white/10">
                            <div className="text-center md:text-left">
                                <div className="text-2xl font-black text-white">{wallet.level}</div>
                                <div className="text-xs font-medium text-text-secondary uppercase tracking-wider mt-1">Level</div>
                            </div>
                            <div className="text-center md:text-left">
                                <div className="text-2xl font-black text-gold">{wallet.balance}</div>
                                <div className="text-xs font-medium text-text-secondary uppercase tracking-wider mt-1">BeCoins</div>
                            </div>
                            <div className="text-center md:text-left">
                                <div className="text-2xl font-black text-[#FF5A5F]">{wallet.streak}</div>
                                <div className="text-xs font-medium text-text-secondary uppercase tracking-wider mt-1">Day Streak</div>
                            </div>
                            <div className="text-center md:text-left">
                                <div className="text-2xl font-black text-accent">{completedQuests?.length || 0}</div>
                                <div className="text-xs font-medium text-text-secondary uppercase tracking-wider mt-1">Quests</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                <h3 className="text-xl font-bold">Account Settings</h3>

                <div className="bg-surface border border-white/5 rounded-3xl divide-y divide-white/5">
                    <div className="p-6 flex items-center justify-between">
                        <div>
                            <div className="font-bold flex items-center gap-2"><User className="w-4 h-4 text-text-secondary" /> Change Username</div>
                            <div className="text-sm text-text-secondary mt-1">Currently: {user.username}</div>
                        </div>
                        <button className="px-4 py-2 border border-white/10 hover:bg-white/5 rounded-xl font-medium transition-colors text-sm">Update</button>
                    </div>

                    <div className="p-6 flex items-center justify-between">
                        <div>
                            <div className="font-bold flex items-center gap-2"><Shield className="w-4 h-4 text-text-secondary" /> Update Password</div>
                            <div className="text-sm text-text-secondary mt-1">Last changed: Never</div>
                        </div>
                        <button className="px-4 py-2 border border-white/10 hover:bg-white/5 rounded-xl font-medium transition-colors text-sm">Update</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
