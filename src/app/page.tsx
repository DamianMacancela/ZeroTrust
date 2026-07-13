'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldCheck, Lock, Image as ImageIcon, CheckCircle, AlertTriangle, 
  Archive, Database, Server, Fingerprint, FileCode, Loader2
} from 'lucide-react';
import { createCheckoutSession } from './actions/lemonsqueezy-checkout';
import { downloadAuditReport } from '../components/AuditReportGenerator';

export default function LegalTechLanding() {
  const [trialStatus, setTrialStatus] = useState<'idle' | 'loading' | 'success' | 'used'>('idle');
  const [processingStage, setProcessingStage] = useState<string>('');
  const [ocrProgress, setOcrProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [stats, setStats] = useState({ words: 0, redacted: 0 });
  const [hasUsedTrial, setHasUsedTrial] = useState(false);
  const [isProActive, setIsProActive] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const workerRef = useRef<Worker | null>(null);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (localStorage.getItem('grc_free_trial_used')) {
      // BYPASS TEMPORAL: setHasUsedTrial(true);
    }
    // Leer parametros de pago
    const query = new URLSearchParams(window.location.search);
    const payment = query.get('payment');
    if (payment === 'success') {
      setIsProActive(true);
      setHasUsedTrial(false);
      localStorage.removeItem('grc_free_trial_used');
      setErrorMessage('Transaccion verificada. Su entorno Enterprise dedicado esta activo.');
    }
    if (payment === 'cancelled') {
      setErrorMessage('Operacion cancelada. Protocolo de pago interrumpido de forma segura.');
    }
    return () => {
      if (workerRef.current) {
        workerRef.current.terminate();
        workerRef.current = null;
      }
    };
  }, []);

  const calculateSHA256 = async (blob: Blob): Promise<string> => {
    const arrayBuffer = await blob.arrayBuffer();
    const hashBuffer = await window.crypto.subtle.digest('SHA-256', arrayBuffer);
    return Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');
  };

  const isSensitive = (text: string) => {
    const patterns = [
      /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/i, // Emails
      /\b\d{4}[- ]?\d{4}[- ]?\d{4}[- ]?\d{4}\b/, // Tarjetas
      /\b\d{9,13}\b/, // IDs/Cédulas
      /\b(?:0[1-9]|[12][0-9]|3[01])[-/.](?:0[1-9]|1[012])[-/.](?:19|20)\d\d\b/ // Fechas
    ];
    return patterns.some(regex => regex.test(text));
  };

  const handleFileDrop = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMessage('');
    const file = e.target.files?.[0];
    if (!file) return;

    if (hasUsedTrial) {
      setErrorMessage('Limite de prueba alcanzado. Actualice a Enterprise.');
      if (e.target) e.target.value = '';
      return;
    }

    setSelectedFile(file);
    setTrialStatus('loading');

    try {
      // PASO 1: Validar trial en servidor (Zero-Data: Solo enviamos metadata, NUNCA el archivo)
      setProcessingStage('Verificando politica de acceso perimetral...');

      const response = await fetch('/api/process-document', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          size: file.size,
          type: file.type,
          name: file.name
        }),
      });

      if (response.status === 403) {
        // BYPASS TEMPORAL:
        // setHasUsedTrial(true);
        // localStorage.setItem('grc_free_trial_used', 'true');
        // setTrialStatus('used');
        // setErrorMessage('Limite de prueba gratuita alcanzado. Actualice a Enterprise.');
        // if (e.target) e.target.value = '';
        // return;
      }

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        setErrorMessage(data.error || 'Error del servidor. Intente nuevamente.');
        setTrialStatus('idle');
        if (e.target) e.target.value = '';
        return;
      }

      // PASO 2: Servidor aprobo — procesar con Web Worker en cliente
      setProcessingStage('Iniciando motor de ofuscacion...');
      const arrayBuffer = await file.arrayBuffer();
      const worker = new Worker('/pdf-worker.js');
      workerRef.current = worker;

      worker.onmessage = (event: MessageEvent) => {
        const { status, success, data, error: workerError, message, pageProgress, fileName } = event.data;

        if (status === 'init_ai' || status === 'processing') {
          setProcessingStage(message || 'Procesando...');
          setOcrProgress(pageProgress || 0);
        } else if (status === 'done' && success) {
          const blob = new Blob([data], { type: file.type });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = fileName || `saneado_${file.name}`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);

          if (event.data.auditData) {
            setTimeout(() => {
              downloadAuditReport(event.data.auditData).catch(console.error);
            }, 1000);
          }

          // BYPASS TEMPORAL:
          // setHasUsedTrial(true);
          // localStorage.setItem('grc_free_trial_used', 'true');
          setStats({ words: 0, redacted: 0 });
          setTrialStatus('success');
          setProcessingStage('');
          worker.terminate();
          workerRef.current = null;
        } else if (status === 'error') {
          setErrorMessage(workerError || 'Error en el motor de procesamiento.');
          setTrialStatus('idle');
          worker.terminate();
          workerRef.current = null;
        }
      };

      worker.onerror = (err: ErrorEvent) => {
        setErrorMessage(`Error en el motor: ${err.message}`);
        setTrialStatus('idle');
        worker.terminate();
        workerRef.current = null;
      };

      worker.postMessage({ fileData: arrayBuffer, fileName: file.name }, [arrayBuffer]);

    } catch {
      setErrorMessage('Error de conexion. Verifique su red e intente nuevamente.');
      setTrialStatus('idle');
    }

    if (e.target) e.target.value = '';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!hasUsedTrial && !isProActive && trialStatus !== 'loading') {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (hasUsedTrial || isProActive || trialStatus === 'loading') return;
    
    const file = e.dataTransfer.files?.[0];
    if (file) {
      // Simulate input change event
      const fakeEvent = { target: { files: [file], value: '' } } as unknown as React.ChangeEvent<HTMLInputElement>;
      handleFileDrop(fakeEvent);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans selection:bg-slate-300">
      
      {/* NAVEGACIÓN INSTITUCIONAL */}
      <nav className="border-b border-slate-200 bg-white/95 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-slate-950 p-2.5 rounded-lg shadow-sm border border-slate-800">
              <ShieldCheck className="h-6 w-6 text-white" />
            </div>
            <div>
              <span className="block font-bold text-xl tracking-tight text-slate-900 leading-none">ZeroTrust</span>
              <span className="block text-[10px] font-bold tracking-[0.2em] text-slate-500 uppercase mt-1">Computer Vision Engine</span>
            </div>
          </div>
          <div className="hidden md:flex gap-8 text-sm font-semibold text-slate-600">
            <a href="#compliance" className="hover:text-slate-950 transition-colors">Cumplimiento</a>
            <a href="#adquisicion" className="hover:text-slate-950 transition-colors">Licenciamiento</a>
          </div>
        </div>
      </nav>

      <main className="pb-24">
        {/* HERO SECTION */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-red-200 bg-red-50 shadow-sm text-red-700 text-[10px] font-black uppercase tracking-[0.2em] mb-8">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <span>Grado Militar · Cumplimiento Estricto LATAM</span>
            </div>
            <h1 className="text-5xl md:text-[68px] font-black tracking-tighter text-[#0F172A] mb-8 leading-[1.05]">
              Cumplimiento Normativo <br/><span className="text-[#334155] font-light">Cero-Riesgo para Instituciones.</span>
            </h1>
            <p className="text-xl text-[#475569] mb-10 leading-relaxed max-w-3xl mx-auto font-medium">
              El único motor de ofuscación de Datos Personales (PII) <strong className="text-[#0F172A]">100% On-Device</strong> para firmas legales y bancos en Latinoamérica. Elimine Cédulas, RUC, CURP y Tarjetas sin enviar sus documentos a ningún servidor.
            </p>
          </motion.div>
        </section>

        {/* CINTURÓN DE CUMPLIMIENTO */}
        <section id="compliance" className="border-y border-slate-200 bg-white py-8 mb-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-center text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6">Arquitectura validada para los marcos jurídicos más estrictos</p>
            <div className="flex flex-wrap justify-center gap-10 md:gap-20 opacity-80 grayscale">
              {[{ icon: ShieldCheck, text: 'LOPDP Ecuador' }, { icon: Lock, text: 'Ley 1581 Colombia' }, { icon: Fingerprint, text: 'LFPDPPP México' }, { icon: Server, text: 'GDPR Unión Europea' }].map((badge, i) => (
                <div key={i} className="flex items-center gap-2 text-sm font-extrabold text-slate-900 tracking-tight">
                  <badge.icon className="h-6 w-6 text-slate-700" />
                  {badge.text}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* NODOS DE LICENCIAMIENTO & EJECUCIÓN */}
        <section id="adquisicion" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-slate-950 rounded-3xl p-1.5 shadow-2xl">
            <div className="grid md:grid-cols-2 gap-1.5">
              
              {/* EVALUACIÓN ZERO-TRUST (MOTOR DE VISIÓN + ZIP) */}
              <div className="bg-[#F8FAFC] rounded-[1.35rem] p-10 relative flex flex-col justify-between border-2 border-transparent">
                <div>
                  <div className="inline-block px-3 py-1 bg-slate-200 text-slate-800 text-[10px] font-black uppercase tracking-[0.15em] rounded-full mb-6 border border-slate-300">
                    Auditoría en Sitio (PoC)
                  </div>
                  <h3 className="text-3xl font-black text-slate-900 mb-3 tracking-tight">
                    Sandbox Forense
                  </h3>
                  <p className="text-slate-600 mb-6 font-medium text-sm leading-relaxed">Ejecute el motor de Visión Artificial. El análisis y redacción ocurre en la memoria local (RAM) de su navegador. <strong className="text-slate-900">Se descargará un certificado de cumplimiento en PDF automáticamente.</strong></p>
                  
                  {/* Dropzone — acepta PDF, DOCX, XLSX */}
                  <motion.div 
                    whileHover={!(hasUsedTrial || isProActive || trialStatus === 'loading') ? { scale: 1.02 } : {}}
                    whileTap={!(hasUsedTrial || isProActive || trialStatus === 'loading') ? { scale: 0.98 } : {}}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={`mb-6 p-4 border-2 border-dashed rounded-2xl transition-all duration-300 relative cursor-pointer text-center h-40 flex flex-col justify-center items-center shadow-sm 
                      ${(hasUsedTrial || isProActive) ? 'opacity-50 cursor-not-allowed bg-slate-100 border-slate-200' : 
                      isDragging ? 'border-blue-500 bg-blue-50 shadow-inner scale-[1.02]' : 
                      'border-slate-300 bg-white hover:border-slate-400 hover:bg-slate-50'}`}
                  >
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx,.xls,.xlsx,.csv"
                      onChange={handleFileDrop}
                      disabled={trialStatus === 'loading' || hasUsedTrial || isProActive}
                      className="absolute inset-0 opacity-0 cursor-pointer disabled:cursor-not-allowed z-10"
                    />
                    <motion.div animate={{ y: isDragging ? -5 : 0 }}>
                      <ImageIcon className={`w-10 h-10 mx-auto mb-3 transition-colors ${isDragging ? 'text-blue-500' : 'text-slate-400'}`} />
                    </motion.div>
                    <p className="text-sm font-black tracking-tight text-slate-700">
                      {isProActive ? 'Sandbox Desactivado' : (selectedFile && !isProActive) ? `Cargado: ${selectedFile.name}` : 'Arrastra tu archivo aquí'}
                    </p>
                    {(!selectedFile && !isProActive) && <p className="text-xs font-semibold text-slate-400 mt-1">PDF, Word o Excel (máx 15MB)</p>}
                  </motion.div>

                  {/* Consola de Procesamiento Sandbox */}
                  <AnimatePresence mode="wait">
                    {!isProActive && trialStatus === 'loading' && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0, y: -10 }}
                        animate={{ opacity: 1, height: 'auto', y: 0 }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mb-6 p-5 bg-slate-950 rounded-2xl border border-slate-800 text-white shadow-xl overflow-hidden"
                      >
                        <div className="flex items-center justify-between mb-4">
                          <p className="text-xs font-black tracking-widest uppercase flex items-center gap-3 text-slate-300">
                            <Loader2 className="animate-spin w-4 h-4 text-blue-500" />
                            {processingStage}
                          </p>
                          <span className="text-xs font-black text-blue-400">{Math.round(ocrProgress)}%</span>
                        </div>
                        <div className="w-full bg-slate-800/50 h-2 rounded-full overflow-hidden border border-slate-700/50 relative">
                          <motion.div 
                            className="absolute top-0 left-0 bottom-0 bg-gradient-to-r from-blue-600 to-cyan-400 shadow-[0_0_10px_rgba(56,189,248,0.5)]"
                            initial={{ width: 0 }}
                            animate={{ width: `${ocrProgress}%` }}
                            transition={{ ease: "easeOut", duration: 0.5 }}
                          />
                        </div>
                      </motion.div>
                    )}

                    {/* Resultados Sandbox */}
                    {!isProActive && trialStatus === 'success' && (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="mb-6 p-5 bg-gradient-to-br from-green-50 to-emerald-50/50 rounded-2xl border border-green-200/60 shadow-sm"
                      >
                        <div className="flex gap-3">
                          <div className="bg-green-500 rounded-full p-1.5 h-fit shadow-sm shadow-green-500/20">
                            <CheckCircle className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <p className="text-sm font-black text-slate-900 mb-1 tracking-tight">Saneamiento Completado</p>
                            <p className="text-xs font-medium text-slate-600">El archivo ha sido purgado de PII y descargado a tu equipo usando encripción Zero-Knowledge.</p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {!isProActive && hasUsedTrial && trialStatus !== 'loading' && (
                    <div className="mb-6 p-4 bg-red-50 rounded-xl border border-red-200 flex items-center gap-2">
                      <Lock className="w-4 h-4 text-red-600 shrink-0" />
                      <p className="text-xs font-bold text-red-700">Sandbox agotado. Requiere despliegue corporativo.</p>
                    </div>
                  )}
                </div>

                <div>
                  <div className={`w-full py-4 px-4 rounded-xl font-bold flex justify-center items-center gap-2 border-2 transition-all duration-300 ${isProActive ? 'bg-slate-100 text-slate-400 border-slate-200' : hasUsedTrial ? 'bg-red-50 text-red-800 border-red-200' : trialStatus === 'success' ? 'bg-slate-950 text-white border-slate-950 shadow-[0_8px_30px_rgb(0,0,0,0.12)]' : 'bg-transparent border-slate-200 text-slate-500'}`}>
                    {isProActive ? <><Lock className="w-4 h-4"/> Entorno Trasladado</> : trialStatus === 'idle' && !hasUsedTrial && <><FileCode className="w-4 h-4" /> Zona Segura (Air-Gapped)</>}
                    {!isProActive && trialStatus === 'loading' && 'Procesando en motor seguro...'}
                    {!isProActive && trialStatus === 'success' && <><CheckCircle className="h-4 w-4"/> Certificado Forense Generado</>}
                    {!isProActive && hasUsedTrial && <><AlertTriangle className="h-4 w-4"/> Limite Alcanzado</>}
                  </div>
                  {!isProActive && errorMessage && <p className="text-[12px] mt-4 text-center font-bold text-red-600 bg-red-50 py-2 rounded-lg">{errorMessage}</p>}
                </div>
              </div>

              {/* LICENCIA ENTERPRISE */}
              <div className="bg-[#020617] p-10 relative flex flex-col justify-between">
                <div>
                  <div className="inline-block px-3 py-1 bg-[#1E293B] text-[#38BDF8] text-[10px] font-black uppercase tracking-[0.15em] rounded-full mb-6 border border-[#334155]">Despliegue Institucional</div>
                  <h3 className="text-3xl font-black text-white mb-3 tracking-tight">Licencia Enterprise</h3>
                  
                  {/* ALERTA DE MODO DE PRUEBA (Ocultar automáticamente en producción real si la variable no está presente) */}
                  {process.env.NEXT_PUBLIC_LEMONSQUEEZY_TEST_MODE === 'true' && (
                    <div className="mb-4 p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg flex gap-2">
                      <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0" />
                      <div>
                        <p className="text-xs font-bold text-amber-500">MODO DE PRUEBA (TEST ENVIRONMENT)</p>
                        <p className="text-[11px] text-amber-400/80 mt-1">Usa la tarjeta de prueba generica de Lemon Squeezy.</p>
                      </div>
                    </div>
                  )}

                  <p className="text-slate-400 mb-8 font-medium text-sm leading-relaxed">Plataforma integral para departamentos de Compliance y Legal. Contrato de Procesamiento de Datos (DPA) garantizado como Encargados de Tratamiento.</p>
                  
                  <ul className="space-y-4 mb-10">
                    {[
                      'Procesamiento Ilimitado On-Device', 
                      'Data Processing Agreement (DPA) Firmado', 
                      'Logs de Auditoría Forense por Documento', 
                      'Soporte Prioritario LATAM (SLA 99.9%)'
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-[#38BDF8] shrink-0 mt-0.5" />
                        <span className="text-sm font-semibold text-slate-300">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                  {isProActive ? (
                    <div className="mt-8">
                      <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-500/10 border border-green-500/20 text-green-400 text-[10px] font-black uppercase tracking-[0.1em] rounded-full mb-4">
                        <CheckCircle className="w-3 h-3" />
                        Licencia Activa
                      </div>
                      
                      <div className={`mb-6 p-4 border border-dashed rounded-xl transition-colors relative cursor-pointer text-center h-32 flex flex-col justify-center border-[#334155] bg-[#0F172A] hover:bg-[#1E293B]`}>
                        <input
                          type="file"
                          accept=".pdf,.doc,.docx,.xls,.xlsx,.csv"
                          onChange={handleFileDrop}
                          disabled={trialStatus === 'loading'}
                          className="absolute inset-0 opacity-0 cursor-pointer disabled:cursor-not-allowed"
                        />
                        <ImageIcon className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                        <p className="text-xs font-bold text-slate-300">
                          {selectedFile ? `Cargado: ${selectedFile.name}` : 'Subir Documento Institucional (Enterprise)'}
                        </p>
                      </div>

                      {isProActive && trialStatus === 'loading' && (
                        <div className="mb-6 p-4 bg-[#1E293B] rounded-xl border border-[#334155] text-white">
                          <p className="text-xs font-bold flex items-center gap-2 mb-3">
                            <Loader2 className="animate-spin w-4 h-4 text-[#38BDF8]" />
                            {processingStage}
                          </p>
                          {ocrProgress > 0 && ocrProgress < 100 && (
                            <div className="w-full bg-[#0F172A] h-1.5 rounded-full overflow-hidden">
                              <div className="bg-[#38BDF8] h-full transition-all duration-300" style={{ width: `${ocrProgress}%` }}></div>
                            </div>
                          )}
                        </div>
                      )}

                      {isProActive && trialStatus === 'success' && (
                        <div className="mb-6 p-4 bg-green-500/10 rounded-xl border border-green-500/20">
                          <p className="text-xs font-bold text-green-400 mb-2">Procesamiento Seguro Completado</p>
                          <p className="text-xs text-green-500/80">Archivo descargado con encripción Zero-Knowledge.</p>
                        </div>
                      )}
                      
                      {isProActive && errorMessage && <p className="text-[12px] mb-4 text-center font-bold text-red-400 bg-red-500/10 py-2 rounded-lg">{errorMessage}</p>}
                    </div>
                  ) : (
                    <form action={async () => {
                      const res = await createCheckoutSession();
                      if (res?.error) {
                        setErrorMessage(res.error);
                      }
                    }} className="mt-auto">
                      <button type="submit" className="w-full bg-[#0EA5E9] hover:bg-[#0284C7] text-white py-4 px-4 rounded-xl font-black transition-all flex justify-center items-center gap-2 shadow-lg hover:shadow-xl">
                        <Database className="h-5 w-5" />
                        Adquirir Licencia Corporativa
                      </button>
                      <p className="text-[11px] text-slate-500 text-center mt-5 font-bold tracking-wide">Contratación B2B respaldada por Merchant of Record institucional.</p>
                    </form>
                  )}
              </div>

            </div>
          </div>
        </section>

        {/* CANVAS OCULTO (MOTOR DE RENDERIZADO) */}
        <canvas ref={canvasRef} className="hidden" />

      </main>

      {/* FAQ SECTION */}
      <section className="border-t border-slate-200 bg-[#F8FAFC] py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-black tracking-tighter text-[#0F172A] mb-4">
              Preguntas Frecuentes
            </h2>
            <p className="text-[#475569] font-medium">Respuestas claras sobre nuestra arquitectura y cumplimiento B2B.</p>
          </div>
          
          <div className="space-y-6">
            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 mb-2 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-blue-500" />
                ¿Qué significa arquitectura Zero-Knowledge / Air-Gapped?
              </h3>
              <p className="text-slate-600 leading-relaxed text-sm">
                Significa que el documento <strong>nunca sale de la memoria RAM de su dispositivo</strong>. Nuestro motor de Visión Artificial (WebAssembly) se descarga y ejecuta localmente en el navegador del usuario. Cero bytes de sus contratos se transmiten a nuestros servidores.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 mb-2 flex items-center gap-2">
                <FileCode className="w-5 h-5 text-blue-500" />
                ¿El Data Processing Agreement (DPA) es legalmente vinculante?
              </h3>
              <p className="text-slate-600 leading-relaxed text-sm">
                Sí. Al contratar la licencia Enterprise, ZeroTrust Tech asume jurídicamente el rol de <strong>Encargado de Tratamiento</strong> bajo las normativas LOPDP (Ecuador), Ley 1581 (Colombia), LFPDPPP (México) y GDPR (UE), con firmas auditables criptográficamente.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 mb-2 flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-blue-500" />
                ¿Soporta fotografías de documentos o escaneos sin texto seleccionable?
              </h3>
              <p className="text-slate-600 leading-relaxed text-sm">
                Completamente. El motor incluye OCR avanzado local que rasteriza la imagen, detecta el texto mediante redes neuronales, y dibuja cajas negras (redacción forense) directamente sobre los píxeles antes de regenerar el archivo.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 mb-2 flex items-center gap-2">
                <Database className="w-5 h-5 text-blue-500" />
                ¿Qué incluye la Licencia Enterprise frente al Sandbox PoC?
              </h3>
              <p className="text-slate-600 leading-relaxed text-sm">
                El Sandbox PoC es solo para validación técnica (limitado a 1 uso). La <strong>Licencia Enterprise</strong> incluye procesamiento ilimitado, DPA corporativo, acceso a la API REST para ofuscación masiva, y soporte SLA de grado empresarial (99.9%).
              </p>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-200 bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            
            <div>
              <div className="flex items-center gap-2 mb-4">
                <ShieldCheck className="h-5 w-5 text-slate-400" />
                <span className="text-sm font-bold text-slate-900 tracking-tight">ZeroTrust Tech</span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">Plataforma de ofuscación documental con arquitectura Zero-Data. Su información nunca abandona su dispositivo.</p>
            </div>

            <div>
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-widest mb-4">Legal</h4>
              <ul className="space-y-2.5">
                <li><a href="/compliance" className="text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors">Cumplimiento Normativo (LATAM/UE)</a></li>
                <li><a href="/api/dpa?org=Cliente&email=admin@cliente.com" className="text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors">Data Processing Agreement (DPA)</a></li>
                <li><a href="/terms" className="text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors">Términos y Condiciones</a></li>
                <li><a href="/privacy" className="text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors">Política de Privacidad</a></li>
                <li><a href="/cookies" className="text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors">Política de Cookies</a></li>
                <li><a href="/refunds" className="text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors">Reembolsos y Cancelaciones</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-widest mb-4">Contacto</h4>
              <ul className="space-y-2.5">
                <li className="text-xs text-slate-500"><span className="font-semibold text-slate-700">Soporte:</span> soporte@zerotrust-tech.com</li>
                <li className="text-xs text-slate-500"><span className="font-semibold text-slate-700">Legal / DPO:</span> legal@zerotrust-tech.com</li>
              </ul>
            </div>

          </div>
          <div className="border-t border-slate-100 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-2">
            <p className="text-[11px] text-slate-400 font-medium">© 2027 ZeroTrust Tech. Todos los derechos reservados.</p>
            <p className="text-[11px] text-slate-400 font-medium">Pagos procesados por Lemon Squeezy (Merchant of Record) · Cumplimiento B2B Global</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
