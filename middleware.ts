import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtDecode } from 'jwt-decode';
import { Payload } from '@/interfaces/api.interface';
import { UserRole } from '@/interfaces/role-user.interface';

// Solo /auth/* es ruta pública
const PUBLIC_ROUTES = ['/auth/login', '/auth/register', '/auth/forgot-password'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('auth-token')?.value;

  const isPublicRoute = PUBLIC_ROUTES.some(route => pathname.startsWith(route));

  try {
    // 1. Sin Token
    if (!token) {
      if (!isPublicRoute) {
        // Guardar la URL a la que intentaba acceder para redirigir después del login
        const response = NextResponse.redirect(new URL('/auth/login', request.url));
        response.cookies.set('return-to', pathname, { maxAge: 86400, sameSite: 'strict' });
        return response;
      }
      // Es ruta pública, permitir acceso
      return NextResponse.next();
    }

    // 2. Con Token - Validar
    try {
      const payload = jwtDecode<Payload>(token);
      const currentTime = Date.now() / 1000;

      // Token expirado: redirigir a login para que se refresque
      if (payload.exp && payload.exp < currentTime) {
        const response = NextResponse.redirect(new URL('/auth/login', request.url));
        response.cookies.set('return-to', pathname, { maxAge: 86400, sameSite: 'strict' });
        response.cookies.delete('auth-token');
        return response;
      }

      // Si usuario logueado intenta entrar a /auth/*, redirigir a landing apropiada
      if (pathname.startsWith('/auth/')) {
        if (payload.role === UserRole.ADMIN) {
          return NextResponse.redirect(new URL('/dashboard', request.url));
        } else if (payload.depts && payload.depts.length > 0) {
          return NextResponse.redirect(new URL(`/department/${payload.depts[0]}`, request.url));
        }
      }

      // RBAC: USER no puede acceder a /dashboard, redirigir a su primer departamento
      if (pathname.startsWith('/dashboard') && payload.role !== UserRole.ADMIN) {
        const firstDept = payload.depts?.[0];
        if (firstDept) {
          return NextResponse.redirect(new URL(`/department/${firstDept}`, request.url));
        }
      }

      // ✅ NUEVA VALIDACIÓN: Rutas dinámicas de departamentos
      // Valida que el department ID sea válido y el user tenga acceso
      const departmentMatch = pathname.match(/^\/department\/(\d+)$/);
      if (departmentMatch) {
        const departmentId = parseInt(departmentMatch[1], 10);

        // ¿El usuario tiene acceso a este departamento?
        if (!payload.depts || !payload.depts.includes(departmentId)) {
          // User NO tiene acceso a este department
          // Renderizar not-found.tsx sin pasar por el component
          return NextResponse.rewrite(new URL('/not-found', request.url), {
            status: 404,
          });
        }
      }

      // "/" es una ruta de transición, permitir acceso y dejar que React maneje redirección
      if (pathname === '/') {
        return NextResponse.next();
      }

      // Todas las otras rutas protegidas están permitidas aquí
      return NextResponse.next();

    } catch (decodeError) {
      // Token malformado o inválido
      const response = NextResponse.redirect(new URL('/auth/login', request.url));
      response.cookies.delete('auth-token');
      response.cookies.set('return-to', pathname, { maxAge: 86400, sameSite: 'strict' });
      return response;
    }

  } catch {
    // Error inesperado: redirigir a login de forma segura
    const response = NextResponse.redirect(new URL('/auth/login', request.url));
    response.cookies.delete('auth-token');
    return response;
  }
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};

// El middleware se ejecuta en cada petición, incluso en la primera carga.
// Su función es:
// 1. Verificar token en cookies
// 2. Validar expiración del token
// 3. Redirigir sin token a /auth/login
// 4. Aplicar RBAC básico (USER no puede ir a /dashboard)
// 5. Guardar returnTo para redirigir después del login
// 6. Dejar que AuthGuard (cliente) valide adicionales validaciones
