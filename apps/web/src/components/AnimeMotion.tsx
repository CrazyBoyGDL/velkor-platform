'use client'

import { useEffect, useRef, type CSSProperties, type ReactNode } from 'react'
import { animate, createScope, stagger } from 'animejs'
import { scrambleText } from 'animejs/text'

type StaggerFrom = number | 'first' | 'center' | 'last' | 'random' | number[]

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export function AnimeGridReveal({
  children,
  className = '',
  style,
  delay = 70,
  threshold = 0.12,
  grid = true,
  from = 'center',
}: {
  children: ReactNode
  className?: string
  style?: CSSProperties
  delay?: number
  threshold?: number
  grid?: boolean
  from?: StaggerFrom
}) {
  const root = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const element = root.current
    if (!element) return

    const targets = Array.from(element.children).filter(
      (child): child is HTMLElement => child instanceof HTMLElement
    )

    if (!targets.length) return

    if (prefersReducedMotion()) {
      targets.forEach((target) => {
        target.style.opacity = '1'
        target.style.transform = 'none'
      })
      return
    }

    targets.forEach((target) => {
      target.style.opacity = '0'
      target.style.transform = 'translateY(18px) scale(0.985)'
    })

    const scope = createScope({ root: element }).add(() => {
      let animation: ReturnType<typeof animate> | null = null
      const observer = new IntersectionObserver(([entry]) => {
        if (!entry?.isIntersecting) return

        animation = animate(targets, {
          opacity: [0, 1],
          y: [18, 0],
          scale: [0.985, 1],
          duration: 760,
          ease: 'out(4)',
          delay: stagger(delay, {
            grid,
            from,
          }),
        })

        observer.disconnect()
      }, { threshold })

      observer.observe(element)

      return () => {
        observer.disconnect()
        animation?.revert()
      }
    })

    return () => scope.revert()
  }, [delay, from, grid, threshold])

  return (
    <div ref={root} className={className} style={style}>
      {children}
    </div>
  )
}

export function ScrambleText({
  text,
  className = '',
  delay = 0,
  chars = 'A-Z0-9/_',
  seed = 12,
}: {
  text: string
  className?: string
  delay?: number
  chars?: string
  seed?: number
}) {
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const element = ref.current
    if (!element || prefersReducedMotion()) return

    const scope = createScope({ root: element }).add(() => {
      let animation: ReturnType<typeof animate> | null = null
      const observer = new IntersectionObserver(([entry]) => {
        if (!entry?.isIntersecting) return

        animation = animate(element, {
          innerHTML: scrambleText({
            text,
            chars,
            cursor: '_',
            duration: 760,
            delay,
            revealRate: 42,
            settleRate: 24,
            settleDuration: 180,
            perturbation: 0.18,
            seed,
          }),
          ease: 'out(3)',
        })

        observer.disconnect()
      }, { threshold: 0.4 })

      observer.observe(element)

      return () => {
        observer.disconnect()
        animation?.revert()
      }
    })

    return () => scope.revert()
  }, [chars, delay, seed, text])

  return (
    <span ref={ref} className={className} aria-label={text}>
      {text}
    </span>
  )
}
