import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, Info, X } from 'lucide-react';
import { clsx } from 'clsx';
import { springs } from '../../motion/presets';

export type ToastType = 'success' | 'error' | 'info';

interface ToastProps {
  id: string;
  message: string;
  type?: ToastType;
  onClose: (id: string) => void;
  duration?: number;
}

export function Toast({ id, message, type = 'info', onClose, duration = 4000 }: ToastProps) {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => onClose(id), duration);
      return () => clearTimeout(timer);
    }
  }, [id, duration, onClose]);

  const icons = {
    success: <CheckCircle className="text-success" size={20} />,
    error: <XCircle className="text-error" size={20} />,
    info: <Info className="text-amber-500" size={20} />,
  };

  const borderColors = {
    success: 'border-success/30',
    error: 'border-error/30',
    info: 'border-amber-500/30',
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 50, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1, transition: springs.bouncy }}
      exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
      className={clsx(
        'pointer-events-auto flex w-full max-w-sm items-center gap-3 overflow-hidden rounded-radius-md bg-glass-bg backdrop-blur-[20px] p-4 shadow-lg border',
        borderColors[type]
      )}
    >
      <div className="flex-shrink-0">{icons[type]}</div>
      <p className="flex-1 text-sm font-medium text-text-primary">{message}</p>
      <button
        onClick={() => onClose(id)}
        className="flex-shrink-0 rounded-radius-sm p-1 opacity-70 transition-opacity hover:bg-white/10 hover:opacity-100"
      >
        <X size={16} className="text-text-muted" />
      </button>
    </motion.div>
  );
}

// Simple global toast manager (singleton) for convenience
let toastCount = 0;
type ToastItem = { id: string; message: string; type: ToastType; duration?: number };
let listeners: ((toasts: ToastItem[]) => void)[] = [];
let toasts: ToastItem[] = [];

export const toast = {
  success: (msg: string, dur?: number) => addToast(msg, 'success', dur),
  error: (msg: string, dur?: number) => addToast(msg, 'error', dur),
  info: (msg: string, dur?: number) => addToast(msg, 'info', dur),
};

function addToast(message: string, type: ToastType, duration?: number) {
  const id = `toast-${++toastCount}`;
  toasts = [...toasts, { id, message, type, duration }];
  listeners.forEach(l => l(toasts));
}

function removeToast(id: string) {
  toasts = toasts.filter(t => t.id !== id);
  listeners.forEach(l => l(toasts));
}

export function ToastProvider() {
  const [currentToasts, setCurrentToasts] = React.useState<ToastItem[]>([]);
  
  React.useEffect(() => {
    listeners.push(setCurrentToasts);
    return () => { listeners = listeners.filter(l => l !== setCurrentToasts); };
  }, []);

  return (
    <div className="fixed bottom-0 right-0 z-[300] flex flex-col gap-2 p-4 md:p-6 w-full md:w-auto pointer-events-none">
      <AnimatePresence mode="popLayout">
        {currentToasts.map(t => (
          <Toast key={t.id} {...t} onClose={removeToast} />
        ))}
      </AnimatePresence>
    </div>
  );
}
