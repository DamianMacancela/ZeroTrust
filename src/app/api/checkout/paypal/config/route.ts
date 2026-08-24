import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

/**
 * Retorna la configuración pública necesaria para inicializar el SDK de PayPal en el cliente.
 * Lee tanto PAYPAL_CLIENT_ID (Secreto en Vercel) como NEXT_PUBLIC_PAYPAL_CLIENT_ID.
 */
export async function GET() {
  const clientId = process.env.PAYPAL_CLIENT_ID || process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;

  if (!clientId) {
    return NextResponse.json(
      { error: 'PayPal Client ID no configurado en las variables de entorno' },
      { status: 503 }
    );
  }

  return NextResponse.json({
    clientId,
    environment: process.env.NODE_ENV === 'production' ? 'live' : 'sandbox'
  });
}
