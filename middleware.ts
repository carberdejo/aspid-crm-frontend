import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Rutas donde NO se necesita estar logueado
const PUBLIC_ROUTES = [
  "/auth/login",
  "/auth/register",
  "/auth/forgot-password",
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Solo verificamos si el string de la cookie existe, no lo decodificamos
  const token = request.cookies.get("auth-token")?.value;
  const isPublicRoute = PUBLIC_ROUTES.some((route) =>
    pathname.startsWith(route),
  );

  // 1. No tiene token y va a una ruta protegida -> Pa' fuera (Login)
  if (!token && !isPublicRoute) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  // 2. Ya tiene token e intenta ir al Login -> Al inicio/dashboard
  if (token && isPublicRoute) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // 3. Dejar pasar.
  // Si el token es inválido o expiró, el interceptor de Axios (fetch)
  // se encargará de hacer el logout y redirigir.
  return NextResponse.next();
}

export const config = {
  // Ignorar archivos estáticos, imágenes y llamadas directas a APIs de Next.
  // /brand (logos y favicons de public/brand) debe verse sin sesión, p. ej. en el login
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|brand/).*)"],
};
