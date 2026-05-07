import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { fadeSlideUp, modalVariants, overlayVariants } from '../../motion/presets';
import { GlassCard } from '../ui/GlassCard';
import { SignInForm } from './SignInForm';
import { SignUpForm } from './SignUpForm';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode?: 'signin' | 'signup';
}

export function AuthModal({ isOpen, onClose, mode: initialMode = 'signin' }: AuthModalProps) {
  const [mode, setMode] = useState<'signin' | 'signup'>(initialMode);

  React.useEffect(() => {
    setMode(initialMode);
  }, [initialMode]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
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
          <GlassCard tier={3} className="p-1 max-h-[90vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-3 shrink-0">
              <div className="flex bg-glass-bg-light rounded-radius-full p-1 border border-glass-border">
                <button
                  onClick={() => setMode('signin')}
                  className={`px-6 py-2 rounded-radius-full text-sm font-medium transition-all duration-300 ${
                    mode === 'signin' ? 'bg-amber-600 text-bg-base shadow-glow' : 'text-text-muted hover:text-text-primary'
                  }`}
                >
                  Sign In
                </button>
                <button
                  onClick={() => setMode('signup')}
                  className={`px-6 py-2 rounded-radius-full text-sm font-medium transition-all duration-300 ${
                    mode === 'signup' ? 'bg-amber-600 text-bg-base shadow-glow' : 'text-text-muted hover:text-text-primary'
                  }`}
                >
                  Sign Up
                </button>
              </div>
              <button onClick={onClose} className="p-2 rounded-radius-full hover:bg-white/10 transition-colors text-text-muted hover:text-text-primary">
                <X size={20} />
              </button>
            </div>

            <div className="p-5 md:p-8 overflow-y-auto custom-scrollbar flex-1">
              <AnimatePresence mode="wait">
                <motion.div
                  key={mode}
                  variants={fadeSlideUp}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                >
                  {mode === 'signin' ? (
                    <SignInForm onSuccess={onClose} />
                  ) : (
                    <SignUpForm onSuccess={onClose} />
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
