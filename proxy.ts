// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Middleware de Next.js para proteger rutas ANTES de renderizar.
 * 
 * Verifica si existe la cookie de autenticación:
 * - Si existe: Permite acceso
 * - Si NO existe: Redirige al login
 * 
 * VENTAJAS:
 * - Se ejecuta a nivel servidor (imposible saltarse)
 * - Más rápido que cargar React y hacer fetch('/me')
 * - Evita flickering y carga innecesaria de código
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ═══════════════════════════════════════════════════════
  // PORTAL DE PADRES - Requiere cookie 'parent_token'
  // ═══════════════════════════════════════════════════════
  if (
    pathname.startsWith('/help-center') ||
    pathname.startsWith('/parents/dashboard')
  ) {
    const token = request.cookies.get('parent_token')?.value;

    if (!token) {
      console.log(`🔒 [Middleware] Acceso denegado a ${pathname} - No hay parent_token`);
      
      // Redirigir al login, guardando la ruta original
      const loginUrl = new URL('/parents/login', request.url);
      loginUrl.searchParams.set('from', pathname);
      
      return NextResponse.redirect(loginUrl);
    }

    console.log(`✅ [Middleware] Acceso permitido a ${pathname} - Token presente`);
  }

  // ═══════════════════════════════════════════════════════
  // PORTAL DE ESTUDIANTES - Requiere cookie 'student_token'
  // ═══════════════════════════════════════════════════════
  if (
    pathname.startsWith('/student/help-center') ||
    pathname.startsWith('/student/dashboard') ||
    pathname.startsWith('/student/library')
  ) {
    const token = request.cookies.get('student_token')?.value;

    if (!token) {
      console.log(`🔒 [Middleware] Acceso denegado a ${pathname} - No hay student_token`);
      
      const loginUrl = new URL('/academics/login', request.url);
      loginUrl.searchParams.set('from', pathname);
      
      return NextResponse.redirect(loginUrl);
    }

    console.log(`✅ [Middleware] Acceso permitido a ${pathname} - Token presente`);
  }

  // ═══════════════════════════════════════════════════════
  // RUTAS PÚBLICAS - No requieren autenticación
  // ═══════════════════════════════════════════════════════
  // /admissions, /, /about, /contact, etc. → Acceso libre

  return NextResponse.next();
}

/**
 * Configuración de rutas donde se aplica el middleware.
 * 
 * IMPORTANTE: Solo rutas que necesitan protección.
 * No incluyas rutas públicas para no ralentizar la app.
 */
export const config = {
  matcher: [
    // Portal de padres
    '/help-center/:path*',
    '/parents/dashboard/:path*',
    
    // Portal de estudiantes
    '/student/help-center/:path*',
    '/student/dashboard/:path*',
    '/student/library/:path*',
  ],
};
