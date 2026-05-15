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

function FieldNote({ label, text }: { label: string; text: string }) {
  return (
    <div className="mt-3 pt-3" style={{ borderTop: '1px solid rgba(255,255,255,0.045)' }}>
      <div className="text-[8px] font-mono text-zinc-700 mb-1">{label}</div>
      <p className="text-zinc-500 text-[9.5px] leading-relaxed">{text}</p>
    </div>
  )
}

// ── Assessment card ───────────────────────────────────────────────────────────
// Shows a sanitized network audit excerpt with discovered findings and risk level
function AssessmentCard() {
  const rows: { label: string; value: string; risk?: boolean }[] = [
    { label: 'Sedes revisadas',           value: '3 + bodega externa'   },
    { label: 'Core switch',               value: 'sin mapa LLDP',       risk: true  },
    { label: 'Firewall en producción',    value: 'FortiGate 80F activo' },
    { label: 'Reglas any/any',            value: '47 heredadas',         risk: true  },
    { label: 'Endpoints fuera de parche', value: '23 de 85',             risk: true  },
  ]
  return (
    <div className="artifact-sheet p-5 h-full font-mono text-[10.5px] leading-relaxed">
      <DocHeader
        tag="EXTRACTO · LAN/WAN"
        title="Industrial · 85 hosts · 3 sedes"
        meta={'SANITIZADO\nREV-24'}
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
        <span className="text-zinc-600">Prioridad acordada</span>
        <span style={{ color: 'rgba(161,161,170,0.6)' }}>MFA antes de VPN</span>
      </div>
      <FieldNote
        label="NOTA DE CAMPO"
        text="Se detectaron cuentas compartidas en turnos nocturnos. Primero se separaron identidades y MFA antes de abrir acceso remoto."
      />
    </div>
  )
}

// ── Implementation timeline card ──────────────────────────────────────────────
// Shows a real project's week-by-week delivery phases with completion bars
function TimelineCard() {
  const phases = [
    { week: 'SEM 1', label: 'Inventario y cuentas compartidas', progress: '100%', color: 'rgba(58,120,88,0.45)' },
    { week: 'SEM 2', label: 'Piloto MFA con administración',   progress: '100%', color: 'rgba(58,120,88,0.45)' },
    { week: 'SEM 3', label: 'Pausa: excepción ERP legacy',     progress: '62%',  color: 'rgba(176,120,40,0.55)' },
    { week: 'SEM 4', label: 'Expansión por departamento',      progress: '100%', color: 'rgba(58,120,88,0.45)' },
  ]
  return (
    <div className="artifact-sheet p-5 h-full font-mono text-[10.5px] leading-relaxed">
      <DocHeader
        tag="PROYECTO · M365 + INTUNE"
        title="62 usuarios · Entorno regulado"
        meta={'RUNBOOK\n4 SEM'}
      />
      <DocLine />
      <div className="space-y-2.5">
        {phases.map(({ week, label, progress, color }) => (
          <div key={week} className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[8.5px] text-zinc-700">{week}</span>
              <span className="text-[9px] text-zinc-500 text-right">{label}</span>
            </div>
            <div className="h-0.5 rounded-full" style={{ background: 'rgba(255,255,255,0.06)' }}>
              <div
                className="h-full rounded-full"
                style={{ width: progress, background: color }}
              />
            </div>
          </div>
        ))}
      </div>
      <DocLine />
      <div className="flex items-center justify-between">
        <span style={{ color: 'rgba(58,120,88,0.65)', fontSize: '9px' }}>Cerrado · 31 días</span>
        <span className="text-zinc-700 text-[8.5px]">excepción documentada</span>
      </div>
      <FieldNote
        label="BLOQUEO REAL"
        text="El ERP no soportaba MFA moderno. Se dejó excepción temporal con IP restringida, dueño nombrado y fecha de retiro."
      />
    </div>
  )
}

// ── Conditional access policy card ───────────────────────────────────────────
// Shows a sanitized governance policy document — Entra ID conditional access
function PolicyCard() {
  const policies = [
    { id: 'P-001', text: 'MFA obligatorio por grupo, no por excepción informal' },
    { id: 'P-002', text: 'Bloqueo gradual de dispositivos no conformes' },
    { id: 'P-003', text: 'Acceso permitido: MX + IPs operativas aprobadas' },
    { id: 'P-004', text: 'Límite de sesión: 8 h · Persistente: No' },
    { id: 'P-005', text: 'Break-glass auditado con alerta al responsable' },
  ]
  return (
    <div className="artifact-sheet p-5 h-full font-mono text-[10.5px] leading-relaxed">
      <DocHeader
        tag="POLÍTICA · ACCESO CONDICIONAL"
        title="Entra ID · Acceso corporativo"
        meta={'CAP-001\nSAN'}
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
        <span className="text-[8.5px]" style={{ color: 'rgba(58,120,88,0.65)' }}>Activo con excepción</span>
      </div>
      <FieldNote
        label="DECISIÓN DE GOBIERNO"
        text="Dirección aceptó bloquear acceso externo primero para administración y finanzas; operaciones entró una semana después."
      />
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
          <span className="text-zinc-600">con marcas de operación real</span>
        </motion.h2>
        <motion.p {...fadeUp(0.08)}
          className="text-zinc-600 text-sm mb-10 max-w-lg leading-relaxed">
          Fragmentos anonimizados del tipo de entregables que usamos cuando hay que explicar hallazgos, decisiones incómodas y pendientes que no deben perderse.
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
          Fragmentos representativos · Evidencia completa solo con autorización del cliente o bajo NDA
        </motion.p>

      </div>
    </section>
  )
}
