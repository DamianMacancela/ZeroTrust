'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShieldCheck, X } from 'lucide-react';

export function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only show if not previously accepted
    if (!localStorage.getItem('grc_cookie_consent')) {
      setIsVisible(true);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem('grc_cookie_consent', 'true');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 left-4 z-50 p-0 pointer-events-none max-w-sm">
      <div className="bg-slate-900 border border-slate-800 shadow-2xl rounded-2xl p-6 pointer-events-auto flex flex-col gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <ShieldCheck className="h-5 w-5 text-blue-500" />
            <h3 className="text-white font-bold text-sm tracking-tight">Privacidad y Cookies (GDPR)</h3>
          </div>
          <p className="text-slate-400 text-xs leading-relaxed">
            Utilizamos tecnologías de almacenamiento local estrictamente necesarias para el funcionamiento del Sandbox (prevención de abusos) y seguridad. No utilizamos cookies de terceros para seguimiento publicitario. Al continuar utilizando este sitio, aceptas nuestra{' '}
            <Link href="/privacy" className="text-blue-400 hover:text-blue-300 underline underline-offset-2">Política de Privacidad</Link> y{' '}
            <Link href="/cookies" className="text-blue-400 hover:text-blue-300 underline underline-offset-2">Política de Cookies</Link>.
          </p>
        </div>
        <div className="flex flex-col gap-2 w-full">
          <button 
            onClick={acceptCookies}
            className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl transition-colors shadow-[0_0_15px_rgba(37,99,235,0.3)]"
          >
            Aceptar Todas
          </button>
          <div className="flex gap-2 w-full">
            <button 
              onClick={() => { localStorage.setItem('grc_cookie_consent', 'rejected'); setIsVisible(false); }}
              className="w-1/2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl transition-colors border border-slate-700"
            >
              Rechazar
            </button>
            <button 
              onClick={() => alert("Panel de configuración de cookies en desarrollo.")}
              className="w-1/2 px-4 py-2 bg-transparent hover:bg-slate-800 text-slate-400 text-xs font-bold rounded-xl transition-colors"
            >
              Configurar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
