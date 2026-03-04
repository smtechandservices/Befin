'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import { walletService, authService } from '@/lib/api';
import {
    Home, Wallet, Target, BookOpen, History, User, LogOut,
    Search, Bell, CircleHelp, ArrowUpRight, ArrowDownLeft,
    Plus, Send, CreditCard, Download, ExternalLink, RefreshCw,
    Eye, EyeOff, Smartphone, Landmark, ShieldCheck, ChevronRight,
    QrCode, Settings, Clock, MoreVertical, X
} from 'lucide-react';
import LoadingScreen from '@/components/LoadingScreen';

export default function WalletPage() {
    const [user, setUser] = useState<any>(null);
    const [wallet, setWallet] = useState<any>(null);
    const [transactions, setTransactions] = useState<any[]>([]);
    const [discounts, setDiscounts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showCardNumber, setShowCardNumber] = useState(false);

    // Transfer Modal States
    const [showTransferModal, setShowTransferModal] = useState(false);
    const [transferIdentifier, setTransferIdentifier] = useState('');
    const [transferAmount, setTransferAmount] = useState('');
    const [transferLoading, setTransferLoading] = useState(false);
    const [transferError, setTransferError] = useState('');
    const [transferSuccess, setTransferSuccess] = useState('');
    const [userSuggestions, setUserSuggestions] = useState<string[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [copiedId, setCopiedId] = useState<number | null>(null);

    const copyCode = (id: number, code: string) => {
        if (!code) return;
        navigator.clipboard.writeText(code);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    // Fetch suggestions when identifier changes
    useEffect(() => {
        const fetchSuggestions = async () => {
            if (transferIdentifier.length >= 1 && !transferIdentifier.includes(user?.username)) {
                try {
                    const suggestions = await walletService.searchUsers(transferIdentifier);
                    setUserSuggestions(suggestions);
                    setShowSuggestions(suggestions.length > 0);
                } catch (error) {
                    console.error("Failed to fetch suggestions", error);
                }
            } else {
                setUserSuggestions([]);
                setShowSuggestions(false);
            }
        };

        const timeoutId = setTimeout(fetchSuggestions, 300); // debounce API calls
        return () => clearTimeout(timeoutId);
    }, [transferIdentifier, user?.username]);

    const handleSuggestionClick = (suggestion: string) => {
        setTransferIdentifier(suggestion);
        setShowSuggestions(false);
    };

    const handleTransfer = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        setTransferError('');
        setTransferSuccess('');
        setTransferLoading(true);

        try {
            await walletService.transferMoney(transferIdentifier, parseFloat(transferAmount));
            setTransferSuccess('Transfer successful!');
            setTransferIdentifier('');
            setTransferAmount('');
            setShowConfirmation(false);

            // Refresh wallet and transactions
            const [walletData, transactionsData] = await Promise.all([
                walletService.getBalance(),
                walletService.getTransactions(),
            ]);
            if (walletData) setWallet(walletData);
            if (Array.isArray(transactionsData)) {
                setTransactions(transactionsData);
            } else if (walletData && Array.isArray(walletData.transactions)) {
                setTransactions(walletData.transactions);
            }

            setTimeout(() => {
                setShowTransferModal(false);
                setTransferSuccess('');
            }, 2000);
        } catch (error: any) {
            setTransferError(error.response?.data?.error || 'Transfer failed');
        } finally {
            setTransferLoading(false);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [profileData, walletData, txData, discountsData] = await Promise.all([
                    authService.getProfile(),
                    walletService.getBalance(),
                    walletService.getTransactions(),
                    walletService.getDiscounts(),
                    new Promise(resolve => setTimeout(resolve, 500))
                ]);

                console.log("User Data:", profileData);
                console.log("Wallet Data:", walletData);
                console.log("Transactions Data:", txData);
                console.log("Discounts Data:", discountsData);

                setUser(profileData);
                if (walletData) {
                    console.log("Setting Wallet Status:", !!walletData);
                    setWallet(walletData);
                }

                if (Array.isArray(txData)) {
                    console.log("Setting Transactions Count:", txData.length);
                    setTransactions(txData);
                } else if (walletData && Array.isArray(walletData.transactions)) {
                    console.log("Setting Transactions from Wallet Data:", walletData.transactions.length);
                    setTransactions(walletData.transactions);
                }

                setDiscounts(Array.isArray(discountsData) ? discountsData : []);
            } catch (error: any) {
                console.error("Critical error in fetchData:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return <LoadingScreen />;
    }

    const balanceValue = wallet?.balance !== undefined ? parseFloat(wallet.balance) : null;

    return (
        <div className="flex h-screen bg-[#0a0a0b] text-slate-200 overflow-hidden selection:bg-blue-500/30">
            <Sidebar />

            <main className="flex-1 flex flex-col h-full overflow-hidden">
                {/* Local Header */}
                <header className="px-8 lg:px-10 py-8 shrink-0">
                    <h1 className="text-[2.5rem] font-black tracking-tight text-white leading-tight">My Wallet</h1>
                    <p className="text-slate-400 font-semibold text-sm tracking-wide opacity-80 uppercase italic">Manage your digital assets and rewards</p>
                </header>

                <div className="flex-1 overflow-y-auto px-8 lg:px-10 pb-10 no-scrollbar">
                    <div className="max-w-[1600px] mx-auto flex flex-col gap-8">

                        {/* Main Content Grid */}
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                            {/* LEFT COLUMN: Balance, Transfers, Discounts */}
                            <div className="lg:col-span-4 flex flex-col gap-6">

                                {/* Wallet Balance */}
                                <div className="bg-[#111111] rounded-[2.5rem] p-7 border border-white/5 flex flex-col gap-6">
                                    <div className="flex justify-between items-center">
                                        <h3 className="text-slate-300 font-bold text-sm uppercase tracking-widest">Wallet Balance</h3>
                                    </div>
                                    <div className="text-4xl font-black text-white tracking-tight flex items-baseline gap-2">
                                        {balanceValue !== null ? balanceValue.toLocaleString('en-IN', { minimumFractionDigits: 2 }) : '---'} <span className="text-slate-500 font-bold text-[1.5rem]">BFC</span>
                                    </div>
                                </div>

                                {/* Money Transfers */}
                                <div className="bg-[#111111] rounded-[2.5rem] p-7 border border-white/5 flex flex-col gap-6">
                                    <h3 className="text-slate-300 font-bold text-sm uppercase tracking-widest">Money Transfers</h3>
                                    <div className="grid grid-cols-1 gap-3">
                                        <button onClick={() => {
                                            setShowTransferModal(true);
                                            setShowConfirmation(false);
                                        }} className="cursor-pointer group flex flex-col items-center gap-3 p-4 rounded-2xl bg-[#181818] border border-white/5 hover:bg-blue-600/10 hover:border-blue-500/30 transition-all">
                                            <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center group-hover:bg-blue-500 group-hover:text-white transition-all text-blue-500">
                                                <Send className="w-6 h-6" />
                                            </div>
                                            <span className="text-[10px] font-bold text-slate-500 group-hover:text-white transition-colors text-center">Transfer Money</span>
                                        </button>
                                    </div>
                                </div>

                                {/* Payment Settings */}
                                <div className="flex flex-col gap-4">
                                    <h3 className="text-slate-300 font-bold text-base tracking-tight pl-2">Payment Settings</h3>
                                    <div className="flex flex-col gap-3">
                                        <div className="relative group overflow-hidden rounded-2xl border border-white/5">
                                            <div className="flex items-center justify-between p-4 bg-[#111] transition-colors group-hover:bg-[#16161c] cursor-pointer">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-slate-500 group-hover:text-white transition-colors">
                                                        <Smartphone className="w-5 h-5" />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-bold text-white">UPI IDs</p>
                                                        <p className="text-[10px] text-slate-500 font-medium tracking-tight">View all your UPI IDs</p>
                                                    </div>
                                                </div>
                                                <MoreVertical className="w-4 h-4 text-slate-500" />
                                            </div>
                                            <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none">
                                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-400 bg-blue-500/10 border border-blue-500/20 px-3 py-1 rounded-full shadow-lg shadow-blue-500/10">Coming Soon</span>
                                            </div>
                                        </div>

                                        <div className="relative group overflow-hidden rounded-2xl border border-white/5">
                                            <div className="flex items-center justify-between p-4 bg-[#111] transition-colors group-hover:bg-[#16161c] cursor-pointer">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-slate-500 group-hover:text-white transition-colors">
                                                        <QrCode className="w-5 h-5" />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-bold text-white">QR Codes</p>
                                                        <p className="text-[10px] text-slate-500 font-medium tracking-tight">View your QR Code</p>
                                                    </div>
                                                </div>
                                                <MoreVertical className="w-4 h-4 text-slate-500" />
                                            </div>
                                            <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none">
                                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-400 bg-blue-500/10 border border-blue-500/20 px-3 py-1 rounded-full shadow-lg shadow-blue-500/10">Coming Soon</span>
                                            </div>
                                        </div>

                                        <div className="relative group overflow-hidden rounded-2xl border border-white/5">
                                            <div className="flex items-center justify-between p-4 bg-[#111] transition-colors group-hover:bg-[#16161c] cursor-pointer">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-slate-500 group-hover:text-white transition-colors">
                                                        <Settings className="w-5 h-5" />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-bold text-white">Autopay Settings</p>
                                                        <p className="text-[10px] text-slate-500 font-medium tracking-tight">Manage Autopay</p>
                                                    </div>
                                                </div>
                                                <MoreVertical className="w-4 h-4 text-slate-500" />
                                            </div>
                                            <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none">
                                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-400 bg-blue-500/10 border border-blue-500/20 px-3 py-1 rounded-full shadow-lg shadow-blue-500/10">Coming Soon</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* MIDDLE COLUMN: Card and Settings */}
                            <div className="lg:col-span-4 flex flex-col gap-6">

                                {/* Card Section */}
                                <div className="flex flex-col gap-4">
                                    <h3 className="text-slate-300 font-bold text-sm uppercase tracking-widest pl-2">My Befin Card</h3>
                                    <div className="relative bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl p-8 overflow-hidden group shadow-2xl">
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-xl blur-2xl -translate-y-1/2 translate-x-1/2"></div>
                                        <div className="relative h-full flex flex-col justify-between">
                                            <div className="flex flex-col">
                                                <div className="flex justify-between items-start mb-2">
                                                    <div className="w-12 h-12">
                                                        <Image src="/images/logo.png" alt="BeFin" width={28} height={28} />
                                                    </div>
                                                    <button
                                                        onClick={() => setShowCardNumber(!showCardNumber)}
                                                        className="p-2 bg-white/10 hover:bg-white/20 rounded-xl transition-colors backdrop-blur-sm"
                                                    >
                                                        {showCardNumber ? <EyeOff className="w-4 h-4 text-white" /> : <Eye className="w-4 h-4 text-white" />}
                                                    </button>
                                                </div>

                                                <p className="text-[10px] font-black text-white/50 uppercase tracking-[0.2em] mb-2">Debit Card</p>
                                                <div className="flex flex-col gap-1">
                                                    <p className="text-xl font-bold text-white tracking-[0.15em] font-mono whitespace-nowrap">
                                                        {wallet?.card?.card_number ? (
                                                            showCardNumber
                                                                ? wallet.card.card_number.match(/.{1,4}/g)?.join(' ')
                                                                : `XXXX XXXX XXXX ${wallet.card.card_number.slice(-4)}`
                                                        ) : 'XXXX XXXX XXXX XXXX'}
                                                    </p>
                                                    <div className="flex gap-6 mt-4">
                                                        <div>
                                                            <p className="text-[8px] text-white/40 font-bold uppercase tracking-widest">CVV</p>
                                                            <p className="text-xs font-bold text-white font-mono">{showCardNumber ? wallet?.card?.cvv : '***'}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex justify-between items-end">
                                                <div className="flex flex-col gap-1">
                                                    <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest">Card Holder</p>
                                                    <p className="text-sm font-bold text-white">{user?.username || 'BEFIN USER'}</p>
                                                </div>
                                                <div className="flex -space-x-3">
                                                    <div className="w-10 h-10 rounded-full bg-red-500/80 border border-white/10"></div>
                                                    <div className="w-10 h-10 rounded-full bg-yellow-500/80 border border-white/10"></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Discounts */}
                                <div className="bg-[#111111] rounded-xl p-7 border border-white/5 flex flex-col gap-6">
                                    <h3 className="text-slate-300 font-bold text-base tracking-tight">Discounts</h3>
                                    <div className="flex flex-col gap-4 pr-1 max-h-[420px] overflow-y-auto no-scrollbar">
                                        {discounts.map((discount: any) => (
                                            <div key={discount.id} onClick={() => copyCode(discount.id, discount.code)} className="group relative px-3 py-4 bg-[#181818] rounded-[1.25rem] border border-white/5 hover:border-white/10 transition-all overflow-hidden cursor-pointer">
                                                {/* Default view */}
                                                <div className="flex justify-between items-center transition-opacity duration-200 group-hover:opacity-0">
                                                    <div className="flex items-center gap-4">
                                                        <div className={`relative w-12 h-12 rounded-xl flex items-center justify-center font-black overflow-hidden ${discount.brand_name === 'Amazon' ? 'bg-white text-black' :
                                                            discount.brand_name === 'Starbucks' ? 'bg-[#00704A] text-white' :
                                                                'bg-[#E23744] text-white'
                                                            }`}>
                                                            {discount.image_url ? (
                                                                <Image src={discount.image_url} alt={discount.brand_name} fill className="object-cover" />
                                                            ) : (
                                                                discount.brand_name[0]
                                                            )}
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-bold text-white">{discount.brand_name}</p>
                                                            <div className="flex items-center gap-1 mt-0.5">
                                                                <div className="w-3 h-3 rounded-full bg-yellow-500/20 flex items-center justify-center">
                                                                    <div className="w-1.5 h-1.5 rounded-full bg-yellow-500"></div>
                                                                </div>
                                                                <p className="text-[10px] text-yellow-500 font-bold">{parseFloat(discount.coin_cost).toLocaleString()} Coins</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="px-3 py-1.5 rounded-lg text-md font-bold text-white">
                                                        {discount.percentage}% Off
                                                    </div>
                                                </div>
                                                {/* Hover overlay: claim code */}
                                                <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-[#181818] rounded-[1.25rem]">
                                                    {copiedId === discount.id ? (
                                                        <>
                                                            <p className="text-[10px] font-black uppercase tracking-widest text-green-400">Copied!</p>
                                                            <p className="text-base font-black text-green-400 tracking-[0.15em] font-mono">{discount.code || 'N/A'}</p>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Click to copy</p>
                                                            <p className="text-base font-black text-white tracking-[0.15em] font-mono">{discount.code || 'N/A'}</p>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* RIGHT COLUMN: Recent Transactions */}
                            <div className="lg:col-span-4 flex flex-col gap-6">
                                <div className="bg-[#111111] rounded-[2.5rem] p-7 border border-white/5 flex flex-col h-full min-h-[600px]">
                                    <h3 className="text-slate-200 font-black text-xl tracking-tight mb-6">Recent Transactions</h3>
                                    <div className="flex flex-col gap-2 overflow-y-auto no-scrollbar">
                                        {transactions.length === 0 ? (
                                            <div className="p-8 text-center text-slate-500 font-medium italic">
                                                No recent activity.
                                            </div>
                                        ) : (
                                            transactions.map((tx: any) => {
                                                const isDeposit = ['reward', 'deposit', 'REWARD', 'DEPOSIT'].includes(tx.transaction_type);
                                                return (
                                                    <div key={tx.id} className="flex items-center justify-between px-2 py-4 rounded-[1.5rem] hover:bg-white/[0.02] transition-colors border border-transparent hover:border-white/5">
                                                        <div className="flex items-center gap-5">
                                                            <div className={`rounded-2xl flex items-center justify-center text-xl ${isDeposit ? 'text-blue-400' : 'text-slate-400'
                                                                }`}>
                                                                {isDeposit ? <ArrowDownLeft className="w-7 h-7" /> : <ArrowUpRight className="w-7 h-7" />}
                                                            </div>
                                                            <div>
                                                                <p className="font-bold text-white text-base">{tx.description || 'Global Payment'}</p>
                                                                <div className="flex items-center gap-2 mt-0.5">
                                                                    <p className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">
                                                                        {new Date(tx.timestamp).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}
                                                                    </p>
                                                                    <span className="text-slate-700">•</span>
                                                                    <p className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">
                                                                        {new Date(tx.timestamp).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <p className={`text-lg font-black tracking-tight flex items-baseline gap-1 ${isDeposit ? 'text-blue-400' : 'text-white'}`}>
                                                            {isDeposit ? '+' : '-'} {parseFloat(tx.amount).toLocaleString()}
                                                            <span className="text-xs font-bold opacity-80">Coins</span>
                                                        </p>
                                                    </div>
                                                );
                                            })
                                        )}
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </main>

            {/* Transfer Modal */}
            {showTransferModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <div className="bg-[#111111] rounded-[2rem] border border-white/10 w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                        <div className="flex justify-between items-center p-6 border-b border-white/5">
                            <h2 className="text-xl font-black text-white">Transfer Money</h2>
                            <button
                                onClick={() => setShowTransferModal(false)}
                                className="p-2 bg-white/5 hover:bg-white/10 rounded-full text-slate-400 hover:text-white transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="p-6">
                            {transferSuccess && (
                                <div className="mb-6 p-4 bg-green-500/10 border border-green-500/30 rounded-2xl flex items-center justify-center">
                                    <p className="text-green-400 font-bold text-sm">{transferSuccess}</p>
                                </div>
                            )}

                            {transferError && (
                                <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-2xl flex items-center justify-center">
                                    <p className="text-red-400 font-bold text-sm">{transferError}</p>
                                </div>
                            )}

                            {!showConfirmation ? (
                                <form onSubmit={(e) => {
                                    e.preventDefault();
                                    setShowConfirmation(true);
                                }} className="flex flex-col gap-6">
                                    <div className="flex flex-col gap-2">
                                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider pl-1">
                                            Recipient Username or Card Number
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <User className="h-5 w-5 text-slate-500" />
                                            </div>
                                            <input
                                                type="text"
                                                value={transferIdentifier}
                                                onChange={(e) => {
                                                    setTransferIdentifier(e.target.value);
                                                    setShowSuggestions(true);
                                                }}
                                                onFocus={() => {
                                                    if (userSuggestions.length > 0) {
                                                        setShowSuggestions(true);
                                                    }
                                                }}
                                                onBlur={() => {
                                                    // Delay hiding suggestions to allow click events to register
                                                    setTimeout(() => setShowSuggestions(false), 200);
                                                }}
                                                required
                                                placeholder="Enter Username"
                                                className="w-full bg-[#181818] border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all font-medium"
                                            />

                                            {/* Suggestions Dropdown */}
                                            {showSuggestions && userSuggestions.length > 0 && (
                                                <div className="absolute z-10 w-full mt-2 bg-[#1a1a24] border border-white/10 rounded-2xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                                                    {userSuggestions.map((suggestion, index) => (
                                                        <div
                                                            key={index}
                                                            onClick={() => handleSuggestionClick(suggestion)}
                                                            className="px-4 py-3 hover:bg-blue-600/20 hover:text-blue-400 cursor-pointer transition-colors flex items-center gap-3 border-b border-white/5 last:border-b-0 text-slate-300 font-medium"
                                                        >
                                                            <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500">
                                                                <User className="w-4 h-4" />
                                                            </div>
                                                            {suggestion}
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                        <p className="text-[10px] text-slate-500 pl-1 mt-1">Enter username or 16-digit card number.</p>
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider pl-1">
                                            Amount
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <div className="w-4 h-4 rounded-full bg-yellow-500/20 flex items-center justify-center">
                                                    <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                                                </div>
                                            </div>
                                            <input
                                                type="number"
                                                value={transferAmount}
                                                onChange={(e) => setTransferAmount(e.target.value)}
                                                required
                                                min="1"
                                                step="1"
                                                placeholder="0.00"
                                                className="w-full bg-[#181818] border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all font-bold text-lg"
                                            />
                                        </div>
                                        {wallet && (
                                            <div className="flex justify-between items-center pl-1 mt-1">
                                                <p className="text-[10px] text-slate-500 font-medium">Available Balance:</p>
                                                <p className="text-[10px] text-blue-400 font-bold flex items-center gap-1">
                                                    <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
                                                    {parseFloat(wallet.balance).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                                </p>
                                            </div>
                                        )}
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={!transferIdentifier || !transferAmount}
                                        className="w-full mt-2 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-2xl font-black text-sm tracking-wide transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:shadow-[0_0_30px_rgba(59,130,246,0.5)] border border-white/10 flex items-center justify-center gap-2"
                                    >
                                        <Send className="w-4 h-4" /> Continue
                                    </button>
                                </form>
                            ) : (
                                <div className="flex flex-col gap-6">
                                    <div className="bg-[#181818] p-6 rounded-2xl border border-white/10 flex flex-col items-center gap-4">
                                        <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center text-blue-500 mb-2">
                                            <Send className="w-8 h-8 ml-1" />
                                        </div>
                                        <div className="text-center">
                                            <p className="text-sm text-slate-400 font-bold uppercase tracking-wider mb-1">Send to</p>
                                            <p className="text-xl font-black text-white">{transferIdentifier}</p>
                                        </div>
                                        <div className="w-full h-px bg-white/5 my-2"></div>
                                        <div className="text-center">
                                            <p className="text-sm text-slate-400 font-bold uppercase tracking-wider mb-1">Amount</p>
                                            <p className="text-3xl font-black text-white flex justify-center items-center gap-2">
                                                <span className="w-4 h-4 rounded-full bg-yellow-500"></span>
                                                {parseFloat(transferAmount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex gap-3 mt-2">
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmation(false)}
                                            disabled={transferLoading}
                                            className="flex-1 py-4 bg-[#181818] hover:bg-[#222] text-white rounded-2xl font-bold text-sm transition-all border border-white/10"
                                        >
                                            Back
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleTransfer()}
                                            disabled={transferLoading}
                                            className="flex-[2] py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-2xl font-black text-sm tracking-wide transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:shadow-[0_0_30px_rgba(59,130,246,0.5)] border border-white/10 flex items-center justify-center gap-2"
                                        >
                                            {transferLoading ? (
                                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                            ) : (
                                                <>Confirm Transfer</>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
