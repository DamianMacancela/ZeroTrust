import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

export const runtime = 'nodejs';

// Use GET so a simple <a href> or window.location works — no form, no CSRF
export async function GET(req: NextRequest) {
  const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
  const STRIPE_PRICE_ID = process.env.STRIPE_PRICE_ID_PRO;

  if (!STRIPE_SECRET_KEY || !STRIPE_PRICE_ID) {
    console.error('[CHECKOUT] STRIPE keys missing:', {
      hasSecret: !!STRIPE_SECRET_KEY,
      hasPrice: !!STRIPE_PRICE_ID,
    });
    return NextResponse.redirect(new URL('/?payment=config_error', req.url), 303);
  }

  const stripe = new Stripe(STRIPE_SECRET_KEY, {
    apiVersion: '2026-06-24.dahlia',
  });

  try {
    const origin =
      process.env.NEXT_PUBLIC_APP_URL ||
      req.nextUrl.origin;

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [{ price: STRIPE_PRICE_ID, quantity: 1 }],
      success_url: origin + '/?payment=success',
      cancel_url: origin + '/?payment=cancelled',
      metadata: {
        product: 'ZeroTrust Tech Enterprise',
        source: 'landing',
      },
    });

    if (!session.url) {
      throw new Error('Stripe no devolvio URL de sesion');
    }

    return NextResponse.redirect(session.url, 303);

  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Error desconocido';
    console.error('[CHECKOUT_ERROR]:', msg);
    return NextResponse.redirect(new URL('/?payment=error', req.url), 303);
  }
}