import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createHmac } from 'crypto';

// En producción esto vendrá de tu .env.local
const SECRET = process.env.USAGE_HMAC_SECRET || 'ZTR_ENTERPRISE_SECRET_KEY_2026';
const FREE_LIMIT = 1;
const COOKIE_NAME = 'ztr_secure_session';

// Función para leer y validar la cookie a prueba de manipulaciones
async function getValidatedCount() {
  const cookieStore = await cookies();
  const rawCookie = cookieStore.get(COOKIE_NAME)?.value;
  if (!rawCookie) return 0;

  try {
    const payload = Buffer.from(rawCookie, 'base64').toString('utf8');
    const { count, sig } = JSON.parse(payload);
    
    // Verificamos que el usuario no haya alterado el número
    const expectedSig = createHmac('sha256', SECRET).update(String(count)).digest('hex');
    if (sig !== expectedSig) return FREE_LIMIT; // Si manipuló la cookie, lo bloqueamos de inmediato
    
    return Number(count);
  } catch (error) {
    return FREE_LIMIT; 
  }
}

export async function GET() {
  const cookieStore = await cookies();
  
  // 1. Check for Enterprise Token (PayPal active subscription)
  const enterpriseCookie = cookieStore.get('grc_enterprise_token')?.value;
  let isEnterprise = false;
  
  if (enterpriseCookie) {
    try {
      const payload = Buffer.from(enterpriseCookie, 'base64').toString('utf8');
      const { status, sig } = JSON.parse(payload);
      const expectedSig = createHmac('sha256', SECRET).update('enterprise_active').digest('hex');
      
      if (sig === expectedSig && status === 'active') {
        isEnterprise = true;
      }
    } catch (e) {
      // Invalid cookie, ignore
    }
  }

  // 2. Check for free trial limit
  const count = await getValidatedCount();
  
  return NextResponse.json({ 
    count, 
    allowed: isEnterprise || count < FREE_LIMIT, 
    subscriptionActive: isEnterprise 
  });
}

export async function POST() {
  const currentCount = await getValidatedCount();
  const newCount = currentCount + 1;
  
  // Firmamos el nuevo valor
  const sig = createHmac('sha256', SECRET).update(String(newCount)).digest('hex');
  const payload = Buffer.from(JSON.stringify({ count: newCount, sig })).toString('base64');

  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, payload, {
    httpOnly: true, // ¡CRÍTICO! Hace que sea invisible para el F12 (JavaScript)
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 24 * 30, // Expira en 30 días
    path: '/',
  });

  return NextResponse.json({ count: newCount, allowed: newCount < FREE_LIMIT });
}
