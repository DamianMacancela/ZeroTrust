'use server';
import { headers } from 'next/headers';
import { createHash } from 'crypto';
import { getSupabaseAdmin } from '@/lib/supabase-admin';

/**
 * Ensures the free_trials table exists in Supabase.
 * Auto-creates it on first run so no manual SQL step is needed.
 */
async function ensureTable(supabase: ReturnType<typeof getSupabaseAdmin>) {
  // Try a lightweight probe first
  const { error } = await supabase
    .from('free_trials')
    .select('id')
    .limit(1);

  if (error && error.message.includes('relation') && error.message.includes('does not exist')) {
    // Table missing — create it via raw SQL through Supabase's rpc or direct query
    const { error: createError } = await supabase.rpc('exec_sql', {
      query: `
        CREATE TABLE IF NOT EXISTS public.free_trials (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          ip_hash TEXT NOT NULL UNIQUE,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()) NOT NULL
        );
        CREATE INDEX IF NOT EXISTS free_trials_ip_hash_idx ON public.free_trials (ip_hash);
        ALTER TABLE public.free_trials ENABLE ROW LEVEL SECURITY;
        CREATE POLICY IF NOT EXISTS "Service Role Full Access" ON public.free_trials
          FOR ALL TO service_role USING (true) WITH CHECK (true);
      `,
    });

    if (createError) {
      console.error('[trial-manager] Could not auto-create table via rpc:', createError.message);
      // If rpc doesn't exist, the user must create the table manually.
      // But we'll fail gracefully below.
      throw new Error(
        'La tabla free_trials no existe en Supabase. ' +
        'Por favor, ejecute el SQL de migracion en el SQL Editor de Supabase. ' +
        'Consulte el archivo supabase/migrations/20260718000000_create_free_trials.sql'
      );
    }
    console.log('[trial-manager] Table free_trials auto-created successfully.');
  }
}

export async function verifyAndConsumeTrial(): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    const supabase = getSupabaseAdmin();
    const headersList = await headers();

    // Ensure table exists on first call
    await ensureTable(supabase);

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

    if (selectError && selectError.code !== 'PGRST116') { // PGRST116 = no rows returned
      console.error('[trial-manager] DB Select Error:', selectError.message);
      return { success: false, error: `Error de base de datos: ${selectError.message}` };
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
      return { success: false, error: `Error al registrar prueba: ${insertError.message}` };
    }

    console.log(`[INFO] Prueba gratuita APROBADA y consumida para IP Hash: ${ipHash}`);
    return { success: true };

  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'unknown';
    console.error('[trial-manager] Excepcion:', errorMsg);
    return {
      success: false,
      error: errorMsg,
    };
  }
}