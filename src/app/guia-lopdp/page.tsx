"use client";

import { useState } from 'react';
import Link from 'next/link';
import { ShieldCheck, Download, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function LeadMagnetPage() {
  const [email, setEmail] = useState('');
  const [consent, setConsent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!consent) {
      setError("Debes aceptar la política de privacidad para recibir la guía.");
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, consent_given: consent })
      });
      
      if (!res.ok) {
        throw new Error("Error al registrar el correo. Intenta de nuevo.");
      }
      
      setSuccess(true);
      // Aquí el usuario podría ser redirigido directamente al PDF
      // window.location.href = "/guia-lopdp.pdf";
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full space-y-8">
        
        <div className="text-center">
          <Link href="/" className="inline-flex items-center justify-center gap-3 mb-8">
            <div className="bg-slate-950 p-2.5 rounded-lg shadow-sm border border-slate-800">
              <ShieldCheck className="h-6 w-6 text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight text-slate-900">ZeroTrust</span>
          </Link>
          <h1 className="text-4xl font-black tracking-tight text-slate-900 sm:text-5xl mb-4">
            Checklist Definitiva: LOPDP para Empresas
          </h1>
          <p className="text-xl text-slate-600 font-medium">
            Descubre los 5 errores comunes al censurar documentos que están causando multas millonarias en Ecuador.
          </p>
        </div>

        <div className="bg-white py-8 px-4 shadow sm:rounded-2xl sm:px-10 border border-slate-200">
          {!success ? (
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="email" className="block text-sm font-bold text-slate-700">
                  Correo Electrónico Corporativo
                </label>
                <div className="mt-2">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full rounded-lg border-0 py-3 px-4 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                    placeholder="gerencia@empresa.com.ec"
                  />
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex h-6 items-center">
                  <input
                    id="consent"
                    name="consent"
                    type="checkbox"
                    required
                    checked={consent}
                    onChange={(e) => setConsent(e.target.checked)}
                    className="h-5 w-5 rounded border-slate-300 text-blue-600 focus:ring-blue-600"
                  />
                </div>
                <div className="ml-3 text-sm leading-6">
                  <label htmlFor="consent" className="font-medium text-slate-700">
                    Consentimiento Legal (LOPDP) <span className="text-red-500">*</span>
                  </label>
                  <p className="text-slate-500 text-xs mt-1">
                    Al marcar esta casilla, acepto la <Link href="/privacy" className="text-blue-600 hover:underline">Política de Privacidad</Link> y otorgo mi consentimiento expreso (Art. 7 LOPDP) para que ZeroTrust Tech me envíe la guía y comunicaciones comerciales sobre ciberseguridad. Mi IP será registrada como prueba de consentimiento.
                  </p>
                </div>
              </div>

              {error && (
                <div className="rounded-lg bg-red-50 p-4 border border-red-200">
                  <div className="flex items-center gap-3">
                    <AlertCircle className="h-5 w-5 text-red-600" />
                    <p className="text-sm font-medium text-red-800">{error}</p>
                  </div>
                </div>
              )}

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex w-full justify-center items-center gap-2 rounded-xl bg-blue-600 px-3 py-4 text-sm font-bold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:opacity-50 transition-colors"
                >
                  {loading ? 'Procesando...' : (
                    <>
                      <Download className="w-5 h-5" />
                      Descargar Guía Gratuita
                    </>
                  )}
                </button>
              </div>
            </form>
          ) : (
            <div className="text-center py-8">
              <CheckCircle2 className="mx-auto h-16 w-16 text-emerald-500 mb-6" />
              <h3 className="text-2xl font-black text-slate-900 mb-2">¡Todo Listo!</h3>
              <p className="text-slate-600 mb-8">
                Hemos validado tu consentimiento. Revisa tu correo electrónico, la guía va en camino.
              </p>
              <Link href="/" className="font-bold text-blue-600 hover:text-blue-500">
                Volver al inicio
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
