import Link from 'next/link'

const TEAM = [
  { name: 'Equipo NOC', role: 'Operaciones 24/7', color: '#3b82f6' },
  { name: 'Ing. Redes',  role: 'Infraestructura',   color: '#22c55e' },
  { name: 'Especialistas M365', role: 'Cloud & Identity', color: '#f59e0b' },
]

const VALUES = [
  { icon: '⚡', title: 'Respuesta inmediata', desc: 'SLA < 4h para incidentes críticos. NOC activo las 24 horas.' },
  { icon: '🔒', title: 'Seguridad por diseño', desc: 'Cada implementación sigue el principio de least privilege y Zero Trust.' },
  { icon: '📊', title: 'Transparencia total', desc: 'Dashboards en tiempo real y reportes mensuales con métricas documentadas.' },
  { icon: '🎯', title: 'Resultados medibles', desc: 'Comprometemos KPIs antes de firmar. Sin excusas, sin letra pequeña.' },
]

export default function NosotrosPage() {
  return (
    <div className="min-h-screen py-16 px-4 sm:px-8">
      <div className="max-w-4xl mx-auto">

        <div className="mb-14">
          <span className="label">Quiénes somos</span>
          <h1 className="text-4xl sm:text-5xl font-bold text-noc-white mt-3 mb-6">
            El equipo detrás<br />del NOC
          </h1>
          <p className="text-zinc-400 text-lg leading-relaxed max-w-2xl">
            Desde 2018 operamos como el departamento de IT externo para más de 50 empresas en la región. Combinamos expertise técnico certificado con respuesta operacional real.
          </p>
        </div>

        {/* Values */}
        <div className="grid sm:grid-cols-2 gap-4 mb-16">
          {VALUES.map(({ icon, title, desc }) => (
            <div key={title} className="noc-card">
              <div className="text-2xl mb-3">{icon}</div>
              <h3 className="text-noc-white font-semibold mb-2">{title}</h3>
              <p className="text-zinc-500 text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>

        {/* Team areas */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-noc-white mb-6">Áreas especializadas</h2>
          <div className="flex flex-col sm:flex-row gap-4">
            {TEAM.map(({ name, role, color }) => (
              <div key={name} className="noc-card flex items-center gap-3 flex-1">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: color + '20', color }}>
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
                </div>
                <div>
                  <div className="text-noc-white font-semibold text-sm">{name}</div>
                  <div className="text-zinc-600 text-xs">{role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center border-t border-surface-border pt-12">
          <h3 className="text-2xl font-bold text-noc-white mb-3">¿Listo para trabajar juntos?</h3>
          <p className="text-zinc-500 mb-6">Empieza con un diagnóstico gratuito de tu infraestructura.</p>
          <Link href="/assessments" className="btn-amber px-10 py-4 text-[15px]">
            Solicitar diagnóstico →
          </Link>
        </div>
      </div>
    </div>
  )
}
