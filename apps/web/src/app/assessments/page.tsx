'use client'
import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { trackDownload, trackEvent, trackLeadSourceAttribution, useAssessmentStep } from '@/components/Analytics'
import { Events } from '@/lib/analyticsEvents'
import { generateReportHtml } from '@/lib/reportHtml'
import type { ScoreResult, AssessmentAnswers } from '@/lib/scoring'
import type { LeadClassification } from '@/lib/classification'

// ─── Step definitions ─────────────────────────────────────────────────────────

const STEPS = [
  { n: 1, label: 'Organización',   icon: '○' },
  { n: 2, label: 'Infraestructura',icon: '○' },
  { n: 3, label: 'Identidad',      icon: '○' },
  { n: 4, label: 'Operaciones',    icon: '○' },
  { n: 5, label: 'Prioridades',    icon: '○' },
]

// ─── Answer types ─────────────────────────────────────────────────────────────

const EMPTY_S1 = { industry: '', companySize: '', locations: '', remoteWorkforce: '', microsoft365: '', infrastructure: '' }
const EMPTY_S2 = { vlanSegmentation: '', firewall: '', vpn: '', backup: '', wifiSegmentation: '', endpointInventory: '', edrAv: '' }
const EMPTY_S3 = { entraId: '', mfa: '', conditionalAccess: '', intune: '', privilegedAccess: '', onboarding: '' }
const EMPTY_S4 = { documentation: '', monitoring: '', ticketing: '', lastAudit: '', compliance: [] as string[], changeManagement: '' }
const EMPTY_S5 = { painPoint: '', urgency: '', complianceNeeds: [] as string[], projectGoals: [] as string[], notes: '' }

// ─── UI primitives ────────────────────────────────────────────────────────────

function QLabel({ children, hint }: { children: React.ReactNode; hint?: string }) {
  return (
    <div className="mb-3">
      <div className="text-zinc-300 text-sm font-medium leading-snug">{children}</div>
      {hint && <div className="text-zinc-600 text-[11px] mt-1 leading-snug">{hint}</div>}
    </div>
  )
}

function Radio({
  selected, label, sub, onChange,
}: { value: string; selected: boolean; label: string; sub?: string; onChange: () => void }) {
  return (
    <button
      type="button"
      onClick={onChange}
      className={`text-left px-4 py-3 rounded-xl border transition-all duration-150 ${
        selected
          ? 'border-[#4878b0]/50 bg-[#4878b0]/08 text-zinc-200'
          : 'border-surface-border text-zinc-500 hover:border-zinc-600 hover:text-zinc-400'
      }`}
    >
      <div className="text-sm font-medium leading-snug">{label}</div>
      {sub && <div className="text-[11px] text-zinc-600 mt-0.5 leading-snug">{sub}</div>}
    </button>
  )
}

function Check({
  selected, label, onChange,
}: { value: string; selected: boolean; label: string; onChange: () => void }) {
  return (
    <button
      type="button"
      onClick={onChange}
      className={`flex items-center gap-3 px-4 py-2.5 rounded-xl border text-sm text-left transition-all duration-150 ${
        selected
          ? 'border-[#4878b0]/50 bg-[#4878b0]/08 text-zinc-200'
          : 'border-surface-border text-zinc-500 hover:border-zinc-600'
      }`}
    >
      <div className={`w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 transition-all ${
        selected ? 'bg-[#4878b0] border-[#4878b0]' : 'border-zinc-700'
      }`}>
        {selected && (
          <svg className="w-2.5 h-2.5 text-white" viewBox="0 0 12 12" fill="none">
            <path d="M2.5 6l2.5 2.5 4.5-4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )}
      </div>
      {label}
    </button>
  )
}

function Divider({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3 mt-6 mb-5">
      <span className="text-[9.5px] font-mono font-bold uppercase tracking-[0.18em] text-zinc-700">{label}</span>
      <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.05)' }} />
    </div>
  )
}

function Grid2({ children }: { children: React.ReactNode }) {
  return <div className="grid sm:grid-cols-2 gap-2">{children}</div>
}
function Grid3({ children }: { children: React.ReactNode }) {
  return <div className="grid sm:grid-cols-3 gap-2">{children}</div>
}

// ─── Progress indicator ────────────────────────────────────────────────────────

function StepProgress({ current }: { current: number }) {
  return (
    <div className="mb-8">
      <div className="flex items-center gap-1 mb-3">
        {STEPS.map((step, i) => (
          <div key={step.n} className="flex items-center gap-1 flex-1">
            <div className={`w-6 h-6 rounded-full border flex items-center justify-center text-[10px] font-mono font-bold transition-all ${
              step.n < current  ? 'border-[#4878b0] bg-[#4878b0] text-white' :
              step.n === current ? 'border-[#4878b0]/70 bg-[#4878b0]/12 text-[#7aa8cc]' :
                                   'border-zinc-800 text-zinc-700'
            }`}>
              {step.n < current ? (
                <svg className="w-3 h-3" viewBox="0 0 12 12" fill="none">
                  <path d="M2 6l2.5 2.5L10 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              ) : step.n}
            </div>
            {i < STEPS.length - 1 && (
              <div className={`flex-1 h-px transition-all ${step.n < current ? 'bg-[#4878b0]/40' : 'bg-zinc-800'}`} />
            )}
          </div>
        ))}
      </div>
      <div className="flex items-baseline gap-2">
        <span className="text-zinc-400 text-sm font-semibold">{STEPS[current - 1].label}</span>
        <span className="text-zinc-700 text-[11px] font-mono">Paso {current} de {STEPS.length}</span>
      </div>
    </div>
  )
}

// ─── Score display helpers ─────────────────────────────────────────────────────

function ScoreBar({ label, score, color }: { label: string; score: number; color: string }) {
  return (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-[10px] font-mono uppercase tracking-[0.14em] text-zinc-600">{label}</span>
        <span className="text-[11px] font-mono font-bold" style={{ color }}>{score}<span className="text-zinc-700">/100</span></span>
      </div>
      <div className="h-1 bg-surface-raised rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${score}%`, background: color }}
        />
      </div>
    </div>
  )
}

const SEVERITY_COLORS: Record<string, string> = {
  critical: '#c04040',
  high:     '#b07828',
  medium:   '#5a7a4a',
  low:      '#4878b0',
}
const SEVERITY_LABELS: Record<string, string> = {
  critical: 'CRÍTICO',
  high:     'ALTO',
  medium:   'MEDIO',
  low:      'BAJO',
}

const EXPOSURE_COLORS: Record<string, string> = {
  critical: '#c04040',
  high:     '#b07828',
  medium:   '#7a7050',
  managed:  '#4878b0',
}

// ─── Results screen ────────────────────────────────────────────────────────────

function ResultsScreen({
  scores, classification, company, reportRef, answers, onReset,
}: {
  scores:         ScoreResult
  classification: LeadClassification
  company:        string
  reportRef:      string
  answers:        AssessmentAnswers
  onReset:        () => void
}) {
  const expColor = EXPOSURE_COLORS[scores.exposureLevel] || '#4878b0'

  const openPdf = useCallback(() => {
    const html = generateReportHtml({
      answers, scores, classification,
      generatedAt: new Date().toISOString(),
      reportRef,
    })
    const win = window.open('', '_blank')
    if (win) {
      win.document.write(html)
      win.document.close()
      trackEvent(Events.AssessmentPdfOpened, { reportRef })
      trackDownload('Informe de evaluación operacional', 'pdf', 'assessment-results', true)
    }
  }, [answers, scores, classification, reportRef])

  return (
    <div className="min-h-screen py-12 px-4 sm:px-8">
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between flex-wrap gap-3 mb-3">
            <span className="label">Evaluación completada · {reportRef}</span>
            <button
              onClick={openPdf}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-surface-border text-zinc-500 text-xs font-mono hover:border-zinc-600 hover:text-zinc-400 transition-all"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="none">
                <path d="M3 11l5 3 5-3M8 2v12" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Generar informe PDF
            </button>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-noc-white leading-tight tracking-heading">
            Resumen Operacional
          </h1>
          <p className="text-zinc-500 text-sm mt-2">{company} · Evaluación de infraestructura IT</p>
        </div>

        {/* Overall score + exposure */}
        <div className="card p-6 mb-5">
          <div className="grid sm:grid-cols-2 gap-6">
            <div>
              <div className="label text-[9.5px] mb-3">Madurez general</div>
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-[3.5rem] font-black font-mono leading-none tabular-nums" style={{ color: expColor }}>
                  {scores.overall}
                </span>
                <span className="text-zinc-700 text-xl font-mono">/100</span>
              </div>
              <div className="text-zinc-300 text-sm font-semibold mb-1">{scores.maturityLabel}</div>
              <div className="text-zinc-600 text-xs leading-relaxed">{scores.maturityDesc}</div>
              <div
                className="inline-flex items-center gap-2 mt-3 px-3 py-1.5 rounded-lg text-[11px] font-mono font-semibold"
                style={{ background: expColor + '14', border: `1px solid ${expColor}28`, color: expColor }}
              >
                <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: expColor }} />
                {scores.exposureLabel}
              </div>
            </div>
            <div className="pt-1">
              <div className="label text-[9.5px] mb-4">Evaluación por dominio</div>
              <ScoreBar label="Infraestructura"     score={scores.infrastructure} color="#4878b0" />
              <ScoreBar label="Identidad & Gobierno" score={scores.identity}      color="#3a7858" />
              <ScoreBar label="Operaciones"          score={scores.operations}    color="#3d88a5" />
            </div>
          </div>
        </div>

        {/* Risk flags */}
        {scores.flags.length > 0 && (
          <div className="card p-6 mb-5">
            <div className="label text-[9.5px] mb-4">
              Hallazgos de riesgo — {scores.criticalCount} críticos · {scores.highCount} altos
            </div>
            <div className="space-y-3">
              {scores.flags.slice(0, 6).map(flag => (
                <div
                  key={flag.id}
                  className="rounded-xl p-4"
                  style={{
                    borderLeft: `3px solid ${SEVERITY_COLORS[flag.severity]}`,
                    background: 'rgba(255,255,255,0.016)',
                  }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span
                      className="text-[9px] font-mono font-bold px-2 py-0.5 rounded"
                      style={{
                        color:      SEVERITY_COLORS[flag.severity],
                        background: SEVERITY_COLORS[flag.severity] + '18',
                        border:     `1px solid ${SEVERITY_COLORS[flag.severity]}28`,
                      }}
                    >
                      {SEVERITY_LABELS[flag.severity]}
                    </span>
                    <span className="text-[9.5px] font-mono uppercase tracking-[0.12em] text-zinc-700">
                      {flag.category}
                    </span>
                  </div>
                  <p className="text-zinc-300 text-[13px] font-medium leading-snug mb-1.5">{flag.finding}</p>
                  <p className="text-zinc-600 text-[11px] font-mono leading-relaxed">→ {flag.recommendation}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Priorities + Quick wins */}
        <div className="grid sm:grid-cols-2 gap-5 mb-5">
          {scores.immediatePriorities.length > 0 && (
            <div className="card p-5">
              <div className="label text-[9.5px] mb-4">Prioridades inmediatas</div>
              <div className="space-y-2.5">
                {scores.immediatePriorities.slice(0, 5).map((p, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <span className="text-[10px] font-mono font-bold text-[#4878b0] flex-shrink-0 mt-0.5 tabular-nums">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <p className="text-zinc-500 text-[12px] leading-snug">{p}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {scores.quickWins.length > 0 && (
            <div className="card p-5">
              <div className="label text-[9.5px] mb-4">Victorias rápidas — 30–90 días</div>
              <div className="space-y-2.5">
                {scores.quickWins.map((w, i) => (
                  <div key={i} className="flex items-start gap-2.5">
                    <span className="text-[#3a7858] text-xs flex-shrink-0 mt-0.5">✓</span>
                    <p className="text-zinc-500 text-[11px] font-mono leading-snug">{w}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Observations */}
        {scores.observations.length > 0 && (
          <div className="card p-5 mb-5">
            <div className="label text-[9.5px] mb-4">Observaciones operacionales</div>
            <div className="space-y-3">
              {scores.observations.map((obs, i) => (
                <p key={i} className="text-zinc-500 text-[12px] leading-relaxed pl-3" style={{ borderLeft: '1px solid rgba(255,255,255,0.07)' }}>
                  {obs}
                </p>
              ))}
            </div>
          </div>
        )}

        {/* Recommended phase + CTA */}
        <div className="card p-6 mb-5" style={{ borderColor: 'rgba(72,120,176,0.16)' }}>
          <div className="label text-[9.5px] mb-3">Fase recomendada</div>
          <p className="text-zinc-200 text-base font-semibold mb-2 leading-snug">{scores.recommendedPhase}</p>
          <p className="text-zinc-600 text-xs font-mono mb-5">
            Alcance estimado: {classification.estimatedScope} · {classification.engagementLabel}
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/contacto" className="btn-amber px-6 py-3">
              Solicitar propuesta detallada →
            </Link>
            <button
              onClick={openPdf}
              className="btn-ghost px-5 py-3"
            >
              Descargar informe PDF
            </button>
          </div>
        </div>

        {/* Internal classification (shown for transparency/trust) */}
        <div className="card p-5 mb-8">
          <div className="label text-[9.5px] mb-3">Clasificación del engagement</div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-[11px] font-mono">
            <div>
              <div className="text-zinc-700 mb-1">Segmento</div>
              <div className="text-zinc-400">{classification.segment}</div>
            </div>
            <div>
              <div className="text-zinc-700 mb-1">Tipo</div>
              <div className="text-zinc-400">{classification.engagementLabel}</div>
            </div>
            <div>
              <div className="text-zinc-700 mb-1">Seguimiento</div>
              <div className="text-zinc-400">{classification.followUpLabel}</div>
            </div>
          </div>
        </div>

        <div className="text-center">
          <button onClick={onReset} className="text-zinc-700 text-xs font-mono hover:text-zinc-500 transition-colors">
            Iniciar nueva evaluación
          </button>
        </div>

      </div>
    </div>
  )
}

// ─── Step 1: Organization context ─────────────────────────────────────────────

function Step1({
  data, name, email, company, phone,
  onDataChange, onContact,
}: {
  data:         typeof EMPTY_S1
  name:         string; email: string; company: string; phone: string
  onDataChange: (k: keyof typeof EMPTY_S1, v: string) => void
  onContact:    (k: 'name'|'email'|'company'|'phone', v: string) => void
}) {
  const field = (key: keyof typeof EMPTY_S1) =>
    (v: string) => onDataChange(key, v)

  return (
    <div className="space-y-7">
      <Divider label="Contacto" />
      <div className="grid sm:grid-cols-2 gap-4">
        {([
          { k: 'name',    label: 'Nombre completo',    type: 'text',  ph: 'Juan Pérez',       req: true  },
          { k: 'email',   label: 'Correo corporativo', type: 'email', ph: 'juan@empresa.com', req: true  },
          { k: 'company', label: 'Empresa',            type: 'text',  ph: 'Corporativo XYZ',  req: true  },
          { k: 'phone',   label: 'Teléfono',           type: 'tel',   ph: '+52 55 0000 0000', req: false },
        ] as const).map(({ k, label, type, ph, req }) => (
          <div key={k}>
            <label className="label text-[10px] block mb-1.5">{label}</label>
            <input
              type={type} required={req}
              value={k === 'name' ? name : k === 'email' ? email : k === 'company' ? company : phone}
              onChange={e => onContact(k, e.target.value)}
              placeholder={ph}
              className="w-full bg-surface-dark border border-surface-border rounded-xl px-4 py-2.5 text-noc-white placeholder-zinc-700 text-sm focus:outline-none focus:border-zinc-600 transition-colors"
            />
          </div>
        ))}
      </div>

      <Divider label="Contexto organizacional" />

      <div>
        <QLabel hint="Sector de operación principal">Industria</QLabel>
        <Grid3>
          {[
            { v: 'manufacturing', l: 'Manufactura' },
            { v: 'healthcare',    l: 'Salud' },
            { v: 'retail',        l: 'Retail' },
            { v: 'finance',       l: 'Finanzas' },
            { v: 'logistics',     l: 'Logística' },
            { v: 'services',      l: 'Servicios' },
            { v: 'legal',         l: 'Legal' },
            { v: 'education',     l: 'Educación' },
            { v: 'other',         l: 'Otro' },
          ].map(({ v, l }) => (
            <Radio key={v} value={v} label={l} selected={data.industry === v} onChange={() => field('industry')(v)} />
          ))}
        </Grid3>
      </div>

      <div>
        <QLabel hint="Empleados activos (headcount total)">Tamaño de organización</QLabel>
        <Grid2>
          {[
            { v: '1-25',    l: '1–25 empleados',    s: 'Pequeña empresa' },
            { v: '26-100',  l: '26–100 empleados',  s: 'Empresa mediana' },
            { v: '101-500', l: '101–500 empleados', s: 'Mediana-grande' },
            { v: '500+',    l: 'Más de 500',        s: 'Corporativo / Enterprise' },
          ].map(({ v, l, s }) => (
            <Radio key={v} value={v} label={l} sub={s} selected={data.companySize === v} onChange={() => field('companySize')(v)} />
          ))}
        </Grid2>
      </div>

      <div>
        <QLabel hint="Oficinas, plantas, sucursales o sedes con infraestructura IT propia">Ubicaciones con infraestructura IT</QLabel>
        <Grid2>
          {[
            { v: '1',    l: 'Una sede',             s: 'Oficina central única' },
            { v: '2-5',  l: '2 a 5 ubicaciones',    s: 'Multi-sede local o regional' },
            { v: '6-20', l: '6 a 20 ubicaciones',   s: 'Red de sucursales' },
            { v: '20+',  l: 'Más de 20',            s: 'Infraestructura distribuida' },
          ].map(({ v, l, s }) => (
            <Radio key={v} value={v} label={l} sub={s} selected={data.locations === v} onChange={() => field('locations')(v)} />
          ))}
        </Grid2>
      </div>

      <div>
        <QLabel hint="Proporción de empleados que trabajan fuera de la oficina habitualmente">Fuerza de trabajo remota</QLabel>
        <Grid2>
          {[
            { v: 'none',        l: 'Presencial completo', s: 'Todos en oficina o planta' },
            { v: 'partial',     l: 'Remoto parcial',      s: 'Menos del 30% remoto' },
            { v: 'significant', l: 'Remoto significativo',s: 'Más del 30% trabaja remoto' },
            { v: 'full',        l: 'Totalmente remoto',   s: 'Sin sede física central' },
          ].map(({ v, l, s }) => (
            <Radio key={v} value={v} label={l} sub={s} selected={data.remoteWorkforce === v} onChange={() => field('remoteWorkforce')(v)} />
          ))}
        </Grid2>
      </div>

      <div>
        <QLabel hint="Licencias Microsoft 365, Exchange Online, Teams, SharePoint">Uso de Microsoft 365</QLabel>
        <Grid3>
          {[
            { v: 'full',    l: 'Sí, en producción',  s: 'Usuarios activos, licencias asignadas' },
            { v: 'partial', l: 'Parcialmente',        s: 'Solo algunos servicios o usuarios' },
            { v: 'none',    l: 'No usamos M365',     s: 'On-prem o Google Workspace' },
          ].map(({ v, l, s }) => (
            <Radio key={v} value={v} label={l} sub={s} selected={data.microsoft365 === v} onChange={() => field('microsoft365')(v)} />
          ))}
        </Grid3>
      </div>

      <div>
        <QLabel hint="Dónde reside la mayoría de la infraestructura y datos críticos">Modelo de infraestructura</QLabel>
        <Grid2>
          {[
            { v: 'cloud',         l: 'Nube',         s: 'Azure, M365, SaaS mayoritario' },
            { v: 'hybrid',        l: 'Híbrido',      s: 'Combinación cloud + on-premises' },
            { v: 'on-prem',       l: 'On-premises',  s: 'Servidores físicos propios o DC' },
            { v: 'unformalized',  l: 'Sin definir',  s: 'Sin arquitectura formal establecida' },
          ].map(({ v, l, s }) => (
            <Radio key={v} value={v} label={l} sub={s} selected={data.infrastructure === v} onChange={() => field('infrastructure')(v)} />
          ))}
        </Grid2>
      </div>
    </div>
  )
}

// ─── Step 2: Infrastructure ───────────────────────────────────────────────────

function Step2({ data, onChange }: { data: typeof EMPTY_S2; onChange: (k: keyof typeof EMPTY_S2, v: string) => void }) {
  const f = (k: keyof typeof EMPTY_S2) => (v: string) => onChange(k, v)

  return (
    <div className="space-y-7">
      <div>
        <QLabel hint="Separación de red corporativa, usuarios, servidores e IoT por VLANs">Segmentación VLAN</QLabel>
        <Grid3>
          {[
            { v: 'yes',     l: 'Sí, segmentada',    s: 'VLANs por función o zona de seguridad' },
            { v: 'partial', l: 'Parcialmente',       s: 'Alguna segmentación, incompleta' },
            { v: 'no',      l: 'No — red plana',     s: 'Todos los dispositivos en la misma red' },
          ].map(({ v, l, s }) => (
            <Radio key={v} value={v} label={l} sub={s} selected={data.vlanSegmentation === v} onChange={() => f('vlanSegmentation')(v)} />
          ))}
        </Grid3>
      </div>

      <div>
        <QLabel hint="Dispositivo de seguridad perimetral en uso actualmente">Firewall / Control perimetral</QLabel>
        <Grid2>
          {[
            { v: 'ngfw',        l: 'NGFW gestionado',     s: 'Fortinet, Cisco, Palo Alto — con IPS/IDS activo' },
            { v: 'basic',       l: 'Firewall básico',     s: 'Appliance o software sin IPS/IDS' },
            { v: 'isp-default', l: 'Router ISP',          s: 'Solo el firewall incluido por el proveedor de internet' },
            { v: 'none',        l: 'Sin firewall',        s: 'Sin dispositivo de seguridad perimetral' },
          ].map(({ v, l, s }) => (
            <Radio key={v} value={v} label={l} sub={s} selected={data.firewall === v} onChange={() => f('firewall')(v)} />
          ))}
        </Grid2>
      </div>

      <div>
        <QLabel hint="Solución para acceso remoto seguro a recursos corporativos">VPN / Acceso remoto</QLabel>
        <Grid3>
          {[
            { v: 'business', l: 'VPN empresarial',   s: 'FortiClient, Cisco AnyConnect u otro gestionado' },
            { v: 'consumer', l: 'VPN de consumo',    s: 'NordVPN, ExpressVPN u otra personal' },
            { v: 'none',     l: 'Sin VPN',           s: 'Sin solución de acceso remoto seguro' },
          ].map(({ v, l, s }) => (
            <Radio key={v} value={v} label={l} sub={s} selected={data.vpn === v} onChange={() => f('vpn')(v)} />
          ))}
        </Grid3>
      </div>

      <div>
        <QLabel hint="Estrategia de respaldo de datos críticos y sistemas">Estrategia de respaldo</QLabel>
        <Grid3>
          {[
            { v: 'cloud-verified', l: 'Cloud verificado',   s: 'Backup offsite con pruebas de restauración periódicas' },
            { v: 'local',          l: 'Solo local',         s: 'Backup en el mismo sitio, sin verificación formal' },
            { v: 'none',           l: 'Sin respaldo',       s: 'Sin estrategia de backup definida' },
          ].map(({ v, l, s }) => (
            <Radio key={v} value={v} label={l} sub={s} selected={data.backup === v} onChange={() => f('backup')(v)} />
          ))}
        </Grid3>
      </div>

      <div>
        <QLabel hint="Separación de red WiFi corporativa, invitados y dispositivos IoT">Segmentación WiFi</QLabel>
        <Grid3>
          {[
            { v: 'yes',     l: 'Sí, separada',      s: 'SSIDs distintos para corporativo e invitados' },
            { v: 'partial', l: 'Parcialmente',       s: 'Alguna separación, sin aislamiento completo' },
            { v: 'no',      l: 'No separada',        s: 'Corporativo e invitados en la misma red WiFi' },
          ].map(({ v, l, s }) => (
            <Radio key={v} value={v} label={l} sub={s} selected={data.wifiSegmentation === v} onChange={() => f('wifiSegmentation')(v)} />
          ))}
        </Grid3>
      </div>

      <div>
        <QLabel hint="¿Tienes un registro actualizado de todos los equipos y dispositivos corporativos?">Inventario de endpoints</QLabel>
        <Grid3>
          {[
            { v: 'full',    l: 'Inventario completo', s: 'Registro actualizado de todos los dispositivos' },
            { v: 'partial', l: 'Inventario parcial',  s: 'Registro incompleto o desactualizado' },
            { v: 'none',    l: 'Sin inventario',      s: 'No existe registro formal de dispositivos' },
          ].map(({ v, l, s }) => (
            <Radio key={v} value={v} label={l} sub={s} selected={data.endpointInventory === v} onChange={() => f('endpointInventory')(v)} />
          ))}
        </Grid3>
      </div>

      <div>
        <QLabel hint="Nivel de protección en endpoints — laptops, workstations, servidores">Protección de endpoint (EDR/AV)</QLabel>
        <Grid3>
          {[
            { v: 'edr', l: 'EDR gestionado',      s: 'CrowdStrike, Defender for Endpoint, SentinelOne' },
            { v: 'av',  l: 'Antivirus básico',    s: 'AV estándar sin capacidad de respuesta a incidentes' },
            { v: 'none',l: 'Sin protección',      s: 'Sin agente de seguridad en endpoints' },
          ].map(({ v, l, s }) => (
            <Radio key={v} value={v} label={l} sub={s} selected={data.edrAv === v} onChange={() => f('edrAv')(v)} />
          ))}
        </Grid3>
      </div>
    </div>
  )
}

// ─── Step 3: Identity & Governance ────────────────────────────────────────────

function Step3({ data, onChange }: { data: typeof EMPTY_S3; onChange: (k: keyof typeof EMPTY_S3, v: string) => void }) {
  const f = (k: keyof typeof EMPTY_S3) => (v: string) => onChange(k, v)

  return (
    <div className="space-y-7">
      <div>
        <QLabel hint="Azure Active Directory / Entra ID como directorio central de identidades">Entra ID / Directorio de identidad</QLabel>
        <Grid3>
          {[
            { v: 'full',    l: 'Entra ID completo',  s: 'Todos los usuarios, SSO, sincronización activa' },
            { v: 'partial', l: 'Parcial / AD híbrido',s: 'AD on-prem con sync parcial a Entra ID' },
            { v: 'none',    l: 'Sin Entra ID',        s: 'Solo Active Directory on-premises o sin directorio' },
          ].map(({ v, l, s }) => (
            <Radio key={v} value={v} label={l} sub={s} selected={data.entraId === v} onChange={() => f('entraId')(v)} />
          ))}
        </Grid3>
      </div>

      <div>
        <QLabel hint="Autenticación multifactor para acceso a sistemas y aplicaciones corporativas">Aplicación de MFA</QLabel>
        <Grid3>
          {[
            { v: 'all',     l: 'MFA obligatorio',    s: 'Todos los usuarios, todas las aplicaciones' },
            { v: 'partial', l: 'MFA parcial',        s: 'Solo admin, algunos usuarios o algunos servicios' },
            { v: 'none',    l: 'Sin MFA',            s: 'Acceso solo con usuario y contraseña' },
          ].map(({ v, l, s }) => (
            <Radio key={v} value={v} label={l} sub={s} selected={data.mfa === v} onChange={() => f('mfa')(v)} />
          ))}
        </Grid3>
      </div>

      <div>
        <QLabel hint="Políticas de acceso dinámicas basadas en dispositivo, ubicación y riesgo de usuario">Acceso Condicional</QLabel>
        <Grid3>
          {[
            { v: 'configured', l: 'Configurado',      s: 'Políticas activas: MFA, compliance de dispositivo' },
            { v: 'partial',    l: 'Parcialmente',     s: 'Algunas políticas, cobertura incompleta' },
            { v: 'none',       l: 'Sin Acceso Cond.', s: 'Sin políticas de acceso contextual' },
          ].map(({ v, l, s }) => (
            <Radio key={v} value={v} label={l} sub={s} selected={data.conditionalAccess === v} onChange={() => f('conditionalAccess')(v)} />
          ))}
        </Grid3>
      </div>

      <div>
        <QLabel hint="Microsoft Intune u otra plataforma MDM/MAM para gestión de dispositivos">Gestión de dispositivos (MDM)</QLabel>
        <Grid3>
          {[
            { v: 'full',    l: 'MDM completo',       s: 'Todos los endpoints enrolados, políticas activas' },
            { v: 'partial', l: 'MDM parcial',        s: 'Cobertura incompleta o solo mobile' },
            { v: 'none',    l: 'Sin MDM',            s: 'Dispositivos no gestionados centralmente' },
          ].map(({ v, l, s }) => (
            <Radio key={v} value={v} label={l} sub={s} selected={data.intune === v} onChange={() => f('intune')(v)} />
          ))}
        </Grid3>
      </div>

      <div>
        <QLabel hint="Control de acceso a cuentas y sistemas con privilegios administrativos">Gestión de acceso privilegiado</QLabel>
        <Grid2>
          {[
            { v: 'pam',        l: 'PAM / PIM',          s: 'Privileged Identity Management, acceso just-in-time' },
            { v: 'individual', l: 'Cuentas nominales',  s: 'Cada admin tiene su cuenta individual, sin PIM' },
            { v: 'shared',     l: 'Cuentas compartidas',s: 'Admin/root compartido entre varios — sin trazabilidad' },
            { v: 'none',       l: 'Sin control formal', s: 'Sin política de acceso privilegiado definida' },
          ].map(({ v, l, s }) => (
            <Radio key={v} value={v} label={l} sub={s} selected={data.privilegedAccess === v} onChange={() => f('privilegedAccess')(v)} />
          ))}
        </Grid2>
      </div>

      <div>
        <QLabel hint="Proceso de alta y baja de usuarios en sistemas y accesos corporativos">Proceso de alta/baja de usuarios</QLabel>
        <Grid3>
          {[
            { v: 'automated', l: 'Automatizado',      s: 'Provisioning automático con workflows de RRHH' },
            { v: 'manual',    l: 'Manual documentado', s: 'Proceso definido, ejecución manual' },
            { v: 'none',      l: 'Sin proceso formal', s: 'Ad hoc, sin lista de verificación ni auditoría' },
          ].map(({ v, l, s }) => (
            <Radio key={v} value={v} label={l} sub={s} selected={data.onboarding === v} onChange={() => f('onboarding')(v)} />
          ))}
        </Grid3>
      </div>
    </div>
  )
}

// ─── Step 4: Operations ───────────────────────────────────────────────────────

function Step4({
  data, onChange, onMulti,
}: {
  data:     typeof EMPTY_S4
  onChange: (k: keyof Omit<typeof EMPTY_S4, 'compliance'>, v: string) => void
  onMulti:  (v: string) => void
}) {
  const f = (k: keyof Omit<typeof EMPTY_S4, 'compliance'>) => (v: string) => onChange(k, v)

  return (
    <div className="space-y-7">
      <div>
        <QLabel hint="Documentación de red, servidores, credenciales, procedimientos y configuraciones">Documentación técnica</QLabel>
        <Grid3>
          {[
            { v: 'current',   l: 'Actualizada',      s: 'Diagramas de red, inventario y runbooks vigentes' },
            { v: 'outdated',  l: 'Desactualizada',   s: 'Existe documentación pero no está al día' },
            { v: 'none',      l: 'Sin documentación',s: 'Conocimiento tácito, sin documentos formales' },
          ].map(({ v, l, s }) => (
            <Radio key={v} value={v} label={l} sub={s} selected={data.documentation === v} onChange={() => f('documentation')(v)} />
          ))}
        </Grid3>
      </div>

      <div>
        <QLabel hint="Capacidad de detección y alerta sobre eventos de seguridad e incidentes">Monitoreo y detección</QLabel>
        <Grid3>
          {[
            { v: 'siem',  l: 'SIEM / Log central',  s: 'Alertas activas, correlación de eventos, dashboards' },
            { v: 'basic', l: 'Logs básicos',        s: 'Logs en dispositivos, sin correlación activa' },
            { v: 'none',  l: 'Sin monitoreo',       s: 'Sin visibilidad de eventos de seguridad' },
          ].map(({ v, l, s }) => (
            <Radio key={v} value={v} label={l} sub={s} selected={data.monitoring === v} onChange={() => f('monitoring')(v)} />
          ))}
        </Grid3>
      </div>

      <div>
        <QLabel hint="Sistema para registrar, priorizar y dar seguimiento a incidentes y solicitudes IT">Sistema de ticketing / Gestión de incidentes</QLabel>
        <Grid3>
          {[
            { v: 'formal',   l: 'Sistema formal',    s: 'ServiceNow, Jira, Freshdesk u otro ITSM' },
            { v: 'informal', l: 'Informal',          s: 'Email, chat o WhatsApp como canal de soporte' },
            { v: 'none',     l: 'Sin sistema',       s: 'Sin seguimiento formal de incidentes' },
          ].map(({ v, l, s }) => (
            <Radio key={v} value={v} label={l} sub={s} selected={data.ticketing === v} onChange={() => f('ticketing')(v)} />
          ))}
        </Grid3>
      </div>

      <div>
        <QLabel hint="Evaluación formal de seguridad o auditoría técnica de infraestructura">Última auditoría de seguridad</QLabel>
        <Grid3>
          {[
            { v: 'recent', l: 'Menos de 12 meses', s: 'Auditoría o evaluación de vulnerabilidades reciente' },
            { v: 'dated',  l: '1 a 3 años',        s: 'Auditoría existe pero está desactualizada' },
            { v: 'never',  l: 'Nunca',             s: 'Sin evaluación de seguridad formal previa' },
          ].map(({ v, l, s }) => (
            <Radio key={v} value={v} label={l} sub={s} selected={data.lastAudit === v} onChange={() => f('lastAudit')(v)} />
          ))}
        </Grid3>
      </div>

      <div>
        <QLabel hint="Marcos de cumplimiento activos o en proceso de implementación (selecciona todos los aplicables)">
          Marcos de cumplimiento activos
        </QLabel>
        <Grid2>
          {[
            { v: 'nom-035',  l: 'NOM-035 (bienestar laboral)' },
            { v: 'nom-024',  l: 'NOM-024 (salud, expedientes)' },
            { v: 'iso27001', l: 'ISO 27001' },
            { v: 'pci-dss',  l: 'PCI-DSS' },
            { v: 'hipaa',    l: 'HIPAA' },
            { v: 'none',     l: 'Ninguno actualmente' },
          ].map(({ v, l }) => (
            <Check key={v} value={v} label={l} selected={data.compliance.includes(v)} onChange={() => onMulti(v)} />
          ))}
        </Grid2>
      </div>

      <div>
        <QLabel hint="Proceso para evaluar, aprobar y registrar cambios en la infraestructura">Gestión del cambio</QLabel>
        <Grid3>
          {[
            { v: 'formal',   l: 'Proceso formal',    s: 'Change Advisory Board, approvals y rollback plan' },
            { v: 'informal', l: 'Informal',          s: 'Cambios coordinados pero sin proceso documentado' },
            { v: 'none',     l: 'Sin proceso',       s: 'Cambios directos sin revisión ni registro' },
          ].map(({ v, l, s }) => (
            <Radio key={v} value={v} label={l} sub={s} selected={data.changeManagement === v} onChange={() => f('changeManagement')(v)} />
          ))}
        </Grid3>
      </div>
    </div>
  )
}

// ─── Step 5: Priorities ────────────────────────────────────────────────────────

function Step5({
  data, onChange, onMultiNeeds, onMultiGoals,
}: {
  data:          typeof EMPTY_S5
  onChange:      (k: keyof Pick<typeof EMPTY_S5, 'painPoint'|'urgency'|'notes'>, v: string) => void
  onMultiNeeds:  (v: string) => void
  onMultiGoals:  (v: string) => void
}) {
  return (
    <div className="space-y-7">
      <div>
        <QLabel hint="El área que genera más fricción operacional actualmente">Principal punto de dolor</QLabel>
        <Grid2>
          {[
            { v: 'security',     l: 'Incidentes de seguridad', s: 'Brechas, ransomware, accesos no autorizados' },
            { v: 'compliance',   l: 'Cumplimiento normativo',  s: 'Requisito regulatorio o de cliente' },
            { v: 'modernization',l: 'Modernización tecnológica',s: 'Infraestructura obsoleta, migraciones pendientes' },
            { v: 'costs',        l: 'Optimización de costos',  s: 'Licencias, contratos o ineficiencias' },
            { v: 'visibility',   l: 'Falta de visibilidad',    s: 'Sin control sobre dispositivos o accesos' },
            { v: 'gaps',         l: 'Brechas operacionales',   s: 'Procesos IT sin cobertura formal' },
          ].map(({ v, l, s }) => (
            <Radio key={v} value={v} label={l} sub={s} selected={data.painPoint === v} onChange={() => onChange('painPoint', v)} />
          ))}
        </Grid2>
      </div>

      <div>
        <QLabel hint="¿Cuándo necesitas iniciar o resolver esto?">Urgencia del proyecto</QLabel>
        <Grid2>
          {[
            { v: 'critical',   l: 'Ahora — incidente activo',  s: 'Brecha en curso o riesgo operacional inmediato' },
            { v: 'urgent',     l: 'Dentro de 30 días',         s: 'Hay un compromiso o plazo próximo' },
            { v: 'planned',    l: 'Este trimestre',            s: 'Proyecto planificado con presupuesto' },
            { v: 'evaluating', l: 'Explorando opciones',       s: 'Fase de evaluación, sin fecha definida' },
          ].map(({ v, l, s }) => (
            <Radio key={v} value={v} label={l} sub={s} selected={data.urgency === v} onChange={() => onChange('urgency', v)} />
          ))}
        </Grid2>
      </div>

      <div>
        <QLabel hint="Requisitos normativos o contractuales vigentes (selecciona todos los que aplican)">
          Requisitos de cumplimiento
        </QLabel>
        <Grid2>
          {[
            { v: 'regulatory',   l: 'Obligación regulatoria' },
            { v: 'insurance',    l: 'Requerimiento de póliza' },
            { v: 'client-req',   l: 'Requisito de cliente' },
            { v: 'internal',     l: 'Política interna' },
            { v: 'none',         l: 'Sin requisitos específicos' },
          ].map(({ v, l }) => (
            <Check key={v} value={v} label={l} selected={data.complianceNeeds.includes(v)} onChange={() => onMultiNeeds(v)} />
          ))}
        </Grid2>
      </div>

      <div>
        <QLabel hint="Resultados esperados del proyecto (selecciona todos los que aplican)">Objetivos del proyecto</QLabel>
        <Grid2>
          {[
            { v: 'reduce-risk',   l: 'Reducir exposición a riesgos' },
            { v: 'visibility',    l: 'Mejorar visibilidad y control' },
            { v: 'reduce-costs',  l: 'Optimizar costos IT' },
            { v: 'standardize',   l: 'Estandarizar infraestructura' },
            { v: 'comply',        l: 'Cumplir normativa o auditoría' },
            { v: 'modernize',     l: 'Modernizar hacia cloud' },
          ].map(({ v, l }) => (
            <Check key={v} value={v} label={l} selected={data.projectGoals.includes(v)} onChange={() => onMultiGoals(v)} />
          ))}
        </Grid2>
      </div>

      <div>
        <label className="label text-[10px] block mb-1.5">Contexto adicional <span className="text-zinc-700">(opcional)</span></label>
        <textarea
          rows={4}
          value={data.notes}
          onChange={e => onChange('notes', e.target.value)}
          placeholder="Describe el contexto específico del proyecto, incidentes recientes, restricciones presupuestarias o cualquier información relevante para la evaluación..."
          className="w-full bg-surface-dark border border-surface-border rounded-xl px-4 py-3 text-noc-white placeholder-zinc-700 text-sm focus:outline-none focus:border-zinc-600 transition-colors resize-none"
        />
      </div>
    </div>
  )
}

// ─── Main component ────────────────────────────────────────────────────────────

export default function AssessmentsPage() {
  const [step,   setStep]   = useState<number>(1)
  const [status, setStatus] = useState<'idle'|'submitting'|'done'|'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  // Contact
  const [name,    setName]    = useState('')
  const [email,   setEmail]   = useState('')
  const [company, setCompany] = useState('')
  const [phone,   setPhone]   = useState('')

  // Step data
  const [s1, setS1] = useState({ ...EMPTY_S1 })
  const [s2, setS2] = useState({ ...EMPTY_S2 })
  const [s3, setS3] = useState({ ...EMPTY_S3 })
  const [s4, setS4] = useState({ ...EMPTY_S4 })
  const [s5, setS5] = useState({ ...EMPTY_S5 })

  // Results
  const [scores,         setScores]         = useState<ScoreResult | null>(null)
  const [classification, setClassification] = useState<LeadClassification | null>(null)
  const [reportRef,      setReportRef]      = useState('')

  // Meta
  const [source, setSource] = useState('')
  const [utm,    setUtm]    = useState('')

  useAssessmentStep(step, status)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const utmSrc = params.get('utm_source') || params.get('ref')
    if (utmSrc) {
      const utmValue = params.toString()
      setSource(utmSrc)
      setUtm(utmValue)
      trackLeadSourceAttribution(utmSrc, utmValue, 'assessment-entry')
      return
    }
    try {
      const ref = document.referrer ? new URL(document.referrer).hostname : ''
      if (ref && ref !== 'velkor.mx') {
        setSource(ref)
        trackLeadSourceAttribution(ref, 'none', 'assessment-referrer')
      }
    } catch { /* ignore */ }
  }, [])

  // Multi-select togglers
  const toggleCompliance = useCallback((v: string) => {
    setS4(prev => ({
      ...prev,
      compliance: prev.compliance.includes(v)
        ? prev.compliance.filter(x => x !== v)
        : [...prev.compliance, v],
    }))
  }, [])
  const toggleNeeds = useCallback((v: string) => {
    setS5(prev => ({
      ...prev,
      complianceNeeds: prev.complianceNeeds.includes(v)
        ? prev.complianceNeeds.filter(x => x !== v)
        : [...prev.complianceNeeds, v],
    }))
  }, [])
  const toggleGoals = useCallback((v: string) => {
    setS5(prev => ({
      ...prev,
      projectGoals: prev.projectGoals.includes(v)
        ? prev.projectGoals.filter(x => x !== v)
        : [...prev.projectGoals, v],
    }))
  }, [])

  // Validation per step
  const canProceed = (): boolean => {
    if (step === 1) {
      return !!(name.trim() && email.includes('@') && company.trim() &&
                s1.industry && s1.companySize && s1.locations &&
                s1.remoteWorkforce && s1.microsoft365 && s1.infrastructure)
    }
    if (step === 2) {
      return !!(s2.vlanSegmentation && s2.firewall && s2.vpn &&
                s2.backup && s2.wifiSegmentation && s2.endpointInventory && s2.edrAv)
    }
    if (step === 3) {
      return !!(s3.entraId && s3.mfa && s3.conditionalAccess &&
                s3.intune && s3.privilegedAccess && s3.onboarding)
    }
    if (step === 4) {
      return !!(s4.documentation && s4.monitoring && s4.ticketing &&
                s4.lastAudit && s4.changeManagement)
    }
    if (step === 5) {
      return !!(s5.painPoint && s5.urgency)
    }
    return false
  }

  const nextStep = () => {
    if (!canProceed()) return
    if (step < 5) {
      setStep(s => s + 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const prevStep = () => {
    if (step > 1) { setStep(s => s - 1); window.scrollTo({ top: 0, behavior: 'smooth' }) }
  }

  const submit = async () => {
    if (!canProceed()) return
    setStatus('submitting')
    trackEvent(Events.AssessmentSubmitted, {
      source: source || 'direct',
      step: String(step),
    })

    const payload = {
      name, email, company, phone, source, utm,
      step1: s1, step2: s2, step3: s3, step4: s4, step5: s5,
      _hp: '', // honeypot always empty from legitimate submission
    }

    try {
      const res = await fetch('/api/assessment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const data = await res.json()

      if (!res.ok) {
        setStatus('error')
        setErrorMsg(data.error || 'Error al procesar la evaluación. Intenta de nuevo.')
        trackEvent(Events.AssessmentError, { reason: data.error || 'request-error' })
        return
      }

      setScores(data.scores)
      setClassification(data.classification)
      setReportRef(data.reportRef)
      setStatus('done')

      trackEvent(Events.AssessmentCompleted, {
        score:    data.scores?.overall,
        maturity: data.scores?.maturity,
        segment:  data.classification?.segment,
      })

      // ── Email notification (non-blocking, fail-silent) ──
      if (data.scores && data.classification) {
        fetch('/api/assessment/notify', {
          method:  'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            reportRef: data.reportRef,
            email,
            emailData: {
              recipientName:    name,
              company,
              reportRef:        data.reportRef,
              overallScore:     data.scores.overall,
              maturityLabel:    data.scores.maturityLabel,
              exposureLabel:    data.scores.exposureLabel,
              exposureLevel:    data.scores.exposureLevel,
              criticalCount:    data.scores.criticalCount,
              highCount:        data.scores.highCount,
              topFlags:         (data.scores.flags  ?? []).slice(0, 3),
              quickWins:        (data.scores.quickWins ?? []).slice(0, 3),
              recommendedPhase: data.scores.recommendedPhase,
              engagementLabel:  data.classification.engagementLabel,
              followUpLabel:    data.classification.followUpLabel,
              followUpHours:    data.classification.followUpHours,
            },
          }),
        }).catch(() => {}) // silent — email delivery is best-effort
      }
    } catch {
      setStatus('error')
      setErrorMsg('Error de conexión. Verifica tu internet e intenta de nuevo.')
      trackEvent(Events.AssessmentError, { reason: 'network-error' })
    }
  }

  const reset = () => {
    setStep(1); setStatus('idle'); setErrorMsg('')
    setName(''); setEmail(''); setCompany(''); setPhone('')
    setS1({ ...EMPTY_S1 }); setS2({ ...EMPTY_S2 })
    setS3({ ...EMPTY_S3 }); setS4({ ...EMPTY_S4 }); setS5({ ...EMPTY_S5 })
    setScores(null); setClassification(null); setReportRef('')
  }

  // ── Results screen ──
  if (status === 'done' && scores && classification) {
    const allAnswers: AssessmentAnswers = {
      name, email, company, phone, source, utm,
      step1: s1, step2: s2, step3: s3, step4: s4, step5: s5,
    }
    return (
      <ResultsScreen
        scores={scores}
        classification={classification}
        company={company}
        reportRef={reportRef}
        answers={allAnswers}
        onReset={reset}
      />
    )
  }

  // ── Assessment form ──
  return (
    <div className="min-h-screen py-12 px-4 sm:px-8">
      {/* Invisible honeypot — positioned off-screen, not display:none */}
      <div
        aria-hidden="true"
        style={{ position: 'absolute', left: '-9999px', top: '-9999px', opacity: 0, height: 0, overflow: 'hidden' }}
      >
        <input
          tabIndex={-1}
          name="_hp"
          type="text"
          autoComplete="off"
          readOnly
          value=""
        />
      </div>

      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <span className="label">Evaluación operacional de infraestructura IT</span>
          <h1 className="text-3xl sm:text-4xl font-black text-noc-white mt-3 mb-3 leading-tight tracking-heading">
            Diagnóstico técnico<br />
            <span className="text-zinc-500">acotada y documentada</span>
          </h1>
          <p className="text-zinc-600 text-sm leading-relaxed max-w-lg">
            5 módulos · 10–15 minutos · Resultado inmediato con nivel de madurez, hallazgos y prioridades.
          </p>
        </div>

        {/* Step progress */}
        <StepProgress current={step} />

        {/* Step content */}
        <div className="card p-6 sm:p-8 mb-5">
          {step === 1 && (
            <Step1
              data={s1} name={name} email={email} company={company} phone={phone}
              onDataChange={(k, v) => setS1(p => ({ ...p, [k]: v }))}
              onContact={(k, v) => {
                if (k === 'name')    setName(v)
                if (k === 'email')   setEmail(v)
                if (k === 'company') setCompany(v)
                if (k === 'phone')   setPhone(v)
              }}
            />
          )}
          {step === 2 && (
            <Step2 data={s2} onChange={(k, v) => setS2(p => ({ ...p, [k]: v }))} />
          )}
          {step === 3 && (
            <Step3 data={s3} onChange={(k, v) => setS3(p => ({ ...p, [k]: v }))} />
          )}
          {step === 4 && (
            <Step4
              data={s4}
              onChange={(k, v) => setS4(p => ({ ...p, [k]: v } as typeof EMPTY_S4))}
              onMulti={toggleCompliance}
            />
          )}
          {step === 5 && (
            <Step5
              data={s5}
              onChange={(k, v) => setS5(p => ({ ...p, [k]: v }))}
              onMultiNeeds={toggleNeeds}
              onMultiGoals={toggleGoals}
            />
          )}
        </div>

        {/* Error state */}
        {status === 'error' && (
          <div className="mb-4 px-4 py-3 rounded-xl border border-red-900/40 bg-red-950/20">
            <p className="text-red-400 text-sm">{errorMsg}</p>
          </div>
        )}

        {/* Navigation */}
        <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
          <button
            type="button"
            onClick={prevStep}
            disabled={step === 1}
            className="btn-ghost w-full sm:w-auto px-5 py-3 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            ← Anterior
          </button>

          {step < 5 ? (
            <button
              type="button"
              onClick={nextStep}
              disabled={!canProceed()}
              className="btn-amber w-full sm:w-auto px-8 py-3 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Siguiente →
            </button>
          ) : (
            <button
              type="button"
              onClick={submit}
              disabled={status === 'submitting' || !canProceed()}
              className="btn-amber w-full sm:w-auto px-8 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {status === 'submitting' ? 'Procesando evaluación...' : 'Generar evaluación →'}
            </button>
          )}
        </div>

        {/* Completion note */}
        <p className="text-center text-zinc-700 text-[11px] font-mono mt-5">
          Resultado inmediato · Sin compromiso · Un ingeniero revisará tu evaluación en &lt; 24 h hábiles
        </p>
      </div>
    </div>
  )
}
