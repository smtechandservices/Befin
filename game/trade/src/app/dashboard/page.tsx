'use client';

import React, { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import PortfolioSummary from '@/components/PortfolioSummary';
import Watchlist from '@/components/Watchlist';
import TradingChart from '@/components/TradingChart';
import OrderForm from '@/components/OrderForm';
import { useAuth } from '@/context/AuthProvider';
import { usePortfolio } from '@/context/PortfolioProvider';
import { redirect } from 'next/navigation';

export default function DashboardPage() {
    const { user, isLoading } = useAuth();
    const [selectedSymbol, setSelectedSymbol] = useState('RELIANCE.NS');

    if (isLoading) return <div className="flex-center" style={{ height: '100vh' }}>Loading...</div>;
    if (!user) redirect('/login');
    if (!user.isDematActive) redirect('/onboarding');

    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--background)' }}>
            <Sidebar />
            <main style={{ flex: 1, marginLeft: '240px', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <PortfolioSummary />

                <div style={{ display: 'flex', gap: '1.5rem', flex: 1, minHeight: 0 }}>
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <TradingChart symbol={selectedSymbol} />
                        <div className="card" style={{ flex: 1, padding: '1rem' }}>
                            <div style={{ fontWeight: 600, marginBottom: '1rem' }}>Positions</div>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>No active positions. Start by placing an order.</p>
                        </div>
                    </div>

                    <div style={{ width: '320px', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <OrderForm symbol={selectedSymbol} />
                        <Watchlist onSelect={setSelectedSymbol} />
                    </div>
                </div>
            </main>
        </div>
    );
}
