import { motion } from 'framer-motion';
import { useAppStore } from '@/store/useAppStore';
import { Sidebar } from '@/components/layout/Sidebar';
import { KPIGrid } from './KPIGrid';
import { RevenueChart } from './RevenueChart';
import { TripsTable } from './TripsTable';
import { LiveFeed } from './LiveFeed';
import {
  BarChart2,
  Map,
  Users,
  Receipt,
  CreditCard,
  AlertTriangle,
  Bell,
  Settings,
} from 'lucide-react';
import { fadeSlideUp } from '@/lib/motion';

const sidebarItems = [
  { label: 'Overview', href: '/admin', icon: <BarChart2 size={18} /> },
  { label: 'Live Map', href: '/admin/map', icon: <Map size={18} /> },
  { label: 'Users', href: '/admin/users', icon: <Users size={18} /> },
  { label: 'Trips', href: '/admin/trips', icon: <Receipt size={18} /> },
  { label: 'Payments', href: '/admin/payments', icon: <CreditCard size={18} /> },
  { label: 'Disputes', href: '/admin/disputes', icon: <AlertTriangle size={18} /> },
  { label: 'Notifications', href: '/admin/notifications', icon: <Bell size={18} /> },
  { label: 'Settings', href: '/admin/settings', icon: <Settings size={18} /> },
];

export default function AdminDashboard() {
  const now = new Date();
  const dateStr = now.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: 'var(--bg-base)' }}>
      {/* Persistent sidebar — 256px */}
      <div className="hidden md:block w-[256px] flex-shrink-0 border-r border-white/[0.07] h-full overflow-y-auto">
        <Sidebar items={sidebarItems} role="admin" />
      </div>

      {/* Scrollable main area */}
      <main className="flex-1 overflow-y-auto">
        <motion.div {...fadeSlideUp} className="px-8 py-8 max-w-[1100px] mx-auto space-y-6">
          {/* Page header */}
          <div className="flex items-start justify-between">
            <div>
              <h1 className="font-display text-3xl text-warm-white">Overview</h1>
              <p className="text-xs text-warm-faint mt-1 uppercase tracking-widest">{dateStr}</p>
            </div>
            <div className="flex gap-2">
              {['Today', 'Week', 'Month'].map((p, i) => (
                <button
                  key={p}
                  className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
                    i === 0
                      ? 'glass-amber text-amber-400 border-amber-600/30'
                      : 'glass-1 text-warm-faint border-transparent hover:border-white/10'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* KPI Grid */}
          <KPIGrid />

          {/* Revenue chart */}
          <RevenueChart />

          {/* Table + Live Feed */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6">
            <TripsTable />
            <LiveFeed />
          </div>
        </motion.div>
      </main>
    </div>
  );
}
