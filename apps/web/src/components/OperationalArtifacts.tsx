'use client'
import { motion } from 'framer-motion'
import { reveal as fadeUp } from '@/lib/motion'
import { AnimeGridReveal } from '@/components/AnimeMotion'

// ── Shared primitives ─────────────────────────────────────────────────────────
function DocLine() {
  return <div className="h-px my-3" style={{ background: 'rgba(255,255,255,0.045)' }} />
}

function DocHeader({ tag, title, meta }: { tag: string; title: string; meta: string }) {
  return (
    <div className="flex items-start justify-between mb-1">
      <div>
        <div className="text-[8.5px] font-semibold font-mono tracking-normal mb-1.5" style={{ color: 'rgba(176,120,40,0.7)' }}>
          {tag}
        </div>
        <div className="text-zinc-300 text-[10.5px] font-mono">{title}</div>
      </div>
      <div className="text-[8px] font-mono text-right leading-relaxed" style={{ color: 'rgba(255,255,255,0.2)' }}>
        {meta}
      </div>
    </div>
  )
}

// ── Assessment card ───────────────────────────────────────────────────────────
// Shows a sanitized network audit excerpt with discovered findings and risk level
function AssessmentCard() {
  const rows: { label: string; value: string; risk?: boolean }[] = [
    { label: 'Redes detectadas',          value: '8 subnets'            },
    { label: 'Segmentación VLAN',         value: '✗ No implementada',   risk: true  },
    { label: 'Firewall en producción',    value: '✓ FortiGate 80F'      },
    { label: 'Reglas permisivas (any)',   value: '47 — crítico',         risk: true  },
    { label: 'Endpoints sin parche',      value: '23 de 85  (27%)',      risk: true  },
  ]
  return (
    <div className="artifact-sheet p-5 h-full font-mono text-[10.5px] leading-relaxed">
      <DocHeader
        tag="ASSESSMENT · LAN/WAN"
        title="Muestra industrial · 85 hosts · 3 sedes"
        meta={'EJEMPLO\nLAN/WAN'}
      />
      <DocLine />
      <div className="space-y-1.5">
        {rows.map(({ label, value, risk }) => (
          <div key={label} className="flex items-baseline justify-between gap-4">
            <span className="text-zinc-600 flex-shrink-0">{label}</span>
            <span
              className="text-right"
              style={{ color: risk ? 'rgba(239,68,68,0.72)' : 'rgba(161,161,170,0.75)' }}
            >
              {value}
            </span>
          </div>
        ))}
      </div>
      <DocLine />
      <div className="flex items-center justify-between">
        <span className="text-zinc-600">Riesgo general</span>
        <span className="font-semibold tracking-normal" style={{ color: 'rgba(239,68,68,0.75)' }}>ALTO</span>
      </div>
      <div className="flex items-center justify-between mt-1.5">
        <span className="text-zinc-600">Propuesta entregada</span>
        <span style={{ color: 'rgba(161,161,170,0.6)' }}>en 24 horas</span>
      </div>
    </div>
  )
}

// ── Implementation timeline card ──────────────────────────────────────────────
// Shows a real project's week-by-week delivery phases with completion bars
function TimelineCard() {
  const phases = [
    { week: 'SEM 1', label: 'Tenant + Exchange Online',       done: true },
    { week: 'SEM 2', label: 'Entra ID + Acceso Condicional',  done: true },
    { week: 'SEM 3', label: 'Intune MDM + Autopilot',         done: true },
    { week: 'SEM 4', label: 'Testing + Documentación',        done: true },
  ]
  return (
    <div className="artifact-sheet p-5 h-full font-mono text-[10.5px] leading-relaxed">
      <DocHeader
        tag="PROYECTO · M365 + INTUNE"
        title="62 usuarios · Entorno regulado"
        meta={'EJEMPLO\n4 SEM'}
      />
      <DocLine />
      <div className="space-y-2.5">
        {phases.map(({ week, label }) => (
          <div key={week} className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[8.5px] text-zinc-700">{week}</span>
              <span className="text-[9px] text-zinc-500 text-right">{label}</span>
            </div>
            {/* Completion bar — all phases complete */}
            <div className="h-0.5 rounded-full" style={{ background: 'rgba(255,255,255,0.06)' }}>
              <div
                className="h-full rounded-full"
                style={{ width: '100%', background: 'rgba(58,120,88,0.45)' }}
              />
            </div>
          </div>
        ))}
      </div>
      <DocLine />
      <div className="flex items-center justify-between">
        <span style={{ color: 'rgba(58,120,88,0.65)', fontSize: '9px' }}>✓ Cerrado · 28 días</span>
        <span className="text-zinc-700 text-[8.5px]">políticas revisadas</span>
      </div>
    </div>
  )
}

// ── Conditional access policy card ───────────────────────────────────────────
// Shows a sanitized governance policy document — Entra ID conditional access
function PolicyCard() {
  const policies = [
    { id: 'P-001', text: 'MFA obligatorio — todos los usuarios' },
    { id: 'P-002', text: 'Bloquear dispositivos no conformes (Intune)' },
    { id: 'P-003', text: 'Acceso permitido: MX, US — resto bloqueado' },
    { id: 'P-004', text: 'Límite de sesión: 8 h · Persistente: No' },
    { id: 'P-005', text: 'Admin roles: PIM — acceso just-in-time' },
  ]
  return (
    <div className="artifact-sheet p-5 h-full font-mono text-[10.5px] leading-relaxed">
      <DocHeader
        tag="POLÍTICA · ACCESO CONDICIONAL"
        title="Entra ID · Acceso corporativo"
        meta={'CAP-001\nMUESTRA'}
      />
      <DocLine />
      <div className="space-y-2">
        {policies.map(({ id, text }) => (
          <div key={id} className="flex gap-3">
            <span className="text-[8.5px] flex-shrink-0" style={{ color: 'rgba(255,255,255,0.2)' }}>
              {id}
            </span>
            <span className="text-zinc-500">{text}</span>
          </div>
        ))}
      </div>
      <DocLine />
      <div className="flex items-center justify-between">
        <span className="text-zinc-600 text-[8.5px]">Revisado: 2025-02-28</span>
        <span className="text-[8.5px]" style={{ color: 'rgba(58,120,88,0.65)' }}>✓ Activo</span>
      </div>
    </div>
  )
}

// ── Section ───────────────────────────────────────────────────────────────────
export default function OperationalArtifacts() {
  return (
    <section className="py-20 px-4 sm:px-8 relative overflow-hidden section-deep">
      <div className="max-w-7xl mx-auto">

        {/* Section label */}
        <div className="flex items-center gap-4 mb-8">
          <motion.span {...fadeUp(0)} className="label">Evidencia operacional</motion.span>
          <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg, rgba(255,255,255,0.05), transparent)' }} />
        </div>

        <motion.h2 {...fadeUp(0.04)}
          className="section-heading mb-3">
          Evidencia que se puede revisar,<br />
          <span className="text-zinc-600">no promesas que se evaporan</span>
        </motion.h2>
        <motion.p {...fadeUp(0.08)}
          className="text-zinc-600 text-sm mb-10 max-w-lg leading-relaxed">
          Muestras anonimizadas del tipo de entregables que usamos para explicar hallazgos, decisiones y cierre de proyecto.
        </motion.p>

        {/* Three-column artifact grid */}
        <AnimeGridReveal className="grid grid-cols-1 md:grid-cols-3 gap-4" delay={82} from="center">
          <div className="h-full">
            <AssessmentCard />
          </div>
          <div className="h-full">
            <TimelineCard />
          </div>
          <div className="h-full">
            <PolicyCard />
          </div>
        </AnimeGridReveal>

        {/* Authenticity disclaimer */}
        <motion.p {...fadeUp(0)}
          className="text-center text-[10px] font-mono mt-5"
          style={{ color: 'rgba(255,255,255,0.14)' }}>
          Muestras representativas · Referencias completas solo cuando el cliente autoriza compartirlas
        </motion.p>

      </div>
    </section>
  )
}
