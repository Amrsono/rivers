import React from 'react';
import { clsx } from 'clsx';
import { motion } from 'framer-motion';

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  glowOnHover?: boolean;
  intensity?: 'low' | 'medium' | 'high';
  className?: string;
  animate?: boolean;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  glowOnHover = true,
  intensity = 'medium',
  className,
  animate = true,
  ...props
}) => {
  const intensityStyles = {
    low: 'bg-slate-950/40 backdrop-blur-md border-slate-800/40',
    medium: 'bg-slate-950/60 backdrop-blur-xl border-slate-800/80 shadow-2xl shadow-slate-950/50',
    high: 'bg-slate-900/70 backdrop-blur-2xl border-cyan-500/20 shadow-2xl shadow-cyan-950/20',
  };

  const Component = animate ? motion.div : 'div';

  return (
    <Component
      whileHover={glowOnHover ? { y: -4, scale: 1.01 } : undefined}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className={clsx(
        'relative rounded-2xl border transition-all duration-300 overflow-hidden',
        intensityStyles[intensity],
        glowOnHover && 'hover:border-cyan-500/40 hover:shadow-[0_0_25px_rgba(6,182,212,0.15)]',
        className
      )}
      {...(props as any)}
    >
      {/* Top subtle liquid cyan light beam line */}
      {glowOnHover && (
        <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />
      )}
      {children}
    </Component>
  );
};
