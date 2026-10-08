'use client';

import React, { useState } from 'react';
import { useRiversStore } from '@/lib/store/useRiversStore';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Phone, MessageSquare, Copy, Check, ShieldCheck, Sparkles, Star } from 'lucide-react';

export const SellerContactModal: React.FC = () => {
  const { phoneRevealListing, closePhoneRevealModal, t, addNotification } = useRiversStore();
  const [copied, setCopied] = useState(false);

  if (!phoneRevealListing) return null;

  const { seller, title } = phoneRevealListing;
  const phoneNumber = seller.phone || '+962 7 9123 4567';
  const whatsappNumber = seller.whatsapp || '962791234567';

  const handleCopyNumber = () => {
    navigator.clipboard.writeText(phoneNumber);
    setCopied(true);
    addNotification('success', t('numberCopied'));
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <Modal
      isOpen={!!phoneRevealListing}
      onClose={closePhoneRevealModal}
      title={t('contactModalTitle')}
    >
      <div className="space-y-6 text-slate-100">
        {/* Seller Info Card */}
        <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-900/90 border border-slate-800">
          <img
            src={seller.avatar}
            alt={seller.name}
            className="w-14 h-14 rounded-2xl object-cover border-2 border-cyan-500/40"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h4 className="font-bold text-base text-slate-100 truncate">{seller.name}</h4>
              {seller.isVerified && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  <ShieldCheck className="w-3 h-3" />
                  {t('sellerVerifiedBadge')}
                </span>
              )}
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
              <span className="flex items-center gap-1 text-amber-400 font-bold">
                <Star className="w-3.5 h-3.5 fill-amber-400" />
                {seller.rating}
              </span>
              <span>•</span>
              <span>{seller.location}</span>
              <span>•</span>
              <span>{seller.salesCount} deals</span>
            </div>
          </div>
        </div>

        {/* Ad Title Reference */}
        <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-300 line-clamp-1">
          <span className="text-cyan-400 font-semibold">Ad:</span> {title}
        </div>

        {/* Big Phone Action Box */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-blue-950/60 via-slate-900 to-cyan-950/40 border border-blue-500/30 text-center space-y-4 shadow-xl">
          <div className="text-xs text-cyan-300 font-mono font-semibold uppercase tracking-wider">
            {t('sellerPhoneNumber')}
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold font-mono text-white tracking-wider dir-ltr select-all">
            {phoneNumber}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <a
              href={`tel:${phoneNumber.replace(/\s+/g, '')}`}
              className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-slate-950 font-extrabold text-sm shadow-lg shadow-blue-500/25 transition-all cursor-pointer"
            >
              <Phone className="w-4 h-4 fill-slate-950" />
              <span>{t('tapToCall')}</span>
            </a>

            <Button
              onClick={handleCopyNumber}
              variant="outline"
              size="md"
              leftIcon={copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            >
              {copied ? t('numberCopied') : t('copyNumber')}
            </Button>
          </div>
        </div>

        {/* WhatsApp Secondary Option */}
        <a
          href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(`Hi ${seller.name}, I am interested in your listing: "${title}"`)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full p-3.5 rounded-xl bg-emerald-950/60 hover:bg-emerald-900/60 border border-emerald-500/40 text-emerald-300 font-bold text-xs sm:text-sm transition-all shadow-md group cursor-pointer"
        >
          <MessageSquare className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
          <span>{t('openWhatsapp')}</span>
        </a>

        {/* Safety Note */}
        <div className="flex items-center gap-2 text-[11px] text-slate-400 justify-center">
          <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0" />
          <span>{t('riversEscrowGuarantee')} — Trade safely with verified sellers.</span>
        </div>
      </div>
    </Modal>
  );
};
