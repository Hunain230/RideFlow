import { motion } from 'framer-motion';
import { MapPin, Clock, Star } from 'lucide-react';
import { GlassCard } from './GlassCard';
import { Badge } from './Badge';

interface LocationCardProps {
  location: {
    LocationID: number;
    LocationName: string;
    City: string;
    Street?: string;
    Latitude?: number;
    Longitude?: number;
  };
  isSelected?: boolean;
  onClick?: () => void;
  variant?: 'pickup' | 'dropoff' | 'saved' | 'default';
  showDistance?: boolean;
  distance?: string;
  rating?: number;
}

export function LocationCard({
  location,
  isSelected = false,
  onClick,
  variant = 'default',
  showDistance = false,
  distance,
  rating
}: LocationCardProps) {
  const getVariantStyles = () => {
    switch (variant) {
      case 'pickup':
        return 'border-amber-500/50 bg-amber-500/10 hover:border-amber-500/70';
      case 'dropoff':
        return 'border-emerald-500/50 bg-emerald-500/10 hover:border-emerald-500/70';
      case 'saved':
        return 'border-purple-500/50 bg-purple-500/10 hover:border-purple-500/70';
      case 'default':
        return 'border-glass-border hover:border-soft-gold/30';
      default:
        return 'border-glass-border hover:border-soft-gold/30';
    }
  };

  const getIconColors = () => {
    switch (variant) {
      case 'pickup':
        return 'text-amber-500';
      case 'dropoff':
        return 'text-emerald-500';
      case 'saved':
        return 'text-purple-500';
      case 'default':
        return 'text-soft-gold';
      default:
        return 'text-soft-gold';
    }
  };

  return (
    <motion.div
      whileHover={{ y: -2, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`
        cursor-pointer transition-all duration-300
        ${isSelected ? 'ring-2 ring-soft-gold/50 scale-105' : ''}
      `}
    >
      <GlassCard 
        tier={isSelected ? 3 : 2} 
        className={`
          p-4 hover:shadow-glow-lg
          ${getVariantStyles()}
        `}
      >
        <div className="flex items-start gap-3">
          <div className={`
            w-10 h-10 rounded-full flex items-center justify-center
            bg-glass-bg-light border-2 shrink-0
            ${getVariantStyles().replace('hover:', '').replace('bg-', 'border-')}
          `}>
            <MapPin className={getIconColors()} size={18} />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2 mb-1">
              <h4 className="font-semibold text-white truncate">
                {location.LocationName}
              </h4>
              {isSelected && (
                <Badge variant="success">Selected</Badge>
              )}
            </div>
            
            <div className="flex items-center gap-2 text-text-muted text-sm mb-2">
              <span className="truncate">{location.City}</span>
              {location.Street && (
                <>
                  <span>•</span>
                  <span className="truncate">{location.Street}</span>
                </>
              )}
            </div>

            {showDistance && distance && (
              <div className="flex items-center gap-1 text-amber-500 text-sm">
                <Clock size={14} />
                <span>{distance} away</span>
              </div>
            )}

            {rating && (
              <div className="flex items-center gap-1 text-amber-500 text-sm">
                <Star size={14} fill="currentColor" />
                <span>{rating.toFixed(1)}</span>
              </div>
            )}
          </div>
        </div>
      </GlassCard>
    </motion.div>
  );
}
