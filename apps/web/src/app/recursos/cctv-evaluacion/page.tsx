import type { Metadata } from 'next'
import Link from 'next/link'
import RecursoGate from '@/components/RecursoGate'

export const metadata: Metadata = {
  title: 'Guía Evaluación Sistema CCTV IP Empresarial | Recurso Gratuito',
  description:
    'Criterios técnicos para evaluar, dimensionar e instalar sistemas de videovigilancia IP: cámaras Axis/Hikvision, NVR, PoE+ y analítica con IA. Guía gratuita para empresas.',
  alternates: { canonical: 'https://velkor.mx/recursos/cctv-evaluacion' },
  openGraph: {
    title: 'Guía CCTV IP Empresarial | Evaluación y Dimensionamiento | Velkor',
    description: 'Evalúa y dimensiona tu sistema CCTV IP con esta guía técnica gratuita.',
  },
}

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: '¿Cuántas cámaras necesita mi empresa?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Depende del tipo de instalación: oficinas medianas requieren 1 cámara por 15–25 m² de área crítica (entradas, salas de servidores, cajas). Almacenes y plantas necesitan cobertura perimetral exterior y puntos ciegos identificados en el relevamiento técnico.',
      },
    },
    {
      '@type': 'Question',
      name: '¿Cuánto almacenamiento NVR necesito?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Para 16 cámaras a 4MP con grabación continua a 15fps (H.265+), se requieren aproximadamente 8 TB para 30 días de retención. Para 60 días, 16 TB. Usa la fórmula: (bitrate_por_camara × num_camaras × segundos_retencion) / 8 / 1024³ = TB.',
      },
    },
    {
      '@type': 'Question',
      name: '¿Axis o Hikvision para uso empresarial?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Axis es la opción premium para entornos regulados, edge computing y analítica avanzada (Axis Camera Application Platform). Hikvision ofrece mejor relación costo-beneficio para implementaciones estándar. Ambas soportan ONVIF y son de calidad profesional.',
      },
    },
  ],
}

const CONTENT = {
  slug: 'cctv-evaluacion',
  hex: '#06b6d4',
  title: 'Guía de evaluación: Sistema CCTV IP empresarial',
  description:
    'Criterios técnicos para evaluar, dimensionar y especificar correctamente un sistema de videovigilancia IP empresarial: desde el relevamiento hasta la integración con sistemas de acceso.',
  includes: [
    'Checklist de relevamiento técnico de sitio',
    'Criterios de selección de cámaras IP',
    'Calculadora de almacenamiento NVR',
    'Requerimientos de red y PoE+',
    'Comparativa Axis vs Hikvision',
    'Integración con control de acceso y alarmas',
  ],
  content: [
    {
      title: '01 — Relevamiento de sitio',
      items: [
        'Identificar todos los puntos de entrada y salida del edificio o instalación',
        'Mapear áreas de alto riesgo: cajas, servidores, almacenes, estacionamientos',
        'Documentar condiciones de iluminación por punto: diurna, nocturna, contraluz',
        'Medir distancias de cobertura requeridas por punto (short range, mid, long)',
        'Identificar obstáculos: columnas, vegetación, equipos que limiten campo visual',
        'Verificar disponibilidad de energía (220V/110V) y capacidad de cableado',
      ],
    },
    {
      title: '02 — Selección de cámaras',
      items: [
        'Resolución mínima para identificación facial: 2MP a distancias hasta 5m',
        'Uso exterior: cámaras con certificación IP66 (polvo y lluvia) e IK10 (impacto)',
        'Áreas con luz variable: WDR (Wide Dynamic Range) ≥ 120dB recomendado',
        'Visión nocturna: IR integrado (hasta 30m) o Starlight para áreas sin iluminación',
        'Estacionamientos y perímetros: cámaras tipo bullet o panorámicas 180/360°',
        'Áreas interiores de alta densidad: domo varifocal para ajuste post-instalación',
      ],
    },
    {
      title: '03 — Dimensionamiento de almacenamiento',
      items: [
        'Definir retención requerida: 30 días mínimo para retail, 60–90 para regulado',
        'Estimar bitrate por cámara: 2MP H.265 ≈ 1-2 Mbps; 4MP ≈ 2-4 Mbps',
        'Fórmula básica: TB = (bitrate_Mbps × num_cámaras × días × 86400) / 8 / 1,000,000',
        'Agregar 20% de overhead para metadatos y analítica',
        'Configurar RAID 5 o 6 en NVR para redundancia (mínimo para sistemas críticos)',
        'Considerar almacenamiento en nube como backup secundario para archivos críticos',
      ],
    },
    {
      title: '04 — Infraestructura de red',
      items: [
        'Calcular consumo PoE: cámaras estándar 7-10W; PTZ o con calefacción hasta 30W',
        'Switches PoE+ (802.3at) mínimo; switches PoE++ (802.3bt) para cámaras de alto consumo',
        'Ancho de banda de red: reservar el doble del bitrate total calculado para picos',
        'VLAN dedicada para cámaras separada de la red de usuarios (seguridad y QoS)',
        'Límite de cable Cat6: 100m. Usar switches intermedios o fibra para distancias mayores',
        'Firewall: bloquear acceso desde VLAN CCTV hacia otras redes — solo acceso al NVR',
      ],
    },
    {
      title: '05 — NVR y VMS',
      items: [
        'Dimensionar NVR: mínimo 25% de capacidad de canal libre para expansión futura',
        'VMS para multi-sede: Milestone XProtect, Genetec o Hikvision iVMS para ≥ 3 sedes',
        'Configurar grabación continua + detección de movimiento como trigger secundario',
        'Habilitar analítica de comportamiento: detección de intrusos, zona de exclusión',
        'Configurar retención diferenciada: más días para entradas principales, menos para pasillos',
        'Backup de configuración NVR semanal y prueba de restauración mensual',
      ],
    },
    {
      title: '06 — Integración y validación',
      items: [
        'Integración con control de acceso: correlacionar evento de tarjeta con imagen de cámara',
        'Configurar alertas: movimiento fuera de horario, zona restringida, cámara desconectada',
        'App móvil: configurar acceso RTSP o cliente VMS para revisión remota',
        'Prueba de cobertura: capturar imagen de personas a la distancia de detección definida',
        'Prueba nocturna: verificar visión IR o Starlight en condiciones reales de iluminación',
        'Entrega de plano as-built: ubicación de cámaras, IPs, ángulos y configuración NVR',
      ],
    },
  ],
}

export default function CctvEvaluacionPage() {
  return (
    <div className="min-h-screen py-16 px-4 sm:px-8">
      <div className="max-w-5xl mx-auto">

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />

        {/* Breadcrumb */}
        <Link
          href="/recursos"
          className="inline-flex items-center gap-2 text-zinc-600 text-xs font-mono hover:text-zinc-400 transition-colors mb-10"
        >
          <svg viewBox="0 0 16 16" fill="currentColor" className="w-3 h-3">
            <path d="M3.828 7H14a1 1 0 110 2H3.828l2.829 2.828a1 1 0 11-1.414 1.414L1 9l-.707-.707L1 7.586 5.243 3.343A1 1 0 016.657 4.757L3.828 7z" />
          </svg>
          Recursos
        </Link>

        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <span className="badge text-[10px] font-mono" style={{ color: '#06b6d4', backgroundColor: '#06b6d418' }}>
              VIDEOVIGILANCIA IP
            </span>
            <span className="text-zinc-700 text-[10px] font-mono">8 min · ACSR verified</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-noc-white leading-tight mb-4">
            {CONTENT.title}
          </h1>
          <p className="text-zinc-400 text-base leading-relaxed max-w-2xl">
            Guía técnica para evaluar, dimensionar e instalar correctamente un sistema CCTV IP profesional. Creada por ingenieros certificados Axis ACSR con proyectos en retail, salud y manufactura.
          </p>
        </div>

        <RecursoGate {...CONTENT} ctaLabel="Acceder a la guía gratuitamente" />

        {/* Bottom CTA */}
        <div className="mt-16 card p-8 text-center border-amber/20">
          <p className="text-zinc-400 text-sm mb-4">
            ¿Prefieres un relevamiento técnico de tu instalación?
          </p>
          <Link href="/servicios/videovigilancia" className="btn-amber px-8 py-3">
            Ver servicio de videovigilancia →
          </Link>
        </div>
      </div>
    </div>
  )
}
