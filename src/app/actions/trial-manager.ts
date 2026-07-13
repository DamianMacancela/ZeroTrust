'use server';
import { headers } from 'next/headers';
import { createHash } from 'crypto';
import { getSupabaseAdmin } from '@/lib/supabase-admin';

export async function verifyAndConsumeTrial(): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    // const supabase = getSupabaseAdmin();
    const headersList = await headers();

    const rawIp =
      headersList.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      headersList.get('x-real-ip')?.trim() ||
      headersList.get('cf-connecting-ip')?.trim() ||
      '127.0.0.1';

    const salt =
      process.env.NEXT_PUBLIC_AUDIT_SALT ||
      'zerotrust_fallback_salt_2026_do_not_use_in_prod';

    const ipHash = createHash('sha256')
      .update(rawIp + ':' + salt)
      .digest('hex');

    // BYPASS TEMPORAL PARA TESTING: Siempre retorna success
    console.log(`[INFO] Bypass de Prueba gratuita concedida para IP Hash: ${ipHash}`);

    return { success: true };

  } catch (error) {
    console.error(
      '[trial-manager] Excepcion:',
      error instanceof Error ? error.message : 'unknown'
    );
    return {
      success: false,
      error: 'Error de validacion. El motor ha abortado por seguridad.',
    };
  }
}