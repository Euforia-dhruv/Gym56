/**
 * Shared Framer Motion animation variants.
 *
 * These are used across multiple components (Hero, Features, TrustedSection,
 * Reviews, Equipment, Exercises, etc.) to ensure consistent
 * entrance animations.
 */

// ─── Container (staggered children) ────────────────────────────────────────

/** Standard staggered container — cards/lists appear one by one */
export const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

/** Slower stagger — for hero sections or featured content */
export const staggerContainerSlow = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.2 },
  },
};

/** Fast stagger — for dense grids */
export const staggerContainerFast = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

// ─── Items (individual element entrance) ───────────────────────────────────

/** Fade up from below */
export const fadeUp = {
  hidden: { y: 30, opacity: 0 },
  show: { y: 0, opacity: 1, transition: { duration: 0.6 } },
};

/** Fade up — gentler, shorter distance */
export const fadeUpSmall = {
  hidden: { y: 20, opacity: 0 },
  show: { y: 0, opacity: 1, transition: { duration: 0.5 } },
};

/** Fade up — for hero animations */
export const fadeUpHero = {
  hidden: { y: 50, opacity: 0 },
  show: { y: 0, opacity: 1, transition: { duration: 0.8 } },
};

/** Fade in (no movement) */
export const fadeIn = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.6 } },
};

// ─── Page sections ─────────────────────────────────────────────────────────

/** Standard section entrance — heading + content */
export const sectionHeader = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8 } },
};

// ─── Step / list items ────────────────────────────────────────────────────

/** Slide in from left — for numbered steps */
export const slideInLeft = (index: number, duration = 0.5, delay = 0.1) => ({
  hidden: { opacity: 0, x: -20 },
  show: { opacity: 1, x: 0, transition: { duration, delay: index * delay } },
});

// ─── Hover effects ─────────────────────────────────────────────────────────

/** Lift card on hover */
export const hoverLift = {
  y: -8,
  transition: { duration: 0.3 },
};

/** Lift card more aggressively — for featured items */
export const hoverLiftStrong = {
  y: -12,
  scale: 1.02,
  transition: { duration: 0.3 },
};
