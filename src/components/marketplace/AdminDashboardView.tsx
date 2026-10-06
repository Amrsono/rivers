'use client';

import React, { useState } from 'react';
import { useRiversStore } from '@/lib/store/useRiversStore';
import { GlassCard } from '../ui/GlassCard';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import {
  Activity,
  TrendingUp,
  DollarSign,
  Zap,
  CheckCircle2,
  XCircle,
  FileCheck,
  Layers,
  BarChart3,
  Sparkles,
  Brain,
  Key,
  ExternalLink,
  CheckCheck,
  AlertTriangle,
} from 'lucide-react';
import { motion } from 'framer-motion';

export const AdminDashboardView: React.FC = () => {
  const { adminAnalytics, approveVerification, rejectVerification, t, numLocale } = useRiversStore();

  // AI Settings local state
  const [geminiKey, setGeminiKey] = useState('');
  const [isConfigured, setIsConfigured] = useState(false);

  React.useEffect(() => {
    // Check if key exists in local storage first
    const localKey = localStorage.getItem('rivers_gemini_key');
    if (localKey) {
      setIsConfigured(true);
      setGeminiKey(localKey);
      return;
    }

    // Otherwise check server environment
    fetch('/api/ai/status')
      .then((res) => res.json())
      .then((data) => {
        if (data.isGeminiConfigured) {
          setIsConfigured(true);
          setGeminiKey('••••••••••••••••••••••••••••••••');
        }
      })
      .catch(console.error);
  }, []);

  const handleSaveKey = () => {
    if (geminiKey.trim()) {
      localStorage.setItem('rivers_gemini_key', geminiKey.trim());
      setIsConfigured(true);
    }
  };

  const metrics = [
    {
      label: t('activeListingsStream'),
      value: adminAnalytics.activeListings.toLocaleString(),
      change: '+14.2% vs last month',
      icon: <Layers className="w-5 h-5 text-cyan-400" />,
      glow: 'from-cyan-500/20 to-blue-500/10',
    },
    {
      label: t('totalMarketplaceGmv'),
      value: `ج.م ${(adminAnalytics.totalMarketplaceGmv / 1000000).toLocaleString(numLocale, { maximumFractionDigits: 2 })}M`,
      change: `+${adminAnalytics.gmvGrowthPercent}% growth rate`,
      icon: <TrendingUp className="w-5 h-5 text-emerald-400" />,
      glow: 'from-emerald-500/20 to-teal-500/10',
    },
    {
      label: t('activeEscrowVolume'),
      value: `ج.م ${(adminAnalytics.escrowVolume / 1000000).toLocaleString(numLocale, { maximumFractionDigits: 2 })}M`,
      change: 'Protected by Smart Escrow',
      icon: <DollarSign className="w-5 h-5 text-amber-400" />,
      glow: 'from-amber-500/20 to-orange-500/10',
    },
    {
      label: t('riversFlowBnplVolume'),
      value: `ج.م ${(adminAnalytics.bnplFinancedVolume / 1000000).toLocaleString(numLocale, { maximumFractionDigits: 2 })}M`,
      change: '0% Default rate',
      icon: <Zap className="w-5 h-5 text-purple-400" />,
      glow: 'from-purple-500/20 to-indigo-500/10',
    },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 mb-16 space-y-8">
      {/* Dashboard Header Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-slate-950 via-cyan-950/40 to-slate-950 border border-cyan-500/30 shadow-2xl backdrop-blur-2xl">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Activity className="w-4 h-4 text-cyan-400 animate-pulse" />
            <span className="text-xs font-mono uppercase tracking-widest text-cyan-400 font-bold">
              {t('telemetryConsole')}
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-100 tracking-tight">
            {t('adminDashboardTitle')}
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <Badge variant="emerald" size="md">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping ltr:mr-1 rtl:ml-1" /> {t('systemOperational')}
          </Badge>
          <span className="text-xs font-mono text-slate-400">Node: us-east-2 (Escrow Relay Active)</span>
        </div>
      </div>

      {/* Top 4 Real-time Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {metrics.map((metric, idx) => (
          <GlassCard key={idx} className="p-5 relative overflow-hidden">
            <div className={`absolute top-0 ltr:right-0 rtl:left-0 w-24 h-24 bg-gradient-to-bl ${metric.glow} rounded-full blur-2xl -z-10`} />
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono uppercase tracking-wider text-slate-400 font-medium">
                {metric.label}
              </span>
              <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">{metric.icon}</div>
            </div>
            <div className="text-3xl font-extrabold font-mono text-slate-100 mb-1">{metric.value}</div>
            <span className="text-[11px] font-mono text-cyan-400 font-semibold">{metric.change}</span>
          </GlassCard>
        ))}
      </div>

      {/* Traffic Spikes & Category Breakdown Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Real-time Traffic Graph Widget */}
        <GlassCard className="lg:col-span-8 p-6 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-cyan-400" /> {t('hourlyTrafficTitle')}
              </h3>
              <p className="text-xs text-slate-400 font-mono mt-0.5">
                {t('websocketTelemetry')}
              </p>
            </div>
            <span className="text-xs font-mono text-slate-400 px-3 py-1 rounded-lg bg-slate-900 border border-slate-800">
              Peak: 56,200 req/hr
            </span>
          </div>

          {/* Animated Bar Chart Graphic */}
          <div className="h-48 flex items-end gap-4 sm:gap-6 pt-4 pb-2 border-b border-slate-800">
            {adminAnalytics.trafficSpikeData.map((bar, idx) => {
              const maxVal = 60000;
              const heightPercent = Math.round((bar.visitors / maxVal) * 100);
              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                  <div className="text-[10px] font-mono text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity">
                    {bar.visitors.toLocaleString()}
                  </div>
                  <div className="w-full bg-slate-900 rounded-t-xl overflow-hidden h-full flex items-end">
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${heightPercent}%` }}
                      transition={{ duration: 0.8, delay: idx * 0.1 }}
                      className="w-full bg-gradient-to-t from-cyan-600 via-cyan-400 to-teal-300 rounded-t-xl group-hover:shadow-[0_0_20px_rgba(6,182,212,0.6)] transition-all"
                    />
                  </div>
                  <span className="text-[11px] font-mono text-slate-400">{bar.time}</span>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between pt-4 text-xs font-mono text-slate-400">
            <span className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-cyan-400 inline-block" /> Active Visitor Traffic
            </span>
            <span>Est. Conversion Rate: 4.82%</span>
          </div>
        </GlassCard>

        {/* Category GMV Share */}
        <GlassCard className="lg:col-span-4 p-6">
          <h3 className="text-base font-bold text-slate-100 mb-1 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" /> {t('streamGmvShare')}
          </h3>
          <p className="text-xs text-slate-400 font-mono mb-6">Volume per category stream</p>

          <div className="space-y-4">
            {adminAnalytics.categoryBreakdown.map((cat, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-300 font-semibold">{cat.category}</span>
                  <span className="text-cyan-400 font-bold">ج.م{(cat.value / 1000).toLocaleString(numLocale, { maximumFractionDigits: 0 })}k</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-900 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full"
                    style={{ width: `${Math.min(100, (cat.value / 84000000) * 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>

      {/* User Verification Queue (Identity & Trust Verification) */}
      <GlassCard className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-cyan-400" /> {t('userVerificationQueue')}
            </h3>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              {t('userVerificationDesc')}
            </p>
          </div>
          <Badge variant="cyan" size="md">
            {t('pendingApprovalCount', { count: adminAnalytics.recentVerifications.length })}
          </Badge>
        </div>

        {adminAnalytics.recentVerifications.length === 0 ? (
          <div className="p-8 text-center text-xs font-mono text-slate-500">
            {t('allVerificationsProcessed')}
          </div>
        ) : (
          <div className="divide-y divide-slate-900">
            {adminAnalytics.recentVerifications.map((req) => (
              <div
                key={req.id}
                className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={req.userAvatar}
                    alt={req.userName}
                    className="w-10 h-10 rounded-full object-cover border border-cyan-500/30"
                  />
                  <div>
                    <span className="text-sm font-bold text-slate-200 block">{req.userName}</span>
                    <span className="text-xs font-mono text-slate-400">
                      Doc Type: <strong className="text-cyan-400">{req.documentType}</strong> • Submitted {req.submittedAt}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    onClick={() => approveVerification(req.id)}
                    variant="primary"
                    size="sm"
                    leftIcon={<CheckCircle2 className="w-3.5 h-3.5" />}
                  >
                    {t('approveBadge')}
                  </Button>
                  <Button
                    onClick={() => rejectVerification(req.id)}
                    variant="danger"
                    size="sm"
                    leftIcon={<XCircle className="w-3.5 h-3.5" />}
                  >
                    {t('reject')}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </GlassCard>

      {/* ── AI Assist Settings ─────────────────────────────────────── */}
      <GlassCard className="p-6 space-y-5">
        {/* Header */}
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-2xl bg-gradient-to-br from-violet-500/20 to-indigo-500/10 border border-violet-500/30 text-violet-400 shrink-0">
            <Brain className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-100">{t('aiSettingsTitle')}</h3>
            <p className="text-xs text-slate-400 mt-0.5">{t('aiSettingsSubtitle')}</p>
          </div>
          <div className="ml-auto flex items-center gap-1.5 px-2.5 py-1 rounded-xl border text-xs font-mono font-semibold"
               style={isConfigured
                 ? { borderColor: 'rgba(16,185,129,0.4)', color: '#34d399', background: 'rgba(6,78,59,0.3)' }
                 : { borderColor: 'rgba(100,116,139,0.3)', color: '#64748b', background: 'rgba(15,23,42,0.5)' }
               }>
            {isConfigured ? (
              <><CheckCheck className="w-3 h-3" /> {t('geminiApiKeyActive')}</>
            ) : (
              <><AlertTriangle className="w-3 h-3" /> {t('geminiApiKeyInactive')}</>
            )}
          </div>
        </div>

        {/* API Key Input */}
        <div className="space-y-2">
          <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold">
            <Key className="w-3 h-3 inline mr-1" />
            {t('geminiApiKeyLabel')}
          </label>
          <div className="flex gap-2">
            <input
              type="password"
              value={geminiKey}
              onChange={(e) => { setGeminiKey(e.target.value); setIsConfigured(false); }}
              placeholder={t('geminiApiKeyPlaceholder')}
              className="flex-1 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 text-sm font-mono focus:outline-none focus:border-violet-400 placeholder:text-slate-600"
            />
            <Button
              onClick={handleSaveKey}
              disabled={!geminiKey.trim()}
              variant="secondary"
              size="md"
              leftIcon={isConfigured ? <CheckCheck className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
            >
              {isConfigured ? 'Active' : t('geminiApiKeySave')}
            </Button>
          </div>
        </div>

        {/* Feature grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {[
            { icon: '✍️', label: 'Generate Description' },
            { icon: '✨', label: 'Polish Description' },
            { icon: '🏷️', label: 'Auto-Detect Category' },
            { icon: '💰', label: 'Smart Price Suggestion' },
            { icon: '🔖', label: 'Auto-Generate Tags' },
            { icon: '⭐', label: 'Listing Readiness Score' },
          ].map((f) => (
            <div
              key={f.label}
              className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-400"
            >
              <span>{f.icon}</span>
              <span>{f.label}</span>
              {isConfigured && <CheckCircle2 className="w-3 h-3 text-emerald-400 ml-auto shrink-0" />}
            </div>
          ))}
        </div>

        {/* Get key link */}
        <a
          href="https://aistudio.google.com/app/apikey"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs text-violet-400 hover:text-violet-300 font-mono transition-colors"
        >
          <ExternalLink className="w-3 h-3" />
          {t('geminiGetKeyLink')}
        </a>
      </GlassCard>

    </div>
  );
};
