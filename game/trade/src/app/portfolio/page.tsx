'use client';

import React from 'react';
import Sidebar from '@/components/Sidebar';
import { useAuth } from '@/context/AuthProvider';
import { usePortfolio } from '@/context/PortfolioProvider';
import { useMarketData } from '@/services/MarketDataProvider';
import { redirect } from 'next/navigation';

export default function PortfolioPage() {
    const { user, isLoading } = useAuth();
    const { balance, positions } = usePortfolio();
    const { stocks } = useMarketData();

    if (isLoading) return <div className="flex-center" style={{ height: '100vh' }}>Loading...</div>;
    if (!user) redirect('/login');
    if (!user.isDematActive) redirect('/onboarding');

    // Calculate current market values
    const enrichedPositions = positions.map(pos => {
        const stockData = stocks.find(s => s.symbol === pos.symbol);
        const currentPrice = stockData ? stockData.price : pos.currentPrice;
        const currentValue = pos.quantity * currentPrice;
        const costBasis = pos.quantity * pos.averagePrice;
        const pl = currentValue - costBasis;
        const plPercent = costBasis > 0 ? (pl / costBasis) * 100 : 0;

        return {
            ...pos,
            currentPrice,
            currentValue,
            costBasis,
            pl,
            plPercent,
            name: stockData ? stockData.name : pos.symbol
        };
    });

    const totalEquity = balance + enrichedPositions.reduce((sum, p) => sum + p.currentValue, 0);

    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--background)' }}>
            <Sidebar />
            <main style={{ flex: 1, marginLeft: '240px', padding: '2rem', maxWidth: '1200px' }}>
                <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '2rem' }}>My Portfolio</h1>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '2rem' }}>
                    <div className="card" style={{ padding: '1.5rem' }}>
                        <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '0.5rem' }}>Total Equity</div>
                        <div style={{ fontSize: '2rem', fontWeight: 700 }}>₹{totalEquity.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                    </div>
                    <div className="card" style={{ padding: '1.5rem' }}>
                        <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '0.5rem' }}>Available BeCoins</div>
                        <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--gold, #FFD700)' }}>₹{balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                    </div>
                    <div className="card" style={{ padding: '1.5rem' }}>
                        <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '0.5rem' }}>Total Return</div>
                        {(() => {
                            const totalReturn = enrichedPositions.reduce((sum, p) => sum + p.pl, 0);
                            return (
                                <div style={{ fontSize: '2rem', fontWeight: 700, color: totalReturn >= 0 ? 'var(--up)' : 'var(--down)' }}>
                                    {totalReturn >= 0 ? '+' : ''}₹{totalReturn.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </div>
                            );
                        })()}
                    </div>
                </div>

                <div className="card" style={{ padding: '1.5rem' }}>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1.5rem' }}>Open Positions</h2>

                    {enrichedPositions.length === 0 ? (
                        <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '2rem 0' }}>
                            You don't have any open positions right now. Head to the dashboard to place an order.
                        </p>
                    ) : (
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid var(--border)', color: 'var(--text-secondary)', textAlign: 'left', fontSize: '0.875rem' }}>
                                    <th style={{ padding: '1rem 0', fontWeight: 500 }}>Symbol</th>
                                    <th style={{ padding: '1rem 0', fontWeight: 500, textAlign: 'right' }}>Qty</th>
                                    <th style={{ padding: '1rem 0', fontWeight: 500, textAlign: 'right' }}>Avg Price</th>
                                    <th style={{ padding: '1rem 0', fontWeight: 500, textAlign: 'right' }}>Current Price</th>
                                    <th style={{ padding: '1rem 0', fontWeight: 500, textAlign: 'right' }}>Market Value</th>
                                    <th style={{ padding: '1rem 0', fontWeight: 500, textAlign: 'right' }}>Total Return</th>
                                </tr>
                            </thead>
                            <tbody>
                                {enrichedPositions.map((pos) => (
                                    <tr key={pos.symbol} style={{ borderBottom: '1px solid var(--divider)', transition: 'background 0.2s', cursor: 'pointer' }}>
                                        <td style={{ padding: '1rem 0' }}>
                                            <div style={{ fontWeight: 600 }}>{pos.symbol}</div>
                                            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{pos.name}</div>
                                        </td>
                                        <td style={{ padding: '1rem 0', textAlign: 'right', fontWeight: 500 }}>{pos.quantity}</td>
                                        <td style={{ padding: '1rem 0', textAlign: 'right' }}>₹{pos.averagePrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                                        <td style={{ padding: '1rem 0', textAlign: 'right' }}>₹{pos.currentPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                                        <td style={{ padding: '1rem 0', textAlign: 'right', fontWeight: 600 }}>₹{pos.currentValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                                        <td style={{ padding: '1rem 0', textAlign: 'right', fontWeight: 600, color: pos.pl >= 0 ? 'var(--up)' : 'var(--down)' }}>
                                            <div>{pos.pl >= 0 ? '+' : ''}₹{pos.pl.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                                            <div style={{ fontSize: '0.75rem' }}>{pos.pl >= 0 ? '+' : ''}{pos.plPercent.toFixed(2)}%</div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </main>
        </div>
    );
}
