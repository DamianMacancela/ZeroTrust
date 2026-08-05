import Link from 'next/link';
import { ShieldCheck, ArrowLeft, Award, Briefcase, Lock } from 'lucide-react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Damian Fabricio Macancela | Fundador ZeroTrust Redact",
  description: "Conoce a Damian Fabricio Macancela, experto en ciberseguridad y fundador de ZeroTrust Redact, la plataforma líder en cumplimiento LOPDP.",
  keywords: ["Damian Fabricio Macancela", "ciberseguridad", "ZeroTrust Tech", "LOPDP Ecuador", "Zero-Data"],
};

export default function FounderPage() {
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
        <Link href="/" className="inline-flex items-center gap-2 text-sm font-bold text-blue-600 mb-8 hover:text-blue-800 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Volver al inicio
        </Link>

        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-slate-200 mb-12">
          <div className="flex flex-col md:flex-row gap-10 items-start">
            <div className="w-full md:w-1/3">
              <div className="aspect-square bg-slate-100 rounded-2xl border-4 border-white shadow-lg overflow-hidden flex items-center justify-center relative">
                {/* Placeholder for founder photo */}
                <div className="absolute inset-0 bg-gradient-to-tr from-slate-800 to-slate-900 flex items-center justify-center">
                  <span className="text-6xl font-black text-white/20">DM</span>
                </div>
              </div>
            </div>
            <div className="w-full md:w-2/3">
              <h1 className="text-4xl font-black mb-2">Damian Fabricio Macancela</h1>
              <h2 className="text-xl text-blue-600 font-bold mb-6">Fundador & Arquitecto de Ciberseguridad</h2>
              
              <div className="prose prose-slate prose-lg max-w-none">
                <p>
                  Especialista en arquitecturas de software seguro y cumplimiento normativo. Damian es el creador de <strong>ZeroTrust Redact</strong>, la tecnología pionera en Ecuador y Latinoamérica que permite a bufetes jurídicos y corporaciones procesar datos confidenciales sin exponerlos a internet (Zero-Data).
                </p>
                <p>
                  Su visión es democratizar la ciberseguridad militar, entregando herramientas de ofuscación forense directamente a los navegadores web de los usuarios finales, eliminando el riesgo de multas por la Ley Orgánica de Protección de Datos Personales (LOPDP).
                </p>
              </div>

              <div className="flex flex-wrap gap-4 mt-8">
                <a href={`https://api.whatsapp.com/send?phone=${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '593983476198'}&text=Hola%20Damian,%20me%20interesa%20una%20asesoría%20sobre%20ZeroTrust.`} target="_blank" rel="noopener noreferrer" className="bg-slate-950 hover:bg-slate-800 text-white font-bold py-3 px-6 rounded-xl transition-colors">
                  Contactar Directamente
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <ShieldCheck className="w-8 h-8 text-blue-600 mb-4" />
            <h3 className="font-bold text-lg mb-2">Privacidad por Diseño</h3>
            <p className="text-slate-600 text-sm">Arquitectura de software donde los datos del cliente nunca tocan un servidor externo.</p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <Lock className="w-8 h-8 text-blue-600 mb-4" />
            <h3 className="font-bold text-lg mb-2">Experto LOPDP</h3>
            <p className="text-slate-600 text-sm">Desarrollo de soluciones tecnológicas alineadas estrictamente al cumplimiento legal ecuatoriano.</p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <Award className="w-8 h-8 text-blue-600 mb-4" />
            <h3 className="font-bold text-lg mb-2">Innovación B2B</h3>
            <p className="text-slate-600 text-sm">Impulsando la transformación digital segura en los sectores legal, salud y financiero.</p>
          </div>
        </div>
      </main>
    </div>
  );
}
