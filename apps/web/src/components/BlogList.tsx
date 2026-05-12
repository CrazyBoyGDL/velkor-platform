'use client'
import { motion } from 'framer-motion'

export type BlogPost = {
  slug: string
  title: string
  excerpt: string
  category: string
  date: string
  readTime: string
  hex: string
}

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.5, ease: 'easeOut', delay },
})

export default function BlogList({ posts }: { posts: BlogPost[] }) {
  const [featured, ...rest] = posts

  if (!featured) return (
    <p className="text-zinc-600 text-sm text-center py-12">No hay artículos publicados aún.</p>
  )

  return (
    <>
      <motion.article
        {...fadeUp(0.08)}
        className="card p-0 overflow-hidden mb-6 hover:border-zinc-700 transition-all duration-300 cursor-pointer group"
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
          <p className="text-zinc-400 text-base leading-relaxed mb-6 max-w-2xl">
            {featured.excerpt}
          </p>
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

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
        {rest.map(({ slug, title, excerpt, category, date, readTime, hex }, i) => (
          <motion.article
            key={slug}
            {...fadeUp(i * 0.06 + 0.15)}
            className="card p-5 hover:border-zinc-700 transition-all duration-300 cursor-pointer group flex flex-col"
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
            <p className="text-zinc-600 text-xs leading-relaxed mb-4">
              {excerpt.slice(0, 100)}…
            </p>
            <div className="flex items-center justify-between mt-auto pt-3 border-t border-surface-border">
              <span className="text-zinc-700 text-[10px] font-mono">{date}</span>
              <span className="text-[10px] font-mono opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: hex }}>
                LEER →
              </span>
            </div>
          </motion.article>
        ))}
      </div>
    </>
  )
}
