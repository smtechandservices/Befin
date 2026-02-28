'use client';

import { useEffect, useState } from 'react';
import {
    ArrowUpRight, ArrowDownRight, Hash, ShieldBan, Wallet, Copy,
    Settings, Calendar, MoreVertical, Send, CreditCard, X,
    User as UserIcon, Coins, Lock, Check, Eye, EyeOff, CircleHelp,
    ArrowDownLeft, Smartphone, History as HistoryIcon, Landmark
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { authService } from '@/lib/auth.client';
import { walletService } from '@/lib/wallet';
import { toast, Toaster } from 'react-hot-toast';
import Navbar from '../../../components/Navbar';

export default function WalletPage() {
    const [user, setUser] = useState<any>(null);
    const [wallet, setWallet] = useState<any>(null);
    const [transactions, setTransactions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // Modal states
    const [showTransferModal, setShowTransferModal] = useState(false);
    const [showCardModal, setShowCardModal] = useState(false);
    const [verifying, setVerifying] = useState(false);
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
            console.error('Failed to fetch wallet data:', error);
            toast.error('Session expired. Please login again.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

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
            fetchData();
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

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-[#111115] text-white">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0380f5]"></div>
        </div>
    );

    return (
        <div className="max-w-[1600px] mx-auto space-y-6 text-white pb-10 px-6">
            <Toaster position="top-right" />
            <Navbar title="My Wallet" />

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">

                {/* Left Column */}
                <div className="xl:col-span-4 space-y-6">
                    {/* Wallet Balance */}
                    <div className="bg-[#1C1F26] rounded-[32px] p-8 border border-white/5 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                            <Wallet size={120} />
                        </div>
                        <div className="flex justify-between items-start mb-6">
                            <h2 className="text-slate-400 font-bold uppercase tracking-wider text-xs">BeFin Coins Balance</h2>
                            <button onClick={() => toast('Top up coming soon!')} className="px-4 py-1.5 rounded-full border border-white/10 text-xs font-bold hover:bg-white/5 transition-colors">
                                Top up
                            </button>
                        </div>
                        <div className="flex items-center gap-3">
                            <Coins className="text-yellow-500 w-8 h-8" />
                            <div className="text-5xl font-black tracking-tighter">
                                {parseFloat(wallet?.balance || 0).toLocaleString('en-IN')}
                            </div>
                        </div>
                    </div>

                    {/* Money Transfers */}
                    <div className="bg-[#1C1F26] rounded-[32px] p-8 border border-white/5">
                        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                            Quick Transfer
                        </h2>
                        <div className="flex gap-4">
                            <div
                                onClick={() => setShowTransferModal(true)}
                                className="flex-1 bg-[#12141A] p-5 rounded-3xl flex flex-col items-center justify-center gap-3 cursor-pointer hover:bg-[#20242D] transition-all hover:scale-[1.02] active:scale-95 border border-white/5 group"
                            >
                                <div className="p-3 bg-[#1C1F26] rounded-2xl group-hover:bg-[#0380f5]/10 transition-colors"><Send className="w-6 h-6 text-[#0380f5]" /></div>
                                <div className="text-center">
                                    <span className="text-white font-bold text-xs uppercase tracking-widest">Send Coins</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Payment Settings */}
                    <div className="bg-[#1C1F26] rounded-[32px] p-8 border border-white/5">
                        <h2 className="text-xl font-bold mb-6">Security & Settings</h2>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-4 bg-[#12141A] rounded-2xl cursor-pointer hover:bg-[#20242D] transition-colors border border-white/5 group">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-[#1C1F26] rounded-xl group-hover:bg-[#0380f5]/10 transition-colors"><Lock className="w-5 h-5 text-slate-400 group-hover:text-[#0380f5]" /></div>
                                    <div>
                                        <div className="font-bold text-sm">Security Pin</div>
                                        <div className="text-[10px] text-slate-500 font-bold uppercase mt-0.5">Manage your PIN</div>
                                    </div>
                                </div>
                                <MoreVertical className="w-5 h-5 text-slate-600" />
                            </div>

                            <div className="flex items-center justify-between p-4 bg-[#12141A] rounded-2xl cursor-pointer hover:bg-[#20242D] transition-colors border border-white/5 group" onClick={() => setShowCardModal(true)}>
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-[#1C1F26] rounded-xl group-hover:bg-orange-500/10 transition-colors"><CreditCard className="w-5 h-5 text-slate-400 group-hover:text-orange-400" /></div>
                                    <div>
                                        <div className="font-bold text-sm">Card Settings</div>
                                        <div className="text-[10px] text-slate-500 font-bold uppercase mt-0.5">Virtual Card Details</div>
                                    </div>
                                </div>
                                <MoreVertical className="w-5 h-5 text-slate-600" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Middle Column - BeFin Card UI */}
                <div className="xl:col-span-4 space-y-6">
                    <div className="bg-[#1C1F26] rounded-[32px] p-8 border border-white/5 h-full flex flex-col">
                        <h2 className="text-xl font-bold mb-8">Virtual Asset</h2>

                        <div
                            onClick={() => setShowCardModal(true)}
                            className="relative w-full aspect-[1.586/1] rounded-3xl p-8 bg-gradient-to-br from-[#1c1c1c] via-[#2a2a2a] to-[#1c1c1c] overflow-hidden shadow-2xl border border-white/10 group cursor-pointer hover:scale-[1.02] transition-transform"
                        >
                            <div className="absolute top-0 right-0 w-64 h-64 bg-[#0380f5] opacity-10 blur-[100px] -mr-32 -mt-32" />

                            <div className="relative z-10 h-full flex flex-col justify-between">
                                <div className="flex justify-between items-start">
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Platinum</span>
                                        <span className="text-lg font-black text-white italic tracking-tighter">BeFin <span className="text-[#0380f5]">Wallet</span></span>
                                    </div>
                                    <div className="w-10 h-8 bg-white/5 rounded-lg border border-white/10 flex items-center justify-center">
                                        <div className="w-6 h-4 bg-gradient-to-r from-yellow-500/50 to-orange-500/50 rounded" />
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <p className="text-[10px] font-black uppercase text-slate-500 tracking-[0.2em]">Card Number</p>
                                    <p className="text-xl font-bold text-white tracking-[0.15em] font-mono">
                                        **** **** **** {wallet?.card?.card_number ? wallet.card.card_number.split(' ').pop() : '0000'}
                                    </p>
                                </div>

                                <div className="flex justify-between items-end">
                                    <div className="space-y-0.5">
                                        <p className="text-[9px] font-black uppercase text-slate-500">Holder</p>
                                        <p className="text-sm font-bold text-white uppercase tracking-wider truncate max-w-[120px]">{user?.first_name || 'BEFIN USER'}</p>
                                    </div>
                                    <div className="flex gap-6">
                                        <div className="space-y-0.5 text-right">
                                            <p className="text-[9px] font-black uppercase text-slate-500">Exp</p>
                                            <p className="text-sm font-bold text-white font-mono">{wallet?.card?.expiry_date || 'MM/YY'}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none" />
                        </div>

                        <div className="mt-8 bg-[#111115] p-6 rounded-3xl border border-white/5 flex-1">
                            <h3 className="text-sm font-bold uppercase tracking-widest text-[#0380f5] mb-4">Quick Insights</h3>
                            <div className="space-y-4">
                                <div className="flex justify-between items-baseline">
                                    <span className="text-xs text-slate-500 font-bold uppercase">Reward Points</span>
                                    <span className="text-lg font-black">{Math.floor(parseFloat(wallet?.balance || 0) / 100).toLocaleString()}</span>
                                </div>
                                <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                                    <div className="bg-[#0380f5] h-full w-[65%]" />
                                </div>
                                <p className="text-[10px] text-slate-500 font-medium">Earn more BeCoins to reach "Gold" status and unlock premium virtual card skins.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column (Transactions) */}
                <div className="xl:col-span-4 space-y-6">
                    <div className="bg-[#1C1F26] rounded-[32px] p-8 border border-white/5 h-full flex flex-col overflow-hidden max-h-[700px]">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold uppercase tracking-tight">Recent Activity</h2>
                        </div>
                        <div className="space-y-4 overflow-y-auto no-scrollbar pr-2">
                            {transactions.length > 0 ? transactions.map((tx: any, i: number) => {
                                const isCredit = ['reward', 'deposit'].includes(tx.transaction_type.toLowerCase());
                                return (
                                    <div key={i} className="flex items-center gap-4 group p-4 bg-[#121419] rounded-2xl hover:bg-[#181a20] transition-colors border border-white/5">
                                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border border-white/5 ${isCredit ? 'bg-blue-500/10 text-blue-400' : 'bg-slate-500/10 text-slate-400'}`}>
                                            {isCredit ? <ArrowDownLeft className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="font-bold text-sm truncate">{tx.description || (isCredit ? 'BeCoins Received' : 'BeCoins Spent')}</div>
                                            <div className="text-[10px] font-bold text-slate-500 uppercase mt-0.5">{new Date(tx.timestamp).toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}</div>
                                        </div>
                                        <div className={`font-black shrink-0 text-sm ${isCredit ? 'text-[#0380f5]' : 'text-slate-300'}`}>
                                            {isCredit ? '+' : '-'}₹{parseFloat(tx.amount).toLocaleString()}
                                        </div>
                                    </div>
                                );
                            }) : (
                                <div className="text-center py-20 opacity-30">
                                    <HistoryIcon className="w-12 h-12 mx-auto mb-4" />
                                    <p className="font-bold uppercase tracking-widest text-xs">No activity found</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

            </div>

            {/* Modals from Dashboard Logic */}
            <AnimatePresence>
                {showTransferModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setShowTransferModal(false)} />
                        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-[#18181c] w-full max-w-md rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden">
                            <div className="p-8">
                                <div className="flex justify-between items-center mb-8">
                                    <h2 className="text-2xl font-black uppercase tracking-widest">Send Coins</h2>
                                    <button onClick={() => setShowTransferModal(false)} className="bg-white/5 p-2 rounded-full hover:bg-white/10 transition-colors"><X size={20} /></button>
                                </div>
                                <form onSubmit={handleTransfer} className="space-y-5">
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black uppercase text-slate-500 ml-1">Recipient Username</label>
                                        <div className="relative">
                                            <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
                                            <input required type="text" placeholder="username" className="w-full bg-[#111115] border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-[#0380f5] transition-colors font-bold" value={transferData.username} onChange={e => setTransferData({ ...transferData, username: e.target.value })} />
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black uppercase text-slate-500 ml-1">Amount</label>
                                        <div className="relative">
                                            <Coins className="absolute left-4 top-1/2 -translate-y-1/2 text-yellow-500/50" size={18} />
                                            <input required type="number" placeholder="0" className="w-full bg-[#111115] border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-[#0380f5] transition-colors font-bold text-xl" value={transferData.amount} onChange={e => setTransferData({ ...transferData, amount: e.target.value })} />
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black uppercase text-slate-500 ml-1">Pin / Password</label>
                                        <div className="relative">
                                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
                                            <input required type="password" placeholder="••••••••" className="w-full bg-[#111115] border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-[#0380f5] transition-colors font-bold" value={transferData.password} onChange={e => setTransferData({ ...transferData, password: e.target.value })} />
                                        </div>
                                    </div>
                                    <button disabled={verifying} className="w-full bg-[#0380f5] py-5 rounded-2xl font-black uppercase tracking-widest text-white mt-4 shadow-xl shadow-blue-500/20 disabled:opacity-50 active:scale-95 transition-all">
                                        {verifying ? 'Processing...' : 'Transfer Now'}
                                    </button>
                                </form>
                            </div>
                        </motion.div>
                    </div>
                )}

                {showCardModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => { setShowCardModal(false); setShowCardData(false); setCardPassword(''); }} />
                        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-[#18181c] w-full max-w-lg rounded-[2.5rem] border border-white/10 shadow-2xl relative overflow-hidden">
                            {!showCardData ? (
                                <div className="p-10 text-center">
                                    <div className="w-20 h-20 bg-orange-500/10 rounded-full flex items-center justify-center mx-auto mb-6"><Lock className="w-10 h-10 text-orange-400" /></div>
                                    <h2 className="text-2xl font-black uppercase mb-2">Access Card</h2>
                                    <p className="text-slate-500 text-sm mb-8">Enter your login password to reveal full details.</p>
                                    <form onSubmit={handleViewCard} className="space-y-4">
                                        <input required type="password" placeholder="••••••••" className="w-full bg-[#111115] border border-white/5 rounded-2xl py-4 px-6 text-white focus:outline-none focus:border-orange-500/50 transition-colors font-bold text-center" value={cardPassword} onChange={e => setCardPassword(e.target.value)} />
                                        <button disabled={verifying} className="w-full bg-orange-500 py-5 rounded-2xl font-black uppercase text-white shadow-xl shadow-orange-500/20 disabled:opacity-50 transition-all">
                                            {verifying ? 'Verifying...' : 'Unlock Details'}
                                        </button>
                                    </form>
                                </div>
                            ) : (
                                <div className="p-8">
                                    <div className="flex justify-between items-center mb-8">
                                        <h2 className="text-xl font-black uppercase tracking-widest text-white flex items-center gap-3">
                                            <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
                                            Virtual BeFin Card
                                        </h2>
                                        <button onClick={() => setShowCardModal(false)} className="bg-white/5 p-2 rounded-full hover:bg-white/10"><X size={20} /></button>
                                    </div>
                                    <div className="relative w-full aspect-[1.586/1] rounded-3xl p-8 bg-gradient-to-br from-[#1c1c1c] via-[#2a2a2a] to-[#1c1c1c] overflow-hidden shadow-2xl border border-white/10 group mb-8">
                                        <div className="relative z-10 h-full flex flex-col justify-between">
                                            <div className="flex justify-between items-start">
                                                <div className="flex flex-col">
                                                    <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Digital Platinum</span>
                                                    <span className="text-lg font-black text-white italic">BeFin <span className="text-[#0380f5]">Wallet</span></span>
                                                </div>
                                                <div className="w-12 h-10 bg-white/5 rounded-lg border border-white/10 flex items-center justify-center"><div className="w-8 h-6 bg-yellow-500/80 rounded" /></div>
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-[10px] font-black uppercase text-slate-500 tracking-[0.2em]">Card Number</p>
                                                <p className="text-2xl font-bold text-white tracking-[0.15em] font-mono">{cardDetails?.card_number}</p>
                                            </div>
                                            <div className="flex justify-between items-end">
                                                <div className="space-y-0.5"><p className="text-[9px] font-black uppercase text-slate-500">Holder</p><p className="text-sm font-bold uppercase truncate max-w-[150px]">{user?.first_name} {user?.last_name}</p></div>
                                                <div className="flex gap-8">
                                                    <div className="space-y-0.5"><p className="text-[9px] font-black uppercase text-slate-500">Exp</p><p className="text-sm font-bold">{cardDetails?.expiry_date}</p></div>
                                                    <div className="space-y-0.5"><p className="text-[9px] font-black uppercase text-slate-500">CVV</p><p className="text-sm font-bold">{cardDetails?.cvv}</p></div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent" />
                                    </div>
                                    <div className="bg-[#111115] p-5 rounded-2xl border border-white/5 flex gap-4">
                                        <CircleHelp className="w-6 h-6 text-blue-400 shrink-0" />
                                        <p className="text-[11px] text-slate-500 font-medium">Use these details for online payments within the BeFin ecosystem. Keep your CVV private.</p>
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
