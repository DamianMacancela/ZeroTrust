'use server';

import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { createCheckout, lemonSqueezySetup } from '@lemonsqueezy/lemonsqueezy.js';

export async function createCheckoutSession(): Promise<{ error?: string } | void> {
  const apiKey = process.env.LEMONSQUEEZY_API_KEY;
  const storeId = process.env.LEMONSQUEEZY_STORE_ID;
  const variantId = process.env.LEMONSQUEEZY_VARIANT_ID;

  if (!apiKey || !storeId || !variantId) {
     return { error: 'Modo Produccion: Falta configurar variables de LemonSqueezy en Vercel (API_KEY, STORE_ID, VARIANT_ID).' };
  }

  lemonSqueezySetup({ apiKey });

  try {
    const { data, error } = await createCheckout(storeId, variantId, {
      checkoutOptions: {
        embed: false,
        media: false,
        buttonColor: '#0EA5E9',
      },
      checkoutData: {
        custom: {
          product: 'ZeroTrust Tech Enterprise',
        }
      }
    });

    if (error) {
      console.error('[LEMON_CHECKOUT_ERROR]:', error);
      return { error: 'Error al generar la sesion de pago. Asegurese de que la tienda en Lemon Squeezy este activa.' };
    }

    if (data && data.data.attributes.url) {
      redirect(data.data.attributes.url);
    } else {
      return { error: 'No se pudo generar el enlace de pago seguro.' };
    }
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error';
    if (msg.includes('NEXT_REDIRECT')) {
      throw err; // Requerido por Next.js router
    }
    console.error('[CHECKOUT_EXCEPTION]:', msg);
    return { error: 'Error interno en la red de pagos. Intente mas tarde.' };
  }
}
