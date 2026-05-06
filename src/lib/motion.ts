import type { Variants, Transition } from 'framer-motion';

// ── Spring Physics Presets ──
export const springs = {
  snappy: { type: 'spring' as const, stiffness: 400, damping: 28 },
  smooth: { type: 'spring' as const, stiffness: 200, damping: 30 },
  bouncy: { type: 'spring' as const, stiffness: 350, damping: 20, mass: 0.8 },
  slow:   { type: 'spring' as const, stiffness: 80,  damping: 20 },
} satisfies Record<string, Transition>;

// ── Fade Slide Up ──
export const fadeSlideUp: Variants = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0,  transition: springs.smooth },
  exit:    { opacity: 0, y: -12, transition: { duration: 0.18 } },
};

// ── Scale In ──
export const scaleIn: Variants = {
  initial: { opacity: 0, scale: 0.92 },
  animate: { opacity: 1, scale: 1,   transition: springs.snappy },
  exit:    { opacity: 0, scale: 0.95, transition: { duration: 0.18 } },
};

// ── Modal Variants ──
export const modalVariants: Variants = {
  hidden:  { opacity: 0, scale: 0.94, y: 20 },
  visible: { opacity: 1, scale: 1,    y: 0,  transition: { type: 'spring', stiffness: 400, damping: 28 } },
  exit:    { opacity: 0, scale: 0.96, y: 10, transition: { duration: 0.18 } },
};

// ── Overlay Variants ──
export const overlayVariants: Variants = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.22 } },
  exit:    { opacity: 0, transition: { duration: 0.18 } },
};

// ── Slide In From Right ──
export const slideInRight: Variants = {
  initial: { opacity: 0, x: 60 },
  animate: { opacity: 1, x: 0, transition: springs.smooth },
  exit:    { opacity: 0, x: 60, transition: { duration: 0.18 } },
};

// ── Stagger Children Container ──
export const staggerContainer: Variants = {
  initial: {},
  animate: { transition: { staggerChildren: 0.08 } },
};

// ── List Item ──
export const listItem: Variants = {
  initial: { opacity: 0, x: -16 },
  animate: { opacity: 1, x: 0, transition: springs.snappy },
};
