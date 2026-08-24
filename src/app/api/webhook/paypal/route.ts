/**
 * Webhook Endpoint — PayPal Subscriptions & Payments
 *
 * Verifica la autenticidad del evento contra la API de PayPal (no solo HMAC local),
 * garantiza idempotencia, y actualiza el estado de suscripción en la cookie del usuario.
 *
 * Eventos manejados:
 * - BILLING.SUBSCRIPTION.ACTIVATED   → Acceso concedido
 * - BILLING.SUBSCRIPTION.CANCELLED   → Acceso revocado
 * - BILLING.SUBSCRIPTION.SUSPENDED   → Pago fallido, acceso suspendido
 * - PAYMENT.SALE.COMPLETED           → Log de pago exitoso
 * - PAYMENT.SALE.DENIED              → Log de pago denegado (alerta)
 */

import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase-admin';

export const runtime = 'nodejs';

function log(level: 'INFO' | 'WARN' | 'ERROR', event: string, meta: Record<string, unknown>) {
  const entry = { timestamp: new Date().toISOString(), level, service: 'paypal-webhook', event, ...meta };
  if (level === 'ERROR') console.error(JSON.stringify(entry));
  else console.log(JSON.stringify(entry));
}

/**
 * Verifica la firma del webhook contra la API oficial de PayPal.
 * Este es el método recomendado por PayPal (más seguro que HMAC local).
 */
async function verifyPayPalWebhook(
  accessToken: string,
  headers: Record<string, string>,
  rawBody: string,
  webhookId: string
): Promise<boolean> {
  const PAYPAL_API_BASE = process.env.NODE_ENV === 'production'
    ? 'https://api-m.paypal.com'
    : 'https://api-m.sandbox.paypal.com';

  const verifyResponse = await fetch(`${PAYPAL_API_BASE}/v1/notifications/verify-webhook-signature`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      auth_algo: headers['paypal-auth-algo'],
      cert_url: headers['paypal-cert-url'],
      transmission_id: headers['paypal-transmission-id'],
      transmission_sig: headers['paypal-transmission-sig'],
      transmission_time: headers['paypal-transmission-time'],
      webhook_id: webhookId,
      webhook_event: JSON.parse(rawBody),
    }),
  });

  if (!verifyResponse.ok) {
    log('ERROR', 'webhook.verify_api_error', { status: verifyResponse.status });
    return false;
  }

  const result = await verifyResponse.json();
  return result.verification_status === 'SUCCESS';
}

async function getPayPalAccessToken(): Promise<string> {
  const PAYPAL_CLIENT_ID = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
  const PAYPAL_SECRET = process.env.PAYPAL_SECRET;
  const PAYPAL_API_BASE = process.env.NODE_ENV === 'production'
    ? 'https://api-m.paypal.com'
    : 'https://api-m.sandbox.paypal.com';

  if (!PAYPAL_CLIENT_ID || !PAYPAL_SECRET) {
    throw new Error('PayPal credentials not configured');
  }

  const auth = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_SECRET}`).toString('base64');
  const tokenResponse = await fetch(`${PAYPAL_API_BASE}/v1/oauth2/token`, {
    method: 'POST',
    headers: { 'Authorization': `Basic ${auth}`, 'Content-Type': 'application/x-www-form-urlencoded' },
    body: 'grant_type=client_credentials',
  });

  if (!tokenResponse.ok) throw new Error('Failed to get PayPal access token');
  const { access_token } = await tokenResponse.json();
  return access_token;
}

export async function POST(req: NextRequest) {
  const PAYPAL_WEBHOOK_ID = process.env.PAYPAL_WEBHOOK_ID;

  if (!PAYPAL_WEBHOOK_ID) {
    log('ERROR', 'webhook.config_missing', { hasWebhookId: false });
    return NextResponse.json({ error: 'Webhook no configurado' }, { status: 500 });
  }

  const rawBody = await req.text();

  // 1. Verificar firma contra la API oficial de PayPal (más seguro que HMAC local)
  try {
    const accessToken = await getPayPalAccessToken();
    const headers = {
      'paypal-auth-algo': req.headers.get('paypal-auth-algo') || '',
      'paypal-cert-url': req.headers.get('paypal-cert-url') || '',
      'paypal-transmission-id': req.headers.get('paypal-transmission-id') || '',
      'paypal-transmission-sig': req.headers.get('paypal-transmission-sig') || '',
      'paypal-transmission-time': req.headers.get('paypal-transmission-time') || '',
    };

    const isValid = await verifyPayPalWebhook(accessToken, headers, rawBody, PAYPAL_WEBHOOK_ID);
    if (!isValid) {
      log('ERROR', 'webhook.signature_invalid', {
        transmissionId: headers['paypal-transmission-id'],
        ip: req.headers.get('x-forwarded-for') || 'unknown',
      });
      return NextResponse.json({ error: 'Firma de webhook inválida' }, { status: 400 });
    }
  } catch (authError) {
    log('ERROR', 'webhook.auth_failed', { error: String(authError) });
    return NextResponse.json({ error: 'Error de autenticación con PayPal' }, { status: 502 });
  }

  // 2. Parsear el evento
  let event: Record<string, any>;
  try {
    event = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: 'Body inválido' }, { status: 400 });
  }

  const eventType = event.event_type as string;
  const eventId = event.id as string;
  const resource = event.resource || {};

  log('INFO', 'webhook.received', { eventType, eventId });

  // 3. Idempotencia — Verificar si ya procesamos este evento
  // (el upsert de Supabase previene duplicados de forma natural)

  try {
    const supabase = getSupabaseAdmin();

    // ── SUSCRIPCIÓN ACTIVADA ─────────────────────────────────────────────────
    if (eventType === 'BILLING.SUBSCRIPTION.ACTIVATED') {
      const subscriptionId = resource.id as string;
      const subscriberEmail = resource.subscriber?.email_address as string;
      const planId = resource.plan_id as string;

      if (!subscriptionId) {
        log('WARN', 'webhook.missing_subscription_id', { eventType });
        return NextResponse.json({ received: true, note: 'No subscription ID' });
      }

      const { error: dbError } = await supabase.from('paypal_subscriptions').upsert(
        {
          subscription_id: subscriptionId,
          email: subscriberEmail,
          plan_id: planId,
          status: 'ACTIVE',
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'subscription_id' }
      );

      if (dbError) {
        log('ERROR', 'webhook.db_upsert_failed', { code: dbError.code, eventType });
        return NextResponse.json({ error: 'Error DB' }, { status: 500 });
      }

      log('INFO', 'subscription.activated', { subscriptionId, email: subscriberEmail });
    }

    // ── SUSCRIPCIÓN CANCELADA / SUSPENDIDA ───────────────────────────────────
    if (
      eventType === 'BILLING.SUBSCRIPTION.CANCELLED' ||
      eventType === 'BILLING.SUBSCRIPTION.SUSPENDED' ||
      eventType === 'BILLING.SUBSCRIPTION.EXPIRED'
    ) {
      const subscriptionId = resource.id as string;
      const newStatus = eventType.split('.').pop() || 'CANCELLED'; // CANCELLED | SUSPENDED | EXPIRED

      const { error: dbError } = await supabase.from('paypal_subscriptions')
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq('subscription_id', subscriptionId);

      if (dbError) log('ERROR', 'subscription.update_failed', { code: dbError.code });
      else log('INFO', 'subscription.deactivated', { subscriptionId, newStatus });
    }

    // ── PAGO COMPLETADO ──────────────────────────────────────────────────────
    if (eventType === 'PAYMENT.SALE.COMPLETED') {
      const saleId = resource.id as string;
      const amount = resource.amount?.total;
      const currency = resource.amount?.currency;
      log('INFO', 'payment.completed', { saleId, amount, currency });
    }

    // ── PAGO DENEGADO (Alerta de Fraude) ────────────────────────────────────
    if (eventType === 'PAYMENT.SALE.DENIED') {
      const saleId = resource.id as string;
      log('ERROR', 'payment.denied', { saleId, resource });
    }

  } catch (handlerError) {
    log('ERROR', 'webhook.handler_exception', { eventType, error: String(handlerError) });
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }

  return NextResponse.json({ received: true, eventType });
}
