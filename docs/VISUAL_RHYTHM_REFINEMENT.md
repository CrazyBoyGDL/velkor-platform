# Visual Rhythm & Motion Refinement

Fecha: 2026-05-15

## Auditoria previa

- La arquitectura existente se preservo: no se tocaron Strapi, CRM, scoring, propuesta, automatizaciones ni APIs.
- El landing tenia una cadencia repetitiva basada en titulo, parrafo y contenedores tipo card.
- La jerarquia tipografica dependia demasiado de pesos fuertes y tracking negativo.
- La motion language estaba centrada en reveals simples y no en una logica de infraestructura.
- Light mode funcionaba como inversion superficial del dark mode.
- Mobile mantenia demasiado contenido del escritorio sin condensar el ritmo consultivo.

## Cambios aplicados

- Se refino el sistema tipografico global: tracking normalizado, pesos menos agresivos, headings editoriales y ledes con mejor respiracion.
- El hero ahora usa una composicion editorial por niveles: infraestructura, operacion y evidencia, con copy mas directo y senales operativas en rail.
- Se redujo la dependencia de cards: los resultados pasan a metric rail, los artefactos a superficies documentales y los riesgos a filas con control minimo.
- Se agrego `OperationalStoryboard` como bloque integrado de storytelling operativo, conectado a evidencia y casos existentes.
- Anime.js se mantuvo como sistema existente de micro-motion, ajustando el reveal a activacion por blur/clip-path en lugar de fade-up generico.
- La topologia canvas usa densidad adaptativa, DPR controlado y reduced motion.
- Light mode recibio una filosofia propia: documento tecnico, superficies de papel, menor glow, contraste mas legible.
- Mobile condensa las senales del hero y ajusta escalas/ritmos para lectura consultiva.

## Motion audit

- Antes: entradas opacity-only y grid reveal con desplazamiento vertical evidente.
- Despues: activacion suave con blur corto, clip-path y stagger de baja amplitud.
- La topologia conserva movimiento ambientado y funcional; no se agregaron efectos decorativos ni paralax exagerado.
- Hover de paneles mantiene inercia tactil, con radios y superficies mas sobrias.

## Typography audit

- Tracking negativo eliminado en clases display/heading/title.
- Pesos `black`/`extrabold` removidos de las piezas refinadas del landing, navegacion y footer.
- Display hero reducido para evitar fatiga visual y mejorar escaneo.
- `section-heading` y `editorial-lede` centralizan el ritmo principal.

## Mobile UX summary

- Hero con densidad reducida: solo senales prioritarias en mobile.
- CTAs conservan target tactil y jerarquia clara.
- Storytelling operacional cae a una sola columna sin comprimir desktop.
- Diagramas y rails mantienen estructuras legibles con puntos de entrada claros.

## Cleanup summary

- No se crearon rutas muertas ni sistemas paralelos.
- No se duplicaron motores de animacion; se extendio `AnimeMotion` y `motion.ts`.
- No se hardcodeo contenido operacional nuevo desde Strapi; el cambio se limita a narrativa visual del landing ya existente.
- Se mantuvo compatibilidad con reduced motion.

## QA

- `npm run type-check -w apps/web` pasa.
- `npm run build -w apps/web` pasa. Durante build local aparecen avisos esperados de Strapi offline por `ECONNREFUSED`, sin fallar la compilacion.
- Capturas before/after generadas en `C:/Users/sandr/AppData/Local/Temp/velkor-visual-rhythm`.
