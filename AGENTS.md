# AGENTS.md - ASPID CRM Frontend

Guía para agentes de IA (y personas) que trabajan en el frontend de **ASPID CRM**.
Es la fuente única de contexto: `CLAUDE.md` la importa.

El sistema tiene tres repos hermanos: `aspid-crm-frontend` (este), `aspid-crm-backend`
(NestJS, API `api/v1`) y `aspid-crm-database` (PostgreSQL, schema `aspid`). Las reglas de
negocio y de acceso viven en el backend; el frontend solo las refleja en la interfaz.

## Stack

- **Next.js 16** (App Router, Turbopack) y **React 19**
- **Tailwind CSS v4**: la configuración está en `src/app/globals.css` (`@theme`), no hay `tailwind.config.ts`
- **shadcn/ui** en `src/components/ui/` (personalizado: **no regenerar** componentes)
- **TanStack Query v5** (estado del servidor), **Zustand v5** (estado del cliente)
- **React Hook Form + Zod v4** para formularios
- **Axios** con interceptores (`src/api/aspidApi.ts`), **Lucide** para íconos, **Sonner** para avisos
- Interfaz en **español**; los comentarios del código también van en español

## Comandos

```bash
npm run dev          # Desarrollo (localhost:3000)
npm run build        # Build de producción (output standalone)
npm run lint         # ESLint
npx tsc --noEmit     # Verificación de tipos
```

Antes de dar un cambio por terminado: `npx tsc --noEmit`, `npm run lint` (sin errores nuevos)
y `npm run build`. Prettier no está entre las dependencias del proyecto.

## Estructura

```
src/
  api/aspidApi.ts     Instancia de Axios: token, refresh automático en 401, formato { code, data, message }
  app/                Rutas (App Router)
    auth/             Login (público)
    (main)/           Rutas autenticadas: dashboard, department/[id]/..., client, user, analytics, admin
  components/         Por dominio (visit, quote, orders, invoices, deliverys, client...) + shared/, common/, layout/, ui/
  hooks/              Hooks de React Query por dominio, y hooks de acceso en hooks/auth/
  services/           Llamadas HTTP (una por dominio), siempre con aspidApi
  interfaces/         Tipos de la API
  lib/schemas/        Esquemas Zod de los formularios
  store/              Zustand: auth, departamentos, sidebar, header, flujo de registro
  config/fonts.ts     Fuente Sora (next/font)
public/brand/         Logos, isotipos y favicons ASPID
```

## Marca e interfaz (ASPID)

Los colores, la fuente y las medidas vienen de la guía de marca (paleta corporativa ASPID).
**Usa siempre los tokens, nunca colores hex escritos a mano.**

| Token | Color | Uso |
|---|---|---|
| `primary` | Violet Night `#2D1C42` | Menú lateral, encabezados, texto principal, botones sólidos |
| `primary-dark` / `ink` | Tinta `#160D26` | Hover de botones primarios, fondos muy oscuros |
| `primary-light` / `support-1` | Ciruela `#4D2F70` | Hover sobre fondo oscuro, gráficos, etiquetas |
| `support-2` | Lavanda `#7A5498` | Bordes al enfocar (`ring`), íconos secundarios |
| `secondary` | Dorado `#C88B00` | Botón de acción principal (CTA), ícono activo |
| `secondary-dark` | `#A87400` | Hover del CTA |
| `secondary-text` | Dorado oscuro `#8A5E00` | **Texto dorado sobre fondo claro** |
| `accent` | Crema `#E1B983` | Texto y detalles sobre fondo oscuro |
| `on-dark-muted` | Lavanda clara `#B79AD0` | Texto secundario sobre fondo oscuro |
| `surface` | `#F5F1FA` | Fondo de la aplicación |

Reglas de contraste (WCAG AA):

- **Texto dorado sobre blanco**: `text-secondary-text`, nunca `text-secondary` (el dorado puro da 2.9:1).
- **Botón dorado**: `bg-secondary text-primary`. El texto blanco sobre dorado no pasa contraste.
- Sobre fondo oscuro, el acento de texto es `text-accent` (Crema) o `text-secondary`.

Otros puntos:

- **Fuente**: Sora (400 texto, 500 menús, 600 etiquetas y botones, 700 títulos), vía `next/font` en `src/config/fonts.ts`.
- **Logos** en `public/brand/`: `logo-on-dark.png` / `logo-on-light.png` (logotipo) e `isotipo-on-dark.png` / `isotipo-on-light.png` (el zorro). Los originales en alta resolución están fuera del repo, en `resources/`.
- **Medidas de la marca**, listas para adoptar pantalla por pantalla (todavía no se aplicaron a todo):
  - escala tipográfica: `text-display`, `text-h1`, `text-title`, `text-stat`, `text-h2`, `text-body`, `text-small`, `text-label`, `text-caption`, `text-overline`;
  - radios: `rounded-checkbox`, `rounded-chip`, `rounded-field`, `rounded-button`, `rounded-card`, `rounded-app`, `rounded-pill`;
  - espaciado y alturas: `var(--space-1..16)` y `var(--size-input | btn-lg | btn-md | sidebar | form ...)`.
- **Colores por módulo**: cada sección mantiene su color de identidad (órdenes verde, facturas rosa, cotizaciones naranja, visitas celeste), igual que los colores de estado (verde éxito, rojo error). No se reemplazan por la paleta de marca.
- `PageHeader` (`components/common/PageHeader.tsx`) es el encabezado estándar de página; `themeColor` elige el color del módulo.

## Capa de datos

- **Servicios** (`src/services/*.service.ts`): solo HTTP con `aspidApi`; devuelven `data.data`.
- **Hooks** (`src/hooks/<dominio>/`): `useQuery` para leer y `useMutation` para escribir. Tras una mutación se invalidan las claves afectadas, p. ej.:
  - visitas: `["visits"]`, `["visit-detail", id]`, `["visit-stats"]`;
  - órdenes y facturas: `["purchase-orders"]` y `["invoices"]` (editar o anular una factura cambia lo facturado de su OC);
  - anular una OC devuelve su cotización a PENDIENTE: invalidar también `["quotes"]`.
- Las claves de clientes y contactos están centralizadas en `src/lib/queryKeys.ts`.
- Los errores se muestran con `toast.error`, usando `error.errors` (validaciones) o `error.message`.

## Autenticación y acceso

- El JWT de acceso trae `{ sub, role: "admin" | "user", depts: number[] }`. Se guarda en `useAuthStore` (Zustand persistido) y en la cookie `auth-token`; `updateToken` vuelve a decodificarlo tras cada refresh.
- Cada área es `/department/[id]`; `src/app/(main)/department/layout.tsx` bloquea las áreas que no están en `depts`.
- **Reglas de negocio (las aplica el backend; el frontend solo oculta lo que no corresponde):**
  - Un empleado solo ve y modifica **sus** registros en **sus** áreas; el admin ve todo.
  - Solo el **dueño o un admin** editan, eliminan o anulan. El **colaborador** de una cotización solo la ve.
  - Cotizaciones: se editan y rechazan solo en `PENDIENTE`. Visitas y entregas se eliminan de forma lógica.
  - OC y facturas no se borran: se **anulan** con motivo (`status: VIGENTE | ANULADA`). Una OC con facturas vigentes no se anula.
- Hooks de acceso (`src/hooks/auth/`):
  - `useCanModify(ownerId)`: ¿puede editar/eliminar? (dueño o admin);
  - `useRecordOwner(departmentId)`: admin, usuario actual y miembros del área (selectores de responsable y colaborador);
  - `useOwnerFilter()`: filtro de dueño para los listados.

## Convenciones

- Formularios: React Hook Form + `zodResolver`; esquemas en `src/lib/schemas/`.
- Selectores compartidos en `components/shared/`: `ClientSearchSelector` (con `userId` para el admin y `selectedLabel` al editar), `ContactSearchSelector`, `UserSelect`, `ConfirmDialog`, `AnnulDialog`.
- Rutas cliente: `useRouter` de `next/navigation`.
- Alias de imports: `@/*` → `./src/*`.
- Hay archivos con fin de línea CRLF y otros con LF; git los normaliza (`core.autocrlf`).

## Problemas conocidos

- **`middleware.ts` no se ejecuta**: está en la raíz y el proyecto usa `src/`, así que Next no lo carga (en Next 16 debe ser `src/proxy.ts`). Hoy la protección de rutas depende de la redirección del cliente y del backend.
- Los botones "Ver detalle" de órdenes, facturas y entregas apuntan a páginas que todavía no existen.
- El dashboard del admin, `/analytics`, los reportes del área y la tarjeta de actividad diaria usan datos de ejemplo (`mock-analytics.data.ts`).
- Los botones "Descargar PDF" no están implementados.
