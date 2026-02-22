'use client';

import { useEffect, useState } from 'react';
import { ArrowUpRight, ArrowDownRight, Hash, ShieldBan, Wallet, Copy, Settings, Calendar, MoreVertical } from 'lucide-react';
import { motion } from 'framer-motion';

export default function WalletPage() {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([
            fetch('/api/wallet/balance').then(res => res.json()),
            fetch('/api/wallet/transactions').then(res => res.json())
        ]).then(([balanceData, txData]) => {
            setData({ wallet: balanceData.wallet, transactions: txData.transactions || [] });
            setLoading(false);
        });
    }, []);

    if (loading) return <div className="flex h-64 items-center justify-center"><div className="w-8 h-8 border-4 border-[#0A66C2] border-t-transparent rounded-full animate-spin" /></div>;

    const { wallet, transactions } = data;

    const displayTransactions = transactions || [];

    return (
        <div className="max-w-[1600px] mx-auto space-y-6 text-white pb-10">
            <h1 className="text-3xl font-bold mb-8">My Wallet</h1>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">

                {/* Left Column */}
                <div className="xl:col-span-4 space-y-6">
                    {/* Wallet Balance */}
                    <div className="bg-[#1C1F26] rounded-[24px] p-6">
                        <div className="flex justify-between items-start mb-4">
                            <h2 className="text-lg font-bold">Wallet Balance</h2>
                            <button className="px-5 py-2 rounded-full border border-white/20 text-sm font-medium hover:bg-white/5 transition-colors">
                                Top up
                            </button>
                        </div>
                        <div className="text-5xl font-black mt-2">
                            ₹{Number(wallet.balance).toFixed(2)}
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
                <div className="xl:col-span-4 space-y-6">
                    {/* Cards Header */}
                    <div className="flex justify-between items-center bg-[#1C1F26] rounded-t-[24px] p-6 pb-2">
                        <h2 className="text-xl font-bold">Payment Methods</h2>
                    </div>
                    <div className="bg-[#1C1F26] rounded-b-[24px] p-6 pt-0 flex gap-4 overflow-x-auto pb-6">
                        {/* Virtual BeFin Card */}
                        <div className="min-w-[280px] bg-gradient-to-br from-blue-400 to-blue-600 rounded-[20px] p-5 relative overflow-hidden shrink-0 shadow-lg shadow-blue-500/20">
                            <div className="absolute top-4 right-4 text-white/50">✔</div>
                            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center mb-6">
                                <div className="w-6 h-6 bg-white rounded-full mix-blend-overlay"></div>
                            </div>
                            <div className="text-sm text-white/80 mt-8">Virtual BeFin Card</div>
                            <div className="text-lg font-medium text-white tracking-widest mb-4">
                                **** **** **** {wallet?.card?.card_number ? wallet.card.card_number.split(' ').pop() : '0000'}
                            </div>
                            <div className="flex justify-between items-end">
                                <div className="flex gap-6">
                                    <div>
                                        <div className="text-[10px] text-white/70 uppercase">Exp.</div>
                                        <div className="text-sm font-medium">{wallet?.card?.expiry_date || 'MM/YY'}</div>
                                    </div>
                                    <div>
                                        <div className="text-[10px] text-white/70 uppercase">CVV</div>
                                        <div className="text-sm font-medium">{wallet?.card?.cvv || '***'}</div>
                                    </div>
                                </div>
                                <div className="flex">
                                    <div className="w-6 h-6 rounded-full bg-red-500 opacity-80 z-10"></div>
                                    <div className="w-6 h-6 rounded-full bg-yellow-500 opacity-80 -ml-3"></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Payment Settings */}
                    <div className="bg-[#1C1F26] rounded-[24px] p-6">
                        <h2 className="text-xl font-bold mb-6">Payment Settings</h2>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-4 bg-[#12141A] rounded-2xl cursor-pointer hover:bg-[#20242D] transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-[#1C1F26] rounded-xl"><span className="text-[#888888] font-bold">@</span></div>
                                    <div>
                                        <div className="font-bold text-sm">UPI IDs</div>
                                        <div className="text-xs text-[#888888]">View all your UPI IDs</div>
                                    </div>
                                </div>
                                <MoreVertical className="w-5 h-5 text-[#888888]" />
                            </div>

                            <div className="flex items-center justify-between p-4 bg-[#12141A] rounded-2xl cursor-pointer hover:bg-[#20242D] transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-[#1C1F26] rounded-xl"><Copy className="w-5 h-5 text-[#888888]" /></div>
                                    <div>
                                        <div className="font-bold text-sm">QR Codes</div>
                                        <div className="text-xs text-[#888888]">View your QR Code</div>
                                    </div>
                                </div>
                                <MoreVertical className="w-5 h-5 text-[#888888]" />
                            </div>

                            <div className="flex items-center justify-between p-4 bg-[#12141A] rounded-2xl cursor-pointer hover:bg-[#20242D] transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-[#1C1F26] rounded-xl"><Settings className="w-5 h-5 text-[#888888]" /></div>
                                    <div>
                                        <div className="font-bold text-sm">Autopay Settings</div>
                                        <div className="text-xs text-[#888888]">Manage Autopay</div>
                                    </div>
                                </div>
                                <MoreVertical className="w-5 h-5 text-[#888888]" />
                            </div>

                            <div className="flex items-center justify-between p-4 bg-[#12141A] rounded-2xl cursor-pointer hover:bg-[#20242D] transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-[#1C1F26] rounded-xl"><Calendar className="w-5 h-5 text-[#888888]" /></div>
                                    <div>
                                        <div className="font-bold text-sm">Reminders</div>
                                        <div className="text-xs text-[#888888]">Never miss bill dues</div>
                                    </div>
                                </div>
                                <MoreVertical className="w-5 h-5 text-[#888888]" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column (Transactions) */}
                <div className="xl:col-span-4 space-y-6">
                    <div className="bg-[#1C1F26] rounded-[24px] p-6 h-full">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold">Recent Transactions</h2>
                        </div>
                        <div className="space-y-6">
                            {displayTransactions.length > 0 ? displayTransactions.map((tx: any, i: number) => {
                                const isCredit = tx.transaction_type === 'reward' || tx.transaction_type === 'deposit';
                                return (
                                    <div key={i} className="flex items-center gap-4 group">
                                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${isCredit ? 'bg-[#0A2635] text-cyan-400' : 'bg-[#1C2635] text-blue-400'}`}>
                                            {isCredit ? <ArrowDownRight className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="font-medium text-sm truncate">{tx.description || (isCredit ? 'Received BeCoins' : 'Spent BeCoins')}</div>
                                            <div className="text-xs text-[#888888] truncate">{tx.timestamp ? new Date(tx.timestamp).toLocaleString() : 'Recent'}</div>
                                        </div>
                                        <div className="font-bold shrink-0 text-white">
                                            {isCredit ? '+' : '-'}₹{parseFloat(tx.amount || "0").toFixed(2)}
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
