import React from 'react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';
import { Link } from 'react-router-dom';

export interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
}

interface SidebarProps {
  items: NavItem[];
  activeId: string;
  onSelect: (id: string) => void;
  title?: string;
}

export function Sidebar({ items, activeId, onSelect, title }: SidebarProps) {
  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 h-full bg-bg-surface border-r border-glass-border p-4 pt-24 shrink-0 fixed left-0 top-0 bottom-0 z-40">
        {title && <h2 className="text-xl font-display text-text-primary mb-6 px-4">{title}</h2>}
        <nav className="flex flex-col gap-2 relative">
          {items.map((item) => {
            const isActive = item.id === activeId;
            return (
              <button
                key={item.id}
                onClick={() => onSelect(item.id)}
                className={clsx(
                  'flex items-center gap-3 px-4 py-3 rounded-radius-md text-sm font-medium transition-colors relative z-10',
                  isActive ? 'text-amber-500' : 'text-text-muted hover:text-text-primary hover:bg-white/5'
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="sidebar-active"
                    className="absolute inset-0 bg-amber-500/10 border-l-2 border-amber-500 rounded-radius-md -z-10"
                    initial={false}
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
                <span className={clsx('transition-transform duration-300', isActive && 'scale-110')}>
                  {item.icon}
                </span>
                {item.label}
              </button>
            );
          })}
        </nav>
      </aside>

      {/* Mobile Bottom Nav */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 h-16 bg-bg-surface border-t border-glass-border z-40 flex items-center justify-around px-2 pb-safe">
        {items.map((item) => {
          const isActive = item.id === activeId;
          return (
            <button
              key={item.id}
              onClick={() => onSelect(item.id)}
              className={clsx(
                'flex flex-col items-center justify-center w-16 h-full gap-1 transition-colors relative',
                isActive ? 'text-amber-500' : 'text-text-muted hover:text-text-primary'
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="bottomnav-active"
                  className="absolute top-0 w-8 h-1 bg-amber-500 rounded-b-full"
                  initial={false}
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              <span className={clsx('transition-transform duration-300', isActive ? '-translate-y-1 scale-110' : 'scale-100')}>
                {item.icon}
              </span>
              <span className="text-[10px] font-medium leading-none">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </>
  );
}
