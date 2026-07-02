// app/api/webhooks/stripe/route.ts
// âš ï¸ PROD | Next.js 14 App Router | Stripe SDK 14+ | TypeScript 5+

import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import Stripe from 'stripe';

// --- Allowlist explÃ­cita: solo eventos que este handler conoce y procesa ---
const HANDLED_EVENTS = new Set<Stripe.Event.Type>([
  'checkout.session.completed',
  'customer.subscription.deleted',
  'invoice.payment_failed',
]);

// --- Structured logger: NUNCA loguear PII directamente ---
function auditLog(level: 'INFO' | 'WARN' | 'ERROR', event: string, meta: Record<string, unknown>) {
  // Reemplazar con tu logger de producciÃ³n (Datadog, Pino, Winston)
  // Meta debe contener solo IDs, nunca email/nombre en plaintext
  console[level === 'ERROR' ? 'error' : 'log'](
    JSON.stringify({ timestamp: new Date().toISOString(), level, event, ...meta })
  );
}

// --- Timeout wrapper para operaciones DB async (Supabase Fase 4) ---
function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return Promise.race([
    promise,
    new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error(`Operation timed out after ${ms}ms`)), ms)
    ),
  ]);
}

// --- ValidaciÃ³n de variables de entorno al arranque, no en runtime ---
const WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET;
if (!WEBHOOK_SECRET) {
  throw new Error('[FATAL] STRIPE_WEBHOOK_SECRET no configurado â€” detener deploy');
}

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get('stripe-signature');

  // --- Guard: firma obligatoria ---
  if (!sig) {
    auditLog('WARN', 'webhook.rejected', { reason: 'missing_signature', ip: req.headers.get('x-forwarded-for') });
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let event: Stripe.Event;

  try {
    // VerificaciÃ³n criptogrÃ¡fica HMAC-SHA256 â€” Ãºnico punto de confianza
    event = stripe.webhooks.constructEvent(body, sig, WEBHOOK_SECRET!);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    auditLog('ERROR', 'webhook.signature_invalid', { message });
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  // --- Allowlist: rechazar eventos no manejados explÃ­citamente ---
  if (!HANDLED_EVENTS.has(event.type)) {
    auditLog('INFO', 'webhook.unhandled_event', { eventType: event.type, eventId: event.id });
    return NextResponse.json({ received: true, handled: false });
  }

  try {
    await withTimeout(handleEvent(event), 8000); // 8s max â€” ajustar segÃºn SLA
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    auditLog('ERROR', 'webhook.handler_failed', { eventType: event.type, eventId: event.id, message });
    // Retornar 500 hace que Stripe reintente â€” Ãºtil para errores transitorios de DB
    return NextResponse.json({ error: 'Internal processing error' }, { status: 500 });
  }

  return NextResponse.json({ received: true, handled: true });
}

// --- Handler segregado por event type ---
async function handleEvent(event: Stripe.Event): Promise<void> {
  switch (event.type) {

    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session;

      // ValidaciÃ³n estricta de campos crÃ­ticos antes de cualquier operaciÃ³n
      const customerId = session.customer as string | null;
      const subscriptionId = session.subscription as string | null;
      const email = session.customer_details?.email ?? null;

      if (!customerId || !subscriptionId) {
        // Loguear IDs, NUNCA el email en claro
        auditLog('ERROR', 'checkout.missing_critical_fields', {
          eventId: event.id,
          hasCustomerId: !!customerId,
          hasSubscriptionId: !!subscriptionId,
        });
        throw new Error('Missing critical fields in checkout.session.completed');
      }

      auditLog('INFO', 'checkout.session.completed', {
        eventId: event.id,          // Para idempotencia y deduplicaciÃ³n
        customerId,                  // ID Stripe â€” no PII
        subscriptionId,              // Necesario para lifecycle (cancelaciÃ³n, upgrade)
        emailDomain: email?.split('@')[1] ?? 'unknown', // Solo dominio â€” no PII completa
      });

      // TODO Fase 4: upsert idempotente en Supabase
      // await supabase
      //   .from('subscriptions')
      //   .upsert({
      //     stripe_event_id: event.id,        // PRIMARY KEY para idempotencia
      //     stripe_customer_id: customerId,
      //     stripe_subscription_id: subscriptionId,
      //     status: 'active',
      //     updated_at: new Date().toISOString(),
      //   }, { onConflict: 'stripe_event_id' }); // Evita doble-activaciÃ³n
      break;
    }

    case 'customer.subscription.deleted': {
      const subscription = event.data.object as Stripe.Subscription;
      auditLog('INFO', 'subscription.cancelled', {
        eventId: event.id,
        subscriptionId: subscription.id,
        customerId: subscription.customer as string,
      });
      // TODO Fase 4: revocar acceso en Supabase
      break;
    }

    case 'invoice.payment_failed': {
      const invoice = event.data.object as Stripe.Invoice;
      auditLog('WARN', 'invoice.payment_failed', {
        eventId: event.id,
        customerId: invoice.customer as string,
        attemptCount: invoice.attempt_count,
      });
      // TODO Fase 4: notificar y aplicar grace period
      break;
    }
  }
}
