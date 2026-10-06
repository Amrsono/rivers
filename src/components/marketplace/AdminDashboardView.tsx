'use client';

import React from 'react';
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
} from 'lucide-react';
import { motion } from 'framer-motion';

export const AdminDashboardView: React.FC = () => {
  const { adminAnalytics, approveVerification, rejectVerification, t } = useRiversStore();

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
      value: `$${(adminAnalytics.totalMarketplaceGmv / 1000000).toFixed(2)}M`,
      change: `+${adminAnalytics.gmvGrowthPercent}% growth rate`,
      icon: <TrendingUp className="w-5 h-5 text-emerald-400" />,
      glow: 'from-emerald-500/20 to-teal-500/10',
    },
    {
      label: t('activeEscrowVolume'),
      value: `$${(adminAnalytics.escrowVolume / 1000000).toFixed(2)}M`,
      change: 'Protected by Smart Escrow',
      icon: <DollarSign className="w-5 h-5 text-amber-400" />,
      glow: 'from-amber-500/20 to-orange-500/10',
    },
    {
      label: t('riversFlowBnplVolume'),
      value: `$${(adminAnalytics.bnplFinancedVolume / 1000000).toFixed(2)}M`,
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
                  <span className="text-cyan-400 font-bold">${(cat.value / 1000).toFixed(0)}k</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-900 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full"
                    style={{ width: `${Math.min(100, (cat.value / 1680000) * 100)}%` }}
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
    </div>
  );
};
