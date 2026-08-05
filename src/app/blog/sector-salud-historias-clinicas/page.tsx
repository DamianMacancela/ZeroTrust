import Link from 'next/link';
import { ShieldCheck, ArrowLeft, Stethoscope } from 'lucide-react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Privacidad de Pacientes y LOPDP en Clínicas | ZeroTrust Redact",
  description: "Clínicas y Hospitales en Ecuador: Cómo ofuscar historias clínicas y datos de pacientes localmente para evitar demandas bajo la LOPDP.",
  keywords: ["historias clínicas", "privacidad pacientes", "LOPDP salud", "ofuscar datos médicos", "Zero-Data Ecuador"],
};

export default function BlogPostHealth() {
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
          Sector Salud: El Peligro de Filtrar Historias Clínicas en la Nube
        </h1>
        
        <div className="prose prose-slate prose-lg max-w-none">
          <p className="lead text-xl text-slate-600 font-medium mb-10">
            Los datos de salud son considerados "Datos Sensibles" de categoría especial bajo la Ley Orgánica de Protección de Datos Personales (LOPDP). Una filtración en este sector no solo genera multas millonarias, sino demandas penales y daño irreversible a la reputación de la clínica o profesional médico.
          </p>

          <div className="bg-rose-50 border-l-4 border-rose-500 p-6 rounded-r-xl mb-10">
            <h3 className="flex items-center gap-2 text-rose-800 font-bold mt-0 mb-2">
              <Stethoscope className="w-5 h-5" />
              El Error de las Aseguradoras y Clínicas
            </h3>
            <p className="text-rose-900 m-0 text-sm">
              Cuando un médico necesita compartir un caso de estudio, o cuando la administración envía facturas y reportes a las aseguradoras, los documentos en PDF suelen contener cédulas, diagnósticos y nombres. Subir estos documentos a internet para "censurarlos" usando editores de PDF gratuitos expone los datos de salud a servidores de terceros, violando el secreto médico y la LOPDP simultáneamente.
            </p>
          </div>

          <h2 className="text-2xl font-bold mt-10 mb-4">La Anonimización Local es la Única Vía Legal</h2>
          <p>
            El reglamento exige que la anonimización de datos de salud se realice en entornos controlados (On-Premise o Zero-Data).
            Para las instituciones de salud que no cuentan con un equipo de ciberseguridad dedicado, ZeroTrust Redact ofrece una solución plug-and-play.
          </p>

          <h2 className="text-2xl font-bold mt-10 mb-4">Censura Forense de PII (Air-Gapped)</h2>
          <p>
            Con ZeroTrust Redact, el personal administrativo de un hospital puede ofuscar de manera inteligente números de cédula, correos y tarjetas de crédito directamente en su navegador web.
          </p>
          <p>
            El procesamiento ocurre <strong>100% en la memoria de la computadora local</strong>. El documento que contiene la historia clínica nunca toca nuestros servidores, garantizando el cumplimiento absoluto del secreto profesional.
          </p>

          <div className="mt-12 bg-slate-950 p-8 rounded-2xl text-white text-center">
            <h3 className="text-2xl font-bold mb-4 text-white">Audite la seguridad de su Clínica</h3>
            <p className="text-slate-400 mb-6">Proteja a sus pacientes. Use nuestro Sandbox forense para ofuscar un documento de prueba hoy mismo.</p>
            <Link href="/" className="inline-block bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-8 rounded-xl transition-colors">
              Probar Sandbox Gratuito
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
