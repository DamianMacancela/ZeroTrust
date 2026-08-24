import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createHmac } from 'crypto';

export const runtime = 'nodejs';

const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID || process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
const PAYPAL_SECRET = process.env.PAYPAL_SECRET;
const SECRET = process.env.USAGE_HMAC_SECRET || 'ZTR_ENTERPRISE_SECRET_KEY_2026';
const PAYPAL_API_BASE = process.env.NODE_ENV === 'production' 
  ? 'https://api-m.paypal.com' 
  : 'https://api-m.sandbox.paypal.com';

export async function POST(req: NextRequest) {
  try {
    const { orderID } = await req.json();

    if (!orderID) {
      return NextResponse.json({ error: 'Falta el ID de orden de PayPal' }, { status: 400 });
    }

    if (!PAYPAL_CLIENT_ID || !PAYPAL_SECRET) {
      console.error("[PAYPAL_ORDER] Credenciales no configuradas");
      return NextResponse.json({ error: 'Pasarela de pago no configurada' }, { status: 500 });
    }

    // 1. Obtener Access Token de PayPal
    const auth = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_SECRET}`).toString('base64');
    const tokenResponse = await fetch(`${PAYPAL_API_BASE}/v1/oauth2/token`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: 'grant_type=client_credentials',
    });

    if (!tokenResponse.ok) {
      console.error("[PAYPAL_ORDER] Error obteniendo token", await tokenResponse.text());
      return NextResponse.json({ error: 'Fallo al autenticar con PayPal' }, { status: 502 });
    }

    const { access_token } = await tokenResponse.json();

    // 2. Consultar el estado de la orden directamente en PayPal
    const orderResponse = await fetch(`${PAYPAL_API_BASE}/v2/checkout/orders/${orderID}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${access_token}`,
        'Content-Type': 'application/json',
      }
    });

    if (!orderResponse.ok) {
      console.error("[PAYPAL_ORDER] Error verificando orden", await orderResponse.text());
      return NextResponse.json({ error: 'Fallo al verificar la orden con PayPal' }, { status: 502 });
    }

    const orderData = await orderResponse.json();

    // 3. Verificar que el estado sea COMPLETED o APPROVED
    if (orderData.status === 'COMPLETED' || orderData.status === 'APPROVED') {
      // 4. Emitir Cookie Enterprise con firma criptográfica HMAC
      const sig = createHmac('sha256', SECRET).update('enterprise_active').digest('hex');
      const payload = Buffer.from(JSON.stringify({ 
        status: 'active', 
        sig, 
        orderId: orderID,
        plan: orderData.purchase_units?.[0]?.amount?.value === '215.90' ? 'ANNUAL' : 'MONTHLY',
        amount: orderData.purchase_units?.[0]?.amount?.value
      })).toString('base64');

      const cookieStore = await cookies();
      cookieStore.set('grc_enterprise_token', payload, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24 * 365, // 1 año de acceso
        path: '/',
      });

      return NextResponse.json({ 
        success: true, 
        message: 'Pago verificado exitosamente. Acceso Enterprise activado.',
        orderId: orderID
      });
    } else {
      return NextResponse.json({ 
        error: `La orden no está completada. Estado actual: ${orderData.status}` 
      }, { status: 403 });
    }

  } catch (error) {
    console.error("[PAYPAL_ORDER_ERROR]:", error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
