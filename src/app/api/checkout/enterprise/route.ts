/**
 * Checkout Enterprise — Endpoint unificado (Strategy Pattern).
 * 
 * Selecciona automáticamente la pasarela activa según ACTIVE_PAYMENT_GATEWAY.
 * Soporta bypass directo via DIRECT_CHECKOUT_URL para gateways externos (Gumroad, PayPhone).
 */

import { NextRequest, NextResponse } from 'next/server';
import { PaymentGatewayFactory } from '@/lib/payments/factory';

export const runtime = 'nodejs';

// Use GET so a simple <a href> or window.location works
export async function GET(req: NextRequest) {
  // 1. Bypass directo a URL externa si se define (Gumroad, PayPhone, etc.)
  if (process.env.DIRECT_CHECKOUT_URL) {
    return NextResponse.redirect(process.env.DIRECT_CHECKOUT_URL, 303);
  }

  // 2. Crear sesión de checkout via Strategy Pattern
  try {
    const gateway = PaymentGatewayFactory.create();
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || new URL('/', req.url).toString();

    const { redirectUrl } = await gateway.createCheckoutSession({
      successUrl: `${appUrl}/?payment=success`,
      cancelUrl: `${appUrl}/?payment=cancelled`,
      customData: { source: 'landing' },
    });

    return NextResponse.redirect(redirectUrl, 303);

  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Error desconocido';
    console.error(`[CHECKOUT_ERROR][${PaymentGatewayFactory.getActiveType()}]:`, msg);
    return NextResponse.redirect(new URL('/?payment=error', req.url), 303);
  }
}