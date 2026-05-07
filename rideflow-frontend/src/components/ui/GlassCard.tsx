import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useTilt } from '../../hooks/useTilt';

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  tier?: 1 | 2 | 3 | 'amber';
  tilt?: boolean;
  spotlight?: boolean;
}

export const GlassCard = React.forwardRef<HTMLDivElement, GlassCardProps>(
  ({ tier = 1, tilt, spotlight, className, children, ...props }, forwardedRef) => {
    const { ref: tiltRef, handleMove, handleLeave } = useTilt();
    
    const setRefs = React.useCallback(
      (node: HTMLDivElement) => {
        if (typeof forwardedRef === 'function') forwardedRef(node);
        else if (forwardedRef) (forwardedRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
        (tiltRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
      },
      [forwardedRef, tiltRef]
    );

    const baseStyles = 'rounded-radius-lg border relative overflow-hidden transition-colors duration-300';
    
    const tierStyles = {
      1: 'bg-[rgba(26,25,23,0.4)] backdrop-blur-[12px] border-[rgba(255,255,255,0.06)] shadow-sm',
      2: 'bg-[rgba(26,25,23,0.65)] backdrop-blur-[24px] border-[rgba(255,255,255,0.08)] shadow-md',
      3: 'bg-[rgba(26,25,23,0.85)] backdrop-blur-[40px] border-[rgba(255,255,255,0.1)] shadow-lg',
      amber: 'bg-[rgba(217,119,6,0.1)] backdrop-blur-[24px] border-[rgba(217,119,6,0.4)] shadow-glow',
    };

    return (
      <div
        ref={tilt ? setRefs : forwardedRef}
        onMouseMove={tilt ? handleMove : undefined}
        onMouseLeave={tilt ? handleLeave : undefined}
        className={twMerge(clsx(baseStyles, tierStyles[tier], className))}
        {...props}
      >
        {spotlight && (
          <div className="pointer-events-none absolute -inset-px opacity-0 transition duration-300 hover:opacity-100"
               style={{ background: `radial-gradient(600px circle at var(--mouse-x, 0) var(--mouse-y, 0), rgba(217,119,6,0.15), transparent 40%)` }} />
        )}
        {children}
      </div>
    );
  }
);

GlassCard.displayName = 'GlassCard';
