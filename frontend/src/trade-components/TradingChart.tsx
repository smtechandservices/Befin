'use client';

import React, { useEffect, useRef, useState } from 'react';
import { createChart, ColorType, CandlestickSeries, HistogramSeries, LineSeries } from 'lightweight-charts';

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

        const volumeSeries = chart.addSeries(HistogramSeries, {
            color: '#26a69a',
            priceFormat: { type: 'volume' },
            priceScaleId: '', // set as an overlay by setting a blank priceScaleId
        });

        // Scale settings for Volume overlay
        chart.priceScale('').applyOptions({
            scaleMargins: {
                top: 0.8, // highest point of the series will be at 80% of chart
                bottom: 0,
            },
        });

        // Add Simple Moving Average Line
        const smaSeries = chart.addSeries(LineSeries, { color: 'rgba(4, 111, 232, 1)', lineWidth: 2, title: 'SMA 20' });

        const fetchData = async () => {
            let range = '1mo';
            let interval = '60m';
            if (timeframe === '1D') { range = '1d'; interval = '5m'; }
            else if (timeframe === '1W') { range = '5d'; interval = '15m'; }
            else if (timeframe === '1M') { range = '1mo'; interval = '60m'; }
            else if (timeframe === '1Y') { range = '1y'; interval = '1d'; }
            else if (timeframe === 'ALL') { range = 'max'; interval = '1wk'; }

            try {
                // Fetch directly from our new Next.js internal Yahoo Finance proxy router
                const res = await fetch(`/trade/api/stocks/${symbol}/history?range=${range}&interval=${interval}`);
                const data = await res.json();

                if (data.history && data.history.length > 0) {
                    const formattedData = data.history.map((h: any) => ({
                        time: (new Date(h.time).getTime() / 1000) as any,
                        open: h.open,
                        high: h.high,
                        low: h.low,
                        close: h.close
                    })).sort((a: any, b: any) => a.time - b.time);

                    const volumeData = data.history.map((h: any) => ({
                        time: (new Date(h.time).getTime() / 1000) as any,
                        value: h.volume,
                        color: h.close >= h.open ? 'rgba(63, 185, 80, 0.3)' : 'rgba(248, 81, 73, 0.3)'
                    })).sort((a: any, b: any) => a.time - b.time);

                    candlestickSeries.setData(formattedData);
                    volumeSeries.setData(volumeData);

                    // Super basic SMA 20 calc for tech indicators request
                    const smaData = [];
                    for (let i = 0; i < formattedData.length; i++) {
                        if (i < 20) continue;
                        let sum = 0;
                        for (let j = 0; j < 20; j++) {
                            sum += formattedData[i - j].close;
                        }
                        smaData.push({ time: formattedData[i].time, value: sum / 20 });
                    }
                    smaSeries.setData(smaData);

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
