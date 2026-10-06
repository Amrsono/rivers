import React from 'react';
import { clsx } from 'clsx';
import { ItemCondition } from '@/lib/types';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'neon' | 'glass' | 'cyan' | 'emerald' | 'amber' | 'purple';
  size?: 'sm' | 'md';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'cyan',
  size = 'md',
  className,
}) => {
  const variantStyles = {
    neon: 'bg-cyan-500/10 text-cyan-300 border border-cyan-400/40 shadow-[0_0_12px_rgba(6,182,212,0.25)]',
    glass: 'bg-slate-900/60 backdrop-blur-md text-slate-300 border border-slate-700/50',
    cyan: 'bg-cyan-950/80 text-cyan-400 border border-cyan-500/30',
    emerald: 'bg-emerald-950/80 text-emerald-400 border border-emerald-500/30',
    amber: 'bg-amber-950/80 text-amber-400 border border-amber-500/30',
    purple: 'bg-purple-950/80 text-purple-400 border border-purple-500/30',
  };

  const sizeStyles = {
    sm: 'text-[10px] px-2 py-0.5 font-medium tracking-wider uppercase rounded-full',
    md: 'text-xs px-2.5 py-1 font-semibold tracking-wide rounded-lg',
  };

  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1.5 transition-all duration-300',
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
    >
      {children}
    </span>
  );
};

export const ConditionBadge: React.FC<{ condition: ItemCondition }> = ({ condition }) => {
  const conditionMap: Record<ItemCondition, { label: string; variant: 'emerald' | 'cyan' | 'purple' | 'amber' | 'glass' }> = {
    NEW: { label: 'Brand New', variant: 'emerald' },
    LIKE_NEW: { label: 'Like New', variant: 'cyan' },
    EXCELLENT: { label: 'Excellent', variant: 'purple' },
    GOOD: { label: 'Good Condition', variant: 'amber' },
    FAIR: { label: 'Fair', variant: 'glass' },
  };

  const { label, variant } = conditionMap[condition] || { label: condition, variant: 'glass' };

  return <Badge variant={variant}>{label}</Badge>;
};
