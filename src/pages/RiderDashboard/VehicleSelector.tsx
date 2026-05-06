import { Car, CarFront, Truck } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { clsx } from 'clsx';

const options = [
  { key: 'economy' as const, label: 'Economy', price: '$8–12', icon: Car, eta: '3 min' },
  { key: 'premium' as const, label: 'Premium', price: '$18–22', icon: CarFront, eta: '5 min' },
  { key: 'suv' as const,     label: 'SUV',     price: '$24–30', icon: Truck,    eta: '7 min' },
];

export function VehicleSelector() {
  const { activeVehicle, setVehicle } = useAppStore();

  return (
    <div className="space-y-2">
      {options.map(({ key, label, price, icon: Icon, eta }) => {
        const active = activeVehicle === key;
        return (
          <button
            key={key}
            onClick={() => setVehicle(key)}
            className={clsx(
              'w-full flex items-center justify-between px-5 py-4 rounded-xl border-2 transition-all duration-200 cursor-pointer',
              active
                ? 'glass-amber border-amber-600/50 text-amber-400'
                : 'glass-1 border-transparent text-warm-muted hover:border-white/10 hover:text-warm-white'
            )}
          >
            <div className="flex items-center gap-4">
              <div
                className={clsx(
                  'w-10 h-10 rounded-xl flex items-center justify-center transition-colors',
                  active ? 'bg-amber-600/20' : 'bg-white/5'
                )}
              >
                <Icon size={20} className={active ? 'text-amber-500' : 'text-warm-faint'} />
              </div>
              <div className="text-left">
                <p className="font-semibold text-sm">{label}</p>
                <p className="text-xs text-warm-faint">ETA {eta}</p>
              </div>
            </div>
            <span className={clsx('font-display text-lg', active ? 'text-amber-500' : 'text-warm-muted')}>
              {price}
            </span>
          </button>
        );
      })}
    </div>
  );
}
