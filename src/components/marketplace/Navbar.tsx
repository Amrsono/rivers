'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRiversStore } from '@/lib/store/useRiversStore';
import { Button } from '../ui/Button';
import {
  Search,
  PlusCircle,
  Zap,
  Wallet,
  LayoutGrid,
  Activity,
  X,
  Globe,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const Navbar: React.FC = () => {
  const {
    activeView,
    setActiveView,
    searchQuery,
    setSearchQuery,
    setSelectedCategory,
    openListingCreator,
    userBalance,
    listings,
    openListingDetail,
    language,
    setLanguage,
    t,
  } = useRiversStore();

  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Predictive search filter
  const matchingListings = searchQuery.trim()
    ? listings.filter(
        (l) =>
          l.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          l.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (l.categoryName && l.categoryName.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : [];

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(e.target as Node)
      ) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-4 z-40 mx-auto max-w-7xl px-4 sm:px-6 mb-6">
      <div className="relative flex items-center justify-between h-20 px-6 rounded-2xl bg-slate-950/70 border border-cyan-500/20 backdrop-blur-2xl shadow-2xl shadow-cyan-950/30 transition-all duration-300">
        {/* Top cyan ambient line */}
        <div className="absolute top-0 inset-x-8 h-[1px] bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent" />

        {/* Brand Logo & Navigation */}
        <div className="flex items-center gap-6 lg:gap-8">
          <button
            onClick={() => {
              setActiveView('discovery');
              setSelectedCategory('all');
              setSearchQuery('');
            }}
            className="group flex items-center gap-2.5 text-left focus:outline-none cursor-pointer"
          >
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 shadow-[0_0_20px_rgba(6,182,212,0.4)] group-hover:shadow-[0_0_30px_rgba(6,182,212,0.7)] transition-all duration-300">
              <Zap className="w-5 h-5 text-slate-950 fill-slate-950" />
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-cyan-400 bg-clip-text text-transparent">
                RIVERS
              </span>
              <span className="block text-[10px] font-mono tracking-widest text-cyan-400/80 uppercase">
                {t('brandTagline')}
              </span>
            </div>
          </button>

          {/* Navigation View Tabs */}
          <nav className="hidden md:flex items-center gap-1.5 p-1 rounded-xl bg-slate-900/80 border border-slate-800">
            <button
              onClick={() => setActiveView('discovery')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeView === 'discovery'
                  ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-300 border border-cyan-500/40 shadow-[0_0_15px_rgba(6,182,212,0.2)]'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              {t('marketplaceTab')}
            </button>
            <button
              onClick={() => setActiveView('admin')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeView === 'admin'
                  ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-300 border border-cyan-500/40 shadow-[0_0_15px_rgba(6,182,212,0.2)]'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Activity className="w-3.5 h-3.5 text-cyan-400" />
              {t('adminTab')}
            </button>
          </nav>
        </div>

        {/* Universal Omni-Search Bar */}
        <div ref={searchContainerRef} className="relative flex-1 max-w-md lg:max-w-lg mx-4 hidden sm:block">
          <div
            className={`relative flex items-center w-full h-11 px-4 rounded-xl bg-slate-900/90 border transition-all duration-300 ${
              isSearchFocused
                ? 'border-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.25)] ring-1 ring-cyan-500/30'
                : 'border-slate-800 hover:border-slate-700'
            }`}
          >
            <Search className="w-4 h-4 text-cyan-400 shrink-0 ltr:mr-2.5 rtl:ml-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              placeholder={t('searchPlaceholder')}
              className="w-full bg-transparent text-sm text-slate-100 placeholder-slate-500 focus:outline-none"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="p-1 text-slate-400 hover:text-slate-200"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
            <kbd className="hidden lg:inline-flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-mono text-slate-500 bg-slate-800 border border-slate-700 rounded ltr:ml-2 rtl:mr-2">
              ⌘K
            </kbd>
          </div>

          {/* Predictive Search Dropdown Overlay */}
          <AnimatePresence>
            {isSearchFocused && searchQuery.trim() !== '' && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                className="absolute top-13 inset-x-0 z-50 p-3 rounded-2xl bg-slate-950/95 border border-cyan-500/30 shadow-2xl backdrop-blur-2xl overflow-hidden max-h-96 overflow-y-auto"
              >
                <div className="text-[11px] font-mono uppercase tracking-wider text-cyan-400 px-3 py-1 font-semibold flex items-center justify-between">
                  <span>{t('matchesLabel')} ({matchingListings.length})</span>
                  <span>{t('predictiveAi')}</span>
                </div>
                {matchingListings.length === 0 ? (
                  <div className="py-6 text-center text-xs text-slate-400">
                    {t('noMatchingListings')} &quot;{searchQuery}&quot;
                  </div>
                ) : (
                  <div className="mt-1 divide-y divide-slate-900">
                    {matchingListings.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => {
                          openListingDetail(item);
                          setIsSearchFocused(false);
                        }}
                        className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-900/80 cursor-pointer transition-colors group"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={item.images[0]}
                            alt={item.title}
                            className="w-10 h-10 rounded-lg object-cover border border-slate-800"
                          />
                          <div>
                            <p className="text-xs font-semibold text-slate-200 group-hover:text-cyan-300 transition-colors line-clamp-1">
                              {item.title}
                            </p>
                            <span className="text-[10px] text-slate-400 font-mono">
                              {item.categoryName} • {item.location}
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-xs font-mono font-bold text-cyan-400 block">
                            ${item.price.toLocaleString()}
                          </span>
                          <span className="text-[9px] text-slate-500">
                            {t('orMonthlyBnpl', { amount: (item.price / 4).toFixed(0) })}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right Section: Language Switcher, Escrow Wallet & Actions */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Language Switcher Button */}
          <div className="flex items-center p-1 rounded-xl bg-slate-900/90 border border-slate-800 text-xs">
            <button
              onClick={() => setLanguage('en')}
              className={`px-2.5 py-1 rounded-lg font-mono font-bold transition-all cursor-pointer ${
                language === 'en'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              EN
            </button>
            <button
              onClick={() => setLanguage('ar')}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                language === 'ar'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              العربية
            </button>
          </div>

          {/* Flow Balance Widget */}
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-cyan-500/20 text-xs">
            <Wallet className="w-4 h-4 text-cyan-400" />
            <div className="text-right font-mono">
              <span className="text-[10px] block text-slate-400 leading-none">{t('escrowBalance')}</span>
              <span className="font-bold text-cyan-300">${userBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
            </div>
          </div>

          {/* Create Listing Button */}
          <Button
            onClick={openListingCreator}
            variant="primary"
            size="md"
            leftIcon={<PlusCircle className="w-4 h-4" />}
          >
            <span className="hidden sm:inline">{t('postListingBtn')}</span>
            <span className="sm:hidden">+</span>
          </Button>
        </div>
      </div>
    </header>
  );
};
