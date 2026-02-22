'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { authService } from '../../lib/auth';
import { walletService } from '../../lib/wallet';
import Sidebar from '../../components/Sidebar';
import Navbar from '../../components/Navbar';
import {
    Home, Wallet, Target, BookOpen, History, User, LogOut,
    Search, Bell, CircleHelp, ArrowUpRight, ArrowDownLeft,
    Plus, Send, CreditCard, Download, ExternalLink, RefreshCw
} from 'lucide-react';

export default function WalletPage() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [wallet, setWallet] = useState<any>(null);
    const [transactions, setTransactions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [profileData, walletData, txData] = await Promise.all([
                    authService.getProfile(),
                    walletService.getBalance(),
                    walletService.getTransactions()
                ]);

                setUser(profileData);
                setWallet(walletData);
                setTransactions(txData);
            } catch (error) {
                console.error('Failed to fetch wallet data:', error);
                router.push('/login');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [router]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#111115] text-white">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0380f5]"></div>
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-[#111115] font-sans text-white overflow-hidden">
            {/* Left Sidebar */}
            <Sidebar />

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col h-full overflow-hidden">
                {/* Header Navbar */}
                <Navbar title="My Wallet" />

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto px-10 pb-10 no-scrollbar">
                    <div className="flex flex-col gap-8 max-w-5xl mx-auto">

                        {/* Top Section: Balance & Actions */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Balance Card */}
                            <div className="md:col-span-2 bg-[#18181c] rounded-3xl p-8 border border-white/5 relative overflow-hidden flex flex-col justify-between min-h-[220px]">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                                <div className="relative z-10 flex items-center gap-3 text-slate-400 font-medium">
                                    <Wallet className="w-5 h-5" />
                                    <span>Total Available Balance</span>
                                </div>
                                <div className="relative z-10 mt-4 mb-8">
                                    <h2 className="text-5xl font-bold tracking-tight text-white">
                                        ₹ {wallet?.balance ? parseFloat(wallet.balance).toLocaleString('en-IN') : '0.00'}
                                    </h2>
                                </div>
                                <div className="relative z-10 flex gap-4">
                                    <button className="bg-[#0380f5] hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-xl flex items-center gap-2 transition-colors">
                                        <Plus className="w-5 h-5" /> Add Money
                                    </button>
                                    <button className="bg-[#1c1c24] hover:bg-white/10 text-white font-semibold py-3 px-6 rounded-xl flex items-center gap-2 border border-white/5 transition-colors">
                                        <Download className="w-5 h-5" /> Withdraw
                                    </button>
                                </div>
                            </div>

                            {/* Quick Stats or Card Info */}
                            <div className="bg-gradient-to-br from-[#1e1e26] to-[#18181c] rounded-3xl p-6 border border-white/5 flex flex-col justify-between">
                                <h3 className="text-lg font-semibold text-slate-300">Default Payment Method</h3>
                                <div className="mt-4 p-4 bg-[#111115] rounded-2xl border border-white/5 flex items-center gap-4">
                                    <div className="w-12 h-12 bg-[#1c1c24] rounded-xl flex items-center justify-center">
                                        <CreditCard className="w-6 h-6 text-slate-400" />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-white">HDFC Bank</p>
                                        <p className="text-xs text-slate-500 font-medium">**** **** **** 4821</p>
                                    </div>
                                </div>
                                <button className="mt-4 w-full py-3 rounded-xl border border-dashed border-white/20 text-slate-400 text-sm font-semibold hover:text-white hover:border-white/40 transition-colors flex items-center justify-center gap-2">
                                    <Plus className="w-4 h-4" /> Add New Card
                                </button>
                            </div>
                        </div>

                        {/* Bottom Section: Transaction History */}
                        <div className="bg-[#18181c] rounded-3xl border border-white/5 flex flex-col overflow-hidden">
                            <div className="p-6 border-b border-white/5 flex justify-between items-center">
                                <h3 className="text-xl font-bold text-white">Transaction History</h3>
                                <button className="text-sm font-semibold text-[#0380f5] hover:text-blue-400 transition-colors flex items-center gap-1">
                                    <RefreshCw className="w-4 h-4" /> Refresh
                                </button>
                            </div>

                            <div className="p-2">
                                {transactions.length === 0 ? (
                                    <div className="p-8 text-center text-slate-500 font-medium">
                                        No transactions found.
                                    </div>
                                ) : (
                                    <div className="flex flex-col">
                                        {transactions.map((tx: any) => {
                                            const isDeposit = tx.transaction_type === 'DEPOSIT' || tx.transaction_type === 'REWARD';
                                            return (
                                                <div key={tx.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl hover:bg-[#1c1c24] transition-colors group cursor-pointer border-b border-white/5 last:border-0 border-solid">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-12 h-12 rounded-xl bg-[#111115] border border-white/5 flex items-center justify-center transition-colors">
                                                            {!isDeposit ? (
                                                                <ArrowUpRight className="w-5 h-5 text-slate-400" />
                                                            ) : (
                                                                <ArrowDownLeft className="w-5 h-5 text-blue-500" />
                                                            )}
                                                        </div>
                                                        <div>
                                                            <p className="font-semibold text-white text-[16px]">{tx.description || tx.transaction_type}</p>
                                                            <p className="text-[12px] text-slate-500 font-medium mt-1 tracking-wide">{new Date(tx.timestamp).toLocaleString()}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-6 mt-4 sm:mt-0">
                                                        <div className={`font-bold text-[16px] ${!isDeposit ? 'text-white' : 'text-[#0380f5]'}`}>
                                                            {isDeposit ? '+' : '-'}₹{parseFloat(tx.amount).toLocaleString('en-IN')}
                                                        </div>
                                                        <div className="hidden sm:flex text-slate-500 hover:text-white transition-colors">
                                                            <ExternalLink className="w-5 h-5" />
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        </div>

                    </div>
                </div>
            </main>
        </div>
    );
}
