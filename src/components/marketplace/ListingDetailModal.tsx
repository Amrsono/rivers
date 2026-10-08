'use client';

import React, { useState } from 'react';
import { useRiversStore } from '@/lib/store/useRiversStore';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import {
  Phone,
  MessageSquare,
  ShieldCheck,
  Zap,
  MapPin,
  Heart,
  Share2,
  Check,
  Star,
  Clock,
  Eye,
  Sliders,
  ChevronRight,
  ChevronLeft,
} from 'lucide-react';

export const ListingDetailModal: React.FC = () => {
  const {
    activeListingDetail,
    closeListingDetail,
    openBNPLCheckout,
    openPhoneRevealModal,
    savedListingIds,
    toggleSaveListing,
    formatPrice,
    language,
    t,
    addNotification,
  } = useRiversStore();

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [chatMessage, setChatMessage] = useState('');
  const [messages, setMessages] = useState<string[]>([]);

  if (!activeListingDetail) return null;

  const isSaved = savedListingIds.includes(activeListingDetail.id);
  const titleText = language === 'ar' && activeListingDetail.titleAr ? activeListingDetail.titleAr : activeListingDetail.title;
  const seller = activeListingDetail.seller;

  const handleSendMessage = () => {
    if (!chatMessage.trim()) return;
    setMessages([...messages, chatMessage]);
    setChatMessage('');
    addNotification('info', 'Message sent to seller');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: titleText,
        text: activeListingDetail.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      addNotification('success', 'Listing URL copied to clipboard');
    }
  };

  return (
    <Modal
      isOpen={!!activeListingDetail}
      onClose={closeListingDetail}
      title={titleText}
      maxWidth="4xl"
    >
      <div className="space-y-6 text-slate-100">
        {/* Top Media Gallery & Primary Summary */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Gallery View */}
          <div className="md:col-span-7 space-y-3">
            {/* Main Image Slider */}
            <div className="relative aspect-16/10 rounded-2xl bg-slate-900 overflow-hidden border border-slate-800">
              <img
                src={activeListingDetail.images[activeImageIndex]}
                alt={titleText}
                className="w-full h-full object-cover"
              />

              {/* Slider Arrow Nav */}
              {activeListingDetail.images.length > 1 && (
                <>
                  <button
                    onClick={() =>
                      setActiveImageIndex((prev) =>
                        prev === 0 ? activeListingDetail.images.length - 1 : prev - 1
                      )
                    }
                    className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-slate-950/70 border border-slate-800 text-white hover:bg-slate-900 transition-colors cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() =>
                      setActiveImageIndex((prev) =>
                        prev === activeListingDetail.images.length - 1 ? 0 : prev + 1
                      )
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-slate-950/70 border border-slate-800 text-white hover:bg-slate-900 transition-colors cursor-pointer"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </>
              )}

              {/* Counter Pill */}
              <span className="absolute bottom-3 right-3 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-slate-950/80 backdrop-blur-md border border-slate-800 text-slate-300">
                {activeImageIndex + 1} / {activeListingDetail.images.length}
              </span>
            </div>

            {/* Thumbnail Strip */}
            {activeListingDetail.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                {activeListingDetail.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative w-16 h-14 rounded-xl overflow-hidden border-2 shrink-0 transition-all cursor-pointer ${
                      activeImageIndex === idx
                        ? 'border-cyan-400 scale-105 shadow-md'
                        : 'border-slate-800 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="thumb" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Side Summary */}
          <div className="md:col-span-5 flex flex-col justify-between space-y-4">
            <div>
              {/* Price Tag */}
              <div className="p-4 rounded-2xl bg-slate-900/90 border border-cyan-500/30 mb-4">
                <div className="text-xs text-slate-400 mb-1">{t('fullEscrowPrice')}</div>
                <div className="text-3xl font-extrabold font-mono text-cyan-300">
                  {formatPrice(activeListingDetail.price)}
                </div>
                {activeListingDetail.flowFinanceEligible && (
                  <div className="mt-2 text-xs font-mono text-cyan-400 bg-cyan-950/60 p-2 rounded-xl border border-cyan-500/30 flex items-center gap-1.5">
                    <Zap className="w-4 h-4 text-cyan-400 shrink-0" />
                    <span>{t('bnplSplitPreview', { amount: formatPrice(Math.round(activeListingDetail.price / 4)) })}</span>
                  </div>
                )}
              </div>

              {/* Location & View Stats */}
              <div className="space-y-2 text-xs text-slate-300 font-mono">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>{activeListingDetail.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-slate-400 shrink-0" />
                  <span>Posted Oct 8, 2026</span>
                </div>
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4 text-slate-400 shrink-0" />
                  <span>{t('viewsCount', { count: activeListingDetail.viewCount })}</span>
                </div>
              </div>
            </div>

            {/* Main Action Buttons Cluster */}
            <div className="space-y-2.5">
              {/* Call Seller Button */}
              <button
                onClick={() => openPhoneRevealModal(activeListingDetail)}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-slate-950 font-extrabold text-sm shadow-lg shadow-cyan-500/20 transition-all cursor-pointer"
              >
                <Phone className="w-4.5 h-4.5 fill-slate-950" />
                <span>{t('callSeller')} ({seller.phone || 'Reveal Phone'})</span>
              </button>

              {/* BNPL Checkout Button */}
              {activeListingDetail.flowFinanceEligible && (
                <Button
                  onClick={() => openBNPLCheckout(activeListingDetail)}
                  variant="glass"
                  size="md"
                  className="w-full text-cyan-300 border-cyan-500/40"
                  leftIcon={<Zap className="w-4 h-4 text-cyan-400" />}
                >
                  Buy with 0% APR BNPL
                </Button>
              )}

              {/* Save & Share row */}
              <div className="flex items-center gap-2 pt-1">
                <button
                  onClick={() => toggleSaveListing(activeListingDetail.id)}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                    isSaved
                      ? 'bg-pink-500/20 text-pink-300 border-pink-500/40'
                      : 'bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-800'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${isSaved ? 'fill-pink-400 text-pink-400' : ''}`} />
                  <span>{isSaved ? 'Saved' : t('saveAd')}</span>
                </button>

                <button
                  onClick={handleShare}
                  className="flex items-center justify-center gap-2 p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white transition-all cursor-pointer"
                >
                  <Share2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Technical Specs Table */}
        {activeListingDetail.specs && (
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-900">
            <h4 className="text-xs font-mono font-bold uppercase text-cyan-400 mb-3 tracking-wider">
              {t('itemDetailsTags')}
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              {Object.entries(activeListingDetail.specs).map(([key, value]) => (
                <div key={key} className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
                  <span className="block text-[10px] text-slate-400 font-mono">{key}</span>
                  <span className="font-bold text-slate-100">{value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Description Section */}
        <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-900">
          <h4 className="text-xs font-mono font-bold uppercase text-slate-400 mb-2 tracking-wider">
            Description
          </h4>
          <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line">
            {activeListingDetail.description}
          </p>
        </div>

        {/* Seller Info Card */}
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img
              src={seller.avatar}
              alt={seller.name}
              className="w-12 h-12 rounded-xl object-cover border border-cyan-500/30"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-slate-100">{seller.name}</span>
                {seller.isVerified && (
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                )}
              </div>
              <span className="text-xs text-slate-400">
                Member since {seller.joinedDate} • {seller.location}
              </span>
            </div>
          </div>

          <Button
            onClick={() => openPhoneRevealModal(activeListingDetail)}
            variant="outline"
            size="sm"
            leftIcon={<Phone className="w-3.5 h-3.5" />}
          >
            {t('revealPhone')}
          </Button>
        </div>

        {/* Embedded Chat with Seller */}
        <div className="p-4 rounded-2xl bg-slate-950/90 border border-slate-900 space-y-3">
          <h4 className="text-xs font-mono font-bold uppercase text-cyan-400 flex items-center gap-2">
            <MessageSquare className="w-4 h-4" />
            {t('directSellerChannel')}
          </h4>

          {messages.length > 0 && (
            <div className="space-y-2 max-h-40 overflow-y-auto p-2 bg-slate-900/50 rounded-xl">
              {messages.map((msg, idx) => (
                <div key={idx} className="p-2 rounded-lg bg-cyan-950/60 border border-cyan-500/30 text-xs text-cyan-200">
                  {msg}
                </div>
              ))}
            </div>
          )}

          <div className="flex gap-2">
            <input
              type="text"
              value={chatMessage}
              onChange={(e) => setChatMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder={t('chatPlaceholder')}
              className="flex-1 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-cyan-400"
            />
            <Button onClick={handleSendMessage} variant="primary" size="sm">
              {t('sendBtn')}
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
