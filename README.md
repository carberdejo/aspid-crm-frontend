# ASPID CRM · Frontend

Interfaz web de **ASPID CRM**: gestión comercial de clientes, visitas, cotizaciones,
órdenes de compra, facturas y entregas, organizada por áreas.

Next.js 16 · React 19 · Tailwind CSS v4 · shadcn/ui · TanStack Query · Zustand.

## Puesta en marcha

1. Copia `.env.template` como `.env` y ajusta la URL de la API:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:4000/api/v1
   FRONTEND_PORT=3000
   ```
2. Instala dependencias y levanta el servidor de desarrollo:
   ```bash
   npm install
   npm run dev
   ```
3. Abre [http://localhost:3000](http://localhost:3000). Necesitas el backend
   (`aspid-crm-backend`) y la base de datos (`aspid-crm-database`) corriendo.

## Scripts

| Comando | Qué hace |
|---|---|
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Build de producción (`output: standalone`) |
| `npm run start` | Sirve el build de producción |
| `npm run lint` | ESLint |
| `npx tsc --noEmit` | Verificación de tipos |

## Docker

```bash
docker network create red_global_aspid   # una sola vez, compartida con backend y base de datos
docker compose up -d --build
```

## Documentación

- [`AGENTS.md`](AGENTS.md): arquitectura, marca ASPID (colores, tipografía, logos),
  capa de datos, reglas de acceso y problemas conocidos.
