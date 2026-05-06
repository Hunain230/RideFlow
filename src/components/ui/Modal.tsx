import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { modalVariants, overlayVariants } from '@/lib/motion';
import { Button } from './Button';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  maxWidth?: string;
  hideClose?: boolean;
}

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = '440px',
  hideClose = false,
}: ModalProps) {
  const firstFocusRef = useRef<HTMLButtonElement>(null);

  // Close on Escape
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  // Lock scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Focus first element on open
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => firstFocusRef.current?.focus(), 50);
    }
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-[200] flex items-center justify-center p-4"
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            style={{ backgroundColor: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(4px)' }}
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Card */}
          <motion.div
            className="glass-3 fixed z-[201] w-full p-10 overflow-y-auto max-h-[90vh]"
            style={{
              maxWidth,
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
            }}
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            role="dialog"
            aria-modal="true"
            aria-labelledby={title ? 'modal-title' : undefined}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            {!hideClose && (
              <Button
                ref={firstFocusRef}
                variant="icon"
                onClick={onClose}
                className="absolute top-5 right-5"
                aria-label="Close modal"
              >
                <X size={18} />
              </Button>
            )}

            {title && (
              <h2 id="modal-title" className="font-display text-2xl text-warm-white mb-1">
                {title}
              </h2>
            )}

            {children}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
