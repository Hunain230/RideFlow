import { Car, CarFront, Truck, ArrowRight } from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { useAppStore } from '@/store/useAppStore';

const vehicles = [
  {
    key: 'economy' as const,
    icon: <Car size={36} className="text-amber-600" />,
    name: 'Economy',
    price: 'From $8',
    description: 'Comfortable, efficient rides at unbeatable value. Perfect for everyday commutes.',
    popular: false,
  },
  {
    key: 'premium' as const,
    icon: <CarFront size={36} className="text-amber-500" />,
    name: 'Premium',
    price: 'From $18',
    description: 'Executive vehicles with top-rated drivers. Arrive in style for any occasion.',
    popular: true,
  },
  {
    key: 'suv' as const,
    icon: <Truck size={36} className="text-amber-400" />,
    name: 'SUV',
    price: 'From $24',
    description: 'Spacious comfort for groups, families, and extra luggage. No compromise.',
    popular: false,
  },
];

export function VehicleOptions() {
  const ref = useScrollReveal();
  const { openSignUp } = useAppStore();

  return (
    <section id="vehicles" className="section-pad">
      <div className="container-rf" ref={ref}>
        <div className="text-center mb-16 scroll-reveal">
          <span className="text-amber-600 text-xs font-semibold uppercase tracking-[0.12em]">
            Choose Your Ride
          </span>
          <h2 className="font-display text-4xl text-warm-white mt-3">
            Premium Vehicle Options
          </h2>
          <p className="text-warm-muted mt-3 max-w-[44ch] mx-auto">
            Every tier delivers warmth, safety, and on-time arrival. Choose what fits your journey.
          </p>
        </div>

        <div className="reveal-group grid grid-cols-1 md:grid-cols-3 gap-6">
          {vehicles.map(({ key, icon, name, price, description, popular }) => (
            <GlassCard
              key={key}
              tier={2}
              tilt
              spotlight
              className="scroll-reveal p-8 flex flex-col items-center text-center group hover:border-amber-600/30 transition-all duration-300"
            >
              {/* Popular badge */}
              {popular && (
                <div className="mb-4">
                  <Badge variant="amber">Most Popular</Badge>
                </div>
              )}

              {/* Vehicle icon */}
              <div
                className="w-20 h-20 rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300"
                style={{ background: 'rgba(217,119,6,0.08)', border: '1px solid rgba(217,119,6,0.2)' }}
              >
                {icon}
              </div>

              <h3 className="font-display text-2xl text-warm-white mb-1">{name}</h3>
              <p className="font-display text-xl text-amber-500 mb-3">{price}</p>
              <p className="text-warm-muted text-sm leading-relaxed mb-6">{description}</p>

              <Button
                variant="gradient-border"
                size="sm"
                onClick={openSignUp}
                className="flex items-center gap-2 mt-auto"
              >
                Select {name}
                <ArrowRight size={14} />
              </Button>
            </GlassCard>
          ))}
        </div>
      </div>
    </section>
  );
}
