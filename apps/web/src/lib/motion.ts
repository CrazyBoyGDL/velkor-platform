/**
 * Motion system — quiet, physical, engineered.
 *
 * Design principles:
 *   • Nearly invisible reveal transitions (0.12s, opacity only)
 *   • No y-axis displacement on scroll reveals
 *   • No visible stagger between siblings
 *   • Ambient/hover motion is the primary motion language
 *   • Physical spring configs for interactive feedback
 *
 * References: Linear, Raycast, Arc, Apple Pro apps
 */

// Physical easing — sharp deceleration, reads as mass not spring
export const EASE: [number, number, number, number] = [0.25, 0, 0, 1]

// ─── Scroll reveal ────────────────────────────────────────────────────────────
// Opacity only — no y displacement. Fires immediately on viewport entry.
// At 0.12s this is genuinely imperceptible; elements simply exist.
export const reveal = (delay = 0) => ({
  initial:     { opacity: 0 },
  whileInView: { opacity: 1 },
  viewport:    { once: true, amount: 0.01 },
  transition:  { duration: 0.12, ease: EASE, delay },
})

// ─── Above-fold entrance ──────────────────────────────────────────────────────
// For hero-level content only. Slightly longer to let the eye orient on load.
// Use stagger sparingly: max 0.05s spread across all hero children.
export const enter = (delay = 0) => ({
  initial:    { opacity: 0 },
  animate:    { opacity: 1 },
  transition: { duration: 0.14, ease: EASE, delay },
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

// ─── Topology / ambient ───────────────────────────────────────────────────────
// Entry for architectural diagrams — all elements reveal as a unit, not staggered
export const diagramEnter = (delay = 0) => ({
  initial:    { opacity: 0 },
  animate:    { opacity: 1 },
  transition: { duration: 0.18, ease: EASE, delay },
})
