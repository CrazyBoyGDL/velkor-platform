'use strict';

const AUTHORITY_POSTS = [
  {
    slug: 'conditional-access-failures-hybrid-smb',
    title: 'Fallos de Acceso Condicional en entornos hibridos SMB',
    excerpt: 'El despliegue de Acceso Condicional falla cuando se trata como politica aislada. En entornos hibridos, las excepciones, el inventario de dispositivos y el orden del rollout definen si el control queda operativo o se convierte en bypass permanente.',
    category: 'Intune',
    readTime: '12 min',
    hex: '#4878b0',
    technicalLevel: 'architecture',
    technicalCategory: 'identity-governance',
    operationalTags: ['conditional-access', 'hybrid-identity', 'phased-rollout', 'rollback-plan', 'privileged-access'],
    maturityLevel: 'controlled',
    engagementType: 'implementation',
    industryContext: 'Organizaciones SMB y mid-market con Active Directory sincronizado, Microsoft 365, dispositivos Windows heredados y equipos que no pueden detener operaciones para una migracion limpia.',
    content: [
      '<p>El error comun no es escribir una mala politica de Acceso Condicional. El error es activarla antes de entender que identidades, dispositivos y aplicaciones sostienen la operacion diaria. En un entorno hibrido, una politica aparentemente correcta puede bloquear al usuario equivocado, dejar fuera al dispositivo critico o empujar al equipo de TI a crear una excepcion que despues nadie se atreve a retirar.</p>',
      '<h2>La falla empieza antes del portal de Entra ID</h2>',
      '<p>En campo, el patron se repite: AD on-premises sincronizado, grupos historicos sin propietario, licencias mezcladas, dispositivos Windows con imagenes antiguas y cuentas administrativas compartidas. Cuando se aplica Acceso Condicional sobre ese estado, la politica hereda toda la deuda operacional del directorio.</p>',
      '<p>El primer indicador de riesgo es la ausencia de inventario confiable. Si el equipo no puede responder que porcentaje de dispositivos esta enrolado, que aplicaciones usan autenticacion legacy y que cuentas tienen privilegios permanentes, el rollout debe iniciar en modo observacion y no en bloqueo.</p>',
      '<h2>Report-only no es una formalidad</h2>',
      '<p>Report-only debe tratarse como una fase tecnica con criterios de salida. La pregunta no es si la politica se ve correcta, sino cuantos accesos reales habria bloqueado, que usuarios aparecieron como excepcion y que aplicaciones no soportan el patron esperado. Sin esa lectura, el paso a enforcement es una apuesta.</p>',
      '<h2>El problema de las exclusiones</h2>',
      '<p>Las exclusiones son necesarias para no romper operacion, pero tambien son el punto donde el control pierde autoridad. Una exclusion debe tener propietario, fecha de expiracion, razon documentada y plan de cierre. Si no existe esa disciplina, el grupo de excepcion se convierte en la arquitectura real de acceso.</p>',
      '<h2>Secuencia operacional recomendada</h2>',
      '<ol><li>Inventario de usuarios, grupos privilegiados, dispositivos y aplicaciones criticas.</li><li>Cuenta break-glass validada, sin MFA dependiente del mismo proveedor y monitoreada.</li><li>Politicas en report-only con revision de eventos reales por al menos un ciclo operativo.</li><li>Piloto con TI, direccion y usuarios de baja criticidad.</li><li>Activacion gradual por departamentos, con soporte y rollback definido.</li><li>Cierre de excepciones y revision periodica de privilegios.</li></ol>',
      '<p>La madurez no se mide por tener Acceso Condicional activo. Se mide por poder explicar quien queda fuera, por que queda fuera y cuando deja de estar fuera.</p>',
    ].join('\n'),
    articleBlocks: [
      {
        type: 'architecture-callout',
        title: 'Orden de dependencia antes del enforcement',
        body: 'Acceso Condicional depende de identidad limpia, inventario de dispositivo, licenciamiento y rutas de soporte. Si cualquiera de esas piezas esta incompleta, la politica debe entrar por fases.',
        items: ['Break-glass validado antes del piloto', 'Report-only con revision de eventos reales', 'Exclusiones con owner y fecha de expiracion', 'Criterios de salida para cada grupo'],
        owner: 'solutions-architect',
      },
      {
        type: 'operational-warning',
        title: 'La excepcion temporal se vuelve bypass permanente',
        body: 'Cuando el rollout presiona al equipo de soporte, el grupo de exclusion resuelve el incidente inmediato. Sin gobierno, esa excepcion queda como ruta primaria para usuarios o sistemas criticos.',
        severity: 'critical',
        items: ['Auditar miembros de grupos excluidos cada semana durante rollout', 'Registrar razon y fecha de cierre', 'Alertar si una exclusion dura mas que el SLA aprobado'],
      },
      {
        type: 'evidence-reference',
        title: 'Evidencia minima para handoff',
        body: 'El handoff debe incluir export de politicas, matriz de excepciones, eventos de report-only y runbook de soporte para bloqueo accidental.',
        evidenceId: 'identity-ca-rollout',
        href: '/framework/evidence',
      },
    ],
    relatedEvidence: [
      { label: 'Matriz de excepciones CA', evidenceId: 'identity-ca-rollout', relation: 'evidence', href: '/framework/evidence' },
      { label: 'Runbook de break-glass', evidenceId: 'identity-breakglass', relation: 'evidence', href: '/framework/evidence' },
    ],
    relatedCases: [
      { label: 'Caso de gobierno de identidad en entorno hibrido', href: '/casos', relation: 'case-study' },
    ],
    relatedFrameworks: [
      { label: 'Framework operacional - identidad y gobierno', href: '/framework/operational-framework', relation: 'framework' },
    ],
    architectureReferences: [
      { label: 'Flujo de decision Entra ID y compliance', href: '/framework/evidence#entra-id-governance-flow', relation: 'architecture' },
    ],
    architectureDiagram: { title: 'Entra ID CA rollout dependency map', href: '/framework/evidence#entra-id-governance-flow' },
    downloadableArtifact: { title: 'Checklist de rollout Acceso Condicional', format: 'runbook', gated: true, evidenceId: 'identity-ca-rollout' },
    downloadableArtifacts: [
      { title: 'Matriz de excepciones y cierre CA', format: 'xlsx', gated: true, evidenceId: 'identity-ca-rollout' },
      { title: 'Runbook de rollback para CA', format: 'runbook', gated: true, evidenceId: 'identity-breakglass' },
    ],
    governanceNotes: 'La politica debe tener propietario operativo, calendario de access review y criterio documentado para retirar exclusiones.',
  },
  {
    slug: 'operational-risks-unmanaged-onboarding',
    title: 'Consecuencias operacionales del onboarding no gestionado',
    excerpt: 'El onboarding informal no solo retrasa altas de usuario. Genera acceso excesivo, datos sin propietario, offboarding incompleto y deuda de auditoria que aparece cuando el incidente ya ocurrio.',
    category: 'Seguridad',
    readTime: '10 min',
    hex: '#b07828',
    technicalLevel: 'governance',
    technicalCategory: 'identity-governance',
    operationalTags: ['identity-lifecycle', 'ownership', 'audit-readiness', 'policy-lifecycle', 'handoff'],
    maturityLevel: 'reactive',
    engagementType: 'governance',
    industryContext: 'Empresas en crecimiento donde altas, bajas y cambios de puesto dependen de mensajes informales entre RH, direccion y TI.',
    content: [
      '<p>El onboarding no gestionado rara vez se ve como riesgo tecnico. Parece un problema administrativo: el usuario nuevo espera, el jefe insiste, TI copia permisos de alguien parecido y la operacion continua. El costo aparece despues, cuando nadie puede explicar por que una persona tenia acceso a un buzón, carpeta o sistema que no correspondia a su rol.</p>',
      '<h2>Copiar permisos no es una estrategia de identidad</h2>',
      '<p>El patron de "copiar al usuario anterior" acelera el alta, pero tambien replica privilegios historicos, excepciones temporales y accesos que ya no tenian propietario. A escala, cada contratacion agrega una capa de incertidumbre a la superficie de acceso.</p>',
      '<h2>El offboarding es donde se revela la deuda</h2>',
      '<p>Un proceso maduro puede responder tres preguntas: que cuentas se desactivan, que tokens o sesiones quedan vivos y quien hereda la propiedad de datos, grupos, buzones o flujos. Si la baja solo deshabilita la cuenta principal, el acceso residual puede vivir en sesiones, dispositivos personales, cuentas compartidas o integraciones SaaS.</p>',
      '<h2>Modelo operativo minimo</h2>',
      '<ol><li>Alta basada en roles, no en usuarios de referencia.</li><li>Aprobacion del owner del sistema para accesos sensibles.</li><li>Fecha de expiracion para accesos temporales.</li><li>Checklist de baja que cubra sesiones, dispositivos, grupos, buzones y datos.</li><li>Revisión mensual de cuentas sin dueño o sin actividad.</li></ol>',
      '<p>La mejora no requiere comprar una plataforma nueva desde el dia uno. Requiere dejar de tratar identidad como tarea reactiva y convertirla en ciclo de vida operable.</p>',
    ].join('\n'),
    articleBlocks: [
      {
        type: 'governance-insight',
        title: 'La causa raiz es falta de ownership',
        body: 'Cuando un sistema no tiene owner operativo, TI termina tomando decisiones de acceso sin contexto de negocio. Eso acelera el alta, pero debilita auditoria y responsabilidad.',
        items: ['Owner por sistema', 'Aprobacion por rol', 'Revision periodica de accesos', 'Registro de excepciones'],
        owner: 'compliance-specialist',
      },
      {
        type: 'operational-warning',
        title: 'Las bajas incompletas son incidentes diferidos',
        body: 'Un ex-colaborador puede conservar acceso indirecto por sesiones persistentes, cuentas compartidas, dispositivos no retirados o grupos heredados.',
        severity: 'warning',
        items: ['Revocar sesiones activas', 'Retirar dispositivos de MDM', 'Transferir ownership de datos', 'Cerrar cuentas compartidas o rotar secretos'],
      },
      {
        type: 'rollout-consideration',
        title: 'Implementacion incremental sin bloquear contrataciones',
        body: 'Primero se normalizan roles y owners. Despues se automatizan altas/bajas. El orden evita friccion con RH y reduce excepciones manuales.',
        items: ['Semana 1: inventario de roles', 'Semana 2: owners y aprobadores', 'Semana 3: checklist de baja', 'Semana 4: access review inicial'],
      },
    ],
    relatedEvidence: [
      { label: 'Checklist de offboarding operativo', evidenceId: 'identity-offboarding', relation: 'evidence', href: '/framework/evidence' },
    ],
    relatedCases: [
      { label: 'Caso de reduccion de cuentas compartidas', href: '/casos', relation: 'case-study' },
    ],
    relatedFrameworks: [
      { label: 'Framework operacional - gobierno y handoff', href: '/framework/operational-framework', relation: 'framework' },
    ],
    architectureReferences: [
      { label: 'Mapa de ciclo de vida identidad - rol, owner, excepcion', href: '/framework/evidence', relation: 'architecture' },
    ],
    architectureDiagram: { title: 'Identity lifecycle ownership map', href: '/framework/evidence' },
    downloadableArtifact: { title: 'Checklist onboarding/offboarding gobernado', format: 'runbook', gated: true, evidenceId: 'identity-offboarding' },
    downloadableArtifacts: [
      { title: 'Matriz RACI para owners de sistemas', format: 'xlsx', gated: true, evidenceId: 'identity-ownership' },
    ],
    governanceNotes: 'El control sostenible no es la automatizacion aislada; es la relacion trazable entre rol, owner, aprobacion, excepcion y baja.',
  },
  {
    slug: 'minimum-viable-segmentation-distributed-smb',
    title: 'Segmentacion minima viable para infraestructura SMB distribuida',
    excerpt: 'La segmentacion efectiva no empieza con doce VLANs. Empieza con aislar los flujos que mas exponen la operacion: POS, camaras, administracion, invitados y sistemas legacy.',
    category: 'Redes',
    readTime: '11 min',
    hex: '#3d88a5',
    technicalLevel: 'architecture',
    technicalCategory: 'network-infrastructure',
    operationalTags: ['vlan-segmentation', 'dependency-map', 'field-constraint', 'phased-rollout', 'rollback-plan'],
    maturityLevel: 'controlled',
    engagementType: 'implementation',
    industryContext: 'Empresas con multiples sedes, firewalls perimetrales, switches gestionables mixtos, CCTV IP y servicios criticos que no toleran ventanas largas de mantenimiento.',
    content: [
      '<p>La segmentacion fracasa cuando se diseña como diagrama ideal y no como operacion migrable. En una SMB distribuida, la red suele mezclar puntos de venta, camaras, Wi-Fi de invitados, administrativos, impresoras, servidores legacy y accesos remotos en una misma superficie plana.</p>',
      '<h2>Minimo viable no significa minimo seguro</h2>',
      '<p>Significa elegir el primer corte que reduce riesgo sin paralizar la operacion. Para muchas empresas, ese corte separa cinco dominios: administracion, sistemas criticos, CCTV, invitados y gestion. No todo necesita moverse el mismo dia.</p>',
      '<h2>La dependencia principal es visibilidad</h2>',
      '<p>Antes de tocar VLANs se necesita saber que habla con que. FortiGate, switch core, controladora Wi-Fi y NVR deben entregar suficiente telemetria para identificar flujos reales. Si no hay datos de trafico, la primera fase debe ser observacion.</p>',
      '<h2>Secuencia de despliegue</h2>',
      '<ol><li>Inventario fisico y logico por sede.</li><li>Mapa de flujos criticos: ERP, POS, NVR, impresoras, VPN, DNS/DHCP.</li><li>Segmentacion de invitados y CCTV como primer corte de bajo impacto.</li><li>Politicas de firewall en modo allowlist gradual.</li><li>Bloqueo de movimiento lateral entre segmentos no relacionados.</li><li>Handoff con reglas, owners y pruebas de rollback.</li></ol>',
      '<p>La segmentacion madura se puede defender ante direccion: reduce movimiento lateral, limita exposicion de dispositivos inseguros y mantiene operacion porque fue desplegada por dependencias, no por estetica de red.</p>',
    ].join('\n'),
    articleBlocks: [
      {
        type: 'architecture-callout',
        title: 'Primer corte recomendado',
        body: 'Separar invitados y CCTV suele reducir exposicion con menor impacto que mover sistemas administrativos o ERP en la primera ventana.',
        items: ['Invitados sin visibilidad lateral', 'CCTV aislado hacia NVR y monitoreo', 'Gestion de red restringida a TI', 'Administrativo con reglas hacia sistemas necesarios'],
        owner: 'network-engineer',
      },
      {
        type: 'operational-warning',
        title: 'No bloquear sin observar flujos reales',
        body: 'Una regla deny aplicada antes de mapear DNS, impresoras, NVR o ERP puede crear incidentes que obliguen a revertir toda la segmentacion.',
        severity: 'warning',
        items: ['Capturar trafico por sede', 'Validar sistemas legacy', 'Aplicar allowlist por fases', 'Mantener rollback de reglas'],
      },
      {
        type: 'evidence-reference',
        title: 'Artefactos de handoff',
        body: 'El cierre debe incluir matriz VLAN, reglas firewall, dependencias por sede y pruebas de acceso por rol.',
        evidenceId: 'network-segmentation-handoff',
        href: '/framework/evidence',
      },
    ],
    relatedEvidence: [
      { label: 'Matriz VLAN y reglas firewall', evidenceId: 'network-segmentation-handoff', relation: 'evidence', href: '/framework/evidence' },
      { label: 'Checklist FortiGate post-implementacion', evidenceId: 'fortigate-hardening', relation: 'evidence', href: '/framework/evidence' },
    ],
    relatedCases: [
      { label: 'Caso multi-sede con restricciones de ventana', href: '/casos', relation: 'case-study' },
    ],
    relatedFrameworks: [
      { label: 'Framework operacional - infraestructura y continuidad', href: '/framework/operational-framework', relation: 'framework' },
    ],
    architectureReferences: [
      { label: 'Diagrama VLAN operativo', href: '/framework/evidence#vlan-diagram', relation: 'architecture' },
    ],
    architectureDiagram: { title: 'VLAN segmentation dependency map', href: '/framework/evidence#vlan-diagram' },
    downloadableArtifact: { title: 'Matriz de segmentacion minima viable', format: 'xlsx', gated: true, evidenceId: 'network-segmentation-handoff' },
    downloadableArtifacts: [
      { title: 'Checklist FortiGate handoff', format: 'runbook', gated: true, evidenceId: 'fortigate-hardening' },
    ],
    governanceNotes: 'Cada segmento debe tener proposito, owner, reglas permitidas, criterio de monitoreo y procedimiento de cambio.',
  },
];

async function seedAuthorityPosts(strapi) {
  if (process.env.SEED_AUTHORITY_CONTENT === 'false') return;

  for (const post of AUTHORITY_POSTS) {
    try {
      const existing = await strapi.db.query('api::post.post').findOne({
        where: { slug: post.slug },
      });

      if (existing) continue;

      await strapi.entityService.create('api::post.post', {
        data: {
          ...post,
          publishedAt: new Date().toISOString(),
        },
      });

      strapi.log.info(`[Velkor] Seeded authority post: ${post.slug}`);
    } catch (err) {
      strapi.log.warn(`[Velkor] Could not seed authority post ${post.slug}: ${err.message}`);
    }
  }
}

module.exports = { seedAuthorityPosts };
