import { motion } from 'framer-motion';
import { useAppStore } from '@/store/useAppStore';
import { Sidebar } from '@/components/layout/Sidebar';
import { MapPanel } from '@/components/shared/MapPanel';
import { SearchBox } from './SearchBox';
import { VehicleSelector } from './VehicleSelector';
import { TripHistory } from './TripHistory';
import { Button } from '@/components/ui/Button';
import { Home, Clock, Car, Settings, ArrowRight } from 'lucide-react';
import { fadeSlideUp } from '@/lib/motion';

const sidebarItems = [
  { label: 'Book a Ride', href: '/rider', icon: <Car size={18} /> },
  { label: 'My Trips', href: '/rider/trips', icon: <Clock size={18} /> },
  { label: 'Home', href: '/', icon: <Home size={18} /> },
  { label: 'Settings', href: '/rider/settings', icon: <Settings size={18} /> },
];

export default function RiderDashboard() {
  const { user } = useAppStore();
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: 'var(--bg-base)' }}>
      {/* Sidebar — desktop */}
      <div className="hidden md:block w-[240px] flex-shrink-0 border-r border-white/[0.07] h-full overflow-y-auto">
        <Sidebar items={sidebarItems} role="rider" />
      </div>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        <motion.div {...fadeSlideUp} className="max-w-5xl mx-auto px-6 py-8">
          {/* Greeting */}
          <div className="mb-8">
            <h1 className="font-display text-3xl text-warm-white">
              {greeting}, {user?.name ?? 'Rider'}.
            </h1>
            <p className="text-warm-muted mt-1">Where are you headed today?</p>
          </div>

          {/* Search + Map layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div className="space-y-6">
              <SearchBox />
              <VehicleSelector />
              <Button variant="primary" fullWidth size="lg" className="flex items-center justify-center gap-2">
                Confirm Ride
                <ArrowRight size={18} />
              </Button>
            </div>
            <MapPanel origin="Current Location" destination="City Airport" className="h-full min-h-[320px]" />
          </div>

          {/* Trip history */}
          <TripHistory />
        </motion.div>
      </main>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 glass-3 flex items-center justify-around py-3 px-2">
        {sidebarItems.map(({ label, icon }) => (
          <button key={label} className="flex flex-col items-center gap-1 text-warm-faint hover:text-amber-400 transition-colors">
            {icon}
            <span className="text-[10px] font-medium">{label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}
