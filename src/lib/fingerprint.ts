// src/lib/fingerprint.ts
// ⚠️ PROD | GDPR Art.25 — Privacy by Design
// Fingerprint pasivo sin PII — solo características técnicas del dispositivo
// No almacena ni transmite datos identificables

export async function getFingerprint(): Promise<string> {
  const components = [
    navigator.language,
    String(navigator.hardwareConcurrency ?? 0),
    String(screen.colorDepth),
    String(screen.width),
    String(screen.height),
    String(new Date().getTimezoneOffset()),
    navigator.platform ?? 'unknown',
    // Canvas fingerprint mínimo — no invasivo
    getCanvasHash(),
  ].join('||');

  const buf = await crypto.subtle.digest(
    'SHA-256',
    new TextEncoder().encode(components)
  );

  return Array.from(new Uint8Array(buf))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

function getCanvasHash(): string {
  try {
    const canvas = document.createElement('canvas');
    canvas.width  = 64;
    canvas.height = 16;
    const ctx = canvas.getContext('2d');
    if (!ctx) return 'no-canvas';
    ctx.fillStyle = '#f60';
    ctx.fillRect(0, 0, 64, 16);
    ctx.fillStyle = '#069';
    ctx.font = '11px monospace';
    ctx.fillText('ztr', 2, 12);
    // Solo los primeros 16 chars — suficiente para diferenciación básica
    return canvas.toDataURL().slice(-16);
  } catch {
    return 'canvas-blocked';
  }
}