import Link from 'next/link';
import { ShieldCheck, ArrowLeft } from 'lucide-react';

export const metadata = {
  title: 'Política de Privacidad — ZeroTrust Tech',
  description: 'Política de privacidad y protección de datos personales de ZeroTrust Tech. Arquitectura Zero-Data.',
};

export default function PrivacyPage() {
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
          <h1 className="text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">Política de Privacidad</h1>
          <p className="text-slate-500 mb-12 font-medium">Última actualización: 10 de Julio de 2026</p>

          <div className="space-y-10 text-slate-600 leading-relaxed">

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4 tracking-tight">1. Compromiso Zero-Data</h2>
              <p className="mb-3">En ZeroTrust Tech, la privacidad no es una característica adicional: es el fundamento matemático de nuestra arquitectura. Operamos bajo un modelo estricto denominado &quot;Zero-Data&quot;, certificando que <strong>ningún documento subido, procesado o saneado por el Usuario es transmitido, almacenado, replicado ni accedido por nuestros servidores bajo ninguna circunstancia.</strong></p>
              <p>Todo el procesamiento de redacción de Información de Identificación Personal (PII) ocurre de forma local y efímera en el dispositivo del Usuario, utilizando Web Workers aislados que se ejecutan en un hilo separado del navegador sin acceso al DOM principal ni a recursos de red.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4 tracking-tight">2. Responsable del Tratamiento</h2>
              <p className="mb-3">El responsable del tratamiento de los datos personales es:</p>
              <div className="bg-slate-50 rounded-xl border border-slate-100 p-6 space-y-1">
                <p><strong>ZeroTrust Tech</strong></p>
                <p>Correo electrónico del DPO: legal@zerotrust-tech.com</p>
                <p>Sitio web: https://zerotrust-redact.vercel.app</p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4 tracking-tight">3. Datos Personales que Recopilamos</h2>
              <p className="mb-4">Solo recopilamos la información estrictamente necesaria para mantener la integridad operativa del Servicio y prevenir abusos. A continuación, se detalla cada categoría:</p>

              <h3 className="text-lg font-bold text-slate-800 mb-2">3.1. Hashes Criptográficos de Dirección IP</h3>
              <p className="mb-4">Para prevenir el uso múltiple del plan &quot;Prueba Gratuita&quot;, recopilamos la dirección IP del Usuario de forma transitoria. Esta dirección se convierte inmediatamente en un hash SHA-256 unidireccional con salt criptográfico antes de ser almacenada. <strong>El hash no puede revertirse a la dirección IP original</strong>, cumpliendo con los principios de minimización y pseudonimización de datos establecidos por el RGPD (Reglamento General de Protección de Datos) y la LOPDP (Ley Orgánica de Protección de Datos Personales del Ecuador).</p>

              <h3 className="text-lg font-bold text-slate-800 mb-2">3.2. Datos de Cuenta Enterprise</h3>
              <p className="mb-4">Al suscribirse a un plan de pago, se recopila el correo electrónico de contacto proporcionado por Stripe durante el proceso de checkout. Este correo se utiliza exclusivamente para:</p>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li>Gestionar la suscripción y el rol de acceso del Usuario.</li>
                <li>Enviar notificaciones transaccionales (confirmación de pago, cancelación, cambios de plan).</li>
                <li>Comunicar cambios sustanciales a los Términos de Servicio o esta Política de Privacidad.</li>
              </ul>

              <h3 className="text-lg font-bold text-slate-800 mb-2">3.3. Identificadores de Transacciones</h3>
              <p>Almacenamos los IDs técnicos generados por Stripe (Customer ID y Subscription ID) vinculados al registro del Usuario. <strong>No almacenamos, procesamos ni tenemos acceso a números de tarjetas de crédito, CVV, fechas de expiración ni información bancaria.</strong> Toda la gestión financiera es delegada a Stripe, Inc., certificada PCI-DSS Nivel 1.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4 tracking-tight">4. Datos que NO Recopilamos</h2>
              <p className="mb-3">Para mayor claridad y transparencia, declaramos explícitamente que ZeroTrust Tech <strong>NO recopila</strong>:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>El contenido de ningún documento subido por el Usuario.</li>
                <li>Nombres completos, direcciones físicas ni números de identificación del Usuario.</li>
                <li>Información biométrica ni datos de geolocalización precisa.</li>
                <li>Historial de navegación, cookies de terceros ni identificadores publicitarios.</li>
                <li>Información de tarjetas de crédito ni datos financieros directos.</li>
                <li>Datos de menores de edad (el Servicio no está dirigido a menores de 18 años).</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4 tracking-tight">5. Base Legal del Tratamiento</h2>
              <p className="mb-3">El tratamiento de los datos personales descritos se fundamenta en las siguientes bases legales:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Ejecución contractual (Art. 6.1.b RGPD):</strong> El procesamiento de correo electrónico e IDs de Stripe es necesario para ejecutar el contrato de suscripción Enterprise.</li>
                <li><strong>Interés legítimo (Art. 6.1.f RGPD):</strong> El hashing de IP es necesario para prevenir el abuso de la plataforma y proteger la integridad del Servicio.</li>
                <li><strong>Consentimiento (Art. 6.1.a RGPD):</strong> Para cookies opcionales y comunicaciones de marketing, se solicita consentimiento expreso previo.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4 tracking-tight">6. Almacenamiento y Seguridad</h2>
              <p className="mb-3">Los datos operacionales se almacenan en Supabase (PostgreSQL gestionado) con las siguientes medidas de seguridad:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Row Level Security (RLS):</strong> Habilitado en todas las tablas. Solo el rol <code className="bg-slate-100 px-1.5 py-0.5 rounded text-sm">service_role</code> del servidor puede leer o escribir datos.</li>
                <li><strong>Cifrado en tránsito:</strong> Todas las comunicaciones utilizan TLS 1.3.</li>
                <li><strong>Cifrado en reposo:</strong> Los datos se almacenan en volúmenes cifrados con AES-256.</li>
                <li><strong>Verificación criptográfica de webhooks:</strong> Todos los eventos de Stripe se verifican mediante HMAC-SHA256 antes de ser procesados.</li>
                <li><strong>Separación de claves:</strong> Las claves sensibles (service_role, Stripe Secret Key) nunca se exponen al código del lado del cliente.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4 tracking-tight">7. Transferencias Internacionales</h2>
              <p>Los datos operacionales pueden ser procesados en servidores ubicados en Estados Unidos (Vercel, Stripe, Supabase). Estas transferencias se amparan en las Cláusulas Contractuales Tipo (SCCs) de la Comisión Europea y en la certificación del Marco de Privacidad de Datos UE-EE.UU. (EU-US Data Privacy Framework) de los proveedores involucrados.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4 tracking-tight">8. Períodos de Retención</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Hashes de IP (free_trials):</strong> Se conservan de forma indefinida para garantizar la integridad del mecanismo anti-abuso. Dado que son pseudonimizados e irreversibles, no se consideran datos personales identificables.</li>
                <li><strong>Datos de suscripción (users):</strong> Se conservan mientras la suscripción permanezca activa y durante 12 meses adicionales tras la cancelación para cumplir con obligaciones contables y fiscales.</li>
                <li><strong>Registros de logs del servidor:</strong> Se eliminan automáticamente tras 30 días.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4 tracking-tight">9. Derechos del Titular (ARCO+)</h2>
              <p className="mb-3">De conformidad con el RGPD, la LOPDP y normativas aplicables, usted tiene derecho a:</p>
              <ul className="list-disc pl-6 space-y-2 mb-3">
                <li><strong>Acceso:</strong> Solicitar una copia de los datos personales que mantenemos sobre usted.</li>
                <li><strong>Rectificación:</strong> Solicitar la corrección de datos inexactos o incompletos.</li>
                <li><strong>Supresión:</strong> Solicitar la eliminación de sus datos personales (&quot;derecho al olvido&quot;).</li>
                <li><strong>Oposición:</strong> Oponerse al tratamiento de sus datos personales.</li>
                <li><strong>Portabilidad:</strong> Solicitar la transferencia de sus datos a otro proveedor en formato estructurado.</li>
                <li><strong>Limitación:</strong> Solicitar la restricción temporal del procesamiento de sus datos.</li>
              </ul>
              <p>Para ejercer cualquiera de estos derechos, envíe un correo a <strong>legal@zerotrust-tech.com</strong> con el asunto &quot;Solicitud ARCO&quot;. Responderemos en un plazo máximo de 30 días naturales.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4 tracking-tight">10. Proveedores y Subencargados</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse mt-2">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th className="text-left py-3 px-4 font-bold text-slate-900">Proveedor</th>
                      <th className="text-left py-3 px-4 font-bold text-slate-900">Función</th>
                      <th className="text-left py-3 px-4 font-bold text-slate-900">Datos Accedidos</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <tr><td className="py-3 px-4">Stripe, Inc.</td><td className="py-3 px-4">Procesamiento de pagos</td><td className="py-3 px-4">Email, datos de tarjeta (gestionados por Stripe)</td></tr>
                    <tr><td className="py-3 px-4">Supabase, Inc.</td><td className="py-3 px-4">Base de datos operacional</td><td className="py-3 px-4">Hashes de IP, emails, IDs de Stripe</td></tr>
                    <tr><td className="py-3 px-4">Vercel, Inc.</td><td className="py-3 px-4">Hosting y CDN</td><td className="py-3 px-4">Logs de servidor (IP anonimizadas)</td></tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4 tracking-tight">11. Contacto del Delegado de Protección de Datos</h2>
              <p>Para cualquier consulta relacionada con la protección de datos personales, puede contactar a nuestro Delegado de Protección de Datos (DPO) en:</p>
              <ul className="list-disc pl-6 space-y-2 mt-3">
                <li><strong>Correo electrónico:</strong> legal@zerotrust-tech.com</li>
                <li><strong>Tiempo de respuesta:</strong> Máximo 30 días naturales</li>
              </ul>
            </section>

          </div>
        </div>

        <div className="mt-8 flex flex-wrap gap-4 justify-center">
          <Link href="/terms" className="text-sm font-semibold text-slate-500 hover:text-slate-900 transition-colors">Términos de Servicio →</Link>
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
