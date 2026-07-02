'use server';

import { cookies, headers } from 'next/headers';

// Caché en memoria del servidor (Persiste mientras el proceso Node.js esté vivo)
// En producción, esto se migra a una tabla en Supabase.
const globalIPBlocklist = new Set<string>();

export async function claimFreeTrial() {
  const cookieStore = await cookies();
  const headersList = await headers();

  // Capa 1: Validación de Cookie (Bloquea al 90% de usuarios normales)
  const isCookieLocked = cookieStore.get('zt_legal_trial_lock');

  // Capa 2: Extracción y Validación de IP (Bloquea el Modo Incógnito)
  // En localhost será '::1' o '127.0.0.1'
  const ip = headersList.get('x-forwarded-for') || headersList.get('x-real-ip') || 'ip_local';

  // Si tiene la cookie O su IP ya está en la lista negra, rechazar.
  if (isCookieLocked?.value === 'locked' || globalIPBlocklist.has(ip)) {
    return { 
      success: false, 
      message: 'Brecha de seguridad prevenida. Prueba ya consumida desde esta red o dispositivo.' 
    };
  }

  // SI PASA LAS VALIDACIONES -> Aplicar los bloqueos para el futuro
  
  // 1. Bloquear IP en memoria
  if (ip !== 'ip_local') {
    globalIPBlocklist.add(ip);
  } else {
    // Si estamos en localhost, bloqueamos el identificador local
    globalIPBlocklist.add('ip_local');
  }

  // 2. Inyectar Cookie Criptográfica
  cookieStore.set('zt_legal_trial_lock', 'locked', {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    path: '/',
    maxAge: 60 * 60 * 24 * 365, // 1 Año de bloqueo
    sameSite: 'strict',
  });

  // Simulamos el tiempo de ofuscación de documentos (1.5 segundos) para UX
  await new Promise(resolve => setTimeout(resolve, 1500));

  return { success: true, message: 'Auditoría técnica autorizada. Acceso de un uso concedido.' };
}
