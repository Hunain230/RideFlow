import { motion, AnimatePresence } from 'framer-motion';
import { Users, Clock, Star, Check, Shield, DollarSign } from 'lucide-react';
import { PremiumCard, StatusCircle, FeatureBox } from './PremiumCard';

interface PremiumVehicleCardProps {
  vehicle: {
    Type: string;
    Available: number;
    EstimatedFare: string;
    EstimatedTime: string;
    Vehicles: any[];
  };
  isSelected?: boolean;
  onSelect?: () => void;
  className?: string;
}

export function PremiumVehicleCard({ vehicle, isSelected = false, onSelect, className = '' }: PremiumVehicleCardProps) {
  const getVehicleIcon = () => {
    switch (vehicle.Type) {
      case 'Bike':
        return '🏍️';
      case 'Business':
        return '💼';
      default:
        return '🚗';
    }
  };

  const getVehicleColor = () => {
    switch (vehicle.Type) {
      case 'Bike':
        return 'from-purple-500/20 to-pink-500/20 border-purple-500/30';
      case 'Business':
        return 'from-amber-500/20 to-gold-500/20 border-amber-500/30';
      default:
        return 'from-blue-500/20 to-cyan-500/20 border-blue-500/30';
    }
  };

  const fareRange = vehicle.EstimatedFare.match(/PKR (\d+)-(\d+)/);
  const minFare = fareRange ? parseInt(fareRange[1]) : 0;
  const maxFare = fareRange ? parseInt(fareRange[2]) : 0;
  const avgFare = (minFare + maxFare) / 2;

  return (
    <PremiumCard
      variant={isSelected ? 'featured' : 'default'}
      glowing={isSelected}
      selected={isSelected}
      className={`cursor-pointer ${className}`}
      onClick={onSelect}
    >
      <div className="space-y-6">
        {/* Header Section */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Vehicle Icon Circle */}
            <motion.div
              className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${getVehicleColor()} border-2 flex items-center justify-center shadow-glow-lg`}
              whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
              transition={{ duration: 0.5 }}
            >
              <span className="text-4xl">{getVehicleIcon()}</span>
            </motion.div>
            
            <div>
              <h3 className="text-2xl font-bold text-white mb-1">{vehicle.Type}</h3>
              <div className="flex items-center gap-2">
                <StatusCircle status={vehicle.Available > 0 ? 'online' : 'offline'} size="sm" />
                <span className="text-sm text-text-muted">
                  {vehicle.Available > 0 ? `${vehicle.Available} available` : 'Unavailable'}
                </span>
              </div>
            </div>
          </div>

          {/* Selection Check */}
          <AnimatePresence>
            {isSelected && (
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0, rotate: 180 }}
                className="w-12 h-12 bg-gradient-to-br from-soft-gold to-champagne rounded-full flex items-center justify-center shadow-glow-lg"
              >
                <Check size={24} className="text-text-primary" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-2 gap-4">
          <FeatureBox
            icon={<DollarSign className="text-amber-500" size={20} />}
            title="Fare Range"
            description={vehicle.EstimatedFare}
            status={vehicle.Available > 0 ? 'active' : 'inactive'}
          />
          <FeatureBox
            icon={<Clock className="text-blue-500" size={20} />}
            title="Est. Time"
            description={vehicle.EstimatedTime}
            status={vehicle.Available > 0 ? 'active' : 'inactive'}
          />
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-3 gap-4">
          <motion.div
            className="text-center p-3 rounded-xl bg-glass-bg-light border border-glass-border"
            whileHover={{ scale: 1.05, backgroundColor: 'rgba(255, 215, 0, 0.1)' }}
          >
            <div className="text-2xl font-bold text-amber-500">{vehicle.Available}</div>
            <div className="text-xs text-text-muted">Available</div>
          </motion.div>
          
          <motion.div
            className="text-center p-3 rounded-xl bg-glass-bg-light border border-glass-border"
            whileHover={{ scale: 1.05, backgroundColor: 'rgba(255, 215, 0, 0.1)' }}
          >
            <div className="text-2xl font-bold text-green-500">{avgFare}</div>
            <div className="text-xs text-text-muted">Avg Fare</div>
          </motion.div>
          
          <motion.div
            className="text-center p-3 rounded-xl bg-glass-bg-light border border-glass-border"
            whileHover={{ scale: 1.05, backgroundColor: 'rgba(255, 215, 0, 0.1)' }}
          >
            <div className="text-2xl font-bold text-blue-500">4.8</div>
            <div className="text-xs text-text-muted">Rating</div>
          </motion.div>
        </div>

        {/* Top Drivers */}
        {vehicle.Vehicles.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-soft-gold flex items-center gap-2">
              <Star size={16} className="text-amber-500" fill="currentColor" />
              Top Drivers
            </h4>
            <div className="space-y-2">
              {vehicle.Vehicles.slice(0, 2).map((driver: any, index: number) => (
                <motion.div
                  key={driver.DriverID || index}
                  className="flex items-center justify-between p-3 rounded-xl bg-glass-bg-light border border-glass-border hover:border-soft-gold/30 transition-all duration-300"
                  whileHover={{ x: 4 }}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500/20 to-champagne/20 border border-amber-500/50 flex items-center justify-center">
                      <Users size={16} className="text-amber-500" />
                    </div>
                    <div>
                      <div className="font-medium text-white">{driver.DriverName}</div>
                      <div className="text-xs text-text-muted">⭐ {driver.Rating || '4.5'}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Shield size={14} className="text-emerald-500" />
                    <span className="text-xs text-emerald-500">Verified</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Action Button */}
        <motion.button
          className={`
            w-full py-4 rounded-xl font-semibold transition-all duration-300
            ${isSelected 
              ? 'bg-gradient-to-r from-soft-gold to-champagne text-text-primary shadow-glow-lg' 
              : 'bg-glass-bg-light border border-glass-border text-white hover:border-soft-gold/50 hover:bg-soft-gold/10'
            }
          `}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onSelect}
        >
          {isSelected ? 'Selected ✓' : 'Select This Vehicle'}
        </motion.button>
      </div>
    </PremiumCard>
  );
}

interface VehicleStatsBoxProps {
  type: 'economy' | 'business' | 'bike';
  stats: {
    totalRides: number;
    avgRating: number;
    avgFare: number;
    popularity: number;
  };
}

export function VehicleStatsBox({ type, stats }: VehicleStatsBoxProps) {
  const getTypeConfig = () => {
    switch (type) {
      case 'economy':
        return {
          icon: '🚗',
          color: 'from-blue-500/20 to-cyan-500/20 border-blue-500/30',
          title: 'Economy'
        };
      case 'business':
        return {
          icon: '💼',
          color: 'from-amber-500/20 to-gold-500/20 border-amber-500/30',
          title: 'Business'
        };
      case 'bike':
        return {
          icon: '🏍️',
          color: 'from-purple-500/20 to-pink-500/20 border-purple-500/30',
          title: 'Bike'
        };
    }
  };

  const config = getTypeConfig();

  return (
    <motion.div
      className={`
        p-6 rounded-2xl bg-gradient-to-br ${config.color} border-2
        hover:shadow-glow-lg transition-all duration-300
      `}
      whileHover={{ y: -4, scale: 1.02 }}
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center">
            <span className="text-2xl">{config.icon}</span>
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">{config.title}</h3>
            <p className="text-sm text-white/70">Most Popular Choice</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-white">{stats.popularity}%</div>
          <div className="text-xs text-white/70">Popularity</div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <motion.div
          className="text-center p-3 rounded-xl bg-white/10 backdrop-blur-md"
          whileHover={{ scale: 1.05 }}
        >
          <div className="text-xl font-bold text-white">{stats.totalRides}</div>
          <div className="text-xs text-white/70">Total Rides</div>
        </motion.div>
        
        <motion.div
          className="text-center p-3 rounded-xl bg-white/10 backdrop-blur-md"
          whileHover={{ scale: 1.05 }}
        >
          <div className="text-xl font-bold text-white">{stats.avgRating}</div>
          <div className="text-xs text-white/70">Avg Rating</div>
        </motion.div>
        
        <motion.div
          className="text-center p-3 rounded-xl bg-white/10 backdrop-blur-md col-span-2"
          whileHover={{ scale: 1.05 }}
        >
          <div className="text-xl font-bold text-white">PKR {stats.avgFare}</div>
          <div className="text-xs text-white/70">Average Fare</div>
        </motion.div>
      </div>
    </motion.div>
  );
}
