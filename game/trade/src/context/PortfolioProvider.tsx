'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Position, Trade, Portfolio } from '../types';
import { useAuth } from './AuthProvider';

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
    const { user } = useAuth();

    // Persistence (localStorage)
    useEffect(() => {
        const saved = localStorage.getItem('paper_trading_portfolio');
        if (saved) {
            const { balance, positions, history } = JSON.parse(saved);

            // Invalidate legacy static stocks like AAPL (Apple)
            const isLegacy = positions?.some((p: Position) => !p.symbol.endsWith('.NS')) || history?.some((h: Trade) => !h.symbol.endsWith('.NS'));

            if (!isLegacy) {
                setBalance(balance);
                setPositions(positions);
                setHistory(history);
            } else {
                localStorage.removeItem('paper_trading_portfolio');
            }
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

        const profit = (price - position.averagePrice) * quantity;
        if (profit > 0 && user) {
            const coins = Math.floor(profit / 10);
            if (coins > 0) {
                setTimeout(() => {
                    const getCookie = (name: string) => {
                        const value = `; ${document.cookie}`;
                        const parts = value.split(`; ${name}=`);
                        if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
                        return null;
                    };
                    const token = getCookie('befin_token');
                    if (token) {
                        fetch('http://localhost:8000/api/wallet/award/', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${token}`
                            },
                            body: JSON.stringify({
                                username: user.name, // useAuth maps Django username to user.name
                                coins,
                                source: 'paper-trade',
                                game_score: Math.floor(profit)
                            })
                        }).catch(err => console.error(err));
                    }
                }, 500);
            }
        }

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
