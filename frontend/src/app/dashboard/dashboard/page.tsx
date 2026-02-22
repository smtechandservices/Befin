'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, ArrowDownRight, Hash, ShieldBan, Wallet } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function DashboardHome() {
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

    if (loading) return <div className="flex h-64 items-center justify-center"><div className="w-8 h-8 border-4 border-[#0A66C2] border-t-transparent rounded-full animate-spin" /></div>;
    if (!data || data.error) return <div>Error loading dashboard data</div>;

    const { user, wallet } = data;

    const realTransactions = wallet.transactions ? [...wallet.transactions].reverse() : [];
    const totalIncome = realTransactions.filter((tx: any) => tx.transaction_type === 'reward' || tx.transaction_type === 'deposit').reduce((acc: number, tx: any) => acc + parseFloat(tx.amount), 0);
    const totalExpenses = realTransactions.filter((tx: any) => tx.transaction_type === 'purchase' || tx.transaction_type === 'withdrawal').reduce((acc: number, tx: any) => acc + parseFloat(tx.amount), 0);

    return (
        <div className="max-w-[1600px] mx-auto space-y-6 text-white pb-10">
            <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">

                {/* Left Column */}
                <div className="xl:col-span-4 space-y-6">
                    {/* Events Widget */}
                    <div className="bg-[#1C1F26] rounded-[24px] p-6 h-48 flex flex-col justify-between relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-accent/10 blur-2xl rounded-full translate-x-1/2 -translate-y-1/2"></div>
                        <div className="relative z-10">
                            <span className="px-3 py-1 bg-accent/20 text-accent text-xs font-bold rounded-full mb-3 inline-block">Events</span>
                            <h2 className="text-xl font-bold">Upcoming Tournament</h2>
                            <p className="text-sm text-[#888888] mt-1">Join the paper trade competition this Friday.</p>
                        </div>
                        <button className="relative z-10 w-full py-2 bg-white/5 hover:bg-white/10 text-white rounded-xl text-sm font-medium transition-colors border border-white/10 group-hover:border-accent/40">
                            Register Now
                        </button>
                    </div>

                    {/* Overview */}
                    <div className="bg-[#1C1F26] rounded-[24px] p-6">
                        <h2 className="text-xl font-bold mb-4">Overview</h2>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-[#12141A] p-4 rounded-2xl">
                                <div className="text-[#888888] text-sm mb-1 flex items-center gap-2">Income <span className="text-green-500 text-xs">📈</span></div>
                                <div className="text-xl font-bold">₹{totalIncome.toFixed(2)}</div>
                            </div>
                            <div className="bg-[#12141A] p-4 rounded-2xl">
                                <div className="text-[#888888] text-sm mb-1 flex items-center gap-2">Expenses <span className="text-red-500 text-xs">📉</span></div>
                                <div className="text-xl font-bold">₹{totalExpenses.toFixed(2)}</div>
                            </div>
                        </div>
                    </div>

                    {/* Money Transfers */}
                    <div className="bg-[#1C1F26] rounded-[24px] p-6">
                        <h2 className="text-xl font-bold mb-4">Money Transfers</h2>
                        <div className="grid grid-cols-3 gap-4">
                            <div className="bg-[#12141A] p-4 rounded-2xl flex flex-col items-center justify-center gap-3 cursor-pointer hover:bg-[#20242D] transition-colors">
                                <div className="p-3 bg-[#1C1F26] rounded-full"><Hash className="w-6 h-6 text-cyan-400" /></div>
                                <div className="text-center text-xs text-[#888888]">To<br /><span className="text-white font-medium">Mobile Number</span></div>
                            </div>
                            <div className="bg-[#12141A] p-4 rounded-2xl flex flex-col items-center justify-center gap-3 cursor-pointer hover:bg-[#20242D] transition-colors">
                                <div className="p-3 bg-[#1C1F26] rounded-full"><ShieldBan className="w-6 h-6 text-red-400" /></div>
                                <div className="text-center text-xs text-[#888888]">To<br /><span className="text-white font-medium">Bank or UPI</span></div>
                            </div>
                            <div className="bg-[#12141A] p-4 rounded-2xl flex flex-col items-center justify-center gap-3 cursor-pointer hover:bg-[#20242D] transition-colors">
                                <div className="p-3 bg-[#1C1F26] rounded-full"><Wallet className="w-6 h-6 text-orange-400" /></div>
                                <div className="text-center text-xs text-[#888888]">To<br /><span className="text-white font-medium">Self Account</span></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Middle Column */}
                <div className="xl:col-span-5 space-y-6">
                    {/* Offers, Rewards, Cashbacks */}
                    <div className="grid grid-cols-1 gap-4">
                        <div className="bg-[#1C1F26] rounded-[20px] p-4 flex justify-between items-center cursor-pointer hover:bg-[#232730] transition-colors">
                            <span className="text-lg font-semibold">Offers</span>
                            <span className="w-8 h-8 rounded-full bg-yellow-400 flex items-center justify-center text-black font-bold text-sm">4</span>
                        </div>
                        <div className="bg-[#1C1F26] rounded-[20px] p-4 flex justify-between items-center cursor-pointer hover:bg-[#232730] transition-colors">
                            <span className="text-lg font-semibold">Rewards</span>
                            <span className="w-8 h-8 rounded-full bg-cyan-400 flex items-center justify-center text-black font-bold text-sm">10</span>
                        </div>
                        <div className="bg-[#1C1F26] rounded-[20px] p-4 flex justify-between items-center cursor-pointer hover:bg-[#232730] transition-colors">
                            <span className="text-lg font-semibold">Cashbacks</span>
                            <span className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold text-sm">8</span>
                        </div>
                    </div>

                    {/* Refer & Earn Banner */}
                    <div className="bg-[#1C1F26] rounded-[24px] p-6 relative overflow-hidden flex items-center h-48">
                        <div className="z-10 w-1/2">
                            <h3 className="text-xl font-black mb-1">REFER<span className="text-orange-400 pr-1">&</span>EARN</h3>
                            <p className="text-xs text-gray-300 mb-4">Guaranteed cashback upto<br />₹1000 on every referral.</p>
                            <button className="bg-blue-500 hover:bg-blue-600 text-white text-xs font-bold px-4 py-2 rounded-full transition-colors flex items-center gap-2">
                                Let's go -&gt;
                            </button>
                        </div>
                        <div className="absolute right-[-20px] top-[-20px] w-[200px] h-[200px] bg-orange-500/20 blur-3xl rounded-full" />
                        {/* Placeholder for 3D gold coins illustration */}
                        <div className="absolute right-0 top-0 bottom-0 w-1/2 flex items-center justify-center">
                            <div className="w-32 h-32 rounded-full border-4 border-dashed border-orange-500/30 flex items-center justify-center bg-orange-500/10 backdrop-blur-sm text-xs text-center text-orange-200">
                                3D<br />Coins<br />Asset
                            </div>
                        </div>
                    </div>



                </div>

                {/* Right Column (Transactions) */}
                <div className="xl:col-span-3 space-y-6">
                    <div className="bg-[#1C1F26] rounded-[24px] p-6 h-full border border-transparent hover:border-white/5 transition-colors">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold">Recent Transactions</h2>
                        </div>
                        <div className="space-y-6">
                            {realTransactions.length > 0 ? realTransactions.map((tx: any) => {
                                const isCredit = tx.transaction_type === 'reward' || tx.transaction_type === 'deposit';
                                return (
                                    <div key={tx.id} className="flex items-center gap-4 group">
                                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${isCredit ? 'bg-[#0A2635] text-cyan-400' : 'bg-[#1C2635] text-blue-400'}`}>
                                            {isCredit ? <ArrowDownRight className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="font-medium text-sm truncate">{tx.description || (isCredit ? 'Received BeCoins' : 'Spent BeCoins')}</div>
                                            <div className="text-xs text-[#888888] truncate">{new Date(tx.timestamp).toLocaleString()}</div>
                                        </div>
                                        <div className="font-bold shrink-0 text-white">
                                            {isCredit ? '+' : '-'}₹{parseFloat(tx.amount).toFixed(2)}
                                        </div>
                                    </div>
                                );
                            }) : (
                                <div className="text-sm text-[#888888]">No recent transactions.</div>
                            )}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
