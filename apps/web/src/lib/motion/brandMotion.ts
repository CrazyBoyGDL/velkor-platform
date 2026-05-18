export type BrandMotionState =
  | 'idle'
  | 'monitoring'
  | 'active'
  | 'alert'
  | 'synchronized'

export const BRAND_MOTION_STATES: Record<BrandMotionState, string> = {
  idle: 'Stable operational mark with a slow core breath.',
  monitoring: 'Subtle scan sweep and low-intensity route activity.',
  active: 'Directional routes activate with a measured signal pulse.',
  alert: 'Amber core emphasis for controlled attention states.',
  synchronized: 'Nodes settle into a coordinated system pulse.',
}

export function brandMotionClass(state: BrandMotionState): string {
  return `velkor-brand--${state}`
}

export const brandMotionCss = `
  @keyframes velkor-route-draw {
    from { stroke-dashoffset: 96; opacity: 0; }
    to { stroke-dashoffset: 0; opacity: 1; }
  }

  @keyframes velkor-route-flow {
    0%, 100% { stroke-dashoffset: 40; opacity: 0.14; }
    46% { stroke-dashoffset: 0; opacity: 0.62; }
  }

  @keyframes velkor-control-plane {
    0%, 100% { opacity: 0.50; }
    48% { opacity: 0.72; }
  }

  @keyframes velkor-core-breath {
    0%, 100% { opacity: 0.76; transform: scale(1); }
    50% { opacity: 1; transform: scale(1.045); }
  }

  @keyframes velkor-node-sync {
    0%, 100% { opacity: 0.72; }
    45% { opacity: 1; }
  }

  @keyframes velkor-topology-sync {
    0%, 100% { opacity: 0.68; stroke-dashoffset: 34; }
    44% { opacity: 0.95; stroke-dashoffset: 0; }
  }

  @keyframes velkor-scan-sweep {
    0% { transform: translateY(-16px); opacity: 0; }
    18% { opacity: 0.16; }
    64% { opacity: 0.11; }
    100% { transform: translateY(54px); opacity: 0; }
  }

  @keyframes velkor-alert-core {
    0%, 100% { opacity: 0.72; }
    48% { opacity: 1; }
  }

  @keyframes velkor-directional-glow {
    0%, 100% { opacity: 0.42; }
    52% { opacity: 0.82; }
  }

  .velkor-brand-symbol {
    overflow: visible;
    color: var(--brand-route, #7f9eb4);
  }

  .velkor-brand-rig {
    transform-origin: 32px 32px;
  }

  .velkor-brand-route {
    stroke-dasharray: 96;
    animation: velkor-route-draw 0.64s cubic-bezier(0.16, 1, 0.3, 1) both;
  }

  .velkor-brand-flow {
    stroke-dasharray: 12 28;
    opacity: 0;
  }

  .velkor-brand-control-plane {
    animation: velkor-control-plane 8.4s ease-in-out infinite;
  }

  .velkor-brand-sync {
    stroke-dasharray: 10 24;
  }

  .velkor-brand-observe {
    stroke-dasharray: 14 18;
    opacity: 0.36;
  }

  .velkor-brand-core,
  .velkor-brand-core-ring {
    transform-box: fill-box;
    transform-origin: center;
  }

  .velkor-brand-node {
    animation: velkor-node-sync 8s ease-in-out infinite;
  }

  .velkor-brand-core {
    animation: velkor-core-breath 7.2s ease-in-out infinite;
  }

  .velkor-brand-scan {
    opacity: 0;
    animation: velkor-scan-sweep 7.8s ease-in-out infinite;
  }

  .velkor-brand--idle .velkor-brand-flow {
    animation: velkor-route-flow 9.5s ease-in-out infinite;
  }

  .velkor-brand--monitoring .velkor-brand-flow {
    animation: velkor-route-flow 6.8s ease-in-out infinite;
  }

  .velkor-brand--monitoring .velkor-brand-observe {
    animation: velkor-route-flow 8.8s ease-in-out infinite;
  }

  .velkor-brand--active .velkor-brand-flow {
    animation: velkor-route-flow 4.8s ease-in-out infinite;
  }

  .velkor-brand--active .velkor-brand-sync {
    animation: velkor-topology-sync 5.8s ease-in-out infinite;
  }

  .velkor-brand--alert .velkor-brand-core,
  .velkor-brand--alert .velkor-brand-arrow,
  .velkor-brand--alert .velkor-brand-direction {
    animation: velkor-alert-core 2.6s ease-in-out infinite;
  }

  .velkor-brand--synchronized .velkor-brand-node {
    animation-duration: 4.8s;
  }

  .velkor-brand--synchronized .velkor-brand-sync,
  .velkor-brand--synchronized .velkor-brand-direction {
    animation: velkor-directional-glow 6.4s ease-in-out infinite;
  }

  @media (prefers-reduced-motion: reduce) {
    .velkor-brand-route,
    .velkor-brand-flow,
    .velkor-brand-node,
    .velkor-brand-core,
    .velkor-brand-core-ring,
    .velkor-brand-scan,
    .velkor-brand-arrow,
    .velkor-brand-control-plane,
    .velkor-brand-sync,
    .velkor-brand-observe,
    .velkor-brand-direction {
      animation: none !important;
      transition: none !important;
    }

    .velkor-brand-route {
      stroke-dashoffset: 0;
      opacity: 1;
    }
  }
`
