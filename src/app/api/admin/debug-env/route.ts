import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

// Protected debug endpoint — requires admin token
export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization');
  const expectedToken = process.env.AUDIT_INTERNAL_SECRET;

  if (!expectedToken || authHeader !== `Bearer ${expectedToken}`) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  return NextResponse.json({
    stripe_configured: !!process.env.STRIPE_SECRET_KEY,
    stripe_price_configured: !!process.env.STRIPE_PRICE_ID_PRO,
    supabase_url_configured: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
    audit_salt_configured: !!process.env.NEXT_PUBLIC_AUDIT_SALT,
    app_url: process.env.NEXT_PUBLIC_APP_URL || 'not set',
  });
}
