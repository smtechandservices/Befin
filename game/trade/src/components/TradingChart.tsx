'use client';

import React, { useEffect, useRef } from 'react';
import { createChart, ColorType, CandlestickSeries } from 'lightweight-charts';

export default function TradingChart({ symbol }: { symbol: string }) {
    const chartContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!chartContainerRef.current) return;

        const chart = createChart(chartContainerRef.current, {
            layout: {
                background: { type: ColorType.Solid, color: '#161b22' },
                textColor: '#d1d4dc',
            },
            grid: {
                vertLines: { color: 'rgba(48, 54, 61, 0.5)' },
                horzLines: { color: 'rgba(48, 54, 61, 0.5)' },
            },
            width: chartContainerRef.current.clientWidth,
            height: 400,
        });

        const candlestickSeries = chart.addSeries(CandlestickSeries, {
            upColor: '#3fb950',
            downColor: '#f85149',
            borderVisible: false,
            wickUpColor: '#3fb950',
            wickDownColor: '#f85149',
        });

        // Mock initial data
        const data = [];
        let time = new Date(Date.now() - 100 * 24 * 60 * 60 * 1000);
        let lastPrice = 150;

        for (let i = 0; i < 100; i++) {
            const open = lastPrice + (Math.random() - 0.5) * 5;
            const high = open + Math.random() * 3;
            const low = open - Math.random() * 3;
            const close = (high + low) / 2;
            data.push({
                time: (time.getTime() / 1000) as any,
                open,
                high,
                low,
                close,
            });
            lastPrice = close;
            time.setDate(time.getDate() + 1);
        }
        candlestickSeries.setData(data);

        const handleResize = () => {
            if (chartContainerRef.current) {
                chart.applyOptions({ width: chartContainerRef.current.clientWidth });
            }
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            chart.remove();
        };
    }, [symbol]);

    return (
        <div className="card" style={{ padding: '1rem', flex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <div style={{ fontWeight: 700, fontSize: '1.25rem' }}>{symbol}</div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    {['1D', '1W', '1M', '1Y', 'ALL'].map((tf) => (
                        <button key={tf} style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem', borderRadius: '4px', background: tf === '1D' ? 'var(--divider)' : 'transparent', color: tf === '1D' ? 'white' : 'var(--text-secondary)' }}>
                            {tf}
                        </button>
                    ))}
                </div>
            </div>
            <div ref={chartContainerRef} style={{ width: '100%' }} />
        </div>
    );
}
