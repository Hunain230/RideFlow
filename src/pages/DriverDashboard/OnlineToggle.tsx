import { Toggle } from '@/components/ui/Toggle';
import { useAppStore } from '@/store/useAppStore';

export function OnlineToggle() {
  const { driverOnline, toggleDriverOnline } = useAppStore();

  return (
    <div
      className="glass-2 rounded-2xl px-6 py-5 flex items-center justify-between"
    >
      <div>
        <p className="font-semibold text-warm-white">
          {driverOnline ? 'You are Online' : 'You are Offline'}
        </p>
        <p className="text-xs text-warm-muted mt-0.5">
          {driverOnline
            ? 'Accepting ride requests near you'
            : 'Go online to start earning'}
        </p>
      </div>
      <Toggle
        checked={driverOnline}
        onChange={toggleDriverOnline}
        label={driverOnline ? 'ONLINE' : 'OFFLINE'}
        size="lg"
        id="driver-online-toggle"
      />
    </div>
  );
}
