'use client';

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { clsx } from 'clsx';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '4xl';
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  maxWidth = 'xl',
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'auto';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '4xl': 'max-w-4xl',
  };

  return (
    <AnimatePresence>
      {isOpen && (
        /*
         * Scroll wrapper: fills the viewport and owns the scrollbar.
         * `overscroll-contain` prevents the body from scrolling behind it.
         */
        <div className="fixed inset-0 z-50 overflow-y-auto overscroll-contain">
          {/* Backdrop — sits behind everything via `fixed` */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-xl"
          />

          {/*
           * Centering shell: `min-h-full` makes this div at least as tall as
           * the scroll container so `items-center` centres the modal on large
           * screens, while still letting it grow and scroll freely on mobile.
           */}
          <div className="flex min-h-full items-center justify-center p-4 sm:p-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className={clsx(
                'relative z-10 w-full rounded-2xl bg-slate-950/90 border border-cyan-500/20 shadow-2xl shadow-cyan-950/40 backdrop-blur-2xl overflow-hidden my-8',
                maxWidthClasses[maxWidth]
              )}
            >
              {/* Top liquid glowing line */}
              <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-cyan-500 via-blue-500 to-teal-400" />

              {/* Header */}
              {(title || subtitle) && (
                <div className="flex items-start justify-between p-6 pb-4 border-b border-slate-800/80">
                  <div>
                    {title && (
                      <h3 className="text-xl font-bold text-slate-100 tracking-tight flex items-center gap-2">
                        {title}
                      </h3>
                    )}
                    {subtitle && <p className="text-xs text-slate-400 mt-1">{subtitle}</p>}
                  </div>
                  <button
                    onClick={onClose}
                    className="p-2 text-slate-400 hover:text-cyan-400 hover:bg-slate-900 rounded-xl transition-all"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              )}

              {/* Body */}
              <div className="p-6">{children}</div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};
