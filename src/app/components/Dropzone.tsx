'use client';
import { useState, useRef, useCallback } from 'react';
import { z } from 'zod';
import { Upload, AlertCircle, Download, Loader2 } from 'lucide-react';

// Validación estricta para PDF, Word y Excel
const FileSchema = z.instanceof(File)
  .refine(
    (f) => f.type.includes('pdf') || f.type.includes('word') || f.type.includes('excel') || f.type.includes('spreadsheet') || f.name.endsWith('.docx') || f.name.endsWith('.xlsx'), 
    'Formato no soportado. Sube PDF, Word o Excel.'
  )
  .refine((f) => f.size <= 50 * 1024 * 1024, 'Límite de seguridad: 50 MB.');

export default function Dropzone({ onComplete }: { onComplete?: () => void }) {
  const [status, setStatus] = useState<'idle' | 'processing' | 'done' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [aiMessage, setAiMessage] = useState('');
  const [pageProgress, setPageProgress] = useState(0);

  const workerRef = useRef<Worker | null>(null);

  const processFile = useCallback(async (file: File) => {
    const validation = FileSchema.safeParse(file);
    if (!validation.success) { setErrorMsg(validation.error.issues[0].message); setStatus('error'); return; }

    setStatus('processing');
    setErrorMsg(null);
    setPageProgress(0);

    const arrayBuffer = await file.arrayBuffer();

    if (!workerRef.current) {
      workerRef.current = new Worker('/pdf-worker.js');
    }

    workerRef.current.onmessage = (e: MessageEvent) => {
      const { status: workerStatus, success, data, error, message, pageProgress: pp, fileName } = e.data;

      if (workerStatus === 'init_ai' || workerStatus === 'processing') {
        setAiMessage(message);
        if (pp) setPageProgress(pp);
      } else if (workerStatus === 'done' && success) {
        // Generar archivo de descarga automático con su extensión original
        const blob = new Blob([data], { type: file.type });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName; // "saneado_contrato.docx" o ".pdf"
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        setStatus('done');
        setAiMessage('');
        onComplete?.();
      } else if (workerStatus === 'error') {
        setErrorMsg(error || 'Error en el motor de aislamiento.');
        setStatus('error');
      }
    };

    workerRef.current.onerror = (err) => {
      setErrorMsg(`Worker crasheó: ${err.message}`);
      setStatus('error');
    };

    // Le pasamos el nombre del archivo para que el Worker sepa qué extensión procesar
    workerRef.current.postMessage({ fileData: arrayBuffer, fileName: file.name }, [arrayBuffer]);
  }, [onComplete]);

  const handleDrop = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(false); const file = e.dataTransfer.files?.[0]; if (file) processFile(file); };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => { const file = e.target.files?.[0]; if (file) processFile(file); e.target.value = ''; };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <label
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={`relative flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-300 ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-slate-300 bg-slate-50 hover:bg-slate-100'} ${status === 'processing' ? 'pointer-events-none opacity-50' : ''}`}
      >
        <div className="w-14 h-14 bg-white shadow-sm rounded-xl flex items-center justify-center mb-4 border border-slate-100">
          <Upload className={`w-7 h-7 ${isDragging ? 'text-blue-600' : 'text-slate-700'}`} />
        </div>
        <h3 className="text-lg text-slate-900 font-bold tracking-tight">Arrastra tu documento legal aquí</h3>
        <p className="text-sm text-slate-500 font-medium mt-1">Soporta <span className="text-blue-600 font-bold">PDF, Word y Excel</span></p>
        <input type="file" className="hidden" accept=".pdf,.doc,.docx,.xls,.xlsx" onChange={handleChange} disabled={status === 'processing'} />
      </label>

      {status === 'processing' && (
        <div className="mt-6 w-full max-w-sm mx-auto space-y-3">
          <div className="flex items-center gap-3 text-slate-700">
            <Loader2 className="w-5 h-5 animate-spin text-blue-600 shrink-0" />
            <span className="text-sm font-medium">{aiMessage}</span>
          </div>
          <div>
            <div className="flex justify-between text-xs text-slate-400 mb-1">
              <span>Progreso de Escaneo Zero-Data</span><span>{pageProgress}%</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
              <div className="bg-blue-600 h-1.5 rounded-full transition-all duration-300" style={{ width: `${pageProgress}%` }} />
            </div>
          </div>
        </div>
      )}

      {status === 'done' && (
        <div className="mt-5 flex items-center justify-center animate-in fade-in zoom-in duration-300">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 font-medium rounded-lg border border-emerald-200">
            <Download className="w-4 h-4" /> ¡Documento Seguro Descargado!
          </div>
        </div>
      )}

      {status === 'error' && (
        <div className="mt-5 flex items-center gap-2 text-red-600 text-sm bg-red-50 p-3 rounded-lg border border-red-100">
          <AlertCircle className="w-5 h-5 shrink-0" /> {errorMsg}
        </div>
      )}
    </div>
  );
}
