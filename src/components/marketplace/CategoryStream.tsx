'use client';

import React from 'react';
import { useRiversStore } from '@/lib/store/useRiversStore';
import { MOCK_CATEGORIES } from '@/lib/mock-data';
import {
  Cpu,
  Zap,
  Headphones,
  Monitor,
  Building,
  Sparkles,
  Layers,
  ChevronRight,
  ChevronLeft,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';

const iconMap: Record<string, React.ReactNode> = {
  Cpu: <Cpu className="w-5 h-5" />,
  Zap: <Zap className="w-5 h-5" />,
  Headphones: <Headphones className="w-5 h-5" />,
  Monitor: <Monitor className="w-5 h-5" />,
  Building: <Building className="w-5 h-5" />,
  Sparkles: <Sparkles className="w-5 h-5" />,
};

export const CategoryStream: React.FC = () => {
  const { selectedCategory, setSelectedCategory, t, language } = useRiversStore();

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 mb-8">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-cyan-400" />
          <h2 className="text-xs font-mono tracking-widest text-slate-400 uppercase">
            {t('intelligentCategoryStreams')}
          </h2>
        </div>
        <button
          onClick={() => setSelectedCategory('all')}
          className="text-xs font-mono text-cyan-400 hover:text-cyan-300 transition-colors flex items-center gap-1 cursor-pointer"
        >
          {t('viewAllStreams')}{' '}
          {language === 'ar' ? (
            <ChevronLeft className="w-3.5 h-3.5" />
          ) : (
            <ChevronRight className="w-3.5 h-3.5" />
          )}
        </button>
      </div>

      {/* Horizontal Stream Cards Container */}
      <div className="flex items-center gap-3.5 overflow-x-auto pb-4 pt-1 no-scrollbar scroll-smooth">
        {/* All Streams Card */}
        <motion.button
          whileHover={{ y: -3, scale: 1.02 }}
          onClick={() => setSelectedCategory('all')}
          className={clsx(
            'flex-shrink-0 flex items-center gap-3.5 px-5 py-3.5 rounded-2xl border transition-all duration-300 cursor-pointer text-left rtl:text-right',
            selectedCategory === 'all'
              ? 'bg-gradient-to-r from-cyan-500/20 to-blue-600/20 border-cyan-400 text-cyan-300 shadow-[0_0_20px_rgba(6,182,212,0.25)] ring-1 ring-cyan-500/30'
              : 'bg-slate-950/60 backdrop-blur-xl border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-900/60'
          )}
        >
          <div
            className={clsx(
              'p-2.5 rounded-xl transition-colors',
              selectedCategory === 'all'
                ? 'bg-cyan-500/20 text-cyan-400'
                : 'bg-slate-900 text-slate-400'
            )}
          >
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <span className="block text-sm font-bold tracking-tight">{t('allStreams')}</span>
            <span className="text-[11px] font-mono text-slate-500">{t('liveP2pCatalog')}</span>
          </div>
        </motion.button>

        {/* Dynamic Category Cards */}
        {MOCK_CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          const translatedName = t(cat.id as any) !== cat.id ? t(cat.id as any) : cat.name;
          const translatedDesc =
            t(`${cat.id}_desc` as any) !== `${cat.id}_desc` ? t(`${cat.id}_desc` as any) : cat.description;

          return (
            <motion.button
              key={cat.id}
              whileHover={{ y: -3, scale: 1.02 }}
              onClick={() => setSelectedCategory(cat.id)}
              className={clsx(
                'flex-shrink-0 flex items-center gap-3.5 px-5 py-3.5 rounded-2xl border transition-all duration-300 cursor-pointer text-left rtl:text-right max-w-xs',
                isSelected
                  ? 'bg-gradient-to-r from-cyan-500/20 to-blue-600/20 border-cyan-400 text-cyan-300 shadow-[0_0_20px_rgba(6,182,212,0.25)] ring-1 ring-cyan-500/30'
                  : 'bg-slate-950/60 backdrop-blur-xl border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-900/60'
              )}
            >
              <div
                className={clsx(
                  'p-2.5 rounded-xl transition-colors shrink-0',
                  isSelected ? 'bg-cyan-500/20 text-cyan-400' : 'bg-slate-900 text-slate-400'
                )}
              >
                {iconMap[cat.icon] || <Cpu className="w-5 h-5" />}
              </div>
              <div className="truncate flex-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-bold tracking-tight truncate">{translatedName}</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-900 text-cyan-400 border border-slate-800 shrink-0">
                    {cat.itemCount}
                  </span>
                </div>
                <span className="text-[11px] text-slate-400 truncate block mt-0.5">
                  {translatedDesc}
                </span>
              </div>
            </motion.button>
          );
        })}
      </div>
    </section>
  );
};
