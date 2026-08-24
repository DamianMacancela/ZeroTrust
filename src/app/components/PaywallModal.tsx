'use client';
import { useTransition, useState } from 'react';
import { createCheckoutSession } from '@/app/actions/lemonsqueezy-checkout';
import { Zap, X, Fingerprint, Lock, AlertTriangle } from 'lucide-react';

interface Props { onClose: () => void; }

export default function PaywallModal({ onClose }: Props) {
  const [isPending, startTransition] = useTransition();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleUpgrade = () => {
    setErrorMsg(null);
    startTransition(async () => {
      try {
        const result = await createCheckoutSession();
        if (result?.error) {
          setErrorMsg(result.error);
        }
      } catch (e) {
        setErrorMsg("Error de conexión. Revisa la consola o tu .env.local.");
      }
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#020b14]/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-slate-200 zoom-in-95 animate-in duration-200">
        
        <div className="bg-[#020b14] p-6 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4">
            <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
          <Fingerprint className="w-12 h-12 text-[#00e5ff] mx-auto mb-3 opacity-90" />
          <h2 className="text-2xl font-bold text-white tracking-tight">
            Acceso <span className="text-[#00e5ff]">Enterprise</span>
          </h2>
        </div>
        
        <div className="p-8">
          <p className="text-slate-500 text-sm text-center mb-6">
            Has completado tu prueba Zero-Data. Desbloquea la potencia total del motor legal.
          </p>
          
          <ul className="space-y-4 mb-8 bg-slate-50 p-5 rounded-xl border border-slate-100">
            {['Ofuscación local ilimitada', 'Soporte prioritario LegalTech', 'Sin marca de agua en PDFs', 'Auditoría y logs locales'].map((feature, i) => (
              <li key={i} className="flex items-center gap-3 text-sm font-medium text-slate-700">
                <div className="bg-emerald-100 p-1.5 rounded-full text-emerald-600">
                  <Lock className="w-3 h-3" />
                </div>
                {feature}
              </li>
            ))}
          </ul>

          {errorMsg && (
            <div className="mb-4 flex items-center gap-2 text-red-600 text-xs bg-red-50 p-3 rounded-lg border border-red-100">
              <AlertTriangle className="w-4 h-4 shrink-0" /> {errorMsg}
            </div>
          )}

          <button
            onClick={handleUpgrade}
            disabled={isPending}
            className="w-full py-4 bg-[#00e5ff] text-[#020b14] font-bold rounded-xl hover:bg-cyan-400 transition-colors shadow-[0_0_20px_rgba(0,229,255,0.3)] disabled:opacity-60 disabled:shadow-none flex items-center justify-center gap-2"
          >
            {isPending ? (
              <div className="w-5 h-5 border-2 border-[#020b14] border-t-transparent rounded-full animate-spin" />
            ) : (
              <><Zap className="w-5 h-5" /> Iniciar Suscripción — $29.99/mes</>
            )}
          </button>
          
          <p className="text-center text-[10px] text-slate-400 uppercase tracking-widest mt-4 font-mono">
            Pagos encriptados · Cancela cuando quieras
          </p>
        </div>
      </div>
    </div>
  );
}
