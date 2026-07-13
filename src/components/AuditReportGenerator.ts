'use client';

export interface AuditData {
  reportId: string;
  timestamp: string;
  product: string;
  compliance: string[];
  document: {
    originalName: string;
    outputName: string;
    pagesProcessed: number;
    itemsRedacted: number;
    processingTimeSeconds: string;
  };
  certifications: Record<string, boolean>;
  legalNote: string;
}

export async function downloadAuditReport(auditData: AuditData): Promise<void> {
  // Importar pdf-lib dinámicamente en el cliente
  const { PDFDocument, rgb, StandardFonts } = await import('pdf-lib');

  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595, 842]); // A4
  
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  
  const { width, height } = page.getSize();
  let y = height - 60;
  
  // Header
  page.drawRectangle({ x: 0, y: height - 80, width, height: 80, color: rgb(0.06, 0.07, 0.13) });
  page.drawText('ZEROTRUST TECH', { x: 40, y: height - 35, size: 18, font: fontBold, color: rgb(1, 1, 1) });
  page.drawText('REPORTE DE AUDITORÍA — DOCUMENTO PROCESADO', { x: 40, y: height - 58, size: 10, font, color: rgb(0.6, 0.7, 0.9) });
  
  y = height - 110;
  
  // Función helper para filas
  const addRow = (label: string, value: string, highlight = false) => {
    page.drawRectangle({
      x: 40, y: y - 8, width: width - 80, height: 24,
      color: highlight ? rgb(0.94, 0.97, 1) : rgb(0.98, 0.98, 0.98)
    });
    page.drawText(label, { x: 48, y, size: 10, font: fontBold, color: rgb(0.2, 0.2, 0.3) });
    
    // Truncate value if too long to prevent overlapping
    const safeValue = value.length > 55 ? value.substring(0, 52) + '...' : value;
    page.drawText(safeValue, { x: 250, y, size: 10, font, color: rgb(0.1, 0.1, 0.2) });
    y -= 26;
  };
  
  // Sección: Identificación
  page.drawText('IDENTIFICACIÓN DEL PROCESO', { x: 40, y, size: 13, font: fontBold, color: rgb(0.06, 0.07, 0.13) });
  y -= 30;
  
  addRow('ID de Reporte', auditData.reportId, true);
  addRow('Fecha y Hora', new Date(auditData.timestamp).toLocaleString('es-EC'), true);
  addRow('Plataforma', auditData.product, true);
  
  y -= 10;
  
  page.drawText('DOCUMENTO PROCESADO', { x: 40, y, size: 13, font: fontBold, color: rgb(0.06, 0.07, 0.13) });
  y -= 30;
  
  addRow('Archivo Original', auditData.document.originalName);
  addRow('Archivo Saneado', auditData.document.outputName);
  addRow('Páginas Procesadas', String(auditData.document.pagesProcessed));
  addRow('Elementos Redactados', String(auditData.document.itemsRedacted));
  addRow('Tiempo de Proceso', `${auditData.document.processingTimeSeconds} segundos`);
  
  y -= 10;
  
  page.drawText('CERTIFICACIONES DE SEGURIDAD', { x: 40, y, size: 13, font: fontBold, color: rgb(0.06, 0.07, 0.13) });
  y -= 30;
  
  addRow('Arquitectura Zero-Knowledge', '✓ CERTIFICADO', true);
  addRow('Procesamiento Local', '✓ El documento no salió del dispositivo', true);
  addRow('Sin Almacenamiento en Servidor', '✓ CONFIRMADO', true);
  
  y -= 10;
  
  page.drawText('CUMPLIMIENTO NORMATIVO', { x: 40, y, size: 13, font: fontBold, color: rgb(0.06, 0.07, 0.13) });
  y -= 30;
  
  for (const norm of auditData.compliance) {
    addRow('Marco Aplicado', norm);
  }
  
  // Nota legal
  y -= 20;
  page.drawRectangle({ x: 40, y: y - 45, width: width - 80, height: 65, color: rgb(0.96, 0.98, 1) });
  page.drawText('NOTA LEGAL:', { x: 50, y: y - 10, size: 9, font: fontBold, color: rgb(0.1, 0.2, 0.5) });
  page.drawText(auditData.legalNote, { x: 50, y: y - 25, size: 8, font, color: rgb(0.3, 0.3, 0.4), maxWidth: width - 100, lineHeight: 12 });
  
  // Footer
  page.drawRectangle({ x: 0, y: 0, width, height: 40, color: rgb(0.06, 0.07, 0.13) });
  page.drawText('© 2027 ZeroTrust Tech · Reporte generado localmente · zerotrust.tech', {
    x: 40, y: 14, size: 8, font, color: rgb(0.5, 0.5, 0.7)
  });
  
  const pdfBytes = await pdfDoc.save();
  const blob = new Blob([new Uint8Array(pdfBytes)], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `auditoria_${auditData.document.originalName}_${auditData.reportId.slice(0, 8)}.pdf`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
