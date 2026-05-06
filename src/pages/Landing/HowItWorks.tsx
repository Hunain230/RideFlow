import { Smartphone, MapPin, Car } from 'lucide-react';
import { useScrollReveal } from '@/hooks/useScrollReveal';

const steps = [
  {
    icon: <Smartphone size={28} />,
    num: '01',
    title: 'Open the App',
    description: 'Download RideFlow and create your account in under 2 minutes. No complicated forms.',
  },
  {
    icon: <MapPin size={28} />,
    num: '02',
    title: 'Set Your Destination',
    description: "Enter where you're going — our AI finds the optimal route and matches you with nearby drivers.",
  },
  {
    icon: <Car size={28} />,
    num: '03',
    title: 'Ride in Comfort',
    description: 'Your vetted, professional driver arrives. Sit back, relax, and enjoy the journey.',
  },
];

export function HowItWorks() {
  const ref = useScrollReveal();

  return (
    <section id="how-it-works" className="section-pad" style={{ background: 'rgba(255,255,255,0.01)' }}>
      <div className="container-rf" ref={ref}>
        <div className="text-center mb-16 scroll-reveal">
          <span className="text-amber-600 text-xs font-semibold uppercase tracking-[0.12em]">
            Simple &amp; Intuitive
          </span>
          <h2 className="font-display text-4xl text-warm-white mt-3">
            How RideFlow Works
          </h2>
          <p className="text-warm-muted mt-3 max-w-[44ch] mx-auto">
            Three effortless steps between you and your premium ride.
          </p>
        </div>

        <div className="reveal-group grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Connector line — desktop only */}
          <div
            className="hidden md:block absolute top-[36px] left-[15%] right-[15%] h-px pointer-events-none"
            style={{ background: 'linear-gradient(to right, transparent, rgba(217,119,6,0.3), transparent)' }}
            aria-hidden="true"
          />

          {steps.map(({ icon, num, title, description }) => (
            <div key={num} className="scroll-reveal flex flex-col items-center text-center">
              {/* Icon circle */}
              <div
                className="w-[72px] h-[72px] rounded-full flex items-center justify-center mb-5 text-amber-600 relative z-10"
                style={{ background: 'rgba(217,119,6,0.1)', border: '1px solid rgba(217,119,6,0.25)' }}
              >
                {icon}
              </div>

              <span className="text-xs font-semibold text-warm-faint uppercase tracking-widest mb-2">
                Step {num}
              </span>
              <h3 className="font-display text-2xl text-warm-white mb-3">{title}</h3>
              <p className="text-warm-muted text-sm leading-relaxed max-w-[28ch]">
                {description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
