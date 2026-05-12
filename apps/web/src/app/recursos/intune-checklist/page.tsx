import type { Metadata } from 'next'
import Link from 'next/link'
import RecursoGate from '@/components/RecursoGate'

export const metadata: Metadata = {
  title: 'Checklist Implementación Microsoft Intune | Recurso Gratuito',
  description:
    'Lista de verificación de 30+ puntos para implementar Microsoft Intune: licencias, políticas de cumplimiento, Autopilot, MFA y Acceso Condicional. Descarga gratuita.',
  alternates: { canonical: 'https://velkor.mx/recursos/intune-checklist' },
  openGraph: {
    title: 'Checklist Intune: 30+ puntos de verificación | Velkor',
    description: 'Implementa Microsoft Intune correctamente con este checklist técnico. Gratis.',
  },
}

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: '¿Qué licencias necesito para implementar Intune?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Microsoft Intune está incluido en Microsoft 365 Business Premium, E3 y E5. También se puede adquirir como licencia independiente (Intune Plan 1 o Plan 2). Para Acceso Condicional se requiere Entra ID P1 o superior.',
      },
    },
    {
      '@type': 'Question',
      name: '¿Intune puede gestionar dispositivos macOS y móviles?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Sí. Intune gestiona Windows, macOS, iOS y Android. Para iOS/Android corporativos se usa MDM; para BYOD (dispositivos personales) se usa MAM para proteger solo las aplicaciones corporativas.',
      },
    },
    {
      '@type': 'Question',
      name: '¿Cuánto tiempo toma una implementación completa de Intune?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Para 50–200 usuarios, entre 3 y 6 semanas: 1 semana de diseño, 2–4 semanas de despliegue por fases y 1 semana de validación. Con Autopilot, los nuevos equipos se configuran solos.',
      },
    },
  ],
}

const CONTENT = {
  slug: 'intune-checklist',
  hex: '#22c55e',
  title: 'Lista de verificación: Implementación de Microsoft Intune',
  description:
    'Checklist técnico de 30+ puntos para implementar Intune de forma correcta y completa, desde la configuración inicial hasta Autopilot y Acceso Condicional.',
  includes: [
    'Pre-requisitos de licencias y tenant',
    'Configuración inicial de Intune (MDM Authority)',
    'Políticas de cumplimiento recomendadas',
    'Perfiles de configuración para Windows y móviles',
    'Configuración de Windows Autopilot',
    'Integración con Acceso Condicional y MFA',
  ],
  content: [
    {
      title: '01 — Pre-requisitos y licencias',
      items: [
        'Confirmar licencias: Microsoft 365 Business Premium, E3/E5 o Intune standalone',
        'Verificar que Entra ID P1 esté disponible para Acceso Condicional',
        'Confirmar rol de Administrador Global o Intune Service Administrator',
        'Revisar que el tenant no tenga políticas de MDM conflictivas previas',
        'Documentar la lista de usuarios y grupos objetivo del piloto',
      ],
    },
    {
      title: '02 — Configuración inicial de Intune',
      items: [
        'Establecer MDM Authority en "Microsoft Intune" (no en híbrido)',
        'Configurar dominio personalizado y verificar DNS',
        'Crear grupos de seguridad en Entra ID: Piloto, Todos-Usuarios, Todos-Dispositivos',
        'Habilitar restricciones de inscripción según plataforma y límite por usuario',
        'Configurar marca personalizada de la empresa (logo, colores, portal)',
        'Activar el Portal de empresa en Microsoft 365 admin center',
      ],
    },
    {
      title: '03 — Políticas de cumplimiento',
      items: [
        'Crear política de cumplimiento para Windows 11: BitLocker obligatorio, antivirus activo, firewall habilitado',
        'Establecer versión mínima de Windows 10/11 requerida',
        'Configurar período de gracia para dispositivos no conformes (recomendado: 3 días)',
        'Crear política de cumplimiento para móviles: PIN requerido, cifrado habilitado',
        'Definir acción ante incumplimiento: notificar → bloquear acceso → retirar',
        'Vincular políticas de cumplimiento al Acceso Condicional',
      ],
    },
    {
      title: '04 — Perfiles de configuración',
      items: [
        'Perfil de restricciones de dispositivo: deshabilitar cámara en áreas sensibles (opcional)',
        'Perfil de Wi-Fi corporativo: push automático de certificados y SSID',
        'Perfil de VPN: configuración de cliente VPN (si aplica)',
        'Perfil de actualización de Windows: diferir actualizaciones de calidad 7 días',
        'Perfil de endpoint protection: Defender ATP, firewall, control de aplicaciones',
        'Verificar que todos los perfiles se asignen a los grupos correctos (no a Todos)',
      ],
    },
    {
      title: '05 — Windows Autopilot',
      items: [
        'Registrar hash de hardware de equipos piloto (Get-WindowsAutoPilotInfo.ps1)',
        'Crear perfil de Autopilot: Deployment Mode (User-Driven o Self-Deploying)',
        'Configurar OOBE: omitir pantallas de privacidad, idioma, teclado',
        'Asignar perfil a grupos de dispositivos en Intune',
        'Configurar página de estado de inscripción (ESP): apps críticas instaladas antes de escritorio',
        'Probar flujo completo con un equipo de prueba antes de producción',
      ],
    },
    {
      title: '06 — Validación y go-live',
      items: [
        'Verificar que todos los dispositivos piloto aparecen en la consola de Intune',
        'Confirmar cumplimiento: sin dispositivos marcados como "No conforme" no justificado',
        'Probar Acceso Condicional: acceso bloqueado desde dispositivo no gestionado',
        'Revisar alertas de Intune en el dashboard por 48 horas post-despliegue',
        'Documentar procedimiento de inscripción para el equipo de soporte',
        'Programar revisión de cumplimiento mensual',
      ],
    },
  ],
}

export default function IntuneChecklistPage() {
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
            <span className="badge text-[10px] font-mono" style={{ color: '#22c55e', backgroundColor: '#22c55e18' }}>
              IDENTIDAD & ACCESO
            </span>
            <span className="text-zinc-700 text-[10px] font-mono">10 min · 30+ puntos</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-noc-white leading-tight mb-4">
            {CONTENT.title}
          </h1>
          <p className="text-zinc-400 text-base leading-relaxed max-w-2xl">
            Creado por ingenieros con proyectos activos de Intune en producción. Cubre desde la primera configuración hasta la validación de Autopilot.
          </p>
        </div>

        <RecursoGate {...CONTENT} ctaLabel="Acceder al checklist gratuitamente" />

        {/* Bottom CTA */}
        <div className="mt-16 card p-8 text-center border-amber/20">
          <p className="text-zinc-400 text-sm mb-4">
            ¿Prefieres que lo implementemos nosotros?
          </p>
          <Link href="/servicios/identidad-acceso" className="btn-amber px-8 py-3">
            Ver servicio Intune & Entra ID →
          </Link>
        </div>
      </div>
    </div>
  )
}
