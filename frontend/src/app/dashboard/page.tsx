'use client';

import React, { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { authService } from '@/lib/auth.client';
import { walletService } from '@/lib/wallet';
import Navbar from '../../components/Navbar';
import { motion, AnimatePresence } from 'framer-motion';
import { toast, Toaster } from 'react-hot-toast';
import {
    Target, BookOpen, History, User, LogOut,
    Home, Wallet, Search, Bell, CircleHelp, TrendingUp, TrendingDown,
    Smartphone, Landmark, CreditCard,
    Utensils, Car, Ticket, ShoppingBag, Package,
    Send, Plus, LineChart, Coins,
    ArrowUpRight, ArrowDownLeft, X, Copy, Check, Eye, EyeOff, Lock
} from 'lucide-react';

export default function Dashboard() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [wallet, setWallet] = useState<any>(null);
    const [transactions, setTransactions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // Modal states
    const [showTransferModal, setShowTransferModal] = useState(false);
    const [showCardModal, setShowCardModal] = useState(false);
    const [verifying, setVerifying] = useState(false);
    const [copied, setCopied] = useState(false);

    // Form states
    const [transferData, setTransferData] = useState({ username: '', amount: '', password: '' });
    const [cardPassword, setCardPassword] = useState('');
    const [cardDetails, setCardDetails] = useState<any>(null);
    const [showCardData, setShowCardData] = useState(false);

    const fetchData = async () => {
        try {
            const [profileData, walletData, txData] = await Promise.all([
                authService.getProfile(),
                walletService.getBalance(),
                walletService.getTransactions()
            ]);

            setUser(profileData);
            setWallet(walletData);
            setTransactions(txData || []);
        } catch (error) {
            console.error('Failed to fetch dashboard data:', error);
            router.push('/login');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [router]);

    const handleTransfer = async (e: React.FormEvent) => {
        e.preventDefault();
        setVerifying(true);
        try {
            await walletService.transferCoins(
                transferData.username,
                parseFloat(transferData.amount),
                transferData.password
            );
            toast.success('Transfer successful!');
            setShowTransferModal(false);
            setTransferData({ username: '', amount: '', password: '' });
            fetchData(); // Refresh balance and transactions
        } catch (error: any) {
            toast.error(error.response?.data?.error || 'Transfer failed');
        } finally {
            setVerifying(false);
        }
    };

    const handleViewCard = async (e: React.FormEvent) => {
        e.preventDefault();
        setVerifying(true);
        try {
            const details = await walletService.getCardDetails(cardPassword);
            setCardDetails(details);
            setShowCardData(true);
            toast.success('Card details verified');
        } catch (error: any) {
            toast.error(error.response?.data?.error || 'Incorrect password');
        } finally {
            setVerifying(false);
        }
    };

    const copyReferral = () => {
        const referralCode = user?.referral_code;
        if (!referralCode) {
            toast.error('Referral code not available');
            return;
        }
        const link = `${window.location.origin}/signup?ref=${referralCode}`;
        navigator.clipboard.writeText(link);
        setCopied(true);
        toast.success('Referral link copied!');
        setTimeout(() => setCopied(false), 2000);
    };

    const stats = useMemo(() => {
        const income = transactions
            .filter(tx => tx.transaction_type === 'deposit' || tx.transaction_type === 'reward')
            .reduce((acc, tx) => acc + parseFloat(tx.amount), 0);

        const expenses = transactions
            .filter(tx => tx.transaction_type === 'withdrawal' || tx.transaction_type === 'purchase')
            .reduce((acc, tx) => acc + parseFloat(tx.amount), 0);

        return { income, expenses };
    }, [transactions]);

    const expensesBreakdown = useMemo(() => {
        const initial = {
            'Housing': 0,
            'Food': 0,
            'Transportation': 0,
            'Entertainment': 0,
            'Shopping': 0,
            'Others': 0
        };

        const totals = transactions
            .filter(tx => tx.transaction_type === 'withdrawal' || tx.transaction_type === 'purchase')
            .reduce((acc, tx) => {
                const desc = (tx.description || '').toLowerCase();
                if (desc.includes('rent') || desc.includes('housing')) acc['Housing'] += parseFloat(tx.amount);
                else if (desc.includes('food') || desc.includes('restaurant') || desc.includes('swiggy')) acc['Food'] += parseFloat(tx.amount);
                else if (desc.includes('uber') || desc.includes('ola') || desc.includes('petrol')) acc['Transportation'] += parseFloat(tx.amount);
                else if (desc.includes('movie') || desc.includes('netflix') || desc.includes('game')) acc['Entertainment'] += parseFloat(tx.amount);
                else if (desc.includes('amazon') || desc.includes('flipkart') || desc.includes('shopping')) acc['Shopping'] += parseFloat(tx.amount);
                else acc['Others'] += parseFloat(tx.amount);
                return acc;
            }, initial);

        const totalExpenses = (Object.values(totals) as number[]).reduce((a, b) => a + b, 0) || 1;

        return [
            { icon: Home, label: 'Housing', amount: totals['Housing'], color: 'text-blue-400' },
            { icon: Utensils, label: 'Food', amount: totals['Food'], color: 'text-orange-400' },
            { icon: Car, label: 'Transportation', amount: totals['Transportation'], color: 'text-green-400' },
            { icon: Ticket, label: 'Entertainment', amount: totals['Entertainment'], color: 'text-purple-400' },
            { icon: ShoppingBag, label: 'Shopping', amount: totals['Shopping'], color: 'text-pink-400' },
            { icon: Package, label: 'Others', amount: totals['Others'], color: 'text-slate-400' }
        ].map(item => ({
            ...item,
            pct: ((item.amount / totalExpenses) * 100).toFixed(0) + '%'
        }));
    }, [transactions]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#111115] text-white">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0380f5]"></div>
            </div>
        );
    }

    const quote = "The best investment you can make is in yourself.";

    return (
        <div className="flex h-screen bg-[#111115] font-sans text-white overflow-hidden">
            <Toaster position="top-right" reverseOrder={false} />

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col h-full overflow-hidden">
                <Navbar title="Dashboard" />

                <div className="flex-1 overflow-y-auto px-10 pb-10 no-scrollbar">
                    <div className="flex flex-col lg:flex-row gap-8 min-h-full">

                        {/* 70% Left Content Grid */}
                        <div className="flex-[2.5] flex flex-col gap-6">

                            {/* Top Row: User Summary */}
                            <div className="flex flex-col md:flex-row gap-6">
                                <div className="flex-1 bg-gradient-to-br from-[#1e1e26] to-[#18181c] rounded-3xl p-8 border border-white/5 flex items-center gap-5 relative overflow-hidden group">
                                    <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                    <div className="w-14 h-14 rounded-full bg-[#FF7043] flex items-center justify-center text-white text-xl font-bold shadow-lg shadow-orange-500/20 z-10 shrink-0">
                                        {user?.username?.charAt(0).toUpperCase() || 'U'}
                                    </div>
                                    <div className="z-10">
                                        <div className="flex items-center gap-2">
                                            <h2 className="font-semibold text-lg text-white">Hey, {user?.first_name || user?.username}!</h2>
                                            <span className="text-slate-500 text-sm font-medium">Active now</span>
                                        </div>
                                        <p className="text-slate-400 font-medium text-[15px] mt-0.5">"{quote}"</p>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-3 min-w-[200px]">
                                    <div className="bg-[#18181c] rounded-2xl flex items-center justify-between p-4 px-6 border border-white/5 hover:border-white/10 transition-colors cursor-pointer group" onClick={() => toast.success('Check your inbox for latest offers!')}>
                                        <span className="font-semibold text-slate-300 group-hover:text-white">Offers</span>
                                        <span className="w-6 h-6 rounded-full bg-orange-500/20 text-orange-400 flex items-center justify-center text-xs font-bold border border-orange-500/30">4</span>
                                    </div>
                                    <div className="bg-[#18181c] rounded-2xl flex items-center justify-between p-4 px-6 border border-white/5 hover:border-white/10 transition-colors cursor-pointer group" onClick={() => toast('Keep earning BeCoins to unlock rewards!')}>
                                        <span className="font-semibold text-slate-300 group-hover:text-white">Rewards</span>
                                        <span className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-xs font-bold border border-blue-500/30">12</span>
                                    </div>
                                </div>
                            </div>

                            {/* Middle Row: Overview & Refer */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="bg-[#18181c] rounded-3xl p-6 border border-white/5 relative overflow-hidden">
                                    <div className="absolute top-0 right-0 p-6 opacity-10">
                                        <LineChart size={80} />
                                    </div>
                                    <h3 className="text-xl font-bold text-white mb-6">Finance Overview</h3>
                                    <div className="flex flex-col gap-4">
                                        <div className="bg-[#111115] rounded-2xl p-4 border border-white/5 flex flex-col gap-1">
                                            <div className="flex items-center gap-2 text-slate-500 text-xs font-bold uppercase tracking-wider">
                                                <span>Total Balance</span>
                                                <TrendingUp className="text-green-500 w-3 h-3" />
                                            </div>
                                            <div className="text-3xl font-black text-white tracking-tight flex items-center gap-2">
                                                <Coins className="text-yellow-500" size={24} />
                                                {parseFloat(wallet?.balance || 0).toLocaleString('en-IN')}
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="bg-[#111115] rounded-2xl p-4 border border-white/5">
                                                <p className="text-slate-500 text-[10px] font-bold uppercase mb-1">Income</p>
                                                <p className="text-lg font-bold text-green-400">₹{stats.income.toLocaleString()}</p>
                                            </div>
                                            <div className="bg-[#111115] rounded-2xl p-4 border border-white/5">
                                                <p className="text-slate-500 text-[10px] font-bold uppercase mb-1">Expenses</p>
                                                <p className="text-lg font-bold text-red-400">₹{stats.expenses.toLocaleString()}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-gradient-to-br from-[#0380f5]/20 to-[#0380f5]/5 rounded-3xl p-7 border border-[#0380f5]/20 relative overflow-hidden flex flex-col justify-between">
                                    <div className="absolute right-[-20px] bottom-[-20px] opacity-10 text-white rotate-12">
                                        <Send size={160} strokeWidth={1} />
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-black text-white uppercase tracking-wider leading-tight">
                                            Refer &<br />Earn Coins
                                        </h3>
                                        <p className="text-slate-400 text-sm mt-3 max-w-[200px] font-medium leading-relaxed">
                                            Invite friends and earn 100 BeCoins for every successful signup!
                                        </p>
                                    </div>

                                    <div className="mt-6 flex items-center gap-2 bg-[#111115]/50 p-2 pl-4 rounded-2xl border border-white/5 backdrop-blur-sm">
                                        <code className="text-[#0380f5] font-bold text-sm tracking-widest">{user?.referral_code || 'LOADING...'}</code>
                                        <button
                                            onClick={copyReferral}
                                            className="ml-auto bg-[#0380f5] p-2.5 rounded-xl hover:bg-blue-600 transition-all shadow-lg shadow-blue-500/20 active:scale-95"
                                        >
                                            {copied ? <Check size={16} /> : <Copy size={16} />}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Bottom Row: Actions & Breakdown */}
                            <div className="flex flex-col xl:flex-row gap-6">
                                <div className="flex-1 min-w-[320px]">
                                    <h3 className="text-xl font-bold text-white mb-4 px-1">Quick Actions</h3>
                                    <div className="grid grid-cols-2 gap-4 h-[calc(100%-2.5rem)]">
                                        <button
                                            onClick={() => setShowTransferModal(true)}
                                            className="bg-[#18181c] border border-white/5 rounded-3xl p-6 flex flex-col items-center justify-center gap-4 hover:bg-[#1c1c24] transition-all hover:scale-[1.02] active:scale-98 group"
                                        >
                                            <div className="w-14 h-14 rounded-2xl bg-[#0380f5]/10 flex items-center justify-center group-hover:bg-[#0380f5]/20 transition-colors">
                                                <Send className="w-7 h-7 text-[#0380f5]" />
                                            </div>
                                            <div className="text-center">
                                                <p className="font-bold text-white">Send Coins</p>
                                                <p className="text-[10px] text-slate-500 font-bold uppercase mt-1">P2P Transfer</p>
                                            </div>
                                        </button>
                                        <button
                                            onClick={() => setShowCardModal(true)}
                                            className="bg-[#18181c] border border-white/5 rounded-3xl p-6 flex flex-col items-center justify-center gap-4 hover:bg-[#1c1c24] transition-all hover:scale-[1.02] active:scale-98 group"
                                        >
                                            <div className="w-14 h-14 rounded-2xl bg-orange-500/10 flex items-center justify-center group-hover:bg-orange-500/20 transition-colors">
                                                <CreditCard className="w-7 h-7 text-orange-400" />
                                            </div>
                                            <div className="text-center">
                                                <p className="font-bold text-white">BeFin Card</p>
                                                <p className="text-[10px] text-slate-500 font-bold uppercase mt-1">View Details</p>
                                            </div>
                                        </button>
                                    </div>
                                </div>

                                <div className="flex-[1.5]">
                                    <h3 className="text-xl font-bold text-white mb-4 px-1">Expenses Breakdown</h3>
                                    <div className="bg-[#18181c] border border-white/5 rounded-3xl p-5 h-[calc(100%-2.5rem)]">
                                        <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                                            {expensesBreakdown.map((exp, idx) => {
                                                const Icon = exp.icon;
                                                return (
                                                    <div key={idx} className="flex items-center justify-between p-3 rounded-2xl hover:bg-[#111115] transition-colors border border-transparent hover:border-white/5 group">
                                                        <div className="flex items-center gap-3">
                                                            <div className={`w-10 h-10 rounded-xl bg-[#111115] flex items-center justify-center group-hover:bg-[#1c1c24] transition-colors border border-white/5`}>
                                                                <Icon className={`w-4 h-4 ${exp.color}`} />
                                                            </div>
                                                            <div>
                                                                <p className="text-xs text-slate-500 font-bold uppercase tracking-tighter">{exp.label}</p>
                                                                <div className="flex items-baseline gap-2">
                                                                    <span className="text-sm font-black text-white">₹{exp.amount.toLocaleString()}</span>
                                                                    <span className="text-[10px] text-slate-500 font-bold">{exp.pct}</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="text-slate-700 group-hover:text-[#0380f5] transition-colors"><ArrowUpRight size={14} /></div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Recent Transactions */}
                        <div className="flex-[1] flex flex-col">
                            <h3 className="text-xl font-bold text-white mb-4 px-1">Activity</h3>
                            <div className="bg-[#18181c] border border-white/5 rounded-3xl p-2 flex flex-col flex-1 overflow-hidden shadow-2xl">
                                <div className="overflow-y-auto no-scrollbar h-full">
                                    {transactions.length === 0 ? (
                                        <div className="flex flex-col items-center justify-center h-full opacity-30 p-10 text-center">
                                            <History size={48} className="mb-4" />
                                            <p className="font-bold text-sm">No transactions yet</p>
                                            <p className="text-xs mt-1 uppercase tracking-widest font-black">Play games & earn</p>
                                        </div>
                                    ) : (
                                        transactions.slice(0, 10).map((tx: any) => {
                                            const isDeposit = ['deposit', 'reward'].includes(tx.transaction_type.toLowerCase());
                                            return (
                                                <div key={tx.id} className="flex items-center justify-between p-4 rounded-2xl hover:bg-[#111115] transition-colors group cursor-pointer border-b border-white/5 last:border-0">
                                                    <div className="flex items-center gap-4">
                                                        <div className={`w-11 h-11 rounded-2xl border border-white/5 flex items-center justify-center transition-all ${isDeposit ? 'bg-blue-500/5 group-hover:bg-blue-500/10' : 'bg-slate-500/5 group-hover:bg-slate-500/10'}`}>
                                                            {isDeposit ? (
                                                                <ArrowDownLeft className="w-5 h-5 text-blue-400" />
                                                            ) : (
                                                                <ArrowUpRight className="w-5 h-5 text-slate-400" />
                                                            )}
                                                        </div>
                                                        <div className="overflow-hidden">
                                                            <p className="font-bold text-white text-sm truncate w-32">{tx.description || tx.transaction_type}</p>
                                                            <p className="text-[10px] text-slate-500 font-bold uppercase mt-0.5 tracking-tighter">
                                                                {new Date(tx.timestamp).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })} • {new Date(tx.timestamp).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className={`font-black text-sm ${isDeposit ? 'text-[#0380f5]' : 'text-slate-300'}`}>
                                                        {isDeposit ? '+' : '-'}₹{parseFloat(tx.amount).toLocaleString('en-IN')}
                                                    </div>
                                                </div>
                                            );
                                        })
                                    )}
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </main>

            {/* Transfer Modal */}
            <AnimatePresence>
                {showTransferModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-[#000]/80 backdrop-blur-sm"
                            onClick={() => setShowTransferModal(false)}
                        />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="bg-[#18181c] w-full max-w-md rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden"
                        >
                            <div className="p-8">
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-2xl font-black uppercase tracking-widest text-white">Transfer</h2>
                                    <button onClick={() => setShowTransferModal(false)} className="bg-white/5 p-2 rounded-full hover:bg-white/10"><X size={20} /></button>
                                </div>
                                <form onSubmit={handleTransfer} className="space-y-4">
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black uppercase text-slate-500 ml-1">Recipient Username</label>
                                        <div className="relative">
                                            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
                                            <input
                                                required
                                                type="text"
                                                placeholder="Enter username"
                                                className="w-full bg-[#111115] border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-[#0380f5] transition-colors font-bold"
                                                value={transferData.username}
                                                onChange={e => setTransferData({ ...transferData, username: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black uppercase text-slate-500 ml-1">Amount (BeCoins)</label>
                                        <div className="relative">
                                            <Coins className="absolute left-4 top-1/2 -translate-y-1/2 text-yellow-500/50" size={18} />
                                            <input
                                                required
                                                type="number"
                                                placeholder="0.00"
                                                className="w-full bg-[#111115] border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-[#0380f5] transition-colors font-bold text-xl"
                                                value={transferData.amount}
                                                onChange={e => setTransferData({ ...transferData, amount: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black uppercase text-slate-500 ml-1">Your Login Password</label>
                                        <div className="relative">
                                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
                                            <input
                                                required
                                                type="password"
                                                placeholder="••••••••"
                                                className="w-full bg-[#111115] border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-[#0380f5] transition-colors font-bold"
                                                value={transferData.password}
                                                onChange={e => setTransferData({ ...transferData, password: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    <button
                                        disabled={verifying}
                                        className="w-full bg-[#0380f5] py-5 rounded-2xl font-black uppercase tracking-widest text-white mt-4 hover:bg-blue-600 transition-all shadow-xl shadow-blue-500/20 disabled:opacity-50 active:scale-95"
                                    >
                                        {verifying ? 'Processing...' : 'Secure Transfer'}
                                    </button>
                                </form>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* BeFin Card Modal */}
            <AnimatePresence>
                {showCardModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-[#000]/80 backdrop-blur-sm"
                            onClick={() => {
                                setShowCardModal(false);
                                setShowCardData(false);
                                setCardDetails(null);
                                setCardPassword('');
                            }}
                        />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="bg-[#18181c] w-full max-w-lg rounded-[2.5rem] border border-white/10 shadow-2xl relative overflow-hidden"
                        >
                            {!showCardData ? (
                                <div className="p-10">
                                    <div className="flex flex-col items-center text-center">
                                        <div className="w-20 h-20 bg-orange-500/10 rounded-full flex items-center justify-center mb-6">
                                            <Lock className="w-10 h-10 text-orange-400" />
                                        </div>
                                        <h2 className="text-2xl font-black uppercase tracking-widest text-white mb-2">Access Secure Data</h2>
                                        <p className="text-slate-500 text-sm mb-8 font-medium">Please enter your login password to view sensitive card information.</p>

                                        <form onSubmit={handleViewCard} className="w-full space-y-4">
                                            <input
                                                required
                                                type="password"
                                                placeholder="Enter login password"
                                                className="w-full bg-[#111115] border border-white/5 rounded-2xl py-4 px-6 text-white focus:outline-none focus:border-orange-500/50 transition-colors font-bold text-center"
                                                value={cardPassword}
                                                onChange={e => setCardPassword(e.target.value)}
                                            />
                                            <button
                                                disabled={verifying}
                                                className="w-full bg-orange-500 py-5 rounded-2xl font-black uppercase tracking-widest text-white hover:bg-orange-600 transition-all shadow-xl shadow-orange-500/20 disabled:opacity-50 active:scale-95"
                                            >
                                                {verifying ? 'Verifying...' : 'Unlock Card Details'}
                                            </button>
                                        </form>
                                    </div>
                                </div>
                            ) : (
                                <div className="p-8">
                                    <div className="flex justify-between items-center mb-8">
                                        <h2 className="text-xl font-black uppercase tracking-widest text-white flex items-center gap-3">
                                            <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
                                            Virtual Card
                                        </h2>
                                        <button onClick={() => setShowCardModal(false)} className="bg-white/5 p-2 rounded-full hover:bg-white/10"><X size={20} /></button>
                                    </div>

                                    {/* The Card UI */}
                                    <div className="relative w-full aspect-[1.586/1] rounded-3xl p-8 bg-gradient-to-br from-[#1c1c1c] via-[#2a2a2a] to-[#1c1c1c] overflow-hidden shadow-2xl border border-white/10 group mb-8">
                                        <div className="absolute top-0 right-0 w-64 h-64 bg-[#0380f5] opacity-10 blur-[100px] -mr-32 -mt-32" />
                                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-yellow-500 opacity-5 blur-[100px] -ml-32 -mb-32" />

                                        <div className="relative z-10 h-full flex flex-col justify-between">
                                            <div className="flex justify-between items-start">
                                                <div className="flex flex-col">
                                                    <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Digital Platinum</span>
                                                    <span className="text-lg font-black text-white italic tracking-tighter">BeFin <span className="text-[#0380f5]">Wallet</span></span>
                                                </div>
                                                <div className="w-12 h-10 bg-white/5 rounded-lg border border-white/10 flex items-center justify-center">
                                                    <div className="w-8 h-6 bg-gradient-to-r from-yellow-500 to-orange-500 rounded opacity-80" />
                                                </div>
                                            </div>

                                            <div className="space-y-1">
                                                <p className="text-[10px] font-black uppercase text-slate-500 tracking-[0.2em]">Card Number</p>
                                                <p className="text-2xl font-bold text-white tracking-[0.15em] font-mono">
                                                    {cardDetails?.card_number?.replace(/(\d{4})/g, '$1 ').trim()}
                                                </p>
                                            </div>

                                            <div className="flex justify-between items-end">
                                                <div className="space-y-0.5">
                                                    <p className="text-[9px] font-black uppercase text-slate-500">Card Holder</p>
                                                    <p className="text-sm font-bold text-white uppercase tracking-wider">{user?.first_name} {user?.last_name}</p>
                                                </div>
                                                <div className="flex gap-8">
                                                    <div className="space-y-0.5">
                                                        <p className="text-[9px] font-black uppercase text-slate-500">Expiry</p>
                                                        <p className="text-sm font-bold text-white font-mono">{cardDetails?.expiry_date}</p>
                                                    </div>
                                                    <div className="space-y-0.5">
                                                        <p className="text-[9px] font-black uppercase text-slate-500">CVV</p>
                                                        <p className="text-sm font-bold text-white font-mono">{cardDetails?.cvv}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Glossy overlay */}
                                        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none" />
                                    </div>

                                    <div className="bg-[#111115] p-5 rounded-2xl border border-white/5">
                                        <div className="flex items-start gap-4">
                                            <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center shrink-0">
                                                <CircleHelp className="w-5 h-5 text-blue-400" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-white mb-1">Secure Virtual Card</p>
                                                <p className="text-xs text-slate-500 leading-relaxed font-medium">This card is only for internal BeFin payments. Do not share your CVV or Pin with anyone.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
