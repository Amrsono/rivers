'use client';

import React, { useState } from 'react';
import { useRiversStore } from '@/lib/store/useRiversStore';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import {
  Zap,
  ShieldCheck,
  Calendar,
  CreditCard,
  Lock,
  CheckCircle2,
  HelpCircle,
  ArrowRight,
  Wallet,
} from 'lucide-react';
import { motion } from 'framer-motion';

export const BNPLCheckoutModal: React.FC = () => {
  const { activeBNPLCheckout, closeBNPLCheckout, addNotification, userBalance } =
    useRiversStore();

  const [paymentMethod, setPaymentMethod] = useState<'wallet' | 'card'>('wallet');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!activeBNPLCheckout) return null;

  const item = activeBNPLCheckout;
  const totalPrice = item.price;
  const installmentAmount = Number((totalPrice / 4).toFixed(2));

  // Date calculation helper
  const today = new Date();
  const formatShortDate = (d: Date) =>
    d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  const date2 = new Date(today);
  date2.setDate(today.getDate() + 14);

  const date3 = new Date(today);
  date3.setDate(today.getDate() + 28);

  const date4 = new Date(today);
  date4.setDate(today.getDate() + 42);

  const schedule = [
    { label: 'Payment 1 (Today)', date: formatShortDate(today), amount: installmentAmount, isToday: true },
    { label: 'Payment 2', date: formatShortDate(date2), amount: installmentAmount, isToday: false },
    { label: 'Payment 3', date: formatShortDate(date3), amount: installmentAmount, isToday: false },
    { label: 'Payment 4', date: formatShortDate(date4), amount: installmentAmount, isToday: false },
  ];

  const handleConfirmBNPL = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      closeBNPLCheckout();
      addNotification(
        'success',
        `Rivers Flow BNPL activated! Initial payment of $${installmentAmount} processed via Escrow.`
      );
    }, 1200);
  };

  return (
    <Modal
      isOpen={!!activeBNPLCheckout}
      onClose={closeBNPLCheckout}
      title="Rivers Flow Finance Checkout"
      subtitle="Split your purchase into 4 interest-free installments. Zero hidden fees."
      maxWidth="xl"
    >
      <div className="space-y-6">
        {/* Item Summary Card */}
        <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
          <img
            src={item.images[0]}
            alt={item.title}
            className="w-16 h-16 rounded-xl object-cover border border-slate-800"
          />
          <div className="flex-1">
            <h4 className="text-sm font-bold text-slate-100 line-clamp-1">{item.title}</h4>
            <span className="text-xs font-mono text-slate-400">
              Total Price: <strong className="text-cyan-400 font-bold">${totalPrice.toLocaleString()} USD</strong>
            </span>
          </div>
          <Badge variant="neon" size="sm">
            <Zap className="w-3 h-3 fill-cyan-400" /> 0% Interest
          </Badge>
        </div>

        {/* Schedule Timeline Breakdown */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-cyan-950/40 via-slate-950 to-slate-950 border border-cyan-500/30">
          <h5 className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-semibold mb-4 flex items-center gap-2">
            <Calendar className="w-4 h-4" /> 4-Payment Schedule Breakdown
          </h5>

          <div className="space-y-3">
            {schedule.map((item, idx) => (
              <div
                key={idx}
                className={`flex items-center justify-between p-3 rounded-xl border transition-colors ${
                  item.isToday
                    ? 'bg-cyan-950/80 border-cyan-400/50 text-cyan-200'
                    : 'bg-slate-900/60 border-slate-800 text-slate-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center font-mono text-xs font-bold ${
                      item.isToday ? 'bg-cyan-400 text-slate-950' : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {idx + 1}
                  </div>
                  <div>
                    <span className="text-xs font-semibold block">{item.label}</span>
                    <span className="text-[10px] font-mono text-slate-400">{item.date}</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-sm font-mono font-extrabold">${item.amount}</span>
                  {item.isToday && (
                    <span className="block text-[9px] font-mono text-cyan-400 font-bold">
                      Due Right Now
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Payment Source Selection */}
        <div>
          <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-2 font-semibold">
            Select Payment Method for First Payment (${installmentAmount})
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setPaymentMethod('wallet')}
              className={`p-3.5 rounded-xl border text-left flex items-center gap-3 transition-all cursor-pointer ${
                paymentMethod === 'wallet'
                  ? 'bg-cyan-950/60 border-cyan-400 text-cyan-300 ring-1 ring-cyan-500/30'
                  : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              <Wallet className="w-5 h-5 text-cyan-400 shrink-0" />
              <div>
                <span className="text-xs font-bold block text-slate-200">Rivers Escrow Wallet</span>
                <span className="text-[10px] font-mono text-slate-400">
                  Balance: ${userBalance.toLocaleString()}
                </span>
              </div>
            </button>

            <button
              onClick={() => setPaymentMethod('card')}
              className={`p-3.5 rounded-xl border text-left flex items-center gap-3 transition-all cursor-pointer ${
                paymentMethod === 'card'
                  ? 'bg-cyan-950/60 border-cyan-400 text-cyan-300 ring-1 ring-cyan-500/30'
                  : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              <CreditCard className="w-5 h-5 text-cyan-400 shrink-0" />
              <div>
                <span className="text-xs font-bold block text-slate-200">Saved Visa •••• 4892</span>
                <span className="text-[10px] font-mono text-slate-400">Instant Auth</span>
              </div>
            </button>
          </div>
        </div>

        {/* Protection Terms */}
        <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-xs font-mono">
          <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-400" />
          <span>Buyer Protection Active: Seller receives funds only after delivery confirmation.</span>
        </div>

        {/* Confirm Button */}
        <Button
          onClick={handleConfirmBNPL}
          isLoading={isProcessing}
          variant="primary"
          size="lg"
          className="w-full"
          leftIcon={<Zap className="w-4 h-4 fill-slate-950" />}
        >
          Confirm & Pay ${installmentAmount} First Installment
        </Button>
      </div>
    </Modal>
  );
};
