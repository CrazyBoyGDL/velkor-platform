'use client'
import Link from 'next/link'
import { useEffect } from 'react'
import {
  trackDiagramView,
  trackEvidenceClick,
  trackEvidenceDepth,
  trackTrustSignal,
} from '@/components/Analytics'

export function EvidenceRequestLink({
  href,
  title,
  category,
  status,
  children,
}: {
  href: string
  title: string
  category: string
  status: string
  children: React.ReactNode
}) {
  return (
    <Link
      href={href}
      className="text-[9.5px] font-mono text-zinc-600 hover:text-zinc-400 transition-colors"
      onClick={() => trackEvidenceClick(title, category, status)}
    >
      {children}
    </Link>
  )
}

export function DiagramTracker({ diagramId, context }: { diagramId: string; context: string }) {
  useEffect(() => {
    trackDiagramView(diagramId, context)
  }, [context, diagramId])

  return null
}

export function EvidenceLibraryTracker({
  itemCount,
  categoryCount,
}: {
  itemCount: number
  categoryCount: number
}) {
  useEffect(() => {
    trackTrustSignal('evidence-library-viewed', 'framework-evidence', 'view')
    trackEvidenceDepth('evidence-library', 'view', `${categoryCount}-categories-${itemCount}-items`)
  }, [categoryCount, itemCount])

  return null
}
