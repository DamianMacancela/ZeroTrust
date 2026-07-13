import Stripe from 'stripe';

// Lazy factory -- nunca instancia en scope global
export function getStripe(): Stripe {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key || !key.startsWith('sk_')) {
    throw new Error('STRIPE_SECRET_KEY invalida o no configurada');
  }
  return new Stripe(key, {
    apiVersion: '2026-06-24.dahlia',
    appInfo: { name: 'ZeroTrust Tech', version: '1.0.0' },
  });
}