'use server';

import { stripe } from '@/lib/stripe';
import { redirect } from 'next/navigation';
import { headers } from 'next/headers';

export async function createCheckoutSession() {
  let sessionUrl: string | null = null;
  
  try {
    const headersList = await headers();
    const origin = headersList.get('origin') || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    
    // Validación de llaves
    if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_SECRET_KEY.startsWith('sk_')) {
        return { error: 'Llave Secreta de Stripe inválida en .env.local' };
    }
    
    if (!process.env.STRIPE_PRICE_ID_PRO || !process.env.STRIPE_PRICE_ID_PRO.startsWith('price_')) {
        return { error: 'El ID del precio debe empezar con "price_" en .env.local' };
    }

    // Creación de la sesión de COBRO MENSUAL AUTOMÁTICO
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription', // 🔴 ESTO HACE QUE SE COBRE CADA MES AUTOMÁTICAMENTE
      payment_method_types: ['card'],
      line_items: [{ 
        price: process.env.STRIPE_PRICE_ID_PRO, 
        quantity: 1 
      }],
      success_url: `${origin}/?payment=success`,
      cancel_url: `${origin}/?payment=cancelled`,
    });
    
    sessionUrl = session.url;
  } catch (error: any) {
    console.error('[STRIPE_ERROR_CRÍTICO]:', error);
    // Si creaste un producto de pago único en Stripe, aquí te avisará.
    return { error: error.message || 'Error al conectar con el banco.' };
  }

  if (sessionUrl) {
    redirect(sessionUrl);
  }
}
