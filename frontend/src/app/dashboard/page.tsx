'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { authService, walletService } from '../../lib/api';
import Sidebar from '../../components/Sidebar';
import FinanceNews from '../../components/FinanceNews';
import {
    Target, BookOpen, History, User, LogOut,
    Home, Wallet, Search, Bell, CircleHelp, TrendingUp, TrendingDown,
    Smartphone, Landmark, CreditCard,
    Utensils, Car, Ticket, ShoppingBag, Package,
    Send, Plus, LineChart, Coins,
    ArrowUpRight, ArrowDownLeft
} from 'lucide-react';

export default function Dashboard() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [wallet, setWallet] = useState<any>(null);
    const [transactions, setTransactions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // Referral States
    const [referralCode, setReferralCode] = useState<string | null>(null);
    const [generatingCode, setGeneratingCode] = useState(false);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [profileData, walletData, txData, referralData] = await Promise.all([
                    authService.getProfile(),
                    walletService.getBalance(),
                    walletService.getTransactions(),
                    authService.getReferralCode()
                ]);

                setUser(profileData);
                setWallet(walletData);
                setTransactions(txData);
                setReferralCode(referralData.code);
            } catch (error) {
                console.error('Failed to fetch dashboard data:', error);
                router.push('/login');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [router]);

    const handleGenerateCode = async () => {
        setGeneratingCode(true);
        try {
            const data = await authService.generateReferralCode();
            setReferralCode(data.code);
        } catch (error) {
            console.error('Failed to generate referral code:', error);
        } finally {
            setGeneratingCode(false);
        }
    };

    const copyToClipboard = () => {
        if (referralCode) {
            navigator.clipboard.writeText(referralCode);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#0a0a0b] text-white">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0380f5]"></div>
            </div>
        );
    }

    const activeLink = "Home"; // For static rendering

    return (
        <div className="flex h-screen bg-[#0a0a0b] font-sans text-white overflow-hidden">
            {/* Left Sidebar */}
            <Sidebar />

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col h-full overflow-hidden">
                {/* Local Header */}
                <header className="px-10 py-8 shrink-0">
                    <h1 className="text-[2.5rem] font-black tracking-tight text-white leading-tight">
                        Dashboard
                    </h1>
                    <p className="text-slate-400 font-semibold text-sm tracking-wide opacity-80 uppercase italic">
                        Welcome back to your financial hub
                    </p>
                </header>

                {/* Scrollable Grid Container */}
                <div className="flex-1 overflow-y-auto px-10 pb-10 no-scrollbar">
                    <div className="flex flex-col lg:flex-row gap-8 mb-6">

                        {/* 70% Left Content Grid */}
                        <div className="flex-[2.5] flex flex-col gap-6">

                            {/* Row: Quote & Pills */}
                            <div className="flex flex-col md:flex-row gap-6">
                                {/* Live Finance News Instead of Static Quote */}
                                <FinanceNews />

                                {/* Interactive Pills */}
                                <div className="flex flex-col gap-3 min-w-[200px]">
                                    <div className="bg-[#18181c] rounded-xl flex items-center justify-between p-4 px-4 border border-white/5 hover:border-white/10 transition-colors">
                                        <span className="font-semibold text-white">Offers</span>
                                        <span className="w-6 h-6 rounded-full bg-[#FFCA28] text-black flex items-center justify-center text-xs font-bold">0</span>
                                    </div>
                                    <div className="bg-[#18181c] rounded-xl flex items-center justify-between p-4 px-4 border border-white/5 hover:border-white/10 transition-colors">
                                        <span className="font-semibold text-white">Rewards</span>
                                        <span className="w-6 h-6 rounded-full bg-[#29B6F6] text-white flex items-center justify-center text-xs font-bold">
                                            {transactions.filter(tx => ['reward', 'REWARD'].includes(tx.transaction_type)).length}
                                        </span>
                                    </div>
                                    <div className="bg-[#18181c] rounded-xl flex items-center justify-between p-4 px-4 border border-white/5 hover:border-white/10 transition-colors">
                                        <span className="font-semibold text-white">Cashbacks</span>
                                        <span className="w-6 h-6 rounded-full bg-[#EF5350] text-white flex items-center justify-center text-xs font-bold">0</span>
                                    </div>
                                </div>
                            </div>

                            {/* Row: Overview & Refer Promo */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Overview Card */}
                                <div className="bg-[#18181c] rounded-3xl p-6 border border-white/5">
                                    <h3 className="text-xl font-bold text-white mb-4 px-1">Overview</h3>
                                    <div className="flex flex-col gap-4">
                                        <div className="pt-2 ps-1 border-t border-white/5 flex flex-col gap-1">
                                            <div className="flex items-center gap-2 text-slate-400 text-sm font-semibold">
                                                <span>Income</span>
                                                <TrendingUp className="text-green-500 w-3 h-3" />
                                            </div>
                                            <div className="text-2xl font-bold text-white tracking-tight">
                                                {(() => {
                                                    const income = transactions
                                                        .filter(tx => ['reward', 'deposit', 'REWARD', 'DEPOSIT'].includes(tx.transaction_type))
                                                        .reduce((sum, tx) => sum + parseFloat(tx.amount), 0);
                                                    return income.toLocaleString();
                                                })()} BeFin Coins
                                            </div>
                                        </div>
                                        <div className="pt-2 ps-1 border-t border-white/5 flex flex-col gap-1">
                                            <div className="flex items-center gap-2 text-slate-400 text-sm font-semibold">
                                                <span>Expenses</span>
                                                <TrendingDown className="text-red-500 w-3 h-3" />
                                            </div>
                                            <div className="text-2xl font-bold text-white tracking-tight">
                                                {(() => {
                                                    const expenses = transactions
                                                        .filter(tx => !['reward', 'deposit', 'REWARD', 'DEPOSIT'].includes(tx.transaction_type))
                                                        .reduce((sum, tx) => sum + parseFloat(tx.amount), 0);
                                                    return expenses.toLocaleString();
                                                })()} BeFin Coins
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Refer & Earn Banner */}
                                <div className="bg-gradient-to-r from-[#18181c] to-[#121216] rounded-3xl p-6 border border-white/5 relative overflow-hidden flex flex-col justify-center">
                                    <div className="absolute right-[-20px] bottom-[-20px] opacity-20 text-[#FFCA28] rotate-12">
                                        <Coins size={140} strokeWidth={1} />
                                    </div>

                                    <div className="relative z-10 flex flex-col gap-2">
                                        <h3 className="text-xl font-black text-white uppercase tracking-wider leading-tight">
                                            Refer & Earn
                                        </h3>
                                        <p className="text-slate-400 text-sm font-medium leading-relaxed">
                                            Get guaranteed 100 BeFin Coins for every friend who joins BeFin using your referral code.
                                        </p>

                                        {!referralCode ? (
                                            <>
                                                <button
                                                    onClick={handleGenerateCode}
                                                    disabled={generatingCode}
                                                    className="mt-2 bg-[#0380f5] text-white text-[10px] font-black px-5 py-2 rounded-full w-fit hover:bg-blue-600 transition-all shadow-lg shadow-blue-500/20 disabled:opacity-50 uppercase tracking-wider"
                                                >
                                                    {generatingCode ? 'Generating...' : 'Generate Code'}
                                                </button>
                                            </>
                                        ) : (
                                            <div className="mt-1 flex flex-col gap-2">
                                                <div className="flex items-center gap-2">
                                                    <div className="bg-[#111115] border border-white/10 rounded-xl px-4 py-2 flex items-center justify-center min-w-[100px]">
                                                        <span className="text-lg font-black text-white tracking-[0.1em]">{referralCode}</span>
                                                    </div>
                                                    <button
                                                        onClick={copyToClipboard}
                                                        className="p-2 bg-white/5 hover:bg-white/10 rounded-xl text-slate-400 hover:text-white transition-colors border border-white/5"
                                                        title="Copy Code"
                                                    >
                                                        {copied ? <span className="font-bold text-blue-400 px-4">Copied!</span> : <span className="font-bold px-4">Copy Code</span>}
                                                    </button>
                                                </div>
                                                <p className="text-[10px] text-slate-500 font-bold italic">
                                                    * Share this code to earn rewards
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 30% Right Sidebar: Recent Transactions */}
                        <div className="flex-[1] flex flex-col">
                            <div className="bg-[#18181c] border border-white/5 rounded-3xl p-6 flex flex-col min-h-full overflow-y-auto no-scrollbar">
                                <h3 className="text-xl font-bold text-white mb-4 px-1">Recent Transactions</h3>
                                {transactions.length === 0 ? (
                                    // Placeholder entries like the image if real DB is empty
                                    <>
                                        {[
                                            { title: 'Mobile Recharge', date: '12 Aug 2022 | 10:00', amount: '-666 BeFin Coins', isNegative: true },
                                            { title: 'Electricity Bill', date: '03 Aug 2022 | 14:00', amount: '-14,000 BeFin Coins', isNegative: true },
                                            { title: 'Rent Payment', date: '31 July 2022 | 21:00', amount: '+8,500 BeFin Coins', isNegative: false },
                                            { title: 'DLF Emporio', date: '10 June 2022 | 18:00', amount: '-24,999 BeFin Coins', isNegative: true },
                                        ].map((tx, idx) => (
                                            <div key={idx} className="flex items-center justify-between p-4 rounded-2xl hover:bg-[#1c1c24] transition-colors group cursor-pointer border-b border-white/5 last:border-0 border-solid">
                                                <div className="flex items-center gap-4">
                                                    <div>
                                                        <p className="font-semibold text-white text-[15px]">{tx.title}</p>
                                                        <p className="text-[11px] text-slate-500 font-medium mt-0.5 tracking-wide">{tx.date}</p>
                                                    </div>
                                                </div>
                                                <div className={`font-bold text-[14px] ${tx.isNegative ? 'text-white' : 'text-[#0380f5]'}`}>
                                                    {tx.amount}
                                                </div>
                                            </div>
                                        ))}
                                    </>
                                ) : (
                                    <>
                                        {transactions.map((tx: any, idx: number) => {
                                            const isDeposit = ['reward', 'deposit', 'REWARD', 'DEPOSIT'].includes(tx.transaction_type);
                                            const isReward = ['reward', 'REWARD'].includes(tx.transaction_type);
                                            return (
                                                <div key={tx.id} className="flex items-center justify-between p-4 rounded-2xl hover:bg-white/[0.03] transition-all group cursor-pointer border-b border-white/5 last:border-0 border-solid relative">
                                                    <div className="flex items-center gap-4">
                                                        <div>
                                                            <div className="flex items-center gap-2">
                                                                <p className="font-bold text-white text-[15px] tracking-tight">{tx.description || tx.transaction_type}</p>
                                                                {isReward && idx === 0 && (
                                                                    <span className="text-[9px] bg-blue-500/20 text-blue-400 px-1.5 py-0.5 rounded-md font-black uppercase tracking-tighter animate-pulse">New</span>
                                                                )}
                                                            </div>
                                                            <p className="text-[11px] text-slate-500 font-semibold mt-0.5 tracking-wider uppercase opacity-70">
                                                                {new Date(tx.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} • {new Date(tx.timestamp).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className={`font-black text-[15px] tracking-tight ${isDeposit ? 'text-blue-400' : 'text-white/40'}`}>
                                                        {isDeposit ? '+' : '-'}{parseFloat(tx.amount).toLocaleString()}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </>
                                )}
                            </div>
                        </div>

                    </div>

                    {/* Row: Transfers & Expenses */}
                    <div className="flex flex-col xl:flex-row gap-6">
                        {/* Money Transfers */}
                        <div className="flex-1 min-w-[300px]">
                            <h3 className="text-xl font-bold text-white mb-4 px-1">Money Transfers</h3>
                            <div className="grid grid-cols-3 gap-4 h-[calc(100%-2.5rem)]">
                                <button className="bg-[#18181c] border border-white/5 rounded-2xl p-5 flex flex-col items-center justify-center gap-3 hover:bg-[#1c1c24] transition-colors group">
                                    <Smartphone className="w-8 h-8 text-[#0380f5] group-hover:scale-110 transition-transform" />
                                    <span className="text-[11px] font-medium text-slate-400 text-center">To<br />Mobile Number</span>
                                </button>
                                <button className="bg-[#18181c] border border-white/5 rounded-2xl p-5 flex flex-col items-center justify-center gap-3 hover:bg-[#1c1c24] transition-colors group">
                                    <Landmark className="w-8 h-8 text-red-400 group-hover:scale-110 transition-transform" />
                                    <span className="text-[11px] font-medium text-slate-400 text-center">To<br />Bank or UPI</span>
                                </button>
                                <button className="bg-[#18181c] border border-white/5 rounded-2xl p-5 flex flex-col items-center justify-center gap-3 hover:bg-[#1c1c24] transition-colors group">
                                    <CreditCard className="w-8 h-8 text-orange-400 group-hover:scale-110 transition-transform" />
                                    <span className="text-[11px] font-medium text-slate-400 text-center">To<br />Self Account</span>
                                </button>
                            </div>
                        </div>

                        {/* Expenses Breakdown */}
                        <div className="flex-[1.5]">
                            <h3 className="text-xl font-bold text-white mb-4 px-1">Expenses Breakdown</h3>
                            <div className="bg-[#18181c] border border-white/5 rounded-3xl p-5 h-[calc(100%-2.5rem)]">
                                <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                                    {[
                                        { icon: Home, label: 'Housing', amount: '0', pct: '00%*' },
                                        { icon: Utensils, label: 'Food', amount: '0', pct: '00%*' },
                                        { icon: Car, label: 'Transportation', amount: '0', pct: '00%*' },
                                        { icon: Ticket, label: 'Entertainment', amount: '0', pct: '00%*' },
                                        { icon: ShoppingBag, label: 'Shopping', amount: '0', pct: '00%*' },
                                        { icon: Package, label: 'Others', amount: '0', pct: '00%*' }
                                    ].map((exp, idx) => {
                                        const Icon = exp.icon;
                                        return (
                                            <div key={idx} className="flex items-center justify-between p-3 rounded-2xl hover:bg-[#1c1c24] transition-colors border border-transparent hover:border-white/5">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-xl bg-[#111115] flex items-center justify-center opacity-80 border border-white/5">
                                                        <Icon className="w-4 h-4 text-slate-400" />
                                                    </div>
                                                    <div>
                                                        <p className="text-xs text-slate-400 font-semibold">{exp.label}</p>
                                                        <div className="flex items-baseline gap-1.5">
                                                            <span className="text-[15px] font-bold text-white">{exp.amount} BeFin Coins</span>
                                                            <span className="text-[10px] text-green-500 font-bold">{exp.pct} ↑</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="text-slate-500 text-xs">→</div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
