import { Badge } from '@/components/ui/Badge';
import { Skeleton } from '@/components/ui/Skeleton';
import { useState, useEffect } from 'react';

const trips = [
  { id: 'RF-1042', rider: 'Sarah M.', driver: 'Alex T.', route: 'Downtown → Airport', fare: '$34.50', date: 'May 6, 09:14', status: 'completed' },
  { id: 'RF-1041', rider: 'Omar K.', driver: 'Priya S.', route: 'Hotel Grand → Mall', fare: '$15.20', date: 'May 6, 08:52', status: 'active' },
  { id: 'RF-1040', rider: 'Jin L.', driver: 'Ben R.', route: 'Station → Eastside', fare: '$22.00', date: 'May 6, 08:33', status: 'completed' },
  { id: 'RF-1039', rider: 'Aisha N.', driver: 'Carlos M.', route: 'University → Hospital', fare: '$18.75', date: 'May 6, 07:58', status: 'cancelled' },
  { id: 'RF-1038', rider: 'Tom B.', driver: 'Farah Y.', route: 'Airport → Suburbs', fare: '$45.00', date: 'May 5, 23:41', status: 'completed' },
];

type Status = 'completed' | 'active' | 'cancelled';

const statusVariant: Record<Status, 'success' | 'amber' | 'error'> = {
  completed: 'success',
  active: 'amber',
  cancelled: 'error',
};

export function TripsTable() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 1100);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="glass-1 rounded-2xl overflow-hidden">
      <div className="px-6 py-4 border-b border-white/[0.07]">
        <h3 className="font-semibold text-warm-white">Recent Trips</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/[0.07]">
              {['Trip ID', 'Rider', 'Driver', 'Route', 'Fare', 'Date', 'Status'].map((h) => (
                <th
                  key={h}
                  className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-widest text-amber-600"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading
              ? Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-b border-white/[0.04]">
                    {Array.from({ length: 7 }).map((_, j) => (
                      <td key={j} className="px-4 py-3">
                        <Skeleton variant="text" />
                      </td>
                    ))}
                  </tr>
                ))
              : trips.map((trip) => (
                  <tr
                    key={trip.id}
                    className="border-b border-white/[0.04] hover:bg-amber-600/[0.03] transition-colors"
                  >
                    <td className="px-4 py-3 font-mono text-xs text-warm-faint">{trip.id}</td>
                    <td className="px-4 py-3 text-warm-white">{trip.rider}</td>
                    <td className="px-4 py-3 text-warm-muted">{trip.driver}</td>
                    <td className="px-4 py-3 text-warm-muted max-w-[200px] truncate">{trip.route}</td>
                    <td className="px-4 py-3 font-display text-amber-500">{trip.fare}</td>
                    <td className="px-4 py-3 text-xs text-warm-faint">{trip.date}</td>
                    <td className="px-4 py-3">
                      <Badge variant={statusVariant[trip.status as Status]}>
                        {trip.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
