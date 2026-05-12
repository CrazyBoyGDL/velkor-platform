'use client'
import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

const STEPS = [
  {
    id: 0,
    phase: 'DETECCIÓN',
    color: '#ef4444',
    title: 'Amenaza detectada en tiempo real',
    desc: 'Nuestro NOC monitorea más de 200 indicadores simultáneos. Cuando algo sale de los umbrales, la alerta dispara en segundos — no en horas.',
    terminal: [
      { t: 0,   color: '#52525b', text: '$ velkor-noc --monitor all --live' },
      { t: 0.1, color: '#22c55e', text: '[OK] Conexión establecida con 47 endpoints' },
      { t: 0.2, color: '#22c55e', text: '[OK] Baseline cargado · Umbrales activos' },
      { t: 0.5, color: '#f59e0b', text: '[!] fw-core · CPU spike: 94% (umbral: 80%)' },
      { t: 0.7, color: '#ef4444', text: '[!!] ALERTA: Tráfico inusual puerto 8443' },
      { t: 0.9, color: '#ef4444', text: '[!!] Posible DDoS · 12,400 req/s · IP: 185.220.101.x' },
    ],
  },
  {
    id: 1,
    phase: 'ANÁLISIS',
    color: '#f59e0b',
    title: 'El ingeniero NOC analiza y clasifica',
    desc: 'En menos de 4 minutos un ingeniero certificado revisa la firma del ataque, correlaciona con inteligencia de amenazas y abre el incidente.',
    terminal: [
      { t: 0,   color: '#52525b', text: '$ noc-analyst --incident INC-2847' },
      { t: 0.1, color: '#3b82f6', text: '[INFO] Cargando logs: fw-core / edge-switch-01' },
      { t: 0.3, color: '#f59e0b', text: '[ANALISIS] Origen: botnet Mirai (variante)' },
      { t: 0.5, color: '#f59e0b', text: '[ANALISIS] Objetivo: servicio HTTPS público' },
      { t: 0.7, color: '#3b82f6', text: '[TI] Correlación con CTI: 87% match Mirai v3' },
      { t: 0.9, color: '#22c55e', text: '[ASIGNADO] Ing. López · Prioridad: CRÍTICA · SLA: 4h' },
    ],
  },
  {
    id: 2,
    phase: 'RESPUESTA',
    color: '#3b82f6',
    title: 'Respuesta activa y contención',
    desc: 'El playbook automatizado bloquea los rangos IP en el firewall Fortinet, activa scrubbing y notifica al cliente en tiempo real vía dashboard.',
    terminal: [
      { t: 0,   color: '#52525b', text: '$ noc-respond --playbook ddos-mitigacion' },
      { t: 0.1, color: '#3b82f6', text: '[PLAYBOOK] Ejecutando: DDoS_MITIGATION_v2' },
      { t: 0.3, color: '#f59e0b', text: '[FW] Bloqueando 185.220.101.0/24 · Fortinet API' },
      { t: 0.5, color: '#22c55e', text: '[FW] 847 IPs bloqueadas exitosamente' },
      { t: 0.7, color: '#3b82f6', text: '[WAF] Rate limiting activado: 500 req/s max' },
      { t: 0.9, color: '#22c55e', text: '[NOTIF] Dashboard cliente actualizado · Email enviado' },
    ],
  },
  {
    id: 3,
    phase: 'RESOLUCIÓN',
    color: '#22c55e',
    title: 'Normalización y post-mortem',
    desc: 'El tráfico vuelve a parámetros normales. Se genera el informe técnico con causa raíz, acciones tomadas y recomendaciones preventivas.',
    terminal: [
      { t: 0,   color: '#52525b', text: '$ noc-report --incident INC-2847 --close' },
      { t: 0.1, color: '#22c55e', text: '[OK] Tráfico normalizado · 234 req/s (normal)' },
      { t: 0.3, color: '#22c55e', text: '[OK] Firewall rules limpiadas · FW saludable' },
      { t: 0.5, color: '#3b82f6', text: '[RCA] Causa raíz: puerto 8443 expuesto innecesariamente' },
      { t: 0.7, color: '#3b82f6', text: '[REC] Implementar geo-blocking + WAF Layer 7' },
      { t: 0.9, color: '#22c55e', text: '[CIERRE] INC-2847 resuelto · Tiempo: 23 min · SLA: ✓' },
    ],
  },
]

function Terminal({ lines, progress }: { lines: typeof STEPS[0]['terminal']; progress: number }) {
  const visible = lines.filter(l => l.t <= progress)

  return (
    <div className="rounded-xl overflow-hidden font-mono text-xs"
      style={{
        background: 'linear-gradient(145deg, #0c0c0e, #080808)',
        border: '1px solid rgba(255,255,255,0.07)',
        boxShadow: '0 0 60px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.04)',
      }}>
      {/* Mac-style header */}
      <div className="flex items-center gap-2 px-4 py-3"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', background: 'rgba(255,255,255,0.02)' }}>
        <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
        <span className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
        <span className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
        <span className="ml-2 text-zinc-600 text-[10px]">velkor-noc · bash</span>
        <span className="ml-auto w-1.5 h-1.5 rounded-full bg-noc-green animate-pulse-fast" />
      </div>

      {/* Lines */}
      <div className="p-4 space-y-1.5 min-h-[180px]">
        {visible.map((l, i) => (
          <motion.div key={i}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.25 }}
            className="flex items-start gap-2"
          >
            <span className="text-zinc-700 select-none mt-0.5">›</span>
            <span style={{ color: l.color }}>{l.text}</span>
          </motion.div>
        ))}
        {/* Cursor */}
        <div className="flex items-center gap-1">
          <span className="text-zinc-700">›</span>
          <span className="w-1.5 h-3.5 bg-amber animate-pulse-fast rounded-[1px]" />
        </div>
      </div>
    </div>
  )
}

export default function NOCStory() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  })

  // Map each step to a scroll range
  const stepProgress = STEPS.map((_, i) => {
    const start = i / STEPS.length
    const end   = (i + 1) / STEPS.length
    return useTransform(scrollYProgress, [start, end], [0, 1])
  })

  const activeStep = useTransform(scrollYProgress, v =>
    Math.min(Math.floor(v * STEPS.length), STEPS.length - 1)
  )

  return (
    <section className="relative" style={{ height: `${STEPS.length * 100}vh` }} ref={containerRef}>
      <div className="sticky top-0 h-screen flex items-center overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #080810, #050508)' }}>

        {/* Background radial */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[radial-gradient(ellipse,rgba(59,130,246,0.04)_0%,transparent_70%)]" />
          <div className="absolute top-1/2 right-1/4 translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-[radial-gradient(ellipse,rgba(34,197,94,0.03)_0%,transparent_70%)]" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-8 w-full grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* Left — text narrative */}
          <div>
            <span className="label block mb-4">Velkor NOC en acción</span>
            <h2 className="text-3xl sm:text-4xl font-black text-noc-white mb-4 leading-tight">
              Así respondemos<br />
              <span className="text-gradient-amber">cuando importa</span>
            </h2>
            <p className="text-zinc-500 text-sm mb-10 max-w-sm leading-relaxed">
              Un ataque DDoS real, resuelto en 23 minutos. Sigue el scroll para ver el proceso completo de nuestro NOC.
            </p>

            {/* Step indicators */}
            <div className="space-y-4">
              {STEPS.map(({ phase, title, color }, i) => (
                <motion.div key={i}
                  style={{
                    opacity: useTransform(
                      scrollYProgress,
                      [i / STEPS.length - 0.05, i / STEPS.length, (i + 1) / STEPS.length, (i + 1) / STEPS.length + 0.05],
                      [0.3, 1, 1, 0.3]
                    )
                  }}
                  className="flex items-start gap-4"
                >
                  <div className="relative flex-shrink-0 mt-0.5">
                    <motion.div
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-mono font-bold"
                      style={{
                        background: useTransform(
                          scrollYProgress,
                          [i / STEPS.length - 0.05, i / STEPS.length],
                          [`${color}10`, `${color}25`]
                        ),
                        border: `1px solid ${color}40`,
                        color,
                      }}
                    >
                      {String(i + 1).padStart(2, '0')}
                    </motion.div>
                    {i < STEPS.length - 1 && (
                      <div className="absolute top-full left-1/2 -translate-x-1/2 w-px h-4 mt-1"
                        style={{ background: 'rgba(255,255,255,0.06)' }} />
                    )}
                  </div>
                  <div className="pb-4">
                    <div className="text-[10px] font-mono mb-0.5" style={{ color }}>{phase}</div>
                    <div className="text-zinc-300 text-sm font-medium leading-snug">{title}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Right — animated terminal */}
          <div className="space-y-4">
            {STEPS.map(({ desc, terminal, color, phase }, i) => (
              <motion.div key={i}
                style={{
                  opacity: useTransform(
                    scrollYProgress,
                    [
                      i / STEPS.length - 0.1,
                      i / STEPS.length,
                      (i + 1) / STEPS.length - 0.05,
                      (i + 1) / STEPS.length,
                    ],
                    [0, 1, 1, 0]
                  ),
                  y: useTransform(
                    scrollYProgress,
                    [i / STEPS.length - 0.1, i / STEPS.length],
                    [30, 0]
                  ),
                  position: 'absolute' as const,
                  width: '100%',
                }}
              >
                {/* Phase label */}
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-2 h-2 rounded-full" style={{ background: color }} />
                  <span className="text-[11px] font-mono tracking-widest" style={{ color }}>{phase}</span>
                </div>

                <Terminal
                  lines={terminal}
                  progress={stepProgress[i].get()}
                />

                <p className="mt-4 text-zinc-500 text-sm leading-relaxed">{desc}</p>
              </motion.div>
            ))}

            {/* Placeholder to keep layout */}
            <div style={{ height: 280 }} />
          </div>
        </div>

        {/* Scroll progress bar */}
        <motion.div
          className="absolute bottom-0 left-0 h-0.5 bg-amber"
          style={{ width: useTransform(scrollYProgress, [0, 1], ['0%', '100%']) }}
        />

        {/* Scroll hint */}
        <motion.div
          className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1"
          style={{ opacity: useTransform(scrollYProgress, [0, 0.1], [1, 0]) }}
        >
          <span className="text-zinc-600 text-[10px] font-mono tracking-widest">SCROLL</span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="w-px h-5 bg-gradient-to-b from-zinc-600 to-transparent"
          />
        </motion.div>
      </div>
    </section>
  )
}
