import { NavLink } from 'react-router-dom';
import { clsx } from 'clsx';
import { useAppStore } from '@/store/useAppStore';
import { LogOut, User } from 'lucide-react';

interface SidebarItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

interface SidebarProps {
  items: SidebarItem[];
  role?: string;
}

export function Sidebar({ items, role }: SidebarProps) {
  const { user, logout } = useAppStore();

  return (
    <aside className="h-full flex flex-col" style={{ background: 'var(--bg-surface)' }}>
      {/* Logo */}
      <div className="px-6 py-5 border-b border-white/[0.07]">
        <span className="font-display text-xl text-warm-white">
          Ride<span className="text-amber-500">Flow</span>
        </span>
        {role && (
          <span className="block text-xs font-semibold uppercase tracking-widest text-warm-faint mt-1">
            {role} portal
          </span>
        )}
      </div>

      {/* Nav items */}
      <nav className="flex-1 py-4 overflow-y-auto">
        {items.map(({ label, href, icon }) => (
          <NavLink
            key={href}
            to={href}
            className={({ isActive }) =>
              clsx(
                'flex items-center gap-3 px-6 py-3 text-sm font-medium border-l-[3px] transition-all duration-200',
                isActive
                  ? 'text-amber-400 border-amber-500 bg-amber-600/10'
                  : 'text-white/60 border-transparent hover:text-white/90 hover:bg-white/5'
              )
            }
          >
            {icon}
            {label}
          </NavLink>
        ))}
      </nav>

      {/* User profile at bottom */}
      <div className="px-6 py-4 border-t border-white/[0.07]">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-amber-600/20 border border-amber-600/30 flex items-center justify-center text-amber-400">
            <User size={16} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-warm-white truncate">
              {user?.name || 'Guest'}
            </p>
            <p className="text-xs text-warm-faint truncate">{user?.email || ''}</p>
          </div>
          <button
            onClick={logout}
            className="text-warm-faint hover:text-red-400 transition-colors"
            aria-label="Sign out"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </aside>
  );
}
