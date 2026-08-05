"use client";

import { useState } from 'react';
import Link from 'next/link';
import { ShieldCheck, Calculator, AlertTriangle, ArrowRight } from 'lucide-react';

export default function LOPDPCalculator() {
  const [revenue, setRevenue] = useState<number | ''>('');
  const [infractionType, setInfractionType] = useState('grave'); // leve, grave

  // LOPDP Ecuador Art 73: Infracciones graves hasta 1% de facturación
  // Infracciones leves hasta 0.7% de facturación
  const calculateFine = () => {
    if (!revenue || revenue <= 0) return 0;
    const percentage = infractionType === 'grave' ? 0.01 : 0.007;
    return revenue * percentage;
  };

  const fine = calculateFine();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans py-16 px-4">
      <div className="max-w-3xl mx-auto">
        <Link href="/" className="inline-flex items-center justify-center gap-3 mb-12 group">
          <div className="bg-slate-950 p-2 rounded-lg shadow-sm group-hover:bg-blue-600 transition-colors">
            <ShieldCheck className="h-5 w-5 text-white" />
          </div>
          <span className="font-bold tracking-tight">Volver a ZeroTrust Redact</span>
        </Link>

        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-200">
          <div className="bg-red-600 p-8 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 opacity-10">
              <Calculator className="w-48 h-48 -mt-10 -mr-10" />
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-white mb-4 relative z-10">
              Calculadora de Multas LOPDP
            </h1>
            <p className="text-red-100 text-lg relative z-10">
              Descubre cuánto pagaría tu empresa al Estado Ecuatoriano si se filtra un documento confidencial usando herramientas online gratuitas (Art. 72-73 LOPDP).
            </p>
          </div>

          <div className="p-8 md:p-12">
            <div className="space-y-8">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  1. Facturación Anual Bruta de la Empresa (USD)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <span className="text-slate-500 font-bold">$</span>
                  </div>
                  <input
                    type="number"
                    value={revenue}
                    onChange={(e) => setRevenue(Number(e.target.value))}
                    className="block w-full pl-8 pr-4 py-4 text-xl rounded-xl border-slate-300 shadow-sm focus:border-red-500 focus:ring-red-500 bg-slate-50"
                    placeholder="Ej: 500000"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  2. Tipo de Infracción (Categoría del documento)
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <button
                    onClick={() => setInfractionType('grave')}
                    className={`p-4 rounded-xl border-2 text-left transition-all ${
                      infractionType === 'grave' 
                        ? 'border-red-600 bg-red-50' 
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="font-bold text-slate-900 mb-1">Infracción Grave (1%)</div>
                    <div className="text-xs text-slate-500">Historias clínicas, cédulas, datos bancarios, sentencias judiciales.</div>
                  </button>
                  <button
                    onClick={() => setInfractionType('leve')}
                    className={`p-4 rounded-xl border-2 text-left transition-all ${
                      infractionType === 'leve' 
                        ? 'border-orange-500 bg-orange-50' 
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="font-bold text-slate-900 mb-1">Infracción Leve (0.7%)</div>
                    <div className="text-xs text-slate-500">Correos electrónicos, datos demográficos básicos, incumplimiento técnico.</div>
                  </button>
                </div>
              </div>

              {fine > 0 && (
                <div className="mt-12 bg-slate-950 p-8 rounded-2xl text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                  <h3 className="text-slate-400 font-medium mb-2">Multa Estimada a Pagar al Estado:</h3>
                  <div className="text-5xl md:text-6xl font-black text-white mb-6">
                    ${fine.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                  
                  <div className="border-t border-slate-800 pt-6 mt-6">
                    <p className="text-slate-300 mb-6">
                      ¿Vale la pena arriesgar <strong>${fine.toLocaleString()}</strong> por ahorrar usando un editor de PDFs gratuito que roba tus datos?
                    </p>
                    <Link href="/" className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 px-8 rounded-xl transition-all w-full justify-center">
                      Blindar mi Empresa por $299 <ArrowRight className="w-5 h-5" />
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
