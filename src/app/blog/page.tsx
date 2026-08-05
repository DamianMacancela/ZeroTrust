import Link from 'next/link';
import { ShieldCheck, ArrowRight } from 'lucide-react';

export default function BlogIndex() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans">
      <nav className="border-b border-slate-200 bg-white/95 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="bg-slate-950 p-2.5 rounded-lg shadow-sm border border-slate-800">
              <ShieldCheck className="h-6 w-6 text-white" />
            </div>
            <div>
              <span className="block font-bold text-xl tracking-tight text-slate-900 leading-none">ZeroTrust</span>
            </div>
          </Link>
        </div>
      </nav>
      
      <main className="max-w-4xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-black mb-12">Recursos de Cumplimiento (LegalTech)</h1>
        
        <div className="space-y-6">
          <Link href="/blog/lopdp-ecuador-multas" className="block bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all group">
            <h2 className="text-2xl font-bold mb-3 text-slate-900 group-hover:text-blue-600 transition-colors">
              Evita Multas de la LOPDP en Ecuador: Por qué borrar datos de PDFs online es un riesgo
            </h2>
            <p className="text-slate-600 mb-6">
              Descubre cómo las transferencias internacionales de datos pueden costarle a tu empresa hasta el 1% de facturación por usar herramientas gratuitas.
            </p>
            <div className="text-sm font-bold text-blue-600 flex items-center gap-2">
              Leer Artículo Completo <ArrowRight className="w-4 h-4" />
            </div>
          </Link>

          <Link href="/blog/privacidad-corporativa-rrhh" className="block bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all group">
            <h2 className="text-2xl font-bold mb-3 text-slate-900 group-hover:text-blue-600 transition-colors">
              Privacidad en RRHH: El Desafío de Manejar Cédulas y Contratos bajo la Ley
            </h2>
            <p className="text-slate-600 mb-6">
              Aprende cómo los departamentos de talento humano pueden automatizar la censura de información en contratos y nóminas localmente para mitigar riesgos.
            </p>
            <div className="text-sm font-bold text-blue-600 flex items-center gap-2">
              Leer Artículo Completo <ArrowRight className="w-4 h-4" />
            </div>
          </Link>

          <Link href="/blog/secreto-bancario-ciberseguridad" className="block bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all group">
            <h2 className="text-2xl font-bold mb-3 text-slate-900 group-hover:text-blue-600 transition-colors">
              Banca y Fintech: El Riesgo de Romper el Secreto Bancario en la Nube
            </h2>
            <p className="text-slate-600 mb-6">
              Conoce cómo las instituciones financieras en Ecuador pueden proteger el secreto bancario ofuscando datos en PDFs locales sin usar APIs externas.
            </p>
            <div className="text-sm font-bold text-blue-600 flex items-center gap-2">
              Leer Artículo Completo <ArrowRight className="w-4 h-4" />
            </div>
          </Link>
        </div>
      </main>
    </div>
  );
}
