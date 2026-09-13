export const SPRING_CONFIG = {
  type: 'spring' as const,
  visualDuration: 0.77,
  bounce: 0.2,
  stiffness: 140,
  ease: 'easeOut' as const,
};

export const POP_IN_VARIANTS = {
  initial: { opacity: 0, y: 20, scale: 0.6, rotateY: 40 },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    rotateY: 0,
  },
};
