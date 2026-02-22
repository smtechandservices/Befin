'use client';

import React, { useEffect, useRef, useState } from 'react';
import { createChart, ColorType, CandlestickSeries } from 'lightweight-charts';

export default function TradingChart({ symbol }: { symbol: string }) {
    const chartContainerRef = useRef<HTMLDivElement>(null);
    const [timeframe, setTimeframe] = useState('1M');

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

        const fetchData = async () => {
            let period = '1mo';
            let interval = '60m';
            if (timeframe === '1D') { period = '1d'; interval = '5m'; }
            else if (timeframe === '1W') { period = '5d'; interval = '15m'; }
            else if (timeframe === '1M') { period = '1mo'; interval = '60m'; }
            else if (timeframe === '1Y') { period = '1y'; interval = '1d'; }
            else if (timeframe === 'ALL') { period = 'max'; interval = '1wk'; }

            try {
                const res = await fetch(`http://localhost:8000/api/market/history/?symbol=${symbol}&period=${period}&interval=${interval}`);
                const data = await res.json();

                if (data.history && data.history.length > 0) {
                    const formattedData = data.history.map((h: any) => ({
                        time: (new Date(h.time).getTime() / 1000) as any,
                        open: h.open,
                        high: h.high,
                        low: h.low,
                        close: h.close
                    })).sort((a: any, b: any) => a.time - b.time);

                    candlestickSeries.setData(formattedData);
                    chart.timeScale().fitContent();
                }
            } catch (err) {
                console.error("Failed to fetch historical data", err);
            }
        };

        fetchData();

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
    }, [symbol, timeframe]);

    return (
        <div className="card" style={{ padding: '1rem', flex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <div style={{ fontWeight: 700, fontSize: '1.25rem' }}>{symbol}</div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    {['1D', '1W', '1M', '1Y', 'ALL'].map((tf) => (
                        <button
                            key={tf}
                            onClick={() => setTimeframe(tf)}
                            style={{
                                fontSize: '0.75rem',
                                padding: '0.25rem 0.5rem',
                                borderRadius: '4px',
                                background: tf === timeframe ? 'var(--divider)' : 'transparent',
                                color: tf === timeframe ? 'white' : 'var(--text-secondary)',
                                cursor: 'pointer'
                            }}
                        >
                            {tf}
                        </button>
                    ))}
                </div>
            </div>
            <div ref={chartContainerRef} style={{ width: '100%' }} />
        </div>
    );
}
