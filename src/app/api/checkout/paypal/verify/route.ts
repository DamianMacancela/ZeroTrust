import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createHmac } from 'crypto';

const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID || process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
const PAYPAL_SECRET = process.env.PAYPAL_SECRET;
// The same secret used in the usage API
const SECRET = process.env.USAGE_HMAC_SECRET || 'ZTR_ENTERPRISE_SECRET_KEY_2026';
const PAYPAL_API_BASE = process.env.NODE_ENV === 'production' 
  ? 'https://api-m.paypal.com' 
  : 'https://api-m.sandbox.paypal.com';

export async function POST(req: NextRequest) {
  try {
    const { subscriptionID } = await req.json();

    if (!subscriptionID) {
      return NextResponse.json({ error: 'Missing subscription ID' }, { status: 400 });
    }

    if (!PAYPAL_CLIENT_ID || !PAYPAL_SECRET) {
      console.error("PayPal credentials not configured");
      return NextResponse.json({ error: 'Payment gateway unconfigured' }, { status: 500 });
    }

    // 1. Get PayPal Access Token
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
      console.error("PayPal Token Error", await tokenResponse.text());
      return NextResponse.json({ error: 'Authentication with payment gateway failed' }, { status: 502 });
    }

    const { access_token } = await tokenResponse.json();

    // 2. Fetch Subscription details
    const subResponse = await fetch(`${PAYPAL_API_BASE}/v1/billing/subscriptions/${subscriptionID}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${access_token}`,
        'Content-Type': 'application/json',
      }
    });

    if (!subResponse.ok) {
      console.error("PayPal Subscription fetch error", await subResponse.text());
      return NextResponse.json({ error: 'Failed to verify subscription' }, { status: 502 });
    }

    const subscriptionData = await subResponse.json();

    // 3. Verify status
    if (subscriptionData.status === 'ACTIVE') {
      // 4. Issue Secure Enterprise Cookie
      const sig = createHmac('sha256', SECRET).update('enterprise_active').digest('hex');
      const payload = Buffer.from(JSON.stringify({ status: 'active', sig, subId: subscriptionID })).toString('base64');

      const cookieStore = await cookies();
      cookieStore.set('grc_enterprise_token', payload, {
        httpOnly: true, // Invisible to F12 / JavaScript
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24 * 30, // 30 days
        path: '/',
      });

      return NextResponse.json({ success: true, message: 'Subscription verified. Enterprise access granted.' });
    } else {
      return NextResponse.json({ error: `Subscription is not active. Status: ${subscriptionData.status}` }, { status: 403 });
    }

  } catch (error) {
    console.error("PayPal verify route error:", error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
