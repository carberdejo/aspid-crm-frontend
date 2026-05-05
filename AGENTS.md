# Agent Guidelines for CONCAR Frontend

Compact instruction file for AI agents working on this Next.js 16 + React 19 frontend.

## Project Context

- **Next.js 16** (latest) with App Router (not Pages router)
- **React 19** with new JSX transform
- **Tailwind CSS v4** with `@theme` directive in CSS (NO `tailwind.config.ts`)
- **Shadcn/UI** components in `src/components/ui/` (customized for Tailwind v4; DO NOT regenerate)
- **Zustand** for state, **TanStack Query** for server state, **JWT** with refresh tokens for auth
- **Language**: Spanish UI text, English/Spanish code acceptable
- **Montserrat Alternates** font (applied globally; use Tailwind font classes)
- **Lucide React** icons (NOT `react-icons`)

## Core Quirks & Critical Knowledge

### Next.js 16 Gotchas
- Read `node_modules/next/dist/docs/` before implementing new patterns — this version has breaking changes
- Client components MUST use `useRouter` from `'next/navigation'` instead of server-only `redirect()`
- Path aliases: Use `@/*` for `./src/*` imports (configured in `tsconfig.json`)

### Tailwind CSS v4
- NO `tailwind.config.ts` — all theme config in `@theme` blocks in `src/app/globals.css`
- Use hex values directly: `bg-[#1a2a53]`, not Tailwind color tokens
- **Corporate colors** defined in globals.css:
  - Primary (Dark Blue): `#1a2a53` — sidebar, headers, primary actions
  - Secondary (Orange): `#ea6839` — badges, warnings
  - Accent (Yellow/Gold): `#f8aa19` — active states, department badges

### Authentication System
- **Flow**: Middleware → AuthGuard (commented out, but pattern available) → Client-side Zustand store
- **Tokens**: Access token (JWT) + Refresh token stored in Zustand and persisted to cookies
- **Middleware** (`middleware.ts`):
  - Blocks unauthorized access to protected routes (all except `/auth/*`)
  - Redirects authenticated users away from login pages
  - Does NOT validate token expiration (Axios interceptor handles 401 refresh)
- **Axios interceptor** (`src/api/concarApi.ts`):
  - Injects Bearer token in Authorization header
  - Handles 401 → refresh token flow automatically
  - Validates API response format: `{ code: 1, data: {...} }`
  - On refresh failure or missing token: redirects to `/auth/login`
- **Root page** (`src/app/page.tsx`): Client component that redirects admin → `/dashboard`, user → `/department/{first-dept-id}`

### Department System
- **Single fetch per session**: Departments cached in `useDepartmentStore` after auth
- **Store usage**: `getDepartmentById(id)` for O(1) instant lookups (no HTTP calls)
- **URL structure**: `/department/[id]` where `id` is numeric department ID from user JWT payload (`depts: number[]`)
- **Navigation**: Sidebar generates dynamic sections from user's `depts` array using store lookups

## Developer Commands

```bash
npm run dev          # Development server (localhost:3000)
npm run build        # Production build (Next.js standalone mode)
npm run start        # Start production server
npm run lint         # ESLint check (fix with --fix)
npx tsc --noEmit     # Type check only (no emit)
```

### Before Committing
1. `npm run lint` — fix all errors
2. `npx tsc --noEmit` — verify no type errors
3. `npm run build` — test production build
4. Manual test: auth flow (login, redirect, logout), sidebar collapse/expand, responsive mobile

## Project Structure

### Key Directories
- `src/app/` — Next.js App Router pages
  - `(main)/` — Protected routes with layout (inside AuthGuard)
  - `auth/` — Public auth pages (login, register, etc.)
- `src/components/` — React components
  - `auth/` — AuthGuard, LogoutModal
  - `layout/` — Sidebar, Header, UserProfile, Footer, NavItems (dynamic nav generation)
  - `ui/` — Shadcn components (customized for v4)
- `src/store/` — Zustand stores (auth, sidebar, department, etc.)
- `src/services/` — API call functions (auth.service, department.service)
- `src/hooks/` — Custom hooks (useAuth, useLogout, useDepartments)
- `src/interfaces/` — TypeScript type definitions
- `src/api/concarApi.ts` — Axios instance with interceptors
- `middleware.ts` — Request-level auth protection

### Important Files
- `tsconfig.json` — Path aliases (`@/*` → `./src/*`), strict mode enabled
- `components.json` — Shadcn config (DO NOT regenerate components)
- `next.config.ts` — Uses `output: "standalone"` for Docker
- `.env.template` — Required: `NEXT_PUBLIC_API_URL` and `FRONTEND_PORT`

## Code Patterns & Conventions

### TypeScript
- Strict mode enabled; NO `any` type
- Use `import type` for type-only imports
- Interfaces for API responses: `Payload`, `LoginResponse`, `LoginDto`, `ApiResponse<T>`
- JWT Payload type includes: `sub` (user ID), `email`, `role` (admin|user), `depts` (number[])

### Components
- Server components by default; use `'use client'` only when needed (hooks, events, browser APIs)
- Functional components with proper props typing
- Example:
  ```typescript
  export default function MyComponent({
    title,
    children
  }: {
    title: string;
    children: React.ReactNode;
  }) {
    // ...
  }
  ```

### Styling
- Use Tailwind utility classes directly in JSX
- For conditional classes, use `cn()` helper or template literals
- Always use hex colors: `bg-[#1a2a53] hover:bg-[#111c38]`
- NO CSS Modules (not used in project)

### State Management
- **Auth**: `useAuthStore()` for token and user data, persisted to localStorage and cookies
- **Sidebar**: `useSidebarStore()` for collapse/expand state, persisted to localStorage
- **Departments**: `useDepartmentStore()` for caching, accessed from components after AuthGuard loads
- Stores use Zustand `persist` middleware for localStorage sync

### Hooks
- `useAuth()` — Login mutation with TanStack Query, auto-redirect
- `useLogout()` — Logout mutation with loading states and error handling
- Custom hooks should use Zustand stores directly; avoid prop drilling

### Imports
1. External packages first (React, Next.js, third-party)
2. Internal modules second (@/components, @/store, etc.)
3. Path aliases preferred over relative imports

## API Integration

### Endpoints
- Base URL: `NEXT_PUBLIC_API_URL` (default: `http://localhost:4000/api/v1`)
- Response format: `{ code: 1, data: {...}, message: "..." }`
- Auth endpoints: POST `/auth/login`, POST `/auth/refresh`, POST `/auth/logout`
- Department endpoints: GET `/departments`, GET `/departments/{id}`

### Error Handling
- Network errors: Caught by Axios interceptor, user-friendly Spanish messages shown
- Token expiration (401): Automatically triggers refresh token flow
- Refresh failure: Redirects to login with `window.location.replace()`
- Form validation: React Hook Form + Zod

## Important Design Decisions

1. **Root page redirects**: Uses `router.push()` not `redirect()` because it's a client component
2. **Middleware → AuthGuard split**: Middleware for server-level speed, AuthGuard as client-side fallback
3. **Single department fetch**: Loaded once in AuthGuard, cached for session to avoid HTTP spam
4. **Numeric department IDs**: Allows instant O(1) store lookups
5. **Standalone Next.js build**: Docker uses `next build` with `output: "standalone"`
6. **Token refresh loop**: Axios handles 401 automatically, preventing unnecessary UI redirects

## Environment & Deployment

- **Environment file**: Copy `.env.template` to `.env.local` (gitignored)
- **Required vars**: `NEXT_PUBLIC_API_URL` (client-side), `FRONTEND_PORT` (optional, defaults to 3000)
- **Docker**: Dockerfile uses multi-stage build; pass `NEXT_PUBLIC_API_URL` as ARG
- **Production**: Standalone Next.js server on port 3000

## Security Notes

- Tokens stored in Zustand + cookies (http-only context for middleware)
- Middleware validates token presence; Axios interceptor validates on API calls
- Logout clears all state and cookies, redirects to login
- CORS handled by backend API (frontend doesn't configure it)

## Common Gotchas

1. **TypeScript errors in `command.tsx`**: Pre-existing, doesn't block dev/runtime, only `npm run build`
2. **Font not applying**: Ensure `montserratAlternates` is imported and className set on `<body>`
3. **Colors not showing**: Remember hex syntax `bg-[#1a2a53]`, NOT `bg-primary`
4. **Sidebar won't collapse**: Check Zustand store is hydrated (localStorage available)
5. **Logo missing**: Verify `/public/logo-acme.png` exists and is visible on dark blue `#1a2a53`
6. **API calls fail with 405**: Check `NEXT_PUBLIC_API_URL` is set; requests default to frontend origin if missing
7. **Infinite redirects**: Use `router.push()` in client components, not `redirect()` (server-only)

## References

- Full implementation details in `AGENTS.VERSION-LAST.md`
- Layout documentation in `LAYOUT_README.md`
- Typography in `TYPOGRAPHY_AND_LOGO_UPDATES.md`
- Next.js docs: https://nextjs.org/docs
- Tailwind v4: https://tailwindcss.com
- Shadcn/UI: https://ui.shadcn.com
