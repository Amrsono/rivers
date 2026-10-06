'use client';

import React from 'react';
import { useRiversStore, FilterTab } from '@/lib/store/useRiversStore';
import { ProgressImage } from '../ui/ProgressImage';
import { ConditionBadge, Badge } from '../ui/Badge';
import { GlassCard } from '../ui/GlassCard';
import { Button } from '../ui/Button';
import {
  ShieldCheck,
  Zap,
  Eye,
  MapPin,
  Sparkles,
  SearchX,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const ListingsGrid: React.FC = () => {
  const {
    listings,
    searchQuery,
    selectedCategory,
    activeFilterTab,
    setActiveFilterTab,
    openListingDetail,
    t,
  } = useRiversStore();

  // Filter listings based on category, search, and tab
  const filteredListings = listings.filter((item) => {
    // Category match
    if (selectedCategory !== 'all' && item.categoryId !== selectedCategory) {
      return false;
    }
    // Search match
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = item.title.toLowerCase().includes(q);
      const matchDesc = item.description.toLowerCase().includes(q);
      const matchTags = item.tags.some((t) => t.toLowerCase().includes(q));
      const matchCat = item.categoryName?.toLowerCase().includes(q);
      if (!matchTitle && !matchDesc && !matchTags && !matchCat) return false;
    }
    // Tab match
    if (activeFilterTab === 'bnpl' && !item.flowFinanceEligible) return false;
    if (activeFilterTab === 'verified' && !item.safetyBadge) return false;
    if (activeFilterTab === 'top_rated' && item.seller.rating < 4.9) return false;

    return true;
  });

  const filterTabs: Array<{ id: FilterTab; labelKey: keyof typeof import('@/lib/i18n/translations').translations['en']; icon?: React.ReactNode }> = [
    { id: 'all', labelKey: 'filterAll' },
    { id: 'bnpl', labelKey: 'filterBnpl', icon: <Zap className="w-3.5 h-3.5 text-cyan-400" /> },
    { id: 'verified', labelKey: 'filterVerified', icon: <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> },
    { id: 'top_rated', labelKey: 'filterTopRated', icon: <Sparkles className="w-3.5 h-3.5 text-amber-400" /> },
  ];

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 mb-16">
      {/* Controls Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-slate-950/80 border border-slate-800 overflow-x-auto max-w-full">
          {filterTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveFilterTab(tab.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                activeFilterTab === tab.id
                  ? 'bg-slate-900 text-cyan-300 border border-cyan-500/40 shadow-lg shadow-cyan-950/30 font-bold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
              }`}
            >
              {tab.icon}
              {t(tab.labelKey)}
            </button>
          ))}
        </div>

        {/* Counter Info */}
        <div className="flex items-center gap-3 text-xs font-mono text-slate-400">
          <span>
            {t('showingVerifiedListings', { count: filteredListings.length })}
          </span>
        </div>
      </div>

      {/* Grid View */}
      {filteredListings.length === 0 ? (
        <GlassCard className="p-12 text-center my-8 max-w-md mx-auto">
          <SearchX className="w-12 h-12 text-slate-600 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-slate-200 mb-1">{t('noListingsFound')}</h3>
          <p className="text-xs text-slate-400 mb-6">{t('noListingsDesc')}</p>
          <Button
            onClick={() => {
              setActiveFilterTab('all');
              useRiversStore.getState().setSelectedCategory('all');
              useRiversStore.getState().setSearchQuery('');
            }}
            variant="secondary"
            size="sm"
          >
            {t('resetAllFilters')}
          </Button>
        </GlassCard>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredListings.map((item) => {
              const bnplMonthly = (item.price / 4).toFixed(0);
              return (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                >
                  <GlassCard
                    onClick={() => openListingDetail(item)}
                    className="group flex flex-col h-full cursor-pointer border-slate-800/80 hover:border-cyan-500/40"
                  >
                    {/* Media Header Container */}
                    <div className="relative h-64 w-full overflow-hidden bg-slate-950">
                      <ProgressImage
                        src={item.images[0]}
                        alt={item.title}
                        priority
                        className="group-hover:scale-105 transition-transform duration-700"
                      />

                      {/* Top Badges */}
                      <div className="absolute top-3 inset-x-3 flex items-center justify-between z-20 pointer-events-none">
                        <ConditionBadge condition={item.condition} />
                        {item.safetyBadge && (
                          <Badge variant="emerald" size="sm" className="shadow-lg backdrop-blur-md">
                            <ShieldCheck className="w-3 h-3" /> {t('escrowVerified')}
                          </Badge>
                        )}
                      </div>

                      {/* Rivers Flow Finance BNPL Sticker */}
                      {item.flowFinanceEligible && (
                        <div className="absolute bottom-3 ltr:left-3 rtl:right-3 z-20 bg-slate-950/80 backdrop-blur-md border border-cyan-500/40 px-2.5 py-1 rounded-lg flex items-center gap-1.5 shadow-xl">
                          <Zap className="w-3.5 h-3.5 text-cyan-400 fill-cyan-400" />
                          <span className="text-[10px] font-mono font-bold text-cyan-300">
                            {t('orWithRiversFlow', { amount: bnplMonthly })}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Content Section */}
                    <div className="p-5 flex flex-col flex-1 justify-between">
                      <div>
                        {/* Title */}
                        <h3 className="text-base font-bold text-slate-100 group-hover:text-cyan-300 transition-colors line-clamp-2 mb-2 leading-snug">
                          {item.title}
                        </h3>

                        {/* Location & Category */}
                        <div className="flex items-center gap-3 text-xs text-slate-400 mb-4 font-mono">
                          <span className="flex items-center gap-1 text-slate-400">
                            <MapPin className="w-3.5 h-3.5 text-slate-500" />
                            {item.location}
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Eye className="w-3.5 h-3.5 text-slate-500" />
                            {t('viewsCount', { count: item.viewCount })}
                          </span>
                        </div>
                      </div>

                      {/* Footer Price & Actions */}
                      <div className="pt-4 border-t border-slate-900 flex items-end justify-between gap-3">
                        <div>
                          <span className="text-[10px] font-mono text-slate-500 uppercase block leading-none mb-1">
                            {t('listingPrice')}
                          </span>
                          <span className="text-xl font-extrabold font-mono text-slate-100 group-hover:text-cyan-400 transition-colors">
                            ج.م {item.price.toLocaleString()}
                          </span>
                        </div>

                        {/* Seller Avatar */}
                        <div className="flex items-center gap-2">
                          <img
                            src={item.seller.avatar}
                            alt={item.seller.name}
                            className="w-8 h-8 rounded-full object-cover border border-cyan-500/40 shadow-sm"
                          />
                          <div className="hidden sm:block ltr:text-right rtl:text-left">
                            <span className="text-xs font-semibold text-slate-300 block leading-tight">
                              {item.seller.name}
                            </span>
                            <span className="text-[10px] text-amber-400 font-mono font-medium">
                              ★ {item.seller.rating}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </GlassCard>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </section>
  );
};
