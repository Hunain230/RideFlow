import { useRef } from 'react';
import { useCounter } from '@/hooks/useCounter';
import { clsx } from 'clsx';

interface CounterStatProps {
  target: number;
  label: string;
  suffix?: string;
  prefix?: string;
  highlight?: boolean;
  className?: string;
}

export function CounterStat({
  target,
  label,
  suffix = '',
  prefix = '',
  highlight = false,
  className,
}: CounterStatProps) {
  const { count, ref } = useCounter(target);

  return (
    <div
      ref={ref as React.RefObject<HTMLDivElement>}
      className={clsx(
        'glass-1 p-6 rounded-2xl relative overflow-hidden text-center',
        highlight && 'glass-amber',
        className
      )}
    >
      {/* Corner glow */}
      <div className="absolute -top-8 -right-8 w-20 h-20 rounded-full pointer-events-none"
           style={{ background: 'radial-gradient(circle, rgba(217,119,6,0.2) 0%, transparent 70%)' }} />

      <p className="text-3xl font-display gradient-text leading-none tracking-tight">
        {prefix}{count.toLocaleString()}{suffix}
      </p>
      <p className="text-xs font-semibold uppercase tracking-widest text-warm-faint mt-2">
        {label}
      </p>
    </div>
  );
}
