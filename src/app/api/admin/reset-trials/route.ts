import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase-admin';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    // Proteger con secret interno — solo admin con el token puede ejecutar
    const authHeader = req.headers.get('authorization');
    const expectedToken = process.env.AUDIT_INTERNAL_SECRET;

    if (!expectedToken || authHeader !== `Bearer ${expectedToken}`) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    const supabase = getSupabaseAdmin();

    // Borrar todos los registros de free_trials
    const { error, count } = await supabase
      .from('free_trials')
      .delete()
      .neq('ip_hash', '___impossible_value___');

    if (error) {
      console.error('[ADMIN_RESET] DB error:', error.code, error.message);
      return NextResponse.json(
        { error: 'Error de base de datos: ' + error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Todas las pruebas gratuitas han sido restablecidas.',
      deletedCount: count,
    });

  } catch (error) {
    console.error(
      '[ADMIN_RESET] Exception:',
      error instanceof Error ? error.message : 'unknown'
    );
    return NextResponse.json(
      { error: 'Error interno' },
      { status: 500 }
    );
  }
}
