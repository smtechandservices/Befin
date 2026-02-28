'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, Wallet, Target, BookOpen, Clock, User, LogOut, Menu, X } from 'lucide-react';

const NAV_ITEMS = [
    { name: 'Home', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Wallet', href: '/dashboard/wallet', icon: Wallet },
    { name: 'Goal Setter', href: '/dashboard/goals', icon: Target },
    { name: 'Learning', href: '/dashboard/learning', icon: BookOpen },
    { name: 'Profile', href: '/dashboard/profile', icon: User },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        fetch('/api/auth/me')
            .then(res => res.json())
            .then(data => {
                if (data.error) router.push('/login');
                else setUser(data.user);
            })
            .catch(() => router.push('/login'));
    }, [router]);

    const handleLogout = async () => {
        await fetch('/api/auth/logout', { method: 'POST' });
        router.push('/');
    };

    if (!user) return <div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin" /></div>;

    return (
        <div className="min-h-screen bg-background flex">
            {/* Desktop Sidebar */}
            <aside className="hidden md:flex w-64 flex-col bg-[#111111] border-r border-white/5 h-screen sticky top-0 relative">
                {/* Active Indicator Line */}
                <div className="absolute right-0 top-0 bottom-0 w-1 bg-transparent">
                    {NAV_ITEMS.map((item, index) => (
                        pathname.startsWith(item.href) && (
                            <div key={index} className="absolute right-0 w-1 h-12 bg-[#0A66C2] rounded-l-full"
                                style={{ top: `${72 + (index * 56)}px`, transition: 'top 0.3s ease' }} />
                        )
                    ))}
                </div>

                <div className="p-6 flex items-center gap-3 mb-4">
                    <img src="/images/logo.png" alt="Logo" className="w-10 h-10 object-contain" />
                    <span className="text-2xl font-bold tracking-wide text-white">BeFin</span>
                </div>

                <nav className="flex-1 py-6 px-4 space-y-2">
                    {NAV_ITEMS.map(item => {
                        const Icon = item.icon;
                        const isActive = pathname.startsWith(item.href);
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center gap-4 px-6 py-3.5 font-medium transition-all ${isActive ? 'text-[#0A66C2]' : 'text-[#888888] hover:text-white'}`}
                            >
                                <Icon className="w-5 h-5" />
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-white/5">
                    <div className="flex items-center gap-3 mb-4 px-2">
                        <img src={user.avatar} alt="Avatar" className="w-10 h-10 rounded-full bg-black/20" />
                        <div className="flex-1 overflow-hidden">
                            <p className="text-sm font-bold truncate">{user.username}</p>
                            <p className="text-xs text-text-secondary truncate">{user.email}</p>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-4 px-6 py-4 text-[#FF4D4D] hover:bg-white/5 transition-colors font-medium mt-auto"
                    >
                        <LogOut className="w-5 h-5" />
                        Logout
                    </button>
                </div>
            </aside>

            {/* Mobile Header & Content */}
            <div className="flex-1 flex flex-col min-w-0">
                <header className="md:hidden flex items-center justify-between p-4 bg-surface border-b border-white/5 sticky top-0 z-20">
                    <div className="flex items-center gap-2">
                        <img src="/images/logo.png" alt="Logo" className="w-8 h-8 object-contain" />
                        <span className="font-bold">BeFin</span>
                    </div>
                    <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-text-secondary hover:text-white">
                        {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </header>

                {/* Mobile Menu */}
                {isMobileMenuOpen && (
                    <div className="md:hidden fixed inset-0 top-[73px] bg-surface z-10 p-4 border-b border-white/5">
                        <nav className="space-y-2">
                            {NAV_ITEMS.map(item => {
                                const Icon = item.icon;
                                const isActive = pathname.startsWith(item.href);
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className={`flex items-center gap-3 px-4 py-4 rounded-xl font-medium ${isActive ? 'bg-accent/10 text-accent' : 'text-text-secondary'}`}
                                    >
                                        <Icon className="w-5 h-5" />
                                        {item.name}
                                    </Link>
                                );
                            })}
                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center gap-3 px-4 py-4 rounded-xl text-text-secondary hover:text-error hover:bg-error/10 text-left font-medium mt-4"
                            >
                                <LogOut className="w-5 h-5" />
                                Log Out
                            </button>
                        </nav>
                    </div>
                )}

                <main className="flex-1 p-4 md:p-8 overflow-y-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}
