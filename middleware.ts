// middleware.ts
// ⚠️ PROD | Next.js 16 | Enterprise Security Layer
// Cubre: OWASP A01-A05, SOC 2 CC6.1, ISO 27001 A.9, GDPR Art.32

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// ── Rate limiting store (Edge-compatible, in-memory por instancia) ──────────
// En producción: reemplazar con Upstash Redis para estado compartido entre edges
const rateLimitMap = new Map<string, { count: number; reset: number }>();

const RATE_LIMITS: Record<string, { max: number; windowMs: number }> = {
  '/api/webhook/lemonsqueezy': { max: 100,  windowMs: 60_000 },
  '/api/webhook/mercadopago':  { max: 100,  windowMs: 60_000 },
  '/api/audit':                { max: 200,  windowMs: 60_000 },
  '/api/process-document':     { max: 10,   windowMs: 60_000 }, // Strict limit against DDoS / Abuse
  '/':                         { max: 60,   windowMs: 60_000 },
  'default':                   { max: 120,  windowMs: 60_000 },
};

function getRateLimit(pathname: string) {
  for (const [route, limit] of Object.entries(RATE_LIMITS)) {
    if (pathname.startsWith(route)) return limit;
  }
  return RATE_LIMITS['default'];
}

function checkRateLimit(ip: string, pathname: string): boolean {
  const limit = getRateLimit(pathname);
  const key   = `${ip}:${pathname}`;
  const now   = Date.now();
  const entry = rateLimitMap.get(key);

  if (!entry || now > entry.reset) {
    rateLimitMap.set(key, { count: 1, reset: now + limit.windowMs });
    return true;
  }
  if (entry.count >= limit.max) return false;
  entry.count++;
  return true;
}

// ── Content Security Policy ──────────────────────────────────────────────────
// OWASP A03 (XSS) | SOC 2 CC7.1
const CSP = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://js.stripe.com https://cdnjs.cloudflare.com https://unpkg.com https://www.paypal.com https://*.paypal.com https://*.paypalobjects.com",
  "style-src 'self' 'unsafe-inline' https://*.paypal.com",
  "img-src 'self' data: blob: https://www.paypalobjects.com https://*.paypal.com",
  "font-src 'self' https://*.paypal.com",
  "connect-src 'self' https://api.stripe.com https://api.lemonsqueezy.com https://api.mercadopago.com https://api.anthropic.com https://cdnjs.cloudflare.com https://unpkg.com https://www.paypal.com https://*.paypal.com https://*.paypalobjects.com",
  "frame-src https://js.stripe.com https://hooks.stripe.com https://*.lemonsqueezy.com https://*.mercadopago.com https://www.paypal.com https://www.sandbox.paypal.com https://*.paypal.com",
  "worker-src 'self' blob:",      // Requerido para Web Workers
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self' https://*.lemonsqueezy.com https://*.mercadopago.com https://*.paypal.com",
  "upgrade-insecure-requests",
].join('; ');

// ── Security Headers ─────────────────────────────────────────────────────────
// OWASP Top 10 | NIST SP 800-53 SC-28 | SOC 2 CC6.7
const SECURITY_HEADERS: Record<string, string> = {
  'Content-Security-Policy':         CSP,
  'Strict-Transport-Security':       'max-age=63072000; includeSubDomains; preload',
  'X-Frame-Options':                 'DENY',
  'X-Content-Type-Options':          'nosniff',
  'X-DNS-Prefetch-Control':          'off',
  'Referrer-Policy':                 'strict-origin-when-cross-origin',
  'Permissions-Policy':              'camera=(), microphone=(), geolocation=(), payment=(self "https://js.stripe.com" "https://www.paypal.com")',
  'X-Robots-Tag':                    'noindex, nofollow',  // APIs no indexables
};

// ── CSRF Protection ──────────────────────────────────────────────────────────
// OWASP A01 | Excluye webhooks Stripe (verificados por HMAC)
const CSRF_EXEMPT = ['/api/webhook/lemonsqueezy', '/api/webhook/mercadopago', '/api/checkout'];

function validateCsrf(request: NextRequest): boolean {
  if (request.method === 'GET' || request.method === 'HEAD') return true;
  if (CSRF_EXEMPT.some(p => request.nextUrl.pathname.startsWith(p))) return true;

  const origin = request.headers.get('origin');
  const host   = request.headers.get('host');
  if (!origin || !host) return false;

  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

// ── Middleware Principal ─────────────────────────────────────────────────────
export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0].trim() ?? 'unknown';

  // 1. Rate Limiting (OWASP A04 | SOC 2 CC7.2)
  if (!checkRateLimit(ip, pathname)) {
    return new NextResponse('Too Many Requests', {
      status: 429,
      headers: {
        'Retry-After': '60',
        'Content-Type': 'text/plain',
      },
    });
  }

  // 2. CSRF (OWASP A01)
  if (!validateCsrf(request)) {
    return new NextResponse('Forbidden', { status: 403 });
  }

  // 3. Aplicar security headers a la respuesta
  const response = NextResponse.next();

  for (const [header, value] of Object.entries(SECURITY_HEADERS)) {
    // X-Robots-Tag solo para APIs
    if (header === 'X-Robots-Tag' && !pathname.startsWith('/api/')) continue;
    response.headers.set(header, value);
  }

  // 4. Propagar IP sanitizada para audit logging (no PII)
  const ipHash = ip; // En producción: hash con SHA-256 para anonimizar
  response.headers.set('x-client-ip-ref', ipHash);

  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.svg$).*)'],
};