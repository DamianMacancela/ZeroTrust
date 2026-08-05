"use client";

import { useState } from 'react';
import Link from 'next/link';
import { ShieldCheck, Handshake, DollarSign, ArrowRight, Briefcase, Link as LinkIcon, Mail, User } from 'lucide-react';

export default function AffiliatesPage() {
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '593983476198';
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    linkedin: '',
    strategy: 'contactos'
  });

  const generateWhatsAppLink = () => {
    const text = `Hola Damian, quiero unirme al Programa de Afiliados Enterprise.%0A%0A*Mi Perfil:*%0A👤 Nombre: ${formData.name}%0A✉️ Email: ${formData.email}%0A🔗 LinkedIn/Web: ${formData.linkedin}%0A🎯 Estrategia: ${formData.strategy}%0A%0APor favor, envíame mi link de afiliado y el código de 30% de descuento para mi red.`;
    return `https://api.whatsapp.com/send?phone=${whatsappNumber}&text=${text}`;
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans selection:bg-blue-200">
      <nav className="border-b border-slate-200 bg-white/95 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="bg-slate-950 p-2.5 rounded-lg shadow-sm border border-slate-800 group-hover:bg-slate-900 transition-colors">
              <ShieldCheck className="h-6 w-6 text-white" />
            </div>
            <div>
              <span className="block font-bold text-xl tracking-tight text-slate-900 leading-none">ZeroTrust</span>
              <span className="block text-[10px] font-bold text-blue-600 uppercase tracking-widest mt-0.5">Partners Hub</span>
            </div>
          </Link>
          <a 
            href="#aplicar" 
            className="text-sm font-bold bg-slate-900 hover:bg-blue-600 text-white px-5 py-2.5 rounded-lg transition-all shadow-md hover:shadow-lg"
          >
            Aplicar Ahora
          </a>
        </div>
      </nav>
      
      <main>
        {/* Header Section */}
        <section className="max-w-7xl mx-auto px-4 pt-24 pb-16 relative">
          <div className="absolute top-0 inset-x-0 h-64 bg-gradient-to-b from-blue-50 to-transparent -z-10" />
          
          <div className="text-center max-w-4xl mx-auto mb-16">
            <div className="inline-flex items-center justify-center p-4 bg-blue-600/10 rounded-3xl mb-8">
              <Handshake className="w-12 h-12 text-blue-600" />
            </div>
            <h1 className="text-5xl md:text-7xl font-black mb-8 leading-[1.1] tracking-tight text-slate-950">
              Monetiza tu influencia en el sector <span className="text-blue-600">Legal y Médico</span>
            </h1>
            <p className="text-xl md:text-2xl text-slate-600 font-medium max-w-3xl mx-auto leading-relaxed">
              Únete al programa de Partners B2B de ZeroTrust Redact. Gana un <span className="font-bold text-slate-900 bg-emerald-100 px-2 py-1 rounded-md">30% de comisión recurrente ($90 USD)</span> por cada empresa que protejas con nuestra tecnología Zero-Data.
            </p>
          </div>
        </section>

        {/* Pasos Section */}
        <section className="bg-slate-950 text-white py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
          <div className="max-w-7xl mx-auto px-4 relative z-10">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-black mb-4">¿Cómo funciona el Partnership?</h2>
              <p className="text-slate-400 text-lg max-w-2xl mx-auto">Un proceso transparente, diseñado para profesionales que recomiendan software de alto nivel.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-8 rounded-3xl hover:bg-white/10 transition-colors">
                <div className="w-14 h-14 bg-blue-500/20 text-blue-400 flex items-center justify-center rounded-2xl font-black text-2xl mb-6 border border-blue-500/30">1</div>
                <h3 className="text-xl font-bold mb-4">Postula tu Perfil</h3>
                <p className="text-slate-400 leading-relaxed">Llena el formulario abajo. Buscamos abogados, consultores TI y expertos en cumplimiento que tengan acceso a tomadores de decisiones.</p>
              </div>
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-8 rounded-3xl hover:bg-white/10 transition-colors">
                <div className="w-14 h-14 bg-emerald-500/20 text-emerald-400 flex items-center justify-center rounded-2xl font-black text-2xl mb-6 border border-emerald-500/30">2</div>
                <h3 className="text-xl font-bold mb-4">Recibe tus Enlaces</h3>
                <p className="text-slate-400 leading-relaxed">Te daremos acceso a nuestro portal (vía Lemon Squeezy) con tu link de afiliado único y materiales de marketing profesionales.</p>
              </div>
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-8 rounded-3xl hover:bg-white/10 transition-colors">
                <div className="w-14 h-14 bg-purple-500/20 text-purple-400 flex items-center justify-center rounded-2xl font-black text-2xl mb-6 border border-purple-500/30">3</div>
                <h3 className="text-xl font-bold mb-4">Comisiones Automáticas</h3>
                <p className="text-slate-400 leading-relaxed">Cobra el 30% directamente en tu cuenta bancaria o PayPal. El sistema rastrea las cookies por 60 días para garantizar tu venta.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Application Form Section */}
        <section id="aplicar" className="py-24 max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
            <div className="bg-blue-600 p-8 md:p-12 text-center">
              <DollarSign className="w-16 h-16 text-emerald-300 mx-auto mb-4" />
              <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
                Formulario de Postulación
              </h2>
              <p className="text-blue-100 text-lg max-w-2xl mx-auto">
                Las aplicaciones se revisan en menos de 24 horas por nuestro fundador. 
              </p>
            </div>
            
            <div className="p-8 md:p-12">
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Nombre Completo</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User className="h-5 w-5 text-slate-400" />
                      </div>
                      <input 
                        type="text" 
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="block w-full pl-10 rounded-xl border-slate-300 py-3 text-slate-900 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-slate-50" 
                        placeholder="Ej. Juan Pérez"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Correo Profesional</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-slate-400" />
                      </div>
                      <input 
                        type="email" 
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="block w-full pl-10 rounded-xl border-slate-300 py-3 text-slate-900 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-slate-50" 
                        placeholder="juan@consultora.com"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Perfil de LinkedIn o Sitio Web</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <LinkIcon className="h-5 w-5 text-slate-400" />
                    </div>
                    <input 
                      type="url" 
                      required
                      value={formData.linkedin}
                      onChange={(e) => setFormData({...formData, linkedin: e.target.value})}
                      className="block w-full pl-10 rounded-xl border-slate-300 py-3 text-slate-900 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-slate-50" 
                      placeholder="https://linkedin.com/in/tu-perfil"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">¿Cómo planeas promocionar ZeroTrust?</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Briefcase className="h-5 w-5 text-slate-400" />
                    </div>
                    <select 
                      value={formData.strategy}
                      onChange={(e) => setFormData({...formData, strategy: e.target.value})}
                      className="block w-full pl-10 rounded-xl border-slate-300 py-3 text-slate-900 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-slate-50 font-medium"
                    >
                      <option value="Red de Contactos B2B (Directo)">Red de Contactos B2B Directa</option>
                      <option value="Agencia de Marketing / Creador de Contenido">Creador de Contenido / Blog</option>
                      <option value="Consultoría de Seguridad / Legal">Consultoría TI o Legal</option>
                      <option value="Boletín / Newsletter">Newsletter (Email Marketing)</option>
                    </select>
                  </div>
                </div>

                <div className="pt-6">
                  <a 
                    href={generateWhatsAppLink()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex w-full justify-center items-center gap-2 rounded-xl bg-[#25D366] px-3 py-4 text-lg font-black text-white shadow-lg hover:bg-[#1DA851] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#25D366] transition-all hover:-translate-y-1"
                  >
                    Enviar Aplicación por WhatsApp <ArrowRight className="w-6 h-6" />
                  </a>
                  <p className="text-center text-xs text-slate-500 mt-4">
                    Al enviar, se abrirá WhatsApp para contactar directamente a la gerencia. No almacenamos estos datos en nuestros servidores hasta tu aprobación final.
                  </p>
                </div>
              </form>
            </div>
          </div>
        </section>
        
      </main>
    </div>
  );
}
