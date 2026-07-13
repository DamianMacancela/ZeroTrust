import Link from 'next/link';
import { ShieldCheck, ArrowLeft } from 'lucide-react';

export const metadata = {
  title: 'Política de Cookies — ZeroTrust Tech',
  description: 'Política de cookies y tecnologías de almacenamiento local de ZeroTrust Tech.',
};

export default function CookiesPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans selection:bg-slate-300">
      <nav className="border-b border-slate-200 bg-white/95 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="bg-slate-900 p-1.5 rounded-lg group-hover:bg-slate-800 transition-colors">
              <ShieldCheck className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-black tracking-tighter text-slate-900">ZeroTrust<span className="text-slate-400">Tech</span></span>
          </Link>
          <Link href="/" className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors">
            <ArrowLeft className="h-4 w-4" /> Volver al Inicio
          </Link>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8 sm:p-16">
          <h1 className="text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">Política de Cookies</h1>
          <p className="text-slate-500 mb-12 font-medium">Última actualización: 10 de Julio de 2026</p>

          <div className="space-y-10 text-slate-600 leading-relaxed">

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4 tracking-tight">1. ¿Qué son las Cookies?</h2>
              <p>Las cookies son pequeños archivos de texto que los sitios web almacenan en el dispositivo del Usuario (ordenador, tablet o teléfono móvil) a través del navegador. Estas tecnologías permiten al sitio web recordar información sobre la visita del Usuario, como preferencias de idioma, estado de sesión y configuraciones.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4 tracking-tight">2. Nuestro Enfoque Minimalista</h2>
              <p className="mb-3">Coherente con nuestra filosofía Zero-Data, ZeroTrust Tech adopta un enfoque minimalista respecto al uso de cookies y tecnologías de almacenamiento. <strong>No utilizamos cookies publicitarias, de rastreo transversal (Cross-Site Tracking), ni píxeles de seguimiento de terceros.</strong></p>
              <p>Únicamente empleamos tecnologías de almacenamiento local estrictamente necesarias para el funcionamiento de la aplicación.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4 tracking-tight">3. Tecnologías de Almacenamiento Utilizadas</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse mt-2">
                  <thead>
                    <tr className="border-b-2 border-slate-200">
                      <th className="text-left py-3 px-4 font-bold text-slate-900">Nombre</th>
                      <th className="text-left py-3 px-4 font-bold text-slate-900">Tipo</th>
                      <th className="text-left py-3 px-4 font-bold text-slate-900">Propósito</th>
                      <th className="text-left py-3 px-4 font-bold text-slate-900">Duración</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <tr>
                      <td className="py-3 px-4 font-mono text-xs">grc_free_trial_used</td>
                      <td className="py-3 px-4">localStorage</td>
                      <td className="py-3 px-4">Indicador visual de prueba gratuita consumida. Solo afecta la interfaz, no es fuente de verdad de seguridad.</td>
                      <td className="py-3 px-4">Persistente</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 font-mono text-xs">cookie_consent</td>
                      <td className="py-3 px-4">localStorage</td>
                      <td className="py-3 px-4">Registra si el Usuario ha aceptado la política de cookies para no volver a mostrar el banner.</td>
                      <td className="py-3 px-4">Persistente</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="mt-4 text-sm"><strong>Nota importante:</strong> El indicador <code className="bg-slate-100 px-1.5 py-0.5 rounded">grc_free_trial_used</code> es meramente cosmético (oculta el botón de carga en la UI). La validación real del límite de prueba se ejecuta exclusivamente en el servidor mediante el hash SHA-256 almacenado en Supabase. Borrar localStorage no evade el control de seguridad.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4 tracking-tight">4. Cookies de Terceros</h2>
              <p className="mb-3">Al realizar un pago a través de Stripe Checkout, el Usuario es redirigido temporalmente al dominio de Stripe (checkout.stripe.com), donde Stripe puede establecer sus propias cookies necesarias para el procesamiento seguro de la transacción. Estas cookies están reguladas por la <a href="https://stripe.com/privacy" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline font-semibold">Política de Privacidad de Stripe</a>.</p>
              <p>ZeroTrust Tech no tiene control ni acceso a las cookies establecidas por Stripe.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4 tracking-tight">5. Cómo Gestionar las Cookies</h2>
              <p className="mb-3">El Usuario puede gestionar o eliminar las cookies y datos de almacenamiento local a través de la configuración de su navegador:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Chrome:</strong> Configuración → Privacidad y seguridad → Cookies y otros datos de sitios</li>
                <li><strong>Firefox:</strong> Opciones → Privacidad & Seguridad → Cookies y datos del sitio</li>
                <li><strong>Safari:</strong> Preferencias → Privacidad → Gestionar datos de sitios web</li>
                <li><strong>Edge:</strong> Configuración → Cookies y permisos del sitio</li>
              </ul>
              <p className="mt-3">La eliminación de cookies técnicas podría afectar la visualización correcta de ciertos elementos de la interfaz, pero no impedirá el uso del motor de ofuscación.</p>
            </section>

          </div>
        </div>

        <div className="mt-8 flex flex-wrap gap-4 justify-center">
          <Link href="/terms" className="text-sm font-semibold text-slate-500 hover:text-slate-900 transition-colors">Términos de Servicio →</Link>
          <Link href="/privacy" className="text-sm font-semibold text-slate-500 hover:text-slate-900 transition-colors">Política de Privacidad →</Link>
          <Link href="/refunds" className="text-sm font-semibold text-slate-500 hover:text-slate-900 transition-colors">Política de Reembolsos →</Link>
        </div>
      </main>

      <footer className="border-t border-slate-200 bg-white py-12 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-slate-300" />
            <span className="text-sm font-bold text-slate-900 tracking-tight">ZeroTrust Framework</span>
          </div>
          <p className="text-xs text-slate-400">© 2026. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
