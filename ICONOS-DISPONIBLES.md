# Íconos Disponibles para Menu

Estos íconos están disponibles en `public/assets/svg/icon-sprite.svg`.
Para usarlos en `menu.ts`, solo usa el nombre base (sin `stroke-` o `fill-`).

## Íconos Principales

- `home` - Inicio
- `widget` - Widgets
- `layout` - Diseño
- `project` - Proyectos
- `file` - Archivos
- `file-text` - Texto/Documentos
- `board` - Tablero
- `kanban` - Tablero Kanban
- `ecommerce` - Comercio
- `email` - Correo
- `chat` - Chat
- `user` - Usuario
- `users` - Usuarios
- `calendar` - Calendario
- `task` - Tareas
- `to-do` - Lista de tareas

## Configuración y Administración

- `settings` - Configuración
- `tool` - Herramientas
- `icons` - Íconos
- `button` - Botones
- `form` - Formularios
- `table` - Tablas
- `search` - Búsqueda

## Reportes y Análisis

- `report` - Reporte
- `reports` - Reportes
- `charts` - Gráficos
- `api` - API

## Contenido y Comunicación

- `blog` - Blog
- `bookmark` - Favoritos
- `contact` - Contactos
- `social` - Redes sociales
- `gallery` - Galería
- `msg` - Mensajes

## Páginas y Navegación

- `sample-page` - Página de ejemplo
- `layers` - Capas
- `landing-page` - Página de inicio
- `sitemap` - Mapa del sitio
- `folder` - Carpeta
- `files` - Archivos

## Especiales

- `award` - Premio/Certificación
- `faq` - Preguntas frecuentes
- `support-tickets` - Tickets de soporte
- `job-search` - Búsqueda de empleos
- `learning` - Aprendizaje
- `knowledgebase` - Base de conocimientos
- `maps` - Mapas
- `editors` - Editores

## Otros

- `ui-kits` - Kits de UI
- `bonus-kit` - Kit bonus
- `animation` - Animación
- `price` - Precios
- `starter-kit` - Kit inicial
- `error` - Error
- `authenticate` - Autenticación
- `coming-soon` - Próximamente
- `internationalization` - Internacionalización

## Uso

```typescript
{
  title: "Mi Página",
  icon: "calendar",  // Solo el nombre, sin "stroke-" o "fill-"
  type: "link",
  path: "/mi-pagina"
}
```

El template automáticamente usa la versión `stroke-` del ícono.
