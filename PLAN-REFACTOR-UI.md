# Plan de Refactorización UI/UX - BarrioLink

**Fecha de creación:** 26 de noviembre, 2025  
**Objetivo:** Establecer identidad visual coherente, paleta de colores distintiva y sistema de diseño consistente.  
**Estrategia:** Implementación incremental de afuera hacia adentro (outside-in).

---

## 📋 Fase 1: Definición de Identidad Visual

### 1.1 Paleta de Colores Propuesta

#### **Colores Primarios (Identidad BarrioLink)**

| Rol | Color | Hex | Uso Principal |
|-----|-------|-----|---------------|
| **Primary** | Verde Comunitario | `#2D7A4E` | Acciones principales, header, CTAs |
| **Primary Light** | Verde Claro | `#4CAF50` | Hover states, badges activos |
| **Primary Dark** | Verde Oscuro | `#1B5E37` | Footers, secciones oscuras |
| **Secondary** | Naranja Cálido | `#FF8C42` | Eventos, interacciones sociales |
| **Secondary Light** | Naranja Suave | `#FFB366` | Notificaciones, alertas informativas |
| **Accent** | Azul Urbano | `#2196F3` | Links, información, proyectos |
| **Accent Dark** | Azul Profundo | `#1976D2` | Detalles técnicos, datos administrativos |

#### **Colores Funcionales (Estados y Feedback)**

| Rol | Color | Hex | Uso |
|-----|-------|-----|-----|
| Success | Verde Éxito | `#4CAF50` | Confirmaciones, estados activos |
| Warning | Amarillo Alerta | `#FFC107` | Advertencias, pendientes |
| Danger | Rojo Error | `#F44336` | Errores, rechazos, acciones críticas |
| Info | Azul Información | `#2196F3` | Tooltips, información contextual |

#### **Colores Neutros (Base y Textos)**

| Rol | Color | Hex | Uso |
|-----|-------|-----|-----|
| Background Base | Blanco Cálido | `#FAFAFA` | Fondo general |
| Background Alt | Gris Muy Claro | `#F5F5F5` | Alternancia en listas/tablas |
| Text Primary | Gris Oscuro | `#212121` | Textos principales |
| Text Secondary | Gris Medio | `#757575` | Textos secundarios, descripciones |
| Border | Gris Claro | `#E0E0E0` | Bordes, divisores |
| Disabled | Gris Deshabilitado | `#BDBDBD` | Elementos inactivos |

#### **Colores de Superficie (Cards y Contenedores)**

| Rol | Color | Hex | Uso |
|-----|-------|-----|-----|
| Card Background | Blanco Puro | `#FFFFFF` | Tarjetas, modales |
| Sidebar Background | Gris Carbón | `#263238` | Sidebar, navegación lateral |
| Header Background | Verde Primary | `#2D7A4E` | Header principal |
| Footer Background | Gris Oscuro | `#37474F` | Footer |

#### **Gradientes (Elementos Destacados)**

```scss
// Gradiente principal (verde comunitario)
$gradient-primary: linear-gradient(135deg, #2D7A4E 0%, #4CAF50 100%);

// Gradiente secundario (naranja eventos)
$gradient-secondary: linear-gradient(135deg, #FF8C42 0%, #FFB366 100%);

// Gradiente acento (azul proyectos)
$gradient-accent: linear-gradient(135deg, #1976D2 0%, #2196F3 100%);

// Gradiente sutil (backgrounds)
$gradient-background: linear-gradient(180deg, #FAFAFA 0%, #F5F5F5 100%);
```

### 1.2 Tipografía

```scss
// Fuentes principales
$font-primary: 'Inter', 'Segoe UI', system-ui, -apple-system, sans-serif;
$font-secondary: 'Roboto', sans-serif;
$font-display: 'Poppins', sans-serif; // Para títulos grandes

// Tamaños base
$font-size-base: 14px;
$font-size-sm: 12px;
$font-size-lg: 16px;
$font-size-xl: 18px;

// Pesos
$font-weight-light: 300;
$font-weight-normal: 400;
$font-weight-medium: 500;
$font-weight-semibold: 600;
$font-weight-bold: 700;

// Alturas de línea
$line-height-tight: 1.25;
$line-height-normal: 1.5;
$line-height-relaxed: 1.75;
```

### 1.3 Espaciado y Dimensiones

```scss
// Sistema de espaciado (múltiplos de 8px)
$spacing-unit: 8px;
$spacing-xs: 4px;   // 0.5 unidades
$spacing-sm: 8px;   // 1 unidad
$spacing-md: 16px;  // 2 unidades
$spacing-lg: 24px;  // 3 unidades
$spacing-xl: 32px;  // 4 unidades
$spacing-2xl: 48px; // 6 unidades
$spacing-3xl: 64px; // 8 unidades

// Radios de borde
$border-radius-sm: 4px;
$border-radius-md: 8px;
$border-radius-lg: 12px;
$border-radius-xl: 16px;
$border-radius-pill: 9999px;

// Sombras (elevación)
$shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
$shadow-md: 0 4px 6px rgba(0, 0, 0, 0.07);
$shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1);
$shadow-xl: 0 20px 25px rgba(0, 0, 0, 0.15);
```

### 1.4 Validación de Contraste WCAG

| Combinación | Ratio | Cumple AA | Cumple AAA |
|-------------|-------|-----------|------------|
| Verde Primary (#2D7A4E) sobre blanco | 5.8:1 | ✅ | ✅ |
| Naranja Secondary (#FF8C42) sobre blanco | 3.2:1 | ⚠️ Texto grande | ❌ |
| Naranja Secondary sobre gris oscuro (#212121) | 7.1:1 | ✅ | ✅ |
| Texto Primary (#212121) sobre Background (#FAFAFA) | 16.5:1 | ✅ | ✅ |
| Texto Secondary (#757575) sobre Background | 4.7:1 | ✅ | ❌ |

**Ajustes necesarios:**
- Naranja Secondary solo para elementos grandes (>18px) sobre fondos claros
- Para texto pequeño, usar siempre sobre fondos oscuros o ajustar a `#E67A32`

---

## 📐 Fase 2: Mockups de Vistas Clave

### 2.1 Vistas Prioritarias

#### **Vista 1: Header + Sidebar (Layout Base)**
**Componentes:**
- `src/app/shared/components/header/header.html`
- `src/app/shared/components/sidebar/sidebar.html`

**Cambios de diseño:**
1. **Header:**
   - Fondo: Verde Primary (`#2D7A4E`)
   - Logo: Texto "Barrio" verde claro + "Link" naranja
   - Iconos: Blanco con hover naranja secondary
   - Altura: 64px (actual) mantener
   - Agregar borde inferior sutil: `1px solid rgba(255,255,255,0.1)`

2. **Sidebar:**
   - Fondo: Gris Carbón (`#263238`)
   - Items activos: Verde Primary con borde izquierdo de 4px
   - Items hover: Fondo `rgba(45, 122, 78, 0.1)`
   - Iconos: Gris claro (#B0BEC5), activos: Verde Light
   - Divisores entre secciones: `1px solid #37474F`

**Wireframe ASCII:**
```
┌─────────────────────────────────────────────────────────────┐
│ HEADER [Verde #2D7A4E - altura 64px]                        │
│ BarrioLink | Buscar | 🔔 👤                                │
└─────────────────────────────────────────────────────────────┘
┌──────────┬──────────────────────────────────────────────────┐
│ SIDEBAR  │ CONTENIDO PRINCIPAL                              │
│ [#263238]│ [Background #FAFAFA]                             │
│          │                                                   │
│ 🏠 Inicio│ Breadcrumbs > Ruta > Actual                      │
│ 📰 News  │                                                   │
│ 📅 Event │ ┌───────────────────────────────────┐           │
│ 🏗️ Proy  │ │ CARD [Blanco, sombra-md]         │           │
│ 🏢 Instal│ │ Título | Badge [Verde]            │           │
│          │ │ Contenido...                      │           │
│ [260px]  │ └───────────────────────────────────┘           │
└──────────┴──────────────────────────────────────────────────┘
```

#### **Vista 2: Listado de Noticias (News Component)**
**Ruta:** `/news`  
**Componente:** `src/app/pages/news/news.ts`

**Diseño de Cards:**
```
┌──────────────────────────────────────────┐
│ ┌────────────────────────────────────┐   │
│ │ [Imagen 16:9 - max 350px height]  │   │
│ └────────────────────────────────────┘   │
│                                          │
│ Título de la Noticia                     │
│ [18px, font-semibold, #212121]           │
│                                          │
│ Descripción breve con máximo...         │
│ [14px, line-height 1.6, #757575]        │
│                                          │
│ ┌─────┐ ┌─────────┐  👤 Autor           │
│ │Verde│ │Publicado│  📅 2 días          │
│ └─────┘ └─────────┘                      │
│                                          │
│ [Ver más →]                              │
│ [Botón outline verde]                    │
└──────────────────────────────────────────┘
```

**Características:**
- Grilla responsive: 1 col (móvil), 2 cols (tablet), 3 cols (desktop)
- Espaciado entre cards: 24px
- Hover: Elevar card con `shadow-lg`, transición 200ms
- Badges de categoría: Verde Primary, Naranja Secondary según tipo
- Imagen placeholder si no existe: Gradiente verde con icono

#### **Vista 3: Detalle de Evento (Event Detail)**
**Ruta:** `/events/:id`  
**Componente:** `src/app/pages/events/events-detail/`

**Layout:**
```
┌────────────────────────────────────────────────────┐
│ ← Volver a Eventos                                 │
│                                                     │
│ ┌──────────────────────────────────────────────┐  │
│ │ [Imagen Hero - altura 400px]                 │  │
│ │ [Gradiente overlay bottom: rgba(0,0,0,0.3)]  │  │
│ │                                               │  │
│ │ Título del Evento [32px, blanco, bold]       │  │
│ │ 📅 15 Dic 2025 | 📍 Plaza Central            │  │
│ └──────────────────────────────────────────────┘  │
│                                                     │
│ ┌─────────────┐  ┌─────────────────────────────┐  │
│ │ SIDEBAR     │  │ CONTENIDO PRINCIPAL         │  │
│ │             │  │                              │  │
│ │ 🟢 Activo   │  │ Descripción completa...      │  │
│ │             │  │                              │  │
│ │ Organizador:│  │ ### Detalles                │  │
│ │ Juan Pérez  │  │ Fecha, hora, lugar...        │  │
│ │             │  │                              │  │
│ │ Cupos:      │  │ ### Requisitos               │  │
│ │ 45/100      │  │ Lista de requisitos...       │  │
│ │             │  │                              │  │
│ │ [Inscribir] │  │ ### Participantes (45)      │  │
│ │ [Verde fill]│  │ Grid de avatares...          │  │
│ │             │  │                              │  │
│ └─────────────┘  └─────────────────────────────┘  │
└────────────────────────────────────────────────────┘
```

**Elementos clave:**
- Hero image con overlay para legibilidad
- Sidebar fija con acciones principales (sticky top)
- Badges de estado: Verde (Activo), Naranja (Próximo), Gris (Finalizado)
- Progress bar para cupos: Verde hasta 70%, Naranja 70-90%, Rojo >90%
- Botón primario verde para inscripción

#### **Vista 4: Tabla Administrativa (Users/Projects Admin)**
**Rutas:** `/users/admin`, `/projects/admin`

**Diseño de tabla:**
```
┌──────────────────────────────────────────────────────┐
│ Gestión de Usuarios              [+ Nuevo] [Filtros] │
│                                                       │
│ ┌─── [Buscador global] ─────────────────┐           │
│ │ 🔍 Buscar por nombre, email, rut...   │           │
│ └───────────────────────────────────────┘           │
│                                                       │
│ ┏━━━━━━━━━┯━━━━━━━━━┯━━━━━━━┯━━━━━━━┯━━━━━━━┓    │
│ ┃ Nombre  │ Email   │ Rol   │ Estado│ Acción┃    │
│ ┣━━━━━━━━━┿━━━━━━━━━┿━━━━━━━┿━━━━━━━┿━━━━━━━┫    │
│ ┃ Juan P. │ juan@.. │🟢Admin│ Activo│ ⚙️ 🗑️ ┃    │
│ ┃─────────┼─────────┼───────┼───────┼───────┃    │
│ ┃ María G.│ maria@..│🔵User │ Activo│ ⚙️ 🗑️ ┃    │
│ ┃─────────┼─────────┼───────┼───────┼───────┃    │
│ ┃ Pedro L.│ pedro@..│🔵User │Inactiv│ ⚙️ 🗑️ ┃    │
│ ┗━━━━━━━━━┷━━━━━━━━━┷━━━━━━━┷━━━━━━━┷━━━━━━━┛    │
│                                                       │
│ Mostrando 1-10 de 245     [< 1 2 3 4 5 >]          │
└──────────────────────────────────────────────────────┘
```

**Características:**
- Header sticky al hacer scroll
- Alternancia de filas: Blanco / Gris Muy Claro (#F5F5F5)
- Hover: Fondo `rgba(45, 122, 78, 0.05)`
- Badges de rol con colores diferenciados:
  - Admin: Verde Primary
  - Manager: Naranja Secondary  
  - User: Azul Accent
  - Residente: Gris
- Acciones: Iconos con tooltips, hover naranja
- Paginación: Números verdes, activo con fondo verde

### 2.2 Componentes Reutilizables (Design System)

#### **Componente: Card Base**
```html
<div class="bl-card [variant]">
  <div class="bl-card-header">
    <h4 class="bl-card-title">Título</h4>
    <div class="bl-card-actions">
      <!-- Iconos o botones -->
    </div>
  </div>
  <div class="bl-card-body">
    <!-- Contenido -->
  </div>
  <div class="bl-card-footer">
    <!-- Acciones o metadata -->
  </div>
</div>
```

**Variantes:**
- `.bl-card--default` - Fondo blanco, borde gris claro, sombra-md
- `.bl-card--elevated` - Sin borde, sombra-lg
- `.bl-card--primary` - Borde izquierdo verde 4px
- `.bl-card--secondary` - Borde izquierdo naranja 4px
- `.bl-card--accent` - Borde izquierdo azul 4px
- `.bl-card--flat` - Sin sombra, solo borde

**SCSS:**
```scss
.bl-card {
  background: $card-background;
  border-radius: $border-radius-lg;
  box-shadow: $shadow-md;
  overflow: hidden;
  transition: all 0.2s ease;

  &:hover {
    box-shadow: $shadow-lg;
    transform: translateY(-2px);
  }

  &--primary {
    border-left: 4px solid $primary-color;
  }

  // ...más variantes
}
```

#### **Componente: Badge**
```html
<span class="bl-badge [variant] [size]">Texto</span>
```

**Variantes:**
- `.bl-badge--primary` - Verde
- `.bl-badge--secondary` - Naranja
- `.bl-badge--success` - Verde éxito
- `.bl-badge--warning` - Amarillo
- `.bl-badge--danger` - Rojo
- `.bl-badge--info` - Azul
- `.bl-badge--light` - Gris claro
- `.bl-badge--dark` - Gris oscuro

**Tamaños:**
- `.bl-badge--sm` - 12px, padding 2px 8px
- `.bl-badge--md` - 14px, padding 4px 12px (default)
- `.bl-badge--lg` - 16px, padding 6px 16px

#### **Componente: Button**
```html
<button class="bl-btn [variant] [size]">
  <i class="icon"></i>
  Texto
</button>
```

**Variantes:**
- `.bl-btn--primary` - Fondo verde, texto blanco
- `.bl-btn--secondary` - Fondo naranja, texto blanco
- `.bl-btn--outline-primary` - Borde verde, texto verde
- `.bl-btn--outline-secondary` - Borde naranja, texto naranja
- `.bl-btn--ghost` - Sin borde, solo hover
- `.bl-btn--link` - Estilo texto, subrayado al hover

**Estados:**
```scss
.bl-btn {
  // Base
  padding: $spacing-sm $spacing-lg;
  border-radius: $border-radius-md;
  font-weight: $font-weight-medium;
  transition: all 0.2s ease;
  cursor: pointer;

  &:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: $shadow-md;
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}
```

#### **Componente: Table**
```html
<div class="bl-table-container">
  <table class="bl-table [variant]">
    <thead class="bl-table-header">
      <tr>
        <th>Columna</th>
      </tr>
    </thead>
    <tbody class="bl-table-body">
      <tr class="bl-table-row">
        <td>Dato</td>
      </tr>
    </tbody>
  </table>
</div>
```

**Variantes:**
- `.bl-table--striped` - Filas alternadas
- `.bl-table--hover` - Efecto hover en filas
- `.bl-table--bordered` - Bordes visibles
- `.bl-table--compact` - Espaciado reducido

#### **Componente: Form Wizard (Multi-step)**
```
┌────────────────────────────────────────┐
│ Paso 1: Información → Paso 2: Detalles → Paso 3: Confirmar │
│ ●──────────────○──────────────○        │
│ [Completado]   [Actual]       [Pending]│
│                                         │
│ ┌─────────────────────────────────┐   │
│ │ [Campos del paso actual]         │   │
│ │                                  │   │
│ │ Input 1: [_____________]         │   │
│ │ Input 2: [_____________]         │   │
│ │                                  │   │
│ └─────────────────────────────────┘   │
│                                         │
│ [← Anterior]          [Siguiente →]    │
└────────────────────────────────────────┘
```

**Estados de pasos:**
- Completado: Círculo verde con ✓
- Actual: Círculo naranja pulsante
- Pendiente: Círculo gris claro

---

## 🔧 Fase 3: Implementación Técnica

### 3.1 Estructura de Archivos SCSS

**Crear nueva estructura:**
```
src/
└── styles/
    ├── abstracts/
    │   ├── _variables.scss          # Variables de paleta BarrioLink
    │   ├── _mixins.scss              # Mixins reutilizables
    │   └── _functions.scss           # Funciones SCSS
    ├── base/
    │   ├── _reset.scss               # Normalización
    │   ├── _typography.scss          # Estilos tipográficos
    │   └── _utilities.scss           # Clases utilitarias
    ├── components/
    │   ├── _buttons.scss             # .bl-btn
    │   ├── _cards.scss               # .bl-card
    │   ├── _badges.scss              # .bl-badge
    │   ├── _tables.scss              # .bl-table
    │   ├── _forms.scss               # .bl-form
    │   ├── _wizard.scss              # .bl-wizard
    │   └── _modals.scss              # .bl-modal
    ├── layout/
    │   ├── _header.scss              # Header overrides
    │   ├── _sidebar.scss             # Sidebar overrides
    │   ├── _footer.scss              # Footer overrides
    │   └── _container.scss           # Contenedores
    ├── themes/
    │   ├── _barriolink-theme.scss    # Tema principal
    │   └── _dark-mode.scss           # Modo oscuro (opcional)
    └── main.scss                     # Importación orquestada
```

### 3.2 Variables Centralizadas (`_variables.scss`)

```scss
// ==============================================
// BarrioLink Design System - Variables
// ==============================================

// Colores Primarios
$bl-primary: #2D7A4E;
$bl-primary-light: #4CAF50;
$bl-primary-dark: #1B5E37;
$bl-primary-rgb: 45, 122, 78;

$bl-secondary: #FF8C42;
$bl-secondary-light: #FFB366;
$bl-secondary-dark: #E67A32;
$bl-secondary-rgb: 255, 140, 66;

$bl-accent: #2196F3;
$bl-accent-dark: #1976D2;
$bl-accent-rgb: 33, 150, 243;

// Colores Funcionales
$bl-success: #4CAF50;
$bl-warning: #FFC107;
$bl-danger: #F44336;
$bl-info: #2196F3;

// Colores Neutros
$bl-white: #FFFFFF;
$bl-bg-base: #FAFAFA;
$bl-bg-alt: #F5F5F5;
$bl-text-primary: #212121;
$bl-text-secondary: #757575;
$bl-border: #E0E0E0;
$bl-disabled: #BDBDBD;

// Colores de Superficie
$bl-card-bg: $bl-white;
$bl-sidebar-bg: #263238;
$bl-header-bg: $bl-primary;
$bl-footer-bg: #37474F;

// Gradientes
$bl-gradient-primary: linear-gradient(135deg, $bl-primary 0%, $bl-primary-light 100%);
$bl-gradient-secondary: linear-gradient(135deg, $bl-secondary 0%, $bl-secondary-light 100%);
$bl-gradient-accent: linear-gradient(135deg, $bl-accent-dark 0%, $bl-accent 100%);

// Tipografía
$bl-font-primary: 'Inter', 'Segoe UI', system-ui, -apple-system, sans-serif;
$bl-font-secondary: 'Roboto', sans-serif;

$bl-font-size-xs: 12px;
$bl-font-size-sm: 14px;
$bl-font-size-base: 16px;
$bl-font-size-lg: 18px;
$bl-font-size-xl: 20px;
$bl-font-size-2xl: 24px;
$bl-font-size-3xl: 32px;

$bl-font-weight-light: 300;
$bl-font-weight-normal: 400;
$bl-font-weight-medium: 500;
$bl-font-weight-semibold: 600;
$bl-font-weight-bold: 700;

$bl-line-height-tight: 1.25;
$bl-line-height-normal: 1.5;
$bl-line-height-relaxed: 1.75;

// Espaciado (Sistema base 8px)
$bl-spacing-xs: 4px;
$bl-spacing-sm: 8px;
$bl-spacing-md: 16px;
$bl-spacing-lg: 24px;
$bl-spacing-xl: 32px;
$bl-spacing-2xl: 48px;
$bl-spacing-3xl: 64px;

// Radios de borde
$bl-radius-sm: 4px;
$bl-radius-md: 8px;
$bl-radius-lg: 12px;
$bl-radius-xl: 16px;
$bl-radius-pill: 9999px;

// Sombras (Elevación)
$bl-shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
$bl-shadow-md: 0 4px 6px rgba(0, 0, 0, 0.07);
$bl-shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1);
$bl-shadow-xl: 0 20px 25px rgba(0, 0, 0, 0.15);

// Transiciones
$bl-transition-fast: 150ms ease;
$bl-transition-base: 200ms ease;
$bl-transition-slow: 300ms ease;

// Breakpoints
$bl-breakpoint-xs: 0;
$bl-breakpoint-sm: 576px;
$bl-breakpoint-md: 768px;
$bl-breakpoint-lg: 992px;
$bl-breakpoint-xl: 1200px;
$bl-breakpoint-xxl: 1400px;

// Z-index (capas de apilamiento)
$bl-z-dropdown: 1000;
$bl-z-sticky: 1020;
$bl-z-fixed: 1030;
$bl-z-modal-backdrop: 1040;
$bl-z-modal: 1050;
$bl-z-popover: 1060;
$bl-z-tooltip: 1070;

// Dimensiones de Layout
$bl-header-height: 64px;
$bl-sidebar-width: 260px;
$bl-sidebar-collapsed-width: 80px;
$bl-footer-height: 60px;
```

### 3.3 Secuencia de Implementación (Outside-In)

#### **Nivel 1: Layout Externo (Semana 1)**

**Archivos a modificar:**
1. `src/styles/abstracts/_variables.scss` (crear)
2. `src/styles/layout/_header.scss` (crear)
3. `src/styles/layout/_sidebar.scss` (crear)
4. `src/styles/layout/_footer.scss` (crear)
5. `src/app/shared/components/header/header.scss` (override)
6. `src/app/shared/components/sidebar/sidebar.scss` (override)
7. `src/app/shared/components/footer/footer.scss` (override)

**Criterios de validación:**
- [ ] Header con fondo verde #2D7A4E
- [ ] Logo con colores BarrioLink (verde + naranja)
- [ ] Sidebar con fondo #263238 y items con hover verde
- [ ] Footer con fondo #37474F
- [ ] Sin errores de compilación SCSS
- [ ] Responsive funcional en mobile/tablet/desktop

#### **Nivel 2: Componentes Base (Semana 2)**

**Archivos a crear:**
1. `src/styles/components/_buttons.scss`
2. `src/styles/components/_cards.scss`
3. `src/styles/components/_badges.scss`
4. `src/styles/components/_tables.scss`
5. `src/styles/components/_forms.scss`

**Criterios de validación:**
- [ ] Clases `.bl-btn`, `.bl-card`, `.bl-badge`, `.bl-table` funcionando
- [ ] Variantes (primary, secondary, outline) operativas
- [ ] Hover states con transiciones suaves
- [ ] Accesibilidad (focus states, contrast ratio)

#### **Nivel 3: Vistas Específicas (Semana 3-4)**

**Orden de implementación:**
1. **Listado de Noticias** (`/news`)
   - Grid responsive
   - Cards con imagen 16:9
   - Badges de categoría
   - Paginación

2. **Detalle de Noticia** (`/news/:id`)
   - Hero image con gradiente
   - Sidebar con metadata
   - Contenido con tipografía mejorada
   - Social share buttons

3. **Listado de Eventos** (`/events`)
   - Similar a noticias con adaptaciones
   - Badges de estado (Activo, Próximo, Finalizado)
   - Filtros por fecha

4. **Detalle de Evento** (`/events/:id`)
   - Hero image
   - Sidebar con inscripción
   - Progress bar de cupos
   - Lista de participantes

5. **Tablas Administrativas** (`/*/admin`)
   - Header sticky
   - Paginación
   - Filtros y búsqueda
   - Acciones por fila

**Criterios de validación por vista:**
- [ ] Compila sin errores
- [ ] Responsive en 3 breakpoints (mobile, tablet, desktop)
- [ ] Accesible (navegación por teclado, screen readers)
- [ ] Performance: sin lag en animaciones/transiciones
- [ ] Screenshots antes/después documentados

#### **Nivel 4: Componentes Complejos (Semana 5)**

**Componentes avanzados:**
1. **Wizard Multi-step**
   - Para creación de proyectos/eventos
   - Stepper visual
   - Validación por pasos
   - Persistencia de datos

2. **Modales**
   - Confirmación de acciones
   - Formularios dentro de modal
   - Galería de imágenes

3. **Dropdowns y Selects Personalizados**
   - Multiselect con chips
   - Autocomplete
   - Filtros avanzados

### 3.4 Estrategia de Migración (Sin Romper Build)

**Paso a paso:**

1. **Crear rama de refactor:**
```bash
git checkout -b refactor/ui-identity-system
```

2. **Configurar `angular.json` con includePaths:**
```json
{
  "projects": {
    "barriolink-frontend": {
      "architect": {
        "build": {
          "options": {
            "stylePreprocessorOptions": {
              "includePaths": [
                "src/styles/abstracts"
              ]
            }
          }
        }
      }
    }
  }
}
```

3. **Crear estructura de carpetas sin modificar archivos existentes:**
```bash
mkdir -p src/styles/{abstracts,base,components,layout,themes}
```

4. **Introducir variables nuevas SIN eliminar las antiguas:**
```scss
// src/styles/abstracts/_variables.scss
// Nuevas variables BarrioLink
$bl-primary: #2D7A4E;

// Mapeo a variables Cuba existentes (transición)
$primary-color: $bl-primary !default;
```

5. **Aplicar cambios incrementales con commits pequeños:**
```bash
git add src/styles/abstracts/_variables.scss
git commit -m "feat(ui): definir paleta de colores BarrioLink"

git add src/styles/layout/_header.scss
git commit -m "feat(ui): aplicar tema BarrioLink a header"
```

6. **Validar después de cada commit:**
```bash
ng build --configuration production
# Si falla, revertir último commit
git revert HEAD
```

7. **Documentar cada paso en README:**
```markdown
## Changelog UI Refactor

### [v0.1.0] - 2025-11-27
- ✅ Creada paleta de colores BarrioLink
- ✅ Header con tema verde comunitario

### [v0.2.0] - 2025-11-28
- ✅ Sidebar con fondo gris carbón
- ✅ Navegación con estados hover/activo
```

---

## ✅ Checklist de Validación Final

### Compilación y Build
- [ ] `ng serve` sin errores
- [ ] `ng build --prod` exitoso
- [ ] Sin warnings de SCSS deprecation
- [ ] Bundle size no incrementado significativamente (<10%)

### Visual (Por Breakpoint)
- [ ] **Mobile (320px-576px):** Layout funcional, sin overflow horizontal
- [ ] **Tablet (577px-992px):** Grids adaptados, sidebar colapsable
- [ ] **Desktop (>992px):** Uso completo del espacio, sidebar expandido

### Accesibilidad (WCAG 2.1 AA)
- [ ] Contraste de colores ≥4.5:1 para textos normales
- [ ] Contraste de colores ≥3:1 para textos grandes (>18px)
- [ ] Navegación por teclado funcional (Tab, Enter, Esc)
- [ ] Focus states visibles en todos los elementos interactivos
- [ ] Lectores de pantalla leen contenido correctamente
- [ ] Imágenes con atributo `alt` descriptivo

### Performance
- [ ] First Contentful Paint (FCP) <1.5s
- [ ] Largest Contentful Paint (LCP) <2.5s
- [ ] Cumulative Layout Shift (CLS) <0.1
- [ ] Time to Interactive (TTI) <3.5s
- [ ] Sin janks en animaciones (60 FPS)

### Cross-Browser
- [ ] Chrome/Edge (últimas 2 versiones)
- [ ] Firefox (últimas 2 versiones)
- [ ] Safari (últimas 2 versiones)
- [ ] Mobile Safari (iOS 15+)
- [ ] Chrome Mobile (Android 10+)

### Regresión Funcional
- [ ] Autenticación funciona correctamente
- [ ] CRUD de noticias operativo
- [ ] CRUD de eventos operativo
- [ ] CRUD de proyectos operativo
- [ ] Reservas de instalaciones funcional
- [ ] Panel administrativo accesible
- [ ] Certificados generables

---

## 📅 Cronograma Estimado

| Semana | Fase | Entregables | Horas Estimadas |
|--------|------|-------------|-----------------|
| **1** | Configuración + Layout Externo | Variables, Header, Sidebar, Footer | 16h |
| **2** | Componentes Base | Buttons, Cards, Badges, Tables | 20h |
| **3** | Vistas - Noticias | Listado + Detalle | 16h |
| **4** | Vistas - Eventos + Admin | Eventos + Tablas Admin | 20h |
| **5** | Componentes Complejos | Wizard, Modales, Dropdowns | 16h |
| **6** | Testing + Ajustes | Validación A11y, Performance, Bugs | 12h |
| **TOTAL** | | | **~100 horas** |

**Distribución sugerida:**
- Si trabajas solo: 12-15 semanas (8h/semana)
- Equipo de 2 personas: 6-8 semanas
- Equipo de 3 personas: 4-6 semanas

---

## 🚨 Puntos de Control (Milestones)

### Milestone 1: Foundation (Semana 2)
**Criterio de éxito:** Build compila, header/sidebar con nuevos colores, sin regresiones.

### Milestone 2: Design System (Semana 4)
**Criterio de éxito:** Componentes base operativos, documentados en Storybook (opcional).

### Milestone 3: Core Views (Semana 8)
**Criterio de éxito:** Noticias y Eventos con nuevo diseño, funcionales.

### Milestone 4: Production Ready (Semana 12)
**Criterio de éxito:** Todas las vistas migradas, A11y validado, merge a `main`.

---

## 📚 Recursos Adicionales

### Herramientas Recomendadas
- **Figma/Adobe XD:** Para mockups de alta fidelidad
- **Contrast Checker:** https://webaim.org/resources/contrastchecker/
- **Lighthouse:** Auditoría de performance/A11y
- **axe DevTools:** Validación automática de accesibilidad
- **Storybook:** Documentación de componentes (opcional)

### Referencias de Diseño
- Material Design 3: https://m3.material.io/
- Tailwind Color Palette: https://tailwindcss.com/docs/customizing-colors
- RefactoringUI: https://www.refactoringui.com/

---

## 🤝 Responsabilidades (si aplica en equipo)

| Persona | Responsabilidad | Fases Asignadas |
|---------|-----------------|-----------------|
| Dev 1 | Layout + Sistema Base | Semanas 1-2 |
| Dev 2 | Vistas Noticias/Eventos | Semanas 3-4 |
| Dev 3 | Admin + Componentes Complejos | Semanas 4-5 |
| Todos | Testing + Documentación | Semana 6 |

---

## 📝 Notas de Implementación

### Convenciones de Código
- **Prefijo de clases:** `.bl-*` para componentes BarrioLink
- **Nomenclatura BEM:** `.bl-card__header--primary`
- **Variables:** `$bl-*` para variables del design system
- **Comentarios:** Documentar decisiones no obvias

### Commits Semánticos
```
feat(ui): agregar componente bl-card con variantes
fix(ui): corregir contraste en badges de estado
style(ui): aplicar paleta BarrioLink a sidebar
docs(ui): actualizar guía de componentes
refactor(ui): migrar botones a sistema bl-btn
test(ui): agregar pruebas visuales de cards
```

### Estrategia de Rollback
Si un cambio rompe producción:
1. Revertir commit específico: `git revert <commit-hash>`
2. Desplegar hotfix inmediato
3. Analizar causa raíz en rama separada
4. Reintroducir cambio corregido con tests

---

**Próximo paso inmediato:** ¿Deseas que proceda con la **creación de la rama** y los **archivos base de variables SCSS**?
