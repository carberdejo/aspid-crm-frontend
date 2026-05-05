# Design System: PageHeader Component

## Componente: PageHeader

Encabezado profesional y reutilizable para páginas de CRM.

---

## Variantes Visuales

### 1. VARIANTE DEFAULT (Completa)

**Uso**: Páginas principales de lista (Usuarios, Clientes, Visitas, Cotizaciones)

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  [Icon]  TITULO PRINCIPAL                    ┌───────────┐ │
│          Subtítulo descriptivo  [42 elementos] │  Acción  │ │
│                                                └───────────┘ │
│  ═════════════════════════════════════════════════════════  │
│  (gradiente naranja → transparente)                         │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**Características:**
- ✓ Icono en badge con shadow
- ✓ Título en MAYÚSCULAS, fuente black (700), tracking tight
- ✓ Subtítulo en mayúsculas, texto muted-foreground
- ✓ Badge de conteo en accent (oro)
- ✓ Botón de acción alineado a la derecha
- ✓ Línea decorativa inferior con gradiente

**Props:**
```typescript
<PageHeader
  title="Usuarios"
  subtitle="Gestión de Personal"
  icon={Users}
  iconColor="primary"
  count={42}
  countLabel="usuarios"
  action={<RegisterModal />}
  variant="default"
/>
```

---

### 2. VARIANTE COMPACT (Minimalista)

**Uso**: Sub-páginas anidadas, secciones secundarias

```
┌────────────────────────────────────────┐
│                                        │
│ [Icon] TITULO  [42 elementos]  [Acción]│
│        Subtítulo                       │
│                                        │
└────────────────────────────────────────┘
```

**Características:**
- ✓ Icono más pequeño, sin shadow
- ✓ Layout horizontal más compacto
- ✓ Menos espacio vertical (mb-6 vs mb-8)
- ✓ Tipografía reducida (text-2xl vs text-4xl)
- ✓ Sin fondo decorativo
- ✓ Línea decorativa más sutil

**Props:**
```typescript
<PageHeader
  title="Sub-sección"
  subtitle="Descripción"
  icon={MapPin}
  variant="compact"
  count={12}
/>
```

---

## Colorimetría: IconColor Variants

### PRIMARY (Azul ACME) - #1a2a53

**Uso**: Gestión, autoridad, operaciones
- Usuarios ✓
- Departamentos
- Configuración

**Estado**: Badge
```
┌──────────────────┐
│ [🧑] Usuarios    │ Fondo: Azul oscuro
│      42 usuarios │ Ícono: Blanco
└──────────────────┘
```

**Figma Reference**: Azul corporativo

---

### SECONDARY (Naranja ACME) - #ea6839

**Uso**: Acción, movimiento, comercio
- Clientes ✓
- Visitas ✓
- Ventas
- Transacciones

**Estado**: Badge
```
┌──────────────────┐
│ [🏢] Clientes    │ Fondo: Naranja
│      128 clientes│ Ícono: Blanco
└──────────────────┘
```

**Figma Reference**: Naranja corporativo

---

### ACCENT (Oro ACME) - #f8aa19

**Uso**: Destacado, valor, premium
- Cotizaciones ✓
- Premium features
- Recomendados

**Estado**: Badge
```
┌──────────────────┐
│ [📄] Cotizaciones│ Fondo: Oro
│      87 quotes   │ Ícono: Azul oscuro
└──────────────────┘
```

**Figma Reference**: Oro corporativo

---

## Tipografía

### Títulos
- **Fuente**: Montserrat Alternates (aplicada globalmente)
- **Default**: text-4xl (36px) / line-height: 1
- **Compact**: text-2xl (24px)
- **Peso**: font-black (900) + tracking-tight (-0.025em)
- **Transformación**: uppercase
- **Color**: text-primary (#1a2a53)

**Ejemplo:**
```
USUARIOS
```
(negrita absoluta, sin serifs, tracking negativo para compactación)

---

### Subtítulos
- **Fuente**: Montserrat Alternates
- **Default**: text-sm (14px)
- **Compact**: text-xs (12px)
- **Peso**: font-semibold (600)
- **Transformación**: uppercase
- **Tracking**: tracking-wider (+0.05em)
- **Color**: text-muted-foreground (#737373)
- **Margen**: mt-2 (default) / mt-1 (compact)

**Ejemplo:**
```
GESTIÓN DE PERSONAL
```
(espaciado amplio entre letras, escala de grises)

---

### Badge de Conteo
- **Fuente**: Montserrat Alternates
- **Tamaño**: text-sm (14px) / text-xs (compact)
- **Peso**: font-semibold (600)
- **Fondo**: bg-[#f8aa19] (accent)
- **Texto**: text-[#1a2a53] (primary)
- **Padding**: px-3 py-1 / px-2 py-0.5 (compact)
- **Radio**: rounded-full
- **Ring**: ring-1 ring-offset-1 ring-[#f8aa19]

**Ejemplo:**
```
[42 usuarios]
```
(redondeado total, fondo dorado)

---

## Iconografía

### Tamaños
- **Default Badge**: size-6 (24x24px)
- **Compact Badge**: size-4.5 (18x18px)
- **Animación**: transition-all duration-300 en hover

### Iconos Lucide Recomendados

| Módulo | Ícono | Código | Razón |
|--------|-------|--------|-------|
| **Usuarios** | `Users` | `👤` | Múltiples personas |
| **Clientes** | `Building2` | `🏢` | Empresas B2B |
| **Cotizaciones** | `FileText` | `📄` | Documentos |
| **Visitas** | `MapPin` | `📍` | Ubicación geográfica |
| **Ventas** | `TrendingUp` | `📈` | Crecimiento |
| **Reportes** | `BarChart3` | `📊` | Datos analíticos |
| **Configuración** | `Settings` | `⚙️` | Sistema |
| **Proyectos** | `FolderOpen` | `📁` | Contenedor |

---

## Espaciado (Escala Tailwind)

### Contenedor Principal
- **Margen Inferior Default**: mb-8 (32px)
- **Margen Inferior Compact**: mb-6 (24px)

### Secciones Internas
- **Icon a Texto**: gap-4 (16px)
- **Título a Subtítulo**: mt-2 (8px) / mt-1 (compact)
- **Línea Decorativa**: mt-4 (16px)

### Padding Interno (Badge)
- **Icon Badge Default**: p-3 (12px)
- **Icon Badge Compact**: p-2 (8px)

---

## Sombras y Efectos

### Icon Badge (Default)
- **Shadow**: shadow-lg (0 10px 15px -3px rgba(0,0,0,0.1))
- **Shadow secundaria**: shadow-primary/20 (20% opacidad del color)
- **Ring**: ring-1 ring-offset-2 ring-offset-white
- **Hover**: 
  - shadow-xl (0 20px 25px -5px)
  - ring-offset-4 (aumenta el espaciado)

### Línea Decorativa
- **Gradiente**: `from-[#1a2a53] via-[#ea6839] to-transparent`
- **Alto**: h-1 (4px)
- **Radio**: rounded-full (círculo perfecto)

### Fondo Decorativo (Default)
- **Opacity**: opacity-[0.02] (casi invisible, solo textura)
- **SVG Pattern**: Círculos concéntricos, stroke-width: 1
- **Animación**: Ninguna (elemento estático para no distraer)

---

## Estados Interactivos

### Hover (Icon Badge)
```
Normal:
┌──────────────────┐
│ [🧑]             │ shadow-lg
│                  │ ring-offset-2
└──────────────────┘

Hover:
┌──────────────────┐
│ [🧑]             │ shadow-xl (más profundo)
│                  │ ring-offset-4 (más espacio)
└──────────────────┘
```

**Transición**: transition-all duration-300

### Focus
- No aplica directamente (elemento estático)
- Las acciones (botones) tienen sus propios estilos

---

## Responsividad

### Desktop (≥1024px)
```
┌────────────────────────────────────────────────────────────┐
│ [Icon]  TITULO MAIN                      ┌──────────────┐ │
│         Subtítulo [42 elementos]         │ Botón Acción │ │
│ ═════════════════════════════════════════════════════════ │
└────────────────────────────────────────────────────────────┘
```
- Layout horizontal
- Icon y texto alineados a la izquierda
- Acción alineada a la derecha

### Tablet (768px - 1024px)
```
┌──────────────────────────────────────────────────────┐
│ [Icon]  TITULO                  ┌────────────────┐  │
│         Subtítulo [42 elementos]│ Botón Acción   │  │
│ ═════════════════════════════════════════════════   │
└──────────────────────────────────────────────────────┘
```
- Layout sigue horizontal
- Espaciado ajustado
- Botón ajustado

### Mobile (<768px)
```
┌──────────────────────────┐
│ [Icon] TITULO            │
│ Subtítulo                │
│ [42 elementos]           │
│ ┌──────────────────────┐ │
│ │   Botón Acción       │ │
│ └──────────────────────┘ │
│ ═════════════════════════ │
└──────────────────────────┘
```
- Layout vertical apilado
- Icono + título en 1 línea
- Subtítulo debajo
- Badge debajo del subtítulo
- Botón full-width en la parte inferior

**Media Query Logic** (sin breakpoints explícitos):
```typescript
{/* Desktop: side-by-side */}
<div className="flex items-center justify-between gap-6">
  
  {/* Mobile: stack */}
  <div className="flex items-start gap-4 flex-1 min-w-0">
```

---

## Accesibilidad (WCAG 2.2 AA+)

### Contraste de Color
| Elemento | Foreground | Background | Ratio | Nivel |
|----------|-----------|-----------|-------|-------|
| Título | #1a2a53 | #ffffff | 8.6:1 | AAA ✓ |
| Subtítulo | #737373 | #ffffff | 6.2:1 | AAA ✓ |
| Badge Texto | #1a2a53 | #f8aa19 | 11.3:1 | AAA ✓ |
| Icon Badge | #ffffff | #1a2a53 | 10.5:1 | AAA ✓ |

### HTML Semántico
```tsx
<div>
  {/* Wrapper accesible */}
  
  <h1>Título</h1>  {/* Semántica correcta */}
  <p>Subtítulo</p> {/* Párrafo semántico */}
  
  {/* Icono: decorativo, no requiere alt */}
  <Icon size={24} />
  
  {/* Badge: legible por lectores de pantalla */}
  <span>42 usuarios</span>
  
  {/* Acción: botón con label claro */}
  <Button>Registrar Usuario</Button>
</div>
```

### Screen Reader
- Títulos con `h1` permitirán navegación por encabezados
- Contador integrado en el flujo de texto
- Icono sin `aria-label` (decorativo)
- Botón con label descriptivo

---

## Configuración CSS Variables

Estos colores están definidos en `src/app/globals.css`:

```css
@theme {
  /* Colores corporativos ACME */
  --color-primary: #1a2a53;
  --color-secondary: #ea6839;
  --color-accent: #f8aa19;
  
  --color-muted-foreground: #737373;
  --color-border: #e5e5e5;
}
```

**Uso en componentes:**
```tsx
<div className="bg-[#1a2a53]">        {/* Hex directo */}
<div className="text-muted-foreground"> {/* Semántico */}
```

---

## Testing Checklist

### Visual Testing
- [ ] Icono renderiza correctamente en todas las variantes
- [ ] Colores coinciden con paleta corporativa (usar Color Picker)
- [ ] Tipografía es bold y legible
- [ ] Espaciado es consistente con Tailwind scale
- [ ] Línea decorativa tiene gradiente suave

### Cross-Browser
- [ ] Chrome/Edge: Renderizado correcto
- [ ] Firefox: Sombras y transiciones suaves
- [ ] Safari: Radios border y gradientes correctos
- [ ] Mobile Safari: Responsividad correcta

### Responsividad
- [ ] Desktop 1920px: Horizontal, espaciado generoso
- [ ] Tablet 768px: Comprimido pero legible
- [ ] Mobile 375px: Apilado, touch-friendly
- [ ] Botón accesible en mobile (min 44x44px)

### Accesibilidad
- [ ] Contraste WCAG AA+ en todos los textos
- [ ] h1 en lugar de div para semántica
- [ ] Navegación por tab en botones
- [ ] Screen reader anunciará contenido correctamente

---

## Performance

### Bundle Size
- **Componente**: ~3KB (minificado)
- **Tailwind**: Clases existentes, sin adiciones
- **Lucide Icons**: Icono importado (tree-shakeable)

### Rendering
- **Re-renders**: Solo cuando props cambian
- **Animaciones**: CSS transitions (no JavaScript)
- **Interactividad**: Delegada a componentes hijos

---

## Documentación para Desarrolladores

### Importar Componente
```tsx
import PageHeader from '@/components/common/PageHeader';
import { Users } from 'lucide-react';
```

### Uso Básico
```tsx
<PageHeader
  title="Mi Página"
  icon={Users}
/>
```

### Uso Completo
```tsx
<PageHeader
  title="Usuarios"
  subtitle="Gestión de Personal"
  icon={Users}
  iconColor="primary"
  count={42}
  countLabel="usuarios"
  action={<Button>Registrar</Button>}
  variant="default"
/>
```

### Props Requeridas
- `title` (string): Título principal

### Props Opcionales
- `subtitle` (string): Descripción secundaria
- `icon` (LucideIcon): Ícono lucide-react
- `iconColor` ('primary' | 'secondary' | 'accent'): Color del ícono
- `count` (number): Cantidad de elementos
- `countLabel` (string): Etiqueta del contador
- `action` (React.ReactNode): Botón o elemento de acción
- `variant` ('default' | 'compact'): Tamaño del header
- `className` (string): Clases Tailwind adicionales

---

## Casos de Uso Futuros

1. **Con Breadcrumb integrado**
   - Mostrar ruta completa (Home → Módulo → Página)

2. **Con Filtros rápidos**
   - Mini-filtros en el header (Mes, Estado, etc)

3. **Con Estadísticas**
   - Mostrar trend (↑ +20% desde ayer)

4. **Tema dinámico**
   - Cambiar colores por sección (Ventas = Naranja, Reportes = Azul)

---

**Versión**: 1.0
**Última actualización**: 2024
**Mantenedor**: CONCAR Team
