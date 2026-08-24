import Link from 'next/link';
import { ShieldCheck, Book, Code, Server, CheckCircle2 } from 'lucide-react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Documentación y API | ZeroTrust Redact",
  description: "Documentación técnica de ZeroTrust Redact. Arquitectura Zero-Data, ofuscación en WebAssembly y guías de integración B2B.",
  keywords: ["documentación", "API", "integración B2B", "WebAssembly", "arquitectura Zero-Data"],
};

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans flex flex-col">
      <nav className="border-b border-slate-200 bg-white/95 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="bg-slate-950 p-2.5 rounded-lg shadow-sm border border-slate-800">
              <ShieldCheck className="h-6 w-6 text-white" />
            </div>
            <div>
              <span className="block font-bold text-xl tracking-tight text-slate-900 leading-none">ZeroTrust <span className="font-light text-slate-500">Docs</span></span>
            </div>
          </Link>
          <Link href="/" className="text-sm font-bold text-slate-600 hover:text-slate-900">Volver a la App</Link>
        </div>
      </nav>
      
      <div className="flex-grow flex w-full max-w-7xl mx-auto">
        {/* Sidebar */}
        <aside className="w-64 border-r border-slate-200 bg-slate-50 hidden md:block pt-8 px-6 pb-20 sticky top-20 h-[calc(100vh-80px)] overflow-y-auto">
          <h4 className="font-bold text-xs tracking-widest uppercase text-slate-400 mb-4">Arquitectura</h4>
          <ul className="space-y-3 mb-8">
            <li><a href="#zero-data" className="text-sm font-semibold text-blue-600">Modelo Zero-Data</a></li>
            <li><a href="#wasm" className="text-sm font-medium text-slate-600 hover:text-blue-600">Procesamiento WebAssembly</a></li>
            <li><a href="#seguridad" className="text-sm font-medium text-slate-600 hover:text-blue-600">Estándares de Seguridad</a></li>
          </ul>

          <h4 className="font-bold text-xs tracking-widest uppercase text-slate-400 mb-4">Integración</h4>
          <ul className="space-y-3">
            <li><a href="#enterprise" className="text-sm font-medium text-slate-600 hover:text-blue-600">Licencia Enterprise</a></li>
            <li><a href="#on-premise" className="text-sm font-medium text-slate-600 hover:text-blue-600">Despliegue On-Premise</a></li>
            <li><a href="#soporte" className="text-sm font-medium text-slate-600 hover:text-blue-600">Soporte y SLA</a></li>
          </ul>
        </aside>

        {/* Content */}
        <main className="flex-1 px-4 py-8 md:p-12 lg:p-16 overflow-y-auto">
          <div className="max-w-3xl">
            <h1 className="text-4xl font-black mb-4 tracking-tight">Documentación Técnica</h1>
            <p className="text-xl text-slate-600 mb-12">Cómo ZeroTrust Redact protege la información PII de tu empresa operando 100% en el lado del cliente.</p>
            
            <section id="zero-data" className="mb-16">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-blue-100 p-2 rounded-lg"><Server className="w-6 h-6 text-blue-600" /></div>
                <h2 className="text-2xl font-bold">El Modelo Zero-Data</h2>
              </div>
              <p className="text-slate-600 mb-4">A diferencia de los procesadores de PDF tradicionales basados en SaaS, ZeroTrust no recibe tus documentos en sus servidores. Nuestro modelo "Zero-Data" significa que tu red transfiere 0 bytes del contenido del documento hacia afuera.</p>
              <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
                <ul className="space-y-3">
                  <li className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" /> <span className="text-sm">Cumplimiento automático de la LOPDP (Ecuador) y GDPR (Europa).</span></li>
                  <li className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" /> <span className="text-sm">Inmunidad ante ataques de intermediario (Man-In-The-Middle) y filtraciones de bases de datos de proveedores.</span></li>
                </ul>
              </div>
            </section>

            <section id="wasm" className="mb-16">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-purple-100 p-2 rounded-lg"><Code className="w-6 h-6 text-purple-600" /></div>
                <h2 className="text-2xl font-bold">Procesamiento por WebAssembly</h2>
              </div>
              <p className="text-slate-600 mb-4">Para lograr la redacción forense en el navegador a velocidades empresariales, utilizamos WebAssembly (WASM). Cuando abres ZeroTrust, tu navegador descarga el motor de redacción completo y lo ejecuta localmente con rendimiento nativo.</p>
              <pre className="bg-slate-950 text-slate-300 p-6 rounded-xl overflow-x-auto text-sm font-mono mb-4 shadow-lg border border-slate-800">
{`// Ejemplo conceptual del pipeline Zero-Data
const engine = await loadWasmEngine();
const localFileBytes = await fileInput.arrayBuffer();

// La redacción sucede en la memoria RAM del usuario
const redactedBytes = engine.redactRegex(localFileBytes, pattern);

// El archivo nunca sale del navegador
downloadLocal(redactedBytes);`}
              </pre>
            </section>

            <section id="enterprise" className="mb-16">
              <h2 className="text-2xl font-bold mb-6">Integración Enterprise B2B</h2>
              <p className="text-slate-600 mb-4">Para firmas de abogados, hospitales y departamentos contables, la licencia Enterprise ($19.99/mes o $215.90/año con 10% de descuento) elimina todas las restricciones de páginas y peso de archivo, habilitando el procesamiento de expedientes masivos.</p>
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-6">
                <h4 className="font-bold mb-2">¿Necesitas una API o un Despliegue On-Premise?</h4>
                <p className="text-sm text-slate-600 mb-4">Podemos integrar nuestro motor WebAssembly directamente en la intranet de tu corporación (SharePoint, Sistemas de Gestión Documental). Contáctanos para discutir una arquitectura personalizada.</p>
                <a href={`https://api.whatsapp.com/send?phone=${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '593983476198'}&text=Hola,%20deseo%20información%20técnica%20sobre%20el%20despliegue%20On-Premise%20de%20ZeroTrust.`} target="_blank" rel="noopener noreferrer" className="inline-block text-sm font-bold bg-slate-900 text-white px-5 py-2.5 rounded-lg hover:bg-slate-800 transition-colors">Hablar con Ingeniería</a>
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}
