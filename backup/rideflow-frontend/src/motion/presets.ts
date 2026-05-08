export const springs = {
  snappy: { type: 'spring' as const, stiffness: 400, damping: 28 },
  smooth: { type: 'spring' as const, stiffness: 200, damping: 30 },
  bouncy: { type: 'spring' as const, stiffness: 350, damping: 20, mass: 0.8 },
  slow:   { type: 'spring' as const, stiffness: 80,  damping: 20 },
};

export const fadeSlideUp = {
  initial:    { opacity: 0, y: 24 },
  animate:    { opacity: 1, y: 0 },
  exit:       { opacity: 0, y: -12 },
  transition: springs.smooth,
};

export const scaleIn = {
  initial:    { opacity: 0, scale: 0.92 },
  animate:    { opacity: 1, scale: 1 },
  exit:       { opacity: 0, scale: 0.95 },
  transition: springs.snappy,
};

export const modalVariants = {
  hidden:  { opacity: 0, scale: 0.94, y: 20 },
  visible: { opacity: 1, scale: 1, y: 0, transition: springs.snappy },
  exit:    { opacity: 0, scale: 0.96, y: 10, transition: { duration: 0.18 } },
};

export const overlayVariants = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.22 } },
  exit:    { opacity: 0, transition: { duration: 0.18 } },
};

export const staggerContainer = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.1 } },
};
