/**
 * LemonSqueezyGateway — Adaptador Strategy para el código existente de Lemon Squeezy.
 * 
 * Encapsula la lógica que antes estaba directamente en route.ts 
 * para que sea intercambiable via Factory.
 */

import { createCheckout, lemonSqueezySetup } from '@lemonsqueezy/lemonsqueezy.js';
import crypto from 'crypto';
import { getSupabaseAdmin } from '@/lib/supabase-admin';
import type { IPaymentGateway, CheckoutOptions, CheckoutResult, WebhookResult } from './types';

function log(level: 'INFO' | 'WARN' | 'ERROR', event: string, meta: Record<string, unknown>) {
  const entry = { timestamp: new Date().toISOString(), level, service: 'lemonsqueezy', event, ...meta };
  if (level === 'ERROR') console.error(JSON.stringify(entry));
  else console.log(JSON.stringify(entry));
}

export class LemonSqueezyGateway implements IPaymentGateway {
  readonly name = 'LEMONSQUEEZY';

  async createCheckoutSession(options: CheckoutOptions): Promise<CheckoutResult> {
    const apiKey = process.env.LEMONSQUEEZY_API_KEY;
    const storeId = process.env.LEMONSQUEEZY_STORE_ID;
    const variantId = process.env.LEMONSQUEEZY_VARIANT_ID;

    if (!apiKey || !storeId || !variantId) {
      throw new Error('[LemonSqueezy] Claves faltantes: LEMONSQUEEZY_API_KEY, STORE_ID, VARIANT_ID');
    }

    lemonSqueezySetup({ apiKey });

    const { data, error } = await createCheckout(storeId, variantId, {
      checkoutOptions: {
        embed: false,
        media: false,
        logo: true,
      },
      checkoutData: {
        email: options.email,
        custom: {
          product: 'ZeroTrust Tech Enterprise',
          source: 'landing',
          ...options.customData,
        },
      },
      testMode: process.env.LEMONSQUEEZY_TEST_MODE === 'true' || process.env.VERCEL_ENV !== 'production',
    });

    if (error) {
      log('ERROR', 'checkout.api_error', { error: error.message });
      throw new Error(error.message);
    }

    if (!data?.data?.attributes?.url) {
      throw new Error('Lemon Squeezy no devolvió URL de sesión');
    }

    log('INFO', 'checkout.created', { checkoutId: data.data.id });
    return { redirectUrl: data.data.attributes.url };
  }

  verifyWebhookSignature(rawBody: string, signature: string): boolean {
    const secret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET;
    if (!secret) {
      log('ERROR', 'webhook.no_secret', {});
      return false;
    }

    const hmac = crypto.createHmac('sha256', secret);
    const digest = Buffer.from(hmac.update(rawBody).digest('hex'), 'utf8');
    const signatureBuffer = Buffer.from(signature, 'utf8');

    if (digest.length !== signatureBuffer.length) return false;
    return crypto.timingSafeEqual(digest, signatureBuffer);
  }

  async handleWebhookEvent(payload: Record<string, unknown>): Promise<WebhookResult> {
    const meta = payload.meta as Record<string, unknown>;
    const data = payload.data as Record<string, unknown>;

    if (!meta || !data) {
      return { success: false, error: 'Payload incompleto' };
    }

    const eventName = meta.event_name as string;
    const attributes = (data.attributes || {}) as Record<string, unknown>;

    log('INFO', 'webhook.received', { eventType: eventName, eventId: meta.webhook_id });

    try {
      const supabase = getSupabaseAdmin();

      if (eventName === 'subscription_created' || eventName === 'subscription_updated') {
        const email = attributes.user_email as string;
        const customerId = String(attributes.customer_id);
        const subscriptionId = String(data.id);
        const status = attributes.status as string;

        if (!email || !customerId || !subscriptionId) {
          return { success: false, error: 'Datos incompletos' };
        }

        const role = (status === 'active' || status === 'past_due') ? 'ENTERPRISE' : 'FREE';

        const { error: dbError } = await supabase.from('users').upsert(
          {
            email,
            billing_customer_id: customerId,
            billing_subscription_id: subscriptionId,
            role,
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'email' }
        );

        if (dbError) {
          log('ERROR', 'webhook.db_upsert_failed', { code: dbError.code });
          return { success: false, error: 'Error DB' };
        }
        log('INFO', 'subscription.updated', { customerId, role });
      }

      if (eventName === 'subscription_expired' || eventName === 'subscription_cancelled') {
        const customerId = String(attributes.customer_id);

        const { error: dbError } = await supabase.from('users')
          .update({ role: 'FREE', billing_subscription_id: null, updated_at: new Date().toISOString() })
          .eq('billing_customer_id', customerId);

        if (dbError) log('ERROR', 'subscription.cancel_db_failed', { code: dbError.code });
        else log('INFO', 'subscription.cancelled', { customerId });
      }

      return { success: true, eventType: eventName };

    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : 'Unknown';
      log('ERROR', 'webhook.handler_exception', { eventType: eventName, message: msg });
      return { success: false, error: msg };
    }
  }
}
