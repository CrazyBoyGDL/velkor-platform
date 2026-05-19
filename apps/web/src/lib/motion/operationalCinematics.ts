export type FocusProfile = {
  id: 'hero-core' | 'service-route' | 'evidence-trace' | 'assessment-focus' | 'knowledge-field'
  coreX: string
  coreY: string
  accentRgb: string
  secondaryRgb: string
  energy: number
  corridorAngle: string
}

export const CINEMATIC_TIMING = {
  breath: 18,
  fieldDrift: 42,
  meshDrift: 64,
  routePrimary: 24,
  routeSecondary: 31,
  routeTertiary: 39,
  nodeHeartbeat: 10.8,
  telemetry: 11.5,
  topologySpoke: 4.6,
  topologyOuter: 6.4,
  topologyCore: 8.8,
  ctaResponse: 0.18,
} as const

export const DEFAULT_FOCUS_PROFILE: FocusProfile = {
  id: 'hero-core',
  coreX: '72%',
  coreY: '34%',
  accentRgb: '99,143,169',
  secondaryRgb: '63,119,92',
  energy: 0.68,
  corridorAngle: '-7deg',
}

const PROFILE_BY_SECTION: Array<{ match: (pathname: string) => boolean; profile: FocusProfile }> = [
  {
    match: pathname => pathname.startsWith('/servicios'),
    profile: {
      id: 'service-route',
      coreX: '67%',
      coreY: '42%',
      accentRgb: '88,118,148',
      secondaryRgb: '184,135,72',
      energy: 0.62,
      corridorAngle: '-5deg',
    },
  },
  {
    match: pathname => pathname.includes('/framework/evidence'),
    profile: {
      id: 'evidence-trace',
      coreX: '58%',
      coreY: '58%',
      accentRgb: '184,135,72',
      secondaryRgb: '99,143,169',
      energy: 0.58,
      corridorAngle: '4deg',
    },
  },
  {
    match: pathname => pathname.startsWith('/assessments'),
    profile: {
      id: 'assessment-focus',
      coreX: '46%',
      coreY: '36%',
      accentRgb: '63,119,92',
      secondaryRgb: '99,143,169',
      energy: 0.64,
      corridorAngle: '-2deg',
    },
  },
  {
    match: pathname => pathname.startsWith('/blog') || pathname.startsWith('/recursos'),
    profile: {
      id: 'knowledge-field',
      coreX: '38%',
      coreY: '34%',
      accentRgb: '99,143,169',
      secondaryRgb: '184,135,72',
      energy: 0.48,
      corridorAngle: '2deg',
    },
  },
]

export const SPATIAL_HORIZON_BY_PROFILE: Record<FocusProfile['id'], string> = {
  'hero-core': '38vh',
  'service-route': '46vh',
  'evidence-trace': '56vh',
  'assessment-focus': '42vh',
  'knowledge-field': '36vh',
}

export function getFocusProfile(pathname = '/'): FocusProfile {
  return PROFILE_BY_SECTION.find(entry => entry.match(pathname))?.profile ?? DEFAULT_FOCUS_PROFILE
}

export function cinematicSeconds(value: number): string {
  return `${value}s`
}

export function cinematicDelay(index: number, step = 0.43, offset = 0): number {
  return offset + index * step
}

export function applyCinematicVars(target: HTMLElement, profile: FocusProfile) {
  target.style.setProperty('--focus-core-x', profile.coreX)
  target.style.setProperty('--focus-core-y', profile.coreY)
  target.style.setProperty('--focus-rgb', profile.accentRgb)
  target.style.setProperty('--focus-secondary-rgb', profile.secondaryRgb)
  target.style.setProperty('--focus-energy', profile.energy.toFixed(2))
  target.style.setProperty('--focus-corridor-angle', profile.corridorAngle)
  target.style.setProperty('--spatial-core-x', profile.coreX)
  target.style.setProperty('--spatial-core-y', profile.coreY)
  target.style.setProperty('--spatial-accent-rgb', profile.accentRgb)
  target.style.setProperty('--spatial-secondary-rgb', profile.secondaryRgb)
  target.style.setProperty('--spatial-energy', profile.energy.toFixed(2))
  target.style.setProperty('--spatial-tilt', profile.corridorAngle)
  target.style.setProperty('--spatial-horizon-y', SPATIAL_HORIZON_BY_PROFILE[profile.id])
  target.style.setProperty('--cinematic-breath-duration', cinematicSeconds(CINEMATIC_TIMING.breath))
  target.style.setProperty('--cinematic-field-duration', cinematicSeconds(CINEMATIC_TIMING.fieldDrift))
  target.style.setProperty('--cinematic-mesh-duration', cinematicSeconds(CINEMATIC_TIMING.meshDrift))
  target.style.setProperty('--cinematic-route-duration', cinematicSeconds(CINEMATIC_TIMING.routePrimary))
  target.style.setProperty('--cinematic-cta-response', `${CINEMATIC_TIMING.ctaResponse}s`)
  target.dataset.atmoFocus = profile.id
}
