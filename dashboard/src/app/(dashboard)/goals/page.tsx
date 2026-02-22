'use client';

import { useEffect, useState } from 'react';
import { Target, PlusCircle, CheckCircle2 } from 'lucide-react';

export default function GoalsPage() {
    const [goals, setGoals] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [title, setTitle] = useState('');
    const [targetAmount, setTargetAmount] = useState('');
    const [walletBalance, setWalletBalance] = useState(0);

    const fetchGoals = async () => {
        try {
            const [goalsRes, walletRes] = await Promise.all([
                fetch('/api/wallet/goals'), // Need to create a Next.js proxy route for this
                fetch('/api/wallet/balance')
            ]);

            if (goalsRes.ok) {
                const data = await goalsRes.json();
                setGoals(data);
            }
            if (walletRes.ok) {
                const data = await walletRes.json();
                setWalletBalance(data.wallet.balance);
            }
            setLoading(false);
        } catch (error) {
            console.error('Failed to fetch goals', error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchGoals();
    }, []);

    const createGoal = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title || !targetAmount) return;

        try {
            const res = await fetch('/api/wallet/goals', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title,
                    target_amount: parseFloat(targetAmount)
                })
            });

            if (res.ok) {
                setTitle('');
                setTargetAmount('');
                fetchGoals();
            }
        } catch (error) {
            console.error('Failed to create goal', error);
        }
    };

    const addFunds = async (goalId: number, amount: number) => {
        if (walletBalance < amount) {
            alert("Not enough BeCoins in wallet!");
            return;
        }

        try {
            // In a real app, you would also deduct from wallet balance transactionally.
            // For now, we just update the goal's current amount.
            const goal = goals.find(g => g.id === goalId);
            if (!goal) return;

            const newAmount = parseFloat(goal.current_amount) + amount;

            const res = await fetch(`/api/wallet/goals`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: goalId,
                    current_amount: newAmount
                })
            });

            if (res.ok) {
                fetchGoals();
            }
        } catch (error) {
            console.error('Failed to add funds', error);
        }
    };

    if (loading) return <div className="flex h-64 items-center justify-center"><div className="w-8 h-8 border-4 border-[#0A66C2] border-t-transparent rounded-full animate-spin" /></div>;

    return (
        <div className="max-w-[1600px] mx-auto space-y-8 text-white pb-10">
            <h1 className="text-3xl font-bold mb-8">Goal Setter</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Left Column - Create Goal Box */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-[#1C1F26] rounded-[24px] p-6 shadow-xl border border-white/5">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-3 bg-blue-500/20 rounded-xl">
                                <Target className="w-6 h-6 text-blue-400" />
                            </div>
                            <h2 className="text-xl font-bold">New Goal</h2>
                        </div>

                        <form onSubmit={createGoal} className="space-y-4">
                            <div>
                                <label className="block text-sm text-gray-400 mb-2 font-medium">Goal Name</label>
                                <input
                                    type="text"
                                    value={title}
                                    onChange={e => setTitle(e.target.value)}
                                    placeholder="e.g., New Bicycle"
                                    className="w-full bg-[#12141A] rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#0A66C2] border border-white/5 transition-all text-white"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-400 mb-2 font-medium">Target Amount (BeCoins)</label>
                                <input
                                    type="number"
                                    value={targetAmount}
                                    onChange={e => setTargetAmount(e.target.value)}
                                    placeholder="5000"
                                    min="100"
                                    className="w-full bg-[#12141A] rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#0A66C2] border border-white/5 transition-all text-white"
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full bg-[#0A66C2] hover:bg-blue-600 text-white font-bold py-3.5 px-4 rounded-xl transition-colors mt-2 flex items-center justify-center gap-2"
                            >
                                <PlusCircle className="w-5 h-5" /> Let's Go!
                            </button>
                        </form>
                    </div>

                    <div className="bg-[#1C1F26] rounded-[24px] p-6 border border-white/5">
                        <h3 className="text-gray-400 text-sm font-medium mb-2">Available BeCoins to Fund</h3>
                        <div className="text-3xl font-black text-cyan-400 flex items-center gap-2">
                            💰 {Number(walletBalance).toFixed(0)}
                        </div>
                    </div>
                </div>

                {/* Right Column - Goal List */}
                <div className="lg:col-span-2 space-y-6">
                    <h2 className="text-2xl font-bold mb-4">My Financial Goals</h2>

                    {goals.length === 0 ? (
                        <div className="bg-[#1C1F26] border border-dashed border-white/10 rounded-[24px] p-12 text-center flex flex-col items-center justify-center h-64">
                            <Target className="w-16 h-16 text-gray-600 mb-4" />
                            <h3 className="text-xl font-bold text-gray-400">No goals set yet!</h3>
                            <p className="text-sm text-gray-500 mt-2">Start a new goal to begin saving your BeCoins.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {goals.map((goal) => {
                                const target = parseFloat(goal.target_amount);
                                const current = parseFloat(goal.current_amount);
                                const percent = Math.min((current / target) * 100, 100);
                                const isComplete = percent >= 100;

                                return (
                                    <div key={goal.id} className="bg-[#1C1F26] rounded-[24px] p-6 border border-white/5 relative overflow-hidden group">
                                        {isComplete && (
                                            <div className="absolute top-4 right-4 text-green-400">
                                                <CheckCircle2 className="w-6 h-6" />
                                            </div>
                                        )}
                                        <h3 className="text-xl font-bold mb-2 pr-8">{goal.title}</h3>
                                        <div className="flex items-end gap-2 mb-6 text-gray-400">
                                            <span className="text-2xl font-black text-white">{current}</span>
                                            <span className="text-sm pb-1">/ {target} BeCoins</span>
                                        </div>

                                        {/* Progress Bar */}
                                        <div className="w-full bg-[#12141A] rounded-full h-3 mb-2 overflow-hidden">
                                            <div
                                                className={`h-3 rounded-full transition-all duration-1000 ${isComplete ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]' : 'bg-gradient-to-r from-blue-400 to-cyan-400 shadow-[0_0_10px_rgba(56,189,248,0.3)]'}`}
                                                style={{ width: `${percent}%` }}
                                            />
                                        </div>
                                        <div className="text-right text-xs font-bold text-[#888888] mb-6">
                                            {percent.toFixed(1)}% Completed
                                        </div>

                                        {!isComplete && (
                                            <button
                                                onClick={() => addFunds(goal.id, 100)}
                                                className="w-full py-2.5 rounded-xl border border-white/10 hover:bg-white/5 transition-colors text-sm font-bold text-center items-center flex justify-center gap-2"
                                            >
                                                Add 100 BeCoins
                                            </button>
                                        )}
                                        {isComplete && (
                                            <div className="w-full py-2.5 rounded-xl bg-green-500/10 text-green-400 text-sm font-bold text-center border border-green-500/20">
                                                Goal Achieved! 🎉
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
