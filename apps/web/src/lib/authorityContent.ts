import type {
  AuthorityReference,
  DownloadableArtifact,
  EngagementType,
  MaturityLevel,
  TechnicalArticleBlock,
  TechnicalCategory,
  TechnicalLevel,
} from '@/lib/contentEngine'
import type { BlogPost } from '@/components/BlogList'

export type FallbackAuthorityPost = {
  slug: string
  title: string
  excerpt: string
  content: string
  category: string
  publishedAt: string
  readTime: string
  hex: string
  technicalCategory: TechnicalCategory
  technicalLevel: TechnicalLevel
  operationalTags: string[]
  maturityLevel: MaturityLevel
  engagementType: EngagementType
  relatedEvidence: AuthorityReference[]
  relatedCases: AuthorityReference[]
  relatedFrameworks: AuthorityReference[]
  architectureReferences: AuthorityReference[]
  downloadableArtifact: DownloadableArtifact
  downloadableArtifacts: DownloadableArtifact[]
  articleBlocks: TechnicalArticleBlock[]
  architectureDiagram: { title: string; href: string }
  industryContext: string
  governanceNotes: string
}

export const FALLBACK_AUTHORITY_POSTS: FallbackAuthorityPost[] = [
  {
    slug: 'zero-trust-hibrido-entra-id-intune',
    title: 'Zero Trust híbrido sin romper operación: Entra ID, Intune y excepciones gobernadas',
    excerpt: 'Zero Trust falla cuando se implementa como checklist. En entornos híbridos reales, la autoridad del control depende de inventario, fases, break-glass, dueños de excepción y evidencia de cierre.',
    category: 'Identidad & Gobierno',
    publishedAt: '2026-05-18T09:00:00.000Z',
    readTime: '15 min',
    hex: '#4878b0',
    technicalCategory: 'identity-governance',
    technicalLevel: 'architecture',
    operationalTags: ['zero-trust', 'entra-id', 'intune', 'conditional-access', 'exception-governance', 'break-glass'],
    maturityLevel: 'governed',
    engagementType: 'governance',
    industryContext: 'Empresas mexicanas con Active Directory local, Microsoft 365 en producción, dispositivos mixtos y presión por elevar seguridad sin detener áreas comerciales, administrativas o clínicas.',
    content: [
      '<p>Zero Trust se vuelve peligroso cuando se vende como postura absoluta y se implementa como una lista de controles aislados. En una operación híbrida, la pregunta correcta no es si el tenant tiene MFA, sino qué dependencias sostienen la decisión de permitir o negar acceso: identidad, dispositivo, aplicación, ubicación, privilegio, criticidad del dato y capacidad de soporte.</p>',
      '<p>El patrón de campo es consistente. El directorio local tiene grupos históricos, algunas cuentas de servicio nadie sabe quién creó, laptops fuera de Intune siguen abriendo correo y existe al menos una aplicación que depende de autenticación heredada. Activar una política fuerte sobre ese estado no produce gobierno; produce excepciones urgentes. Y cuando la excepción no tiene owner, fecha de cierre y monitoreo, se convierte en la arquitectura real.</p>',
      '<h2>La secuencia importa más que la herramienta</h2>',
      '<p>Una ruta viable empieza con lectura, no con bloqueo. Primero se levanta el inventario de usuarios, grupos privilegiados, aplicaciones críticas, protocolos legacy y dispositivos no conformes. Después se define qué señales son confiables para tomar decisiones. Si Intune cubre solo 60% del parque, no puede ser la única condición para acceso a todos los datos. Si Named Locations no está validado, no debe usarse para confiar en toda la sede.</p>',
      '<p>El segundo paso es construir un baseline defendible: bloquear autenticación heredada, MFA para usuarios y administradores, sesiones limitadas en dispositivos no gestionados y break-glass monitoreado. Ese baseline debe entrar por report-only con revisión de eventos reales. Report-only no es una formalidad; es la fase en la que se descubren flujos que no estaban en el diagrama.</p>',
      '<h2>Break-glass no es permiso para saltarse el control</h2>',
      '<p>La cuenta de emergencia debe existir, pero su existencia no debe normalizarse. Debe estar excluida de Acceso Condicional, protegida con credenciales resguardadas, revisada periódicamente y con alerta inmediata ante uso. Si nadie se entera cuando se usa break-glass, la organización no tiene continuidad; tiene una puerta trasera silenciosa.</p>',
      '<h2>Gobernar excepciones es gobernar el sistema</h2>',
      '<p>Todo rollout serio produce excepciones. La diferencia entre madurez y deuda es cómo se administran. Una excepción válida declara sistema, usuario o grupo afectado, razón operacional, aprobador, fecha de expiración, riesgo aceptado y plan de cierre. Además, debe revisarse durante el periodo de estabilización. Si una excepción sobrevive más que su ventana aprobada, cambia de categoría: deja de ser táctica y se vuelve riesgo residual.</p>',
      '<h2>Modelo mínimo de implementación</h2>',
      '<ol><li>Inventario de identidades, dispositivos, apps y rutas legacy.</li><li>Break-glass validado, monitoreado y probado.</li><li>Políticas base en report-only por al menos un ciclo operativo.</li><li>Piloto con TI, dirección y usuarios de baja criticidad.</li><li>Activación gradual por unidad de negocio con soporte reforzado.</li><li>Cierre de excepciones y access review programado.</li><li>Handoff con matriz de políticas, dueños y rollback.</li></ol>',
      '<p>Zero Trust no se alcanza declarando desconfianza. Se alcanza cuando cada permiso tiene contexto, cada excepción tiene dueño y cada cambio puede auditarse sin reconstruir la historia por mensajes sueltos.</p>',
    ].join('\n'),
    articleBlocks: [
      {
        type: 'architecture-callout',
        title: 'Orden de dependencia recomendado',
        body: 'Entra ID decide con señales. Antes de exigir cumplimiento de dispositivo, la organización debe saber qué porcentaje del parque está en Intune y qué aplicaciones no toleran el bloqueo.',
        items: ['Inventario de apps y protocolos legacy', 'Cobertura real de Intune', 'Break-glass probado', 'Políticas en report-only antes de enforcement'],
        owner: 'solutions-architect',
      },
      {
        type: 'operational-warning',
        title: 'La excepción sin fecha es el nuevo perímetro',
        body: 'Un grupo excluido de Acceso Condicional puede ser necesario durante la migración. Sin expiración, monitoreo y responsable, se convierte en el bypass más estable del entorno.',
        severity: 'critical',
        items: ['Owner obligatorio', 'Fecha de cierre', 'Razón documentada', 'Revisión semanal durante rollout'],
      },
      {
        type: 'evidence-reference',
        title: 'Evidencia mínima de cierre',
        body: 'El handoff debe incluir export de políticas, matriz de excepciones, eventos report-only revisados y procedimiento de reversa.',
        evidenceId: 'ca-baseline',
        href: '/framework/evidence#ca-baseline',
      },
    ],
    relatedEvidence: [
      { label: 'Baseline de Acceso Condicional', evidenceId: 'ca-baseline', relation: 'evidence', href: '/framework/evidence#ca-baseline' },
      { label: 'Modelo PIM just-in-time', evidenceId: 'pim-governance', relation: 'evidence', href: '/framework/evidence#pim-governance' },
    ],
    relatedCases: [
      { label: 'Caso sanitizado de gobierno Entra ID + Intune', href: '/casos', relation: 'case-study' },
    ],
    relatedFrameworks: [
      { label: 'Framework operacional de 8 etapas', href: '/framework/operational-framework', relation: 'framework' },
    ],
    architectureReferences: [
      { label: 'Flujo de gobierno Entra ID', href: '/framework/evidence#entra-id-governance-flow', relation: 'architecture' },
    ],
    architectureDiagram: { title: 'Entra ID conditional access control plane', href: '/framework/evidence#entra-id-governance-flow' },
    downloadableArtifact: { title: 'Matriz de excepciones Zero Trust', format: 'xlsx', gated: true, evidenceId: 'ca-baseline' },
    downloadableArtifacts: [
      { title: 'Runbook de break-glass y reversa CA', format: 'runbook', gated: true, evidenceId: 'pim-governance' },
    ],
    governanceNotes: 'La autoridad del control depende de ownership y cadencia de revisión, no solo de que la política exista.',
  },
  {
    slug: 'segmentacion-vlan-empresa-mexicana',
    title: 'Segmentación VLAN empresarial: cómo cortar riesgo lateral sin paralizar sedes',
    excerpt: 'La segmentación útil no nace del diagrama ideal. Nace de observar flujos reales, elegir el primer corte con impacto y mover producción con rollback, dueños y evidencia.',
    category: 'Infraestructura',
    publishedAt: '2026-05-17T09:00:00.000Z',
    readTime: '14 min',
    hex: '#3d88a5',
    technicalCategory: 'network-infrastructure',
    technicalLevel: 'architecture',
    operationalTags: ['vlan-segmentation', 'fortigate', 'lateral-movement', 'dependency-map', 'rollback-plan', 'multi-site'],
    maturityLevel: 'controlled',
    engagementType: 'implementation',
    industryContext: 'SMB y mid-market con sedes, ERP local, cámaras IP, Wi-Fi invitado, impresoras y switches de distintas generaciones conviviendo en una red plana.',
    content: [
      '<p>Una red plana rara vez parece urgente hasta que un incidente la convierte en autopista. El endpoint comprometido no tiene que romper diez controles: solo necesita moverse lateralmente hacia servidores, cámaras, impresoras o sistemas administrativos que nunca debieron estar en el mismo dominio de confianza.</p>',
      '<p>El error común es responder con un rediseño excesivo. Doce VLANs, nombres impecables y un diagrama que nadie puede operar. La segmentación que funciona en empresas reales empieza más pequeña: separa invitados, CCTV, gestión, servidores y usuarios administrativos. Lo importante no es la cantidad de segmentos, sino que cada uno tenga propósito, reglas explícitas y dueño.</p>',
      '<h2>Antes de bloquear, observar</h2>',
      '<p>El firewall, el switch core, la controladora Wi-Fi y el NVR cuentan una historia distinta. Antes de mover un puerto hay que saber qué habla con qué: DNS, DHCP, ERP, impresión, cámaras, VPN, respaldos, autenticación y sistemas que solo alguien de operación recuerda. Si no hay telemetría suficiente, la primera fase no es segmentar; es observar.</p>',
      '<h2>Primer corte de bajo riesgo</h2>',
      '<p>En la mayoría de entornos, Wi-Fi invitado y CCTV son buenos candidatos para primer corte. Invitados no deben ver nada interno. Cámaras deben hablar con NVR, consola de administración y, en algunos casos, analítica. No necesitan alcanzar estaciones administrativas ni servidores de dominio. Este corte reduce superficie sin tocar de inmediato el ERP o flujos de usuario más sensibles.</p>',
      '<h2>FortiGate como punto de gobierno, no solo perímetro</h2>',
      '<p>Cuando el routing inter-VLAN pasa por firewall, cada flujo permitido se vuelve decisión explícita. Eso no significa bloquear todo desde el día uno. Significa pasar de "todo llega a todo" a una matriz de permiso que puede revisarse. La regla deny final no es decoración: es el límite operativo del cambio.</p>',
      '<h2>Rollback y aceptación</h2>',
      '<p>Una migración sin rollback empuja al equipo a abrir reglas amplias bajo presión. Cada ventana debe tener snapshot de configuración, puertos validados, prueba de servicios críticos y criterio claro para reversa. El éxito no es que la VLAN exista; es que operaciones pueda trabajar al día siguiente sin reglas any-any de emergencia.</p>',
      '<h2>Secuencia sugerida</h2>',
      '<ol><li>Inventario físico de switchports, APs, cámaras y enlaces.</li><li>Captura de flujos críticos por sede.</li><li>Separación de invitados y CCTV.</li><li>Segmento de gestión para switches, APs y firewalls.</li><li>Reglas allowlist graduales para servidores y ERP.</li><li>Pruebas por rol y por sede.</li><li>Handoff con matriz VLAN, reglas, owners y rollback.</li></ol>',
      '<p>La segmentación madura no presume complejidad. Presume control: qué está aislado, qué está permitido, quién lo aprobó y cómo se cambia sin improvisación.</p>',
    ].join('\n'),
    articleBlocks: [
      {
        type: 'architecture-callout',
        title: 'Primeros segmentos con mejor relación riesgo/impacto',
        body: 'Invitados, CCTV y gestión suelen ofrecer reducción de riesgo significativa sin tocar sistemas de negocio en la primera ventana.',
        items: ['Guest internet-only', 'CCTV hacia NVR y consola', 'Mgmt restringido a TI', 'Usuarios hacia servicios explícitos'],
        owner: 'network-engineer',
      },
      {
        type: 'operational-warning',
        title: 'La regla any-any aparece cuando falta mapa de dependencias',
        body: 'Si una aplicación deja de funcionar y nadie sabe qué flujo requiere, la presión operativa crea reglas amplias. La observación previa evita ese retroceso.',
        severity: 'warning',
        items: ['Captura de tráfico antes del cambio', 'Pruebas por rol', 'Ventana con rollback', 'Revisión diaria de reglas nuevas'],
      },
      {
        type: 'evidence-reference',
        title: 'Artefactos de entrega',
        body: 'Una segmentación cerrada debe entregar matriz VLAN, reglas firewall, dependencias por sede y pruebas de validación.',
        evidenceId: 'vlan-architecture',
        href: '/framework/evidence#vlan-architecture',
      },
    ],
    relatedEvidence: [
      { label: 'Arquitectura VLAN sanitizada', evidenceId: 'vlan-architecture', relation: 'evidence', href: '/framework/evidence#vlan-architecture' },
      { label: 'Baseline FortiGate post-implementación', evidenceId: 'fortinet-baseline', relation: 'evidence', href: '/framework/evidence#fortinet-baseline' },
    ],
    relatedCases: [
      { label: 'Caso sanitizado de segmentación multi-sede', href: '/casos', relation: 'case-study' },
    ],
    relatedFrameworks: [
      { label: 'Framework operacional - infraestructura', href: '/framework/operational-framework', relation: 'framework' },
    ],
    architectureReferences: [
      { label: 'Diagrama VLAN corporativo', href: '/framework/evidence#vlan-diagram', relation: 'architecture' },
    ],
    architectureDiagram: { title: 'VLAN routing and control map', href: '/framework/evidence#vlan-diagram' },
    downloadableArtifact: { title: 'Matriz VLAN y reglas inter-segmento', format: 'xlsx', gated: true, evidenceId: 'vlan-architecture' },
    downloadableArtifacts: [
      { title: 'Runbook de ventana y rollback FortiGate', format: 'runbook', gated: true, evidenceId: 'fortinet-baseline' },
    ],
    governanceNotes: 'Cada segmento debe tener owner, propósito, reglas permitidas, monitoreo y procedimiento de cambio.',
  },
  {
    slug: 'continuidad-operacional-smb-midmarket',
    title: 'Continuidad operacional SMB: backup, identidad y red como un solo sistema de recuperación',
    excerpt: 'La continuidad no se compra con un backup. Se construye coordinando restauración, identidad, red, ventanas de cambio y responsables capaces de ejecutar bajo presión.',
    category: 'Continuidad',
    publishedAt: '2026-05-16T09:00:00.000Z',
    readTime: '13 min',
    hex: '#b88748',
    technicalCategory: 'continuity-resilience',
    technicalLevel: 'governance',
    operationalTags: ['backup', 'restore-test', 'identity-recovery', 'network-dependency', 'rto-rpo', 'incident-readiness'],
    maturityLevel: 'controlled',
    engagementType: 'assessment',
    industryContext: 'Empresas de 50 a 500 usuarios que dependen de ERP, archivos compartidos, correo, VPN, enlaces de sede y un equipo TI pequeño que atiende operación diaria.',
    content: [
      '<p>Muchas organizaciones dicen tener continuidad porque existe un respaldo. Pero un respaldo no es continuidad. Continuidad es la capacidad de recuperar una función crítica dentro de una ventana aceptable, con personas que saben qué hacer, accesos disponibles, red funcional y evidencia de que la restauración ya fue probada.</p>',
      '<p>El riesgo aparece cuando cada pieza se revisa por separado. Backup en una consola, identidad en otra, firewall en manos de proveedor, documentación en carpetas viejas y decisiones en chats. Durante un incidente, esa fragmentación se vuelve tiempo perdido.</p>',
      '<h2>RTO y RPO no son conceptos de auditoría</h2>',
      '<p>RTO define cuánto tiempo puede estar caída una función antes de dañar operación. RPO define cuánta información se puede perder. Si la empresa no ha definido esto por sistema, el equipo técnico termina improvisando prioridades: correo antes que ERP, archivos antes que facturación, VPN antes que dominio. La prioridad debe existir antes del incidente.</p>',
      '<h2>Restaurar requiere identidad</h2>',
      '<p>Un plan de recuperación falla si las cuentas administrativas, MFA, PIM o break-glass dependen del mismo sistema afectado. La continuidad debe contemplar cómo entra el equipo técnico cuando Entra ID, AD, VPN o el proveedor de correo están degradados. Esto no significa abrir puertas permanentes; significa diseñar acceso de emergencia monitoreado.</p>',
      '<h2>La red también es parte del backup</h2>',
      '<p>Restaurar un servidor no sirve si las rutas, VLANs, DNS o firewall impiden que usuarios lleguen al servicio. Por eso la documentación de continuidad debe incluir dependencias de red: enlaces, reglas, subredes, NAT, VPN, DNS y responsables de proveedor. Una restauración aislada puede verse exitosa en consola y seguir siendo inútil para operación.</p>',
      '<h2>Prueba mínima trimestral</h2>',
      '<p>Una prueba real no necesita apagar toda la empresa. Puede restaurar una muestra de archivos, una VM no productiva, un buzón, una política, una cuenta crítica o un flujo de VPN. Lo importante es medir tiempos, registrar fricciones y corregir. Sin prueba, el plan es una intención.</p>',
      '<h2>Checklist de continuidad gobernada</h2>',
      '<ol><li>Mapa de sistemas críticos y propietarios.</li><li>RTO/RPO por función, aprobado por negocio.</li><li>Backup con retención, cifrado y copia fuera del dominio primario.</li><li>Prueba de restauración documentada.</li><li>Acceso break-glass monitoreado.</li><li>Dependencias de red y proveedor registradas.</li><li>Runbook de comunicación para usuarios y dirección.</li></ol>',
      '<p>Continuidad operacional es coordinación. La infraestructura vive cuando sus piezas pueden fallar sin que la organización pierda control de la recuperación.</p>',
    ].join('\n'),
    articleBlocks: [
      {
        type: 'governance-insight',
        title: 'La prioridad de recuperación es decisión de negocio',
        body: 'TI puede estimar impacto técnico, pero dirección debe aprobar qué función vuelve primero cuando todo no puede recuperarse a la vez.',
        items: ['RTO por sistema', 'RPO por tipo de dato', 'Owner operativo', 'Canal de decisión durante incidente'],
        owner: 'principal',
      },
      {
        type: 'operational-warning',
        title: 'El backup exitoso no prueba acceso de usuarios',
        body: 'Restaurar una VM no valida DNS, firewall, identidad, permisos ni experiencia real del usuario. La prueba debe cubrir flujo de negocio.',
        severity: 'warning',
        items: ['Validar login', 'Validar permisos', 'Validar rutas de red', 'Medir tiempo real de recuperación'],
      },
      {
        type: 'rollout-consideration',
        title: 'Walkthrough operacional recomendado',
        body: 'Simular pérdida de servicio crítico con una mesa técnica: quién decide, quién comunica, quién restaura y qué evidencia queda.',
        items: ['Escenario', 'Roles', 'Cronómetro', 'Registro de fricciones', 'Plan de corrección'],
      },
    ],
    relatedEvidence: [
      { label: 'Extracto de auditoría de seguridad', evidenceId: 'security-audit', relation: 'evidence', href: '/framework/evidence#security-audit' },
      { label: 'Estructura de gobierno IT', evidenceId: 'governance-structure', relation: 'evidence', href: '/framework/evidence#governance-structure' },
    ],
    relatedCases: [
      { label: 'Caso multi-sede con rollback y handoff', href: '/casos', relation: 'case-study' },
    ],
    relatedFrameworks: [
      { label: 'Framework operacional - validación y handoff', href: '/framework/operational-framework', relation: 'framework' },
    ],
    architectureReferences: [
      { label: 'Mapa híbrido de dependencias', href: '/framework/evidence#hybrid-infra-map', relation: 'architecture' },
    ],
    architectureDiagram: { title: 'Continuity dependency map', href: '/framework/evidence#hybrid-infra-map' },
    downloadableArtifact: { title: 'Checklist de prueba de restauración trimestral', format: 'runbook', gated: true, evidenceId: 'security-audit' },
    downloadableArtifacts: [
      { title: 'Matriz RTO/RPO por sistema', format: 'xlsx', gated: true, evidenceId: 'governance-structure' },
    ],
    governanceNotes: 'La continuidad debe revisarse como sistema: backup, identidad, red, proveedores, comunicación y evidencia.',
  },
]

export function getFallbackAuthorityPost(slug: string): FallbackAuthorityPost | null {
  return FALLBACK_AUTHORITY_POSTS.find(post => post.slug === slug) ?? null
}

export function getFallbackRelatedPosts(excludeSlug: string) {
  return FALLBACK_AUTHORITY_POSTS
    .filter(post => post.slug !== excludeSlug)
    .slice(0, 3)
    .map(post => ({
      slug: post.slug,
      title: post.title,
      excerpt: post.excerpt,
      category: post.category,
      readTime: post.readTime,
      hex: post.hex,
    }))
}

export function toBlogPostSummary(post: FallbackAuthorityPost): BlogPost {
  return {
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt,
    category: post.category,
    date: new Date(post.publishedAt).toLocaleDateString('es-MX', { day: 'numeric', month: 'short', year: 'numeric' }),
    readTime: post.readTime,
    hex: post.hex,
    tags: post.operationalTags,
    technicalCategory: post.technicalCategory,
    technicalLevel: post.technicalLevel,
    operationalTags: post.operationalTags,
    maturityLevel: post.maturityLevel,
    engagementType: post.engagementType,
    relatedEvidence: post.relatedEvidence.map(item => item.label),
    relatedCases: post.relatedCases.map(item => item.label),
    relatedFrameworks: post.relatedFrameworks.map(item => item.label),
    downloadableArtifact: post.downloadableArtifact,
    governanceNotes: post.governanceNotes,
    architectureRef: post.architectureDiagram.href,
  }
}
