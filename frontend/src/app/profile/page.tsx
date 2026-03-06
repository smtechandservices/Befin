'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import { authService, walletService } from '@/lib/api';
import LoadingScreen from '@/components/LoadingScreen';
import {
    User, Mail, Phone, Calendar, Edit3, Check, X,
    ShieldCheck, Coins, ArrowDownLeft, ArrowUpRight, Copy, Eye, EyeOff, Lock, Menu
} from 'lucide-react';

export default function ProfilePage() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [wallet, setWallet] = useState<any>(null);
    const [transactions, setTransactions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showReferral, setShowReferral] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // Edit mode
    const [editing, setEditing] = useState(false);
    const [saving, setSaving] = useState(false);
    const [saveError, setSaveError] = useState('');
    const [saveSuccess, setSaveSuccess] = useState(false);
    const [form, setForm] = useState({
        first_name: '',
        last_name: '',
        email: '',
        phone_number: '',
        dob: '',
    });

    const [copiedReferral, setCopiedReferral] = useState(false);

    // Password mode
    const [changingPassword, setChangingPassword] = useState(false);
    const [passwordSaving, setPasswordSaving] = useState(false);
    const [passwordError, setPasswordError] = useState('');
    const [passwordSuccess, setPasswordSuccess] = useState(false);
    const [passwordForm, setPasswordForm] = useState({
        old_password: '',
        new_password: '',
        confirm_password: '',
    });

    // Toggle password visibility
    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [profileData, walletData, txData] = await Promise.all([
                    authService.getProfile(),
                    walletService.getBalance(),
                    walletService.getTransactions(),
                    new Promise(resolve => setTimeout(resolve, 500))
                ]);
                setUser(profileData);
                setWallet(walletData);
                setTransactions(Array.isArray(txData) ? txData : []);
                setForm({
                    first_name: profileData.first_name || '',
                    last_name: profileData.last_name || '',
                    email: profileData.email || '',
                    phone_number: profileData.phone_number || '',
                    dob: profileData.dob || '',
                });
            } catch {
                router.push('/login');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [router]);

    const handleSave = async () => {
        setSaving(true);
        setSaveError('');
        try {
            const updated = await authService.updateProfile(form);
            setUser(updated);
            setEditing(false);
            setSaveSuccess(true);
            setTimeout(() => setSaveSuccess(false), 3000);
        } catch (e: any) {
            setSaveError(e.response?.data ? Object.values(e.response.data).flat().join(' ') : 'Failed to save.');
        } finally {
            setSaving(false);
        }
    };

    const handleCancel = () => {
        setForm({
            first_name: user.first_name || '',
            last_name: user.last_name || '',
            email: user.email || '',
            phone_number: user.phone_number || '',
            dob: user.dob || '',
        });
        setSaveError('');
        setEditing(false);
    };

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setPasswordError('');
        setPasswordSuccess(false);

        if (passwordForm.new_password !== passwordForm.confirm_password) {
            setPasswordError('New passwords do not match.');
            return;
        }

        if (passwordForm.new_password.length < 8) {
            setPasswordError('Password must be at least 8 characters long.');
            return;
        }

        setPasswordSaving(true);
        try {
            await authService.changePassword({
                old_password: passwordForm.old_password,
                new_password: passwordForm.new_password
            });
            setPasswordSuccess(true);
            setPasswordForm({ old_password: '', new_password: '', confirm_password: '' });
            setTimeout(() => {
                setPasswordSuccess(false);
                setChangingPassword(false);
            }, 3000);
        } catch (e: any) {
            if (e.response?.data?.old_password) {
                setPasswordError(e.response.data.old_password[0]);
            } else {
                setPasswordError(e.response?.data ? Object.values(e.response.data).flat().join(' ') : 'Failed to change password.');
            }
        } finally {
            setPasswordSaving(false);
        }
    };

    const copyReferral = () => {
        if (user?.referral_code) {
            navigator.clipboard.writeText(user.referral_code);
            setCopiedReferral(true);
            setTimeout(() => setCopiedReferral(false), 2000);
        }
    };

    if (loading) {
        return <LoadingScreen />;
    }

    const totalIncome = transactions
        .filter(tx => ['reward', 'deposit'].includes(tx.transaction_type.toLowerCase()))
        .reduce((sum, tx) => sum + parseFloat(tx.amount), 0);

    const totalSpent = transactions
        .filter(tx => !['reward', 'deposit'].includes(tx.transaction_type.toLowerCase()))
        .reduce((sum, tx) => sum + parseFloat(tx.amount), 0);

    const displayName = [user?.first_name, user?.last_name].filter(Boolean).join(' ') || user?.username || 'BeFin User';

    const getAge = (dob: string | null) => {
        if (!dob) return null;
        const birth = new Date(dob);
        const today = new Date();
        let age = today.getFullYear() - birth.getFullYear();
        const m = today.getMonth() - birth.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
        return age;
    };
    const age = getAge(user?.dob);

    const fields = [
        { label: 'First Name', key: 'first_name', icon: User, type: 'text', placeholder: 'First name' },
        { label: 'Last Name', key: 'last_name', icon: User, type: 'text', placeholder: 'Last name' },
        { label: 'Phone', key: 'phone_number', icon: Phone, type: 'tel', placeholder: 'Phone number' },
        { label: 'Date of Birth', key: 'dob', icon: Calendar, type: 'date', placeholder: '' },
    ];

    return (
        <div className="flex h-screen bg-[#0a0a0b] text-slate-200 overflow-hidden">
            <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

            <main className="flex-1 flex flex-col h-full overflow-hidden">
                {/* Header */}
                <header className="px-6 md:px-10 py-6 md:py-8 shrink-0 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl md:text-[2.5rem] font-black tracking-tight text-white leading-tight">Profile</h1>
                        <p className="text-slate-400 font-semibold text-[10px] md:text-sm tracking-wide opacity-80 uppercase italic">Account details</p>
                    </div>
                    {/* Mobile Toggle */}
                    <button
                        onClick={() => setIsSidebarOpen(true)}
                        className="md:hidden p-2 text-white bg-white/5 rounded-xl border border-white/10"
                    >
                        <Menu size={24} />
                    </button>
                </header>

                <div className="flex-1 overflow-y-auto px-6 md:px-10 pb-10 no-scrollbar">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 max-w-[1400px] mx-auto">

                        {/* LEFT: Avatar + Stats */}
                        <div className="lg:col-span-12 xl:col-span-4 flex flex-col gap-6">

                            {/* Avatar card */}
                            <div className="bg-[#111111] rounded-[2rem] p-7 border border-white/5 flex flex-col items-center gap-4">
                                <div className="flex items-center gap-2 px-4 py-2 bg-green-500/10 border border-green-500/20 rounded-full">
                                    <ShieldCheck className="w-4 h-4 text-green-400" />
                                    <span className="text-xs font-bold text-green-400 uppercase tracking-wider">Verified Account</span>
                                </div>
                                <div className="text-center">
                                    <p className="text-2xl font-black text-white mb-2">{displayName}</p>
                                    <p className="text-sm text-slate-500 font-semibold mt-0.5">@{user?.username}</p>
                                    {age !== null && (
                                        <p className="text-xs text-slate-600 font-bold mt-2">{age} years old</p>
                                    )}
                                </div>
                                <p className="text-[11px] text-slate-600 font-semibold">
                                    Member since {user?.created_at ? new Date(user.created_at).toLocaleDateString(undefined, { month: 'long', year: 'numeric' }) : '—'}
                                </p>
                            </div>

                            {/* Referral Code */}
                            {user?.referral_code && (
                                <div className="bg-[#111111] rounded-[2rem] p-7 border border-white/5 flex flex-col gap-3">
                                    <h3 className="text-slate-400 font-bold text-xs uppercase tracking-widest">Referral Code</h3>
                                    <div className="flex items-center gap-3">
                                        <div className="flex-1 bg-[#181818] border border-white/10 rounded-lg px-4 py-3 text-center flex items-center justify-center gap-3">
                                            <span className="text-lg font-black text-white tracking-[0.12em] font-mono">
                                                {showReferral ? user.referral_code : '••••••••'}
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
                                            onClick={copyReferral}
                                            className={`p-3 rounded-xl border transition-all ${copiedReferral ? 'bg-green-500/10 border-green-500/30 text-green-400' : 'bg-white/5 border-white/5 text-slate-400 hover:text-white hover:bg-white/10'}`}
                                            title="Copy referral code"
                                        >
                                            {copiedReferral ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                        </button>
                                    </div>
                                    <p className="text-[10px] text-slate-600 font-semibold">Share to earn 100 BeFin Coins per referral</p>
                                </div>
                            )}

                            {/* Stats */}
                            <div className="bg-[#111111] rounded-[2rem] p-7 border border-white/5 flex flex-col gap-4">
                                <h3 className="text-slate-400 font-bold text-xs uppercase tracking-widest">Wallet Stats</h3>
                                <div className="flex flex-col gap-3">
                                    <div className="flex items-center justify-between p-4 bg-[#181818] rounded-2xl border border-white/5">
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-xl bg-yellow-500/10 flex items-center justify-center">
                                                <Coins className="w-4 h-4 text-yellow-400" />
                                            </div>
                                            <span className="text-sm font-bold text-slate-300">Balance</span>
                                        </div>
                                        <span className="text-sm font-black text-white">
                                            {wallet?.balance ? parseFloat(wallet.balance).toLocaleString('en-IN', { minimumFractionDigits: 2 }) : '—'} <span className="text-slate-500 text-xs">BFC</span>
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between p-4 bg-[#181818] rounded-2xl border border-white/5">
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-xl bg-blue-500/10 flex items-center justify-center">
                                                <ArrowDownLeft className="w-4 h-4 text-blue-400" />
                                            </div>
                                            <span className="text-sm font-bold text-slate-300">Total Earned</span>
                                        </div>
                                        <span className="text-sm font-black text-blue-400">+{totalIncome.toLocaleString()}</span>
                                    </div>
                                    <div className="flex items-center justify-between p-4 bg-[#181818] rounded-2xl border border-white/5">
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-xl bg-slate-500/10 flex items-center justify-center">
                                                <ArrowUpRight className="w-4 h-4 text-slate-400" />
                                            </div>
                                            <span className="text-sm font-bold text-slate-300">Total Spent</span>
                                        </div>
                                        <span className="text-sm font-black text-slate-300">-{totalSpent.toLocaleString()}</span>
                                    </div>
                                    <div className="flex items-center justify-between p-4 bg-[#181818] rounded-2xl border border-white/5">
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-xl bg-purple-500/10 flex items-center justify-center">
                                                <ArrowUpRight className="w-4 h-4 text-purple-400" />
                                            </div>
                                            <span className="text-sm font-bold text-slate-300">Transactions</span>
                                        </div>
                                        <span className="text-sm font-black text-white">{transactions.length}</span>
                                    </div>
                                </div>
                            </div>

                        </div>

                        {/* RIGHT: Edit Profile */}
                        <div className="lg:col-span-12 xl:col-span-8 flex flex-col gap-6">
                            <div className="bg-[#111111] rounded-[2rem] p-7 border border-white/5 flex flex-col gap-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h2 className="text-lg font-black text-white">Personal Information</h2>
                                        <p className="text-xs text-slate-500 font-semibold mt-0.5">Your details stored on BeFin</p>
                                    </div>
                                    {!editing ? (
                                        <button
                                            onClick={() => setEditing(true)}
                                            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-black rounded-xl transition-all shadow-lg shadow-blue-500/20"
                                        >
                                            <Edit3 className="w-4 h-4" /> Edit
                                        </button>
                                    ) : (
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={handleCancel}
                                                disabled={saving}
                                                className="flex items-center gap-2 px-4 py-2.5 bg-white/5 hover:bg-white/10 text-slate-300 text-sm font-bold rounded-xl transition-all border border-white/5"
                                            >
                                                <X className="w-4 h-4" /> Cancel
                                            </button>
                                            <button
                                                onClick={handleSave}
                                                disabled={saving}
                                                className="flex items-center gap-2 px-5 py-2.5 bg-green-600 hover:bg-green-500 text-white text-sm font-black rounded-xl transition-all shadow-lg shadow-green-500/20 disabled:opacity-50"
                                            >
                                                {saving ? (
                                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                ) : (
                                                    <Check className="w-4 h-4" />
                                                )}
                                                Save
                                            </button>
                                        </div>
                                    )}
                                </div>

                                {saveSuccess && (
                                    <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-2xl text-green-400 text-sm font-bold flex items-center gap-2">
                                        <Check className="w-4 h-4" /> Profile updated successfully!
                                    </div>
                                )}
                                {saveError && (
                                    <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-sm font-bold">
                                        {saveError}
                                    </div>
                                )}

                                {/* Password Change Section */}
                                <div className="border-t border-white/5 pt-4 px-2">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h3 className="text-md font-bold text-white flex items-center gap-2">
                                                <Lock className="w-4 h-4 text-slate-400" /> Security
                                            </h3>
                                        </div>
                                        {!changingPassword && (
                                            <button
                                                onClick={() => setChangingPassword(true)}
                                                className="px-4 py-2 text-xs font-bold text-slate-300 bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl transition-all"
                                            >
                                                Change Password
                                            </button>
                                        )}
                                    </div>

                                    {passwordSuccess && (
                                        <div className="p-4 mb-4 bg-green-500/10 border border-green-500/20 rounded-2xl text-green-400 text-sm font-bold flex items-center gap-2 mt-2">
                                            <Check className="w-4 h-4" /> Password changed successfully!
                                        </div>
                                    )}

                                    {passwordError && (
                                        <div className="p-4 mb-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-sm font-bold mt-2">
                                            {passwordError}
                                        </div>
                                    )}

                                    {changingPassword && (
                                        <form onSubmit={handleChangePassword} className="bg-[#181818] p-5 rounded-2xl border border-white/5 flex flex-col gap-4 mt-4">
                                            <div className="flex flex-col gap-1.5">
                                                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">Current Password</label>
                                                <div className="relative">
                                                    <input
                                                        type={showOldPassword ? "text" : "password"}
                                                        value={passwordForm.old_password}
                                                        onChange={e => setPasswordForm(f => ({ ...f, old_password: e.target.value }))}
                                                        required
                                                        className="w-full bg-[#111111] border border-white/10 rounded-xl py-3 px-4 pr-10 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all font-semibold text-sm"
                                                        placeholder="Enter current password"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => setShowOldPassword(!showOldPassword)}
                                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors p-1"
                                                    >
                                                        {showOldPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="flex flex-col gap-1.5">
                                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">New Password</label>
                                                    <div className="relative">
                                                        <input
                                                            type={showNewPassword ? "text" : "password"}
                                                            value={passwordForm.new_password}
                                                            onChange={e => setPasswordForm(f => ({ ...f, new_password: e.target.value }))}
                                                            required
                                                            className="w-full bg-[#111111] border border-white/10 rounded-xl py-3 px-4 pr-10 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all font-semibold text-sm"
                                                            placeholder="New password"
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() => setShowNewPassword(!showNewPassword)}
                                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors p-1"
                                                        >
                                                            {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                                        </button>
                                                    </div>
                                                </div>
                                                <div className="flex flex-col gap-1.5">
                                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">Confirm Password</label>
                                                    <div className="relative">
                                                        <input
                                                            type={showConfirmPassword ? "text" : "password"}
                                                            value={passwordForm.confirm_password}
                                                            onChange={e => setPasswordForm(f => ({ ...f, confirm_password: e.target.value }))}
                                                            required
                                                            className="w-full bg-[#111111] border border-white/10 rounded-xl py-3 px-4 pr-10 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all font-semibold text-sm"
                                                            placeholder="Confirm new password"
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors p-1"
                                                        >
                                                            {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex justify-end gap-2 mt-2">
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setChangingPassword(false);
                                                        setPasswordError('');
                                                        setPasswordForm({ old_password: '', new_password: '', confirm_password: '' });
                                                    }}
                                                    className="px-4 py-2 text-sm font-bold text-slate-400 hover:text-white transition-colors"
                                                >
                                                    Cancel
                                                </button>
                                                <button
                                                    type="submit"
                                                    disabled={passwordSaving}
                                                    className="flex items-center gap-2 px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold rounded-xl transition-all shadow-lg shadow-blue-500/20 disabled:opacity-50"
                                                >
                                                    {passwordSaving ? (
                                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                    ) : (
                                                        'Update Password'
                                                    )}
                                                </button>
                                            </div>
                                        </form>
                                    )}
                                </div>

                                {/* Username + Email (read-only) */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1 flex items-center gap-1.5">
                                            <User className="w-3 h-3" /> Username
                                        </label>
                                        <div className="w-full bg-[#0d0d0d] border border-white/5 rounded-2xl py-4 px-5 text-slate-500 font-bold">
                                            <span>@{user?.username}</span>
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1 flex items-center gap-1.5">
                                            <Mail className="w-3 h-3" /> Email
                                        </label>
                                        <div className="w-full bg-[#0d0d0d] border border-white/5 rounded-2xl py-4 px-5 text-slate-500 font-bold">
                                            <span>{user?.email}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Editable fields */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {fields.map(({ label, key, icon: Icon, type, placeholder }) => (
                                        <div key={key} className="flex flex-col gap-1.5">
                                            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1 flex items-center gap-1.5">
                                                <Icon className="w-3 h-3" /> {label}
                                            </label>
                                            {editing ? (
                                                <input
                                                    type={type}
                                                    value={(form as any)[key]}
                                                    onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                                                    placeholder={placeholder}
                                                    className="w-full bg-[#181818] border border-white/10 rounded-2xl py-4 px-5 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/40 transition-all font-semibold text-sm"
                                                />
                                            ) : (
                                                <div className="w-full bg-[#181818] border border-white/5 rounded-2xl py-4 px-5 text-sm font-semibold text-white">
                                                    {(user as any)?.[key] || <span className="text-slate-600 italic">Not set</span>}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Recent Transactions */}
                            <div className="bg-[#111111] rounded-[2rem] p-7 border border-white/5 flex flex-col gap-4">
                                <h2 className="text-lg font-black text-white">Recent Activity</h2>
                                <div className="flex flex-col gap-1 max-h-[280px] overflow-y-auto no-scrollbar">
                                    {transactions.length === 0 ? (
                                        <p className="text-slate-600 text-sm italic text-center py-6">No transactions yet.</p>
                                    ) : (
                                        transactions.slice(0, 10).map((tx: any) => {
                                            const isDeposit = ['reward', 'deposit'].includes(tx.transaction_type.toLowerCase());
                                            return (
                                                <div key={tx.id} className="flex items-center justify-between px-3 py-3.5 rounded-2xl hover:bg-white/[0.02] transition-colors border border-transparent hover:border-white/5">
                                                    <div className="flex items-center gap-4">
                                                        <div className={`w-9 h-9 rounded-2xl flex items-center justify-center ${isDeposit ? 'bg-blue-500/10' : 'bg-slate-500/10'}`}>
                                                            {isDeposit
                                                                ? <ArrowDownLeft className="w-4 h-4 text-blue-400" />
                                                                : <ArrowUpRight className="w-4 h-4 text-slate-400" />}
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-bold text-white">{tx.description || tx.transaction_type}</p>
                                                            <p className="text-[11px] text-slate-600 font-semibold uppercase tracking-wider">
                                                                {new Date(tx.timestamp).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })} • {new Date(tx.timestamp).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <span className={`text-sm font-black ${isDeposit ? 'text-blue-400' : 'text-slate-300'}`}>
                                                        {isDeposit ? '+' : '-'}{parseFloat(tx.amount).toLocaleString()}
                                                    </span>
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
        </div>
    );
}
