import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { listItem, staggerContainer } from '@/lib/motion';

interface FeedItem {
  id: string;
  rider: string;
  driver: string;
  route: string;
  fare: string;
  time: string;
  status: 'active' | 'completed';
}

const initialFeed: FeedItem[] = [
  { id: 'f1', rider: 'Maya J.', driver: 'Liam R.', route: 'Central → North Quarter', fare: '$19.50', time: 'just now', status: 'active' },
  { id: 'f2', rider: 'Kai S.',  driver: 'Sofia B.', route: 'West End → Harbor', fare: '$26.80', time: '1 min ago', status: 'active' },
  { id: 'f3', rider: 'Elena T.', driver: 'Marcus W.', route: 'Plaza Hotel → Station', fare: '$12.40', time: '3 min ago', status: 'completed' },
];

export function LiveFeed() {
  const [feed, setFeed] = useState<FeedItem[]>(initialFeed);

  // Simulate new rides coming in
  useEffect(() => {
    const newRides: FeedItem[] = [
      { id: `live-${Date.now()}`, rider: 'Chris P.', driver: 'Ana L.', route: 'Airport → Midtown', fare: '$38.00', time: 'just now', status: 'active' },
      { id: `live-${Date.now() + 1}`, rider: 'Zara K.', driver: 'Josh M.', route: 'University → Downtown', fare: '$14.20', time: 'just now', status: 'active' },
    ];

    const timers = newRides.map((ride, i) =>
      setTimeout(() => {
        setFeed((prev) => [ride, ...prev].slice(0, 10));
      }, (i + 1) * 4000)
    );

    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className="glass-1 rounded-2xl overflow-hidden">
      <div className="px-6 py-4 border-b border-white/[0.07] flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        <h3 className="font-semibold text-warm-white">Live Feed</h3>
        <Activity size={14} className="text-amber-600 ml-auto" />
      </div>

      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="divide-y divide-white/[0.04] max-h-[340px] overflow-y-auto"
      >
        <AnimatePresence initial={false}>
          {feed.map((item) => (
            <motion.div
              key={item.id}
              variants={listItem}
              initial="initial"
              animate="animate"
              exit={{ opacity: 0, height: 0 }}
              className="px-5 py-3 flex items-center gap-3 hover:bg-amber-600/[0.02] transition-colors"
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm text-warm-white truncate">
                  {item.rider} → {item.driver}
                </p>
                <p className="text-xs text-warm-faint truncate">{item.route}</p>
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className="font-display text-sm text-amber-500">{item.fare}</span>
                <Badge variant={item.status === 'active' ? 'amber' : 'success'} className="text-[10px]">
                  {item.status}
                </Badge>
              </div>
              <span className="text-xs text-warm-faint w-16 text-right">{item.time}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
