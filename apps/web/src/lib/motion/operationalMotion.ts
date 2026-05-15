'use client'

import { useEffect, useMemo, useRef, useState, type PointerEvent } from 'react'
import {
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  type MotionProps,
  type MotionValue,
} from 'framer-motion'

export const OPERATIONAL_EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]
export const LINEAR_EASE = 'linear'

export type RevealDirection = 'up' | 'down' | 'left' | 'right' | 'center'

const CLIP_START: Record<RevealDirection, string> = {
  up:     'inset(12% 0 0 0)',
  down:   'inset(0 0 12% 0)',
  left:   'inset(0 0 0 10%)',
  right:  'inset(0 10% 0 0)',
  center: 'inset(8% 6% 8% 6%)',
}

export function operationalStagger(index: number, base = 0.045, max = 0.28): number {
  return Math.min(index * base, max)
}

export function systemReveal(
  delay = 0,
  direction: RevealDirection = 'up',
  amount = 0.12
): MotionProps {
  return {
    initial: {
      opacity: 0,
      clipPath: CLIP_START[direction],
    },
    whileInView: {
      opacity: 1,
      clipPath: 'inset(0 0 0 0)',
    },
    viewport: { once: true, amount },
    transition: {
      duration: 0.54,
      ease: OPERATIONAL_EASE,
      delay,
    },
  }
}

export function heroSystemReveal(delay = 0, direction: RevealDirection = 'left'): MotionProps {
  return {
    initial: {
      opacity: 0,
      clipPath: CLIP_START[direction],
    },
    animate: {
      opacity: 1,
      clipPath: 'inset(0 0 0 0)',
    },
    transition: {
      duration: 0.62,
      ease: OPERATIONAL_EASE,
      delay,
    },
  }
}

export function topologyActivation(index = 0): MotionProps {
  return {
    initial: { opacity: 0, pathLength: 0 },
    animate: { opacity: 1, pathLength: 1 },
    transition: {
      opacity: { duration: 0.18, delay: operationalStagger(index, 0.035) },
      pathLength: { duration: 0.78, ease: OPERATIONAL_EASE, delay: operationalStagger(index, 0.04) },
    },
  }
}

export function nodeActivation(index = 0): MotionProps {
  return {
    initial: { opacity: 0, scale: 0.92 },
    animate: { opacity: 1, scale: 1 },
    transition: {
      duration: 0.42,
      ease: OPERATIONAL_EASE,
      delay: 0.08 + operationalStagger(index, 0.045),
    },
  }
}

export function pulsePropagation(index = 0, duration = 4.8) {
  return {
    animate: {
      opacity: [0.18, 0.58, 0.22],
    },
    transition: {
      repeat: Infinity,
      duration: duration + index * 0.28,
      ease: 'easeInOut',
      delay: index * 0.42,
    },
  } as const
}

export function infrastructureIdle(index = 0) {
  return {
    animate: {
      opacity: [0.62, 0.88, 0.66],
    },
    transition: {
      repeat: Infinity,
      duration: 6.4 + index * 0.8,
      ease: 'easeInOut',
      delay: index * 0.35,
    },
  } as const
}

export function scanSweep(delay = 0, duration = 7.5) {
  return {
    initial: { opacity: 0, x: '-18%' },
    animate: { opacity: [0, 0.18, 0], x: ['-18%', '118%', '118%'] },
    transition: { repeat: Infinity, duration, ease: LINEAR_EASE, delay },
  } as const
}

export function rafThrottle<T extends (...args: any[]) => void>(fn: T): T {
  let raf = 0
  let latestArgs: Parameters<T> | null = null

  return ((...args: Parameters<T>) => {
    latestArgs = args
    if (raf) return

    raf = requestAnimationFrame(() => {
      raf = 0
      if (latestArgs) fn(...latestArgs)
      latestArgs = null
    })
  }) as T
}

export function useOperationalReducedMotion(): boolean {
  return Boolean(useReducedMotion())
}

export function useOptimizedDpr(max = 1.6): number {
  const [dpr, setDpr] = useState(1)

  useEffect(() => {
    const update = () => setDpr(Math.min(window.devicePixelRatio || 1, max))
    update()
    window.addEventListener('resize', update, { passive: true })
    return () => window.removeEventListener('resize', update)
  }, [max])

  return dpr
}

export function useOperationalActivity<T extends HTMLElement>(threshold = 0.12) {
  const ref = useRef<T>(null)
  const reducedMotion = useOperationalReducedMotion()
  const [inView, setInView] = useState(false)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    if (typeof document === 'undefined') return

    const onVisibility = () => setVisible(document.visibilityState === 'visible')
    onVisibility()
    document.addEventListener('visibilitychange', onVisibility)
    return () => document.removeEventListener('visibilitychange', onVisibility)
  }, [])

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => setInView(Boolean(entry?.isIntersecting)),
      { threshold }
    )

    observer.observe(element)
    return () => observer.disconnect()
  }, [threshold])

  return {
    ref,
    active: !reducedMotion && inView && visible,
    reducedMotion,
    inView,
  }
}

export type OperationalHoverStyle = {
  rotateX: MotionValue<number>
  rotateY: MotionValue<number>
  y: MotionValue<number>
  glowX: MotionValue<string>
  glowY: MotionValue<string>
  transformPerspective: number
  transformStyle: 'preserve-3d'
}

export function useOperationalHover<T extends HTMLElement>(intensity = 1.2) {
  const ref = useRef<T>(null)
  const reducedMotion = useOperationalReducedMotion()
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const lift = useMotionValue(0)

  const rotateX = useSpring(useTransform(my, [-0.5, 0.5], [intensity, -intensity]), {
    stiffness: 280,
    damping: 38,
    mass: 0.8,
  })
  const rotateY = useSpring(useTransform(mx, [-0.5, 0.5], [-intensity, intensity]), {
    stiffness: 280,
    damping: 38,
    mass: 0.8,
  })
  const y = useSpring(lift, { stiffness: 360, damping: 42, mass: 0.7 })
  const glowX = useTransform(mx, [-0.5, 0.5], ['12%', '88%'])
  const glowY = useTransform(my, [-0.5, 0.5], ['12%', '88%'])

  const handlers = useMemo(() => ({
    onPointerMove(event: PointerEvent<T>) {
      if (reducedMotion || event.pointerType === 'touch' || !ref.current) return
      const rect = ref.current.getBoundingClientRect()
      mx.set((event.clientX - rect.left) / rect.width - 0.5)
      my.set((event.clientY - rect.top) / rect.height - 0.5)
      lift.set(-1.5)
    },
    onPointerLeave() {
      mx.set(0)
      my.set(0)
      lift.set(0)
    },
    onPointerDown() {
      if (!reducedMotion) lift.set(0.5)
    },
    onPointerUp() {
      if (!reducedMotion) lift.set(-1.5)
    },
  }), [lift, mx, my, reducedMotion])

  const style: OperationalHoverStyle = {
    rotateX,
    rotateY,
    y,
    glowX,
    glowY,
    transformPerspective: 1200,
    transformStyle: 'preserve-3d',
  }

  return { ref, handlers, style, reducedMotion }
}

export function useProximitySurface<T extends HTMLElement>() {
  const reducedMotion = useOperationalReducedMotion()

  const handlers = useMemo(() => ({
    onPointerMove(event: PointerEvent<T>) {
      if (reducedMotion || event.pointerType === 'touch') return
      const element = event.currentTarget
      const rect = element.getBoundingClientRect()
      const x = ((event.clientX - rect.left) / rect.width) * 100
      const y = ((event.clientY - rect.top) / rect.height) * 100

      element.style.setProperty('--px', `${x.toFixed(2)}%`)
      element.style.setProperty('--py', `${y.toFixed(2)}%`)
      element.style.setProperty('--proximity', '1')
    },
    onPointerLeave(event: PointerEvent<T>) {
      const element = event.currentTarget
      element.style.setProperty('--px', '50%')
      element.style.setProperty('--py', '18%')
      element.style.setProperty('--proximity', '0')
    },
    onPointerDown(event: PointerEvent<T>) {
      if (reducedMotion || event.pointerType === 'touch') return
      event.currentTarget.style.setProperty('--pressure', '1')
    },
    onPointerUp(event: PointerEvent<T>) {
      event.currentTarget.style.setProperty('--pressure', '0')
    },
  }), [reducedMotion])

  return { handlers, reducedMotion }
}
