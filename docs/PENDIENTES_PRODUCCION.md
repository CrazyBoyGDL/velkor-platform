# Seguimiento: mejoras del sitio y publicación

Actualizado: 5 de noviembre de 2026. Objetivo autorizado: mejorar claridad, experiencia, rendimiento y protección contra spam; integrar en `main`, desplegar y validar en producción.

## Hecho localmente

- [x] Revisado el repositorio y el sitio público; `main` local y remoto estaban en `59d6080ded3db39e63d8aef59b6f96f9db489845` al verificar.
- [x] Texto inicial y resumen de servicios más claros; eliminada información técnica interna del pie de página.
- [x] Mensaje de contacto obligatorio con 15 a 2000 caracteres y validación en servidor.
- [x] Límite local de mensajes idénticos durante 30 minutos; se libera si falla la entrega. Es por instancia y se pierde al reiniciar: no sustituye un almacén compartido.
- [x] Tiempo máximo de 3 segundos para consultas de lectura a Strapi, con el mecanismo de respaldo existente.
- [x] Revisada la captura: los dominios web están detrás del proxy de Cloudflare y apuntan a Railway. No se han modificado DNS ni servicios externos.

## Pendiente antes de producción

- [ ] Completar el diseño y revisión de navegación para públicos técnicos, no técnicos y ejecutivos; revisar móvil, contraste y accesibilidad.
- [ ] Medir rendimiento real antes y después; identificar costos de JavaScript, animaciones y llamadas de red. La mejora de tiempo de espera de Strapi no demuestra por sí sola una mejora general.
- [x] Instalar dependencias web, sincronizar el lockfile y ejecutar type-check y build. Strapi no estaba disponible localmente; se usó el contenido de respaldo.
- [ ] Revisar límites y deduplicación compartidos entre instancias y reinicios; evaluar infraestructura disponible antes de elegir Redis u otra solución.
- [ ] Crear o confirmar widget Turnstile en Cloudflare para `velkor.com.mx` y `www.velkor.com.mx`; configurar en el servicio web de Railway `NEXT_PUBLIC_TURNSTILE_SITE_KEY` y `TURNSTILE_SECRET_KEY` como pareja, con la clave pública disponible durante la compilación. Mantener la clave secreta fuera del repositorio y del chat. Confirmar que `TURNSTILE_FAIL_OPEN=false`.
- [ ] Revisar y probar todos los formularios y rutas que envían correo, no solo `/api/contacto`; comprobar límites y configuración efectiva en producción.
- [ ] Verificar si el correo repetido proviene de formularios o directamente a direcciones públicas; Turnstile solo protege los formularios que lo usan.
- [x] Revisar cambios y `git diff --check`; comprobar el estado remoto de `main`.
- [x] Enviar el commit `f019824` a `main`; el dominio público respondió HTTP 200 y mostró el nuevo encabezado el 5 de noviembre de 2026. El endpoint de salud respondió `degraded` con tres variables recomendadas faltantes. No se confirmó el estado interno del despliegue en Railway.
- [ ] Validar en producción visualmente en móvil y escritorio, probar formulario legítimo y protección contra duplicados/bots sin generar correos innecesarios, y revisar logs y salud del servicio.

## Accesos y precauciones

No se han confirmado acceso de escritura a Cloudflare ni Railway. Pedir al usuario que configure las claves en sus paneles si no hay una conexión disponible; no solicitar que publique la clave secreta en el chat. La captura de DNS por sí sola no confirma el estado de Turnstile, reglas WAF ni despliegue. La rama `main` puede desplegar automáticamente; no hacer push hasta completar las verificaciones.
