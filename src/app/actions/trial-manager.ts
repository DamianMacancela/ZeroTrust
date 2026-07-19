'use server';
import { headers } from 'next/headers';
import { createHash } from 'crypto';

// ── In-memory trial store (per-instance, resets on redeploy) ──
// For production scale: migrate to Vercel KV or Upstash Redis
const usedTrials = new Set<string>();

export async function verifyAndConsumeTrial(): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    const headersList = await headers();

    const rawIp =
      headersList.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      headersList.get('x-real-ip')?.trim() ||
      headersList.get('cf-connecting-ip')?.trim() ||
      '127.0.0.1';

    const salt =
      process.env.NEXT_PUBLIC_AUDIT_SALT ||
      'zerotrust_fallback_salt_2026';

    const ipHash = createHash('sha256')
      .update(rawIp + ':' + salt)
      .digest('hex');

    // Check if this IP already used the free trial
    if (usedTrials.has(ipHash)) {
      console.log(`[INFO] Prueba gratuita DENEGADA para IP Hash: ${ipHash.substring(0, 12)}... (Ya utilizada)`);
      return {
        success: false,
        error: 'Limite de prueba gratuita alcanzado. Para continuar procesando documentos de forma ilimitada y segura, adquiera una Licencia Enterprise.',
      };
    }

    // Consume the trial
    usedTrials.add(ipHash);
    console.log(`[INFO] Prueba gratuita APROBADA para IP Hash: ${ipHash.substring(0, 12)}... (Total: ${usedTrials.size})`);
    return { success: true };

  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'unknown';
    console.error('[trial-manager] Excepcion:', errorMsg);
    return {
      success: false,
      error: 'Error temporal. Intente nuevamente.',
    };
  }
}