'use client';

import React from 'react';
import { useRiversStore } from '@/lib/store/useRiversStore';
import { Home, LayoutGrid, PlusCircle, MessageSquare, User } from 'lucide-react';
import { motion } from 'framer-motion';

export const MobileBottomNav: React.FC = () => {
  const {
    activeView,
    setActiveView,
    mobileActiveTab,
    setMobileActiveTab,
    openListingCreator,
    setSelectedCategory,
    savedListingIds,
    t,
  } = useRiversStore();

  if (activeView !== 'discovery') return null;

  return (
    <nav
      className="sm:hidden fixed bottom-0 inset-x-0 z-50 bg-slate-950/95 border-t border-cyan-500/20 backdrop-blur-2xl px-2 pt-1.5 shadow-[0_-10px_25px_rgba(0,0,0,0.8)] safe-bottom"
    >
      <div className="flex items-center justify-around relative">
        {/* Home Tab */}
        <button
          onClick={() => {
            setMobileActiveTab('home');
            setSelectedCategory('all');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all cursor-pointer ${
            mobileActiveTab === 'home'
              ? 'text-cyan-400 font-bold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] font-medium">{t('home')}</span>
        </button>

        {/* Categories Tab */}
        <button
          onClick={() => {
            setMobileActiveTab('categories');
            const el = document.getElementById('categories-section');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all cursor-pointer ${
            mobileActiveTab === 'categories'
              ? 'text-cyan-400 font-bold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <LayoutGrid className="w-5 h-5" />
          <span className="text-[10px] font-medium">{t('categories')}</span>
        </button>

        {/* Floating Post Ad Center Button */}
        <button
          onClick={() => {
            setMobileActiveTab('post');
            openListingCreator();
          }}
          className="relative -top-4 flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r from-cyan-400 to-blue-600 text-slate-950 font-bold shadow-[0_0_20px_rgba(6,182,212,0.6)] active:scale-95 transition-all cursor-pointer"
        >
          <PlusCircle className="w-7 h-7 fill-slate-950 text-cyan-400" />
        </button>

        {/* Messages / Saved Tab */}
        <button
          onClick={() => {
            setMobileActiveTab('messages');
          }}
          className={`relative flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all cursor-pointer ${
            mobileActiveTab === 'messages'
              ? 'text-cyan-400 font-bold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <div className="relative">
            <MessageSquare className="w-5 h-5" />
            {savedListingIds.length > 0 && (
              <span className="absolute -top-1 -right-1.5 flex items-center justify-center w-4 h-4 rounded-full bg-cyan-400 text-slate-950 font-bold text-[9px]">
                {savedListingIds.length}
              </span>
            )}
          </div>
          <span className="text-[10px] font-medium">{t('messages')}</span>
        </button>

        {/* My Account Tab */}
        <button
          onClick={() => {
            setMobileActiveTab('account');
            setActiveView('admin');
          }}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all cursor-pointer ${
            mobileActiveTab === 'account'
              ? 'text-cyan-400 font-bold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <User className="w-5 h-5" />
          <span className="text-[10px] font-medium">{t('myAccount')}</span>
        </button>
      </div>
    </nav>
  );
};
