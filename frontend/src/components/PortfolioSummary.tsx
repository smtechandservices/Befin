'use client';

import React from 'react';
import { usePortfolio } from '../context/PortfolioProvider';
import { Position } from '../types';
import { TrendingUp, TrendingDown, DollarSign, Activity } from 'lucide-react';

export default function PortfolioSummary() {
    const { balance, positions } = usePortfolio();

    const marketValue = positions.reduce((acc: number, p: Position) => acc + (p.quantity * p.currentPrice), 0);
    const netValue = balance + marketValue;
    const totalCost = positions.reduce((acc: number, p: Position) => acc + (p.quantity * p.averagePrice), 0);
    const unrealizedPL = marketValue - totalCost;
    const plPercent = totalCost > 0 ? (unrealizedPL / totalCost) * 100 : 0;

    return (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
            <SummaryCard
                label="Net Account Value"
                value={`₹${netValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                icon={DollarSign}
            />
            <SummaryCard
                label="Buying Power"
                value={`₹${balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                icon={Activity}
            />
            <SummaryCard
                label="Market Value"
                value={`₹${marketValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                icon={TrendingUp}
            />
            <SummaryCard
                label="Unrealized P&L"
                value={`${unrealizedPL >= 0 ? '+' : ''}₹${unrealizedPL.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                subValue={`${unrealizedPL >= 0 ? '+' : ''}${plPercent.toFixed(2)}%`}
                color={unrealizedPL >= 0 ? 'var(--up)' : 'var(--down)'}
                icon={unrealizedPL >= 0 ? TrendingUp : TrendingDown}
            />
        </div>
    );
}

function SummaryCard({ label, value, subValue, color, icon: Icon }: any) {
    return (
        <div className="card" style={{ padding: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', fontWeight: 500 }}>{label}</span>
                <Icon size={18} style={{ color: color || 'var(--text-secondary)' }} />
            </div>
            <div style={{ fontSize: '1.25rem', fontWeight: 700, color: color || 'white' }}>{value}</div>
            {subValue && (
                <div style={{ fontSize: '0.875rem', fontWeight: 600, color, marginTop: '0.25rem' }}>{subValue}</div>
            )}
        </div>
    );
}
