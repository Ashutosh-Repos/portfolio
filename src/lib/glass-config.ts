/**
 * Shared liquid glass optics presets used across the portfolio.
 *
 * Centralised here to avoid copy-pasting the same configuration objects
 * in every page / component that wraps content in a `<Container>`.
 */

/** Default glass optics used by most section containers (About, Projects, Experience, etc.) */
export const GLASS_OPTICS = {
  strength: 0.5,
  curvature: 2.0,
  bend: 1.8,
  bendWidth: 0.35,
  dispersion: 3.0,
  specular: 2.0,
  specularAngle: 180,
} as const;

/** Higher-fidelity glass optics used by expandable stat cards (GitHub / LeetCode charts) */
export const MAX_GLASS_OPTICS = {
  strength: 0.6,
  curvature: 2.0,
  bend: 2.0,
  bendWidth: 0.35,
  dispersion: 3.5,
  specular: 2.0,
  specularAngle: 60,
  frost: 0,
} as const;
