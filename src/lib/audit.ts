// src/lib/audit.ts
// ⚠️ PROD | SOC 2 CC7.2, CC7.3 | ISO 27001 A.12.4 | GDPR Art.30
// Audit log inmutable y estructurado — compatible con Datadog / Axiom / Logtail

export type AuditCategory =
  | 'AUTH'
  | 'DATA'
  | 'BILLING'
  | 'SECURITY'
  | 'SYSTEM';

export type AuditEvent =
  // DATA
  | 'document.processing.started'
  | 'document.processing.completed'
  | 'document.processing.failed'
  | 'document.download.initiated'
  // AUTH
  | 'auth.login.success'
  | 'auth.login.failed'
  | 'auth.logout'
  | 'auth.token.refreshed'
  // BILLING
  | 'billing.checkout.initiated'
  | 'billing.subscription.activated'
  | 'billing.subscription.cancelled'
  | 'billing.payment.failed'
  // SECURITY
  | 'security.ratelimit.triggered'
  | 'security.csrf.blocked'
  | 'security.usage.tampered'
  | 'security.paywall.bypassed'
  // SYSTEM
  | 'system.worker.error'
  | 'system.api.error';

export type AuditSeverity = 'INFO' | 'WARN' | 'ERROR' | 'CRITICAL';

export interface AuditEntry {
  event:      AuditEvent;
  category:   AuditCategory;
  severity:   AuditSeverity;
  actorHash:  string;              // SHA-256 del fingerprint — nunca PII directa
  sessionId?: string;
  resourceId?: string;             // ID del recurso afectado (subscriptionId, etc.)
  meta?:      Record<string, unknown>;
  // Campos poblados automáticamente:
  ts?:        string;
  env?:       string;
  version?:   string;
}

const SEVERITY_SCORE: Record<AuditSeverity, number> = {
  INFO: 1, WARN: 2, ERROR: 3, CRITICAL: 4,
};

// ── Formateo estructurado (ingestable por cualquier SIEM) ────────────────────
function formatEntry(entry: AuditEntry): string {
  const full: AuditEntry & { ts: string; env: string; version: string } = {
    ...entry,
    ts:      new Date().toISOString(),
    env:     process.env.NODE_ENV ?? 'unknown',
    version: process.env.NEXT_PUBLIC_APP_VERSION ?? '1.0.0',
  };
  return JSON.stringify(full);
}

// ── Envío al endpoint interno (server-side) ──────────────────────────────────
async function sendToEndpoint(entry: AuditEntry): Promise<void> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';
  await fetch(`${baseUrl}/api/audit`, {
    method:  'POST',
    headers: { 
      'Content-Type': 'application/json',
      // Header interno para evitar loops — el endpoint valida esto
      'x-internal-audit': process.env.AUDIT_INTERNAL_SECRET ?? '',
    },
    body:    JSON.stringify(entry),
  });
}

// ── API pública ──────────────────────────────────────────────────────────────
export async function audit(entry: AuditEntry): Promise<void> {
  const formatted = formatEntry(entry);

  // Stdout siempre (Vercel Log Drain / Railway / cualquier plataforma)
  if (SEVERITY_SCORE[entry.severity] >= SEVERITY_SCORE['WARN']) {
    console.error(formatted);   // stderr para WARN+
  } else {
    console.log(formatted);
  }

  // Fire-and-forget al endpoint de persistencia — no bloquea la request
  sendToEndpoint(entry).catch((err) => {
    console.error(JSON.stringify({
      event: 'system.api.error',
      meta:  { auditDeliveryFailed: true, error: String(err) },
      ts:    new Date().toISOString(),
    }));
  });
}

// ── Helper: hash del fingerprint (evita loguear PII) ────────────────────────
export async function hashActor(fingerprint: string): Promise<string> {
  if (typeof window !== 'undefined' && window.crypto?.subtle) {
    const buf = await window.crypto.subtle.digest(
      'SHA-256',
      new TextEncoder().encode(fingerprint + (process.env.NEXT_PUBLIC_AUDIT_SALT ?? 'ztr'))
    );
    return Array.from(new Uint8Array(buf))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('')
      .slice(0, 16); // 16 chars — suficiente para correlación sin ser PII
  }
  return 'server-side';
}