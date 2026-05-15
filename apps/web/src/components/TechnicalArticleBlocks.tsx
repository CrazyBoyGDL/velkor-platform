import Link from 'next/link'
import type { TechnicalArticleBlock } from '@/lib/contentEngine'

const BLOCK_STYLE: Record<TechnicalArticleBlock['type'], { label: string; color: string }> = {
  'architecture-callout':     { label: 'ARQUITECTURA', color: '#4878b0' },
  'operational-warning':      { label: 'RIESGO OPERACIONAL', color: '#b07828' },
  'governance-insight':       { label: 'GOBERNANZA', color: '#3a7858' },
  'evidence-reference':       { label: 'EVIDENCIA', color: '#3d88a5' },
  'rollout-consideration':    { label: 'ROLLOUT', color: '#7a7050' },
}

function blockHref(block: TechnicalArticleBlock): string | null {
  if (block.href) return block.href
  if (block.evidenceId) return `/framework/evidence#${block.evidenceId}`
  return null
}

function EvidenceLink({ block, color }: { block: TechnicalArticleBlock; color: string }) {
  const href = blockHref(block)
  if (!href) return null

  const className = 'inline-flex items-center gap-1 text-[10px] font-mono mt-3 transition-colors'
  const label = block.evidenceId ? `Evidencia: ${block.evidenceId}` : 'Referencia tecnica'

  if (href.startsWith('/')) {
    return <Link href={href} className={className} style={{ color }}>{label} {'->'}</Link>
  }

  return <a href={href} target="_blank" rel="noreferrer" className={className} style={{ color }}>{label} {'->'}</a>
}

export default function TechnicalArticleBlocks({ blocks }: { blocks: TechnicalArticleBlock[] }) {
  if (!blocks.length) return null

  return (
    <div className="my-10 space-y-4">
      {blocks.map((block, index) => {
        const style = BLOCK_STYLE[block.type]
        return (
          <section
            key={`${block.type}-${block.title}-${index}`}
            className="technical-article-block p-5"
            style={{ borderLeftColor: style.color }}
          >
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="text-[9px] font-mono uppercase tracking-[0.16em]" style={{ color: style.color }}>
                {style.label}
              </span>
              {block.owner && <span className="text-[9px] font-mono text-zinc-700">Owner: {block.owner}</span>}
              {block.severity && <span className="text-[9px] font-mono text-zinc-700">Severidad: {block.severity}</span>}
            </div>

            <h2 className="text-zinc-200 font-bold text-base leading-snug mb-2">{block.title}</h2>
            {block.body && <p className="text-zinc-500 text-sm leading-relaxed">{block.body}</p>}

            {block.items?.length ? (
              <ul className="mt-3 space-y-2">
                {block.items.map(item => (
                  <li key={item} className="flex items-start gap-2 text-[12px] leading-relaxed text-zinc-500">
                    <span className="font-mono text-[10px] mt-0.5" style={{ color: style.color }}>•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            ) : null}

            <EvidenceLink block={block} color={style.color} />
          </section>
        )
      })}
    </div>
  )
}
