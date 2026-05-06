import { ShieldCheck } from 'lucide-react';

export function SafetyBanner() {
  return (
    <section
      id="safety"
      className="py-14"
      style={{
        background: 'rgba(217,119,6,0.04)',
        borderTop: '1px solid rgba(217,119,6,0.12)',
        borderBottom: '1px solid rgba(217,119,6,0.12)',
        borderLeft: '4px solid #D97706',
      }}
    >
      <div className="container-rf">
        <div className="flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
          {/* Icon */}
          <div
            className="w-16 h-16 rounded-full flex-shrink-0 flex items-center justify-center"
            style={{ background: 'rgba(217,119,6,0.12)', border: '1px solid rgba(217,119,6,0.3)' }}
          >
            <ShieldCheck size={28} className="text-amber-600" />
          </div>

          {/* Text */}
          <div>
            <h3 className="font-display text-2xl text-warm-white mb-2">
              Safety first. Trip tracking &amp; 24/7 support.
            </h3>
            <p className="text-warm-muted text-sm leading-relaxed max-w-[52ch]">
              Every ride is GPS-tracked in real time. Share your journey with loved ones, rate your
              driver, and reach our safety team around the clock — we&apos;re always here.
            </p>
          </div>

          {/* Stats */}
          <div className="flex gap-8 md:ml-auto flex-shrink-0">
            {[
              { val: '99.8%', label: 'Safe rides' },
              { val: '24/7', label: 'Support' },
            ].map(({ val, label }) => (
              <div key={label} className="text-center">
                <p className="font-display text-2xl text-amber-500">{val}</p>
                <p className="text-xs text-warm-faint uppercase tracking-widest">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
