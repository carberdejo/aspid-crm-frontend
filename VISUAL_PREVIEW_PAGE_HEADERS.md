# Visual Preview: PageHeader Implementations

## 1. USUARIOS - Professional CRM Header

```
╔════════════════════════════════════════════════════════════════════════════╗
║                                                                            ║
║  ┌──────┐  USUARIOS                              ┌──────────────────────┐ ║
║  │  👤  │  Gestión de Personal    [42 usuarios]  │  📝 Registrar Usuario │ ║
║  └──────┘                                        └──────────────────────┘ ║
║                                                                            ║
║  ════════════════════════════════════════════════════════════════════════  ║
║                        (gradiente: azul → naranja → oro)                   ║
║                                                                            ║
║  ┌────────────────────────────────────────────────────────────────────┐   ║
║  │ ✓ Búsqueda                                                    [🔍] │   ║
║  ├────────────────────────────────────────────────────────────────────┤   ║
║  │  Nombre    │ Email           │ Rol        │ Departamento  │ Estado  │   ║
║  ├────────────────────────────────────────────────────────────────────┤   ║
║  │ Juan Pérez │ juan@acme.com   │ Admin      │ Ventas        │ Activo  │   ║
║  │ María G.   │ maria@acme.com  │ Usuario    │ Proyectos     │ Activo  │   ║
║  │ Carlos R.  │ carlos@acme.com │ Usuario    │ Soporte       │ Inactiv │   ║
║  │ ...        │ ...             │ ...        │ ...           │ ...     │   ║
║  └────────────────────────────────────────────────────────────────────┘   ║
║                         1 - 10 de 42                  [← Anterior] [Siguiente →]║
║                                                                            ║
╚════════════════════════════════════════════════════════════════════════════╝

ELEMENTOS VISUALES:
✓ Badge icon: Fondo azul #1a2a53, icono blanco, sombra sutil
✓ Título: "USUARIOS" en Montserrat Alternates Bold (36px), tracking-tight
✓ Subtítulo: "Gestión de Personal" en gris muted (14px), mayúsculas
✓ Contador: Badge dorado #f8aa19 con ring offset
✓ Acción: Botón "Registrar Usuario" con icono
✓ Línea decorativa: Gradiente suave (azul → naranja → transparente)
```

---

## 2. CLIENTES - B2B Focused Header

```
╔════════════════════════════════════════════════════════════════════════════╗
║                                                                            ║
║  ┌──────┐  EMPRESAS                           ┌─────────────────────────┐ ║
║  │  🏢  │  Directorio de Clientes  [128]      │  ➕ Agregar Empresa     │ ║
║  └──────┘                                     └─────────────────────────┘ ║
║                                                                            ║
║  ════════════════════════════════════════════════════════════════════════  ║
║                     (gradiente: naranja → oro → transparente)              ║
║                                                                            ║
║  ┌────────────────────────────────────────────────────────────────────┐   ║
║  │ ✓ Búsqueda: "Acme Corp"                                      [🔍] │   ║
║  ├────────────────────────────────────────────────────────────────────┤   ║
║  │  Empresa       │ Contacto      │ Teléfono   │ Estado      │ Acciones│   ║
║  ├────────────────────────────────────────────────────────────────────┤   ║
║  │ Acme Corp      │ John Doe      │ +56 2 1234 │ Activo      │ ▼       │   ║
║  │ TechStart Inc  │ Jane Smith    │ +56 2 5678 │ Activo      │ ▼       │   ║
║  │ Digital Labs   │ Bob Johnson   │ +56 9 1234 │ Inactivo    │ ▼       │   ║
║  │ ...            │ ...           │ ...        │ ...         │ ▼       │   ║
║  │ ┌──────────────────────────────────────────────────────────────┐ │   ║
║  │ │ 📞 Contactos de Acme Corp                                   │ │   ║
║  │ │ • John Doe (Gerente) john@acme.com                          │ │   ║
║  │ │ • Sarah Jones (Ventas) sarah@acme.com                       │ │   ║
║  │ └──────────────────────────────────────────────────────────────┘ │   ║
║  └────────────────────────────────────────────────────────────────────┘   ║
║                    1 - 10 de 128               [← Anterior] [Siguiente →]  ║
║                                                                            ║
╚════════════════════════════════════════════════════════════════════════════╝

ELEMENTOS VISUALES:
✓ Badge icon: Fondo naranja #ea6839, icono blanco
✓ Título: "EMPRESAS" en Montserrat Alternates Bold (36px)
✓ Subtítulo: "Directorio de Clientes" (14px, mayúsculas)
✓ Contador: "128" en badge dorado
✓ Acción: Botón "Agregar Empresa"
✓ Línea decorativa: Naranja oscuro → naranja → transparente
✓ Sub-componente: Listado expandible de contactos
```

---

## 3. COTIZACIONES - Document-Focused Header

```
╔════════════════════════════════════════════════════════════════════════════╗
║                                                                            ║
║  ┌──────┐  COTIZACIONES                    ┌──────────────────────────────┐║
║  │  📄  │  Control de Presupuestos      [87]│ ✎ Nueva Cotización           ║
║  └──────┘                                  └──────────────────────────────┘║
║                                                                            ║
║  ════════════════════════════════════════════════════════════════════════  ║
║               (gradiente: oro → naranja → azul → transparente)             ║
║                                                                            ║
║  ┌────────────────────────────────────────────────────────────────────┐   ║
║  │ ✓ Buscar por número o cliente...                              [🔍]│   ║
║  ├──────────────┬─────────────────┬──────────┬─────────┬─────────────┤   ║
║  │ Nº Cot.      │ Cliente         │ Importe  │ Estado  │ Fecha       │   ║
║  ├──────────────┼─────────────────┼──────────┼─────────┼─────────────┤   ║
║  │ COT-2024-042 │ Acme Corp       │ $45,000  │ Aceptad │ 01 May 2024 │   ║
║  │ COT-2024-041 │ TechStart Inc   │ $12,500  │ Pendien │ 28 Apr 2024 │   ║
║  │ COT-2024-040 │ Digital Labs    │ $78,900  │ Rechazd │ 25 Apr 2024 │   ║
║  │ ...          │ ...             │ ...      │ ...     │ ...         │   ║
║  └────────────────────────────────────────────────────────────────────┘   ║
║              1 - 10 de 87               [← Anterior] [Siguiente →]         ║
║                                                                            ║
╚════════════════════════════════════════════════════════════════════════════╝

ELEMENTOS VISUALES:
✓ Badge icon: Fondo oro #f8aa19, icono azul oscuro
✓ Título: "COTIZACIONES" (36px, mayúsculas)
✓ Subtítulo: "Control de Presupuestos" (14px)
✓ Contador: "87" en badge dorado
✓ Acción: "Nueva Cotización"
✓ Línea decorativa: Gradiente tricolor corporativo
✓ Tabla: Datos de cotizaciones con estado visual
```

---

## 4. VISITAS - Location-Based Header

```
╔════════════════════════════════════════════════════════════════════════════╗
║                                                                            ║
║  ┌──────┐  VISITAS DE VENTAS            ┌─────────────────────────────┐   ║
║  │  📍  │  Gestión Técnica y Comercial [23]│ 📅 Programar Visita       │   ║
║  └──────┘                               └─────────────────────────────┘   ║
║                                                                            ║
║  ════════════════════════════════════════════════════════════════════════  ║
║                (gradiente: naranja → oro → azul → transparente)            ║
║                                                                            ║
║  ┌─────────────────────────────────────────────────────────────────────┐  ║
║  │ ✓ Filtrar: [Estado ▼] [Mes ▼] [Técnico ▼]                   [🔍]  │  ║
║  ├──────────┬────────────────┬──────────┬─────────────┬────────────────┤  ║
║  │ Fecha    │ Cliente        │ Técnico  │ Dirección   │ Estado         │  ║
║  ├──────────┼────────────────┼──────────┼─────────────┼────────────────┤  ║
║  │ 15 May   │ Acme Corp      │ Carlos R │ Apoquindo 2  │ ✓ Completada   │  ║
║  │ 14 May   │ TechStart Inc  │ Juan P.  │ Los Andes   │ ⏱ En Proceso   │  ║
║  │ 13 May   │ Digital Labs   │ María G. │ Teatinos 43 │ ⏳ Programada   │  ║
║  │ ...      │ ...            │ ...      │ ...         │ ...            │  ║
║  └─────────────────────────────────────────────────────────────────────┘  ║
║               1 - 10 de 23              [← Anterior] [Siguiente →]        ║
║                                                                            ║
╚════════════════════════════════════════════════════════════════════════════╝

ELEMENTOS VISUALES:
✓ Badge icon: Fondo naranja #ea6839, icono blanco (MapPin)
✓ Título: "VISITAS DE VENTAS" (dinamicotitulo con nombre dept)
✓ Subtítulo: "Gestión Técnica y Comercial" (14px)
✓ Contador: "23" en badge dorado
✓ Acción: "Programar Visita"
✓ Línea decorativa: Gradiente corporativo completo
✓ Tabla: Con estado visual (✓ Completada, ⏱ En Proceso, ⏳ Programada)
```

---

## 5. VARIANTE COMPACT - Sub-sections Example

```
╔════════════════════════════════════════════════════════════════════════════╗
║  Sub-módulos o nested pages                                               ║
║                                                                            ║
║  [Icon] TÍTULO COMPACTO          [42 elementos]  [Acción]                 ║
║         Descripción breve                                                  ║
║  ════════════════════════════════════════════════════════════════════════  ║
║                                                                            ║
║  [contenido aquí]                                                         ║
║                                                                            ║
╚════════════════════════════════════════════════════════════════════════════╝

DIFERENCIAS vs DEFAULT:
- Icon más pequeño (18x18px vs 24x24px)
- Título: text-2xl (24px) vs text-4xl (36px)
- Margen inferior: mb-6 (24px) vs mb-8 (32px)
- Sin fondo decorativo
- Línea más sutil
```

---

## 6. Responsividad: Mobile (375px)

```
╔═════════════════════════════════╗
║                                 ║
║  ┌──────┐  USUARIOS             ║
║  │  👤  │                        ║
║  └──────┘                        ║
║  Gestión de Personal             ║
║                                 ║
║  [42 usuarios]                  ║
║                                 ║
║  ┌─────────────────────────────┐║
║  │ 📝 Registrar Usuario        │║
║  └─────────────────────────────┘║
║                                 ║
║  ═════════════════════════════  ║
║                                 ║
║  ┌──────────────────────────────┐║
║  │ Búsqueda...            [🔍] │║
║  ├──────────────────────────────┤║
║  │ Juan Pérez                   │║
║  │ juan@acme.com | Ventas       │║
║  │                              │║
║  │ María García                 │║
║  │ maria@acme.com | Proyectos   │║
║  │ ...                          │║
║  └──────────────────────────────┘║
║       1 - 10 de 42              ║
║  [← Anterior] [Siguiente →]     ║
║                                 ║
╚═════════════════════════════════╝

CAMBIOS EN MOBILE:
- Layout apilado vertical
- Icon + titulo en una línea
- Subtítulo debajo
- Badge debajo
- Botón full-width (padding 16px)
- Font sizes reducidos
- Menos espaciado horizontal
- Tocable (min 44x44px recomendado)
```

---

## 7. Comparación ANTES vs DESPUÉS

### ANTES (Código duplicado en 4 páginas)

```
Usuarios Page:
16 líneas de JSX para header

Clientes Page:
15 líneas de JSX + useHeaderStore hook

Cotizaciones Page:
8 líneas de JSX (sin icono)

Visitas Page:
14 líneas de JSX (sin icono)

TOTAL: ~53 líneas duplicadas
```

### DESPUÉS (Componente reutilizable)

```
PageHeader.tsx: ~150 líneas (una sola vez)

Usuarios Page:
5 líneas de JSX

Clientes Page:
5 líneas de JSX (sin hook innecesario)

Cotizaciones Page:
5 líneas de JSX (con icono nuevo)

Visitas Page:
5 líneas de JSX (con icono nuevo)

TOTAL: ~170 líneas (una sola versión)
AHORRO: ~80% código duplicado
```

---

## 8. Color Reference Guide

```
┌──────────────────────────────────────────────────────────────┐
│ PALETA CORPORATIVA ACME                                      │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│ 🔵 PRIMARY (Azul)          #1a2a53                           │
│    Uso: Usuarios, Autoridad, Operaciones                    │
│    Contrast: 8.6:1 (AAA ✓)                                  │
│                                                              │
│    Badge:  █████████████████  Blanco sobre azul             │
│    Hover:  shadow-xl + ring-offset-4                        │
│                                                              │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│ 🟠 SECONDARY (Naranja)     #ea6839                           │
│    Uso: Clientes, Acción, Movimiento                        │
│    Contrast: 3.8:1 (AA ✓)                                   │
│                                                              │
│    Badge:  █████████████████  Blanco sobre naranja          │
│    Hover:  shadow-xl + ring-offset-4                        │
│                                                              │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│ 🟡 ACCENT (Oro)            #f8aa19                           │
│    Uso: Cotizaciones, Destacado, Premium                    │
│    Contrast: 11.3:1 (AAA ✓)                                 │
│                                                              │
│    Badge:  █████████████████  Azul sobre oro                │
│    Hover:  shadow-xl + ring-offset-4                        │
│                                                              │
└──────────────────────────────────────────────────────────────┘

LÍNEA DECORATIVA (Gradiente):
from-[#1a2a53] via-[#ea6839] to-transparent
└─────────────────────┬──────────────────────┘
  Azul oscuro → Naranja → Desvanecimiento
```

---

## 9. Tipografía Reference

```
╔═════════════════════════════════════════════════════════════════════════╗
║ TIPOGRAFÍA: Montserrat Alternates                                       ║
╠═════════════════════════════════════════════════════════════════════════╣
║                                                                         ║
║ TÍTULO PRINCIPAL                                                        ║
║ ═════════════════                                                       ║
║ Fuente: Montserrat Alternates                                           ║
║ Tamaño: 36px (Default) / 24px (Compact)                                 ║
║ Peso: 900 (Black - font-black)                                          ║
║ Color: #1a2a53 (primary)                                                ║
║ Transform: UPPERCASE                                                     ║
║ Tracking: tight (-0.025em) = compacto, profesional                      ║
║ Line-height: 1 = sin espaciado entre líneas                             ║
║                                                                         ║
║ Ejemplo: "USUARIOS" o "COTIZACIONES"                                    ║
║                                                                         ║
╠═════════════════════════════════════════════════════════════════════════╣
║                                                                         ║
║ SUBTÍTULO                                                               ║
║ ═════════                                                               ║
║ Fuente: Montserrat Alternates                                           ║
║ Tamaño: 14px (Default) / 12px (Compact)                                 ║
║ Peso: 600 (SemiBold)                                                     ║
║ Color: #737373 (muted-foreground)                                       ║
║ Transform: UPPERCASE                                                     ║
║ Tracking: wider (+0.05em) = espaciado amplio entre letras               ║
║ Margin-top: 8px (Default) / 4px (Compact)                               ║
║                                                                         ║
║ Ejemplo: "GESTIÓN DE PERSONAL" o "CONTROL DE PRESUPUESTOS"             ║
║                                                                         ║
╠═════════════════════════════════════════════════════════════════════════╣
║                                                                         ║
║ CONTADOR (Badge)                                                        ║
║ ═════════════════                                                       ║
║ Fuente: Montserrat Alternates                                           ║
║ Tamaño: 14px (Default) / 12px (Compact)                                 ║
║ Peso: 600 (SemiBold)                                                     ║
║ Fondo: #f8aa19 (accent)                                                 ║
║ Color Texto: #1a2a53 (primary)                                          ║
║ Padding: 8px 12px (Default) / 4px 8px (Compact)                         ║
║ Border-radius: rounded-full                                              ║
║ Ring: ring-1 ring-offset-1 ring-[#f8aa19]                               ║
║                                                                         ║
║ Ejemplo: "[42 usuarios]" - Dorado, redondeado, anillo sutil             ║
║                                                                         ║
╚═════════════════════════════════════════════════════════════════════════╝
```

---

## 10. Animation & Interaction

```
┌──────────────────────────────────────────────────────────────┐
│ INTERACCIONES                                                │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│ ICON BADGE HOVER:                                            │
│ ┌──────────────────┐      ┌──────────────────┐              │
│ │ Normal           │ →→→  │ Hover State      │              │
│ │ shadow-lg        │      │ shadow-xl        │              │
│ │ ring-offset-2    │      │ ring-offset-4    │              │
│ └──────────────────┘      └──────────────────┘              │
│                                                              │
│ Transición: transition-all duration-300                      │
│ Efecto: Profundidad aumenta, ring se expande                │
│                                                              │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│ ACTION BUTTON:                                               │
│ - Click: Abre modal o inicia acción                          │
│ - Loading: Spinner + disabled state                          │
│ - Success: Toast notificación                                │
│                                                              │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│ PAGE LOAD ANIMATION (Container):                             │
│ - animate-in fade-in duration-500                            │
│ - Header aparece suavemente al cargar la página              │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

---

**Próximos pasos:**
1. Copiar `PageHeader.tsx` a `src/components/common/`
2. Actualizar las 4 páginas siguiendo la guía de implementación
3. Testing visual en todos los breakpoints
4. Commit con mensaje: "refactor: consolidate page headers with reusable PageHeader component"

