'use server';
import { headers } from 'next/headers';
import { createHash } from 'crypto';
import { getSupabaseAdmin } from '@/lib/supabase-admin';

export async function verifyAndConsumeTrial(): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    const supabase = getSupabaseAdmin();
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

    // 1. Verificar si ya existe este IP hash en la base de datos
    const { data: existingTrial, error: selectError } = await supabase
      .from('free_trials')
      .select('id')
      .eq('ip_hash', ipHash)
      .single();

    if (selectError && selectError.code !== 'PGRST116') { // PGRST116 es "no rows returned"
      console.error('[trial-manager] DB Select Error:', selectError.message);
      return { success: false, error: 'Error interno del servidor al validar su prueba.' };
    }

    if (existingTrial) {
      console.log(`[INFO] Prueba gratuita DENEGADA para IP Hash: ${ipHash} (Ya utilizada)`);
      return { 
        success: false, 
        error: 'Limite de prueba gratuita alcanzado. Para continuar procesando documentos de forma ilimitada y segura, adquiera una Licencia Enterprise.' 
      };
    }

    // 2. Si no existe, insertar el registro consumiendo la prueba
    const { error: insertError } = await supabase
      .from('free_trials')
      .insert([{ ip_hash: ipHash }]);

    if (insertError) {
      console.error('[trial-manager] DB Insert Error:', insertError.message);
      return { success: false, error: 'Error al procesar su solicitud de prueba.' };
    }

    console.log(`[INFO] Prueba gratuita APROBADA y consumida para IP Hash: ${ipHash}`);
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