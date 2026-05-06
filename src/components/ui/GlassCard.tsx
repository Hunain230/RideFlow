import React from 'react';
import { clsx } from 'clsx';
import { useTilt } from '@/hooks/useTilt';
import { useSpotlight } from '@/hooks/useSpotlight';

type Tier = 1 | 2 | 3;

interface GlassCardProps {
  tier?: Tier;
  tilt?: boolean;
  spotlight?: boolean;
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
  style?: React.CSSProperties;
}

const tierClasses: Record<Tier, string> = {
  1: 'glass-1',
  2: 'glass-2',
  3: 'glass-3',
};

export function GlassCard({
  tier = 1,
  tilt = false,
  spotlight = false,
  className,
  children,
  onClick,
  style,
}: GlassCardProps) {
  const tiltRef = useTilt<HTMLDivElement>();
  const spotlightRef = useSpotlight<HTMLDivElement>();

  // Determine ref priority: tilt > spotlight > none
  const ref = tilt ? tiltRef : spotlight ? spotlightRef : undefined;

  return (
    <div
      ref={ref}
      className={clsx(
        tierClasses[tier],
        spotlight && 'spotlight-card',
        'transition-all duration-200',
        onClick && 'cursor-pointer',
        className
      )}
      onClick={onClick}
      style={style}
    >
      {children}
    </div>
  );
}
