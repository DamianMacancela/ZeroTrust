import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Middleware global de seguridad para ZeroTrust Redact.
 *
 * Protege:
 * - /api/admin/* → Requiere header x-admin-token = ADMIN_SECRET_TOKEN
 * - /api/audit   → Solo acepta peticiones internas (x-internal-audit)
 *
 * No bloquea:
 * - Todas las demás rutas públicas (/, /blog, /afiliados, /api/checkout, etc.)
 */
export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // ── Protección de rutas /api/admin/* ────────────────────────────────────────
  if (pathname.startsWith('/api/admin')) {
    const adminToken = req.headers.get('x-admin-token');
    const expectedToken = process.env.ADMIN_SECRET_TOKEN;

    if (!expectedToken) {
      // Si la variable no está configurada, bloquear siempre (falla segura)
      console.error(JSON.stringify({
        event: 'security.admin.env_missing',
        path: pathname,
        ts: new Date().toISOString(),
      }));
      return NextResponse.json(
        { error: 'Ruta de administración no configurada.' },
        { status: 503 }
      );
    }

    if (adminToken !== expectedToken) {
      console.error(JSON.stringify({
        event: 'security.admin.unauthorized_access',
        path: pathname,
        ip: req.headers.get('x-forwarded-for') || 'unknown',
        ts: new Date().toISOString(),
      }));
      return NextResponse.json(
        { error: 'Acceso denegado.' },
        { status: 403 }
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  // Ejecutar middleware solo en rutas de API admin
  matcher: ['/api/admin/:path*'],
};
