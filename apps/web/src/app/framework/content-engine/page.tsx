import type { Metadata } from 'next'
import Link from 'next/link'
import { authorityAssetRules, contentTemplates, operationalTagGroups, technicalCategories } from '@/lib/contentEngine'
import type { ContentTemplate, ContentField } from '@/lib/contentEngine'

export const metadata: Metadata = {
  title: 'Motor de Contenido Técnico | Framework — Velkor System',
  description: 'Estructuras reutilizables para distribuir autoridad operacional: decisiones de arquitectura, lecciones de implementación, gobernanza insights y casos de transformación.',
  alternates: { canonical: 'https://velkor.mx/framework/content-engine' },
}

const TYPE_COLORS: Record<string, string> = {
  'architecture-decision': '#4878b0',
  'implementation-lesson': '#3a7858',
  'mini-case-breakdown': '#3d88a5',
  'governance-insight': '#b07828',
  'operational-constraint': '#a855f7',
  'evidence-brief': '#3a7858',
  'rollout-playbook': '#4878b0',
}

function FieldRow({ field }: { field: ContentField }) {
  return (
    <div className="mb-3">
      <div className="flex items-center gap-2 mb-1">
        <span className="font-mono text-[10px] text-zinc-500 uppercase tracking-wider">{field.label}</span>
        {field.required && (
          <span className="font-mono text-[9px] text-zinc-700 border border-zinc-800 px-1 rounded">requerido</span>
        )}
      </div>
      <div
        className="w-full px-3 py-2 rounded text-[11px] text-zinc-700 font-mono"
        style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}
      >
        {field.hint}
      </div>
    </div>
  )
}

function ExampleRow({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="mb-3">
      <div className="font-mono text-[10px] mb-1" style={{ color }}>
        {label.toUpperCase()}
      </div>
      <div
        className="px-3 py-2.5 rounded text-xs text-zinc-400 leading-relaxed whitespace-pre-line"
        style={{ background: color + '08', border: `1px solid ${color}18` }}
      >
        {value}
      </div>
    </div>
  )
}

function TemplateCard({ template }: { template: ContentTemplate }) {
  const color = TYPE_COLORS[template.type] ?? '#b07828'

  return (
    <div
      className="mb-12 rounded-xl overflow-hidden"
      style={{ border: '1px solid rgba(255,255,255,0.07)' }}
    >
      {/* Card header */}
      <div
        className="px-7 py-5"
        style={{ background: color + '0a', borderBottom: `1px solid ${color}20` }}
      >
        <div className="flex items-start justify-between gap-4 mb-2">
          <div>
            <div className="font-mono text-[10px] text-zinc-600 mb-1 uppercase tracking-wider">{template.type}</div>
            <h2 className="text-noc-white font-black text-xl">{template.name}</h2>
          </div>
          <span
            className="font-mono text-[10px] px-2.5 py-1 rounded flex-shrink-0 mt-1"
            style={{ color, background: color + '18', border: `1px solid ${color}30` }}
          >
            {template.estimatedLength}
          </span>
        </div>
        <p className="text-zinc-500 text-xs leading-relaxed max-w-2xl">{template.purpose}</p>
      </div>

      {/* Hook pattern */}
      <div className="px-7 py-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="font-mono text-[10px] text-zinc-600 mb-2 uppercase tracking-wider">Patrón de apertura (LinkedIn hook)</div>
        <div
          className="px-4 py-3 rounded text-sm text-zinc-300 italic leading-relaxed"
          style={{ background: 'rgba(255,255,255,0.025)', borderLeft: `2px solid ${color}` }}
        >
          &ldquo;{template.linkedinHook}&rdquo;
        </div>
      </div>

      {/* Two-column layout: structure + example */}
      <div className="grid lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-zinc-900">

        {/* Structure */}
        <div className="px-7 py-6">
          <div className="font-mono text-[10px] text-zinc-600 mb-4 uppercase tracking-wider">Estructura de campos</div>
          {template.fields.map(field => (
            <FieldRow key={field.key} field={field} />
          ))}
          <div
            className="mt-4 px-3 py-2 rounded text-[10px] font-mono text-zinc-700"
            style={{ background: 'rgba(255,255,255,0.02)', border: '1px dashed rgba(255,255,255,0.08)' }}
          >
            Copiar estructura: {template.fields.map(f => f.label).join(' / ')}
          </div>
        </div>

        {/* Example */}
        <div className="px-7 py-6">
          <div className="font-mono text-[10px] mb-4 uppercase tracking-wider" style={{ color }}>
            Ejemplo poblado
          </div>
          {template.fields.map(field => (
            template.example[field.key] ? (
              <ExampleRow
                key={field.key}
                label={field.label}
                value={template.example[field.key]}
                color={color}
              />
            ) : null
          ))}
        </div>

      </div>
    </div>
  )
}

export default function ContentEnginePage() {
  return (
    <div className="min-h-screen py-16 px-4 sm:px-8">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="mb-14">
          <div className="flex items-center gap-3 mb-4">
            <Link
              href="/framework"
              className="text-zinc-600 text-[10px] font-mono hover:text-zinc-400 transition-colors"
            >
              ← Framework
            </Link>
            <span className="text-zinc-800 text-[10px] font-mono">/</span>
            <span className="text-zinc-600 text-[10px] font-mono">content-engine</span>
          </div>
          <span className="label block mb-3">Distribución de autoridad operacional</span>
          <h1 className="text-4xl sm:text-5xl font-black text-noc-white mt-3 mb-4">
            Motor de contenido técnico
          </h1>
          <p className="text-zinc-500 max-w-2xl leading-relaxed text-sm">
            Estructuras reutilizables para convertir trabajo de ingeniería real en contenido que establece autoridad técnica. Cada formato está diseñado para un tipo específico de señal operacional — no para tráfico genérico.
          </p>
          <div
            className="mt-6 px-4 py-3 rounded-lg inline-block"
            style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)' }}
          >
            <div className="font-mono text-[10px] text-zinc-600">
              {contentTemplates.length} formatos · Activos de autoridad · Evidencia · Casos · Frameworks · Basado en proyectos reales
            </div>
          </div>
        </div>

        {/* Authority architecture */}
        <div className="grid lg:grid-cols-[1.15fr_0.85fr] gap-4 mb-12">
          <div
            className="p-5 rounded-xl"
            style={{ background: 'rgba(255,255,255,0.018)', border: '1px solid rgba(255,255,255,0.06)' }}
          >
            <div className="font-mono text-[10px] text-zinc-600 mb-4 uppercase tracking-wider">Categorías técnicas</div>
            <div className="grid sm:grid-cols-2 gap-3">
              {Object.entries(technicalCategories).map(([key, cat]) => (
                <div key={key} className="rounded-lg p-3" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <div className="text-zinc-300 text-[12px] font-semibold mb-1">{cat.label}</div>
                  <p className="text-zinc-600 text-[11px] leading-relaxed">{cat.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div
            className="p-5 rounded-xl"
            style={{ background: 'rgba(72,120,176,0.035)', border: '1px solid rgba(72,120,176,0.12)' }}
          >
            <div className="font-mono text-[10px] text-zinc-600 mb-4 uppercase tracking-wider">Reglas del asset</div>
            <div className="space-y-3">
              {authorityAssetRules.map((rule, i) => (
                <div key={rule} className="flex items-start gap-3">
                  <span className="text-[10px] font-mono text-[#4878b0] tabular-nums">{String(i + 1).padStart(2, '0')}</span>
                  <p className="text-zinc-500 text-[11px] leading-relaxed">{rule}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div
          className="mb-12 p-5 rounded-xl"
          style={{ background: 'rgba(255,255,255,0.018)', border: '1px solid rgba(255,255,255,0.06)' }}
        >
          <div className="font-mono text-[10px] text-zinc-600 mb-4 uppercase tracking-wider">Taxonomía operacional</div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {operationalTagGroups.map(group => (
              <div key={group.group} className="rounded-lg p-3" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
                <div className="text-zinc-400 text-[11px] font-semibold mb-2">{group.group}</div>
                <div className="flex flex-wrap gap-1.5">
                  {group.tags.map(tag => (
                    <span key={tag} className="text-[9px] font-mono text-zinc-700 px-1.5 py-0.5 rounded" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Index */}
        <div
          className="mb-12 p-5 rounded-xl"
          style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}
        >
          <div className="font-mono text-[10px] text-zinc-600 mb-4 uppercase tracking-wider">Índice de formatos</div>
          <div className="space-y-2">
            {contentTemplates.map((t, i) => {
              const color = TYPE_COLORS[t.type] ?? '#b07828'
              return (
                <div key={t.id} className="flex items-center gap-3">
                  <span className="font-mono text-[10px] text-zinc-700 w-5 flex-shrink-0">0{i + 1}</span>
                  <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: color }} />
                  <span className="font-mono text-[11px] text-zinc-400">{t.name}</span>
                  <span className="font-mono text-[10px] text-zinc-700 ml-auto">{t.estimatedLength}</span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Templates */}
        {contentTemplates.map(template => (
          <TemplateCard key={template.id} template={template} />
        ))}

        {/* Usage notes */}
        <div
          className="mt-4 p-6 rounded-xl"
          style={{ background: 'rgba(176,120,40,0.04)', border: '1px solid rgba(176,120,40,0.12)' }}
        >
          <div className="font-mono text-[10px] text-zinc-600 mb-3 uppercase tracking-wider">Notas de uso</div>
          <ul className="space-y-2">
            {[
              'Cada formato produce una publicación de LinkedIn autónoma — no requiere enlace externo para tener valor.',
              'El hook de apertura es la línea más importante: establece el contexto operacional en las primeras 2 líneas.',
              'Sanitizar el cliente no significa generalizar el caso — los detalles técnicos específicos son lo que genera autoridad.',
              'El riesgo residual documentado (formato de restricción operacional) es una señal de madurez técnica inusual en el sector.',
              'La frecuencia recomendada: 1 publicación por semana, rotando entre formatos para cubrir distintos tipos de lector.',
            ].map((note, i) => (
              <li key={i} className="flex items-start gap-2.5">
                <span className="w-1 h-1 rounded-full bg-amber flex-shrink-0 mt-1.5" />
                <span className="text-zinc-500 text-xs leading-relaxed">{note}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Footer links */}
        <div className="mt-10 pt-8 border-t border-surface-border">
          <div className="font-mono text-[10px] text-zinc-700 mb-4 uppercase tracking-wider">Referencias relacionadas</div>
          <div className="flex flex-wrap gap-4">
            <Link href="/framework/evidence" className="text-zinc-500 hover:text-zinc-300 text-xs font-mono transition-colors flex items-center gap-1">
              <span style={{ color: '#4878b0' }}>→</span> Biblioteca de evidencia operacional
            </Link>
            <Link href="/framework/operational-framework" className="text-zinc-500 hover:text-zinc-300 text-xs font-mono transition-colors flex items-center gap-1">
              <span style={{ color: '#4878b0' }}>→</span> Framework operacional de 8 etapas
            </Link>
            <Link href="/blog" className="text-zinc-500 hover:text-zinc-300 text-xs font-mono transition-colors flex items-center gap-1">
              <span style={{ color: '#4878b0' }}>→</span> Blog técnico
            </Link>
            <Link href="/casos" className="text-zinc-500 hover:text-zinc-300 text-xs font-mono transition-colors flex items-center gap-1">
              <span style={{ color: '#4878b0' }}>→</span> Narrativas de transformación
            </Link>
          </div>
        </div>

      </div>
    </div>
  )
}
