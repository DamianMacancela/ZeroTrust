/**
 * MercadoPagoGateway — Implementación concreta de IPaymentGateway para Mercado Pago.
 * 
 * Soporta: Ecuador, Argentina, Brasil, Chile, Colombia, México, Perú, Uruguay.
 * Documentación: https://www.mercadopago.com.ec/developers/es/reference
 */

import { MercadoPagoConfig, Preference } from 'mercadopago';
import crypto from 'crypto';
import { getSupabaseAdmin } from '@/lib/supabase-admin';
import type { IPaymentGateway, CheckoutOptions, CheckoutResult, WebhookResult } from './types';

function log(level: 'INFO' | 'WARN' | 'ERROR', event: string, meta: Record<string, unknown>) {
  const entry = { timestamp: new Date().toISOString(), level, service: 'mercadopago', event, ...meta };
  if (level === 'ERROR') console.error(JSON.stringify(entry));
  else console.log(JSON.stringify(entry));
}

export class MercadoPagoGateway implements IPaymentGateway {
  readonly name = 'MERCADOPAGO';

  private getClient(): MercadoPagoConfig {
    const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN;
    if (!accessToken) {
      throw new Error('[MercadoPago] MERCADOPAGO_ACCESS_TOKEN no configurado');
    }
    return new MercadoPagoConfig({ accessToken });
  }

  async createCheckoutSession(options: CheckoutOptions): Promise<CheckoutResult> {
    const client = this.getClient();
    const preference = new Preference(client);

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://zerotrust-redact.vercel.app';

    const result = await preference.create({
      body: {
        items: [
          {
            id: 'zerotrust-enterprise',
            title: 'ZeroTrust Redact — Licencia Enterprise',
            description: 'Suscripción mensual al motor de ofuscación Zero-Data nivel Enterprise.',
            quantity: 1,
            unit_price: 19.99,
            currency_id: 'USD',
          },
        ],
        payer: options.email ? { email: options.email } : undefined,
        back_urls: {
          success: options.successUrl || `${appUrl}/?payment=success`,
          failure: `${appUrl}/?payment=error`,
          pending: `${appUrl}/?payment=pending`,
        },
        auto_return: 'approved',
        notification_url: `${appUrl}/api/webhook/mercadopago`,
        statement_descriptor: 'ZEROTRUST REDACT',
        external_reference: JSON.stringify({
          product: 'ZeroTrust Tech Enterprise',
          source: 'landing',
          ...options.customData,
        }),
      },
    });

    if (!result.init_point) {
      log('ERROR', 'checkout.no_init_point', { resultId: result.id });
      throw new Error('Mercado Pago no devolvió URL de checkout');
    }

    log('INFO', 'checkout.created', { preferenceId: result.id });
    return { redirectUrl: result.init_point };
  }

  verifyWebhookSignature(rawBody: string, signature: string): boolean {
    const secret = process.env.MERCADOPAGO_WEBHOOK_SECRET;
    if (!secret) {
      log('ERROR', 'webhook.no_secret', {});
      return false;
    }

    // Mercado Pago firma con x-signature header: ts=xxx,v1=xxx
    // Parseamos los componentes
    const parts = signature.split(',');
    const tsRaw = parts.find(p => p.startsWith('ts='));
    const v1Raw = parts.find(p => p.startsWith('v1='));

    if (!tsRaw || !v1Raw) {
      log('WARN', 'webhook.malformed_signature', { signature });
      return false;
    }

    const ts = tsRaw.replace('ts=', '');
    const v1 = v1Raw.replace('v1=', '');

    // Construir el manifest para verificar
    // MP usa: id + ts como payload para la firma HMAC
    let dataId = '';
    try {
      const body = JSON.parse(rawBody);
      dataId = body?.data?.id?.toString() || '';
    } catch {
      // Si no se puede parsear, usar el body crudo
    }

    const manifest = `id:${dataId};request-id:;ts:${ts};`;
    const hmac = crypto.createHmac('sha256', secret).update(manifest).digest('hex');

    const isValid = crypto.timingSafeEqual(
      Buffer.from(hmac, 'utf8'),
      Buffer.from(v1, 'utf8')
    );

    if (!isValid) {
      log('ERROR', 'webhook.signature_invalid', { expected: hmac.substring(0, 12) + '...' });
    }

    return isValid;
  }

  async handleWebhookEvent(payload: Record<string, unknown>): Promise<WebhookResult> {
    const eventType = payload.type as string;
    const action = payload.action as string;
    const dataId = (payload.data as Record<string, unknown>)?.id as string;

    log('INFO', 'webhook.received', { eventType, action, dataId });

    // Solo procesamos eventos de pago
    if (eventType !== 'payment') {
      return { success: true, eventType: `${eventType}.${action}` };
    }

    try {
      // Obtener detalles del pago desde la API de MP
      const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN;
      if (!accessToken) throw new Error('MERCADOPAGO_ACCESS_TOKEN no configurado');

      const paymentResponse = await fetch(`https://api.mercadopago.com/v1/payments/${dataId}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      if (!paymentResponse.ok) {
        throw new Error(`Error al obtener pago: ${paymentResponse.status}`);
      }

      const payment = await paymentResponse.json();
      const email = payment.payer?.email;
      const status = payment.status; // approved, pending, rejected, etc.
      const paymentId = payment.id?.toString();

      if (!email) {
        log('WARN', 'webhook.no_email', { paymentId });
        return { success: true, eventType: 'payment.no_email' };
      }

      const supabase = getSupabaseAdmin();

      if (status === 'approved') {
        // Idempotencia: upsert por email, no insert
        const { error: dbError } = await supabase.from('users').upsert(
          {
            email,
            billing_customer_id: `mp_${payment.payer?.id || paymentId}`,
            billing_subscription_id: `mp_payment_${paymentId}`,
            role: 'ENTERPRISE',
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'email' }
        );

        if (dbError) {
          log('ERROR', 'webhook.db_upsert_failed', { code: dbError.code, email: email.substring(0, 3) + '***' });
          return { success: false, error: 'Error DB' };
        }

        log('INFO', 'payment.approved', { paymentId, email: email.substring(0, 3) + '***' });
      }

      if (status === 'refunded' || status === 'cancelled' || status === 'rejected') {
        const { error: dbError } = await supabase.from('users')
          .update({ role: 'FREE', billing_subscription_id: null, updated_at: new Date().toISOString() })
          .eq('email', email);

        if (dbError) log('ERROR', 'webhook.cancel_db_failed', { code: dbError.code });
        else log('INFO', 'payment.revoked', { paymentId, status });
      }

      return { success: true, eventType: `payment.${status}` };

    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : 'Unknown';
      log('ERROR', 'webhook.handler_exception', { message: msg });
      return { success: false, error: msg };
    }
  }
}
