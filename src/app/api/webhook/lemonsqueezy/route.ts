import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { getSupabaseAdmin } from '@/lib/supabase-admin';

export const runtime = 'nodejs';

function log(level: 'INFO' | 'WARN' | 'ERROR', event: string, meta: Record<string, unknown>) {
  const entry = { timestamp: new Date().toISOString(), level, event, ...meta };
  if (level === 'ERROR') { console.error(JSON.stringify(entry)); }
  else { console.log(JSON.stringify(entry)); }
}

export async function POST(req: NextRequest) {
  const WEBHOOK_SECRET = process.env.LEMONSQUEEZY_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    log('ERROR', 'webhook.config_missing', { hasWebhookSecret: !!WEBHOOK_SECRET });
    return NextResponse.json({ error: 'Configuracion del servidor incompleta' }, { status: 500 });
  }

  const rawBody = await req.text();
  const signature = req.headers.get('x-signature');

  if (!signature) {
    log('WARN', 'webhook.missing_signature', { ip: req.headers.get('x-forwarded-for') });
    return NextResponse.json({ error: 'Firma requerida' }, { status: 401 });
  }

  const hmac = crypto.createHmac('sha256', WEBHOOK_SECRET);
  const digest = Buffer.from(hmac.update(rawBody).digest('hex'), 'utf8');
  const signatureBuffer = Buffer.from(signature, 'utf8');

  if (digest.length !== signatureBuffer.length || !crypto.timingSafeEqual(digest, signatureBuffer)) {
    log('ERROR', 'webhook.signature_invalid', { expected: digest.toString(), received: signature });
    return NextResponse.json({ error: 'Firma invalida' }, { status: 400 });
  }

  let body;
  try {
    body = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: 'Body no valido' }, { status: 400 });
  }

  const eventName = body.meta.event_name;
  const customData = body.meta.custom_data || {};
  const obj = body.data;

  log('INFO', 'webhook.received', { eventType: eventName, eventId: body.meta.webhook_id });

  try {
    const supabase = getSupabaseAdmin();

    if (eventName === 'subscription_created' || eventName === 'subscription_updated') {
      const email = obj.attributes.user_email;
      const customerId = obj.attributes.customer_id.toString();
      const subscriptionId = obj.id;
      const status = obj.attributes.status;

      if (!email || !customerId || !subscriptionId) {
        log('ERROR', 'checkout.missing_critical_fields', { hasEmail: !!email, hasCustomerId: !!customerId });
        return NextResponse.json({ error: 'Datos incompletos' }, { status: 400 });
      }

      const role = (status === 'active' || status === 'past_due') ? 'ENTERPRISE' : 'FREE';

      const { error: dbError } = await supabase.from('users').upsert(
        { 
          email, 
          billing_customer_id: customerId, 
          billing_subscription_id: subscriptionId, 
          role, 
          updated_at: new Date().toISOString() 
        },
        { onConflict: 'email' }
      );

      if (dbError) {
        log('ERROR', 'checkout.db_upsert_failed', { code: dbError.code });
        return NextResponse.json({ error: 'Error DB' }, { status: 500 });
      }
      log('INFO', 'subscription.updated', { customerId, role });
    }

    if (eventName === 'subscription_expired' || eventName === 'subscription_cancelled') {
      const customerId = obj.attributes.customer_id.toString();

      const { error: dbError } = await supabase.from('users')
        .update({ role: 'FREE', billing_subscription_id: null, updated_at: new Date().toISOString() })
        .eq('billing_customer_id', customerId);

      if (dbError) { log('ERROR', 'subscription.cancel_db_failed', { code: dbError.code }); }
      else { log('INFO', 'subscription.cancelled', { customerId }); }
    }

  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Unknown';
    log('ERROR', 'webhook.handler_exception', { eventType: eventName, message: msg });
    return NextResponse.json({ error: 'Error interno al procesar evento' }, { status: 500 });
  }

  return NextResponse.json({ received: true, eventType: eventName });
}
