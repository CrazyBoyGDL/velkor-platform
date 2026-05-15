import type { Metadata } from 'next'
import { strapi } from '@/lib/strapi'
import { architectureReferenceHref, asDownloadableArtifacts, asStringArray } from '@/lib/contentEngine'
import BlogList, { type BlogPost } from '@/components/BlogList'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Inteligencia Operacional | Briefs Técnicos — Velkor System',
  description: 'Briefs técnicos sobre decisiones de arquitectura, errores de implementación y gobernanza operacional en infraestructura empresarial.',
  alternates: { canonical: 'https://velkor.mx/blog' },
  openGraph: {
    title: 'Inteligencia Operacional | Velkor System',
    description: 'Briefs técnicos sobre arquitectura, implementación y gobernanza operacional.',
  },
}

const FALLBACK_POSTS: BlogPost[] = [
  {
    slug: 'conditional-access-failures-hybrid-smb',
    title: 'Por qué falla el Acceso Condicional en entornos híbridos SMB',
    excerpt: 'Los errores más comunes en CA no son de configuración — son de diseño. Cómo los entornos con AD sincronizado y dispositivos no enrolled producen exclusiones que anulan las políticas.',
    category: 'Identidad & Acceso',
    date: '8 May 2026',
    readTime: '9 min',
    hex: '#4878b0',
    tags: ['Entra ID', 'Acceso Condicional', 'Intune', 'Híbrido'],
    architectureRef: '/framework/evidence',
  },
  {
    slug: 'shared-accounts-operational-security-risk',
    title: 'Por qué las cuentas compartidas siguen destruyendo la seguridad operacional',
    excerpt: 'No es un problema de contraseñas — es un problema de identidad. Por qué las cuentas compartidas persisten en las organizaciones y qué hay que rediseñar para eliminarlas sin interrumpir operaciones.',
    category: 'Gobernanza',
    date: '1 May 2026',
    readTime: '7 min',
    hex: '#b07828',
    tags: ['PIM', 'Identidad', 'Gobernanza', 'Privilegios'],
    architectureRef: '/framework/evidence',
  },
  {
    slug: 'intune-deployment-pitfalls-distributed-orgs',
    title: 'Errores de despliegue de Intune en organizaciones distribuidas',
    excerpt: 'Dispositivos no enrolled que acceden a correo. Políticas que se aplican a grupos equivocados. Conflictos de perfil entre sedes. Lecciones de campo en entornos de 3+ ubicaciones.',
    category: 'Gestión de dispositivos',
    date: '22 Abr 2026',
    readTime: '11 min',
    hex: '#3a7858',
    tags: ['Intune', 'MDM', 'Distribución', 'Entra ID'],
    architectureRef: '/framework/evidence',
  },
  {
    slug: 'minimum-viable-segmentation-retail',
    title: 'Segmentación mínima viable para redes de retail',
    excerpt: 'No toda red necesita 12 VLANs. La segmentación que importa en retail: aislar POS, separar cámaras, contener el Wi-Fi de clientes. Sin sobrediseño, con impacto real.',
    category: 'Infraestructura',
    date: '15 Abr 2026',
    readTime: '8 min',
    hex: '#3d88a5',
    tags: ['VLAN', 'FortiGate', 'Retail', 'Segmentación'],
    architectureRef: '/framework/evidence',
  },
  {
    slug: 'operational-risks-unmanaged-onboarding',
    title: 'Riesgos operacionales de los procesos de onboarding no gestionados',
    excerpt: 'Un empleado nuevo con acceso excesivo el día 1. Un ex-empleado con acceso activo el día 31. Sin proceso de onboarding/offboarding documentado, la superficie de ataque crece con cada contratación.',
    category: 'Gobernanza',
    date: '8 Abr 2026',
    readTime: '6 min',
    hex: '#b07828',
    tags: ['Onboarding', 'Ciclo de vida', 'Identidad', 'Gobernanza'],
    architectureRef: null,
  },
  {
    slug: 'm365-governance-modernization-mistakes',
    title: 'Errores de gobernanza durante la modernización a Microsoft 365',
    excerpt: 'Las organizaciones que migran a M365 tienden a replicar sus malas prácticas de AD en la nube. Sin revisión de licencias, sin grupos limpios, sin políticas de CA — solo las aplicaciones cambian.',
    category: 'Cloud',
    date: '1 Abr 2026',
    readTime: '10 min',
    hex: '#4878b0',
    tags: ['Microsoft 365', 'Migración', 'Gobernanza', 'Entra ID'],
    architectureRef: '/framework/evidence',
  },
]

type StrapiPost = {
  id: number
  attributes: {
    slug: string
    title: string
    excerpt: string
    category: string
    publishedAt: string
    readTime: string
    hex: string
    technicalCategory?: string
    technicalLevel?: string
    operationalTags?: unknown
    maturityLevel?: string
    engagementType?: string
    relatedEvidence?: unknown
    relatedCases?: unknown
    relatedFrameworks?: unknown
    downloadableArtifact?: unknown
    downloadableArtifacts?: unknown
    architectureDiagram?: unknown
    governanceNotes?: string
  }
}

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString('es-MX', { day: 'numeric', month: 'short', year: 'numeric' })
  } catch {
    return iso
  }
}

async function getPosts(): Promise<BlogPost[]> {
  const data = await strapi.get<{ data: StrapiPost[] }>('/posts?sort=publishedAt:desc&pagination[limit]=20')
  if (!data?.data?.length) return FALLBACK_POSTS

  return data.data.map(({ attributes: a }) => ({
    slug: a.slug,
    title: a.title,
    excerpt: a.excerpt ?? '',
    category: a.category,
    date: formatDate(a.publishedAt),
    readTime: a.readTime ?? '',
    hex: a.hex ?? '#b07828',
    technicalCategory: a.technicalCategory,
    technicalLevel: a.technicalLevel,
    operationalTags: asStringArray(a.operationalTags),
    maturityLevel: a.maturityLevel,
    engagementType: a.engagementType,
    relatedEvidence: asStringArray(a.relatedEvidence),
    relatedCases: asStringArray(a.relatedCases),
    relatedFrameworks: asStringArray(a.relatedFrameworks),
    downloadableArtifact: asDownloadableArtifacts(a.downloadableArtifact, a.downloadableArtifacts)[0] ?? null,
    architectureRef: architectureReferenceHref(a.architectureDiagram),
    governanceNotes: a.governanceNotes ?? null,
  }))
}

export default async function BlogPage() {
  const posts = await getPosts()

  return (
    <div className="min-h-screen py-16 px-4 sm:px-8">
      <div className="max-w-5xl mx-auto">

        <div className="mb-12">
          <span className="label">Conocimiento técnico</span>
          <h1 className="text-4xl sm:text-5xl font-black text-noc-white mt-3 mb-4">
            Inteligencia operacional
          </h1>
          <p className="text-zinc-500 max-w-xl leading-relaxed">
            Briefs de campo: decisión, riesgo y señal operacional. Lectura rápida; profundidad cuando hace falta.
          </p>
        </div>

        <BlogList posts={posts} />

        <div className="text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full border border-surface-border bg-surface-card">
            <span className="w-1.5 h-1.5 rounded-full bg-amber animate-pulse-slow" />
            <span className="text-zinc-600 text-xs font-mono">
              Briefs seleccionados · profundidad bajo contexto
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
