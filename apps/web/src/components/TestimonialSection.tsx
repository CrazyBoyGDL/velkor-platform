import { strapi } from '@/lib/strapi'

export type Testimonial = {
  quote: string
  role: string
  company: string
  initials: string
  hex: string
}

type StrapiTestimonio = {
  id: number
  attributes: {
    quote: string
    role: string
    company: string
    initials?: string
    hex?: string
    order?: number
  }
}

const FALLBACK: Testimonial[] = [
  {
    quote:
      'Rediseñaron nuestra red y migraron 80 usuarios a Microsoft 365 en un fin de semana. Cero interrupciones, documentación entregada el lunes.',
    role: 'Director de Operaciones',
    company: 'Empresa de distribución · Monterrey',
    initials: 'DO',
    hex: '#b07828',
  },
  {
    quote:
      'Implementaron Intune y acceso condicional en 3 semanas. Ahora tenemos visibilidad total de 150 dispositivos desde un solo panel.',
    role: 'Responsable TI',
    company: 'Grupo de salud · CDMX',
    initials: 'RT',
    hex: '#3a7858',
  },
  {
    quote:
      'El sistema CCTV con analítica de video detectó un incidente antes de que llegara el equipo de seguridad. El ROI fue evidente en el primer mes.',
    role: 'Gerente General',
    company: 'Cadena de retail · Guadalajara',
    initials: 'GG',
    hex: '#3d88a5',
  },
]

async function getTestimonials(): Promise<Testimonial[]> {
  const data = await strapi.get<{ data: StrapiTestimonio[] }>(
    '/testimonios?sort=order:asc&pagination[limit]=6&publicationState=live',
    3600
  )
  if (!data?.data?.length) return FALLBACK
  return data.data.map(({ attributes: a }) => ({
    quote:    a.quote,
    role:     a.role,
    company:  a.company,
    initials: a.initials ?? a.role.slice(0, 2).toUpperCase(),
    hex:      a.hex ?? '#b07828',
  }))
}

type Props = {
  title?: string
  subtitle?: string
  limit?: number
}

export default async function TestimonialSection({
  title = 'Lo que dicen nuestros clientes',
  subtitle = 'Resultados reales con métricas documentadas.',
  limit = 3,
}: Props) {
  const testimonials = (await getTestimonials()).slice(0, limit)

  return (
    <section>
      <div className="mb-8">
        <span className="label block mb-2">Clientes</span>
        <h2 className="text-2xl font-semibold text-noc-white leading-tight">{title}</h2>
        {subtitle && <p className="text-zinc-500 text-sm mt-1">{subtitle}</p>}
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        {testimonials.map(({ quote, role, company, initials, hex }) => (
          <div key={company} className="card p-6 flex flex-col gap-4">
            <div className="text-3xl font-serif leading-none text-amber opacity-25">&ldquo;</div>
            <p className="text-zinc-400 text-sm leading-relaxed flex-1">{quote}</p>
            <div
              className="flex items-center gap-3 pt-3"
              style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}
            >
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center text-xs font-semibold flex-shrink-0"
                style={{ background: hex + '18', color: hex }}
              >
                {initials}
              </div>
              <div>
                <div className="text-zinc-300 text-sm font-semibold">{role}</div>
                <div className="text-zinc-600 text-[11px]">{company}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
