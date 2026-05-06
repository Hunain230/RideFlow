import { getPasswordStrength } from '@/lib/validators';

interface PasswordStrengthProps {
  password: string;
}

export function PasswordStrength({ password }: PasswordStrengthProps) {
  if (!password) return null;

  const { score, label, color } = getPasswordStrength(password);
  const pct = (score / 5) * 100;

  return (
    <div className="mt-2 space-y-1.5">
      <div className="h-1 w-full rounded-full bg-white/10 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500 ease-out"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
      <p className="text-xs font-medium" style={{ color }}>
        {label}
      </p>
    </div>
  );
}
