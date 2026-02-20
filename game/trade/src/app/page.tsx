'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { TrendingUp, Shield, BarChart3, Users } from 'lucide-react';

export default function LandingPage() {
  return (
    <div style={{ background: 'var(--background)', color: 'white', minHeight: '100vh' }}>
      {/* Header */}
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem 4rem', borderBottom: '1px solid var(--divider)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ width: '32px', height: '32px', background: 'var(--primary)', borderRadius: '6px' }} />
          <span style={{ fontSize: '1.5rem', fontWeight: 800 }}>TradePro</span>
        </div>
        <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
          <Link href="/login" style={{ fontWeight: 500, color: 'var(--text-secondary)' }}>Log In</Link>
          <Link href="/signup" style={{ background: 'var(--primary)', padding: '0.6rem 1.5rem', borderRadius: '6px', fontWeight: 600 }}>Get Started</Link>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ textAlign: 'center', padding: '6rem 2rem', maxWidth: '1000px', margin: '0 auto' }}>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ fontSize: '4rem', fontWeight: 800, marginBottom: '1.5rem', lineHeight: 1.1 }}
        >
          Master the Markets without <span style={{ color: 'var(--primary)' }}>the Risk</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', marginBottom: '3rem', maxWidth: '600px', margin: '0 auto 3rem' }}
        >
          Experience professional-grade paper trading with real-time data, advanced charting, and a seamless virtual Demat account setup.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}
        >
          <Link href="/signup" style={{ background: 'var(--primary)', padding: '1rem 2.5rem', borderRadius: '8px', fontSize: '1.125rem', fontWeight: 700 }}>Open Free Account</Link>
          <button style={{ border: '1px solid var(--border)', padding: '1rem 2.5rem', borderRadius: '8px', fontSize: '1.125rem', fontWeight: 700 }}>View Markets</button>
        </motion.div>
      </section>

      {/* Features */}
      <section style={{ padding: '6rem 4rem', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '2rem' }}>
        <FeatureCard
          icon={TrendingUp}
          title="Real-time Simulation"
          desc="Execute trades with live-like market data updates every 2 seconds."
        />
        <FeatureCard
          icon={Shield}
          title="Virtual Demat"
          desc="Simulate a full brokerage experience with our guided onboarding flow."
        />
        <FeatureCard
          icon={BarChart3}
          title="Advanced Charts"
          desc="Professional candlestick charts powered by TradingView-like tech."
        />
        <FeatureCard
          icon={Users}
          title="Paper Trading"
          desc="Start with $100,000 in virtual capital and test your strategies."
        />
      </section>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, desc }: any) {
  return (
    <div className="card" style={{ padding: '2rem', textAlign: 'center' }}>
      <div className="flex-center" style={{ width: '48px', height: '48px', background: 'rgba(0,122,255,0.1)', borderRadius: '12px', margin: '0 auto 1.5rem', color: 'var(--primary)' }}>
        <Icon size={24} />
      </div>
      <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.75rem' }}>{title}</h3>
      <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.6 }}>{desc}</p>
    </div>
  );
}
