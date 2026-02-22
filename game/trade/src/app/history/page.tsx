'use client';

import React from 'react';
import Sidebar from '@/components/Sidebar';
import { useAuth } from '@/context/AuthProvider';
import { usePortfolio } from '@/context/PortfolioProvider';
import { redirect } from 'next/navigation';

export default function HistoryPage() {
    const { user, isLoading } = useAuth();
    const { history } = usePortfolio();

    if (isLoading) return <div className="flex-center" style={{ height: '100vh' }}>Loading...</div>;
    if (!user) redirect('/login');
    if (!user.isDematActive) redirect('/onboarding');

    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--background)' }}>
            <Sidebar />
            <main style={{ flex: 1, marginLeft: '240px', padding: '2rem', maxWidth: '1000px' }}>
                <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '2rem' }}>Trade History</h1>

                <div className="card" style={{ padding: '1.5rem' }}>
                    {history.length === 0 ? (
                        <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '2rem 0' }}>
                            You haven't made any trades yet. Head to the dashboard to place your first order!
                        </p>
                    ) : (
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid var(--border)', color: 'var(--text-secondary)', textAlign: 'left', fontSize: '0.875rem' }}>
                                    <th style={{ padding: '1rem 0', fontWeight: 500 }}>Time</th>
                                    <th style={{ padding: '1rem 0', fontWeight: 500 }}>Symbol</th>
                                    <th style={{ padding: '1rem 0', fontWeight: 500 }}>Action</th>
                                    <th style={{ padding: '1rem 0', fontWeight: 500, textAlign: 'right' }}>Qty</th>
                                    <th style={{ padding: '1rem 0', fontWeight: 500, textAlign: 'right' }}>Price</th>
                                    <th style={{ padding: '1rem 0', fontWeight: 500, textAlign: 'right' }}>Total Value</th>
                                </tr>
                            </thead>
                            <tbody>
                                {history.map((trade) => (
                                    <tr key={trade.id} style={{ borderBottom: '1px solid var(--divider)', transition: 'background 0.2s', cursor: 'pointer' }}>
                                        <td style={{ padding: '1rem 0', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                                            {new Date(trade.timestamp).toLocaleString(undefined, {
                                                year: 'numeric', month: 'short', day: 'numeric',
                                                hour: '2-digit', minute: '2-digit'
                                            })}
                                        </td>
                                        <td style={{ padding: '1rem 0', fontWeight: 600 }}>{trade.symbol}</td>
                                        <td style={{ padding: '1rem 0' }}>
                                            <span style={{
                                                padding: '0.25rem 0.5rem',
                                                borderRadius: '4px',
                                                fontSize: '0.75rem',
                                                fontWeight: 700,
                                                background: trade.type === 'BUY' ? 'rgba(63, 185, 80, 0.1)' : 'rgba(248, 81, 73, 0.1)',
                                                color: trade.type === 'BUY' ? 'var(--up)' : 'var(--down)'
                                            }}>
                                                {trade.type}
                                            </span>
                                        </td>
                                        <td style={{ padding: '1rem 0', textAlign: 'right', fontWeight: 500 }}>{trade.quantity}</td>
                                        <td style={{ padding: '1rem 0', textAlign: 'right' }}>₹{trade.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                                        <td style={{ padding: '1rem 0', textAlign: 'right', fontWeight: 600 }}>
                                            ₹{(trade.quantity * trade.price).toLocaleString(undefined, { minimumFractionDigits: 2 })}
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
