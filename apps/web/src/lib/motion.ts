'use client'

import {
  OPERATIONAL_EASE,
  heroSystemReveal,
  infrastructureIdle,
  systemReveal,
} from '@/lib/motion/operationalMotion'

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
export const EASE = OPERATIONAL_EASE

// ─── Scroll reveal ───────────────────────────────────────────────────────────
// Directional operational activation, not generic fade-up.
export const reveal = (delay = 0) => systemReveal(delay, 'up', 0.08)

// ─── Above-fold entrance ──────────────────────────────────────────────────────
// Hero-level content clips in like a system plane activating.
export const enter = (delay = 0) => heroSystemReveal(delay, 'left')

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
export const diagramEnter = (delay = 0) => heroSystemReveal(delay, 'center')

export const telemetryPulse = {
  ...infrastructureIdle(0),
} as const
