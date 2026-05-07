import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, DollarSign, Car, Clock, Star } from 'lucide-react';
import { GlassCard } from '../../ui/GlassCard';

interface MetricsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: {
    direction: 'up' | 'down' | 'neutral';
    percentage: number;
  };
  icon?: React.ReactNode;
  color?: 'green' | 'blue' | 'amber' | 'red';
  loading?: boolean;
}

export function MetricsCard({ 
  title, 
  value, 
  subtitle, 
  trend, 
  icon, 
  color = 'blue',
  loading = false 
}: MetricsCardProps) {
  const colorClasses = {
    green: 'text-green-500 bg-green-500/10 border-green-500/30',
    blue: 'text-blue-500 bg-blue-500/10 border-blue-500/30',
    amber: 'text-amber-500 bg-amber-500/10 border-amber-500/30',
    red: 'text-red-500 bg-red-500/10 border-red-500/30'
  };

  const getIcon = () => {
    if (icon) return icon;
    if (title.toLowerCase().includes('earning')) return <DollarSign size={20} />;
    if (title.toLowerCase().includes('ride')) return <Car size={20} />;
    if (title.toLowerCase().includes('time')) return <Clock size={20} />;
    if (title.toLowerCase().includes('rating')) return <Star size={20} />;
    return <DollarSign size={20} />;
  };

  if (loading) {
    return (
      <GlassCard tier={1} className="p-6">
        <div className="animate-pulse">
          <div className="flex justify-between items-start mb-4">
            <div className="space-y-2">
              <div className="h-4 bg-glass-bg-light rounded w-24" />
              <div className="h-8 bg-glass-bg-light rounded w-32" />
            </div>
            <div className="w-12 h-12 bg-glass-bg-light rounded-full" />
          </div>
        </div>
      </GlassCard>
    );
  }

  return (
    <GlassCard tier={1} className="p-6">
      <div className="flex justify-between items-start mb-4">
        <div className="space-y-2">
          <p className="text-sm text-text-muted">{title}</p>
          <p className="text-2xl font-bold text-white">{value}</p>
          {subtitle && (
            <p className="text-xs text-text-muted">{subtitle}</p>
          )}
          {trend && (
            <div className="flex items-center gap-1">
              {trend.direction === 'up' && <TrendingUp size={14} className="text-green-500" />}
              {trend.direction === 'down' && <TrendingDown size={14} className="text-red-500" />}
              <span className={`text-sm ${
                trend.direction === 'up' ? 'text-green-500' : 
                trend.direction === 'down' ? 'text-red-500' : 
                'text-text-muted'
              }`}>
                {trend.percentage.toFixed(1)}%
              </span>
            </div>
          )}
        </div>
        
        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${colorClasses[color]}`}>
          {getIcon()}
        </div>
      </div>
    </GlassCard>
  );
}

interface PerformanceMetricsProps {
  metrics: {
    totalRides: number;
    completedRides: number;
    netEarnings: number;
    averageEarningsPerRide: number;
    totalDistance: number;
    averageDistancePerRide: number;
    averageRideDuration: number;
    averageRating: number;
    completionRate: number;
  };
  loading?: boolean;
}

export function PerformanceMetrics({ metrics, loading }: PerformanceMetricsProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatDuration = (minutes: number) => {
    if (minutes < 60) return `${Math.round(minutes)} min`;
    const hours = Math.floor(minutes / 60);
    const mins = Math.round(minutes % 60);
    return `${hours}h ${mins}m`;
  };

  const metricCards = [
    {
      title: 'Total Rides',
      value: metrics.totalRides,
      subtitle: 'All time',
      icon: <Car size={20} />,
      color: 'blue' as const
    },
    {
      title: 'Completion Rate',
      value: `${metrics.completionRate.toFixed(1)}%`,
      subtitle: 'Success rate',
      icon: <TrendingUp size={20} />,
      color: (metrics.completionRate >= 90 ? 'green' : metrics.completionRate >= 75 ? 'amber' : 'red') as 'green' | 'amber' | 'red'
    },
    {
      title: 'Net Earnings',
      value: formatCurrency(metrics.netEarnings),
      subtitle: 'After commission',
      icon: <DollarSign size={20} />,
      color: 'green' as const
    },
    {
      title: 'Avg per Ride',
      value: formatCurrency(metrics.averageEarningsPerRide),
      subtitle: 'Average earnings',
      icon: <DollarSign size={20} />,
      color: 'amber' as const
    },
    {
      title: 'Total Distance',
      value: `${metrics.totalDistance.toFixed(0)} km`,
      subtitle: 'All completed rides',
      icon: <Car size={20} />,
      color: 'blue' as const
    },
    {
      title: 'Avg Duration',
      value: formatDuration(metrics.averageRideDuration),
      subtitle: 'Per ride',
      icon: <Clock size={20} />,
      color: 'amber' as const
    },
    {
      title: 'Avg Rating',
      value: metrics.averageRating.toFixed(1),
      subtitle: 'From customers',
      icon: <Star size={20} />,
      color: (metrics.averageRating >= 4.5 ? 'green' : metrics.averageRating >= 4.0 ? 'amber' : 'red') as 'green' | 'amber' | 'red'
    },
    {
      title: 'Avg Distance',
      value: `${metrics.averageDistancePerRide.toFixed(1)} km`,
      subtitle: 'Per ride',
      icon: <Car size={20} />,
      color: 'blue' as const
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-display text-white mb-2">Performance Metrics</h3>
        <p className="text-text-muted">Key performance indicators and statistics</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metricCards.map((metric, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <MetricsCard {...metric} loading={loading} />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
