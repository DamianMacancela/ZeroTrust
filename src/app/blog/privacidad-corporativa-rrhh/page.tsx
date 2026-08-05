import Link from 'next/link';
import { ShieldCheck, ArrowLeft, Archive } from 'lucide-react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Privacidad en RRHH: Ofuscación de Cédulas en Contratos | ZeroTrust",
  description: "Descubre cómo los departamentos de Recursos Humanos pueden automatizar la censura de cédulas y datos personales en contratos laborales para cumplir con la ley.",
  keywords: ["Recursos Humanos", "contratos laborales", "ofuscar cédulas", "LOPDP RRHH", "privacidad empleados", "Zero-Data"],
};

export default function BlogPostRRHH() {
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
      
      <main className="max-w-3xl mx-auto px-4 py-16">
        <Link href="/blog" className="inline-flex items-center gap-2 text-sm font-bold text-blue-600 mb-8 hover:text-blue-800 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Volver al Blog
        </Link>

        <h1 className="text-4xl font-black mb-6 leading-tight">
          El Desafío de RRHH: Manejo de Cédulas y Contratos bajo la LOPDP
        </h1>
        
        <div className="prose prose-slate prose-lg max-w-none">
          <p className="lead text-xl text-slate-600 font-medium mb-10">
            Los departamentos de Recursos Humanos son minas de oro de información personal. Desde la contratación hasta la nómina, manejan a diario copias de cédulas, números de cuentas bancarias y direcciones domiciliarias.
          </p>

          <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-xl mb-10">
            <h3 className="flex items-center gap-2 text-blue-800 font-bold mt-0 mb-2">
              <Archive className="w-5 h-5" />
              El Riesgo de la Digitalización
            </h3>
            <p className="text-blue-900 m-0 text-sm">
              Escanear contratos y almacenarlos en carpetas compartidas sin ofuscar los datos sensibles expone a la empresa a riesgos de suplantación de identidad internos, lo que recae en responsabilidad patronal y posibles auditorías estatales.
            </p>
          </div>

          <h2 className="text-2xl font-bold mt-10 mb-4">¿Por qué debes censurar los documentos de tus empleados?</h2>
          <p>
            El principio de "Minimización de Datos" exige que cualquier departamento dentro de la empresa solo tenga acceso a la información estrictamente necesaria. Si un analista de marketing necesita ver un contrato de confidencialidad, no tiene por qué ver la dirección personal ni el RUC/Cédula del empleado. Compartir el documento en bruto es un riesgo de privacidad.
          </p>

          <h2 className="text-2xl font-bold mt-10 mb-4">Automatización Zero-Data en tu Navegador</h2>
          <p>
            ZeroTrust Redact ha sido diseñado pensando en la agilidad que requiere RRHH. 
            En lugar de usar marcadores negros físicos sobre papel o usar herramientas online inseguras, nuestra plataforma permite que el equipo de Talento Humano arrastre el PDF escaneado (o contrato en Word/Excel) y nuestro motor de IA identifique y borre las cédulas y tarjetas en segundos, <strong>sin que el archivo abandone su computadora.</strong>
          </p>

          <div className="mt-12 bg-slate-950 p-8 rounded-2xl text-white text-center">
            <h3 className="text-2xl font-bold mb-4 text-white">Protege a tu Talento Humano</h3>
            <p className="text-slate-400 mb-6">Prueba nuestra herramienta para ofuscar contratos sin comprometer la seguridad de la información corporativa.</p>
            <Link href="/" className="inline-block bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-8 rounded-xl transition-colors">
              Iniciar Sandbox Gratuito
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
