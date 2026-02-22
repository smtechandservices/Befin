'use client';

import React from 'react';
import { AuthProvider } from '@/context/AuthProvider';
import { PortfolioProvider } from '@/context/PortfolioProvider';
import { MarketDataProvider } from '@/services/MarketDataProvider';

export default function TradeLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <AuthProvider>
            <PortfolioProvider>
                <MarketDataProvider>
                    {children}
                </MarketDataProvider>
            </PortfolioProvider>
        </AuthProvider>
    );
}
