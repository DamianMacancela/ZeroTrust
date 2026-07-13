import Link from 'next/link';
import { ShieldCheck, ArrowLeft } from 'lucide-react';

export const metadata = {
  title: 'Términos y Condiciones — ZeroTrust Tech',
  description: 'Términos y Condiciones de Servicio de la plataforma ZeroTrust Tech para ofuscación de documentos confidenciales.',
};

export default function TermsPage() {
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
          <h1 className="text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">Términos y Condiciones de Servicio</h1>
          <p className="text-slate-500 mb-12 font-medium">Última actualización: 10 de Julio de 2026</p>

          <div className="space-y-10 text-slate-600 leading-relaxed">

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4 tracking-tight">1. Aceptación de los Términos</h2>
              <p className="mb-3">Al acceder, navegar o utilizar los servicios proporcionados por ZeroTrust Tech (en adelante, &quot;el Servicio&quot;, &quot;la Plataforma&quot; o &quot;nosotros&quot;), usted (en adelante, &quot;el Usuario&quot;, &quot;usted&quot; o &quot;el Cliente&quot;) reconoce haber leído, comprendido y aceptado la totalidad de estos Términos y Condiciones de Servicio (&quot;TCS&quot;).</p>
              <p className="mb-3">Estos TCS constituyen un acuerdo legal vinculante entre usted y ZeroTrust Tech, aplicable al uso de nuestras herramientas de ofuscación documental Zero-Data, incluyendo pero no limitado a: el motor de saneamiento de PII, el panel Sandbox Público Efímero, la Licencia Enterprise y cualquier servicio complementario.</p>
              <p>Si usted no está de acuerdo con alguna parte de estos términos, deberá abstenerse de utilizar la Plataforma. El uso continuado del Servicio después de cualquier modificación a estos TCS constituye aceptación de los términos actualizados.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4 tracking-tight">2. Descripción del Servicio</h2>
              <p className="mb-3">ZeroTrust Tech es una plataforma SaaS (Software as a Service) especializada en la ofuscación y saneamiento de Información de Identificación Personal (PII) contenida en documentos digitales. El Servicio opera bajo una arquitectura denominada &quot;Zero-Data&quot;, en la cual:</p>
              <ul className="list-disc pl-6 space-y-2 mb-3">
                <li>El procesamiento de documentos se ejecuta íntegramente en el dispositivo del Usuario mediante tecnología Web Worker aislada del hilo principal del navegador.</li>
                <li>Ningún archivo original, procesado o derivado es transmitido, almacenado ni replicado en los servidores de ZeroTrust Tech.</li>
                <li>La infraestructura backend (Supabase con PostgreSQL) gestiona exclusivamente metadatos operacionales: hashes unidireccionales de identificación, roles de suscripción e identificadores de transacciones financieras.</li>
              </ul>
              <p>Los formatos actualmente soportados incluyen: PDF, DOCX, DOC, XLSX, XLS y CSV.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4 tracking-tight">3. Niveles de Servicio y Acceso</h2>
              <h3 className="text-lg font-bold text-slate-800 mb-2">3.1. Prueba Gratuita (Sandbox Público Efímero)</h3>
              <p className="mb-3">El nivel de acceso gratuito permite al Usuario procesar un (1) único documento como demostración de las capacidades del motor. Este límite se controla mediante técnicas de hashing criptográfico SHA-256 aplicadas a la dirección IP del Usuario, conforme a nuestra <Link href="/privacy" className="text-blue-600 hover:underline font-semibold">Política de Privacidad</Link>.</p>
              <p className="mb-4">Cualquier intento de evadir este mecanismo de control —incluyendo, sin limitación, el uso de VPN, proxies, redes TOR o manipulación de encabezados HTTP— constituye una violación de estos TCS y puede resultar en la denegación permanente del acceso.</p>

              <h3 className="text-lg font-bold text-slate-800 mb-2">3.2. Licencia Enterprise (Suscripción de Pago)</h3>
              <p className="mb-3">El plan Enterprise proporciona acceso ilimitado al motor de ofuscación, soporte prioritario, procesamiento en lote y funcionalidades avanzadas. La suscripción se factura de forma recurrente (mensual) a través de Stripe, Inc., pasarela de pago certificada PCI-DSS Nivel 1.</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Precio:</strong> USD $29.99 por mes, más impuestos aplicables según la jurisdicción del Usuario.</li>
                <li><strong>Ciclo de facturación:</strong> El cargo se realiza automáticamente cada 30 días naturales a partir de la fecha de activación.</li>
                <li><strong>Activación:</strong> El acceso Enterprise se activa de forma instantánea tras la confirmación del pago por parte de Stripe.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4 tracking-tight">4. Cancelación y Reembolsos</h2>
              <p className="mb-3">El Usuario puede cancelar su suscripción Enterprise en cualquier momento. La cancelación se hace efectiva al finalizar el ciclo de facturación vigente, durante el cual el Usuario conservará acceso completo a todas las funcionalidades.</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>No se emiten reembolsos prorrateados por cancelaciones realizadas a mitad de un ciclo de facturación.</li>
                <li>No se realizan cargos adicionales después de la cancelación efectiva.</li>
                <li>El Usuario podrá reactivar su suscripción en cualquier momento futuro.</li>
                <li>Para solicitar la cancelación, el Usuario puede gestionar su suscripción directamente desde el portal de Stripe o contactar a nuestro equipo de soporte.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4 tracking-tight">5. Propiedad Intelectual</h2>
              <p className="mb-3">Todo el software, código fuente, algoritmos de ofuscación, diseño de interfaz, marcas comerciales, logotipos y contenido textual de la Plataforma son propiedad exclusiva de ZeroTrust Tech y están protegidos por las leyes de propiedad intelectual aplicables.</p>
              <p>El Usuario retiene la propiedad total de todos los documentos que procesa a través del Servicio. ZeroTrust Tech no adquiere ningún derecho, licencia ni interés sobre el contenido de los documentos del Usuario en virtud de estos TCS.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4 tracking-tight">6. Limitación de Responsabilidad</h2>
              <p className="mb-3">El motor de ofuscación se proporciona &quot;TAL CUAL&quot; (&quot;AS IS&quot;) y &quot;SEGÚN DISPONIBILIDAD&quot; (&quot;AS AVAILABLE&quot;). Si bien utilizamos algoritmos deterministas, expresiones regulares avanzadas y técnicas de reconocimiento de patrones para detectar PII, <strong>no garantizamos la detección del 100% de los datos sensibles</strong> contenidos en un documento debido a:</p>
              <ul className="list-disc pl-6 space-y-2 mb-3">
                <li>Variabilidad en formatos y codificaciones de documentos.</li>
                <li>Datos sensibles embebidos en imágenes, gráficos o elementos no textuales.</li>
                <li>Patrones de PII no estándar o específicos de una jurisdicción no contemplada.</li>
              </ul>
              <p className="mb-3">Es responsabilidad exclusiva del Usuario verificar que el documento resultante ha sido debidamente saneado antes de su distribución, publicación o entrega a terceros.</p>
              <p>En ningún caso ZeroTrust Tech será responsable por daños directos, indirectos, incidentales, especiales, consecuentes o punitivos derivados del uso o la imposibilidad de uso del Servicio, incluyendo pero no limitado a: pérdida de datos, pérdida de beneficios, interrupción del negocio o daño reputacional.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4 tracking-tight">7. Uso Aceptable</h2>
              <p className="mb-3">El Usuario se compromete a utilizar el Servicio exclusivamente para fines lícitos y de conformidad con estos TCS. Queda expresamente prohibido:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Utilizar el Servicio para procesar contenido ilegal, difamatorio, obsceno o que viole derechos de terceros.</li>
                <li>Intentar realizar ingeniería inversa, descompilar o desensamblar cualquier componente del Servicio.</li>
                <li>Utilizar el Servicio para evadir obligaciones legales de divulgación o transparencia.</li>
                <li>Sobrecargar intencionalmente la infraestructura del Servicio mediante solicitudes automatizadas masivas.</li>
                <li>Revender, sublicenciar o redistribuir el acceso al Servicio sin autorización expresa.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4 tracking-tight">8. Disponibilidad y Mantenimiento</h2>
              <p>ZeroTrust Tech se esfuerza por mantener una disponibilidad del Servicio del 99.9% (SLA). Sin embargo, nos reservamos el derecho de realizar mantenimientos programados o de emergencia que podrían resultar en interrupciones temporales. En caso de mantenimiento programado, se notificará a los usuarios Enterprise con un mínimo de 48 horas de anticipación.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4 tracking-tight">9. Legislación Aplicable y Jurisdicción</h2>
              <p className="mb-3">Estos TCS se regirán e interpretarán de acuerdo con las leyes de la República del Ecuador. Para la resolución de cualquier controversia derivada de estos TCS, las partes se someten a la jurisdicción exclusiva de los tribunales competentes de la ciudad de Quito, renunciando expresamente a cualquier otro fuero que pudiera corresponderles.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4 tracking-tight">10. Modificaciones a los Términos</h2>
              <p className="mb-3">ZeroTrust Tech se reserva el derecho de modificar estos TCS en cualquier momento. Las modificaciones serán efectivas desde su publicación en esta página. Para cambios sustanciales que afecten los derechos de los usuarios Enterprise, se enviará una notificación por correo electrónico con un mínimo de 30 días de anticipación.</p>
              <p>La fecha de &quot;Última actualización&quot; al inicio de este documento refleja la versión más reciente de estos TCS.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4 tracking-tight">11. Contacto</h2>
              <p>Para consultas relacionadas con estos Términos y Condiciones, puede contactarnos a través de:</p>
              <ul className="list-disc pl-6 space-y-2 mt-3">
                <li><strong>Correo electrónico:</strong> legal@zerotrust-tech.com</li>
                <li><strong>Soporte técnico:</strong> soporte@zerotrust-tech.com</li>
              </ul>
            </section>

          </div>
        </div>

        <div className="mt-8 flex flex-wrap gap-4 justify-center">
          <Link href="/privacy" className="text-sm font-semibold text-slate-500 hover:text-slate-900 transition-colors">Política de Privacidad →</Link>
          <Link href="/cookies" className="text-sm font-semibold text-slate-500 hover:text-slate-900 transition-colors">Política de Cookies →</Link>
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
