'use client'

import { useEffect } from 'react'
import Lenis from 'lenis'

type LenisInstance = InstanceType<typeof Lenis>

const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)'
const COARSE_POINTER_QUERY = '(pointer: coarse)'

function setNativeScrollState(root: HTMLElement, state: string) {
  root.dataset.scrollEngine = state
  root.dataset.scrollState = 'native'
  root.style.setProperty('--scroll-velocity', '0')
  root.style.setProperty('--scroll-direction', '0')
}

export default function CinematicScroll() {
  useEffect(() => {
    const root = document.documentElement
    const reducedMotion = window.matchMedia(REDUCED_MOTION_QUERY)
    const coarsePointer = window.matchMedia(COARSE_POINTER_QUERY)

    if (reducedMotion.matches) {
      setNativeScrollState(root, 'reduced')
      return undefined
    }

    if (coarsePointer.matches) {
      setNativeScrollState(root, 'native-touch')
      return undefined
    }

    let frame = 0
    let settleTimer: number | undefined

    const lenis = new Lenis({
      duration: 1.02,
      easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      syncTouch: false,
      wheelMultiplier: 0.82,
      touchMultiplier: 1,
      anchors: { offset: -76 },
      prevent: node => Boolean(node.closest('input, textarea, select, [role="dialog"], [data-native-scroll]')),
    })

    const setSettled = () => {
      root.dataset.scrollState = 'settled'
      root.style.setProperty('--scroll-velocity', '0')
    }

    const onScroll = (instance: LenisInstance) => {
      const velocity = Math.min(Math.abs(instance.velocity || 0) / 3.6, 1)
      root.dataset.scrollEngine = 'lenis'
      root.dataset.scrollState = velocity > 0.035 ? 'moving' : 'settled'
      root.style.setProperty('--scroll-velocity', velocity.toFixed(3))
      root.style.setProperty('--scroll-direction', String(instance.direction || 0))

      if (settleTimer) window.clearTimeout(settleTimer)
      settleTimer = window.setTimeout(setSettled, 180)
    }

    const raf = (time: number) => {
      lenis.raf(time)
      frame = window.requestAnimationFrame(raf)
    }

    root.dataset.scrollEngine = 'lenis'
    root.dataset.scrollState = 'settled'
    lenis.on('scroll', onScroll)
    frame = window.requestAnimationFrame(raf)

    const onVisibility = () => {
      if (document.visibilityState === 'visible') {
        lenis.resize()
      }
    }

    document.addEventListener('visibilitychange', onVisibility)

    return () => {
      if (settleTimer) window.clearTimeout(settleTimer)
      window.cancelAnimationFrame(frame)
      document.removeEventListener('visibilitychange', onVisibility)
      lenis.off('scroll', onScroll)
      lenis.destroy()
      setNativeScrollState(root, 'native')
    }
  }, [])

  return null
}
