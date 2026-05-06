import { motion, useMotionValue, useTransform } from 'framer-motion';
import { MapPin, Navigation, Star, User } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

interface RideRequest {
  id: string;
  riderName: string;
  riderRating: number;
  vehicleType: string;
  pickup: string;
  dropoff: string;
  estimatedFare: string;
  distance: string;
  eta: string;
}

interface RideRequestCardProps {
  request: RideRequest;
  onAccept: () => void;
  onDecline: () => void;
}

export function RideRequestCard({ request, onAccept, onDecline }: RideRequestCardProps) {
  const x = useMotionValue(0);
  const opacity = useTransform(x, [-200, 0, 200], [0.3, 1, 0.3]);
  const declineOpacity = useTransform(x, [-40, -120], [0, 1]);
  const acceptOpacity  = useTransform(x, [40, 120], [0, 1]);

  const handleDragEnd = (_: unknown, info: { offset: { x: number } }) => {
    if (info.offset.x > 100) onAccept();
    else if (info.offset.x < -100) onDecline();
  };

  return (
    <div className="relative">
      {/* Swipe indicators */}
      <motion.div
        className="absolute inset-y-0 left-4 flex items-center pointer-events-none z-10"
        style={{ opacity: declineOpacity }}
      >
        <span className="text-red-400 font-bold text-sm">✕ Decline</span>
      </motion.div>
      <motion.div
        className="absolute inset-y-0 right-4 flex items-center pointer-events-none z-10"
        style={{ opacity: acceptOpacity }}
      >
        <span className="text-emerald-400 font-bold text-sm">✓ Accept</span>
      </motion.div>

      <motion.div
        className="glass-3 rounded-2xl p-6 animate-pulse-border cursor-grab active:cursor-grabbing"
        style={{ x, opacity }}
        drag="x"
        dragConstraints={{ left: -200, right: 200 }}
        onDragEnd={handleDragEnd}
        whileTap={{ scale: 0.98 }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-amber-600/20 border border-amber-600/30 flex items-center justify-center text-amber-400">
              <User size={20} />
            </div>
            <div>
              <p className="font-semibold text-warm-white">{request.riderName}</p>
              <div className="flex items-center gap-1 mt-0.5">
                <Star size={12} fill="#D97706" className="text-amber-600" />
                <span className="text-xs text-warm-muted">{request.riderRating}</span>
              </div>
            </div>
          </div>
          <Badge variant="amber">{request.vehicleType}</Badge>
        </div>

        {/* Route */}
        <div className="space-y-2 mb-5">
          <div className="flex items-start gap-2 text-sm">
            <MapPin size={14} className="text-amber-600 mt-0.5 flex-shrink-0" />
            <span className="text-warm-muted">{request.pickup}</span>
          </div>
          <div className="ml-[7px] w-px h-4 bg-white/20" />
          <div className="flex items-start gap-2 text-sm">
            <Navigation size={14} className="text-amber-400 mt-0.5 flex-shrink-0" />
            <span className="text-warm-white">{request.dropoff}</span>
          </div>
        </div>

        {/* Meta */}
        <div className="flex items-center justify-between pb-5 border-b border-white/[0.07]">
          <span className="text-xs text-warm-faint">{request.distance} · {request.eta}</span>
          <span className="font-display text-amber-500 text-lg">{request.estimatedFare}</span>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-2 gap-3 mt-4">
          <Button
            variant="glass"
            fullWidth
            onClick={onDecline}
            className="hover:border-red-500/40 hover:text-red-400"
          >
            Decline
          </Button>
          <Button variant="neon" fullWidth onClick={onAccept}>
            Accept
          </Button>
        </div>

        <p className="text-xs text-center text-warm-faint mt-3">
          Swipe right to accept · Swipe left to decline
        </p>
      </motion.div>
    </div>
  );
}
