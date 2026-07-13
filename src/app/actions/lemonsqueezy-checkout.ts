'use server';

import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { createCheckout, lemonSqueezySetup } from '@lemonsqueezy/lemonsqueezy.js';

export async function createCheckoutSession(): Promise<{ error?: string } | void> {
  // BYPASS TEMPORAL PARA TESTING
  const headersList = await headers();
  const origin =
    headersList.get('origin') ||
    process.env.NEXT_PUBLIC_APP_URL ||
    'https://zerotrust-redact.vercel.app';
  
  redirect(`${origin}/?payment=success`);
}
