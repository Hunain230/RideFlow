import React from 'react';
import { clsx } from 'clsx';

type BadgeVariant = 'amber' | 'success' | 'error' | 'muted' | 'active';

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  amber:   'bg-amber-600/20 text-amber-400 border border-amber-600/30',
  success: 'bg-emerald-600/20 text-emerald-400 border border-emerald-600/30',
  error:   'bg-red-600/20 text-red-400 border border-red-600/30',
  muted:   'bg-white/5 text-warm-muted border border-white/10',
  active:  'bg-amber-600 text-bg-base font-bold',
};

export function Badge({ variant = 'muted', children, className }: BadgeProps) {
  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold tracking-wide',
        variantStyles[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
