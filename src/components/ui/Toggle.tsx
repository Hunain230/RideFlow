import { motion } from 'framer-motion';
import { clsx } from 'clsx';
import { springs } from '@/lib/motion';

interface ToggleProps {
  checked: boolean;
  onChange: (v: boolean) => void;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  id?: string;
}

const sizeMap = {
  sm: { track: 'w-10 h-5',   knob: 'w-4 h-4',   offset: 20 },
  md: { track: 'w-14 h-7',   knob: 'w-5 h-5',   offset: 28 },
  lg: { track: 'w-20 h-10',  knob: 'w-8 h-8',   offset: 42 },
};

export function Toggle({
  checked,
  onChange,
  label,
  size = 'md',
  className,
  id,
}: ToggleProps) {
  const s = sizeMap[size];

  return (
    <label
      className={clsx('inline-flex items-center gap-3 cursor-pointer select-none', className)}
      htmlFor={id}
    >
      <button
        id={id}
        role="switch"
        aria-checked={checked}
        type="button"
        onClick={() => onChange(!checked)}
        className={clsx(
          'relative rounded-full transition-colors duration-300 focus-visible:ring-2 focus-visible:ring-amber-600/50',
          s.track,
          checked
            ? 'bg-amber-600 shadow-[0_0_16px_rgba(217,119,6,0.4)]'
            : 'bg-white/10 border border-white/10'
        )}
      >
        <motion.span
          layout
          transition={springs.bouncy}
          className={clsx(
            'absolute top-1 rounded-full bg-white shadow-md',
            s.knob,
            checked ? 'left-auto right-1' : 'left-1'
          )}
          style={{
            x: checked ? s.offset - 4 : 0,
          }}
        />
      </button>
      {label && (
        <span className={clsx(
          'text-sm font-semibold tracking-wide uppercase',
          checked ? 'text-amber-400' : 'text-warm-muted'
        )}>
          {label}
        </span>
      )}
    </label>
  );
}
