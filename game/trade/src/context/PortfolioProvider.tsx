'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Position, Trade, Portfolio } from '../types';

interface PortfolioContextType extends Portfolio {
    buyStock: (symbol: string, quantity: number, price: number) => void;
    sellStock: (symbol: string, quantity: number, price: number) => void;
    resetPortfolio: () => void;
}

const INITIAL_BALANCE = 100000;

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

export function PortfolioProvider({ children }: { children: React.ReactNode }) {
    const [balance, setBalance] = useState(INITIAL_BALANCE);
    const [positions, setPositions] = useState<Position[]>([]);
    const [history, setHistory] = useState<Trade[]>([]);

    // Persistence (localStorage)
    useEffect(() => {
        const saved = localStorage.getItem('paper_trading_portfolio');
        if (saved) {
            const { balance, positions, history } = JSON.parse(saved);
            setBalance(balance);
            setPositions(positions);
            setHistory(history);
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('paper_trading_portfolio', JSON.stringify({ balance, positions, history }));
    }, [balance, positions, history]);

    const buyStock = (symbol: string, quantity: number, price: number) => {
        const cost = quantity * price;
        if (cost > balance) {
            alert('Insufficient buying power!');
            return;
        }

        setBalance((prev) => prev - cost);

        setPositions((prev) => {
            const existing = prev.find((p) => p.symbol === symbol);
            if (existing) {
                const newQuantity = existing.quantity + quantity;
                const newAvgPrice = (existing.averagePrice * existing.quantity + cost) / newQuantity;
                return prev.map((p) =>
                    p.symbol === symbol ? { ...p, quantity: newQuantity, averagePrice: newAvgPrice } : p
                );
            }
            return [...prev, { symbol, quantity, averagePrice: price, currentPrice: price }];
        });

        setHistory((prev) => [
            { id: Math.random().toString(36).substr(2, 9), symbol, type: 'BUY', quantity, price, timestamp: Date.now() },
            ...prev,
        ]);
    };

    const sellStock = (symbol: string, quantity: number, price: number) => {
        const position = positions.find((p) => p.symbol === symbol);
        if (!position || position.quantity < quantity) {
            alert('Insufficient position quantity!');
            return;
        }

        const credit = quantity * price;
        setBalance((prev) => prev + credit);

        setPositions((prev) => {
            const updated = prev.map((p) => {
                if (p.symbol === symbol) {
                    return { ...p, quantity: p.quantity - quantity };
                }
                return p;
            }).filter((p) => p.quantity > 0);
            return updated;
        });

        setHistory((prev) => [
            { id: Math.random().toString(36).substr(2, 9), symbol, type: 'SELL', quantity, price, timestamp: Date.now() },
            ...prev,
        ]);
    };

    const resetPortfolio = () => {
        setBalance(INITIAL_BALANCE);
        setPositions([]);
        setHistory([]);
    };

    return (
        <PortfolioContext.Provider value={{ balance, positions, history, buyStock, sellStock, resetPortfolio }}>
            {children}
        </PortfolioContext.Provider>
    );
}

export function usePortfolio() {
    const context = useContext(PortfolioContext);
    if (context === undefined) {
        throw new Error('usePortfolio must be used within a PortfolioProvider');
    }
    return context;
}
