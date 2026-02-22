'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Position, Trade, Portfolio } from '../types';
import { useAuth } from './AuthProvider';

interface PortfolioContextType extends Portfolio {
    buyStock: (symbol: string, quantity: number, price: number) => Promise<void>;
    sellStock: (symbol: string, quantity: number, price: number) => Promise<void>;
    resetPortfolio: () => void;
}

const INITIAL_BALANCE = 100000;

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

export function PortfolioProvider({ children }: { children: React.ReactNode }) {
    const [balance, setBalance] = useState(INITIAL_BALANCE);
    const [positions, setPositions] = useState<Position[]>([]);
    const [history, setHistory] = useState<Trade[]>([]);
    const { user } = useAuth();

    // Persistence (localStorage) and Real Balance Sync
    useEffect(() => {
        const saved = localStorage.getItem('paper_trading_portfolio');
        if (saved) {
            const { positions, history } = JSON.parse(saved);

            // Invalidate legacy static stocks like AAPL (Apple)
            const isLegacy = positions?.some((p: Position) => !p.symbol.endsWith('.NS')) || history?.some((h: Trade) => !h.symbol.endsWith('.NS'));

            if (!isLegacy) {
                setPositions(positions || []);
                setHistory(history || []);
            } else {
                localStorage.removeItem('paper_trading_portfolio');
            }
        }

        // Fetch real balance from Wallet
        const getCookie = (name: string) => {
            const value = `; ${document.cookie}`;
            const parts = value.split(`; ${name}=`);
            if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
            return null;
        };
        const token = getCookie('befin_token');
        if (token) {
            fetch('http://localhost:8000/api/wallet/balance/', {
                headers: { 'Authorization': `Bearer ${token}` }
            })
                .then(res => res.json())
                .then(data => {
                    if (data.balance !== undefined) {
                        setBalance(parseFloat(data.balance));
                    }
                })
                .catch(console.error);
        }
    }, []);

    useEffect(() => {
        // We do not save balance to localStorage anymore, only positions/history
        localStorage.setItem('paper_trading_portfolio', JSON.stringify({ positions, history }));
    }, [positions, history]);

    const getCookie = (name: string) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
        return null;
    };

    const buyStock = async (symbol: string, quantity: number, price: number) => {
        const cost = quantity * price;
        if (cost > balance) {
            alert('Insufficient buying power (BeCoins)!');
            return;
        }

        const token = getCookie('befin_token');
        if (!token) {
            alert('Not authenticated!'); return;
        }

        try {
            const res = await fetch('http://localhost:8000/api/wallet/trade/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ action: 'buy', symbol, quantity, price })
            });
            const data = await res.json();
            if (!res.ok) {
                alert(data.error || 'Failed to process trade.');
                return;
            }

            setBalance(parseFloat(data.balance));

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
        } catch (error) {
            console.error(error);
            alert('Network error occurred.');
        }
    };

    const sellStock = async (symbol: string, quantity: number, price: number) => {
        const position = positions.find((p) => p.symbol === symbol);
        if (!position || position.quantity < quantity) {
            alert('Insufficient position quantity!');
            return;
        }

        const token = getCookie('befin_token');
        if (!token) {
            alert('Not authenticated!'); return;
        }

        try {
            const res = await fetch('http://localhost:8000/api/wallet/trade/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ action: 'sell', symbol, quantity, price })
            });
            const data = await res.json();
            if (!res.ok) {
                alert(data.error || 'Failed to process trade.');
                return;
            }

            setBalance(parseFloat(data.balance));

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
        } catch (error) {
            console.error(error);
            alert('Network error occurred.');
        }
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
