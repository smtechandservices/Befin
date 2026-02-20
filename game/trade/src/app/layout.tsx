import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/context/AuthProvider';
import { PortfolioProvider } from '@/context/PortfolioProvider';
import { MarketDataProvider } from '@/services/MarketDataProvider';

export const metadata: Metadata = {
  title: 'TradePro | Professional Paper Trading',
  description: 'Simulate trading with real-time data and professional tools.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <PortfolioProvider>
            <MarketDataProvider>
              {children}
            </MarketDataProvider>
          </PortfolioProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
