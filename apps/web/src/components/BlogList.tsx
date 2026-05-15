'use client'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { reveal as fadeUp } from '@/lib/motion'
import type { DownloadableArtifact, EngagementType, MaturityLevel, TechnicalCategory, TechnicalLevel } from '@/lib/contentEngine'

export type BlogPost = {
  slug: string
  title: string
  excerpt: string
  category: string
  date: string
  readTime: string
  hex: string
  tags?: string[]
  technicalCategory?: TechnicalCategory | string
  technicalLevel?: TechnicalLevel | string
  operationalTags?: string[]
  maturityLevel?: MaturityLevel | string
  engagementType?: EngagementType | string
  relatedEvidence?: string[]
  relatedCases?: string[]
  relatedFrameworks?: string[]
  downloadableArtifact?: DownloadableArtifact | null
  governanceNotes?: string | null
  architectureRef?: string | null
}

const LEVEL_LABEL: Record<string, string> = {
  executive: 'Ejecutivo',
  technical: 'Técnico',
  architecture: 'Arquitectura',
  governance: 'Gobernanza',
}

const CATEGORY_LABEL: Record<string, string> = {
  'identity-governance': 'Identidad',
  'network-infrastructure': 'Red',
  'endpoint-management': 'Endpoints',
  'security-operations': 'SecOps',
  'continuity-resilience': 'Continuidad',
  'cloud-modernization': 'Cloud',
  'video-operations': 'Video',
}

function displayTags(post: BlogPost): string[] {
  const tags = post.operationalTags?.length ? post.operationalTags : post.tags
  return tags?.filter(Boolean) ?? []
}

function MetadataStrip({ post, compact = false }: { post: BlogPost; compact?: boolean }) {
  const items = [
    post.technicalCategory ? CATEGORY_LABEL[post.technicalCategory] ?? post.technicalCategory : null,
    post.technicalLevel ? LEVEL_LABEL[post.technicalLevel] ?? post.technicalLevel : null,
    post.maturityLevel ? `Madurez ${post.maturityLevel}` : null,
    post.engagementType ? post.engagementType : null,
  ].filter((item): item is string => Boolean(item))

  if (!items.length && !post.downloadableArtifact) return null

  return (
    <div className={`flex flex-wrap items-center gap-2 ${compact ? 'mb-3' : 'mb-4'}`}>
      {items.slice(0, compact ? 2 : 4).map(item => (
        <span key={item} className="font-mono text-[9px] text-zinc-700 px-2 py-0.5 rounded" style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.05)' }}>
          {item}
        </span>
      ))}
      {post.downloadableArtifact && (
        <span className="font-mono text-[9px] text-[#3a7858] px-2 py-0.5 rounded" style={{ background: 'rgba(58,120,88,0.08)', border: '1px solid rgba(58,120,88,0.18)' }}>
          Artefacto {post.downloadableArtifact.gated ? 'bajo NDA' : 'disponible'}
        </span>
      )}
    </div>
  )
}

export default function BlogList({ posts }: { posts: BlogPost[] }) {
  const [featured, ...rest] = posts

  if (!featured) return (
    <p className="text-zinc-600 text-sm text-center py-12">No hay artículos publicados aún.</p>
  )

  return (
    <>
      <Link href={`/blog/${featured.slug}`} className="block group mb-6">
        <motion.article
          {...fadeUp(0.08)}
          className="card p-0 overflow-hidden hover:border-zinc-700 transition-all duration-300 cursor-pointer"
          style={{ borderLeftColor: featured.hex, borderLeftWidth: 3 }}
        >
          <div className="p-8">
            <div className="flex items-center gap-3 mb-5">
              <span className="badge text-[10px]" style={{ color: featured.hex, backgroundColor: featured.hex + '20' }}>
                {featured.category}
              </span>
              <span className="label text-[10px] text-zinc-700">ARTÍCULO DESTACADO</span>
            </div>
            <h2 className="text-noc-white font-black text-2xl sm:text-3xl mb-4 leading-tight group-hover:text-amber transition-colors">
              {featured.title}
            </h2>
            <p className="text-zinc-400 text-base leading-relaxed mb-4 max-w-2xl">
              {featured.excerpt}
            </p>
            {displayTags(featured).length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-4">
                {displayTags(featured).slice(0, 4).map(tag => (
                  <span key={tag} className="font-mono text-[10px] text-zinc-600 border border-zinc-800 px-2 py-0.5 rounded">
                    {tag}
                  </span>
                ))}
              </div>
            )}
            <MetadataStrip post={featured} />
            {featured.architectureRef && (
              <div className="mb-4">
                <span className="text-zinc-600 text-[11px] font-mono">
                  <span style={{ color: featured.hex }}>→</span> Referencia de arquitectura vinculada
                </span>
              </div>
            )}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 text-zinc-600 text-xs font-mono">
                <span>{featured.date}</span>
                <span>·</span>
                <span>{featured.readTime} de lectura</span>
              </div>
              <span className="text-[11px] font-mono opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: featured.hex }}>
                LEER ARTÍCULO →
              </span>
            </div>
          </div>
        </motion.article>
      </Link>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
        {rest.map((post, i) => {
          const { slug, title, excerpt, category, date, readTime, hex, architectureRef } = post
          const tags = displayTags(post)

          return (
          <Link key={slug} href={`/blog/${slug}`} className="group">
            <motion.article
              {...fadeUp(i * 0.010)}
              className="card p-5 hover:border-zinc-700 transition-all duration-300 cursor-pointer flex flex-col h-full"
              style={{ borderTopColor: hex, borderTopWidth: 2 }}
            >
              <div className="flex items-center justify-between mb-4">
                <span className="badge text-[10px]" style={{ color: hex, backgroundColor: hex + '20' }}>
                  {category}
                </span>
                <span className="text-zinc-700 text-[10px] font-mono">{readTime}</span>
              </div>
              <h2 className="text-noc-white font-semibold text-[15px] mb-2 leading-snug group-hover:text-white transition-colors flex-1">
                {title}
              </h2>
              <p className="text-zinc-600 text-xs leading-relaxed mb-3">
                {excerpt.slice(0, 100)}…
              </p>
              <MetadataStrip post={post} compact />
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-3">
                  {tags.slice(0, 3).map(tag => (
                    <span key={tag} className="font-mono text-[9px] text-zinc-700 border border-zinc-800 px-1.5 py-0.5 rounded">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
              {architectureRef && (
                <div className="mb-2">
                  <span className="text-zinc-700 text-[10px] font-mono">
                    <span style={{ color: hex }}>→</span> Referencia técnica vinculada
                  </span>
                </div>
              )}
              <div className="flex items-center justify-between mt-auto pt-3 border-t border-surface-border">
                <span className="text-zinc-700 text-[10px] font-mono">{date}</span>
                <span className="text-[10px] font-mono opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: hex }}>
                  LEER →
                </span>
              </div>
            </motion.article>
          </Link>
          )
        })}
      </div>
    </>
  )
}
