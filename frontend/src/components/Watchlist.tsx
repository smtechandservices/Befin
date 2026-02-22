'use client';

import React from 'react';
import { useMarketData } from '../services/MarketDataProvider';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { Stock } from '../types';

export default function Watchlist({ onSelect }: { onSelect: (symbol: string) => void }) {
    const { stocks } = useMarketData();

    return (
        <div className="card" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '1rem', borderBottom: '1px solid var(--divider)', fontWeight: 600 }}>Watchlist</div>
            <div style={{ flex: 1, overflowY: 'auto' }}>
                {stocks.map((stock: Stock) => (
                    <button
                        key={stock.symbol}
                        onClick={() => onSelect(stock.symbol)}
                        style={{
                            width: '100%',
                            padding: '0.75rem 1rem',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            borderBottom: '1px solid var(--divider)',
                            transition: 'background 0.2s ease',
                        }}
                        onMouseOver={(e) => (e.currentTarget.style.background = 'var(--surface-hover)')}
                        onMouseOut={(e) => (e.currentTarget.style.background = 'transparent')}
                    >
                        <div style={{ textAlign: 'left' }}>
                            <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{stock.symbol}</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{stock.name}</div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>₹{stock.price.toFixed(2)}</div>
                            <div
                                style={{
                                    fontSize: '0.75rem',
                                    color: stock.change >= 0 ? 'var(--up)' : 'var(--down)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'flex-end',
                                    gap: '2px'
                                }}
                            >
                                {stock.change >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                                {stock.changePercent.toFixed(2)}%
                            </div>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
}
