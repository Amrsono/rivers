'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRiversStore } from '@/lib/store/useRiversStore';
import { COUNTRIES } from '@/lib/constants/countries';
import { MOCK_CATEGORIES } from '@/lib/mock-data';
import { CountryCode } from '@/lib/types';
import { Button } from '../ui/Button';
import {
  Search,
  PlusCircle,
  Zap,
  Wallet,
  LayoutGrid,
  Activity,
  X,
  MapPin,
  ChevronDown,
  Globe,
  Heart,
  MessageSquare,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const Navbar: React.FC = () => {
  const {
    activeView,
    setActiveView,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    selectedCity,
    setSelectedCity,
    selectedCountry,
    setSelectedCountry,
    openListingCreator,
    userBalance,
    listings,
    openListingDetail,
    savedListingIds,
    language,
    setLanguage,
    formatPrice,
    t,
  } = useRiversStore();

  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const countryDropdownRef = useRef<HTMLDivElement>(null);

  const currentCountry = COUNTRIES[selectedCountry] || COUNTRIES.JO;

  // Predictive search filter
  const matchingListings = searchQuery.trim()
    ? listings.filter(
        (l) =>
          l.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (l.titleAr && l.titleAr.includes(searchQuery)) ||
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
      if (
        countryDropdownRef.current &&
        !countryDropdownRef.current.contains(e.target as Node)
      ) {
        setIsCountryDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-40 mx-auto max-w-7xl px-3 sm:px-6 mb-4">
      {/* Top Country & Language Strip */}
      <div className="flex items-center justify-between px-3 sm:px-4 py-1.5 mb-2 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-300 gap-2 overflow-hidden">
        <div className="flex items-center gap-3">
          {/* Country Dropdown Picker */}
          <div ref={countryDropdownRef} className="relative">
            <button
              onClick={() => setIsCountryDropdownOpen(!isCountryDropdownOpen)}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700/70 hover:border-cyan-500/50 transition-all text-xs font-semibold cursor-pointer"
            >
              <span>{currentCountry.flag}</span>
              <span>{language === 'ar' ? currentCountry.nameAr : currentCountry.nameEn}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            <AnimatePresence>
              {isCountryDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 5 }}
                  className="absolute top-9 left-0 rtl:right-0 rtl:left-auto z-50 w-48 p-1.5 rounded-xl bg-slate-950 border border-cyan-500/30 shadow-2xl backdrop-blur-2xl"
                >
                  <div className="px-2 py-1 text-[10px] font-mono text-cyan-400 font-bold uppercase border-b border-slate-900 mb-1">
                    {t('selectCountry')}
                  </div>
                  {Object.values(COUNTRIES).map((country) => (
                    <button
                      key={country.code}
                      onClick={() => {
                        setSelectedCountry(country.code as CountryCode);
                        setIsCountryDropdownOpen(false);
                      }}
                      className={`flex items-center justify-between w-full px-2.5 py-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                        selectedCountry === country.code
                          ? 'bg-cyan-500/20 text-cyan-300 font-bold'
                          : 'text-slate-300 hover:bg-slate-900'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <span>{country.flag}</span>
                        <span>{language === 'ar' ? country.nameAr : country.nameEn}</span>
                      </span>
                      <span className="text-[10px] font-mono text-slate-500">{country.currency}</span>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* City Filter Selector */}
          <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-400">
            <MapPin className="w-3.5 h-3.5 text-cyan-400" />
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="bg-transparent text-slate-200 text-xs font-semibold focus:outline-none cursor-pointer"
            >
              <option value="all" className="bg-slate-950 text-slate-200">
                {t('allCities')}
              </option>
              {currentCountry.cities.map((city) => (
                <option key={city} value={city} className="bg-slate-950 text-slate-200">
                  {city}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Saved Ads counter */}
          <button
            onClick={() => {
              setActiveView('discovery');
              setSelectedCategory('all');
            }}
            className="flex items-center gap-1.5 hover:text-cyan-300 transition-colors cursor-pointer"
          >
            <Heart className="w-3.5 h-3.5 text-pink-500 fill-pink-500" />
            <span className="hidden sm:inline font-mono">{t('savedAds')}</span>
            <span className="px-1.5 py-0.2 rounded-full bg-slate-800 text-[10px] font-bold text-cyan-400">
              {savedListingIds.length}
            </span>
          </button>

          {/* Language Switcher */}
          <div className="flex items-center p-0.5 rounded-lg bg-slate-900 border border-slate-800 text-xs">
            <button
              onClick={() => setLanguage('en')}
              className={`px-2 py-0.5 rounded font-mono text-[11px] font-bold transition-all cursor-pointer ${
                language === 'en'
                  ? 'bg-cyan-500/20 text-cyan-300'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              EN
            </button>
            <button
              onClick={() => setLanguage('ar')}
              className={`px-2 py-0.5 rounded font-bold text-[11px] transition-all cursor-pointer ${
                language === 'ar'
                  ? 'bg-cyan-500/20 text-cyan-300'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              عربي
            </button>
          </div>
        </div>
      </div>

      {/* Main Navbar Card */}
      <div className="relative flex items-center justify-between min-h-[4rem] px-4 sm:px-6 rounded-2xl bg-slate-950/90 border border-cyan-500/20 backdrop-blur-2xl shadow-2xl shadow-cyan-950/30 transition-all duration-300">
        {/* Brand Logo */}
        <div className="flex items-center gap-4 lg:gap-6">
          <button
            onClick={() => {
              setActiveView('discovery');
              setSelectedCategory('all');
              setSelectedCity('all');
              setSearchQuery('');
            }}
            className="group flex items-center gap-2.5 text-left focus:outline-none cursor-pointer"
          >
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 via-blue-500 to-blue-700 shadow-[0_0_20px_rgba(6,182,212,0.4)] group-hover:shadow-[0_0_30px_rgba(6,182,212,0.7)] transition-all duration-300">
              <Zap className="w-5 h-5 text-slate-950 fill-slate-950" />
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-cyan-400 bg-clip-text text-transparent">
                RIVERS
              </span>
              <span className="block text-[9px] font-mono tracking-widest text-cyan-400/80 uppercase">
                {t('brandTagline')}
              </span>
            </div>
          </button>
        </div>

        {/* Integrated Category + Search Bar */}
        <div ref={searchContainerRef} className="relative flex-1 max-w-lg lg:max-w-xl mx-3 hidden sm:block">
          <div
            className={`relative flex items-center w-full h-11 rounded-xl bg-slate-900/90 border transition-all duration-300 ${
              isSearchFocused
                ? 'border-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.25)] ring-1 ring-cyan-500/30'
                : 'border-slate-800 hover:border-slate-700'
            }`}
          >
            {/* Category Filter Dropdown in Search */}
            <div className="hidden lg:flex items-center px-3 border-r rtl:border-r-0 rtl:border-l border-slate-800 shrink-0">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-transparent text-xs text-slate-300 font-semibold focus:outline-none cursor-pointer max-w-[130px] truncate"
              >
                <option value="all" className="bg-slate-950 text-slate-200">
                  {t('selectCategory')}
                </option>
                {MOCK_CATEGORIES.map((cat) => (
                  <option key={cat.id} value={cat.id} className="bg-slate-950 text-slate-200">
                    {language === 'ar' && cat.nameAr ? cat.nameAr : cat.name}
                  </option>
                ))}
              </select>
            </div>

            <Search className="w-4 h-4 text-cyan-400 shrink-0 mx-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              placeholder={t('searchPlaceholder')}
              className="w-full bg-transparent text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="p-1 text-slate-400 hover:text-slate-200 mx-2"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
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
                              {language === 'ar' && item.titleAr ? item.titleAr : item.title}
                            </p>
                            <span className="text-[10px] text-slate-400 font-mono">
                              {item.categoryName} • {item.location}
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-xs font-mono font-bold text-cyan-400 block">
                            {formatPrice(item.price)}
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

        {/* Right Section: Post Free Ad Button & Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Admin Analytics Toggle Button */}
          <button
            onClick={() => setActiveView(activeView === 'admin' ? 'discovery' : 'admin')}
            className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 hover:text-cyan-300 transition-all cursor-pointer"
          >
            <Activity className="w-4 h-4 text-cyan-400" />
            <span>{activeView === 'admin' ? t('marketplaceTab') : t('adminTab')}</span>
          </button>

          {/* Post Free Ad CTA Button */}
          <Button
            onClick={openListingCreator}
            variant="primary"
            size="md"
            leftIcon={<PlusCircle className="w-4 h-4" />}
          >
            <span className="hidden sm:inline">{t('postAdBtn')}</span>
            <span className="sm:hidden">+</span>
          </Button>
        </div>
      </div>

      {/* Mobile Search Bar — visible only on small screens */}
      <div className="sm:hidden mt-2" ref={searchContainerRef}>
        <div
          className={`flex items-center w-full h-11 rounded-xl bg-slate-900/90 border transition-all duration-300 ${
            isSearchFocused
              ? 'border-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.25)] ring-1 ring-cyan-500/30'
              : 'border-slate-800'
          }`}
        >
          <Search className="w-4 h-4 text-cyan-400 shrink-0 mx-3" />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsSearchFocused(true)}
            placeholder={t('searchPlaceholder')}
            className="w-full bg-transparent text-sm text-slate-100 placeholder-slate-500 focus:outline-none"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="p-2 text-slate-400 hover:text-slate-200 mr-1"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Mobile predictive search dropdown */}
        <AnimatePresence>
          {isSearchFocused && searchQuery.trim() !== '' && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              className="absolute inset-x-3 z-50 mt-1 p-3 rounded-2xl bg-slate-950/95 border border-cyan-500/30 shadow-2xl backdrop-blur-2xl max-h-72 overflow-y-auto"
            >
              <div className="text-[11px] font-mono uppercase tracking-wider text-cyan-400 px-3 py-1 font-semibold">
                {t('matchesLabel')} ({matchingListings.length})
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
                        setSearchQuery('');
                      }}
                      className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-900/80 active:bg-slate-900 cursor-pointer transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={item.images[0]}
                          alt={item.title}
                          className="w-10 h-10 rounded-lg object-cover border border-slate-800 shrink-0"
                        />
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-slate-200 line-clamp-1">
                            {language === 'ar' && item.titleAr ? item.titleAr : item.title}
                          </p>
                          <span className="text-[10px] text-slate-400 font-mono">
                            {item.categoryName}
                          </span>
                        </div>
                      </div>
                      <span className="text-xs font-mono font-bold text-cyan-400 shrink-0 ml-2">
                        {formatPrice(item.price)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};
