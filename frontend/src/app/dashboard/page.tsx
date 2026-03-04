'use client';

import React, { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { authService, walletService, gamesService } from '../../lib/api';
import Sidebar from '../../components/Sidebar';
import FinanceNews from '../../components/FinanceNews';
import LoadingScreen from '../../components/LoadingScreen';
import {
    Target, BookOpen, History, User, LogOut,
    Home, Wallet, Search, Bell, CircleHelp, TrendingUp, TrendingDown,
    Smartphone, Landmark, CreditCard,
    Send, Plus, LineChart, Coins, Gamepad2,
    ArrowUpRight, ArrowDownLeft, ChevronRight, Eye, EyeOff
} from 'lucide-react';

export default function Dashboard() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [wallet, setWallet] = useState<any>(null);
    const [transactions, setTransactions] = useState<any[]>([]);
    const [discounts, setDiscounts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // Referral States
    const [referralCode, setReferralCode] = useState<string | null>(null);
    const [generatingCode, setGeneratingCode] = useState(false);
    const [showReferral, setShowReferral] = useState(false);
    const [games, setGames] = useState<any[]>([]);


    const QUOTES = [
        { text: "Do not save what is left after spending; instead spend what is left after saving.", author: "Warren Buffett" },
        { text: "An investment in knowledge pays the best interest.", author: "Benjamin Franklin" },
        { text: "The stock market is a device for transferring money from the impatient to the patient.", author: "Warren Buffett" },
        { text: "It's not how much money you make, but how much you keep.", author: "Robert Kiyosaki" },
        { text: "Financial freedom is available to those who learn about it and work for it.", author: "Robert Kiyosaki" },
        { text: "The goal isn't more money. The goal is living life on your terms.", author: "Chris Brogan" },
        { text: "A budget is telling your money where to go instead of wondering where it went.", author: "Dave Ramsey" },
        { text: "Beware of little expenses; a small leak will sink a great ship.", author: "Benjamin Franklin" },
    ];
    const quote = useMemo(() => QUOTES[Math.floor(Math.random() * QUOTES.length)], []);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [profileData, walletData, txData, referralData, discountsData, gamesData] = await Promise.all([
                    authService.getProfile(),
                    walletService.getBalance(),
                    walletService.getTransactions(),
                    authService.getReferralCode(),
                    walletService.getDiscounts(),
                    gamesService.getGames(),
                    new Promise(resolve => setTimeout(resolve, 500))
                ]);

                setUser(profileData);
                setWallet(walletData);
                setTransactions(txData);
                setReferralCode(referralData.code);
                setDiscounts(discountsData);
                setGames(Array.isArray(gamesData) ? gamesData : []);
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
        return <LoadingScreen />;
    }

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
                    <div className="flex flex-col lg:flex-row gap-8 mb-8">

                        {/* 70% Left Content Grid */}
                        <div className="flex-[2.5] flex flex-col gap-6">

                            {/* Row: Quote & Pills */}
                            <div className="flex flex-col md:flex-row items-center gap-6">
                                {/* Live Finance News Instead of Static Quote */}
                                <FinanceNews />

                                {/* Interactive Pills */}
                                <div className="flex flex-col gap-3 min-w-[200px]">
                                    <Link href="/wallet" className="bg-[#18181c] rounded-xl flex items-center justify-between p-4 px-4 border border-white/5 hover:border-white/10 transition-colors">
                                        <span className="font-semibold text-white">Offers</span>
                                        <span className="w-6 h-6 rounded-full bg-[#FFCA28] text-black flex items-center justify-center text-xs font-bold">{discounts.length}</span>
                                    </Link>
                                    <div className="bg-[#18181c] rounded-xl flex items-center justify-between p-4 px-4 border border-white/5 hover:border-white/10 transition-colors">
                                        <span className="font-semibold text-white">Rewards</span>
                                        <span className="w-6 h-6 rounded-full bg-[#29B6F6] text-white flex items-center justify-center text-xs font-bold">
                                            {transactions.filter(tx => ['reward', 'REWARD'].includes(tx.transaction_type)).length}
                                        </span>
                                    </div>
                                    <div className="bg-[#18181c] rounded-xl flex items-center justify-between p-4 px-4 border border-white/5 hover:border-white/10 transition-colors">
                                        <span className="font-semibold text-white">Redeemed</span>
                                        <span className="w-6 h-6 rounded-full bg-[#EF5350] text-white flex items-center justify-center text-xs font-bold">
                                            {discounts.filter(d => d.is_redeemed).length}
                                        </span>
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
                                                    <div className="bg-[#111115] border border-white/10 rounded-xl px-4 py-2 flex items-center justify-center min-w-[120px] gap-3">
                                                        <span className="text-lg font-black text-white tracking-[0.1em] font-mono">
                                                            {showReferral ? referralCode : '••••••••'}
                                                        </span>
                                                        <button
                                                            onClick={() => setShowReferral(!showReferral)}
                                                            className="text-slate-500 hover:text-white transition-colors p-1"
                                                            title={showReferral ? "Hide code" : "Show code"}
                                                        >
                                                            {showReferral ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                                        </button>
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
                                    <div className="flex flex-col items-center justify-center flex-1 py-12 text-slate-500 gap-3">
                                        <History className="w-10 h-10 opacity-30" />
                                        <p className="text-sm font-semibold">No recent transactions</p>
                                    </div>
                                ) : (
                                    <>
                                        {transactions.map((tx: any, idx: number) => {
                                            const isDeposit = ['reward', 'deposit', 'REWARD', 'DEPOSIT'].includes(tx.transaction_type);
                                            const isReward = ['reward', 'REWARD'].includes(tx.transaction_type);
                                            return (
                                                <div key={tx.id} className="flex items-center justify-between px-2 py-4 rounded-xl transition-all group border-b border-white/5 last:border-0 border-solid relative">
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
                                                    <div className={`font-black text-[15px] tracking-tight ${isDeposit ? 'text-blue-400' : 'text-red-400'}`}>
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

                        {/* Learning Games */}
                        <div className="flex-1 min-w-[300px]">
                            {/* Motivational Quote */}
                            <div className="bg-[#18181c] border border-white/5 rounded-xl px-6 py-4 mb-4 h-[150px] overflow-hidden flex items-center">
                                <div className="flex flex-col gap-2">
                                    <p className="text-sm font-semibold text-slate-300 leading-relaxed italic line-clamp-2"> " {quote.text} "</p>
                                    <p className="text-[11px] font-black text-blue-400 uppercase tracking-widest">— {quote.author}</p>
                                </div>
                            </div>

                            <div className="flex items-center justify-between mb-4 px-2">
                                <h3 className="text-xl font-bold text-white">Learning Games</h3>
                                <Link href="/learning" className="flex items-center gap-1 text-xs font-bold text-blue-400 hover:text-blue-300 transition-colors">
                                    View All <ChevronRight className="w-3 h-3" />
                                </Link>
                            </div>
                            <div className="flex flex-col gap-3 h-[calc(100%-2.5rem)]">
                                {games.length > 0 && (
                                    games.slice(0, 2).map((game: any) => (
                                        <Link href="/learning" key={game.id} className="flex items-center gap-4 p-4 bg-[#18181c] rounded-xl border border-white/5 hover:border-blue-500/20 hover:bg-[#1c1c24] transition-all cursor-pointer group">
                                            <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300 overflow-hidden relative">
                                                {game.game_logo ? (
                                                    <Image src={game.game_logo} alt={game.name} fill className="object-cover" />
                                                ) : (
                                                    <Gamepad2 className="w-5 h-5 text-blue-400" />
                                                )}
                                            </div>
                                            <div className="flex flex-col flex-1">
                                                <span className="text-sm font-bold text-slate-300 group-hover:text-white transition-colors">{game.name}</span>
                                                <span className="text-[10px] font-bold text-slate-500">{game.genre} • Age {game.age_req}+</span>
                                                {game.description && <p className="text-[10px] text-slate-400 mt-1 line-clamp-1">{game.description}</p>}
                                            </div>
                                            <span className="text-[9px] font-black uppercase tracking-wider text-blue-400 bg-blue-500/10 px-2 py-1 rounded-lg">Live</span>
                                        </Link>
                                    ))
                                )}
                            </div>
                        </div>


                        {/* Goal Tracker */}
                        <div className="flex-[1.5]">
                            <div className="flex items-center justify-between mb-4 px-1">
                                <h3 className="text-xl font-bold text-white">Goal Tracker</h3>
                                <Link href="/goals" className="flex items-center gap-1 text-xs font-bold text-blue-400 hover:text-blue-300 transition-colors">
                                    Go to Goals <ChevronRight className="w-3 h-3" />
                                </Link>
                            </div>
                            <div className="bg-[#18181c] border border-white/5 rounded-3xl p-5 h-[calc(100%-2.5rem)] flex flex-col gap-4">
                                {/* Coming soon badge */}
                                <div className="flex items-center gap-2">
                                    <span className="text-[9px] font-black uppercase tracking-widest text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2.5 py-1 rounded-full">Full tracking coming soon</span>
                                </div>

                                {[
                                    { label: 'Emergency Fund', target: 10000, current: 4200, color: 'bg-blue-500' },
                                    { label: 'New Laptop', target: 5000, current: 3750, color: 'bg-purple-500' },
                                    { label: 'Vacation Trip', target: 8000, current: 1100, color: 'bg-green-500' },
                                ].map((goal) => {
                                    const pct = Math.min(100, Math.round((goal.current / goal.target) * 100));
                                    return (
                                        <div key={goal.label} className="flex flex-col gap-2 p-3 hover:bg-[#1c1c24] transition-colors">
                                            <div className="flex items-center justify-between">
                                                <p className="text-sm font-bold text-white">{goal.label}</p>
                                                <p className="text-xs font-black text-slate-400">{pct}%</p>
                                            </div>
                                            <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full ${goal.color} rounded-full transition-all duration-700`}
                                                    style={{ width: `${pct}%` }}
                                                />
                                            </div>
                                            <div className="flex justify-between text-[10px] font-bold text-slate-600">
                                                <span>{goal.current.toLocaleString()} BFC</span>
                                                <span>{goal.target.toLocaleString()} BFC</span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
