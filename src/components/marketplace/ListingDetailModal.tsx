'use client';

import React, { useState } from 'react';
import { useRiversStore } from '@/lib/store/useRiversStore';
import { Modal } from '../ui/Modal';
import { ProgressImage } from '../ui/ProgressImage';
import { ConditionBadge, Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import {
  ShieldCheck,
  Zap,
  MapPin,
  Eye,
  MessageSquare,
  Lock,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
} from 'lucide-react';

export const ListingDetailModal: React.FC = () => {
  const { activeListingDetail, closeListingDetail, openBNPLCheckout, addNotification, t, language } =
    useRiversStore();

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isMessageOpen, setIsMessageOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [chatHistory, setChatHistory] = useState([
    { sender: 'seller', text: 'Hi! Thanks for checking out my listing on Rivers. Feel free to ask any technical questions or request extra verification photos!' },
  ]);

  if (!activeListingDetail) return null;

  const item = activeListingDetail;
  const currentImage = item.images[selectedImageIndex] || item.images[0];
  const installment4 = (item.price / 4).toFixed(2);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    setChatHistory((prev) => [
      ...prev,
      { sender: 'user', text: chatInput },
      { sender: 'seller', text: 'Thanks! I have received your message and will reply in under 5 minutes.' },
    ]);
    setChatInput('');
  };

  return (
    <Modal
      isOpen={!!activeListingDetail}
      onClose={closeListingDetail}
      maxWidth="4xl"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Image Carousel & Gallery */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          {/* Main Large Image */}
          <div className="relative h-80 sm:h-96 w-full rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 group">
            <ProgressImage src={currentImage} alt={item.title} priority />

            {/* Navigation Arrows */}
            {item.images.length > 1 && (
              <>
                <button
                  onClick={() =>
                    setSelectedImageIndex((prev) =>
                      prev === 0 ? item.images.length - 1 : prev - 1
                    )
                  }
                  className="absolute ltr:left-3 rtl:right-3 top-1/2 -translate-y-1/2 p-2 rounded-xl bg-slate-950/70 border border-slate-800 text-slate-200 hover:text-cyan-400 backdrop-blur-md transition-all opacity-0 group-hover:opacity-100 cursor-pointer z-20"
                >
                  {language === 'ar' ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
                </button>
                <button
                  onClick={() =>
                    setSelectedImageIndex((prev) =>
                      prev === item.images.length - 1 ? 0 : prev + 1
                    )
                  }
                  className="absolute ltr:right-3 rtl:left-3 top-1/2 -translate-y-1/2 p-2 rounded-xl bg-slate-950/70 border border-slate-800 text-slate-200 hover:text-cyan-400 backdrop-blur-md transition-all opacity-0 group-hover:opacity-100 cursor-pointer z-20"
                >
                  {language === 'ar' ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                </button>
              </>
            )}

            {/* Floating Escrow Badge */}
            <div className="absolute top-4 ltr:left-4 rtl:right-4 z-10 flex items-center gap-2">
              <ConditionBadge condition={item.condition} />
              {item.safetyBadge && (
                <Badge variant="emerald" size="sm">
                  <ShieldCheck className="w-3.5 h-3.5" /> {t('escrowVerified')}
                </Badge>
              )}
            </div>
          </div>

          {/* Thumbnails */}
          {item.images.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-1">
              {item.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 transition-all shrink-0 cursor-pointer ${
                    selectedImageIndex === idx
                      ? 'border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.3)] scale-105'
                      : 'border-slate-800 opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt={`Thumb ${idx}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Technical Product Specifications */}
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80">
            <h4 className="text-xs font-mono uppercase tracking-wider text-cyan-400 mb-2 font-semibold">
              {t('itemDetailsTags')}
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed mb-4">{item.description}</p>

            <div className="flex flex-wrap gap-2">
              {item.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="text-[11px] font-mono px-2.5 py-1 rounded-lg bg-slate-950 text-slate-400 border border-slate-800"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Pricing, Rivers Flow BNPL & Seller Panel */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
          <div>
            {/* Header Title & Category */}
            <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest block mb-1">
              {item.categoryName || 'Marketplace Item'}
            </span>
            <h2 className="text-2xl font-extrabold text-slate-100 tracking-tight mb-3">
              {item.title}
            </h2>

            <div className="flex items-center gap-4 text-xs font-mono text-slate-400 mb-6">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-500" />
                {item.location}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Eye className="w-3.5 h-3.5 text-slate-500" />
                {t('viewsCount', { count: item.viewCount })}
              </span>
            </div>

            {/* Main Price Tag */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 mb-6">
              <span className="text-xs font-mono text-slate-500 uppercase block mb-1">
                {t('fullEscrowPrice')}
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold font-mono text-slate-100">
                  ج.م {item.price.toLocaleString()}
                </span>
                <span className="text-xs font-mono text-cyan-400">EGP</span>
              </div>
            </div>

            {/* RIVERS FLOW FINANCE BNPL PLACEHOLDER WIDGET */}
            <div className="relative p-5 rounded-2xl bg-gradient-to-br from-cyan-950/40 via-slate-950 to-blue-950/40 border border-cyan-500/30 shadow-2xl shadow-cyan-950/30 overflow-hidden mb-6">
              {/* Subtle animated beam line */}
              <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-cyan-400 via-blue-500 to-teal-400" />

              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-400">
                    <Zap className="w-4 h-4 fill-cyan-400" />
                  </div>
                  <span className="text-xs font-bold font-mono tracking-wider text-cyan-300 uppercase">
                    {t('riversFlowFinance')}
                  </span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-500/30">
                  {t('zeroAprInstallments')}
                </span>
              </div>

              {/* Installment Split Preview */}
              <div className="mb-4">
                <p className="text-sm font-semibold text-slate-200">
                  {t('bnplSplitPreview', { amount: installment4 })}
                </p>
                <p className="text-[11px] text-slate-400 mt-1">
                  {t('bnplDescText')}
                </p>
              </div>

              {/* 4-Step Timeline Preview Bar */}
              <div className="grid grid-cols-4 gap-1.5 pt-3 border-t border-cyan-500/20">
                <div className="text-center p-2 rounded-xl bg-cyan-950/60 border border-cyan-500/30">
                  <span className="block text-[9px] font-mono text-cyan-400 font-bold">{t('today')}</span>
                  <span className="text-xs font-mono font-extrabold text-slate-100">ج.م{installment4}</span>
                </div>
                <div className="text-center p-2 rounded-xl bg-slate-900/60 border border-slate-800">
                  <span className="block text-[9px] font-mono text-slate-500">{t('weeks2')}</span>
                  <span className="text-xs font-mono text-slate-300">ج.م{installment4}</span>
                </div>
                <div className="text-center p-2 rounded-xl bg-slate-900/60 border border-slate-800">
                  <span className="block text-[9px] font-mono text-slate-500">{t('weeks4')}</span>
                  <span className="text-xs font-mono text-slate-300">ج.م{installment4}</span>
                </div>
                <div className="text-center p-2 rounded-xl bg-slate-900/60 border border-slate-800">
                  <span className="block text-[9px] font-mono text-slate-500">{t('weeks6')}</span>
                  <span className="text-xs font-mono text-slate-300">ج.م{installment4}</span>
                </div>
              </div>

              <button
                onClick={() => {
                  closeListingDetail();
                  openBNPLCheckout(item);
                }}
                className="w-full mt-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold text-xs uppercase tracking-wider hover:from-cyan-400 hover:to-blue-500 shadow-lg shadow-cyan-950/50 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <Zap className="w-4 h-4 fill-slate-950" />
                {t('selectBnplSplit')}
              </button>
            </div>

            {/* Seller Panel */}
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <img
                  src={item.seller.avatar}
                  alt={item.seller.name}
                  className="w-11 h-11 rounded-full object-cover border-2 border-cyan-500/40"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-slate-100">{item.seller.name}</span>
                    <CheckCircle2 className="w-4 h-4 text-cyan-400 fill-cyan-950" />
                  </div>
                  <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
                    <span className="text-amber-400 font-bold">★ {item.seller.rating}</span>
                    <span>•</span>
                    <span>{item.seller.salesCount} {t('verifiedSales')}</span>
                  </div>
                </div>
              </div>

              <Button
                onClick={() => setIsMessageOpen(!isMessageOpen)}
                variant="outline"
                size="sm"
                leftIcon={<MessageSquare className="w-3.5 h-3.5" />}
              >
                {t('chat')}
              </Button>
            </div>

            {/* Live Chat Panel Toggle */}
            {isMessageOpen && (
              <div className="p-4 rounded-2xl bg-slate-950 border border-cyan-500/30 mb-6 space-y-3">
                <h5 className="text-xs font-mono text-cyan-400 uppercase font-semibold flex items-center gap-2">
                  <MessageSquare className="w-3.5 h-3.5" /> {t('directSellerChannel')}
                </h5>
                <div className="max-h-40 overflow-y-auto space-y-2 p-2 bg-slate-900/60 rounded-xl text-xs">
                  {chatHistory.map((msg, i) => (
                    <div
                      key={i}
                      className={`p-2 rounded-lg ${
                        msg.sender === 'user'
                          ? 'bg-cyan-950 text-cyan-200 ltr:text-right rtl:text-left ltr:ml-6 rtl:mr-6 border border-cyan-500/30'
                          : 'bg-slate-800 text-slate-300 ltr:mr-6 rtl:ml-6'
                      }`}
                    >
                      {msg.text}
                    </div>
                  ))}
                </div>
                <form onSubmit={handleSendMessage} className="flex gap-2">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder={t('chatPlaceholder')}
                    className="flex-1 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-cyan-400"
                  />
                  <Button type="submit" variant="primary" size="sm">
                    {t('sendBtn')}
                  </Button>
                </form>
              </div>
            )}
          </div>

          {/* Primary Action Buttons */}
          <div className="space-y-3">
            <Button
              onClick={() => {
                closeListingDetail();
                const msg = t('escrowInitializedSuccess', { title: item.title });
                addNotification('success', msg);
              }}
              variant="primary"
              size="lg"
              className="w-full"
              leftIcon={<Lock className="w-4 h-4" />}
            >
              {t('buyNowEscrow', { price: item.price.toLocaleString() })}
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
