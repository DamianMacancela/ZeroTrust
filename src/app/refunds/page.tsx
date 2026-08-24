import Link from 'next/link';
import { ShieldCheck, ArrowLeft } from 'lucide-react';

export const metadata = {
  title: 'Política de Reembolsos — ZeroTrust Tech',
  description: 'Política de reembolsos, cancelaciones y facturación de ZeroTrust Tech.',
};

export default function RefundsPage() {
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
          <h1 className="text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">Política de Reembolsos y Cancelaciones</h1>
          <p className="text-slate-500 mb-12 font-medium">Última actualización: 10 de Julio de 2026</p>

          <div className="space-y-10 text-slate-600 leading-relaxed">

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4 tracking-tight">1. Prueba Gratuita</h2>
              <p className="mb-3">ZeroTrust Tech ofrece una prueba gratuita sin compromiso y sin necesidad de registrar método de pago. Esta prueba permite al Usuario procesar un (1) documento para verificar la efectividad del motor de ofuscación antes de considerar una suscripción de pago.</p>
              <p>Dado que la prueba gratuita no involucra transacción financiera alguna, no aplica ninguna política de reembolso sobre ella.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4 tracking-tight">2. Suscripción Enterprise</h2>
              <p className="mb-3">La Licencia Enterprise se factura de forma recurrente al precio publicado de <strong>USD $29.99 por mes</strong>. El cargo se realiza automáticamente cada 30 días naturales a través de Stripe.</p>
              <div className="bg-slate-50 rounded-xl border border-slate-100 p-6 space-y-3 my-4">
                <p className="font-bold text-slate-900">Resumen de Facturación:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Moneda:</strong> Dólares estadounidenses (USD)</li>
                  <li><strong>Ciclo:</strong> Mensual (30 días naturales)</li>
                  <li><strong>Cargo automático:</strong> Sí, al inicio de cada ciclo</li>
                  <li><strong>Impuestos:</strong> Según la jurisdicción fiscal del Usuario</li>
                  <li><strong>Pasarela:</strong> Stripe, Inc. (certificada PCI-DSS Nivel 1)</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4 tracking-tight">3. Cancelación de la Suscripción</h2>
              <p className="mb-3">El Usuario puede cancelar su suscripción Enterprise en cualquier momento, sin penalización y sin necesidad de justificación. Al cancelar:</p>
              <ul className="list-disc pl-6 space-y-2 mb-3">
                <li>El acceso Enterprise permanecerá activo hasta el final del ciclo de facturación ya pagado.</li>
                <li>No se realizarán cargos adicionales a partir de la fecha de cancelación.</li>
                <li>Tras la expiración del ciclo, el acceso se degradará automáticamente al nivel gratuito.</li>
                <li>El Usuario podrá reactivar su suscripción en cualquier momento futuro.</li>
              </ul>
              <p>Para cancelar, el Usuario puede gestionar su suscripción directamente desde el portal de pagos de Stripe (enlace disponible en el correo de confirmación original) o contactar a nuestro equipo en soporte@zerotrust-tech.com.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4 tracking-tight">4. Política de Reembolsos</h2>
              <p className="mb-3">Dado que ZeroTrust Tech ofrece una prueba gratuita que permite al Usuario verificar la funcionalidad del Servicio antes de realizar cualquier pago, la política de reembolsos se estructura de la siguiente manera:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Primeros 7 días:</strong> Si el Usuario solicita un reembolso dentro de los primeros 7 días calendario desde la activación de su suscripción, se procesará un reembolso completo sin preguntas.</li>
                <li><strong>Después de 7 días:</strong> No se emitirán reembolsos prorrateados por el período restante del ciclo de facturación. La cancelación es la vía apropiada para dejar de usar el Servicio.</li>
                <li><strong>Errores de facturación:</strong> Si el Usuario identifica un cargo duplicado, erróneo o no autorizado, se procesará el reembolso correspondiente dentro de un plazo de 5 días hábiles tras la verificación.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4 tracking-tight">5. Cómo Solicitar un Reembolso</h2>
              <p className="mb-3">Para solicitar un reembolso, envíe un correo electrónico a <strong>soporte@zerotrust-tech.com</strong> incluyendo:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>El correo electrónico asociado a su cuenta Stripe.</li>
                <li>La fecha aproximada del cargo.</li>
                <li>El motivo de la solicitud (opcional pero apreciado para mejorar el Servicio).</li>
              </ul>
              <p className="mt-3">Los reembolsos aprobados se procesan a través de Stripe y el tiempo de acreditación depende de la entidad bancaria del Usuario (generalmente entre 5 y 10 días hábiles).</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4 tracking-tight">6. Disputas y Contracargos</h2>
              <p>Le pedimos encarecidamente que se comunique con nuestro equipo de soporte antes de iniciar una disputa o contracargo (chargeback) con su entidad bancaria. Las disputas generan costos administrativos significativos que pueden resultar en la suspensión inmediata de la cuenta. Nos comprometemos a resolver cualquier inconformidad de forma justa y oportuna mediante comunicación directa.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4 tracking-tight">7. Contacto</h2>
              <p>Para cualquier consulta relacionada con facturación, cancelaciones o reembolsos:</p>
              <ul className="list-disc pl-6 space-y-2 mt-3">
                <li><strong>Soporte:</strong> soporte@zerotrust-tech.com</li>
                <li><strong>Tiempo de respuesta:</strong> Máximo 48 horas hábiles</li>
              </ul>
            </section>

          </div>
        </div>

        <div className="mt-8 flex flex-wrap gap-4 justify-center">
          <Link href="/terms" className="text-sm font-semibold text-slate-500 hover:text-slate-900 transition-colors">Términos de Servicio →</Link>
          <Link href="/privacy" className="text-sm font-semibold text-slate-500 hover:text-slate-900 transition-colors">Política de Privacidad →</Link>
          <Link href="/cookies" className="text-sm font-semibold text-slate-500 hover:text-slate-900 transition-colors">Política de Cookies →</Link>
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
