import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Framework Operacional | Metodología de Ingeniería — Velkor System',
  description:
    'Metodología de implementación operacional de 8 etapas: desde discovery de entorno hasta gobernanza continua. Diseñada para entornos empresariales donde el riesgo de interrupción es real.',
  alternates: { canonical: 'https://velkor.mx/framework/operational-framework' },
  openGraph: {
    title: 'Framework Operacional Velkor — 8 Etapas de Ingeniería',
    description:
      'Discovery, assessment, priorización, arquitectura, implementación, gobernanza, validación y handoff operacional.',
  },
}

// ── Stage data ─────────────────────────────────────────────────────────────────

const STAGES = [
  {
    n: '01',
    color: '#b07828',
    bg: 'rgba(176,120,40,0.07)',
    border: 'rgba(176,120,40,0.22)',
    title: 'Discovery',
    subtitle: 'Entendimiento operacional del entorno',
    duration: 'Días 1–3',
    description:
      'Antes de evaluar cualquier brecha, mapeamos el entorno real: no el que está documentado, sino el que existe en producción. La mayoría de los riesgos no están en los sistemas configurados correctamente — están en los que nadie registró.',
    activities: [
      {
        label: 'Levantamiento de contexto operacional',
        detail: 'Industria, tamaño, dependencias críticas, SLAs internos, horarios de operación, modelos de trabajo remoto/híbrido.',
      },
      {
        label: 'Mapeo de entorno físico y lógico',
        detail: 'Inventario de dispositivos, topología de red actual, servicios en producción, cuentas administrativas activas.',
      },
      {
        label: 'Identificación de dependencias',
        detail: 'Qué sistemas no pueden interrumpirse, en qué orden. Relaciones entre ERP, AD, M365, backups y conectividad.',
      },
      {
        label: 'Entrevistas técnicas estructuradas',
        detail: 'Con IT interno o proveedor actual. No para auditar personas — para entender qué decisiones se tomaron y por qué.',
      },
    ],
    outputs: [
      'Mapa de entorno documentado (topología actual)',
      'Inventario inicial de activos críticos',
      'Mapa de dependencias operacionales',
      'Identificación de brechas de visibilidad',
    ],
    principle: 'No se puede asegurar lo que no se conoce. El discovery no es un cuestionario — es una investigación técnica.',
  },
  {
    n: '02',
    color: '#4878b0',
    bg: 'rgba(72,120,176,0.07)',
    border: 'rgba(72,120,176,0.22)',
    title: 'Assessment',
    subtitle: 'Evaluación técnica estructurada',
    duration: 'Días 3–7',
    description:
      'Evaluación sistemática de infraestructura, identidad y gobernanza contra controles basados en CIS Controls v8. No es una lista de verificación — es un análisis de postura real con severidades ponderadas por impacto operacional.',
    activities: [
      {
        label: 'Revisión de infraestructura de red',
        detail: 'Segmentación VLAN, calidad del perímetro (NGFW vs ISP-default), estrategia de backup, inventario de endpoints, detección de amenazas.',
      },
      {
        label: 'Revisión de identidad y acceso',
        detail: 'Estado de MFA, Entra ID, Acceso Condicional, gestión de Intune, privilegios administrativos, ciclos de vida de cuentas.',
      },
      {
        label: 'Revisión de gobernanza operacional',
        detail: 'Documentación técnica, monitoreo activo, sistema de ticketing, gestión de cambios, auditorías previas, cumplimiento normativo.',
      },
      {
        label: 'Scoring de madurez operacional',
        detail: 'Infraestructura (35%), Identidad (40%), Operaciones (25%). Cada dominio produce flags de severidad crítica, alta y media.',
      },
    ],
    outputs: [
      'Reporte de evaluación con scoring por dominio',
      'Catálogo de flags por severidad (crítico/alto/medio)',
      'Nivel de madurez operacional documentado',
      'Nivel de exposición operacional actual',
    ],
    principle: 'El assessment produce evidencia técnica, no recomendaciones de marketing. Cada hallazgo tiene severidad ponderada y contexto.',
  },
  {
    n: '03',
    color: '#a855f7',
    bg: 'rgba(168,85,247,0.07)',
    border: 'rgba(168,85,247,0.22)',
    title: 'Priorización',
    subtitle: 'Secuenciación por riesgo operacional real',
    duration: 'Día 7–8',
    description:
      'Los hallazgos del assessment se convierten en un plan de acción ordenado por impacto y viabilidad. No todo se puede remediar simultáneamente — el orden correcto evita disrupciones y maximiza la reducción de riesgo por unidad de esfuerzo.',
    activities: [
      {
        label: 'Clasificación por impacto operacional',
        detail: 'Flags críticos primero: exposición activa, continuidad del negocio, cuentas compartidas con privilegios. Seguidos de flags altos: superficie de ataque estructural.',
      },
      {
        label: 'Identificación de quick wins',
        detail: 'Acciones de 30–90 días con alto impacto y baja fricción operacional: activar MFA forzado, segmentar red Wi-Fi, configurar backup offsite verificado.',
      },
      {
        label: 'Secuenciación por dependencias',
        detail: 'Identidad antes que dispositivos. Red antes que monitoreo. Gobernanza antes que cumplimiento. El orden importa tanto como los controles.',
      },
      {
        label: 'Estimación de esfuerzo realista',
        detail: 'Semanas de implementación por fase, considerando interrupción mínima de operaciones, ventanas de mantenimiento y capacidad del equipo interno.',
      },
    ],
    outputs: [
      'Plan de remediación ordenado por prioridad',
      'Lista de quick wins con estimación de 30/60/90 días',
      'Mapa de dependencias entre fases',
      'Estimación de esfuerzo por etapa',
    ],
    principle: 'Remediar MFA antes que SIEM. Segmentar antes que monitorear. La secuencia incorrecta gasta presupuesto sin reducir riesgo.',
  },
  {
    n: '04',
    color: '#3d88a5',
    bg: 'rgba(61,136,165,0.07)',
    border: 'rgba(61,136,165,0.22)',
    title: 'Arquitectura',
    subtitle: 'Diseño técnico con decisiones documentadas',
    duration: 'Semana 2',
    description:
      'Cada componente de la solución se diseña con su justificación técnica, alternativas consideradas y restricciones operacionales documentadas. La arquitectura no es un diagrama decorativo — es el contrato técnico del proyecto.',
    activities: [
      {
        label: 'Estrategia de segmentación',
        detail: 'Diseño de VLANs con propósito operacional claro: separación de gestión, producción, invitados, IoT/cámaras, servicios críticos. ACLs inter-VLAN documentadas.',
      },
      {
        label: 'Diseño de gobernanza de identidad',
        detail: 'Modelo de Entra ID: grupos de seguridad, unidades administrativas, jerarquía de CA, políticas de Intune, modelo PIM para privilegios.',
      },
      {
        label: 'Planificación de rollout',
        detail: 'Fases de implementación con grupos piloto, criterios de expansión, ventanas de mantenimiento, puntos de go/no-go y procedimientos de rollback.',
      },
      {
        label: 'Definición de modelo de identidad',
        detail: 'Sincronización AD→Entra ID (si aplica), gestión de identidades de terceros, grupos de dispositivos, ciclos de vida de cuentas de servicio.',
      },
    ],
    outputs: [
      'Diagrama de arquitectura propuesta (red + identidad)',
      'Decisiones técnicas con justificación y alternativas',
      'Plan de rollout por fases con criterios de expansión',
      'Modelo de identidad y gobernanza documentado',
    ],
    principle: 'Una arquitectura sin decisiones documentadas no es una arquitectura — es un diagrama. Las decisiones importan tanto como el diseño.',
  },
  {
    n: '05',
    color: '#3a7858',
    bg: 'rgba(58,120,88,0.07)',
    border: 'rgba(58,120,88,0.22)',
    title: 'Implementación',
    subtitle: 'Despliegue controlado con continuidad protegida',
    duration: 'Semanas 3–6',
    description:
      'El despliegue sigue el plan aprobado. Cada cambio se documenta en tiempo real. Se respetan ventanas de mantenimiento, se ejecutan grupos piloto antes de la expansión general y se mantienen procedimientos de rollback activos.',
    activities: [
      {
        label: 'Rollout por fases con grupos piloto',
        detail: 'Los cambios impactantes (MFA forzado, políticas de CA, Intune) se aplican primero a un grupo controlado. Validación antes de expansión general.',
      },
      {
        label: 'Checkpoints de validación por etapa',
        detail: 'Cada fase tiene criterios de aceptación definidos. No se avanza a la siguiente hasta que los KPIs de la actual se cumplen.',
      },
      {
        label: 'Documentación en tiempo real',
        detail: 'Log de configuraciones, cambios aplicados, decisiones de campo y variaciones del plan original. La documentación es parte del entregable — no un post-procesamiento.',
      },
      {
        label: 'Protección de continuidad operacional',
        detail: 'Sin cambios no planificados. Los impactos en producción se comunican por adelantado. Las interrupciones programadas tienen rollback disponible.',
      },
    ],
    outputs: [
      'Sistema implementado en producción',
      'Log detallado de configuraciones y cambios',
      'Registro de variaciones al plan original con justificación',
      'Evidencia de validación por fase',
    ],
    principle: 'Un despliegue que interrumpe producción sin plan de rollback no es un despliegue — es un incidente.',
  },
  {
    n: '06',
    color: '#b07828',
    bg: 'rgba(176,120,40,0.07)',
    border: 'rgba(176,120,40,0.22)',
    title: 'Gobernanza',
    subtitle: 'Controles operacionales sostenibles',
    duration: 'Semana 6–7',
    description:
      'La gobernanza no es un módulo final — es lo que convierte una implementación técnica en un sistema operacional sostenible. Sin gobernanza, la postura de seguridad se degrada en semanas.',
    activities: [
      {
        label: 'Onboarding y offboarding automatizados',
        detail: 'Procesos documentados para alta/baja de empleados: creación de cuenta, asignación de grupos, provisión de dispositivo, revocación de accesos. Tiempo objetivo < 2 horas.',
      },
      {
        label: 'Baselines de políticas',
        detail: 'Políticas de CA documentadas con justificación por regla. Perfiles de Intune con criterios de compliance claros. Exclusiones documentadas con responsable y revisión programada.',
      },
      {
        label: 'Revisiones de acceso periódicas',
        detail: 'Calendario de revisión de permisos privilegiados (mensual), accesos de terceros (trimestral), grupos de seguridad (semestral). Con responsable asignado.',
      },
      {
        label: 'Propiedad operacional',
        detail: 'Cada sistema tiene un dueño técnico identificado. Las alertas tienen responsable de respuesta. La documentación tiene fecha de revisión programada.',
      },
    ],
    outputs: [
      'Runbook de onboarding/offboarding',
      'Políticas documentadas con justificación y exclusiones',
      'Calendario de revisiones de acceso con responsables',
      'Matriz de propiedad operacional por sistema',
    ],
    principle: 'La seguridad que no tiene dueño no tiene mantenimiento. La gobernanza asigna responsabilidad operacional explícita.',
  },
  {
    n: '07',
    color: '#4878b0',
    bg: 'rgba(72,120,176,0.07)',
    border: 'rgba(72,120,176,0.22)',
    title: 'Validación',
    subtitle: 'Verificación operacional contra KPIs comprometidos',
    duration: 'Semana 7',
    description:
      'La validación no es una demostración del sistema funcionando — es una verificación formal de que los KPIs comprometidos en la arquitectura se cumplen en condiciones reales de operación.',
    activities: [
      {
        label: 'Testing contra controles diseñados',
        detail: 'Verificación de que las políticas de CA bloquean accesos no conformes, que los dispositivos no enrolled no acceden a recursos, que las VLANs no tienen rutas no autorizadas.',
      },
      {
        label: 'Readiness de rollback',
        detail: 'Verificar que los procedimientos de rollback documentados funcionan. Para cada cambio crítico, existe un procedimiento probado de reversión.',
      },
      {
        label: 'Verificación operacional',
        detail: 'El equipo IT interno puede operar el sistema sin asistencia: crear usuarios, enrollar dispositivos, revisar alertas, ejecutar el runbook de onboarding.',
      },
      {
        label: 'Pruebas de resiliencia básica',
        detail: 'Failover de conectividad (si aplica SD-WAN), recuperación desde backup, comportamiento del sistema ante pérdida de conectividad con Entra ID/Intune.',
      },
    ],
    outputs: [
      'Reporte de validación con KPIs verificados vs comprometidos',
      'Registro de pruebas de rollback ejecutadas',
      'Verificación de capacidad operacional interna',
      'Puntos abiertos con plan de resolución y fecha',
    ],
    principle: 'Un sistema que funciona en la demo pero no en el incidente de las 2 AM no está validado.',
  },
  {
    n: '08',
    color: '#3d88a5',
    bg: 'rgba(61,136,165,0.07)',
    border: 'rgba(61,136,165,0.22)',
    title: 'Handoff & Mejora Continua',
    subtitle: 'Transferencia operacional y roadmap de evolución',
    duration: 'Semana 8',
    description:
      'El cierre del proyecto no es el fin del compromiso — es la transferencia formal de propiedad operacional. El equipo interno recibe documentación, capacitación y un roadmap de evolución realista.',
    activities: [
      {
        label: 'Entrega de documentación operacional',
        detail: 'Runbooks de operación, diagramas actualizados de arquitectura final, políticas con justificaciones, log de configuraciones, matriz de gobernanza.',
      },
      {
        label: 'Capacitación al equipo interno',
        detail: 'Sesiones técnicas sobre los sistemas implementados: cómo operar, cómo responder a alertas, cómo ejecutar el onboarding/offboarding, cómo interpretar los reportes.',
      },
      {
        label: 'Recomendaciones de evolución operacional',
        detail: 'Qué construir en los próximos 6–12 meses para continuar madurando la postura. Priorizado por impacto, no por novedad tecnológica.',
      },
      {
        label: 'Roadmap de mejora continua',
        detail: 'Controles adicionales identificados durante el proyecto, revisiones programadas de la arquitectura, criterios para escalar la solución en caso de crecimiento.',
      },
    ],
    outputs: [
      'Documentación operacional completa del entorno',
      'Manual de operación y runbooks',
      'Roadmap de evolución con prioridades documentadas',
      'SLA de soporte post-implementación activo',
    ],
    principle: 'El handoff no es un abandono. Es el momento en que el equipo interno puede operar sin dependencia — y eso se diseña desde el inicio.',
  },
]

// ── Principles ─────────────────────────────────────────────────────────────────

const PRINCIPLES = [
  {
    title: 'Decisiones documentadas, no solo resultados',
    desc: 'Cada elección técnica tiene justificación escrita y alternativas consideradas. El cliente entiende por qué, no solo qué.',
    color: '#b07828',
  },
  {
    title: 'Continuidad protegida durante el cambio',
    desc: 'Ningún cambio no planificado en producción. Rollback disponible para cada modificación crítica. Las interrupciones se programan.',
    color: '#4878b0',
  },
  {
    title: 'Gobernanza desde el diseño, no como afterthought',
    desc: 'Los procesos de onboarding, revisión de acceso y propiedad operacional se diseñan con la arquitectura — no se añaden al final.',
    color: '#3a7858',
  },
  {
    title: 'Transferencia real de propiedad operacional',
    desc: 'Al cierre, el equipo interno puede operar sin dependencia. Si no pueden, el handoff no está terminado.',
    color: '#a855f7',
  },
]

// ── JSON-LD ─────────────────────────────────────────────────────────────────────

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name: 'Framework Operacional Velkor — Metodología de 8 Etapas',
  description:
    'Metodología de ingeniería para transformaciones de infraestructura IT empresarial: desde discovery hasta gobernanza continua.',
  totalTime: 'P8W',
  step: STAGES.map(s => ({
    '@type': 'HowToStep',
    name: `Etapa ${s.n}: ${s.title} — ${s.subtitle}`,
    text: s.description,
    itemListElement: s.outputs.map(o => ({ '@type': 'HowToDirection', text: o })),
  })),
}

// ── Page ───────────────────────────────────────────────────────────────────────

export default function OperationalFrameworkPage() {
  return (
    <div className="min-h-screen py-16 px-4 sm:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="mb-4">
          <Link
            href="/framework"
            className="inline-flex items-center gap-2 text-zinc-600 text-xs font-mono hover:text-zinc-400 transition-colors"
          >
            <svg viewBox="0 0 16 16" fill="currentColor" className="w-3 h-3">
              <path d="M3.828 7H14a1 1 0 110 2H3.828l2.829 2.828a1 1 0 11-1.414 1.414L1 9l-.707-.707L1 7.586 5.243 3.343A1 1 0 016.657 4.757L3.828 7z" />
            </svg>
            Metodología
          </Link>
        </div>

        <div className="mb-16">
          <span className="label block mb-3">Framework Operacional</span>
          <h1 className="text-4xl sm:text-5xl font-black text-noc-white leading-tight mb-5">
            Metodología de ingeniería<br />
            <span className="text-gradient-amber">en 8 etapas</span>
          </h1>
          <p className="text-zinc-500 text-base leading-relaxed max-w-2xl mb-6">
            Un sistema de implementación diseñado para entornos donde la continuidad operacional no es negociable.
            Cada etapa produce evidencia técnica — no documentación de relleno.
          </p>

          {/* Stage count strip */}
          <div className="flex flex-wrap gap-2">
            {STAGES.map(s => (
              <span
                key={s.n}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-mono"
                style={{
                  background: s.bg,
                  border: `1px solid ${s.border}`,
                  color: s.color,
                }}
              >
                <span className="opacity-60">{s.n}</span>
                {s.title}
              </span>
            ))}
          </div>
        </div>

        {/* Stages */}
        <div className="relative mb-20">
          {/* Vertical connector */}
          <div
            className="absolute left-[27px] top-10 bottom-10 w-px hidden sm:block"
            style={{
              background: 'linear-gradient(180deg, rgba(176,120,40,0.25) 0%, rgba(61,136,165,0.25) 50%, rgba(61,136,165,0.1) 100%)',
            }}
          />

          <div className="space-y-8">
            {STAGES.map(stage => (
              <div key={stage.n} className="relative sm:pl-16">
                {/* Stage bubble */}
                <div
                  className="hidden sm:flex absolute left-0 top-5 w-[54px] h-[54px] rounded-2xl items-center justify-center font-mono font-bold text-sm flex-shrink-0"
                  style={{ background: stage.bg, border: `1px solid ${stage.border}`, color: stage.color }}
                >
                  {stage.n}
                </div>

                {/* Stage card */}
                <div
                  className="card p-7 hover:border-zinc-600 transition-colors"
                  style={{ borderTopColor: stage.color, borderTopWidth: 2 }}
                >
                  {/* Header */}
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-5">
                    <div className="flex items-center gap-3">
                      <div
                        className="sm:hidden flex items-center justify-center w-9 h-9 rounded-xl font-mono font-bold text-xs flex-shrink-0"
                        style={{ background: stage.bg, border: `1px solid ${stage.border}`, color: stage.color }}
                      >
                        {stage.n}
                      </div>
                      <div>
                        <h2 className="text-noc-white font-black text-xl leading-tight">{stage.title}</h2>
                        <p className="text-zinc-600 text-xs font-mono mt-0.5">{stage.subtitle}</p>
                      </div>
                    </div>
                    <span
                      className="badge text-[10px] font-mono flex-shrink-0"
                      style={{ color: stage.color, backgroundColor: stage.bg }}
                    >
                      {stage.duration}
                    </span>
                  </div>

                  <p className="text-zinc-400 text-sm leading-relaxed mb-6">{stage.description}</p>

                  {/* Activities */}
                  <div className="mb-6">
                    <div className="label text-[10px] mb-4">Actividades</div>
                    <div className="grid sm:grid-cols-2 gap-3">
                      {stage.activities.map(act => (
                        <div
                          key={act.label}
                          className="p-3.5 rounded-xl"
                          style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.05)' }}
                        >
                          <div
                            className="text-xs font-semibold mb-1.5"
                            style={{ color: stage.color }}
                          >
                            {act.label}
                          </div>
                          <p className="text-zinc-600 text-[11px] leading-relaxed">{act.detail}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Outputs */}
                  <div className="mb-5">
                    <div className="label text-[10px] mb-3">Entregables de etapa</div>
                    <ul className="grid sm:grid-cols-2 gap-x-6 gap-y-1.5">
                      {stage.outputs.map(o => (
                        <li key={o} className="flex items-start gap-2">
                          <span
                            className="w-1 h-1 rounded-full flex-shrink-0 mt-1.5"
                            style={{ background: stage.color }}
                          />
                          <span className="text-zinc-500 text-xs leading-relaxed">{o}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Engineering principle */}
                  <div
                    className="px-4 py-3 rounded-xl"
                    style={{
                      background: `${stage.color}08`,
                      border: `1px solid ${stage.color}18`,
                      borderLeft: `3px solid ${stage.color}`,
                    }}
                  >
                    <div className="text-[9.5px] font-mono uppercase tracking-widest mb-1" style={{ color: stage.color }}>
                      Principio de ingeniería
                    </div>
                    <p className="text-zinc-400 text-xs leading-relaxed italic">
                      {stage.principle}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Engineering Principles */}
        <div className="mb-16">
          <span className="label block mb-6">Principios que atraviesan todas las etapas</span>
          <div className="grid sm:grid-cols-2 gap-4">
            {PRINCIPLES.map(p => (
              <div
                key={p.title}
                className="card p-6 hover:border-zinc-600 transition-colors"
                style={{ borderLeftColor: p.color, borderLeftWidth: 2 }}
              >
                <div className="flex items-start gap-2.5 mb-2">
                  <span className="w-1.5 h-1.5 rounded-full flex-shrink-0 mt-1.5" style={{ background: p.color }} />
                  <h3 className="text-noc-white font-semibold text-sm">{p.title}</h3>
                </div>
                <p className="text-zinc-500 text-xs leading-relaxed ml-4">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* What's different vs the 5-step framework */}
        <div
          className="mb-16 p-6 sm:p-8"
          style={{
            border: '1px solid rgba(72,120,176,0.14)',
            background: 'rgba(72,120,176,0.03)',
            borderRadius: '14px',
          }}
        >
          <div className="label text-[9.5px] mb-3">Relación con el Framework de 5 Etapas</div>
          <h3 className="text-noc-white font-black text-lg mb-3">
            El framework operacional expande la metodología de implementación
          </h3>
          <p className="text-zinc-500 text-sm leading-relaxed mb-5">
            El <Link href="/framework" className="text-zinc-400 hover:text-zinc-300 underline underline-offset-2 transition-colors">Framework de 5 Etapas</Link> describe el proceso de entrega desde la perspectiva del cliente (diagnóstico → diseño → implementación → validación → handoff). El Framework Operacional desagrega cada etapa desde la perspectiva de ingeniería: qué se hace, cómo se hace, por qué en ese orden, y qué evidencia técnica produce.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link href="/framework/evidence" className="btn-ghost px-5 py-2.5 text-sm">
              Ver evidencia operacional →
            </Link>
            <Link href="/assessments" className="btn-ghost px-5 py-2.5 text-sm">
              Iniciar evaluación →
            </Link>
          </div>
        </div>

        {/* CTA */}
        <div className="card p-10 text-center border-amber/20">
          <span className="label block mb-3">¿Quieres aplicar esta metodología a tu entorno?</span>
          <h2 className="text-2xl font-black text-noc-white mb-3">
            Comenzamos con una evaluación operacional
          </h2>
          <p className="text-zinc-500 text-sm mb-6 max-w-sm mx-auto leading-relaxed">
            La Etapa 02 del framework está disponible como herramienta de autoevaluación. Sin costo, en 15 minutos, con resultados inmediatos.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/assessments" className="btn-amber px-10 py-3.5 text-[15px]">
              Iniciar assessment operacional →
            </Link>
            <Link href="/contacto" className="btn-ghost px-10 py-3.5 text-[15px]">
              Hablar con un ingeniero
            </Link>
          </div>
        </div>

      </div>
    </div>
  )
}
