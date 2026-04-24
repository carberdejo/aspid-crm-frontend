# Dashboard Layout - ACME & CIA

## Estructura del Proyecto

El layout principal ha sido refactorizado siguiendo las mejores prácticas de Next.js 16 con App Router, implementando un dashboard profesional con las siguientes características:

### 📁 Arquitectura de Componentes

```
src/
├── components/
│   ├── layout/
│   │   ├── Sidebar.tsx          # Sidebar desktop colapsable
│   │   ├── MobileSidebar.tsx    # Sidebar móvil con Sheet
│   │   ├── Header.tsx           # Header con notificaciones y perfil
│   │   ├── Footer.tsx           # Footer simple y discreto
│   │   └── NavItems.tsx         # Configuración de navegación
│   └── ui/
│       ├── button.tsx           # Componente Button de Shadcn
│       ├── sheet.tsx            # Componente Sheet para móviles
│       ├── avatar.tsx           # Componente Avatar
│       ├── separator.tsx        # Separador visual
│       └── scroll-area.tsx      # Área con scroll personalizado
├── store/
│   └── useSidebarStore.ts       # Estado global del Sidebar con Zustand
└── lib/
    └── utils.ts                 # Utilidades (función cn)
```

## 🎨 Colores Corporativos

Los colores de ACME & CIA están configurados en `tailwind.config.ts`:

- **Primary (Dark Blue)**: `#1a2a53` - Color principal para sidebar y elementos destacados
- **Secondary (Naranja)**: `#ea6839` - Color secundario para acciones
- **Accent (Amarillo/Dorado)**: `#f8aa19` - Color de acento para indicadores

### Uso en código:
```tsx
// Clases Tailwind
<div className="bg-primary text-white" />
<button className="bg-secondary hover:bg-secondary-dark" />
<span className="text-accent" />
```

## 🔧 Tecnologías Utilizadas

- **Next.js 16** - Framework React con App Router
- **TypeScript 5** - Tipado estático
- **Tailwind CSS v4** - Estilos utility-first
- **Shadcn/UI** - Componentes accesibles y personalizables
- **Zustand** - Gestión de estado global ligera
- **Lucide React** - Iconos modernos y consistentes
- **Radix UI** - Primitivas de UI accesibles

## 📦 Dependencias Instaladas

```json
{
  "dependencies": {
    "zustand": "^4.x",
    "class-variance-authority": "^0.x",
    "clsx": "^2.x",
    "tailwind-merge": "^2.x",
    "lucide-react": "^0.x"
  },
  "devDependencies": {
    "@radix-ui/react-avatar": "^1.x",
    "@radix-ui/react-dialog": "^1.x",
    "@radix-ui/react-scroll-area": "^1.x",
    "@radix-ui/react-separator": "^1.x"
  }
}
```

## 🚀 Características Implementadas

### 1. **Sidebar Colapsable (Desktop)**
- **Estado persistente**: Usa `localStorage` para recordar el estado colapsado
- **Animaciones suaves**: Transiciones CSS de 300ms
- **Modo expandido**: Muestra iconos + texto (64 caracteres de ancho)
- **Modo colapsado**: Solo iconos (16 caracteres de ancho)
- **Tooltips**: En modo colapsado, muestra el título al pasar el mouse

**Componente**: `src/components/layout/Sidebar.tsx`

```tsx
import Sidebar from "@/components/layout/Sidebar";
```

### 2. **Mobile Sidebar con Sheet**
- **Responsive**: Se activa automáticamente en pantallas < 1024px
- **Overlay oscuro**: Fondo semi-transparente al abrir
- **Animación slide-in**: Desliza desde la izquierda
- **Cierre automático**: Al hacer clic en un enlace de navegación

**Componente**: `src/components/layout/MobileSidebar.tsx`

### 3. **Header Fijo**
- **Sticky position**: Permanece visible al hacer scroll
- **Notificaciones**: Badge con contador de mensajes y alertas
- **Perfil de usuario**: Avatar con nombre y rol
- **Botón menú móvil**: Toggle para abrir/cerrar el Sheet
- **Breadcrumb/Título**: Muestra la sección actual

**Componente**: `src/components/layout/Header.tsx`

```tsx
<Header currentSection="Dashboard" />
```

### 4. **Gestión de Estado con Zustand**
El store maneja dos estados independientes:
- `isCollapsed`: Estado del sidebar desktop (persistente)
- `isMobileOpen`: Estado del sidebar móvil (no persistente)

**Store**: `src/store/useSidebarStore.ts`

```tsx
import { useSidebarStore } from '@/store/useSidebarStore';

function MyComponent() {
  const { isCollapsed, toggleCollapse } = useSidebarStore();
  // ...
}
```

### 5. **Navegación Estructurada**
Configuración centralizada en `NavItems.tsx`:

```tsx
export const navSections: NavSection[] = [
  {
    title: 'PRINCIPAL',
    items: [
      { title: 'Dashboard', href: '/', icon: LayoutDashboard },
      { title: 'Facturaciones', href: '/facturaciones', icon: FileText },
    ],
  },
  // ... más secciones
];
```

### 6. **Footer Simple**
- Enlaces a páginas legales (Términos, Privacidad, Contacto)
- Copyright dinámico con año actual
- Responsive: Cambia a layout vertical en móviles

## 🎯 Cómo Usar

### 1. Estructura del Layout Principal

El layout en `app/(main)/layout.tsx` ensambla todos los componentes:

```tsx
import Sidebar from "@/components/layout/Sidebar";
import MobileSidebar from "@/components/layout/MobileSidebar";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function MainLayout({ children }) {
  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <Sidebar />
      <MobileSidebar />
      
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header currentSection="Dashboard" />
        
        <main className="flex-1 overflow-y-auto">
          <div className="container mx-auto p-4 lg:p-8">
            {children}
          </div>
        </main>
        
        <Footer />
      </div>
    </div>
  );
}
```

### 2. Agregar Nuevas Rutas al Menú

Edita `src/components/layout/NavItems.tsx`:

```tsx
import { MyIcon } from 'lucide-react';

export const navSections: NavSection[] = [
  {
    title: 'MI SECCIÓN',
    items: [
      {
        title: 'Mi Nueva Página',
        href: '/mi-pagina',
        icon: MyIcon,
        active: false,
      },
    ],
  },
];
```

### 3. Personalizar el Header

Pasa diferentes props según la página:

```tsx
<Header currentSection="Ventas" />
<Header currentSection="Configuración" />
```

## 🖼️ Logo de ACME

El logo debe estar ubicado en:
```
public/logo-acme.png
```

Si el logo no existe, se muestra un fallback con la letra "A" en un cuadrado blanco.

## 📱 Responsive Design

### Breakpoints:
- **Mobile**: < 1024px → Sidebar oculto, botón de menú visible
- **Desktop**: ≥ 1024px → Sidebar visible, botón de menú oculto

### Comportamiento:
- En móvil, el sidebar se abre con un Sheet overlay
- En desktop, el sidebar es colapsable con botón interno
- El header ajusta su layout en pantallas pequeñas

## 🧪 Testing

### Comandos de verificación:

```bash
# Verificar tipos
npx tsc --noEmit

# Linter
npm run lint

# Build de producción
npm run build

# Desarrollo
npm run dev
```

### Checklist de pruebas:
- [ ] Sidebar colapsa correctamente en desktop
- [ ] Estado del sidebar persiste después de recargar
- [ ] Sheet se abre en móviles con el botón de menú
- [ ] Navegación activa se muestra correctamente
- [ ] Notificaciones muestran los badges
- [ ] Footer se mantiene en la parte inferior
- [ ] Scroll funciona correctamente en el contenido principal

## 🎨 Personalización Avanzada

### Cambiar colores corporativos:

Edita `tailwind.config.ts`:

```ts
colors: {
  primary: {
    DEFAULT: "#TU_COLOR",
    dark: "#TU_COLOR_OSCURO",
    light: "#TU_COLOR_CLARO",
  },
}
```

### Ajustar ancho del sidebar:

En `Sidebar.tsx` y `MobileSidebar.tsx`:

```tsx
// Expandido
className="w-64" // Cambiar a w-72, w-80, etc.

// Colapsado
className="w-16" // Cambiar a w-20, w-24, etc.
```

### Agregar más badges/notificaciones:

En `Header.tsx`:

```tsx
<button className="relative hover:opacity-80 transition-opacity">
  <TuIcono className="h-5 w-5 text-gray-600" />
  <span className="absolute -top-1.5 -right-1.5 flex items-center justify-center w-4 h-4 text-[10px] font-bold text-white bg-red-500 rounded-full">
    {count}
  </span>
</button>
```

## 📚 Recursos

- [Next.js 16 Docs](https://nextjs.org/docs)
- [Shadcn/UI Components](https://ui.shadcn.com)
- [Zustand Documentation](https://zustand.docs.pmnd.rs)
- [Lucide Icons](https://lucide.dev)
- [Tailwind CSS v4](https://tailwindcss.com)

## 🐛 Solución de Problemas

### El sidebar no persiste el estado:
Verifica que `localStorage` esté disponible (funciona solo en cliente).

### Los iconos no se muestran:
Asegúrate de importar desde `lucide-react`, no de `react-icons`.

### Errores de compilación de Tailwind:
Verifica que `tailwind.config.ts` esté correctamente configurado y que no uses clases inexistentes.

### El Sheet no cierra en móvil:
Asegúrate de llamar `setMobileOpen(false)` al hacer clic en un enlace.

---

**Desarrollado para ACME & CIA** 🚀
