'use strict';

const OPERATOR_LAYOUTS = {
  'api::lead.lead': {
    settings: {
      mainField: 'company',
      defaultSortBy: 'createdAt',
      defaultSortOrder: 'DESC',
      pageSize: 25,
    },
    list: ['createdAt', 'company', 'name', 'email', 'source', 'priority', 'lifecycleStage'],
    edit: [
      [field('name'), field('email')],
      [field('company'), field('phone')],
      [field('source', 4), field('companySize', 4)],
      [field('services', 12)],
      [field('status', 4), field('lifecycleStage', 4), field('owner', 4)],
      [field('priority', 4), field('urgency', 4), field('nextFollowUpAt', 4)],
      [field('notes', 12)],
      [field('internalNote', 12)],
      [field('reportRef', 3), field('scoreOverall', 3), field('scoreInfrastructure', 2), field('scoreIdentity', 2), field('scoreOperations', 2)],
    ],
    labels: {
      name: 'Nombre',
      email: 'Correo',
      company: 'Empresa',
      phone: 'Telefono',
      companySize: 'Tamano de empresa',
      services: 'Servicios consultados',
      urgency: 'Urgencia',
      notes: 'Mensaje del cliente',
      status: 'Estado rapido',
      source: 'Origen',
      reportRef: 'Folio assessment',
      scoreOverall: 'Score general',
      scoreInfrastructure: 'Infraestructura',
      scoreIdentity: 'Identidad',
      scoreOperations: 'Operacion',
      priority: 'Prioridad',
      internalNote: 'Nota interna',
      owner: 'Responsable',
      lifecycleStage: 'Etapa comercial',
      nextFollowUpAt: 'Proximo seguimiento',
      lastInteractionAt: 'Ultima interaccion',
    },
    descriptions: {
      services: 'Lista generada por el formulario. No editar si no es necesario.',
      internalNote: 'Notas internas de Velkor; no se publican en el sitio.',
      reportRef: 'Folio automatico del assessment, si aplica.',
    },
    readOnly: ['source', 'reportRef', 'scoreOverall', 'scoreInfrastructure', 'scoreIdentity', 'scoreOperations'],
    hidden: [
      'workflow',
      'slaHours',
      'alertLevel',
      'tags',
      'utm',
      'maturityLevel',
      'exposureLevel',
      'criticalFlagsCount',
      'highFlagsCount',
      'segment',
      'engagementType',
      'estimatedScope',
      'followUpChannel',
      'followUpHours',
      'nurtureStage',
      'staleAt',
      'lastInteractionAt',
      'escalationLevel',
      'operationalPriority',
      'governanceSignals',
      'relatedArtifacts',
      'engagementAuditTrail',
    ],
  },
  'api::post.post': {
    settings: {
      mainField: 'title',
      defaultSortBy: 'updatedAt',
      defaultSortOrder: 'DESC',
    },
    list: ['title', 'category', 'technicalLevel', 'readTime', 'publishedAt'],
    edit: [
      [field('title', 8), field('slug', 4)],
      [field('excerpt', 12)],
      [field('category', 4), field('technicalLevel', 4), field('readTime', 4)],
      [field('content', 12)],
      [field('governanceNotes', 12)],
    ],
    labels: {
      title: 'Titulo',
      slug: 'URL corta',
      excerpt: 'Resumen',
      content: 'Contenido',
      category: 'Categoria',
      readTime: 'Tiempo de lectura',
      technicalLevel: 'Nivel',
      governanceNotes: 'Notas de gobierno',
    },
    descriptions: {
      excerpt: 'Texto breve que aparece en listados y previews.',
      content: 'Articulo principal. Revisar confidencialidad antes de publicar.',
      governanceNotes: 'Contexto interno opcional; no reemplaza revision editorial.',
    },
    hidden: [
      'hex',
      'technicalCategory',
      'operationalTags',
      'maturityLevel',
      'engagementType',
      'industryContext',
      'relatedEvidence',
      'architectureDiagram',
      'architectureReferences',
      'relatedCases',
      'relatedFrameworks',
      'downloadableArtifact',
      'downloadableArtifacts',
      'articleBlocks',
    ],
  },
  'api::caso.caso': {
    settings: {
      mainField: 'sector',
      defaultSortBy: 'updatedAt',
      defaultSortOrder: 'DESC',
    },
    list: ['sector', 'client', 'year', 'result', 'publishedAt'],
    edit: [
      [field('sector', 4), field('client', 4), field('year', 4)],
      [field('context', 12)],
      [field('challenge', 12)],
      [field('solution', 12)],
      [field('result', 6), field('resultSub', 6)],
      [field('industry', 4), field('envSize', 4), field('envPlatform', 4)],
      [field('governanceNotes', 12)],
    ],
    labels: {
      client: 'Cliente / alias',
      sector: 'Sector',
      year: 'Ano',
      context: 'Contexto',
      challenge: 'Problema',
      solution: 'Intervencion Velkor',
      result: 'Resultado principal',
      resultSub: 'Detalle del resultado',
      industry: 'Industria',
      envSize: 'Tamano del entorno',
      envPlatform: 'Plataforma',
      governanceNotes: 'Notas internas',
    },
    descriptions: {
      client: 'Usar alias si el cliente no aprobo publicar su nombre.',
      context: 'Descripcion ejecutiva sanitizada.',
      governanceNotes: 'Validar NDA y datos sensibles antes de publicar.',
    },
    hidden: [
      'durationWeeks',
      'beforeState',
      'phases',
      'tags',
      'hex',
      'envEndpoints',
      'technicalLevel',
      'technicalCategory',
      'operationalTags',
      'maturityLevel',
      'engagementType',
      'relatedEvidence',
      'architectureDiagram',
      'architectureDecisions',
      'rolloutPhases',
      'deliverables',
      'outcomes',
      'governanceMatrix',
      'dependencyMap',
      'deploymentDependencies',
      'operationalTradeoffs',
      'rollbackConsiderations',
      'lessonsLearned',
      'implementationConstraints',
      'riskResidual',
      'postmortemNote',
    ],
  },
  'api::servicio.servicio': {
    settings: {
      mainField: 'name',
      defaultSortBy: 'updatedAt',
      defaultSortOrder: 'DESC',
    },
    list: ['name', 'category', 'technicalLevel', 'publishedAt'],
    edit: [
      [field('name', 8), field('category', 4)],
      [field('description', 12)],
      [field('industry', 4), field('technicalLevel', 4), field('engagementType', 4)],
      [field('governanceNotes', 12)],
    ],
    labels: {
      name: 'Nombre del servicio',
      description: 'Descripcion',
      category: 'Categoria',
      industry: 'Industria objetivo',
      technicalLevel: 'Nivel',
      engagementType: 'Tipo de trabajo',
      governanceNotes: 'Notas internas',
    },
    hidden: [
      'hex',
      'technicalCategory',
      'operationalTags',
      'maturityLevel',
      'relatedEvidence',
      'architectureDiagram',
      'rolloutPhases',
      'downloadableArtifact',
    ],
  },
  'api::recurso.recurso': {
    settings: {
      mainField: 'title',
      defaultSortBy: 'updatedAt',
      defaultSortOrder: 'DESC',
    },
    list: ['title', 'category', 'technicalLevel', 'publishedAt'],
    edit: [
      [field('title', 8), field('slug', 4)],
      [field('description', 12)],
      [field('category', 4), field('technicalLevel', 4), field('fileUrl', 4)],
      [field('items', 12)],
      [field('governanceNotes', 12)],
    ],
    labels: {
      title: 'Titulo',
      slug: 'URL corta',
      description: 'Descripcion',
      category: 'Categoria',
      items: 'Incluye',
      fileUrl: 'URL del descargable',
      technicalLevel: 'Nivel',
      governanceNotes: 'Notas internas',
    },
    descriptions: {
      items: 'Lista JSON sencilla de puntos incluidos. Ejemplo: ["Checklist", "Plantilla"].',
      fileUrl: 'Liga al PDF o archivo aprobado.',
    },
    hidden: [
      'hex',
      'technicalCategory',
      'operationalTags',
      'maturityLevel',
      'engagementType',
      'relatedEvidence',
      'relatedCases',
      'architectureDiagram',
      'downloadableArtifact',
    ],
  },
  'api::testimonio.testimonio': {
    settings: {
      mainField: 'company',
      defaultSortBy: 'order',
      defaultSortOrder: 'ASC',
    },
    list: ['company', 'role', 'service', 'order', 'publishedAt'],
    edit: [
      [field('quote', 12)],
      [field('role', 4), field('company', 4), field('service', 4)],
      [field('initials', 4), field('hex', 4), field('order', 4)],
    ],
    labels: {
      quote: 'Testimonio',
      role: 'Rol',
      company: 'Empresa / alias',
      initials: 'Iniciales',
      hex: 'Color',
      service: 'Servicio relacionado',
      order: 'Orden',
    },
    descriptions: {
      company: 'Usar sector o alias si no hay autorizacion para publicar el nombre.',
      quote: 'No incluir informacion confidencial del cliente.',
    },
  },
  'api::faq-item.faq-item': {
    settings: {
      mainField: 'question',
      defaultSortBy: 'order',
      defaultSortOrder: 'ASC',
    },
    list: ['question', 'service', 'order', 'publishedAt'],
    edit: [
      [field('question', 8), field('service', 4)],
      [field('answer', 12)],
      [field('order', 4)],
    ],
    labels: {
      question: 'Pregunta',
      answer: 'Respuesta',
      service: 'Servicio',
      order: 'Orden',
    },
  },
};

function field(name, size = 6) {
  return { name, size };
}

async function configureOperatorLayouts(strapi) {
  if (process.env.VELKOR_CONFIGURE_OPERATOR_LAYOUTS === 'false') return;

  try {
    const service = strapi.plugin('content-manager').service('content-types');

    for (const [uid, layout] of Object.entries(OPERATOR_LAYOUTS)) {
      const contentType = service.findContentType(uid);
      if (!contentType) continue;

      const current = await service.findConfiguration(contentType);
      await service.updateConfiguration(contentType, {
        settings: {
          ...(current.settings || {}),
          bulkable: true,
          filterable: true,
          searchable: true,
          pageSize: 20,
          ...(layout.settings || {}),
        },
        layouts: {
          ...(current.layouts || {}),
          list: layout.list,
          edit: layout.edit,
        },
        metadatas: buildMetadatas(current.metadatas || {}, layout, contentType),
      });
    }

    strapi.log.info('[Velkor] Operator content-manager layouts configured');
  } catch (err) {
    strapi.log.warn(`[Velkor] Could not configure operator layouts: ${err.message}`);
  }
}

function buildMetadatas(current, layout, contentType) {
  const next = { ...current };
  const layoutFields = [
    ...(layout.list || []),
    ...(layout.edit || []).flat().map((item) => item.name),
  ];
  const fieldNames = new Set([
    'id',
    'createdAt',
    'updatedAt',
    'publishedAt',
    ...Object.keys(contentType.attributes || {}),
    ...layoutFields,
    ...Object.keys(layout.labels || {}),
    ...Object.keys(layout.descriptions || {}),
    ...(layout.readOnly || []),
    ...(layout.hidden || []),
  ]);

  for (const name of fieldNames) {
    const label = layout.labels?.[name] || humanizeField(name);
    const existing = next[name] || {};
    const edit = {
      label,
      description: '',
      placeholder: '',
      visible: true,
      editable: true,
      ...(existing.edit || {}),
    };
    const list = {
      label,
      searchable: isSearchable(contentType, name),
      sortable: isSortable(contentType, name),
      ...(existing.list || {}),
    };

    if (layout.labels?.[name]) {
      edit.label = layout.labels[name];
      list.label = layout.labels[name];
    }

    if (layout.descriptions?.[name]) {
      edit.description = layout.descriptions[name];
    }

    if (layout.readOnly?.includes(name)) {
      edit.editable = false;
    }

    if (layout.hidden?.includes(name)) {
      edit.visible = false;
    }

    next[name] = { edit, list };
  }

  return next;
}

function humanizeField(name) {
  return name
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function isSearchable(contentType, name) {
  const type = contentType.attributes?.[name]?.type;
  return ['string', 'text', 'email', 'uid', 'enumeration'].includes(type);
}

function isSortable(contentType, name) {
  if (['id', 'createdAt', 'updatedAt', 'publishedAt'].includes(name)) return true;
  const type = contentType.attributes?.[name]?.type;
  return [
    'string',
    'email',
    'uid',
    'enumeration',
    'integer',
    'biginteger',
    'float',
    'decimal',
    'date',
    'datetime',
    'time',
    'boolean',
  ].includes(type);
}

module.exports = { configureOperatorLayouts };
