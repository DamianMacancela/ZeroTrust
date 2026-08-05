import Link from 'next/link';
import { ShieldCheck, Handshake, DollarSign, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Programa de Afiliados | ZeroTrust Redact",
  description: "Únete a nuestro programa de afiliados B2B y gana 30% de comisión recurrente por cada empresa que protejas con ZeroTrust Redact.",
};

export default function AffiliatesPage() {
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '593983476198';
  const whatsappLink = `https://api.whatsapp.com/send?phone=${whatsappNumber}&text=Hola,%20quiero%20unirme%20al%20Programa%20de%20Afiliados%20y%20recibir%20mi%20código%20promocional.`;

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
          <a 
            href={whatsappLink} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-sm font-bold bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg transition-colors"
          >
            Obtener mi Código
          </a>
        </div>
      </nav>
      
      <main className="max-w-5xl mx-auto px-4 py-20">
        
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <div className="inline-flex items-center justify-center p-3 bg-blue-100 rounded-2xl mb-6">
            <Handshake className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-4xl md:text-5xl font-black mb-6 leading-tight tracking-tight">
            Gana dinero protegiendo a las empresas de tu red
          </h1>
          <p className="text-xl text-slate-600 font-medium">
            Únete al programa de partners B2B de ZeroTrust. Gana un <span className="font-bold text-blue-600">30% de comisión ($90 USD)</span> por cada Licencia Anual Enterprise que se venda con tu enlace.
          </p>
        </div>

        {/* Pasos Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm relative">
            <div className="absolute -top-4 -left-4 w-10 h-10 bg-blue-600 text-white flex items-center justify-center rounded-xl font-black text-xl">1</div>
            <h3 className="text-xl font-bold mb-3 mt-4">Regístrate</h3>
            <p className="text-slate-600 text-sm">Contáctanos vía WhatsApp para registrarte como Partner. Te asignaremos un código de descuento único para tu audiencia.</p>
          </div>
          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm relative">
            <div className="absolute -top-4 -left-4 w-10 h-10 bg-blue-600 text-white flex items-center justify-center rounded-xl font-black text-xl">2</div>
            <h3 className="text-xl font-bold mb-3 mt-4">Comparte</h3>
            <p className="text-slate-600 text-sm">Recomienda ZeroTrust a estudios jurídicos, empresas y departamentos de RRHH usando tu código único.</p>
          </div>
          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm relative">
            <div className="absolute -top-4 -left-4 w-10 h-10 bg-emerald-500 text-white flex items-center justify-center rounded-xl font-black text-xl">3</div>
            <h3 className="text-xl font-bold mb-3 mt-4">Cobra tus Comisiones</h3>
            <p className="text-slate-600 text-sm">Recibe pagos directos y transparentes por cada venta que logres. Sin topes de ganancias.</p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-slate-950 rounded-3xl p-10 md:p-16 text-center shadow-2xl relative overflow-hidden">
          <div className="relative z-10">
            <DollarSign className="w-16 h-16 text-emerald-400 mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-black text-white mb-6">
              ¿Listo para monetizar tu red de contactos?
            </h2>
            <p className="text-slate-400 text-lg mb-10 max-w-2xl mx-auto">
              Solo toma 2 minutos activarte como afiliado. Escríbenos, obtén tu código promocional y empieza a ofrecer soluciones de ciberseguridad a empresas que lo necesitan con urgencia.
            </p>
            <a 
              href={whatsappLink} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black py-4 px-8 rounded-xl transition-all shadow-lg hover:shadow-emerald-500/25"
            >
              Iniciar Proceso de Afiliación <ArrowRight className="w-5 h-5" />
            </a>
          </div>
        </div>
        
      </main>
    </div>
  );
}
