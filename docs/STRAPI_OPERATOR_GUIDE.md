# Guia Operativa Strapi - Velkor

## Acceso Productivo

El panel operativo debe usarse unicamente con dominio Velkor:

```text
https://api.velkor.com.mx/operacion
```

La URL publica de Railway queda bloqueada por seguridad y no debe compartirse como acceso operativo.

## Para Que Sirve

Strapi es el panel interno para administrar:

- Leads capturados por contacto, assessment y recursos.
- Posts del blog.
- Casos tecnicos o casos sanitizados.
- Servicios.
- Recursos descargables.
- Testimonios.
- Preguntas frecuentes.

## Flujo No Tecnico

1. Entrar al panel.
2. Abrir `Content Manager`.
3. Elegir la coleccion.
4. Editar o crear el registro.
5. Guardar.
6. Publicar solo cuando el contenido ya este revisado.

## Leads

En `Content Manager` -> `Lead` puedes revisar:

- Nombre, correo, empresa y telefono.
- Origen del lead: contacto, assessment o recurso.
- Prioridad y tipo de necesidad.
- Score de assessment, si aplica.
- Proxima fecha sugerida de seguimiento.
- Notas internas.

Como regla operativa: un lead nuevo debe revisarse, contactarse y marcarse con una etapa clara.

## Campos Que Puede Editar Operacion

Es seguro editar:

- Titulos.
- Descripciones.
- Contenido de articulos.
- Casos y resultados sanitizados.
- Testimonios aprobados.
- Recursos y enlaces a descargables.
- Estado publicado/borrador.

## Campos Que No Conviene Tocar Sin Soporte Tecnico

Evitar editar manualmente:

- `workflow`
- `tags`
- `governanceSignals`
- `relatedArtifacts`
- `engagementAuditTrail`
- `lifecycleStage`
- `operationalPriority`

Esos campos conectan clasificacion, CRM ligero, seguimiento y automatizaciones.

## UX Pendiente Recomendada

Para que Strapi sea mas comodo para equipo no tecnico, conviene agregar una fase de hardening operativo:

- Roles: `Operacion`, `Editor`, `Solo lectura`, `Administrador`.
- Vistas guardadas para `Leads nuevos`, `Assessments criticos`, `Seguimiento vencido`.
- Campos internos ocultos para roles no tecnicos.
- Etiquetas claras en espanol para campos CRM.
- Checklist de seguimiento dentro del lead.
- Politica de MFA para administradores.

## Dominio Y Seguridad

- Dominio publico esperado: `api.velkor.com.mx`.
- Ruta de panel esperada: `/operacion`.
- Railway public host: bloqueado para todo excepto healthcheck.
- La web usa Strapi por red privada interna, no por URL publica.
- No publicar enlaces `*.up.railway.app` en documentacion comercial ni operativa.
