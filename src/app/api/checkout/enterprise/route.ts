import { NextRequest, NextResponse } from 'next/server';
import { createCheckout, lemonSqueezySetup } from '@lemonsqueezy/lemonsqueezy.js';

export const runtime = 'nodejs';

// Use GET so a simple <a href> or window.location works
export async function GET(req: NextRequest) {
  // Bypass directo a Gumroad / PayPhone si se define para ventas inmediatas sin esperar revisiones
  if (process.env.DIRECT_CHECKOUT_URL) {
    return NextResponse.redirect(process.env.DIRECT_CHECKOUT_URL, 303);
  }

  const apiKey = process.env.LEMONSQUEEZY_API_KEY;
  const storeId = process.env.LEMONSQUEEZY_STORE_ID;
  const variantId = process.env.LEMONSQUEEZY_VARIANT_ID;

  if (!apiKey || !storeId || !variantId) {
    console.error('[CHECKOUT] Lemon Squeezy keys missing:', {
      hasApi: !!apiKey,
      hasStore: !!storeId,
      hasVariant: !!variantId,
    });
    return NextResponse.redirect(new URL('/?payment=config_error', req.url), 303);
  }

  lemonSqueezySetup({ apiKey });

  try {
    const { data, error } = await createCheckout(storeId, variantId, {
      checkoutOptions: {
        embed: false,
        media: false,
        logo: true,
      },
      checkoutData: {
        custom: {
          product: 'ZeroTrust Tech Enterprise',
          source: 'landing',
        }
      },
      // Force test mode if the store is pending approval, or if it's not production
      testMode: process.env.LEMONSQUEEZY_TEST_MODE === 'true' || process.env.VERCEL_ENV !== 'production'
    });

    if (error) {
      console.error('[CHECKOUT_LEMONSQUEEZY_API_ERROR]:', error);
      throw new Error(error.message);
    }

    if (!data?.data?.attributes?.url) {
      throw new Error('Lemon Squeezy no devolvio URL de sesion');
    }

    return NextResponse.redirect(data.data.attributes.url, 303);

  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Error desconocido';
    console.error('[CHECKOUT_ERROR]:', msg);
    return NextResponse.redirect(new URL('/?payment=error', req.url), 303);
  }
}