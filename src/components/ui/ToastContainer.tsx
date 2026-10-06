'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRiversStore } from '@/lib/store/useRiversStore';
import { CheckCircle2, AlertCircle, Info, XCircle, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { notifications, removeNotification } = useRiversStore();

  const iconMap = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />,
    info: <Info className="w-5 h-5 text-cyan-400 shrink-0" />,
    warning: <AlertCircle className="w-5 h-5 text-amber-400 shrink-0" />,
    error: <XCircle className="w-5 h-5 text-red-400 shrink-0" />,
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
      <AnimatePresence>
        {notifications.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className="pointer-events-auto flex items-center justify-between p-4 rounded-xl bg-slate-950/90 border border-cyan-500/30 backdrop-blur-xl shadow-2xl shadow-cyan-950/40 text-slate-200 text-sm gap-3"
          >
            <div className="flex items-center gap-3">
              {iconMap[toast.type]}
              <span className="font-medium">{toast.message}</span>
            </div>
            <button
              onClick={() => removeNotification(toast.id)}
              className="text-slate-400 hover:text-slate-200 p-1 rounded-lg transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
