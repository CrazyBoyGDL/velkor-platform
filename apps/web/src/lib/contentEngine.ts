export type ContentTemplateType =
  | 'architecture-decision'
  | 'implementation-lesson'
  | 'mini-case-breakdown'
  | 'governance-insight'
  | 'operational-constraint'

export interface ContentField {
  key: string
  label: string
  hint: string
  required: boolean
}

export interface ContentTemplate {
  id: string
  type: ContentTemplateType
  name: string
  purpose: string
  fields: ContentField[]
  example: Record<string, string>
  linkedinHook: string
  estimatedLength: string
}

export const contentTemplates: ContentTemplate[] = [
  {
    id: 'arch-decision-001',
    type: 'architecture-decision',
    name: 'Decisión de arquitectura',
    purpose: 'Documentar y distribuir decisiones de diseño técnico con contexto operacional real. Establece autoridad al mostrar el razonamiento detrás de una elección, no solo el resultado.',
    fields: [
      { key: 'contexto', label: 'Contexto operacional', hint: 'Tipo de organización, industria, escala, restricciones relevantes', required: true },
      { key: 'problema', label: 'El problema real', hint: 'No el síntoma — el problema de diseño o arquitectura subyacente', required: true },
      { key: 'decision', label: 'La decisión tomada', hint: 'Qué se eligió y en qué forma se implementó', required: true },
      { key: 'alternativas', label: 'Las alternativas descartadas', hint: 'Qué otras opciones se evaluaron y por qué se rechazaron', required: true },
      { key: 'porque', label: 'Por qué esta', hint: 'Los criterios de decisión: técnicos, operacionales, presupuestales', required: true },
      { key: 'resultado', label: 'Resultado operacional', hint: 'Qué cambió en producción después de la decisión', required: false },
    ],
    example: {
      contexto: 'Red de retail con 8 sucursales en CDMX y Guadalajara. Tráfico mixto: POS, CCTV, Wi-Fi de clientes. Enlace MPLS legacy con latencia variable entre sedes.',
      problema: 'El MPLS legacy no garantizaba QoS diferenciado para tráfico POS crítico vs. video de vigilancia. En horas pico, las transacciones en caja experimentaban latencias de 400–800 ms.',
      decision: 'SD-WAN sobre FortiGate 100F con políticas de enrutamiento basadas en aplicación. Enlace principal MPLS para POS y administrativo; LTE de respaldo para CCTV y tráfico best-effort.',
      alternativas: 'MPLS con CoS adicional (cotización +35% mensual, tiempo de implementación 6 semanas). QoS en switches de acceso (insuficiente — el cuello de botella era el enlace WAN). VPN sobre internet público (descartado por SLA de seguridad del cliente).',
      porque: 'El SD-WAN permitía granularidad de política por aplicación sin modificar el contrato MPLS existente. La implementación fue incremental por sede, sin ventana de mantenimiento global.',
      resultado: 'Latencia POS reducida a <50 ms en horas pico. El cliente mantuvo el contrato MPLS reduciendo su tier en el siguiente ciclo, con ahorro mensual de MXN 12,000.',
    },
    linkedinHook: 'Cuando el cliente dijo "el sistema se pone lento en las horas de mayor venta", el problema no era la red — era la arquitectura de enrutamiento.',
    estimatedLength: '800–1,200 caracteres',
  },
  {
    id: 'impl-lesson-001',
    type: 'implementation-lesson',
    name: 'Lección de implementación',
    purpose: 'Convertir errores de campo en inteligencia distribuible. El formato reconoce que los planes de implementación rara vez sobreviven el primer contacto con el entorno real.',
    fields: [
      { key: 'entorno', label: 'El entorno', hint: 'Tipo de organización, tamaño, estado previo de la infraestructura', required: true },
      { key: 'plan', label: 'El plan original', hint: 'Qué se diseñó antes de llegar al campo', required: true },
      { key: 'hallazgo', label: 'Lo que encontramos en campo', hint: 'La realidad que contradijo el plan — sin suavizar', required: true },
      { key: 'ajuste', label: 'El ajuste', hint: 'Qué se modificó en la implementación y cómo', required: true },
      { key: 'documentado', label: 'Lo que documentamos', hint: 'Qué quedó registrado para futuros proyectos similares', required: true },
      { key: 'aplicable', label: 'Aplicable cuando', hint: 'En qué contextos esta lección es relevante', required: false },
    ],
    example: {
      entorno: 'Empresa manufacturera, ~200 usuarios, AD on-premises sincronizado con Entra ID. Sin MDM previo. Dispositivos Windows 10 no administrados con acceso a Exchange Online.',
      plan: 'Implementar Acceso Condicional con Intune Compliance como condición. Despliegue por grupos de prueba → departamentos → organización completa en 6 semanas.',
      hallazgo: 'El 40% de los dispositivos existentes no podían enrolarse en Intune sin reinstalación (imagen corporativa legacy, TPM 1.2, BitLocker no habilitado). El grupo de exclusión de emergencia creado para no bloquear operaciones terminó siendo el método de acceso principal para ese 40%.',
      ajuste: 'Fase 1 separada: solo MFA como condición. Fase 2 paralela: programa de sustitución de hardware con Autopilot. La política de cumplimiento de dispositivos se activó solo cuando el 85% del parque estaba enrolled.',
      documentado: 'Criterios de elegibilidad de dispositivos para Intune por versión de TPM y estado de BitLocker. Plantilla de evaluación de parque antes de cualquier implementación de CA.',
      aplicable: 'Cualquier organización con dispositivos heredados y AD híbrido. Especialmente relevante en manufactura, salud y retail con hardware de 5+ años.',
    },
    linkedinHook: 'El grupo de exclusión que creamos para "no bloquear operaciones el día 1" terminó siendo la política de acceso del 40% de los usuarios seis semanas después.',
    estimatedLength: '900–1,400 caracteres',
  },
  {
    id: 'mini-case-001',
    type: 'mini-case-breakdown',
    name: 'Desglose de transformación',
    purpose: 'Presentar una transformación real de forma que muestre profundidad técnica y resultado tangible, sin identificar al cliente. El formato sanitizado permite distribuir casos reales con libertad.',
    fields: [
      { key: 'organizacion', label: 'La organización (sanitizada)', hint: 'Industria, tamaño, ubicación geográfica — sin nombre', required: true },
      { key: 'estado_inicial', label: 'El estado inicial', hint: '3 bullets con las condiciones de partida más relevantes', required: true },
      { key: 'restricciones', label: 'Las restricciones reales', hint: 'Presupuesto, tiempo, operación continua, regulación — lo que limitó el diseño', required: true },
      { key: 'arquitectura', label: 'La arquitectura elegida', hint: 'Qué se implementó y por qué esta combinación específica', required: true },
      { key: 'resultado', label: 'El resultado en números', hint: 'Métricas operacionales concretas — no porcentajes genéricos', required: true },
      { key: 'gobernanza', label: 'La gobernanza que lo sostiene', hint: 'Qué procesos, políticas o controles mantienen el resultado en el tiempo', required: false },
    ],
    example: {
      organizacion: 'Corporativo médico privado, CDMX. 3 clínicas, 1 laboratorio, ~180 usuarios. Bajo alcance de NOM-024-SSA3-2010.',
      estado_inicial: '• Entra ID Basic sin licencias P1/P2. Sin MFA habilitado para expediente clínico.\n• Cuentas de médico compartidas entre turnos en consultorios.\n• Sin inventario de dispositivos — acceso desde equipos personales sin control.',
      restricciones: 'Presupuesto aprobado: USD 18,000 año 1. Operación 24/7 sin ventanas de mantenimiento nocturnas. Médicos adscritos con contrato independiente — no empleados directos, sin capacidad de imponer MDM en sus dispositivos personales.',
      arquitectura: 'Entra ID P2 para todos los usuarios internos. CA con MFA obligatorio + dispositivo registrado para acceso a expediente. Intune en modo "sin inscripción" para dispositivos personales (MAM-WE). Cuentas individuales para cada médico con PIM para acceso a funciones administrativas.',
      resultado: 'Cero cuentas compartidas en producción al día 45. Cumplimiento NOM-024 documentado para auditoría interna. 100% de acceso a expediente con MFA activo. Incidentes de acceso no autorizado: 0 en los 8 meses posteriores.',
      gobernanza: 'Revisión trimestral de accesos con el administrador clínico. Offboarding automatizado via flujo de Entra ID al terminar contrato de médico. Política de retención de logs de acceso a expediente: 5 años.',
    },
    linkedinHook: 'Un corporativo médico con operación 24/7, médicos con contrato independiente y presupuesto limitado. Estas son las restricciones reales que definen la arquitectura.',
    estimatedLength: '1,000–1,600 caracteres',
  },
  {
    id: 'gov-insight-001',
    type: 'governance-insight',
    name: 'Observación de gobernanza',
    purpose: 'Distribuir patrones de gobernanza deficiente observados en campo. El formato posiciona a Velkor como diagnóstico de sistemas, no solo como ejecutor técnico.',
    fields: [
      { key: 'patron', label: 'El patrón que vemos', hint: 'La práctica recurrente observada en múltiples organizaciones', required: true },
      { key: 'origen', label: 'Por qué ocurre', hint: 'La causa raíz organizacional o técnica — no "falta de presupuesto"', required: true },
      { key: 'costo', label: 'El costo real', hint: 'El impacto operacional, de seguridad o de auditoría de este patrón', required: true },
      { key: 'correccion', label: 'La corrección estructural', hint: 'Qué hay que cambiar en el proceso, no solo en la herramienta', required: true },
      { key: 'señal', label: 'Señal de alerta para auditores', hint: 'Cómo detectar este patrón en una revisión de accesos o auditoría', required: false },
    ],
    example: {
      patron: 'Organizaciones con 50+ usuarios mantienen cuentas de administrador compartidas. Un solo usuario "admin" o "it-admin" con contraseña conocida por 3–5 personas del equipo IT.',
      origen: 'No es negligencia — es fricción operacional. Cuando cada cambio de configuración requiere escalar para obtener credenciales individuales, el equipo crea atajos. La cuenta compartida es el resultado de un proceso de provisioning de acceso privilegiado que nunca se diseñó.',
      costo: 'Imposibilidad de auditoría post-incidente: no hay forma de saber quién ejecutó qué cambio. Continuidad de acceso para ex-empleados si la contraseña no se rota al salir. En sectores regulados (salud, finanzas), esto es un hallazgo crítico en auditoría.',
      correccion: 'PIM (Privileged Identity Management) con activación just-in-time. Cada técnico tiene su cuenta individual con privilegios estándar; la elevación es temporal, auditada y requiere justificación. El proceso de provisioning debe ser más rápido que el atajo.',
      señal: 'Buscar cuentas cuyo nombre no corresponde a una persona (admin, it-support, helpdesk). Revisar el último inicio de sesión: si fue en los últimos 30 días desde múltiples IPs, es compartida.',
    },
    linkedinHook: 'Las cuentas de administrador compartidas no existen porque el equipo IT sea descuidado. Existen porque el proceso de acceso privilegiado nunca se diseñó para ser usable.',
    estimatedLength: '700–1,100 caracteres',
  },
  {
    id: 'op-constraint-001',
    type: 'operational-constraint',
    name: 'Restricción operacional documentada',
    purpose: 'Mostrar cómo las restricciones reales dan forma a la arquitectura. Este formato desmitifica el diseño técnico: no se parte de una hoja en blanco, se parte de lo que el cliente puede y no puede hacer.',
    fields: [
      { key: 'restriccion', label: 'La restricción', hint: 'Definida con precisión — no "presupuesto limitado" sino el número o la condición específica', required: true },
      { key: 'origen', label: 'Su origen', hint: 'Técnico / organizacional / presupuestal / regulatorio — y por qué existe', required: true },
      { key: 'impacto', label: 'Cómo afectó el diseño', hint: 'Qué opciones se cerraron y cuáles se abrieron', required: true },
      { key: 'compromiso', label: 'La solución de compromiso', hint: 'El diseño resultante y los trade-offs explícitos', required: true },
      { key: 'riesgo', label: 'El riesgo residual documentado', hint: 'Qué queda expuesto y cómo se monitorea — no se oculta', required: true },
    ],
    example: {
      restriccion: 'ERP crítico 24/7 con proveedor externo sin SLA de mantenimiento. El cliente no tiene ventana de mantenimiento aprobada. Cualquier interrupción de red afecta facturación en tiempo real.',
      origen: 'El ERP es heredado (Oracle E-Business Suite, versión 2015). El proveedor de soporte no garantiza recuperación en menos de 4 horas ante incidentes durante mantenimiento. La dirección financiera vetó cualquier ventana de mantenimiento nocturna.',
      impacto: 'No fue posible implementar segmentación VLAN completa en una sola intervención. Las políticas de FortiGate no podían aplicarse en modo de bloqueo sin validación en el segmento ERP. La segmentación total habría requerido al menos 2 reinicios controlados del switch de core.',
      compromiso: 'Segmentación por fases: fase 1 en modo monitor (IPS sin bloqueo, VLAN en modo trunk transparente). Fase 2 tras 30 días de observación sin incidentes: activación de políticas de bloqueo en horario de bajo tráfico (3–5 AM sábados). Fase 3: segmentación completa en siguiente ciclo de contrato ERP.',
      riesgo: 'Durante las fases 1 y 2, el segmento ERP permanece con visibilidad lateral hacia el segmento administrativo. Mitigación parcial: monitoreo activo en FortiAnalyzer con alertas por movimiento lateral. Riesgo documentado y aceptado por el cliente en acta firmada.',
    },
    linkedinHook: 'El cliente no tenía ventana de mantenimiento. El ERP era 24/7. La segmentación era necesaria. Este es el diseño que resultó de esas tres verdades simultáneas.',
    estimatedLength: '900–1,400 caracteres',
  },
]
