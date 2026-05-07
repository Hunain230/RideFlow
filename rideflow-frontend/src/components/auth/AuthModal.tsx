import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles } from 'lucide-react';
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
          className="absolute inset-0 bg-bg-overlay backdrop-blur-md"
        />
        
        <motion.div
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="relative w-full max-w-[520px] z-[201]"
        >
          <GlassCard tier={3} className="p-1 max-h-[90vh] overflow-hidden flex flex-col shadow-glow-intense">
            <div className="flex items-center justify-between p-4 shrink-0 border-b border-glass-border/50">
              <div className="flex items-center gap-3">
                <motion.div 
                  initial={{ rotate: 0 }}
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="w-8 h-8 bg-gradient-to-br from-amber-400 to-amber-600 rounded-xl flex items-center justify-center"
                >
                  <Sparkles size={16} className="text-white" />
                </motion.div>
                <div className="flex bg-glass-bg-light rounded-radius-full p-1 border border-glass-border">
                  <button
                    onClick={() => setMode('signin')}
                    className={`px-6 py-2.5 rounded-radius-full text-sm font-medium transition-all duration-300 ${
                      mode === 'signin' 
                        ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-bg-base shadow-glow' 
                        : 'text-text-muted hover:text-text-primary hover:bg-white/5'
                    }`}
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => setMode('signup')}
                    className={`px-6 py-2.5 rounded-radius-full text-sm font-medium transition-all duration-300 ${
                      mode === 'signup' 
                        ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-bg-base shadow-glow' 
                        : 'text-text-muted hover:text-text-primary hover:bg-white/5'
                    }`}
                  >
                    Sign Up
                  </button>
                </div>
              </div>
              <button 
                onClick={onClose} 
                className="p-2.5 rounded-radius-full hover:bg-white/10 transition-all duration-300 text-text-muted hover:text-text-primary group"
              >
                <X 
                  size={20} 
                  className="transform group-hover:rotate-90 transition-transform duration-300" 
                />
              </button>
            </div>

            <div className="p-6 md:p-8 overflow-y-auto custom-scrollbar flex-1">
              <AnimatePresence mode="wait">
                <motion.div
                  key={mode}
                  variants={fadeSlideUp}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  className="min-h-full"
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
