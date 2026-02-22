'use client';

import React, { useState } from 'react';
import Sidebar from '../../../trade-components/Sidebar';
import PortfolioSummary from '../../../trade-components/PortfolioSummary';
import Watchlist from '../../../trade-components/Watchlist';
import TradingChart from '../../../trade-components/TradingChart';
import OrderForm from '../../../trade-components/OrderForm';
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
        <div style={{ display: 'flex', height: '100vh', background: 'var(--background)', overflow: 'hidden' }}>
            <Sidebar />
            <main style={{ flex: 1, marginLeft: '240px', display: 'flex', flexDirection: 'row', overflow: 'hidden' }}>
                {/* Watchlist Section - fixed width left panel */}
                <div style={{ width: '350px', borderRight: '1px solid var(--divider)', display: 'flex', flexDirection: 'column', background: 'var(--surface)' }}>
                    <Watchlist onSelect={setSelectedSymbol} />
                </div>

                {/* Main Content Area */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflowY: 'auto', padding: '1.5rem', gap: '1.5rem' }}>
                    <PortfolioSummary />

                    <div style={{ display: 'flex', gap: '1.5rem', flex: 1 }}>
                        {/* Chart Area */}
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <TradingChart symbol={selectedSymbol} />

                            {/* Positions preview */}
                            <div className="card" style={{ padding: '1.5rem', flex: 1 }}>
                                <div style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem' }}>Active Positions</div>
                                <div style={{ color: 'var(--text-secondary)' }}>Positions will be displayed here...</div>
                            </div>
                        </div>

                        {/* Order Placement Area */}
                        <div style={{ width: '340px' }}>
                            <OrderForm symbol={selectedSymbol} />
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
