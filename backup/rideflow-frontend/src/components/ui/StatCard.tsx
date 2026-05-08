import React from 'react';
import { GlassCard } from './GlassCard';
import { useCounter } from '../../hooks/useCounter';

interface StatCardProps {
  label: string;
  value: number;
  prefix?: string;
  suffix?: string;
  delta?: string;
  icon?: React.ReactNode;
}

export function StatCard({ label, value, prefix = '', suffix = '', delta, icon }: StatCardProps) {
  const counterRef = useCounter(value, 2);

  return (
    <GlassCard tier={1} className="p-6 relative group overflow-hidden">
      {/* Corner amber radial glow */}
      <div className="absolute -top-12 -right-12 w-32 h-32 bg-amber-500/10 rounded-full blur-[30px] group-hover:bg-amber-500/20 transition-colors duration-500" />
      
      <div className="flex justify-between items-start mb-4">
        <p className="text-sm font-medium text-text-muted">{label}</p>
        {icon && <div className="text-amber-500 opacity-80">{icon}</div>}
      </div>
      
      <div className="flex items-baseline gap-1">
        {prefix && <span className="text-lg text-text-secondary">{prefix}</span>}
        <span 
          ref={counterRef} 
          className="text-3xl font-display font-bold bg-clip-text text-transparent bg-gradient-to-br from-white to-amber-200"
        >
          0
        </span>
        {suffix && <span className="text-lg text-text-secondary">{suffix}</span>}
      </div>
      
      {delta && (
        <p className={`text-xs mt-2 ${delta.startsWith('+') ? 'text-success' : 'text-error'}`}>
          {delta} from last month
        </p>
      )}
    </GlassCard>
  );
}
