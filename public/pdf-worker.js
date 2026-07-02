globalThis.window = globalThis;
globalThis.document = {
  createElement: () => ({ getContext: () => null, width: 0, height: 0 }),
  getElementsByTagName: () => [],
  currentScript: { src: '' }
};
globalThis.HTMLCanvasElement = function() {};

importScripts('https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js');
importScripts('https://unpkg.com/pdf-lib@1.17.1/dist/pdf-lib.min.js');
importScripts('https://unpkg.com/fflate@0.8.2/umd/index.js');

pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

// ==========================================
// REGEX UNIVERSAL
// ==========================================
const GLOBAL_REGEX = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}|\+?(?:\d[\s\-.]?){6,20}\d/g;

function maskData(str) {
  if (!str || str.length <= 2) return str;
  if (str.includes('@')) {
    const parts = str.split('@');
    const local = parts[0];
    if (local.length <= 2) return str;
    return local.charAt(0) + '*'.repeat(local.length - 2) + local.charAt(local.length - 1) + '@' + parts[1];
  }
  return str.charAt(0) + '*'.repeat(str.length - 2) + str.charAt(str.length - 1);
}

function maskXmlText(xmlString) {
  return xmlString.replace(/>([^<]+)</g, (match, textContent) => {
    return '>' + textContent.replace(GLOBAL_REGEX, (m) => maskData(m)) + '<';
  });
}

self.onmessage = async function(e) {
  const { fileData, fileName } = e.data;
  const extension = fileName.split('.').pop().toLowerCase();

  try {
    self.postMessage({ status: 'init_ai', message: 'Iniciando Motor Universal...' });
    let finalBuffer = fileData;

    // --- PROCESAMIENTO PDF ---
    if (extension === 'pdf') {
      self.postMessage({ status: 'processing', message: 'Escaneando texto en PDF...', pageProgress: 15 });
      
      const pdfDocEdit = await PDFLib.PDFDocument.load(fileData);
      const pagesEdit = pdfDocEdit.getPages();
      
      // FIX CLAVE: Cambiamos de HelveticaBold a Helvetica normal para un estilo corporativo limpio
      const helveticaFont = await pdfDocEdit.embedFont(PDFLib.StandardFonts.Helvetica);
      
      const loadingTask = pdfjsLib.getDocument({ data: new Uint8Array(fileData) });
      const pdfDoc = await loadingTask.promise;

      for (let i = 1; i <= pdfDoc.numPages; i++) {
        const pageProgress = Math.round((i / pdfDoc.numPages) * 75) + 15;
        self.postMessage({ status: 'processing', message: `Inyectando censura natural (Pág ${i})...`, pageProgress });
        
        const page = await pdfDoc.getPage(i);
        const textContent = await page.getTextContent();
        const pageEdit = pagesEdit[i - 1];

        for (const item of textContent.items) {
          if (!item.str || !item.transform) continue;
          
          if (GLOBAL_REGEX.test(item.str)) {
            const tx = item.transform[4];
            const ty = item.transform[5];
            const fontSize = Math.sqrt(item.transform[0] * item.transform[0] + item.transform[1] * item.transform[1]);

            pageEdit.drawRectangle({
              x: tx, y: ty - (fontSize * 0.2), width: item.width + 4, height: fontSize + 2, color: PDFLib.rgb(1, 1, 1)
            });
            
            // Imprimimos la máscara con la fuente regular, mezclándose perfectamente con el texto
            pageEdit.drawText(item.str.replace(GLOBAL_REGEX, (m) => maskData(m)), {
              x: tx, y: ty, size: fontSize, font: helveticaFont, color: PDFLib.rgb(0, 0, 0)
            });
          }
        }
      }
      self.postMessage({ status: 'processing', message: 'Generando PDF seguro...', pageProgress: 95 });
      finalBuffer = await pdfDocEdit.save();
    } 
    
    // --- PROCESAMIENTO WORD Y EXCEL ---
    else if (['docx', 'doc', 'xlsx', 'xls'].includes(extension)) {
      self.postMessage({ status: 'processing', message: `Descomprimiendo ${extension.toUpperCase()}...`, pageProgress: 30 });
      
      const unzipped = fflate.unzipSync(new Uint8Array(fileData));
      
      self.postMessage({ status: 'processing', message: 'Inyectando asteriscos en XML...', pageProgress: 60 });
      
      for (const path in unzipped) {
        if (path.endsWith('.xml') && (path.includes('word/') || path.includes('xl/'))) {
          let xmlText = new TextDecoder().decode(unzipped[path]);
          xmlText = maskXmlText(xmlText);
          unzipped[path] = new TextEncoder().encode(xmlText);
        }
      }
      
      self.postMessage({ status: 'processing', message: 'Reensamblando archivo original...', pageProgress: 90 });
      finalBuffer = fflate.zipSync(unzipped).buffer;
    }

    self.postMessage({ status: 'done', success: true, data: finalBuffer, fileName: `saneado_${fileName}` });

  } catch (error) {
    self.postMessage({ status: 'error', error: error.message || 'Error local' });
  }
};
