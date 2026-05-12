'use client'
import { useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

const ENTRIES = [
  { company: 'Distribuidora del Norte',  city: 'Monterrey',      service: 'Diagnóstico de red',        ago: 'hace 4 min',  color: '#3b82f6' },
  { company: 'Corporativo Médico',       city: 'CDMX',           service: 'Microsoft 365 setup',       ago: 'hace 11 min', color: '#22c55e' },
  { company: 'Retail Cadena Sur',        city: 'Guadalajara',    service: 'CCTV & analítica de video',  ago: 'hace 18 min', color: '#06b6d4' },
  { company: 'Firma Legal Héctor & Asoc',city: 'Querétaro',      service: 'Intune + Entra ID',         ago: 'hace 26 min', color: '#f59e0b' },
  { company: 'Logística Pacífico',       city: 'Tijuana',        service: 'SD-WAN multi-sede',         ago: 'hace 33 min', color: '#3b82f6' },
  { company: 'Clínica Santa Fe',         city: 'León, Gto.',     service: 'Diagnóstico de seguridad',  ago: 'hace 41 min', color: '#22c55e' },
]

export default function SocialProof() {
  const [index, setIndex]     = useState(0)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    // First popup after 5s
    const first = setTimeout(() => setVisible(true), 5000)
    return () => clearTimeout(first)
  }, [])

  useEffect(() => {
    if (!visible) return
    // Show for 6s, hide for 10s, then cycle
    const hide = setTimeout(() => {
      setVisible(false)
      setTimeout(() => {
        setIndex(i => (i + 1) % ENTRIES.length)
        setVisible(true)
      }, 10000)
    }, 6000)
    return () => clearTimeout(hide)
  }, [visible, index])

  const e = ENTRIES[index]

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 16, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 8, scale: 0.97 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="fixed bottom-6 left-5 z-50 max-w-[280px]"
          style={{
            background: 'linear-gradient(145deg, rgba(20,20,20,0.97), rgba(10,10,10,0.99))',
            border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: 14,
            boxShadow: '0 8px 32px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.03)',
            backdropFilter: 'blur(12px)',
          }}
        >
          <div className="p-4">
            <div className="flex items-start gap-3">
              {/* Avatar dot */}
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 text-[11px] font-bold"
                style={{ background: e.color + '20', color: e.color }}
              >
                {e.company.slice(0, 2).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: e.color }} />
                  <span className="text-zinc-400 text-[11px] font-mono">{e.ago}</span>
                </div>
                <p className="text-zinc-200 text-xs font-semibold leading-snug">
                  {e.company}
                </p>
                <p className="text-zinc-600 text-[11px] mt-0.5">
                  {e.city} · solicitó <span className="text-zinc-400">{e.service}</span>
                </p>
              </div>
            </div>
          </div>
          {/* Bottom bar */}
          <div
            className="px-4 py-2 rounded-b-[13px] flex items-center gap-2 border-t"
            style={{ borderColor: 'rgba(255,255,255,0.05)', background: 'rgba(255,255,255,0.02)' }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-noc-green animate-pulse-fast" />
            <span className="text-[10px] font-mono text-zinc-600 tracking-wide">50+ empresas confían en Velkor</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
