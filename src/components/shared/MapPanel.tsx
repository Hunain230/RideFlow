import { MapPin, Navigation } from 'lucide-react';

interface MapPanelProps {
  origin?: string;
  destination?: string;
  className?: string;
}

export function MapPanel({ origin, destination, className }: MapPanelProps) {
  return (
    <div
      className={`glass-2 rounded-2xl overflow-hidden relative ${className ?? ''}`}
      style={{
        perspective: '800px',
        transform: 'rotateX(4deg)',
        transition: 'transform 0.4s ease',
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.transform = 'rotateX(0deg)';
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.transform = 'rotateX(4deg)';
      }}
    >
      {/* Simulated map grid */}
      <div
        className="relative w-full h-64"
        style={{
          background:
            'linear-gradient(rgba(20,19,18,0.9), rgba(20,19,18,0.6)), repeating-linear-gradient(0deg, transparent, transparent 39px, rgba(255,255,255,0.03) 40px), repeating-linear-gradient(90deg, transparent, transparent 39px, rgba(255,255,255,0.03) 40px)',
        }}
      >
        {/* Ambient amber glow center */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse at 50% 60%, rgba(217,119,6,0.12) 0%, transparent 65%)',
          }}
        />

        {/* Route line */}
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 400 250"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            d="M 80 200 Q 160 80 280 100"
            stroke="#D97706"
            strokeWidth="2"
            strokeDasharray="6 4"
            strokeLinecap="round"
            opacity="0.7"
          />
          <circle cx="80" cy="200" r="6" fill="#D97706" opacity="0.9" />
          <circle cx="280" cy="100" r="6" fill="#FBBF24" opacity="0.9" />
          {/* Car icon */}
          <circle cx="180" cy="140" r="8" fill="rgba(217,119,6,0.3)" />
          <circle cx="180" cy="140" r="4" fill="#D97706" />
        </svg>

        {/* Origin / destination labels */}
        {origin && (
          <div className="absolute bottom-3 left-4 flex items-center gap-1.5 glass-1 px-3 py-1.5 rounded-full text-xs text-warm-white">
            <MapPin size={12} className="text-amber-600" />
            {origin}
          </div>
        )}
        {destination && (
          <div className="absolute top-3 right-4 flex items-center gap-1.5 glass-1 px-3 py-1.5 rounded-full text-xs text-warm-white">
            <Navigation size={12} className="text-amber-400" />
            {destination}
          </div>
        )}
      </div>

      {/* Bottom gradient overlay */}
      <div
        className="absolute bottom-0 left-0 right-0 h-16 pointer-events-none"
        style={{
          background:
            'linear-gradient(to top, rgba(20,19,18,0.9), transparent)',
        }}
      />

      {/* ETA chip */}
      <div className="absolute bottom-3 right-4 glass-amber px-3 py-1 rounded-full text-xs font-semibold text-amber-400">
        ETA ~12 min
      </div>
    </div>
  );
}
