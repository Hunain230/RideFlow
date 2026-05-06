import { useState } from 'react';
import { MapPin, Navigation, Home, Briefcase, Star } from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/Button';

export function SearchBox() {
  const [origin, setOrigin] = useState('');
  const [dest, setDest] = useState('');

  const quickDests = [
    { label: 'Home', icon: <Home size={14} /> },
    { label: 'Work', icon: <Briefcase size={14} /> },
    { label: 'Saved', icon: <Star size={14} /> },
  ];

  return (
    <div className="space-y-4">
      <GlassCard tier={2} className="overflow-hidden">
        {/* Origin row */}
        <div
          className="flex items-center gap-3 px-5 py-4 cursor-pointer group hover:bg-white/[0.02] transition-colors"
          onClick={() => {}}
        >
          <span className="w-2.5 h-2.5 rounded-full flex-shrink-0 bg-amber-600" />
          <input
            type="text"
            placeholder="Your current location"
            value={origin}
            onChange={(e) => setOrigin(e.target.value)}
            className="flex-1 bg-transparent text-sm text-warm-white placeholder-warm-faint outline-none"
          />
          <MapPin size={16} className="text-warm-faint" />
        </div>

        {/* Separator */}
        <div className="mx-5 h-px bg-white/[0.07]" />

        {/* Destination row */}
        <div
          className="flex items-center gap-3 px-5 py-4 cursor-pointer hover:bg-white/[0.02] transition-colors"
        >
          <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: '#F5F0E8' }} />
          <input
            type="text"
            placeholder="Where to?"
            value={dest}
            onChange={(e) => setDest(e.target.value)}
            className="flex-1 bg-transparent text-sm text-warm-white placeholder-warm-faint outline-none"
          />
          <Navigation size={16} className="text-warm-faint" />
        </div>
      </GlassCard>

      {/* Quick destinations */}
      <div className="flex gap-2 flex-wrap">
        {quickDests.map(({ label, icon }) => (
          <button
            key={label}
            className="flex items-center gap-2 px-4 py-2 glass-1 rounded-full text-sm font-medium text-warm-muted hover:text-amber-400 hover:border-amber-600/40 transition-all duration-200"
          >
            <span className="text-amber-600">{icon}</span>
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
