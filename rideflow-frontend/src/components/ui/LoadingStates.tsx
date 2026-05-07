import { motion } from 'framer-motion';
import { Car } from 'lucide-react';
import { GlassCard } from './GlassCard';

interface LoadingSkeletonProps {
  variant?: 'location' | 'vehicle' | 'ride' | 'profile' | 'default';
  className?: string;
}

export function LoadingSkeleton({ variant = 'default', className = '' }: LoadingSkeletonProps) {
  const getSkeletonContent = () => {
    switch (variant) {
      case 'location':
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-glass-bg-light animate-pulse" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-glass-bg-light rounded animate-pulse" />
                <div className="h-3 bg-glass-bg-light rounded w-3/4 animate-pulse" />
              </div>
            </div>
          </div>
        );
      
      case 'vehicle':
        return (
          <div className="space-y-4">
            <div className="w-16 h-16 bg-glass-bg-light rounded-lg animate-pulse mx-auto" />
            <div className="h-5 bg-glass-bg-light rounded animate-pulse text-center" />
            <div className="space-y-2">
              <div className="h-3 bg-glass-bg-light rounded animate-pulse" />
              <div className="h-3 bg-glass-bg-light rounded w-2/3 animate-pulse" />
            </div>
          </div>
        );
      
      case 'ride':
        return (
          <div className="space-y-4">
            <div className="h-4 bg-glass-bg-light rounded animate-pulse" />
            <div className="h-3 bg-glass-bg-light rounded w-3/4 animate-pulse" />
            <div className="flex gap-2">
              <div className="h-8 bg-glass-bg-light rounded animate-pulse flex-1" />
              <div className="h-8 bg-glass-bg-light rounded animate-pulse flex-1" />
            </div>
          </div>
        );
      
      default:
        return (
          <div className="space-y-3">
            <div className="h-4 bg-glass-bg-light rounded animate-pulse" />
            <div className="h-4 bg-glass-bg-light rounded w-5/6 animate-pulse" />
            <div className="h-4 bg-glass-bg-light rounded w-4/6 animate-pulse" />
          </div>
        );
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={className}
    >
      {getSkeletonContent()}
    </motion.div>
  );
}

export function LoadingSpinner({ size = 'md', className = '' }: { size?: 'sm' | 'md' | 'lg'; className?: string }) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <motion.div
        className={`${sizeClasses[size]} border-2 border-soft-gold/30 border-t-soft-gold rounded-full`}
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      />
    </div>
  );
}

export function EmptyState({ 
  icon, 
  title, 
  description, 
  action 
}: { 
  icon: React.ReactNode;
  title: string; 
  description: string; 
  action?: React.ReactNode;
}) {
  return (
    <GlassCard tier={2} className="p-8 text-center">
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-20 h-20 mx-auto mb-6 flex items-center justify-center rounded-full bg-glass-bg-light border border-glass-border"
      >
        {icon}
      </motion.div>
      <h3 className="text-xl font-display mb-3 text-white">{title}</h3>
      <p className="text-text-muted mb-6">{description}</p>
      {action && <div>{action}</div>}
    </GlassCard>
  );
}

export function LocationLoadingState() {
  return (
    <GlassCard tier={2} className="p-6">
      <div className="space-y-4">
        <LoadingSkeleton variant="location" />
        <LoadingSkeleton variant="location" />
        <LoadingSkeleton variant="location" />
      </div>
    </GlassCard>
  );
}

export function VehicleLoadingState() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {[1, 2, 3].map((i) => (
        <GlassCard key={i} tier={2} className="p-6">
          <LoadingSkeleton variant="vehicle" />
        </GlassCard>
      ))}
    </div>
  );
}

export function RideLoadingState() {
  return (
    <GlassCard tier={3} className="p-8">
      <div className="flex items-center justify-center mb-6">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        >
          <Car className="text-soft-gold" size={48} />
        </motion.div>
      </div>
      <div className="text-center space-y-4">
        <h3 className="text-xl font-display text-white">Finding your driver...</h3>
        <div className="flex justify-center gap-2">
          {[1, 2, 3].map((i) => (
            <motion.div
              key={i}
              className="w-2 h-2 bg-soft-gold rounded-full"
              animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
              transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
            />
          ))}
        </div>
        <p className="text-text-muted">We're searching for the best driver for you</p>
      </div>
    </GlassCard>
  );
}

export function ProfileLoadingState() {
  return (
    <GlassCard tier={2} className="p-6">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-20 h-20 rounded-full bg-glass-bg-light animate-pulse" />
        <div className="flex-1 space-y-3">
          <div className="h-5 bg-glass-bg-light rounded animate-pulse" />
          <div className="h-4 bg-glass-bg-light rounded w-3/4 animate-pulse" />
          <div className="h-4 bg-glass-bg-light rounded w-1/2 animate-pulse" />
        </div>
      </div>
      <div className="space-y-4">
        <LoadingSkeleton variant="profile" />
        <LoadingSkeleton variant="profile" />
      </div>
    </GlassCard>
  );
}
