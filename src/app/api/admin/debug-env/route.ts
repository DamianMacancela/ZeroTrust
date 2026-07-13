import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function GET() {
  return NextResponse.json({
    url: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
    url_val: process.env.NEXT_PUBLIC_SUPABASE_URL?.substring(0, 10),
    key: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
    key_val_len: process.env.SUPABASE_SERVICE_ROLE_KEY?.length || 0,
    anon: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  });
}
