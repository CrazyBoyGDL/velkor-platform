import Link from 'next/link'

const CASES = [
  {
    client: 'Distribuidora Industrial del Norte',
    sector: 'Manufactura',
    challenge: 'Red plana sin segmentación, 3 brechas de seguridad en 6 meses.',
    solution: 'Rediseño LAN/WAN con VLANs, Fortinet FG-100F y monitoreo NOC.',
    result: '0 incidentes en 14 meses post-implementación.',
    color: 'border-noc-blue/30',
    badge: 'text-noc-blue bg-noc-blue-bg',
  },
  {
    client: 'Corporativo Médico Especialidades',
    sector: 'Salud',
    challenge: 'Sin MFA, 62 usuarios con acceso irrestricto a datos de pacientes.',
    solution: 'Entra ID + Intune + Conditional Access + DLP para datos sensibles.',
    result: 'Cumplimiento NOM-024 en 6 semanas.',
    color: 'border-noc-green/30',
    badge: 'text-noc-green bg-noc-green-bg',
  },
  {
    client: 'Cadena de Retail (8 sucursales)',
    sector: 'Retail',
    challenge: 'CCTV analógico obsoleto, cero visibilidad remota de sucursales.',
    solution: '96 cámaras IP Axis, NVR centralizado + analítica de comportamiento.',
    result: '-34% en pérdidas por robo interno en primer trimestre.',
    color: 'border-amber/30',
    badge: 'text-amber bg-amber-bg',
  },
]

export default function CasosPage() {
  return (
    <div className="min-h-screen py-16 px-4 sm:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-14">
          <span className="label">Casos de éxito</span>
          <h1 className="text-4xl sm:text-5xl font-bold text-noc-white mt-3 mb-4">
            Resultados reales
          </h1>
          <p className="text-zinc-500 max-w-xl">
            Proyectos implementados por nuestro equipo con métricas documentadas.
          </p>
        </div>

        <div className="space-y-6">
          {CASES.map(({ client, sector, challenge, solution, result, color, badge }) => (
            <div key={client} className={`noc-card ${color}`}>
              <div className="flex items-start justify-between gap-4 mb-4">
                <h3 className="text-noc-white font-semibold text-lg">{client}</h3>
                <span className={`badge ${badge}`}>{sector}</span>
              </div>
              <div className="grid sm:grid-cols-3 gap-6 text-sm">
                <div>
                  <div className="label text-[10px] mb-1">Desafío</div>
                  <p className="text-zinc-400 leading-relaxed">{challenge}</p>
                </div>
                <div>
                  <div className="label text-[10px] mb-1">Solución</div>
                  <p className="text-zinc-400 leading-relaxed">{solution}</p>
                </div>
                <div>
                  <div className="label text-[10px] mb-1">Resultado</div>
                  <p className="text-noc-white font-medium leading-relaxed">{result}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-14 text-center">
          <Link href="/assessments" className="btn-amber px-10 py-4 text-[15px]">
            Quiero resultados similares →
          </Link>
        </div>
      </div>
    </div>
  )
}
