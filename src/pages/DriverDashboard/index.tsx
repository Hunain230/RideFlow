import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAppStore } from '@/store/useAppStore';
import { Sidebar } from '@/components/layout/Sidebar';
import { CounterStat } from '@/components/shared/CounterStat';
import { OnlineToggle } from './OnlineToggle';
import { RideRequestCard } from './RideRequestCard';
import { EarningsChart } from './EarningsChart';
import { MapPanel } from '@/components/shared/MapPanel';
import { Car, Clock, BarChart2, Home, Settings, Star } from 'lucide-react';
import { fadeSlideUp } from '@/lib/motion';

const sidebarItems = [
  { label: 'Dashboard', href: '/driver', icon: <BarChart2 size={18} /> },
  { label: 'Earnings', href: '/driver/earnings', icon: <Clock size={18} /> },
  { label: 'Trips', href: '/driver/trips', icon: <Car size={18} /> },
  { label: 'Home', href: '/', icon: <Home size={18} /> },
  { label: 'Settings', href: '/driver/settings', icon: <Settings size={18} /> },
];

const mockRequest = {
  id: '1',
  riderName: 'Sarah M.',
  riderRating: 4.8,
  vehicleType: 'Economy',
  pickup: '14 Elm Street, Downtown',
  dropoff: 'City Airport — Terminal 1',
  estimatedFare: '$28–32',
  distance: '18 km',
  eta: '~22 min',
};

export default function DriverDashboard() {
  const { user } = useAppStore();
  const [hasRequest, setHasRequest] = useState(true);

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: 'var(--bg-base)' }}>
      {/* Sidebar */}
      <div className="hidden md:block w-[240px] flex-shrink-0 border-r border-white/[0.07] h-full overflow-y-auto">
        <Sidebar items={sidebarItems} role="driver" />
      </div>

      <main className="flex-1 overflow-y-auto">
        <motion.div {...fadeSlideUp} className="max-w-4xl mx-auto px-6 py-8 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-display text-3xl text-warm-white">
                Driver Hub
              </h1>
              <p className="text-warm-muted text-sm mt-1">
                Welcome back, {user?.name ?? 'Driver'}
              </p>
            </div>
            <div className="font-display text-2xl gradient-text">$124.50</div>
          </div>

          {/* Online toggle */}
          <OnlineToggle />

          {/* Stat row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <CounterStat target={12} label="Trips Today" />
            <CounterStat target={49} label="Rating" prefix="" suffix="/50" />
            <CounterStat target={6} label="Hours Online" suffix="h" />
            <CounterStat target={124} label="Earnings" prefix="$" highlight />
          </div>

          {/* Ride request + map */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {hasRequest ? (
              <RideRequestCard
                request={mockRequest}
                onAccept={() => setHasRequest(false)}
                onDecline={() => setHasRequest(false)}
              />
            ) : (
              <div className="glass-1 rounded-2xl p-8 flex flex-col items-center justify-center text-center">
                <Star size={32} className="text-amber-600 mb-3" />
                <p className="text-warm-white font-semibold">All caught up!</p>
                <p className="text-warm-muted text-sm mt-1">Waiting for new ride requests…</p>
              </div>
            )}
            <MapPanel origin="Your Location" destination="City Airport" />
          </div>

          {/* Earnings chart */}
          <EarningsChart />
        </motion.div>
      </main>
    </div>
  );
}
