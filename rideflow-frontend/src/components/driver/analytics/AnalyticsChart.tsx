import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Activity } from 'lucide-react';
import { GlassCard } from '../../ui/GlassCard';

interface AnalyticsChartProps {
  title: string;
  data: any[];
  type: 'line' | 'bar' | 'area';
  metric: 'earnings' | 'rides' | 'distance';
  height?: number;
  showTrend?: boolean;
  className?: string;
}

export function AnalyticsChart({ 
  title, 
  data, 
  type, 
  metric, 
  height = 200, 
  showTrend = true,
  className = '' 
}: AnalyticsChartProps) {
  // Calculate trend
  const calculateTrend = () => {
    if (data.length < 2) return { direction: 'neutral', percentage: 0 };
    
    const recent = data.slice(-3).reduce((sum, item) => sum + (item[metric] || 0), 0) / Math.min(3, data.length);
    const previous = data.slice(-6, -3).reduce((sum, item) => sum + (item[metric] || 0), 0) / Math.min(3, data.length - 3);
    
    if (previous === 0) return { direction: 'up', percentage: 100 };
    
    const percentage = ((recent - previous) / previous) * 100;
    return {
      direction: percentage > 0 ? 'up' : percentage < 0 ? 'down' : 'neutral',
      percentage: Math.abs(percentage)
    };
  };

  const trend = calculateTrend();
  const maxValue = Math.max(...data.map(item => item[metric] || 0));
  const minValue = Math.min(...data.map(item => item[metric] || 0));
  const range = maxValue - minValue || 1;

  // Simple bar chart implementation
  const renderBarChart = () => {
    return (
      <div className="flex items-end justify-between h-full gap-2 px-2">
        {data.map((item, index) => {
          const value = item[metric] || 0;
          const heightPercent = ((value - minValue) / range) * 100;
          
          return (
            <div key={index} className="flex-1 flex flex-col items-center">
              <div className="w-full flex flex-col items-center justify-end h-full">
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${heightPercent}%` }}
                  transition={{ delay: index * 0.05, duration: 0.5 }}
                  className={`w-full rounded-t-sm ${
                    metric === 'earnings' ? 'bg-green-500' : 
                    metric === 'rides' ? 'bg-blue-500' : 
                    'bg-amber-500'
                  }`}
                />
              </div>
              <div className="text-xs text-text-muted mt-1 text-center">
                {item.Label || item.Date?.split('-').slice(1).join('/') || index + 1}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  // Simple line chart implementation
  const renderLineChart = () => {
    const points = data.map((item, index) => {
      const value = item[metric] || 0;
      const x = (index / (data.length - 1)) * 100;
      const y = 100 - ((value - minValue) / range) * 100;
      return `${x},${y}`;
    }).join(' ');

    return (
      <div className="relative h-full w-full">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          {/* Grid lines */}
          {[0, 25, 50, 75, 100].map((y) => (
            <line
              key={y}
              x1="0"
              y1={y}
              x2="100"
              y2={y}
              stroke="rgba(255,255,255,0.1)"
              strokeWidth="0.5"
            />
          ))}
          
          {/* Data line */}
          <polyline
            points={points}
            fill="none"
            stroke={metric === 'earnings' ? '#10b981' : metric === 'rides' ? '#3b82f6' : '#f59e0b'}
            strokeWidth="2"
          />
          
          {/* Area fill */}
          {type === 'area' && (
            <polygon
              points={`0,100 ${points} 100,100`}
              fill={metric === 'earnings' ? '#10b981' : metric === 'rides' ? '#3b82f6' : '#f59e0b'}
              fillOpacity="0.2"
            />
          )}
          
          {/* Data points */}
          {data.map((item, index) => {
            const value = item[metric] || 0;
            const x = (index / (data.length - 1)) * 100;
            const y = 100 - ((value - minValue) / range) * 100;
            
            return (
              <circle
                key={index}
                cx={x}
                cy={y}
                r="2"
                fill={metric === 'earnings' ? '#10b981' : metric === 'rides' ? '#3b82f6' : '#f59e0b'}
                className="animate-pulse"
              />
            );
          })}
        </svg>
      </div>
    );
  };

  const formatValue = (value: number) => {
    if (metric === 'earnings') {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(value);
    }
    if (metric === 'distance') {
      return `${value.toFixed(1)} km`;
    }
    return value.toString();
  };

  const totalValue = data.reduce((sum, item) => sum + (item[metric] || 0), 0);
  const averageValue = totalValue / data.length;

  return (
    <GlassCard tier={1} className={`p-6 ${className}`}>
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-medium text-white">{title}</h3>
          <div className="flex items-center gap-4 mt-2">
            <div>
              <div className="text-2xl font-bold text-white">
                {formatValue(averageValue)}
              </div>
              <div className="text-sm text-text-muted">Average</div>
            </div>
            
            {showTrend && (
              <div className="flex items-center gap-1">
                {trend.direction === 'up' ? (
                  <TrendingUp size={16} className="text-green-500" />
                ) : trend.direction === 'down' ? (
                  <TrendingDown size={16} className="text-red-500" />
                ) : (
                  <Activity size={16} className="text-text-muted" />
                )}
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
        </div>
        
        <div className="text-right">
          <div className="text-sm text-text-muted">Total</div>
          <div className="text-lg font-medium text-white">
            {formatValue(totalValue)}
          </div>
        </div>
      </div>
      
      <div style={{ height: `${height}px` }} className="relative">
        {type === 'bar' ? renderBarChart() : renderLineChart()}
      </div>
      
      <div className="flex justify-between mt-4 text-xs text-text-muted">
        <span>Period: {data.length} data points</span>
        <span>Range: {formatValue(minValue)} - {formatValue(maxValue)}</span>
      </div>
    </GlassCard>
  );
}
