'use client'
import { useState } from 'react'

export type FaqItem = { q: string; a: string }

// Renders an interactive accordion.
// For FAQ JSON-LD, add the <script> tag in the parent RSC page — not here.
export default function FaqAccordion({ items }: { items: FaqItem[] }) {
  const [open, setOpen] = useState<number | null>(null)

  return (
    <div className="space-y-2">
      {items.map(({ q, a }, i) => (
        <div
          key={i}
          className="card overflow-hidden hover:border-zinc-600 transition-colors"
        >
          <button
            type="button"
            onClick={() => setOpen(open === i ? null : i)}
            className="w-full flex items-center justify-between px-6 py-4 text-left gap-4"
            aria-expanded={open === i}
          >
            <span className="text-noc-white font-semibold text-sm leading-snug">{q}</span>
            <svg
              viewBox="0 0 16 16"
              fill="currentColor"
              className={`w-4 h-4 flex-shrink-0 text-zinc-500 transition-transform duration-200 ${
                open === i ? 'rotate-180' : ''
              }`}
            >
              <path d="M8 10.5L3 5.5h10L8 10.5z" />
            </svg>
          </button>

          {open === i && (
            <div className="px-6 pb-5 border-t border-surface-border">
              <p className="text-zinc-500 text-sm leading-relaxed pt-4">{a}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
