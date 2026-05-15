/**
 * Motion system: quiet, physical, engineered.
 *
 * Design principles:
 *   - Reveals should feel like systems activating, not generic fade-ups.
 *   - Stagger is used only for topology, evidence and sequence logic.
 *   - Ambient motion stays subtle and functional.
 *   - Hover feedback reads as mass and precision, never spectacle.
 *
 * References: Linear, Raycast, Arc, Apple Pro apps
 */

// Physical easing: sharp deceleration, reads as mass not spring
export const EASE: [number, number, number, number] = [0.25, 0, 0, 1]

// ─── Scroll reveal ────────────────────────────────────────────────────────────
// Very small activation: opacity plus a trace of blur. No large y-axis lift.
export const reveal = (delay = 0) => ({
  initial:     { opacity: 0 },
  whileInView: { opacity: 1 },
  viewport:    { once: true, amount: 0.01 },
  transition:  { duration: 0.32, ease: EASE, delay },
})

// ─── Above-fold entrance ──────────────────────────────────────────────────────
// Hero-level content gets a touch more air so the system can orient on load.
export const enter = (delay = 0) => ({
  initial:    { opacity: 0 },
  animate:    { opacity: 1 },
  transition: { duration: 0.42, ease: EASE, delay },
})

// ─── Spring configs ───────────────────────────────────────────────────────────
// For hover/interactive feedback — feels physical, responds immediately
export const SPRING_STIFF = {
  type:      'spring' as const,
  stiffness: 420,
  damping:   40,
} as const

export const SPRING_SOFT = {
  type:      'spring' as const,
  stiffness: 280,
  damping:   36,
} as const

export const SPRING_MAGNETIC = {
  type:      'spring' as const,
  stiffness: 360,
  damping:   32,
  mass:      0.7,
} as const

// ─── Topology / ambient ───────────────────────────────────────────────────────
// Entry for architectural diagrams: all elements reveal as a unit.
export const diagramEnter = (delay = 0) => ({
  initial:    { opacity: 0 },
  animate:    { opacity: 1 },
  transition: { duration: 0.42, ease: EASE, delay },
})

export const telemetryPulse = {
  animate: {
    opacity: [0.36, 0.82, 0.42],
    scale: [1, 1.035, 1],
  },
  transition: {
    duration: 3.8,
    repeat: Infinity,
    ease: EASE,
  },
} as const
