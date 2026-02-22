'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Wallet, Gamepad2, Trophy, ArrowRight, ShieldCheck } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col items-center overflow-x-hidden">
      {/* Navbar */}
      <nav className="w-full flex justify-between items-center py-6 px-8 max-w-7xl mx-auto">
        <div className="text-2xl font-bold flex items-center gap-2 tracking-tight">
          <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center shadow-[0_0_15px_rgba(0,212,170,0.5)]">
            <span className="text-background text-lg leading-none">B</span>
          </div>
          BeFin
        </div>
        <div className="flex gap-4">
          <Link href="/login" className="px-5 py-2 rounded-lg font-medium text-text-secondary hover:text-white transition-colors">
            Log In
          </Link>
          <Link href="/signup" className="px-5 py-2 rounded-lg font-medium bg-accent text-background hover:bg-[#00ebd0] transition-colors shadow-lg shadow-accent/20">
            Sign Up
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-8 py-20 lg:py-32 flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface border border-white/5 text-accent text-sm font-medium mb-8">
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            The Future of Gamified Finance
          </div>
        </motion.div>

        <motion.h1
          className="text-5xl lg:text-7xl font-extrabold tracking-tight mb-6 max-w-4xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          Learn. Play. <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-[#00a884]">Earn BeCoins.</span>
        </motion.h1>

        <motion.p
          className="text-lg lg:text-xl text-text-secondary max-w-2xl mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Master your finances by playing fun, interactive games. Build your streak, level up your profile, and earn BeCoins to unlock exclusive rewards.
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Link href="/signup" className="group px-8 py-4 rounded-xl font-bold bg-accent text-background hover:bg-[#00ebd0] transition-all flex items-center justify-center gap-2 text-lg shadow-[0_0_30px_rgba(0,212,170,0.3)] hover:shadow-[0_0_40px_rgba(0,212,170,0.5)]">
            Get Started <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-32 w-full">
          <motion.div
            className="p-8 pb-10 rounded-3xl bg-surface border border-white/5 flex flex-col items-center text-center relative overflow-hidden group hover:border-accent/30 transition-colors"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accent/20 to-accent/5 flex items-center justify-center mb-6 text-accent">
              <Gamepad2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold mb-3">Interactive Games</h3>
            <p className="text-text-secondary leading-relaxed">
              Test your knowledge with Finance Hero A-Z or simulate the market with our Paper Trading simulator.
            </p>
          </motion.div>

          <motion.div
            className="p-8 pb-10 rounded-3xl bg-surface border border-white/5 flex flex-col items-center text-center relative overflow-hidden group hover:border-gold/30 transition-colors"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-gold/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-gold/20 to-gold/5 flex items-center justify-center mb-6 text-gold">
              <Wallet className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold mb-3">BeCoin Wallet</h3>
            <p className="text-text-secondary leading-relaxed">
              Earn real value by playing. Your BeCoins are securely synced across all our web experiences.
            </p>
          </motion.div>

          <motion.div
            className="p-8 pb-10 rounded-3xl bg-surface border border-white/5 flex flex-col items-center text-center relative overflow-hidden group hover:border-blue-500/30 transition-colors"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500/20 to-blue-500/5 flex items-center justify-center mb-6 text-blue-400">
              <Trophy className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold mb-3">Global Leaderboard</h3>
            <p className="text-text-secondary leading-relaxed">
              Complete daily quests, build your login streak, and compete against others to top the charts.
            </p>
          </motion.div>
        </div>
      </main>

      {/* Decorative background glow */}
      <div className="fixed top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-accent/20 blur-[150px] pointer-events-none -z-10" />
      <div className="fixed bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-blue-500/10 blur-[150px] pointer-events-none -z-10" />
    </div>
  );
}
