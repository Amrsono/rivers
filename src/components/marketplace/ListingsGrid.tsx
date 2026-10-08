'use client';

import React from 'react';
import { useRiversStore, FilterTab } from '@/lib/store/useRiversStore';
import { Listing } from '@/lib/types';
import {
  Phone,
  MessageSquare,
  Heart,
  ShieldCheck,
  Zap,
  MapPin,
  Camera,
  Filter,
  Check,
  Eye,
  SlidersHorizontal,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const ListingsGrid: React.FC = () => {
  const {
    listings,
    searchQuery,
    selectedCategory,
    selectedSubcategory,
    selectedCity,
    selectedCountry,
    activeFilterTab,
    setActiveFilterTab,
    openListingDetail,
    openPhoneRevealModal,
    savedListingIds,
    toggleSaveListing,
    formatPrice,
    language,
    t,
  } = useRiversStore();

  // Filter listings based on category, subcategory, city, search query, and filter tab
  const filteredListings = listings.filter((listing) => {
    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = listing.title.toLowerCase().includes(q) || (listing.titleAr && listing.titleAr.includes(q));
      const matchTag = listing.tags.some((t) => t.toLowerCase().includes(q));
      const matchCat = listing.categoryName?.toLowerCase().includes(q);
      const matchLoc = listing.location.toLowerCase().includes(q);
      if (!matchTitle && !matchTag && !matchCat && !matchLoc) return false;
    }

    // Category filter
    if (selectedCategory !== 'all' && listing.categoryId !== selectedCategory) {
      return false;
    }

    // Subcategory filter
    if (selectedSubcategory !== 'all' && listing.subCategory !== selectedSubcategory) {
      return false;
    }

    // City filter
    if (selectedCity !== 'all') {
      if (listing.city && listing.city.toLowerCase() !== selectedCity.toLowerCase()) {
        if (!listing.location.toLowerCase().includes(selectedCity.toLowerCase())) {
          return false;
        }
      }
    }

    // Filter tab
    if (activeFilterTab === 'bnpl' && !listing.flowFinanceEligible) return false;
    if (activeFilterTab === 'verified' && !listing.safetyBadge) return false;
    if (activeFilterTab === 'top_rated' && !listing.featured) return false;

    return true;
  });

  return (
    <section className="mx-auto max-w-7xl px-3 sm:px-6 pb-28 sm:pb-20">
      {/* Grid Subheader & Filters Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-900">
        <div>
          <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <span>{t('liveP2pCatalog')}</span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              {filteredListings.length}
            </span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            {t('showingVerifiedListings', { count: filteredListings.length })}
          </p>
        </div>

        {/* Filter Tabs Cluster */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveFilterTab('all')}
            className={`px-3 py-1.5 rounded-xl font-semibold transition-all cursor-pointer whitespace-nowrap ${
              activeFilterTab === 'all'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {t('filterAll')}
          </button>

          <button
            onClick={() => setActiveFilterTab('verified')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-semibold transition-all cursor-pointer whitespace-nowrap ${
              activeFilterTab === 'verified'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            {t('filterVerified')}
          </button>

          <button
            onClick={() => setActiveFilterTab('bnpl')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-semibold transition-all cursor-pointer whitespace-nowrap ${
              activeFilterTab === 'bnpl'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-cyan-400" />
            {t('filterBnpl')}
          </button>
        </div>
      </div>

      {/* Empty State */}
      {filteredListings.length === 0 ? (
        <div className="text-center py-16 px-4 rounded-3xl bg-slate-950/60 border border-slate-900">
          <div className="w-16 h-16 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto mb-4 text-slate-500">
            <Filter className="w-8 h-8 text-cyan-500/50" />
          </div>
          <h4 className="text-base font-bold text-slate-200">{t('noListingsFound')}</h4>
          <p className="text-xs text-slate-400 max-w-md mx-auto mt-1 mb-6">
            {t('noListingsDesc')}
          </p>
          <button
            onClick={() => {
              useRiversStore.getState().setSelectedCategory('all');
              useRiversStore.getState().setSelectedSubcategory('all');
              useRiversStore.getState().setSelectedCity('all');
              useRiversStore.getState().setSearchQuery('');
              useRiversStore.getState().setActiveFilterTab('all');
            }}
            className="px-4 py-2 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-semibold text-xs hover:bg-cyan-500/30 transition-colors cursor-pointer"
          >
            {t('resetAllFilters')}
          </button>
        </div>
      ) : (
        /* Listings Cards Grid */
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5">
          <AnimatePresence>
            {filteredListings.map((item) => {
              const isSaved = savedListingIds.includes(item.id);
              const titleText = language === 'ar' && item.titleAr ? item.titleAr : item.title;

              return (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.2 }}
                  className="group relative flex flex-col justify-between rounded-3xl bg-slate-950/80 border border-slate-800/80 hover:border-cyan-500/50 shadow-xl hover:shadow-[0_10px_30px_rgba(6,182,212,0.15)] transition-all duration-300 overflow-hidden"
                >
                  {/* Top Image Thumbnail Container */}
                  <div
                    onClick={() => openListingDetail(item)}
                    className="relative aspect-16/10 w-full bg-slate-900 overflow-hidden cursor-pointer"
                  >
                    <img
                      src={item.images[0]}
                      alt={titleText}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />

                    {/* Top Badges overlay */}
                    <div className="absolute top-3 inset-x-3 flex items-center justify-between pointer-events-none">
                      <div className="flex items-center gap-1.5">
                        {item.featured && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/90 text-slate-950 font-mono shadow-md">
                            FEATURED
                          </span>
                        )}
                        {item.safetyBadge && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/90 text-slate-950 font-mono shadow-md flex items-center gap-1">
                            <ShieldCheck className="w-3 h-3" /> VERIFIED
                          </span>
                        )}
                      </div>

                      {/* Photo Count Badge */}
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-slate-950/80 backdrop-blur-md text-slate-200 border border-slate-700/80 flex items-center gap-1">
                        <Camera className="w-3 h-3 text-cyan-400" />
                        {item.images.length}
                      </span>
                    </div>

                    {/* Bookmark Heart Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleSaveListing(item.id);
                      }}
                      className={`absolute bottom-3 right-3 rtl:left-3 rtl:right-auto p-2 rounded-full backdrop-blur-xl border transition-all cursor-pointer ${
                        isSaved
                          ? 'bg-pink-500 text-white border-pink-400 shadow-lg'
                          : 'bg-slate-950/70 text-slate-300 border-slate-700 hover:text-pink-400 hover:bg-slate-900'
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${isSaved ? 'fill-white' : ''}`} />
                    </button>
                  </div>

                  {/* Card Body */}
                  <div className="p-2.5 sm:p-4 flex-1 flex flex-col justify-between">
                    <div>
                      {/* Price Header */}
                      <div className="flex items-baseline justify-between mb-1.5">
                        <span className="text-base sm:text-xl font-extrabold font-mono bg-gradient-to-r from-white via-slate-100 to-cyan-400 bg-clip-text text-transparent">
                          {formatPrice(item.price)}
                        </span>
                        {item.flowFinanceEligible && (
                          <span className="hidden sm:inline text-[10px] font-mono text-cyan-400 bg-cyan-950/50 px-2 py-0.5 rounded-md border border-cyan-500/30">
                            0% APR
                          </span>
                        )}
                      </div>

                      {/* Title */}
                      <h4
                        onClick={() => openListingDetail(item)}
                        className="text-xs sm:text-sm font-bold text-slate-100 line-clamp-2 hover:text-cyan-300 transition-colors cursor-pointer mb-2"
                      >
                        {titleText}
                      </h4>

                      {/* Specs Chips if available */}
                      {item.specs && (
                        <div className="flex flex-wrap gap-1.5 mb-3">
                          {Object.entries(item.specs).slice(0, 3).map(([key, val]) => (
                            <span
                              key={key}
                              className="px-2 py-0.5 rounded-md text-[10px] font-mono bg-slate-900 text-slate-300 border border-slate-800"
                            >
                              {val}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div>
                      {/* Location & Time */}
                      <div className="flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-900 pt-2.5 mb-3">
                        <span className="flex items-center gap-1 truncate max-w-[170px]">
                          <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                          <span className="truncate">{item.location}</span>
                        </span>
                        <span className="text-[10px] font-mono text-slate-500 shrink-0">
                          {t('timeAgo')}
                        </span>
                      </div>

                      {/* OpenSooq Contact Action Bar */}
                      <div className="grid grid-cols-2 gap-1.5 sm:gap-2 pt-1">
                        {/* Call / Reveal Phone Button */}
                        <button
                          onClick={() => openPhoneRevealModal(item)}
                          className="flex items-center justify-center gap-1 sm:gap-1.5 py-2 px-1.5 sm:px-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-slate-950 font-extrabold text-[11px] sm:text-xs shadow-md transition-all cursor-pointer active:scale-95"
                        >
                          <Phone className="w-3.5 h-3.5 fill-slate-950 shrink-0" />
                          <span className="truncate">{t('callSeller')}</span>
                        </button>

                        {/* Direct Chat Button */}
                        <button
                          onClick={() => openListingDetail(item)}
                          className="flex items-center justify-center gap-1 sm:gap-1.5 py-2 px-1.5 sm:px-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-slate-200 font-bold text-[11px] sm:text-xs transition-all cursor-pointer active:scale-95"
                        >
                          <MessageSquare className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                          <span className="truncate">{t('chat')}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </section>
  );
};
