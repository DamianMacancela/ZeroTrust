"use client";

import { useState, useEffect } from 'react';
import { AlertOctagon, X, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export function ExitIntentModal() {
  const [isVisible, setIsVisible] = useState(false);
  const [hasTriggered, setHasTriggered] = useState(false);

  useEffect(() => {
    // Only run on desktop where mouse leaves the viewport
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && !hasTriggered) {
        setIsVisible(true);
        setHasTriggered(true);
        // Save in sessionStorage so we don't annoy them on every page load
        sessionStorage.setItem('exit_intent_shown', 'true');
      }
    };

    const alreadyShown = sessionStorage.getItem('exit_intent_shown');
    if (!alreadyShown) {
      document.addEventListener('mouseleave', handleMouseLeave);
    }

    return () => {
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [hasTriggered]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full relative overflow-hidden animate-in zoom-in-95 duration-300">
        <button 
          onClick={() => setIsVisible(false)}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 bg-slate-100 rounded-full p-1"
        >
          <X className="w-5 h-5" />
        </button>
        
        <div className="bg-red-600 p-8 text-center text-white">
          <AlertOctagon className="w-16 h-16 mx-auto mb-4 text-red-200" />
          <h2 className="text-3xl font-black mb-2">¡Espera un momento!</h2>
          <p className="text-red-100 text-lg">¿Vas a dejar tu empresa expuesta a la LOPDP?</p>
        </div>
        
        <div className="p-8 text-center">
          <p className="text-slate-600 mb-6 text-lg">
            No te vayas sin probar nuestra plataforma Zero-Data. Usa el código <span className="font-black text-slate-900 bg-slate-100 px-2 py-1 rounded">SEGURO2026</span> para obtener un <strong>10% de descuento adicional</strong> en tu licencia Enterprise hoy.
          </p>
          
          <div className="flex flex-col gap-3">
            <Link 
              href="/#pricing" 
              onClick={() => setIsVisible(false)}
              className="w-full inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 px-6 rounded-xl transition-colors text-lg"
            >
              Reclamar 10% de Descuento <ArrowRight className="w-5 h-5" />
            </Link>
            <button 
              onClick={() => setIsVisible(false)}
              className="text-slate-400 hover:text-slate-600 text-sm font-medium mt-2"
            >
              Prefiero arriesgarme a una multa
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
