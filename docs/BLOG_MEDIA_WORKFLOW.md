# Blog Enterprise + Media R2 - Velkor

## Objetivo

El blog debe operarse como una biblioteca editorial empresarial: articulos con imagen principal, SEO, evidencia visual y autor/revision tecnica. Las imagenes no deben depender del filesystem de Railway; deben vivir en Cloudflare R2 y servirse desde dominio Velkor.

## Dominios Productivos

- Web publica: `https://velkor.com.mx`
- CMS operativo: `https://api.velkor.com.mx/operacion`
- Media publica recomendada: `https://media.velkor.com.mx`

No usar ni compartir URLs `*.up.railway.app` para operacion editorial.

## Variables Necesarias

### `velkor-api` en Railway

```env
R2_ACCOUNT_ID=<cloudflare-account-id>
R2_ACCESS_KEY_ID=<r2-access-key>
R2_SECRET_ACCESS_KEY=<r2-secret-key>
R2_BUCKET=velkor-media
R2_PUBLIC_URL=https://media.velkor.com.mx
R2_REGION=auto
UPLOAD_SIZE_LIMIT=12582912
```

`R2_ENDPOINT` es opcional. Si se define, debe apuntar al endpoint S3 de R2:

```env
R2_ENDPOINT=https://<account-id>.r2.cloudflarestorage.com
```

### `velkor-web` en Railway

```env
NEXT_PUBLIC_MEDIA_URL=https://media.velkor.com.mx
```

Nunca poner `R2_SECRET_ACCESS_KEY` ni claves privadas como `NEXT_PUBLIC_*`.

## Configuracion Cloudflare R2

1. Crear bucket, por ejemplo `velkor-media`.
2. Crear API token de R2 con permiso de lectura/escritura sobre ese bucket.
3. Conectar dominio publico `media.velkor.com.mx` al bucket.
4. Mantener el bucket privado por defecto y exponer solo el dominio publico necesario para lectura de assets.
5. Verificar que una imagen subida desde Strapi cargue desde `https://media.velkor.com.mx/...`.

## Campos Nuevos En `Articulo`

- `Imagen principal`: portada del articulo.
- `Texto alternativo`: descripcion accesible y SEO de la imagen principal.
- `Pie de imagen`: nota breve visible bajo la portada.
- `Galeria del articulo`: imagenes de evidencia visual.
- `Titulo SEO`: titulo corto para buscadores.
- `Descripcion SEO`: resumen de maximo 180 caracteres.
- `Autor / responsable`: quien firma o responde por el contenido.
- `Revision tecnica`: quien valido el contenido antes de publicar.

## Requisitos Editoriales

Imagen principal:

- Formato recomendado: WebP o JPG optimizado.
- Tamano ideal: 1600 x 900 px.
- Peso recomendado: menos de 500 KB cuando sea posible.
- Peso maximo aceptado por backend: 12 MB.
- Debe mostrar infraestructura, diagrama sanitizado, evidencia operativa o contexto empresarial real. Evitar imagenes genericas.

Galeria:

- Usar solo si aporta evidencia visual.
- Sanitizar IPs, nombres de clientes, usuarios, hostnames, tickets y datos sensibles antes de subir.
- Agregar `alternativeText` y `caption` desde Media Library cuando aplique.

## Flujo No Tecnico Para Publicar

1. Entrar a `https://api.velkor.com.mx/operacion`.
2. Abrir `Media Library` y subir la portada optimizada.
3. Abrir `Content Manager` -> `Articulo`.
4. Crear o editar un articulo.
5. Llenar titulo, slug, extracto, categoria, tiempo de lectura y contenido.
6. Seleccionar `Imagen principal`.
7. Escribir `Texto alternativo` claro.
8. Agregar `Pie de imagen` si la portada requiere contexto.
9. Agregar galeria solo si hay evidencia visual aprobada.
10. Completar `Autor / responsable` y `Revision tecnica`.
11. Guardar.
12. Revisar el articulo en `https://velkor.com.mx/blog/<slug>`.
13. Publicar cuando contenido, imagenes y CTA esten correctos.

## API Para Crear Posts

Los integradores deben autenticar con API token de Strapi y usar `multipart/form-data` para subir media.

### 1. Subir imagen

```bash
curl -X POST "https://api.velkor.com.mx/api/upload" \
  -H "Authorization: Bearer <STRAPI_API_TOKEN>" \
  -F "files=@cover.webp"
```

Respuesta esperada: arreglo con objetos de archivo. Guardar el `id` de la imagen.

### 2. Crear articulo con portada

```bash
curl -X POST "https://api.velkor.com.mx/api/posts" \
  -H "Authorization: Bearer <STRAPI_API_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "data": {
      "title": "Como reducir riesgo operacional en red multi-sede",
      "slug": "reducir-riesgo-operacional-red-multi-sede",
      "excerpt": "Una guia breve para decidir que revisar antes de tocar produccion.",
      "content": "<p>Contenido del articulo...</p>",
      "category": "Infraestructura",
      "readTime": "6 min",
      "hex": "#4878b0",
      "coverImage": 12,
      "coverAlt": "Sala de red empresarial con cableado estructurado y monitoreo operativo",
      "coverCaption": "Evidencia visual sanitizada de infraestructura empresarial.",
      "gallery": [13, 14],
      "authorName": "Velkor Systems",
      "reviewedBy": "Direccion tecnica Velkor",
      "seoTitle": "Reducir riesgo operacional en red multi-sede",
      "seoDescription": "Checklist para reducir riesgo operativo antes de cambios en red empresarial.",
      "publishedAt": "2026-05-20T18:00:00.000Z"
    }
  }'
```

## Seguridad Operativa

- No subir capturas con datos personales, secretos, tokens, IPs publicas sensibles o nombres de cliente sin autorizacion.
- No usar imagenes de terceros sin licencia.
- No compartir API tokens por correo o chat.
- Rotar el API token si se comparte con una herramienta externa.
- El sitio ya permite cargar media desde `media.velkor.com.mx` en CSP y Next Image.

## Fallback

Si las variables R2 no estan configuradas, Strapi puede seguir arrancando, pero los uploads quedan en almacenamiento local del contenedor. Eso sirve para pruebas, no para produccion. Para aprobar produccion, `R2_PUBLIC_URL` y las credenciales de R2 deben estar configuradas y validadas.
