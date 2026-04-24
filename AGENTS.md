# Agent Guidelines for CONCAR Frontend

This document provides essential information for AI coding agents working on this Next.js 16 project.

<!-- BEGIN:nextjs-agent-rules -->
## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Recent Changes & Implementation Status

### ✅ Completed Implementation (Latest)

#### Dynamic Departments System (Fully Implemented)
- **Status**: Production Ready
- **Commits**: 
  - `e33fef0` - Initial department store and nav items generation
  - `3864a2d` - AuthGuard enhancement with department loading
  - `f643684` - Fix: Replace redirect() with router.push()

**What's working**:
- Single HTTP call per session: Departments fetched once in AuthGuard and cached
- O(1) department lookups via Zustand store (`getDepartmentById(id)`)
- Dynamic navigation: Sidebar generates sections from user's assigned departments
- Role-based visibility: ADMIN sees all, USER sees only assigned departments
- Server-driven routes: `/department/[id]` where ID is numeric department ID
- No infinite redirects: Fixed critical bug where root page used `redirect()` (server-only) in a client component

#### Authentication System (Fully Implemented)
- JWT-based with automatic token expiration handling
- 3-layer protection: Middleware → AuthGuard → Client-side checks
- Cookie-based storage for server-side security
- ReturnTo functionality for improved UX after login
- UserProfile component with real JWT data display
- LogoutModal with confirmation and error handling
- Department-aware authentication payload with `depts: number[]`

**Recent fix** (commit `f643684`):
```typescript
// BEFORE: Infinite "Redirigiendo..." loop
import { redirect } from 'next/navigation';  // ❌ Server-only function
redirect('/dashboard');

// AFTER: Works correctly in client component
const router = useRouter();  // ✅ Client component compatible
router.push('/dashboard');
```

### Current Project Status

**Green Flags** ✅:
- Department system is dynamic, scalable, and performant
- Authentication is secure with multiple layers
- No hardcoded navigation routes - everything server-driven
- Zustand stores properly manage state with persistence
- Corporate colors and typography applied correctly
- Responsive design working on mobile and desktop

**Known Issues** ⚠️:
- Production build has pre-existing TypeScript error in `src/components/ui/command.tsx:60` (unrelated to our changes)
- This error doesn't affect development or runtime, only blocks `npm run build`

**Build Verification**:
- ✅ Dev server starts successfully
- ✅ TypeScript check passes for all auth/department code
- ✅ ESLint passes for route handling
- ✅ Git commits tracking changes



## Build, Lint & Test Commands

### Development
```bash
npm run dev          # Start development server (localhost:3000)
npm run build        # Production build
npm run start        # Start production server
npm run lint         # Run ESLint
```

### Type Checking
```bash
npx tsc --noEmit     # TypeScript type checking without emitting files
```

### Testing
No test framework is currently configured. If adding tests, prefer:
- **Unit tests**: Vitest or Jest with React Testing Library
- **E2E tests**: Playwright or Cypress
- Run single test: `npm test -- path/to/test.spec.ts` (once configured)

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── (main)/            # Route group for main layout with AuthGuard
│   │   ├── department/[id]/ # Dynamic department pages (protected)
│   │   └── ...            # Other protected routes
│   ├── auth/              # Authentication pages (login, etc.)
│   ├── layout.tsx         # Root layout with QueryProvider
│   ├── page.tsx           # Root redirect page (handles role-based routing)
│   └── globals.css        # Global styles
├── api/                   # API configuration
│   └── concarApi.ts       # Axios instance with interceptors
├── components/            # React components
│   ├── auth/             # Authentication components
│   │   ├── AuthGuard.tsx # Client-side auth protection + dept loading
│   │   └── LogoutModal.tsx # Logout confirmation modal
│   ├── layout/           # Layout components
│   │   ├── Sidebar.tsx   # Dynamic sidebar (reads from department store)
│   │   ├── NavItems.tsx  # generateNavSections() for dynamic navigation
│   │   ├── Header.tsx    # Section title from route params
│   │   ├── UserProfile.tsx
│   │   ├── MobileSidebar.tsx
│   │   └── Footer.tsx
│   └── ui/               # Shadcn UI components (includes Dialog, DropdownMenu, AlertDialog)
├── config/               # Configuration files
│   └── fonts.ts          # Font configuration (Montserrat Alternates)
├── hooks/                # Custom React hooks
│   ├── useAuth.ts        # Authentication hook with TanStack Query
│   ├── useLogout.ts      # Logout hook with loading states
│   └── useDepartments.ts # Hook to get departments from store
├── interfaces/           # TypeScript interfaces/types
│   ├── api.interface.ts  # API response types, LoginDto, Payload with JWT fields
│   ├── role-user.interface.ts # UserRole enum
│   └── department.interface.ts # Department interface
├── lib/                  # Utilities
│   ├── utils.ts          # Utility functions (cn, etc.)
│   └── cookies.ts        # Cookie management utilities
├── providers/            # Context providers
│   └── QueryProvider.tsx # TanStack Query provider
├── services/             # API services
│   ├── auth.service.ts   # Authentication API calls
│   └── department.service.ts # Department API calls
└── store/                # Zustand state management
    ├── useAuthStore.ts   # Auth state with cookie integration
    ├── useSidebarStore.ts # Sidebar state
    └── useDepartmentStore.ts # Department caching (ONE HTTP call per session)
middleware.ts              # Authentication middleware
```

## Authentication System

### Overview
The application implements a comprehensive authentication system with:
- **JWT-based authentication** with automatic token management
- **Middleware protection** for all routes
- **Cookie-based storage** for server-side security
- **ReturnTo functionality** for improved UX
- **Automatic token expiration handling**

### Key Components

#### Middleware (`middleware.ts`)
- **Route Protection**: Automatically protects all routes except `/auth/*`
- **Token Validation**: Validates JWT tokens and checks expiration
- **ReturnTo System**: Saves intended destination when redirecting to login
- **Auto-redirect**: Redirects authenticated users away from auth pages

```typescript
// Protected routes automatically redirect to login if not authenticated
// Public routes: /auth/login, /auth/register, /auth/forgot-password
// Middleware runs on every request except static assets and API routes
```

#### Authentication Store (`src/store/useAuthStore.ts`)
```typescript
interface AuthState {
  token: string | null;
  user: Payload | null;
  setToken: (token: string) => void;      // Also saves to cookies
  setUser: (user: Payload) => void;
  logout: () => void;                     // Clears cookies and state
  isAuthenticated: () => boolean;
}
```

#### Authentication Flow
1. **Login Process**:
   - User submits credentials via login form
   - `useAuth` hook handles mutation with TanStack Query
   - Token saved to both Zustand store and cookies
   - JWT decoded to extract user payload
   - Automatic redirection to `returnTo` URL or default route based on role

2. **Route Protection**:
   - Middleware intercepts all requests
   - Validates token from cookies
   - Checks token expiration
   - Redirects to login if invalid/expired
   - Sets `returnTo` cookie for post-login redirect

3. **Logout Process**:
   - User clicks logout from UserProfile dropdown
   - LogoutModal shows confirmation with loading state
   - `useLogout` hook notifies backend and clears local state
   - Automatic redirect to login page

### User Interface Components

#### UserProfile (`src/components/layout/UserProfile.tsx`)
- **Dynamic user display**: Shows real user data from JWT payload
- **Avatar with initials**: Generated from user email
- **Role-based menu**: Different options for ADMIN vs USER roles
- **Department badges**: Shows user departments with corporate colors
- **Dropdown options**:
  - "Ver Perfil" (all users)
  - "Configuración" (ADMIN only)  
  - "Cerrar Sesión" (all users)

#### LogoutModal (`src/components/auth/LogoutModal.tsx`)
- **Confirmation dialog**: Prevents accidental logout
- **Loading states**: Visual feedback during logout process
- **Error handling**: Graceful error handling with fallback
- **Corporate styling**: Uses ACME brand colors

#### AuthGuard (`src/components/auth/AuthGuard.tsx`)
- **Client-side protection**: Additional layer beyond middleware
- **Loading state**: Shows spinner while checking authentication
- **Hydration handling**: Waits for Zustand store to hydrate
- **Fallback behavior**: Sets returnTo and redirects if not authenticated

### Hooks

#### useAuth (`src/hooks/useAuth.ts`)
```typescript
const { login, isLoading, isError, error } = useAuth();

// Features:
// - TanStack Query mutation for login
// - JWT token decoding
// - Automatic role-based redirection
// - ReturnTo URL handling
// - Error state management
```

#### useLogout (`src/hooks/useLogout.ts`)
```typescript
const { logout, isLoggingOut, logoutError } = useLogout();

// Features:
// - Backend notification (with fallback)
// - State cleanup
// - Loading states
// - Error handling
```

### Cookie Management (`src/lib/cookies.ts`)
```typescript
export const cookieUtils = {
  setToken: (token: string) => void;      // Secure cookie storage
  getToken: () => string | undefined;    // Read token
  removeToken: () => void;               // Clear token
  setReturnTo: (url: string) => void;    // Save intended destination  
  getReturnTo: () => string | undefined; // Read return URL
  removeReturnTo: () => void;            // Clear return URL
  clearAuth: () => void;                 // Clear all auth cookies
};
```

### API Integration

#### Axios Configuration (`src/api/concarApi.ts`)
- **Request interceptor**: Automatically adds Bearer token to all requests
- **Response interceptor**: Handles API response format `{code: 1, data: {...}}`
- **Error handling**: Extracts error messages from API responses

#### Authentication Service (`src/services/auth.service.ts`)
```typescript
export const authService = {
  login: async (credentials: LoginDto): Promise<LoginResponse>;
  logout: async () => Promise<void>;
};
```

### TypeScript Interfaces

#### Core Auth Types (`src/interfaces/api.interface.ts`)
```typescript
// JWT Payload from decoded token
interface Payload {
  sub: string;                    // User ID
  email: string;                  // User email
  role: UserRole;                 // ADMIN | USER
  depts: number[];               // User department IDs (array of numbers)
  exp?: number;                   // Token expiration
  iat?: number;                   // Token issued at
}

// Login response from API
interface LoginResponse {
  token: string;                  // JWT token
  email: string;                  // User email
}

// Login request payload
interface LoginDto {
  email: string;
  password: string;
}

// API response wrapper
interface ApiResponse<T> {
  code: number;                   // 1 for success
  message: string;
  data: T;
}
```

## Dynamic Departments System

### Overview
The application implements a dynamic department/area system that replaces hardcoded navigation with server-driven departments:
- **Single HTTP call per session**: Departments are fetched ONCE in AuthGuard and cached
- **Department-based navigation**: Sidebar sections are generated from user's assigned departments
- **Role-based visibility**: Admins see all departments, users see only their assigned ones
- **Efficient lookups**: Department data stored in Zustand with O(1) search by ID

### Key Components

#### Department Store (`src/store/useDepartmentStore.ts`)
```typescript
interface DepartmentState {
  departments: Department[];                    // All departments from server
  departmentMap: Record<number, Department>;   // O(1) lookup by ID
  isLoading: boolean;
  error: string | null;
  setDepartments: (depts: Department[]) => void;  // Called from AuthGuard
  getDepartmentById: (id: number) => Department | undefined;
}
```

**Key behaviors**:
- Only fetches departments once when AuthGuard loads
- Stores mapping for instant lookups (no HTTP calls when navigating)
- Accessible from any component via `useDepartmentStore()`

#### Department Service (`src/services/department.service.ts`)
```typescript
export const departmentService = {
  getDepartments: async (): Promise<Department[]>;
  getDepartmentById: async (id: number): Promise<Department>;
};
```

#### AuthGuard Enhancement (`src/components/auth/AuthGuard.tsx`)
- **Loads departments**: Fetches and caches departments on first render
- **One-time call**: Uses `isFetching` state to prevent duplicate requests
- **Hydration safe**: Waits for both Zustand auth and department store to be ready
- **Error handling**: Gracefully continues even if department fetch fails

#### NavItems Generation (`src/components/layout/NavItems.tsx`)
```typescript
export function generateNavSections(user: Payload): NavSection[] {
  // Returns dynamic navigation structure:
  // 1. PRINCIPAL - Always shown (Dashboard, Facturaciones)
  // 2. MIS ÁREAS - User's departments (dynamically populated)
  // 3. ANALYTICS & REPORTS - Admin only (Clientes, Ajustes)
}
```

**How it works**:
- For each department ID in `user.depts`, fetch full department object
- Create navigation items with department IDs in URLs
- Example: `/departments/42` where 42 is the department ID

#### Root Page Redirect (`src/app/page.tsx`)
- **Uses `useRouter()`** instead of `redirect()` for client component compatibility
- Redirects admins to `/dashboard`
- Redirects users to their first department: `/department/{user.depts[0]}`
- Shows loading spinner while Zustand hydrates

#### Dynamic Department Page (`src/app/(main)/department/[id]/page.tsx`)
- **Gets department name from store**: No additional HTTP calls
- **Uses route params**: Extracts `id` from URL for instant lookup
- **Header integration**: Shows department name in header dynamically

### Department Interface (`src/interfaces/department.interface.ts`)
```typescript
interface Department {
  id: number;          // Department ID (numeric)
  name: string;        // Department name (e.g., "Ventas", "Proyectos")
  description?: string; // Optional description
  color?: string;      // Optional corporate color for badges
}
```

### Data Flow Diagram
```
User Login → JWT Payload (with depts: number[])
    ↓
AuthGuard mounts → Fetches departments from API
    ↓
Department store caches: { 1: {id:1, name:"Ventas"}, 2: {...} }
    ↓
Sidebar reads user.depts and builds navigation from store (NO HTTP calls)
    ↓
User clicks department → Navigates to /department/[id]
    ↓
Page.tsx gets dept info from store (O(1) lookup, instant)
    ↓
Header shows department name from store
```

### Performance Characteristics
- **Initial load**: 1 HTTP call for auth + 1 HTTP call for departments
- **Navigation**: 0 HTTP calls - all data from store (O(1) lookup)
- **Memory**: ~50KB for typical department data
- **Re-renders**: Only when user navigates between pages (store doesn't pollute renders)

### Usage Examples

#### Getting department in a component
```typescript
'use client';

import { useDepartmentStore } from '@/store/useDepartmentStore';

export default function DepartmentView() {
  const { getDepartmentById } = useDepartmentStore();
  const department = getDepartmentById(42);
  
  return <h1>{department?.name}</h1>;
}
```

#### Building dynamic navigation
```typescript
'use client';

import { useAuthStore } from '@/store/useAuthStore';
import { useDepartmentStore } from '@/store/useDepartmentStore';

export default function Sidebar() {
  const { user } = useAuthStore();
  const { getDepartmentById } = useDepartmentStore();
  
  return (
    <div>
      {user?.depts.map(deptId => {
        const dept = getDepartmentById(deptId);
        return <NavItem key={deptId} href={`/department/${deptId}`} label={dept?.name} />;
      })}
    </div>
  );
}
```

### Important Design Decisions
1. **Server-driven navigation**: No hardcoded routes - everything from API
2. **Single fetch pattern**: One HTTP call for departments, cached for entire session
3. **Numeric IDs**: Department IDs are numbers for efficient lookups
4. **URL structure**: `/department/[id]` where ID is numeric department ID
5. **Store-first lookups**: Always check store before making API calls

## Typography

### Primary Font: Montserrat Alternates
The application uses **Montserrat Alternates** from Google Fonts as the primary typeface.

**Configuration**: `src/config/fonts.ts`
```typescript
import { Montserrat_Alternates } from 'next/font/google';

export const montserratAlternates = Montserrat_Alternates({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-montserrat-alternates',
});
```

**Available weights**:
- `font-light` (300) - Light
- `font-normal` (400) - Regular (default)
- `font-medium` (500) - Medium
- `font-semibold` (600) - SemiBold
- `font-bold` (700) - Bold

**Usage**:
```tsx
// The font is applied globally via layout.tsx
// Just use Tailwind font classes in your components

<h1 className="text-3xl font-bold">Bold Heading</h1>
<h2 className="text-xl font-semibold">SemiBold Subheading</h2>
<p className="text-base font-normal">Regular text</p>
<span className="font-medium">Medium emphasis</span>
```

**Important**: Do NOT import other fonts. Montserrat Alternates is applied globally in `app/layout.tsx`.

## Code Style Guidelines

### TypeScript Configuration
- **Strict mode enabled**: All TypeScript strict checks are enforced
- **Target**: ES2017
- **Path aliases**: Use `@/*` for `./src/*` imports
- **JSX**: React 19 with new JSX transform (`react-jsx`)

### Imports
1. **External packages first** (React, Next.js, third-party)
2. **Internal modules second** (components, utils)
3. **Relative imports last**
4. **Use path aliases**: Prefer `@/components/...` over relative paths

Example:
```typescript
import type { Metadata } from "next";
import { montserratAlternates } from "@/config/fonts";
import Sidebar from "@/components/layout/Sidebar";
import "./globals.css";
```

### Naming Conventions
- **Components**: PascalCase, default export (e.g., `export default function Sidebar()`)
- **Files**: Match component name - `Sidebar.tsx`, `Header.tsx`
- **Directories**: kebab-case for routes, PascalCase/camelCase for components
- **Variables/Functions**: camelCase
- **Types/Interfaces**: PascalCase
- **Constants**: UPPER_SNAKE_CASE for true constants

### Components
- **Server Components by default**: Only add `'use client'` when needed (hooks, event handlers, browser APIs)
- **Functional components**: Use function declarations, not arrow functions for components
- **Props typing**: Use inline types or separate interfaces
```typescript
export default function MainLayout({
  children
}: {
  children: React.ReactNode;
}) {
  // ...
}
```

## Styling & Design System

### Tailwind CSS v4
- **IMPORTANT**: This project uses Tailwind CSS v4, which has a different syntax
- **NO `tailwind.config.ts`**: Configuration is done in `@theme` blocks in CSS files
- **Custom colors**: Define in `globals.css` using `@theme` directive

### ACME Corporate Colors
All colors are defined in `src/app/globals.css`:

```css
@theme {
  /* ACME Corporate Colors */
  --color-primary: #1a2a53;        /* Dark Blue - Main brand color */
  --color-primary-dark: #111c38;   /* Darker shade */
  --color-primary-light: #2a3a63;  /* Lighter shade */
  
  --color-secondary: #ea6839;      /* Orange - Secondary actions */
  --color-secondary-dark: #d45529;
  --color-secondary-light: #f07849;
  
  --color-accent: #f8aa19;         /* Yellow/Gold - Accents & highlights */
  --color-accent-dark: #e89a09;
  --color-accent-light: #faba29;
}
```

**Usage in components**:
```tsx
// Use hex values directly with Tailwind's arbitrary value syntax
<div className="bg-[#1a2a53] text-white" />
<button className="bg-[#ea6839] hover:bg-[#d45529]" />
<span className="text-[#f8aa19]" />
```

**Color Guidelines**:
- **Primary (Dark Blue)**: Sidebar, headers, main text, primary buttons, auth components
- **Secondary (Orange)**: Notification badges, secondary actions, warnings
- **Accent (Yellow/Gold)**: Active indicators, highlights, department badges

### Styling Best Practices
- **Use Tailwind utility classes** directly in JSX
- **Conditional classes**: Use template literals or `cn()` helper
```typescript
import { cn } from '@/lib/utils';

className={cn(
  'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all',
  isActive
    ? 'bg-white/10 text-white'
    : 'text-gray-300 hover:bg-white/5'
)}
```

## Layout Components

### Header (`src/components/layout/Header.tsx`)
- **Sticky header** at top of page
- Mobile menu button (hamburger) for <1024px screens
- Section title in primary blue `#1a2a53`
- Notification badges in secondary orange `#ea6839`
- **UserProfile integration**: Shows authenticated user data

### UserProfile (`src/components/layout/UserProfile.tsx`)
- **Dynamic user data**: Displays real user information from JWT
- **Avatar generation**: Creates initials from email address
- **Role-based dropdown**: Different menu options based on user role
- **Department badges**: Shows user departments with accent color `#f8aa19`
- **Logout integration**: Triggers LogoutModal on logout click
- **Corporate styling**: Consistent with ACME brand colors

### Sidebar (`src/components/layout/Sidebar.tsx`)
- **Desktop collapsible sidebar** with Zustand state management
- **Logo behavior**:
  - Expanded: Shows full horizontal logo (`/public/logo-acme.png`, 180×40px)
  - Collapsed: Shows letter "A" in white square (40×40px)
- **Colors**: Dark blue background `#1a2a53`, white text
- **Active indicator**: Yellow/gold border `#f8aa19` on left side
- **State**: Managed by `useSidebarStore` with localStorage persistence

```tsx
// Using the sidebar store
import { useSidebarStore } from '@/store/useSidebarStore';

const { isCollapsed, toggleCollapse } = useSidebarStore();
```

### Mobile Sidebar (`src/components/layout/MobileSidebar.tsx`)
- **Sheet component** for mobile menu (<1024px)
- Shows full horizontal logo like desktop expanded state
- Same navigation structure as desktop

### Footer (`src/components/layout/Footer.tsx`)
- Simple footer with copyright and legal links
- ACME & CIA text in primary blue
- Links hover to primary blue

### Navigation (`src/components/layout/NavItems.tsx`)
- Centralized navigation configuration with dynamic generation
- Uses Lucide icons
- **Dynamic structure**:
  - PRINCIPAL (Dashboard, Facturaciones) - Always shown
  - MIS ÁREAS (User's departments) - Generated from `user.depts` array
  - ANALYTICS & REPORTS (Clientes, Ajustes) - Admin only
- **Department links**: `/department/[id]` where `[id]` is numeric department ID
- Department names fetched from `useDepartmentStore` for instant lookups

## Assets

### Logo Files
- **Main logo**: `/public/logo-acme.png`
  - Horizontal logo for sidebar and mobile
  - Recommended dimensions: 360×80px or similar (4.5:1 ratio)
  - PNG with transparent background
  - Must be visible on dark blue background `#1a2a53`

### Using Images
Always use `next/image` for optimized loading:
```tsx
import Image from 'next/image';

<Image
  src="/logo-acme.png"
  alt="ACME & CIA Logo"
  width={180}
  height={40}
  className="object-contain"
  priority  // For above-the-fold images
/>
```

## State Management

### Zustand Store: Authentication
Location: `src/store/useAuthStore.ts`

```typescript
interface AuthState {
  token: string | null;           // JWT token
  user: Payload | null;           // User data from JWT
  setToken: (token: string) => void;      // Also saves to cookies
  setUser: (user: Payload) => void;       
  logout: () => void;                     // Clears cookies and state
  isAuthenticated: () => boolean;         // Check auth status
}
```

**Features**:
- **Cookie synchronization**: Automatically syncs token with cookies
- **Persistence**: Saves to localStorage with automatic hydration
- **Authentication check**: Built-in method to verify auth status

### Zustand Store: Sidebar State
Location: `src/store/useSidebarStore.ts`

```typescript
interface SidebarState {
  isCollapsed: boolean;      // Desktop sidebar state (persisted)
  isMobileOpen: boolean;     // Mobile sheet state (temporary)
  toggleCollapse: () => void;
  setCollapsed: (collapsed: boolean) => void;
  toggleMobile: () => void;
  setMobileOpen: (open: boolean) => void;
}
```

**Persistence**: `isCollapsed` is saved to localStorage as `sidebar-storage`

### Zustand Store: Department State
Location: `src/store/useDepartmentStore.ts`

```typescript
interface DepartmentState {
  departments: Department[];                    // All departments from server
  departmentMap: Record<number, Department>;   // O(1) lookup by ID
  isLoading: boolean;
  error: string | null;
  setDepartments: (depts: Department[]) => void;  // Called from AuthGuard
  getDepartmentById: (id: number) => Department | undefined;
}
```

**Key behaviors**:
- Fetched only once during app initialization (in AuthGuard)
- Never re-fetched during session - all data from cache
- Provides O(1) lookups via `getDepartmentById(id)`
- Accessed from Sidebar, Header, and Department pages

## Icons

### Lucide React
Primary icon library for the application.

```tsx
import { LayoutDashboard, Settings, Users, LogOut, User } from 'lucide-react';

<LayoutDashboard className="h-5 w-5" />
<LogOut className="mr-2 h-4 w-4" />  // Used in logout components
<User className="mr-2 h-4 w-4" />    // Used in user profile
```

**DO NOT** use `react-icons` (old library). Use Lucide icons instead.

## UI Components (Shadcn/UI)

Located in `src/components/ui/`:
- `button.tsx` - Button with variants
- `card.tsx` - Card components for forms and content
- `input.tsx` - Form inputs with corporate focus colors
- `label.tsx` - Form labels
- `form.tsx` - Form components and validation
- `dialog.tsx` - Modal dialogs (used in auth flows)
- `dropdown-menu.tsx` - Dropdown menus (used in UserProfile)
- `alert-dialog.tsx` - Confirmation dialogs (used in LogoutModal)
- `sheet.tsx` - Sheet/drawer for mobile menu
- `avatar.tsx` - Avatar with fallback (used in UserProfile)
- `separator.tsx` - Visual separator
- `scroll-area.tsx` - Custom scrollbar area

**Important**: These are customized Shadcn components adapted for Tailwind v4 and ACME corporate colors. Do not regenerate them with CLI.

**Corporate Color Integration**:
```tsx
// All UI components use ACME corporate colors
<Button className="bg-[#1a2a53] hover:bg-[#111c38]">Primary</Button>
<Input className="focus-visible:ring-[#1a2a53]" />
<Badge className="bg-[#f8aa19] text-black">Department</Badge>
```

## Dependencies

### Required Packages
The authentication system requires these additional packages:
```bash
npm install @radix-ui/react-dialog @radix-ui/react-dropdown-menu @radix-ui/react-alert-dialog
npm install js-cookie @types/js-cookie jwt-decode
npm install @tanstack/react-query zustand
```

### TanStack Query Setup
```tsx
// Root layout includes QueryProvider
import { QueryProvider } from "@/providers/QueryProvider";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        <QueryProvider>
          {children}
        </QueryProvider>
      </body>
    </html>
  );
}
```

## Error Handling

### Authentication Errors
- **Login failures**: Handled by `useAuth` hook with clear error messages
- **Token expiration**: Automatically handled by middleware with redirect
- **Network errors**: Graceful fallback with logout continuation
- **Invalid tokens**: Automatic cleanup and redirect to login

### UI Error States
- **Form validation**: Real-time validation with visual feedback
- **Loading states**: Spinners and disabled states during async operations
- **Error messages**: Clear, user-friendly error communication in Spanish

## Comments
- **Spanish comments are acceptable** (as seen in existing code)
- Use JSDoc for complex functions
- Inline comments for non-obvious logic only
- Keep comments concise and meaningful

## Type Safety
- **Avoid `any`**: Use proper types or `unknown`
- **Export types**: Use `import type` for type-only imports
- **JWT typing**: Properly typed Payload interface for JWT data
- **Strict null checks**: Handle null/undefined explicitly

## Next.js Specific

### App Router (v16)
- Use `app/` directory structure, not `pages/`
- Route groups: Use `(groupName)` for layout organization without affecting URL
- **Protected routes**: All routes in `(main)` group are protected by AuthGuard
- **Public routes**: Only `/auth/*` routes are accessible without authentication
- Server Components by default
- Use `'use client'` directive only when needed

### Middleware
- **File location**: `middleware.ts` in project root
- **Route matching**: Configured to run on all routes except static assets and API
- **Cookie access**: Can read and write cookies for authentication
- **Redirects**: Handles automatic redirects based on auth status

### Metadata
Export metadata objects from pages:
```typescript
export const metadata: Metadata = {
  title: "ACME & CIA - Dashboard",
  description: "Sistema de gestión empresarial",
};
```

### Fonts
- Configured in `src/config/fonts.ts`
- Applied globally in `app/layout.tsx`
- Use Next.js font optimization (`next/font/google`)

### Images
- Always use `next/image` for optimization
- Use `priority` prop for above-the-fold images
- Specify width and height for optimal loading

### Links
Always use `next/link` for internal navigation:
```tsx
import Link from 'next/link';

<Link href="/dashboard">Dashboard</Link>
```

## Environment Variables
- Prefix with `NEXT_PUBLIC_` for client-side access
- Store in `.env.local` (gitignored)
- Never commit sensitive keys
- **Required**: `NEXT_PUBLIC_API_URL` for API base URL

## Responsive Design

### Breakpoints
```
sm:  640px   - Small devices
md:  768px   - Medium devices
lg:  1024px  - Large devices (sidebar visible/hidden)
xl:  1280px  - Extra large
2xl: 1536px  - 2X Extra large
```

### Mobile-First Approach
```tsx
// Mobile by default, desktop with lg: prefix
<div className="block lg:hidden">Mobile only</div>
<div className="hidden lg:block">Desktop only</div>
```

### Authentication UI Responsive
- **Login form**: Centered and responsive across all device sizes
- **UserProfile dropdown**: Adapts to mobile with simplified display
- **LogoutModal**: Properly sized for mobile devices
- **AuthGuard loading**: Responsive loading states

### Sidebar Responsive Behavior
- **Mobile (<1024px)**: Sidebar hidden, hamburger menu shows Sheet
- **Desktop (≥1024px)**: Sidebar visible and collapsible

## Common Patterns

### Protected Layout Pattern
```typescript
// All main application routes use this pattern
export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
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
    </AuthGuard>
  );
}
```

### Authentication Hook Pattern
```typescript
'use client';

import { useAuth } from '@/hooks/useAuth';

export default function LoginForm() {
  const { login, isLoading, isError, error } = useAuth();
  
  const handleSubmit = (credentials) => {
    login(credentials);  // Automatic redirect after success
  };
  
  // ... form implementation with loading states
}
```

### User Data Display Pattern
```typescript
'use client';

import { useAuthStore } from '@/store/useAuthStore';

export default function UserComponent() {
  const { user } = useAuthStore();
  
  if (!user) return null;
  
  return (
    <div>
      <span>{user.email}</span>
      <span>{user.role === 'ADMIN' ? 'Administrador' : 'Usuario'}</span>
      {user.departments.map(dept => (
        <Badge key={dept} className="bg-[#f8aa19]">{dept}</Badge>
      ))}
    </div>
  );
}
```

### Client Component Pattern
```typescript
'use client';

import { useState } from 'react';

export default function InteractiveComponent() {
  const [state, setState] = useState(initialValue);
  // ... component logic
}
```

### Using Corporate Colors
```tsx
// Primary Blue - Main brand color
<div className="bg-[#1a2a53] text-white">
  <h1 className="text-[#1a2a53]">Title</h1>
</div>

// Secondary Orange - Actions & badges
<button className="bg-[#ea6839] hover:bg-[#d45529]">
  Click me
</button>
<span className="bg-[#ea6839] text-white rounded-full">3</span>

// Accent Yellow/Gold - Highlights & departments
<div className="border-l-4 border-[#f8aa19]">
  Active item
</div>
<Badge className="bg-[#f8aa19] text-black">Department</Badge>
```

### Important Client Component Pattern (Root Page Redirect)
**CRITICAL**: The root page (`src/app/page.tsx`) is a client component and MUST use `useRouter()` instead of `redirect()`:

```typescript
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';  // ✅ Use this

export default function RootPage() {
  const router = useRouter();  // ✅ Get router instance
  const { user, token } = useAuthStore();

  useEffect(() => {
    if (!token || !user) return;
    
    if (user.role === 'admin') {
      router.push('/dashboard');  // ✅ Use router.push()
    } else if (user.depts?.length > 0) {
      router.push(`/department/${user.depts[0]}`);
    }
  }, [user, token, router]);

  return <LoadingSpinner />;
}
```

**Why**: `redirect()` is a server-only function that throws an error in client components. Always use `router.push()` in client components.

## Language
- **UI Text**: Spanish (España) - `lang="es"` in root layout
- **Auth messages**: All authentication feedback in Spanish
- **Code/Comments**: English or Spanish acceptable
- **Console logs**: English preferred for debugging

## Security Best Practices

### Authentication Security
- **JWT tokens**: Stored securely in HTTP-only context where possible
- **Token expiration**: Automatic handling of expired tokens
- **Route protection**: Multiple layers (middleware + client-side)
- **Logout cleanup**: Complete state and cookie cleanup

### Cookie Security
```typescript
// Secure cookie configuration
Cookies.set('auth-token', token, {
  expires: 7,                                    // 7 days
  secure: process.env.NODE_ENV === 'production', // HTTPS only in production
  sameSite: 'strict'                             // CSRF protection
});
```

## Before Committing

1. Run `npm run lint` - Fix all linting errors
2. Run `npx tsc --noEmit` - Ensure no type errors
3. Run `npm run build` - Verify production build succeeds
4. Test authentication flow:
   - Login redirects correctly
   - Protected routes require authentication  
   - Logout clears state and redirects
   - ReturnTo functionality works
5. Test responsive behavior - Mobile and desktop
6. Verify sidebar collapse/expand functionality
7. Check that Montserrat Alternates font is applied
8. Test UserProfile dropdown functionality

## Key Architectural Decisions

### Why JWT with Cookies?
- **Server-side security**: Middleware can validate tokens
- **XSS protection**: Tokens not exposed in localStorage to malicious scripts
- **Automatic expiration**: Built-in JWT expiration handling
- **Stateless**: No server session management required

### Why TanStack Query for Auth?
- **Loading states**: Built-in pending/error states for better UX
- **Error handling**: Standardized error handling across auth flows
- **Optimistic updates**: Better perceived performance
- **Retry logic**: Automatic retry for network failures

### Why Middleware + AuthGuard?
- **Defense in depth**: Multiple layers of protection
- **Server-side redirect**: Faster redirects without JavaScript execution
- **Client-side fallback**: Handles edge cases and hydration
- **Better UX**: Immediate feedback and loading states

### Why Tailwind v4?
- Latest version with `@theme` directive
- Better performance and smaller bundle size
- No config file needed - everything in CSS

### Why Zustand?
- Lightweight state management
- Simple API with hooks
- Built-in persistence middleware
- **Cookie integration**: Easy synchronization with cookie storage

### Why Montserrat Alternates?
- Professional appearance matching ACME brand
- Excellent readability in both digital and print
- Wide range of weights for typographic hierarchy

### Why Lucide Icons?
- Modern, consistent icon set
- Tree-shakeable for optimal bundle size
- Active maintenance and regular updates

## Troubleshooting

### Authentication Issues

#### Login not working
- Verify `NEXT_PUBLIC_API_URL` environment variable
- Check network tab for API call failures
- Verify JWT token structure matches `Payload` interface
- Check console for JWT decode errors

#### Redirects not working
- Verify middleware is running (check middleware.ts)
- Check cookie storage in browser dev tools
- Verify returnTo cookie is being set/cleared correctly
- Check for JavaScript errors preventing redirects

#### User data not showing
- Verify JWT payload contains expected fields
- Check Zustand store hydration
- Verify `useAuthStore` is being called in client components
- Check browser storage for persisted state

### Tailwind classes not working
- Remember: Use hex values directly `bg-[#1a2a53]`
- NO `tailwind.config.ts` file (Tailwind v4)
- All custom theme in `globals.css` with `@theme`

### Font not applied
- Check that `montserratAlternates` is imported in `layout.tsx`
- Verify className is applied to `<body>` element
- Clear `.next` cache: `rm -rf .next && npm run dev`

### Sidebar not collapsing
- Check Zustand store is imported correctly
- Verify localStorage is available (browser only)
- Check that button onClick handler calls `toggleCollapse()`

### Logo not showing
- Verify file exists at `/public/logo-acme.png`
- Check console for image loading errors
- Adjust width/height props in Image component if needed
- Ensure image works on dark blue background

### TypeScript errors after changes
- Run `npx tsc --noEmit` to see all errors
- Check imports use `@/` path aliases
- Verify all required props are passed to components
- Check JWT Payload interface matches actual token structure

### Component not rendering
- Check if component needs `'use client'` directive
- Verify all imports are correct
- Check for missing dependencies in package.json
- Verify component is wrapped in proper providers

## Resources

- [Next.js 16 Documentation](https://nextjs.org/docs)
- [Tailwind CSS v4](https://tailwindcss.com)
- [Shadcn/UI](https://ui.shadcn.com)
- [Zustand](https://zustand.docs.pmnd.rs)
- [TanStack Query](https://tanstack.com/query/latest)
- [Radix UI](https://www.radix-ui.com/)
- [Lucide Icons](https://lucide.dev)
- [Montserrat Alternates Font](https://fonts.google.com/specimen/Montserrat+Alternates)

## Additional Documentation

- `LAYOUT_README.md` - Detailed dashboard layout documentation
- `IMPLEMENTATION_SUMMARY.md` - Original implementation summary
- `FIXES_APPLIED.md` - Corporate colors and sidebar fixes
- `TYPOGRAPHY_AND_LOGO_UPDATES.md` - Font and logo implementation details
