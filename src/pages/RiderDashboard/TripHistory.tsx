import { ArrowRight, Star } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Skeleton } from '@/components/ui/Skeleton';
import { GlassCard } from '@/components/ui/GlassCard';
import { useState, useEffect } from 'react';

const trips = [
  {
    id: 1,
    route: 'Home → Airport T1',
    fare: '$34.50',
    date: 'Mon, May 5',
    driver: 'Alex M.',
    vehicle: 'Premium',
    status: 'completed' as const,
    rating: 5,
  },
  {
    id: 2,
    route: 'Downtown → Office Park',
    fare: '$12.80',
    date: 'Fri, May 2',
    driver: 'Sarah K.',
    vehicle: 'Economy',
    status: 'completed' as const,
    rating: 4,
  },
  {
    id: 3,
    route: 'Hotel Grand → Central Station',
    fare: '$28.00',
    date: 'Wed, Apr 30',
    driver: 'Omar R.',
    vehicle: 'SUV',
    status: 'completed' as const,
    rating: 5,
  },
];

export function TripHistory() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(t);
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-warm-white">Recent Trips</h3>
        <button className="text-xs text-amber-500 hover:text-amber-400 flex items-center gap-1 transition-colors">
          View all <ArrowRight size={12} />
        </button>
      </div>

      <div className="space-y-3">
        {loading
          ? Array.from({ length: 3 }).map((_, i) => (
              <GlassCard key={i} tier={1} className="p-4">
                <Skeleton variant="text" lines={2} />
              </GlassCard>
            ))
          : trips.map((trip) => (
              <GlassCard
                key={trip.id}
                tier={1}
                className="p-4 flex items-center justify-between hover:border-amber-600/20 transition-all cursor-pointer"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-warm-white truncate">{trip.route}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-warm-faint">{trip.date}</span>
                    <span className="text-warm-faint">·</span>
                    <span className="text-xs text-warm-faint">{trip.driver}</span>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1 ml-4">
                  <p className="font-display text-amber-500 text-sm">{trip.fare}</p>
                  <div className="flex items-center gap-0.5">
                    {[...Array(trip.rating)].map((_, i) => (
                      <Star key={i} size={10} fill="#D97706" className="text-amber-600" />
                    ))}
                  </div>
                </div>
                <Badge variant="success" className="ml-3 text-[10px]">
                  {trip.status}
                </Badge>
              </GlassCard>
            ))}
      </div>
    </div>
  );
}
