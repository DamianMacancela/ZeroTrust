import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
    console.warn("ADVERTENCIA: STRIPE_SECRET_KEY no está definido en .env.local");
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder', {
  apiVersion: '2024-04-10',
  typescript: true,
});
