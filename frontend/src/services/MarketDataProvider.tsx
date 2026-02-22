'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Stock, INDIAN_STOCKS } from '@/types';

interface MarketDataContextType {
    stocks: Stock[];
    isLoading: boolean;
}

const MarketDataContext = createContext<MarketDataContextType | undefined>(undefined);

export function MarketDataProvider({ children }: { children: React.ReactNode }) {
    const [stocks, setStocks] = useState<Stock[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchStockData = async () => {
        try {
            const results = await Promise.all(
                INDIAN_STOCKS.map(async (s) => {
                    const res = await fetch(`http://localhost:8000/api/market/quote/?symbol=${s.symbol}`);
                    const data = await res.json();
                    return {
                        symbol: s.symbol,
                        name: data.name || s.name,
                        price: data.price || 0,
                        change: data.change || 0,
                        changePercent: data.change_percent || 0,
                        volume: data.volume || 0,
                        marketCap: 0,
                    };
                })
            );
            setStocks(results);
            setIsLoading(false);
        } catch (error) {
            console.error('Error fetching real-time stocks:', error);
        }
    };

    useEffect(() => {
        fetchStockData();
        const interval = setInterval(fetchStockData, 10000); // Poll every 10 seconds
        return () => clearInterval(interval);
    }, []);

    return (
        <MarketDataContext.Provider value={{ stocks, isLoading }}>
            {children}
        </MarketDataContext.Provider>
    );
}

export function useMarketData() {
    const context = useContext(MarketDataContext);
    if (context === undefined) {
        throw new Error('useMarketData must be used within a MarketDataProvider');
    }
    return context;
}
