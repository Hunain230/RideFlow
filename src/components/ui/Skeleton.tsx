import { clsx } from 'clsx';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'rect' | 'circle';
  width?: string | number;
  height?: string | number;
  lines?: number;
}

export function Skeleton({ className, variant = 'rect', width, height, lines = 1 }: SkeletonProps) {
  const baseClass = clsx(
    'shimmer-base rounded-lg',
    variant === 'circle' && 'rounded-full',
    variant === 'text' && 'rounded h-4',
    className
  );

  const style: React.CSSProperties = {
    width: width ?? '100%',
    height: height ?? (variant === 'text' ? undefined : '1rem'),
  };

  if (variant === 'text' && lines > 1) {
    return (
      <div className="space-y-2">
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className={clsx(baseClass, i === lines - 1 && 'w-3/4')}
            style={style}
            aria-hidden="true"
          />
        ))}
      </div>
    );
  }

  return <div className={baseClass} style={style} aria-hidden="true" />;
}
