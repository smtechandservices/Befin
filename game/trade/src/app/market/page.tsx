'use client';

import React from 'react';
import Sidebar from '@/components/Sidebar';
import { useMarketData } from '@/services/MarketDataProvider';
import { TrendingUp, TrendingDown, Search } from 'lucide-react';

export default function MarketPage() {
    const { stocks } = useMarketData();

    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--background)' }}>
            <Sidebar />
            <main style={{ flex: 1, marginLeft: '240px', padding: '1.5rem' }}>
                <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h1 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Market Overview</h1>
                        <p style={{ color: 'var(--text-secondary)' }}>Live updates from major global indices</p>
                    </div>
                    <div style={{ position: 'relative' }}>
                        <Search style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} size={18} />
                        <input
                            type="text"
                            placeholder="Search stocks..."
                            style={{
                                background: 'var(--surface)',
                                border: '1px solid var(--border)',
                                borderRadius: '8px',
                                padding: '0.75rem 1rem 0.75rem 2.5rem',
                                color: 'white',
                                width: '300px',
                                outline: 'none'
                            }}
                        />
                    </div>
                </div>

                <div className="card" style={{ overflow: 'hidden' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ background: 'var(--divider)', borderBottom: '1px solid var(--border)' }}>
                                <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>SYMBOL</th>
                                <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>NAME</th>
                                <th style={{ padding: '1rem', textAlign: 'right', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>PRICE</th>
                                <th style={{ padding: '1rem', textAlign: 'right', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>CHANGE</th>
                                <th style={{ padding: '1rem', textAlign: 'right', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>% CHANGE</th>
                                <th style={{ padding: '1rem', textAlign: 'right', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>MARKET CAP</th>
                            </tr>
                        </thead>
                        <tbody>
                            {stocks.map((stock) => (
                                <tr
                                    key={stock.symbol}
                                    style={{ borderBottom: '1px solid var(--divider)', cursor: 'pointer' }}
                                    onMouseOver={(e) => (e.currentTarget.style.background = 'var(--surface-hover)')}
                                    onMouseOut={(e) => (e.currentTarget.style.background = 'transparent')}
                                >
                                    <td style={{ padding: '1rem', fontWeight: 600 }}>{stock.symbol}</td>
                                    <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>{stock.name}</td>
                                    <td style={{ padding: '1rem', textAlign: 'right', fontWeight: 600 }}>${stock.price.toLocaleString()}</td>
                                    <td style={{ padding: '1rem', textAlign: 'right', color: stock.change >= 0 ? 'var(--up)' : 'var(--down)' }}>
                                        {stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)}
                                    </td>
                                    <td style={{ padding: '1rem', textAlign: 'right' }}>
                                        <span style={{
                                            padding: '0.25rem 0.5rem',
                                            borderRadius: '4px',
                                            background: stock.change >= 0 ? 'rgba(63,185,80,0.1)' : 'rgba(248,81,73,0.1)',
                                            color: stock.change >= 0 ? 'var(--up)' : 'var(--down)',
                                            fontWeight: 600,
                                            fontSize: '0.875rem'
                                        }}>
                                            {stock.change >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%
                                        </span>
                                    </td>
                                    <td style={{ padding: '1rem', textAlign: 'right', color: 'var(--text-secondary)' }}>
                                        ${(stock.marketCap / 1e12).toFixed(2)}T
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </main>
        </div>
    );
}
