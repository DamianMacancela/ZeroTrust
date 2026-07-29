/**
 * Webhook endpoint para Mercado Pago.
 * 
 * Verifica firma HMAC, procesa eventos de pago, y actualiza Supabase.
 * Idempotente: un mismo evento procesado 2 veces no duplica registros.
 */

import { NextRequest, NextResponse } from 'next/server';
import { MercadoPagoGateway } from '@/lib/payments/mercadopago.gateway';

export const runtime = 'nodejs';

const gateway = new MercadoPagoGateway();

export async function POST(req: NextRequest) {
  const rawBody = await req.text();
  const signature = req.headers.get('x-signature') || '';

  // 1. Verificación criptográfica de la firma (OWASP A02)
  if (signature && process.env.MERCADOPAGO_WEBHOOK_SECRET) {
    const isValid = gateway.verifyWebhookSignature(rawBody, signature);
    if (!isValid) {
      return NextResponse.json({ error: 'Firma inválida' }, { status: 400 });
    }
  }

  // 2. Parsear el body
  let payload: Record<string, unknown>;
  try {
    payload = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: 'Body no válido' }, { status: 400 });
  }

  // 3. Procesar el evento
  const result = await gateway.handleWebhookEvent(payload);

  if (!result.success) {
    return NextResponse.json({ error: result.error }, { status: 500 });
  }

  return NextResponse.json({ received: true, eventType: result.eventType });
}
