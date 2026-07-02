import { stripe } from '@/lib/stripe';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  // 1. Capturamos el cuerpo en texto plano (Requisito de Stripe)
  const body = await req.text();
  const headersList = await headers();
  const signature = headersList.get('stripe-signature');

  if (!signature) {
    return new NextResponse('Firma de Stripe no encontrada', { status: 400 });
  }

  let event;

  // 2. Validación Criptográfica 
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error: any) {
    console.error('🚨 [WEBHOOK_ERROR]:', error.message);
    return new NextResponse(`Error de validación: ${error.message}`, { status: 400 });
  }

  // 3. Procesamiento Seguro del Evento
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as any;
    
    console.log('\n===================================================');
    console.log('✅ [PAGO 100% CONFIRMADO CRIPTOGRÁFICAMENTE]');
    console.log(`👤 Cliente: ${session.customer_details?.email}`);
    console.log(`💳 Estado: ${session.payment_status}`);
    console.log('===================================================\n');
  }

  // 4. Acuse de recibo a Stripe (200 OK)
  return new NextResponse('Webhook procesado con éxito', { status: 200 });
}
