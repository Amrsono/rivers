'use client';

import React from 'react';
import { useRiversStore } from '@/lib/store/useRiversStore';
import { Navbar } from '@/components/marketplace/Navbar';
import { CategoryStream } from '@/components/marketplace/CategoryStream';
import { ListingsGrid } from '@/components/marketplace/ListingsGrid';
import { AdminDashboardView } from '@/components/marketplace/AdminDashboardView';
import { ListingDetailModal } from '@/components/marketplace/ListingDetailModal';
import { ListingCreatorModal } from '@/components/marketplace/ListingCreatorModal';
import { BNPLCheckoutModal } from '@/components/marketplace/BNPLCheckoutModal';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import {
  Sparkles,
  Zap,
  ShieldCheck,
  ArrowRight,
  Lock,
  Globe,
  PlusCircle,
  TrendingUp,
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function Home() {
  const { activeView, setActiveView, openListingCreator } = useRiversStore();

  return (
    <div className="min-h-screen flex flex-col justify-between">
      <div>
        {/* Floating Glass Navbar */}
        <Navbar />

        {/* HERO SECTION (Rendered on Discovery View) */}
        {activeView === 'discovery' && (
          <section className="relative mx-auto max-w-7xl px-4 sm:px-6 pt-6 pb-12 text-center">
            {/* Top Luminous Badge */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-950/80 border border-cyan-500/30 text-cyan-300 text-xs font-mono mb-6 shadow-[0_0_20px_rgba(6,182,212,0.25)] backdrop-blur-xl"
            >
              <Zap className="w-3.5 h-3.5 fill-cyan-400 text-cyan-400" />
              <span>Introducing Rivers Flow 0% APR Installment Split</span>
              <span className="text-slate-500">•</span>
              <span className="text-emerald-400 font-bold">100% Escrow Protection</span>
            </motion.div>

            {/* Hero Main Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-100 max-w-5xl mx-auto leading-[1.1] mb-6"
            >
              The Next-Gen <br className="hidden sm:block" />
              <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-teal-300 bg-clip-text text-transparent">
                Fluid P2P Marketplace
              </span>{' '}
              & Finance Engine
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed mb-8"
            >
              Trade high-value technology, hydrofoils, cyberware, and luxury gear with continuous
              fluid streams, zero friction, and built-in Buy-Now-Pay-Later financing.
            </motion.p>

            {/* CTA Action Cluster */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-wrap items-center justify-center gap-4 mb-12"
            >
              <Button
                onClick={openListingCreator}
                variant="primary"
                size="lg"
                leftIcon={<PlusCircle className="w-5 h-5" />}
              >
                Post An Item Live
              </Button>
              <Button
                onClick={() => setActiveView('admin')}
                variant="glass"
                size="lg"
                leftIcon={<TrendingUp className="w-5 h-5 text-cyan-400" />}
              >
                Explore Admin Analytics
              </Button>
            </motion.div>

            {/* Trust Metrics Bar */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
              className="inline-grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-8 p-4 px-8 rounded-2xl bg-slate-950/60 border border-slate-800/80 backdrop-blur-xl shadow-2xl font-mono text-xs text-slate-300"
            >
              <div className="text-center">
                <span className="block text-lg font-bold text-cyan-400">$4.29M+</span>
                <span className="text-[10px] text-slate-500 uppercase">Quarterly GMV</span>
              </div>
              <div className="text-center">
                <span className="block text-lg font-bold text-emerald-400">99.8%</span>
                <span className="text-[10px] text-slate-500 uppercase">Trust Score</span>
              </div>
              <div className="text-center">
                <span className="block text-lg font-bold text-blue-400">0% APR</span>
                <span className="text-[10px] text-slate-500 uppercase">Flow BNPL</span>
              </div>
              <div className="text-center">
                <span className="block text-lg font-bold text-purple-400">&lt; 2 mins</span>
                <span className="text-[10px] text-slate-500 uppercase">Fast Settlement</span>
              </div>
            </motion.div>
          </section>
        )}

        {/* MAIN BODY CONTENT */}
        <main>
          {activeView === 'discovery' ? (
            <>
              {/* Intelligent Category Streams */}
              <CategoryStream />

              {/* Masonry Listings Grid */}
              <ListingsGrid />
            </>
          ) : (
            /* Admin Analytics Dashboard View */
            <AdminDashboardView />
          )}
        </main>
      </div>

      {/* MODALS */}
      <ListingDetailModal />
      <ListingCreatorModal />
      <BNPLCheckoutModal />

      {/* FOOTER */}
      <footer className="border-t border-slate-900 bg-slate-950/90 py-12 px-4 sm:px-6">
        <div className="mx-auto max-w-7xl flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-slate-500 font-mono">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-lg bg-cyan-500 flex items-center justify-center font-bold text-slate-950">
              R
            </div>
            <span className="font-bold text-slate-300">RIVERS MARKETPLACE INC.</span>
            <span>© 2026 All Rights Reserved</span>
          </div>

          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5 text-cyan-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400" /> Rivers Escrow Guarantee
            </span>
            <span className="flex items-center gap-1.5 text-slate-400">
              <Zap className="w-4 h-4 text-cyan-400 fill-cyan-400" /> Rivers Flow Finance Engine
            </span>
            <span className="flex items-center gap-1.5">
              <Globe className="w-4 h-4 text-slate-400" /> Global P2P Protocol
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
