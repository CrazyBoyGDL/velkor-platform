import type { Metadata } from 'next'
import Link from 'next/link'
import RecursoGate from '@/components/RecursoGate'

export const metadata: Metadata = {
  title: 'Guía Hardening Fortinet FortiGate | Recurso Gratuito',
  description:
    'Configuraciones esenciales para asegurar tu FortiGate: acceso administrativo, IPS, logging, VLAN y SSL inspection. Guía técnica para ingenieros de red. Descarga gratuita.',
  alternates: { canonical: 'https://velkor.mx/recursos/fortinet-hardening' },
  openGraph: {
    title: 'Guía de Hardening Fortinet FortiGate | Velkor',
    description: 'Securiza tu FortiGate con esta guía técnica. Acceso administrativo, IPS, VLAN y más.',
  },
}

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: '¿Qué es el hardening de un firewall?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'El hardening es el proceso de reducir la superficie de ataque de un dispositivo deshabilitando servicios innecesarios, aplicando configuraciones seguras por defecto y siguiendo mejores prácticas del fabricante. Para Fortinet, esto incluye desactivar HTTP administrativo, configurar HTTPS/SSH solo, y asegurar el acceso de gestión.',
      },
    },
    {
      '@type': 'Question',
      name: '¿Con qué frecuencia debo actualizar el firmware de FortiGate?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Fortinet recomienda actualizar a versiones GA (General Availability) cada 6 meses y aplicar parches críticos de seguridad dentro de las 72 horas de publicación. Siempre prueba en entorno de staging antes de producción y mantén un snapshot del estado previo.',
      },
    },
    {
      '@type': 'Question',
      name: '¿Qué es SSL Inspection y por qué es importante?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'SSL Inspection (o deep packet inspection) permite al FortiGate descifrar, inspeccionar y re-cifrar el tráfico HTTPS. Sin ella, el 80%+ del tráfico web pasa sin análisis. Es crítica para detectar malware que usa HTTPS para evadir detección.',
      },
    },
  ],
}

const CONTENT = {
  slug: 'fortinet-hardening',
  hex: '#3b82f6',
  title: 'Guía de Hardening: Fortinet FortiGate',
  description:
    'Configuraciones esenciales de seguridad para FortiGate en entornos empresariales: desde el acceso administrativo hasta la segmentación por VLAN y el logging hacia SIEM.',
  includes: [
    'Hardening de acceso administrativo',
    'Gestión de firmware y actualizaciones',
    'Políticas de firewall recomendadas',
    'Configuración de IPS/IDS',
    'Logging y envío a SIEM',
    'Checklist de segmentación VLAN',
  ],
  content: [
    {
      title: '01 — Acceso administrativo',
      items: [
        'Deshabilitar HTTP para administración (usar solo HTTPS)',
        'Deshabilitar Telnet; habilitar SSH con versión SSHv2 únicamente',
        'Crear cuentas administrativas individuales — nunca compartir "admin"',
        'Configurar timeout de sesión administrativa: máximo 10 minutos',
        'Restringir trusted hosts a IPs de gestión conocidas por interfaz',
        'Habilitar autenticación de dos factores para acceso administrativo',
        'Registrar todos los accesos de administración en FortiAnalyzer o syslog',
      ],
    },
    {
      title: '02 — Gestión de firmware',
      items: [
        'Verificar versión actual y comparar con FortiGuard latest GA release',
        'Programar ventana de mantenimiento mensual para revisión de firmware',
        'Crear backup completo de configuración antes de cada actualización',
        'Revisar FortiGuard Security Advisories semanalmente',
        'Aplicar parches de severidad crítica (CVSS ≥ 9.0) en menos de 72 horas',
        'Documentar historial de versiones y cambios de configuración',
      ],
    },
    {
      title: '03 — Políticas de firewall',
      items: [
        'Principio de mínimo privilegio: denegar todo por defecto, permitir explícitamente',
        'Habilitar Application Control en todas las políticas de salida a internet',
        'Activar AntiVirus en tráfico web (HTTP/HTTPS) y correo (SMTP/IMAP)',
        'Configurar Web Filter con categorías de riesgo bloqueadas (malware, phishing, P2P)',
        'Revisar y documentar todas las reglas "any any permit" — eliminar o justificar',
        'Programar revisión trimestral de reglas: eliminar reglas sin hits en 90 días',
      ],
    },
    {
      title: '04 — IPS / IDS',
      items: [
        'Aplicar perfil IPS en todas las políticas con tráfico externo o inter-VLAN',
        'Configurar actualización automática de firmas IPS cada 24 horas',
        'Establecer acción "Block" para firmas de severidad crítica y alta',
        'Habilitar detección de botnets y C&C (Command & Control)',
        'Configurar alertas de IPS hacia SOC o responsable de seguridad',
        'Revisar top 10 hits de IPS semanalmente para identificar patrones',
      ],
    },
    {
      title: '05 — Logging y SIEM',
      items: [
        'Habilitar logging en todas las políticas: tráfico permitido Y denegado',
        'Configurar envío de logs a servidor syslog/SIEM en tiempo real',
        'Asegurar que los logs incluyen: IP origen, destino, usuario, aplicación, acción',
        'Configurar retención de logs local mínima de 90 días',
        'Crear alertas para: intentos de login fallidos, IPS críticos, cambios de config',
        'Verificar sincronización de tiempo (NTP) — logs con timestamp correcto son críticos',
      ],
    },
    {
      title: '06 — Segmentación VLAN',
      items: [
        'Separar VLANs por función: Usuarios, Servidores, IoT/CCTV, Impresoras, Invitados',
        'Configurar inter-VLAN routing explícitamente — nunca allow all entre VLANs',
        'Crear política de firewall específica por cada flujo inter-VLAN necesario',
        'Aislar VLAN de Invitados: acceso solo a internet, sin acceso a red interna',
        'Configurar FortiSwitch (si aplica) con port security por perfil de VLAN',
        'Documentar diagrama de red con VLANs, rangos IP y políticas de acceso',
      ],
    },
  ],
}

export default function FortinetHardeningPage() {
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
            <span className="badge text-[10px] font-mono" style={{ color: '#3b82f6', backgroundColor: '#3b82f618' }}>
              REDES & CIBERSEGURIDAD
            </span>
            <span className="text-zinc-700 text-[10px] font-mono">12 min · NSE4 verified</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-noc-white leading-tight mb-4">
            {CONTENT.title}
          </h1>
          <p className="text-zinc-400 text-base leading-relaxed max-w-2xl">
            Configuraciones revisadas por ingenieros Fortinet NSE4 con proyectos activos en producción. Cubre desde el acceso de gestión hasta la segmentación por VLAN.
          </p>
        </div>

        <RecursoGate {...CONTENT} ctaLabel="Acceder a la guía gratuitamente" />

        {/* Bottom CTA */}
        <div className="mt-16 card p-8 text-center border-amber/20">
          <p className="text-zinc-400 text-sm mb-4">
            ¿Quieres que auditemos tu FortiGate actual?
          </p>
          <Link href="/servicios/ciberseguridad" className="btn-amber px-8 py-3">
            Ver servicio de ciberseguridad →
          </Link>
        </div>
      </div>
    </div>
  )
}
