import { NextRequest, NextResponse } from 'next/server';
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: 'Invalid' }, { status: 400 });
  console.log(JSON.stringify({ ...body, ts: new Date().toISOString() }));
  return NextResponse.json({ ok: true });
}
export async function GET() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
}
