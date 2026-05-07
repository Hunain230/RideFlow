import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { modalVariants, overlayVariants } from '../../motion/presets';
import { GlassCard } from './GlassCard';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <motion.div
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={onClose}
            className="absolute inset-0 bg-bg-overlay backdrop-blur-sm"
          />
          <motion.div
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="relative w-full max-w-[480px] z-[201]"
          >
            <GlassCard tier={3} className="p-6">
              {title && (
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-display text-text-primary">{title}</h2>
                  <button onClick={onClose} className="p-2 rounded-radius-full hover:bg-white/10 transition-colors text-text-muted hover:text-text-primary">
                    <X size={20} />
                  </button>
                </div>
              )}
              {children}
            </GlassCard>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
