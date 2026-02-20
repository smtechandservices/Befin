'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthProvider';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, ShieldCheck, Landmark, ArrowRight } from 'lucide-react';

export default function OnboardingPage() {
    const [step, setStep] = useState(1);
    const { completeOnboarding, user } = useAuth();

    const nextStep = () => setStep(step + 1);

    return (
        <div className="flex-center" style={{ minHeight: '100vh', background: 'var(--background)' }}>
            <div style={{ width: '100%', maxWidth: '500px', padding: '2rem' }}>
                <AnimatePresence mode="wait">
                    {step === 1 && (
                        <motion.div
                            key="step1"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="card"
                            style={{ padding: '2.5rem', textAlign: 'center' }}
                        >
                            <div className="flex-center" style={{ width: '64px', height: '64px', background: 'rgba(0,122,255,0.1)', borderRadius: '50%', margin: '0 auto 1.5rem', color: 'var(--primary)' }}>
                                <ShieldCheck size={32} />
                            </div>
                            <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Verify Your Identity</h2>
                            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>To start paper trading, we need to simulate a KYC process for your virtual Demat account.</p>
                            <button
                                onClick={nextStep}
                                className="flex-center"
                                style={{ width: '100%', background: 'var(--primary)', color: 'white', padding: '0.75rem', borderRadius: '6px', fontWeight: 600, gap: '0.5rem' }}
                            >
                                Start Verification <ArrowRight size={18} />
                            </button>
                        </motion.div>
                    )}

                    {step === 2 && (
                        <motion.div
                            key="step2"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="card"
                            style={{ padding: '2.5rem' }}
                        >
                            <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>Link Virtual Bank Account</h2>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {['Demo Savings Bank', 'Global Virtual Bank', 'Antigravity Trust'].map((bank) => (
                                    <button
                                        key={bank}
                                        onClick={nextStep}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '1rem',
                                            padding: '1rem',
                                            border: '1px solid var(--border)',
                                            borderRadius: '8px',
                                            textAlign: 'left',
                                            width: '100%'
                                        }}
                                        onMouseOver={(e) => e.currentTarget.style.borderColor = 'var(--primary)'}
                                        onMouseOut={(e) => e.currentTarget.style.borderColor = 'var(--border)'}
                                    >
                                        <Landmark size={20} style={{ color: 'var(--text-secondary)' }} />
                                        <span style={{ fontWeight: 500 }}>{bank}</span>
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {step === 3 && (
                        <motion.div
                            key="step3"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="card"
                            style={{ padding: '2.5rem', textAlign: 'center' }}
                        >
                            <div className="flex-center" style={{ width: '64px', height: '64px', background: 'rgba(63,185,80,0.1)', borderRadius: '50%', margin: '0 auto 1.5rem', color: 'var(--up)' }}>
                                <CheckCircle2 size={32} />
                            </div>
                            <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Demat Account Active!</h2>
                            <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>Your virtual account has been credited with</p>
                            <div style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '2rem' }}>$100,000.00</div>
                            <button
                                onClick={completeOnboarding}
                                style={{ width: '100%', background: 'var(--primary)', color: 'white', padding: '0.75rem', borderRadius: '6px', fontWeight: 600 }}
                            >
                                Go to Dashboard
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
