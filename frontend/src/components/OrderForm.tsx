'use client';

import React, { useState } from 'react';
import { usePortfolio } from '../context/PortfolioProvider';
import { useMarketData } from '../services/MarketDataProvider';

export default function OrderForm({ symbol }: { symbol: string }) {
    const { stocks } = useMarketData();
    const { buyStock, sellStock, balance } = usePortfolio();

    const [side, setSide] = useState<'BUY' | 'SELL'>('BUY');
    const [quantity, setQuantity] = useState('1');
    const [type, setType] = useState('MARKET');

    const stock = stocks.find((s) => s.symbol === symbol);
    const price = stock?.price || 0;
    const qty = parseFloat(quantity) || 0;
    const estimatedTotal = qty * price;

    const handleExecute = () => {
        if (side === 'BUY') {
            buyStock(symbol, qty, price);
        } else {
            sellStock(symbol, qty, price);
        }
    };

    return (
        <div className="card" style={{ padding: '1.5rem', width: '320px', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'flex', background: 'var(--divider)', borderRadius: '6px', padding: '0.25rem' }}>
                <button
                    onClick={() => setSide('BUY')}
                    style={{
                        flex: 1,
                        padding: '0.5rem',
                        borderRadius: '4px',
                        background: side === 'BUY' ? 'var(--up)' : 'transparent',
                        color: 'white',
                        fontWeight: 600
                    }}
                >
                    Buy
                </button>
                <button
                    onClick={() => setSide('SELL')}
                    style={{
                        flex: 1,
                        padding: '0.5rem',
                        borderRadius: '4px',
                        background: side === 'SELL' ? 'var(--down)' : 'transparent',
                        color: 'white',
                        fontWeight: 600
                    }}
                >
                    Sell
                </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Order Type</label>
                    <select
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                        style={{
                            background: 'var(--background)',
                            border: '1px solid var(--border)',
                            color: 'white',
                            padding: '0.6rem',
                            borderRadius: '6px',
                            outline: 'none'
                        }}
                    >
                        <option>MARKET</option>
                        <option>LIMIT</option>
                    </select>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Quantity</label>
                    <input
                        type="number"
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                        style={{
                            background: 'var(--background)',
                            border: '1px solid var(--border)',
                            color: 'white',
                            padding: '0.6rem',
                            borderRadius: '6px',
                            outline: 'none'
                        }}
                    />
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Estimated Total</span>
                    <span style={{ fontWeight: 700 }}>₹{estimatedTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                </div>
            </div>

            <button
                onClick={handleExecute}
                style={{
                    background: side === 'BUY' ? 'var(--up)' : 'var(--down)',
                    color: 'white',
                    padding: '0.75rem',
                    borderRadius: '6px',
                    fontWeight: 700,
                    marginTop: 'auto'
                }}
                onMouseOver={(e) => e.currentTarget.style.filter = 'brightness(1.1)'}
                onMouseOut={(e) => e.currentTarget.style.filter = 'brightness(1)'}
            >
                Place {side === 'BUY' ? 'Buy' : 'Sell'} Order
            </button>

            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textAlign: 'center' }}>
                Buying Power: <span style={{ color: 'white' }}>₹{balance.toLocaleString()}</span>
            </div>
        </div>
    );
}
