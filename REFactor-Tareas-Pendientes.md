# Refactors y Tareas Pendientes (Post Estabilización)

Este documento lista mejoras sugeridas para aplicar SOLO después de que el frontend esté estable y compilando sin errores. La idea es reducir CSS duplicado, apoyarse más en utilidades del template (Cuba + Bootstrap) y dejar el código más mantenible.

---
## 1. Iconos Sociales
**Objetivo:** Unificar estilos de iconos sociales aprovechando clases globales y variables del tema.
- Reemplazar cualquier bloque local (.social-icon, tamaños hardcode) por utilidades Bootstrap (`d-inline-flex`, `align-items-center`, `justify-content-center`, `rounded-circle`, `shadow-sm`).
- Crear (o reutilizar) una clase utilitaria única: `.social-circle` (44x44, mismo efecto hover) en un solo lugar global.
- Usar variables: `$fb-color`, `$instagram-color`, `$twitter-color`, `$black` para backgrounds.
- Evaluar si el template Cuba ya provee variantes (p.ej. `.btn-facebook`, `.btn-twitter`). Si existen, extenderlas en lugar de redefinir.
- Minimizar gradientes custom: usar `$instagram-color` centralizado.

### Checklist:
- [ ] Auditar vistas que usan iconos sociales (news-detail, footer, perfil, etc.)
- [ ] Introducir `.social-circle` global SOLO una vez estable.
- [ ] Reemplazar HTML antiguo (clases custom) por utilidades combinadas.
- [ ] Eliminar CSS duplicado tras migración.

---
## 2. Imports SCSS y Variables
**Problema Detectado:** Rutas relativas frágiles y uso mezclado de `@import` y `@use`.
- Migrar gradualmente a `@use` para evitar colisiones y dejar nombres calificados (ej: `@use '.../variables' as vars;`).
- Configurar `stylePreprocessorOptions.includePaths` en `angular.json` para imports más cortos (`@use 'variables'`).
- Eliminar cualquier fallback con `variable-exists` que genera errores y oculta problemas reales.

### Checklist:
- [ ] Añadir includePaths.
- [ ] Crear alias de variables con `@forward` si el template lo permite.
- [ ] Documentar convención en README principal.

---
## 3. News Detail (Imagen y Layout)
**Oportunidad:** Usar las clases globales de contenedores de imagen ya definidas (`img-container-16-9`, etc.).
- Sustituir el bloque `.news-detail-image-container` por `<div class="img-container-16-9"><img class="img-responsive" ...></div>`.
- Validar que alturas máximas (350/400/500) se mantienen: si no, crear variantes utilitarias (`.img-max-350`, `.img-max-400`, `.img-max-500`).
- Reducir comentarios extensos moviendo documentación técnica a un MD separado (`docs/ui-image-guidelines.md`).

### Checklist:
- [ ] Probar sustitución en mobile/tablet/desktop.
- [ ] Crear utilidades de altura si necesario.
- [ ] Limpiar SCSS del componente.

---
## 4. Alerta Configurable (News Detail)
**Mejora:** Centralizar patrón de alerta con título, texto HTML y botones dinámicos.
- Extraer un componente standalone `AlertActionsComponent` con inputs: `type`, `title`, `htmlText`, `actions[]`.
- Añadir evento `actionTriggered(action)` para telemetría / logging.
- Establecer diseño accesible (roles, `aria-live="polite"` para alertas informativas temporales).

### Checklist:
- [ ] Crear componente en `shared/components/alert-actions`.
- [ ] Reemplazar implementación directa en news-detail.
- [ ] Reutilizar en otras páginas (panel admin, moderación, etc.).

---
## 5. Tags Dinámicos
**Estado:** Tags se derivan de `category/status/tags`.
- Definir interface clara: `NewsTag { label: string; type?: 'status' | 'category' | 'custom'; colorClass?: string }`.
- Crear servicio de mapping color (`TagStyleService`) para desacoplar la lógica de `if (...) return 'bg-primary'`.
- Permitir traducción (i18n) de etiquetas.

### Checklist:
- [ ] Crear interface y servicio.
- [ ] Reemplazar lógica inline en componente.
- [ ] Añadir pipe opcional para formateo / normalización.

---
## 6. Accesibilidad (A11y)
- Añadir `aria-label` y `title` consistente en iconos sociales y botones de alerta.
- Verificar contraste de badges (`bg-warning text-dark`, `bg-light text-dark`).
- Añadir `role="alert"` + `aria-live` apropiado según severidad.
- Revisión de navegación por teclado (tab order, foco visible en botones dinámicos).

### Checklist:
- [ ] Pasar auditoría con Lighthouse / axe.
- [ ] Ajustar colores si ratio < 4.5:1 (texto normal).
- [ ] Agregar skip links si la página crece.

---
## 7. Rendimiento / Carga Inicial
- Lazy load del contenido de News Detail (solo cargar imágenes cuando entren en viewport con `loading="lazy"`).
- Posible separación de módulo de detalle si pesa mucho (standalone ya ayuda, pero podemos aislar assets pesados).
- Cachear tags y pinned items en un `NewsCacheService`.

### Checklist:
- [ ] Medir tiempo de primera pintura (FCP) antes y después.
- [ ] Implementar lazy loading imagen.
- [ ] Reutilizar datos cache si se vuelve a abrir la misma noticia.

---
## 8. Testing
- Unit tests para `computedTags()` y mapeo de colores.
- Test de accesibilidad con jest-axe (si se integra).
- Test de componente alerta: render dinámico de acciones, evento de cierre.

### Checklist:
- [ ] Añadir pruebas básicas (mínimo 3).
- [ ] Integrar en pipeline (CI) si existe.

---
## 9. Limpieza de Comentarios y Documentación
- Mover documentación extensa de SCSS (imagen/detail) a un archivo `docs/`.
- Mantener SCSS conciso: sólo reglas + comentarios breves.
- Crear sección "Guías UI" con patrones reutilizables (alertas, tags, iconos, contenedores de imagen).

### Checklist:
- [ ] Crear carpeta `docs/`.
- [ ] Trasladar secciones redundantes.
- [ ] Referenciar en README principal.

---
## 10. Roadmap Secuencial Propuesto
1. Estabilizar build (sin @import rotos, sin variables faltantes).
2. Migrar imágenes al sistema de utilidades global.
3. Extraer alerta dinámica a componente compartido.
4. Refactor tags con servicio de mapeo de estilos.
5. Introducir `.social-circle` (si aún no estable) y limpiar CSS residual.
6. Migrar a `@use` para SCSS.
7. Añadir pruebas unitarias y auditoría A11y.
8. Documentar y limpiar comentarios.

---
## 11. Riesgos y Mitigación
| Riesgo | Mitigación |
|--------|------------|
| Romper estilos existentes al cambiar imports SCSS | Hacer diff visual, aplicar en ramas separadas |
| Variables no encontradas en rutas nuevas | Configurar `includePaths` en `angular.json` antes de migrar |
| Pérdida de comportamiento en alerta al extraer componente | Tests simples de acciones y cierre |
| Degradación de rendimiento por más lógica en servicios | Cache y medición antes/después |

---
## 12. Sugerencias Adicionales
- Adoptar convención BEM mínima para clases locales que queden.
- Establecer un archivo `theme-map.scss` que exponga una lista (map) de colores para asignar dinámicamente a tags.
- Centralizar íconos de Font Awesome en un wrapper `<app-icon name="facebook" />` para desacoplar markup.

---
## 13. Estado Actual Resumido
- Refactor social revertido: pendiente reintroducción ordenada.
- Variables SCSS: ruta debe revisarse (se rompieron componentes al intentar import múltiple).
- News Detail: aún con estilos específicos; listo para migrar a utilidades.

---
## 14. Próximo Paso Recomendado
Iniciar por una rama "refactor/scss-imports" ajustando `angular.json` (includePaths) y validando compilación **sin** cambios funcionales. Luego aplicar refactors incrementales siguiendo el roadmap.

---
## 15. Cómo Validar Cada Paso
- Visual (navegar páginas afectadas).
- Console (sin errores de Sass / Angular).
- Lighthouse / axe para A11y y performance.
- Tests unitarios para lógica nueva.

---
Cualquier refactor debe hacerse de forma incremental y con rollback fácil. Este archivo sirve como guía priorizada; adapta según avance real del proyecto.
