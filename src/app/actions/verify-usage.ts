'use server';
import { cookies } from 'next/headers';
import { createHmac, timingSafeEqual } from 'crypto';

const SECRET = process.env.USAGE_HMAC_SECRET ?? 'dev-secret';
const FREE_LIMIT = 1;
const COOKIE_NAME = 'ztr_usage';

function sign(count: number, fp: string): string {
  return createHmac('sha256', SECRET).update(`${count}:${fp}`).digest('hex');
}

function verifySig(sig: string, expected: string): boolean {
  try {
    const a = Buffer.from(sig, 'utf8');
    const b = Buffer.from(expected, 'utf8');
    return a.length === b.length && timingSafeEqual(a, b);
  } catch { return false; }
}

async function decode(raw: string, fp: string): Promise<{ count: number; valid: boolean }> {
  try {
    const { count, sig } = JSON.parse(Buffer.from(raw, 'base64').toString('utf8'));
    return { count: Number(count), valid: verifySig(sig, sign(count, fp)) };
  } catch { return { count: FREE_LIMIT, valid: false }; }
}

export async function getUsage(fp: string): Promise<{ count: number; blocked: boolean }> {
  const store = await cookies();
  const raw = store.get(COOKIE_NAME)?.value;
  if (!raw) return { count: 0, blocked: false };
  const { count, valid } = await decode(raw, fp);
  if (!valid) console.error(JSON.stringify({ event: 'security.usage.tampered', ts: new Date().toISOString() }));
  return { count, blocked: count >= FREE_LIMIT };
}

export async function incrementUsage(fp: string): Promise<void> {
  const store = await cookies();
  const raw = store.get(COOKIE_NAME)?.value;
  let current = 0;
  if (raw) {
    const { count, valid } = await decode(raw, fp);
    current = valid ? count : FREE_LIMIT;
  }
  const next = current + 1;
  const payload = Buffer.from(JSON.stringify({ count: next, sig: sign(next, fp) })).toString('base64');
  store.set(COOKIE_NAME, payload, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 30,
    path: '/',
  });
}
