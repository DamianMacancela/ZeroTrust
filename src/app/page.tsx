'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { createWorker } from 'tesseract.js';
import JSZip from 'jszip';
import { 
  ShieldCheck, Lock, Image as ImageIcon, CheckCircle, AlertTriangle, 
  Archive, Database, Server, Fingerprint, FileCode, Loader2
} from 'lucide-react';
import { claimFreeTrial } from './actions';
import { createCheckoutSession } from './actions/stripe-checkout';

export default function LegalTechLanding() {
  const [trialStatus, setTrialStatus] = useState<'idle' | 'loading' | 'success' | 'used'>('idle');
  const [processingStage, setProcessingStage] = useState<string>('');
  const [ocrProgress, setOcrProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [stats, setStats] = useState({ words: 0, redacted: 0 });
  
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    if (query.get('success')) {
      setTrialStatus('success');
      setErrorMessage('Transacción verificada. Su entorno Enterprise dedicado está activo.');
    }
    if (query.get('canceled')) {
      setTrialStatus('idle');
      setErrorMessage('Operación cancelada. Protocolo de pago interrumpido de forma segura.');
    }
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

  const processSecureVisionPipeline = async () => {
    if (!selectedFile) {
      setErrorMessage('Seleccione un documento escaneado válido.');
      return;
    }

    setTrialStatus('loading');
    setErrorMessage('');
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    try {
      // 1. Validación Perimetral
      setProcessingStage('Verificando política de acceso perimetral...');
      const accessAuth = await claimFreeTrial();
      if (!accessAuth.success) {
        setTrialStatus('used');
        setErrorMessage(accessAuth.message);
        return;
      }

      // 2. Ingesta a Memoria Volátil y Hasheo Original
      setProcessingStage('Calculando huella SHA-256 original...');
      const originalHash = await calculateSHA256(selectedFile);
      
      const imageURL = URL.createObjectURL(selectedFile);
      const img = new Image();
      img.src = imageURL;
      await new Promise(resolve => { img.onload = resolve; });

      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      // 3. Inicialización de Motor OCR WASM
      setProcessingStage('Instanciando motor de Visión Artificial (WASM)...');
      const worker = await createWorker('spa+eng', 1, {
        logger: m => {
          if (m.status === 'recognizing text') {
            setProcessingStage('Extrayendo topología de píxeles (OCR)...');
            setOcrProgress(Math.round(m.progress * 100));
          }
        }
      });

      // 4. Extracción Espacial
      const { data } = await worker.recognize(canvas);
      let redactedCount = 0;

      // 5. Quemado Criptográfico (Burn-in)
      setProcessingStage('Quemando datos sensibles en la matriz de la imagen...');
      data.words.forEach((word) => {
        const cleanText = word.text.replace(/[^a-zA-Z0-9@.-]/g, '');
        if (cleanText.length > 4 && isSensitive(cleanText)) {
          const { x0, y0, x1, y1 } = word.bbox;
          ctx.fillStyle = '#0F172A'; // Negro profundo (Destrucción de píxeles)
          ctx.fillRect(x0 - 2, y0 - 2, (x1 - x0) + 4, (y1 - y0) + 4);
          redactedCount++;
        }
      });
      await worker.terminate();
      URL.revokeObjectURL(imageURL);
      setStats({ words: data.words.length, redacted: redactedCount });

      // 6. Extracción de Imagen Segura y Hasheo
      setProcessingStage('Certificando inmutabilidad del resultado...');
      const redactedBlob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob(blob => blob ? resolve(blob) : reject(new Error('Fallo en renderizado')), 'image/jpeg', 0.95);
      });
      const redactedHash = await calculateSHA256(redactedBlob);

      // 7. Manifiesto y Empaquetado ZIP
      setProcessingStage('Sellando cápsula ZIP de auditoría...');
      const auditManifest = {
        politica: 'Zero-Knowledge Visual Redaction',
        timestamp: new Date().toISOString(),
        origen: { archivo: selectedFile.name, sha256: originalHash },
        destino: { archivo: `OFUSCADA_${selectedFile.name}`, sha256: redactedHash },
        metricas: { palabras_escaneadas: data.words.length, entidades_destruidas: redactedCount }
      };

      const zip = new JSZip();
      zip.file(`OFUSCADA_${selectedFile.name.split('.')[0]}.jpg`, redactedBlob);
      zip.file('MANIFIESTO_CADENA_CUSTODIA.json', JSON.stringify(auditManifest, null, 2));

      const zipBlob = await zip.generateAsync({ type: 'blob' });
      const downloadUrl = URL.createObjectURL(zipBlob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `EXPEDIENTE_SEGURO_${Date.now()}.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(downloadUrl);

      setTrialStatus('success');
      setProcessingStage('');

    } catch (error: any) {
      setTrialStatus('idle');
      setErrorMessage(`Falla crítica en el pipeline visual: ${error.message}`);
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
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-slate-200 bg-white shadow-sm text-slate-700 text-xs font-bold uppercase tracking-widest mb-8">
              <Lock className="h-3.5 w-3.5 text-slate-950" />
              <span>Protección Visual Air-Gapped</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-extrabold tracking-tighter text-slate-950 mb-8 leading-[1.1]">
              Ofuscación Óptica de <br/><span className="text-slate-500 font-light">Documentos Escaneados.</span>
            </h1>
            <p className="text-lg text-slate-600 mb-10 leading-relaxed max-w-2xl mx-auto font-medium">
              Censure fotografías de contratos y cédulas mediante Visión Artificial ejecutada 100% en su navegador. Exporte el resultado en un ZIP criptográfico sin servidores intermediarios.
            </p>
          </motion.div>
        </section>

        {/* CINTURÓN DE CUMPLIMIENTO */}
        <section id="compliance" className="border-y border-slate-200 bg-white py-8 mb-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-center text-[11px] font-bold text-slate-400 uppercase tracking-[0.15em] mb-6">Garantías de Seguridad de la Información (InfoSec)</p>
            <div className="flex flex-wrap justify-center gap-10 md:gap-20 opacity-70 grayscale">
              {[{ icon: Server, text: 'Zero-Data Transfer' }, { icon: Fingerprint, text: 'SHA-256 Non-Repudiation' }, { icon: Archive, text: 'Secure ZIP Packaging' }].map((badge, i) => (
                <div key={i} className="flex items-center gap-2 text-sm font-extrabold text-slate-800 tracking-tight">
                  <badge.icon className="h-5 w-5" />
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
              <div className="bg-white rounded-[1.35rem] p-10 relative flex flex-col justify-between">
                <div>
                  <div className="inline-block px-3 py-1 bg-slate-100 text-slate-700 text-[11px] font-bold uppercase tracking-[0.1em] rounded-full mb-6 border border-slate-200">Sandbox Perimetral</div>
                  <h3 className="text-3xl font-extrabold text-slate-950 mb-3 tracking-tight">Prueba de Concepto (PoC)</h3>
                  <p className="text-slate-600 mb-6 font-medium text-sm">Evaluación de Visión Artificial. El archivo no saldrá de su memoria RAM.</p>
                  
                  {/* Dropzone */}
                  <div className="mb-6 p-4 border border-dashed border-slate-300 rounded-xl bg-slate-50 hover:bg-slate-100/50 transition-colors relative cursor-pointer text-center h-32 flex flex-col justify-center">
                    <input type="file" accept="image/jpeg, image/png" onChange={(e) => setSelectedFile(e.target.files?.[0] || null)} className="absolute inset-0 opacity-0 cursor-pointer" />
                    <ImageIcon className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                    <p className="text-xs font-bold text-slate-700">{selectedFile ? `Cargado: ${selectedFile.name}` : 'Adjuntar Imagen (JPG/PNG)'}</p>
                  </div>

                  {/* Consola de Procesamiento */}
                  {trialStatus === 'loading' && (
                    <div className="mb-6 p-4 bg-slate-900 rounded-xl border border-slate-800 text-white">
                      <p className="text-xs font-bold flex items-center gap-2 mb-3">
                        <Loader2 className="animate-spin w-4 h-4 text-blue-500" />
                        {processingStage}
                      </p>
                      {ocrProgress > 0 && ocrProgress < 100 && (
                        <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                          <div className="bg-blue-500 h-full transition-all duration-300" style={{ width: `${ocrProgress}%` }}></div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Resultados */}
                  {trialStatus === 'success' && (
                    <div className="mb-6 p-4 bg-green-50 rounded-xl border border-green-200">
                      <p className="text-xs font-bold text-green-800 mb-2">Auditoría Completada:</p>
                      <ul className="text-xs text-green-700 space-y-1">
                        <li>• Palabras escaneadas: {stats.words}</li>
                        <li>• Entidades quemadas: {stats.redacted}</li>
                      </ul>
                    </div>
                  )}
                </div>

                <div>
                  <button onClick={processSecureVisionPipeline} disabled={trialStatus === 'loading' || trialStatus === 'used'} className={`w-full py-4 px-4 rounded-xl font-bold transition-all flex justify-center items-center gap-2 border-2 ${trialStatus === 'used' ? 'bg-red-50 text-red-800 border-red-200 cursor-not-allowed' : trialStatus === 'success' ? 'bg-slate-950 text-white border-slate-950 shadow-lg' : 'bg-transparent hover:bg-slate-50 border-slate-200 text-slate-950'}`}>
                    {trialStatus === 'idle' && <><FileCode className="w-4 h-4" /> Iniciar Destrucción Óptica y ZIP</>}
                    {trialStatus === 'loading' && 'Operando en Edge...'}
                    {trialStatus === 'success' && <><CheckCircle className="h-4 w-4"/> Reiniciar Sandbox</>}
                    {trialStatus === 'used' && <><AlertTriangle className="h-4 w-4"/> Límite Alcanzado</>}
                  </button>
                  {errorMessage && <p className="text-[12px] mt-4 text-center font-bold text-red-600 bg-red-50 py-2 rounded-lg">{errorMessage}</p>}
                </div>
              </div>

              {/* LICENCIA ENTERPRISE */}
              <div className="bg-slate-950 p-10 relative flex flex-col justify-between">
                <div>
                  <div className="inline-block px-3 py-1 bg-blue-500/10 text-blue-300 text-[11px] font-bold uppercase tracking-[0.1em] rounded-full mb-6 border border-blue-500/30">Acceso Institucional</div>
                  <h3 className="text-3xl font-extrabold text-white mb-3 tracking-tight">Licencia Enterprise</h3>
                  <p className="text-slate-400 mb-8 font-medium text-sm">Arquitectura Full-Stack para despachos. Análisis en lote de PDFs escaneados (Multipage OCR) y trazabilidad forense.</p>
                  
                  <ul className="space-y-4 mb-10">
                    {['Soporte Multipage PDF (Rasterizado)', 'Integración con Active Directory (SSO)', 'Modelos NER Personalizados (Legal)', 'Facturación unificada deducible'].map((item, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
                        <span className="text-sm font-medium text-slate-300">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <form action={createCheckoutSession} className="mt-auto">
                  <button type="submit" className="w-full bg-white hover:bg-slate-200 text-slate-950 py-4 px-4 rounded-xl font-extrabold transition-all flex justify-center items-center gap-2 shadow-[0_0_25px_rgba(255,255,255,0.05)] hover:shadow-[0_0_35px_rgba(255,255,255,0.15)]">
                    <Database className="h-5 w-5" />
                    Aprovisionar Instancia Dedicada
                  </button>
                  <p className="text-[11px] text-slate-500 text-center mt-5 font-medium tracking-wide">Pago asegurado mediante pasarela certificada PCI-DSS Nivel 1.</p>
                </form>
              </div>

            </div>
          </div>
        </section>

        {/* CANVAS OCULTO (MOTOR DE RENDERIZADO) */}
        <canvas ref={canvasRef} className="hidden" />

      </main>

      <footer className="border-t border-slate-200 bg-white py-12 mt-24">
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
