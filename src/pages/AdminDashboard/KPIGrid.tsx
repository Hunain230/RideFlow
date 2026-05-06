import { CounterStat } from '@/components/shared/CounterStat';
import { Skeleton } from '@/components/ui/Skeleton';
import { useState, useEffect } from 'react';

const kpis = [
  { target: 4200, label: 'Total Rides', suffix: '', prefix: '', highlight: false },
  { target: 82000, label: 'Revenue', suffix: '', prefix: '$', highlight: true },
  { target: 98, label: 'Uptime', suffix: '%', prefix: '', highlight: false },
  { target: 47, label: 'Avg Rating', suffix: '/50', prefix: '', highlight: false },
];

export function KPIGrid() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(t);
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="glass-1 rounded-2xl p-6">
            <Skeleton variant="text" />
            <div className="mt-2">
              <Skeleton height="2.5rem" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
      {kpis.map(({ target, label, suffix, prefix, highlight }) => (
        <CounterStat
          key={label}
          target={target}
          label={label}
          suffix={suffix}
          prefix={prefix}
          highlight={highlight}
        />
      ))}
    </div>
  );
}
