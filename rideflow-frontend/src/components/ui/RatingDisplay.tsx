import React from 'react';
import { Star, MessageCircle } from 'lucide-react';

interface RatingDisplayProps {
  rating: number;
  totalRatings?: number;
  showCount?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const RatingDisplay: React.FC<RatingDisplayProps> = ({
  rating,
  totalRatings = 0,
  showCount = true,
  size = 'md',
  className = ''
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      <div className="flex items-center">
        {/* Full stars */}
        {[...Array(fullStars)].map((_, i) => (
          <Star
            key={`full-${i}`}
            className={`${sizeClasses[size]} fill-yellow-400 text-yellow-400`}
          />
        ))}
        
        {/* Half star */}
        {hasHalfStar && (
          <div className="relative">
            <Star className={`${sizeClasses[size]} text-gray-300`} />
            <div 
              className="absolute top-0 left-0 overflow-hidden"
              style={{ width: '50%' }}
            >
              <Star className={`${sizeClasses[size]} fill-yellow-400 text-yellow-400`} />
            </div>
          </div>
        )}
        
        {/* Empty stars */}
        {[...Array(emptyStars)].map((_, i) => (
          <Star
            key={`empty-${i}`}
            className={`${sizeClasses[size]} text-gray-300`}
          />
        ))}
      </div>
      
      {showCount && (
        <span className="text-sm text-gray-600 ml-1">
          {rating.toFixed(1)} {totalRatings > 0 && `(${totalRatings})`}
        </span>
      )}
    </div>
  );
};

interface RatingCardProps {
  score: number;
  comment?: string;
  timestamp: string;
  ratedBy: string;
  showComment?: boolean;
}

export const RatingCard: React.FC<RatingCardProps> = ({
  score,
  comment,
  timestamp,
  ratedBy,
  showComment = true
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
            <span className="text-sm font-medium text-gray-600">
              {ratedBy.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <p className="font-medium text-gray-900">{ratedBy}</p>
            <p className="text-xs text-gray-500">{formatDate(timestamp)}</p>
          </div>
        </div>
        <RatingDisplay rating={score} showCount={false} size="sm" />
      </div>
      
      {showComment && comment && (
        <div className="flex items-start gap-2">
          <MessageCircle className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-gray-700 leading-relaxed">{comment}</p>
        </div>
      )}
    </div>
  );
};

interface RatingDistributionProps {
  distribution: {
    '5stars': number;
    '4stars': number;
    '3stars': number;
    '2stars': number;
    '1stars': number;
  };
  totalRatings: number;
}

export const RatingDistribution: React.FC<RatingDistributionProps> = ({
  distribution,
  totalRatings
}) => {
  const getPercentage = (count: number) => {
    return totalRatings > 0 ? Math.round((count / totalRatings) * 100) : 0;
  };

  const stars = [
    { value: 5, count: distribution['5stars'], label: '5 stars' },
    { value: 4, count: distribution['4stars'], label: '4 stars' },
    { value: 3, count: distribution['3stars'], label: '3 stars' },
    { value: 2, count: distribution['2stars'], label: '2 stars' },
    { value: 1, count: distribution['1stars'], label: '1 star' }
  ];

  return (
    <div className="space-y-2">
      {stars.map(({ value, count, label }) => {
        const percentage = getPercentage(count);
        return (
          <div key={value} className="flex items-center gap-3">
            <div className="flex items-center gap-1 w-20">
              <span className="text-sm">{label}</span>
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            </div>
            <div className="flex-1">
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-yellow-400 transition-all duration-300"
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
            <span className="text-sm text-gray-600 w-12 text-right">
              {count}
            </span>
          </div>
        );
      })}
    </div>
  );
};
