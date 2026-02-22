'use client';

import React, { useState } from 'react';
import { usePortfolio } from '@/context/PortfolioProvider';
import { useMarketData } from '@/services/MarketDataProvider';

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
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: 'var(--surface)', borderLeft: '1px solid var(--divider)' }}>

            {/* Header / Tabs */}
            <div style={{ display: 'flex', borderBottom: '1px solid var(--divider)' }}>
                <button
                    onClick={() => setSide('BUY')}
                    style={{
                        flex: 1, padding: '1rem', fontWeight: 600, fontSize: '0.875rem',
                        color: side === 'BUY' ? 'white' : 'var(--text-secondary)',
                        background: side === 'BUY' ? 'rgba(63, 185, 80, 0.1)' : 'transparent',
                        borderBottom: side === 'BUY' ? '2px solid var(--up)' : '2px solid transparent',
                        transition: 'all 0.2s'
                    }}
                >
                    Buy {symbol.split('.')[0]}
                </button>
                <button
                    onClick={() => setSide('SELL')}
                    style={{
                        flex: 1, padding: '1rem', fontWeight: 600, fontSize: '0.875rem',
                        color: side === 'SELL' ? 'white' : 'var(--text-secondary)',
                        background: side === 'SELL' ? 'rgba(248, 81, 73, 0.1)' : 'transparent',
                        borderBottom: side === 'SELL' ? '2px solid var(--down)' : '2px solid transparent',
                        transition: 'all 0.2s'
                    }}
                >
                    Sell {symbol.split('.')[0]}
                </button>
            </div>

            <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-end' }}>
                    <span style={{ fontSize: '1.5rem', fontWeight: 700 }}>₹{price.toFixed(2)}</span>
                    <span style={{ fontSize: '0.875rem', color: stock && stock.change >= 0 ? 'var(--up)' : 'var(--down)', paddingBottom: '0.25rem' }}>
                        {stock && stock.change >= 0 ? '+' : ''}{stock?.change?.toFixed(2)} ({stock?.changePercent?.toFixed(2)}%)
                    </span>
                </div>

                {/* Sub-Tabs: Intraday vs Longterm */}
                <div style={{ display: 'flex', gap: '1rem', borderBottom: '1px solid var(--divider)', paddingBottom: '0.5rem' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.875rem' }}>
                        <input type="radio" name="product" defaultChecked style={{ accentColor: side === 'BUY' ? 'var(--up)' : 'var(--down)' }} />
                        Intraday <span style={{ color: 'var(--text-secondary)', fontSize: '0.75rem' }}>MIS</span>
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.875rem' }}>
                        <input type="radio" name="product" style={{ accentColor: side === 'BUY' ? 'var(--up)' : 'var(--down)' }} />
                        Longterm <span style={{ color: 'var(--text-secondary)', fontSize: '0.75rem' }}>CNC</span>
                    </label>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    {/* Quantity */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                        <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Qty</label>
                        <input
                            type="number"
                            min="1"
                            value={quantity}
                            onChange={(e) => setQuantity(e.target.value)}
                            style={{
                                background: 'var(--background)', border: '1px solid var(--border)',
                                color: 'white', padding: '0.6rem', borderRadius: '4px', outline: 'none'
                            }}
                        />
                    </div>
                    {/* Price */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                        <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Price</label>
                        <input
                            type="number"
                            value={type === 'MARKET' ? price.toFixed(2) : price.toFixed(2)}
                            readOnly={type === 'MARKET'}
                            style={{
                                background: type === 'MARKET' ? 'rgba(255,255,255,0.05)' : 'var(--background)', border: '1px solid var(--border)',
                                color: type === 'MARKET' ? 'var(--text-secondary)' : 'white', padding: '0.6rem', borderRadius: '4px', outline: 'none'
                            }}
                        />
                    </div>
                </div>

                {/* Order Type Toggle */}
                <div style={{ display: 'flex', gap: '1rem', marginTop: '-0.5rem' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.875rem' }}>
                        <input type="radio" name="ordertype" checked={type === 'MARKET'} onChange={() => setType('MARKET')} style={{ accentColor: side === 'BUY' ? 'var(--up)' : 'var(--down)' }} />
                        Market
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.875rem' }}>
                        <input type="radio" name="ordertype" checked={type === 'LIMIT'} onChange={() => setType('LIMIT')} style={{ accentColor: side === 'BUY' ? 'var(--up)' : 'var(--down)' }} />
                        Limit
                    </label>
                </div>
            </div>

            {/* Footer */}
            <div style={{ padding: '1rem 1.5rem', background: 'rgba(255,255,255,0.02)', borderTop: '1px solid var(--divider)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Margin Required</span>
                    <span style={{ fontWeight: 600, color: estimatedTotal > balance && side === 'BUY' ? 'var(--error, #f85149)' : 'white' }}>
                        ₹{estimatedTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Available Margin</span>
                    <span style={{ fontWeight: 600 }}>₹{balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>

                <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                    <button
                        onClick={handleExecute}
                        disabled={estimatedTotal > balance && side === 'BUY'}
                        style={{
                            flex: 1, background: side === 'BUY' ? 'var(--up)' : 'var(--down)', color: 'white',
                            padding: '0.875rem', borderRadius: '4px', fontWeight: 700,
                            opacity: (estimatedTotal > balance && side === 'BUY') ? 0.5 : 1, cursor: (estimatedTotal > balance && side === 'BUY') ? 'not-allowed' : 'pointer'
                        }}
                    >
                        {side === 'BUY' ? 'BUY' : 'SELL'}
                    </button>
                </div>
            </div>
        </div>
    );
}
