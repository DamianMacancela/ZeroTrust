import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Cumplimiento Normativo LATAM — ZeroTrust Tech',
  description: 'Certificaciones y cumplimiento LOPDP Ecuador, Ley 1581 Colombia, LFPDPPP México, GDPR.',
};

const REGULATIONS = [
  {
    country: 'Ecuador',
    flag: '🇪🇨',
    law: 'LOPDP',
    fullName: 'Ley Orgánica de Protección de Datos Personales',
    year: 2021,
    authority: 'Superintendencia de Protección de Datos Personales',
    maxFine: 'Hasta el 2% de la facturación anual',
    requirements: [
      'Tratamiento con base legal explícita',
      'Minimización de datos en documentos',
      'Registro de actividades de tratamiento',
      'Notificación de brechas en 72 horas',
      'Derechos ARCO garantizados',
    ],
    howWeHelp: [
      'Redacción automática de datos personales en documentos',
      'Reporte de auditoría con trazabilidad completa',
      'DPA que asume rol de Encargado de Tratamiento',
      'Procesamiento local — sin transferencia internacional de datos',
    ],
    color: '#FFD700',
  },
  {
    country: 'Colombia',
    flag: '🇨🇴',
    law: 'Ley 1581',
    fullName: 'Ley Estatutaria de Protección de Datos Personales',
    year: 2012,
    authority: 'Superintendencia de Industria y Comercio (SIC)',
    maxFine: 'Hasta 2.000 SMMLV (~$600.000 USD)',
    requirements: [
      'Autorización previa del titular',
      'Políticas de tratamiento documentadas',
      'Registro Nacional de Bases de Datos (RNBD)',
      'Responsable y Encargado definidos contractualmente',
    ],
    howWeHelp: [
      'Clickwrap Agreement como mecanismo de autorización',
      'Logs criptográficos inmutables por operación',
      'DPA que define roles Responsable/Encargado',
      'Redacción de CC, NIT en documentos legales',
    ],
    color: '#003087',
  },
  {
    country: 'México',
    flag: '🇲🇽',
    law: 'LFPDPPP',
    fullName: 'Ley Federal de Protección de Datos Personales en Posesión de Particulares',
    year: 2010,
    authority: 'Instituto Nacional de Transparencia (INAI)',
    maxFine: 'Hasta $19.3M MXN por infracción',
    requirements: [
      'Aviso de Privacidad publicado',
      'Transferencias documentadas',
      'Medidas de seguridad técnicas y organizativas',
      'CURP y RFC como datos sensibles',
    ],
    howWeHelp: [
      'Detección y redacción de CURP y RFC en documentos',
      'Arquitectura Zero-Knowledge como medida técnica',
      'Sin transferencia de datos a terceros',
      'Procesamiento 100% local en dispositivo del usuario',
    ],
    color: '#006847',
  },
  {
    country: 'Unión Europea',
    flag: '🇪🇺',
    law: 'GDPR',
    fullName: 'General Data Protection Regulation',
    year: 2018,
    authority: 'Autoridades de Protección de Datos (APDs)',
    maxFine: 'Hasta €20M o el 4% de facturación global',
    requirements: [
      'Base legal para cada tratamiento',
      'Privacy by Design y by Default',
      'DPO designado si aplica',
      'Evaluación de impacto (DPIA) para datos de alto riesgo',
    ],
    howWeHelp: [
      'Privacy by Design: procesamiento local sin datos en servidor',
      'DPA disponible como Encargado del Tratamiento',
      'Logs de auditoría para DPIA',
      'Redacción de datos en documentos compartidos con terceros UE',
    ],
    color: '#003399',
  },
];

export default function CompliancePage() {
  return (
    <div style={{ minHeight: '100vh', background: '#F8FAFC', fontFamily: '"Inter",-apple-system,sans-serif' }}>
      {/* HEADER */}
      <div style={{ background: '#0F172A', padding: '80px 40px', textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(59,130,246,0.15)', border: '1px solid rgba(59,130,246,0.3)', borderRadius: '50px', padding: '6px 16px', marginBottom: '24px' }}>
          <span style={{ fontSize: '12px', fontWeight: 700, color: '#60A5FA', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Marco Normativo</span>
        </div>
        <h1 style={{ fontSize: '48px', fontWeight: 800, color: 'white', letterSpacing: '-1.5px', margin: '0 0 16px' }}>
          Cumplimiento Legal LATAM
        </h1>
        <p style={{ fontSize: '18px', color: '#94A3B8', maxWidth: '600px', margin: '0 auto', lineHeight: 1.7 }}>
          ZeroTrust Tech está diseñado desde su arquitectura para cumplir con las principales regulaciones de protección de datos de Latinoamérica y la Unión Europea.
        </p>
      </div>

      {/* REGULATIONS GRID */}
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '64px 40px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(480px, 1fr))', gap: '24px' }}>
          {REGULATIONS.map((reg) => (
            <div key={reg.law} style={{ background: 'white', border: '1px solid #E2E8F0', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 2px 16px rgba(0,0,0,0.06)' }}>
              <div style={{ background: reg.color, padding: '24px 28px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                <span style={{ fontSize: '36px' }}>{reg.flag}</span>
                <div>
                  <div style={{ fontSize: '22px', fontWeight: 800, color: 'white' }}>{reg.law}</div>
                  <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.8)' }}>{reg.country} · Vigente desde {reg.year}</div>
                </div>
              </div>

              <div style={{ padding: '24px 28px' }}>
                <p style={{ fontSize: '13px', color: '#64748B', marginBottom: '16px', lineHeight: 1.6 }}>{reg.fullName}</p>
                <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '10px', padding: '12px 16px', marginBottom: '20px' }}>
                  <span style={{ fontSize: '12px', fontWeight: 700, color: '#991B1B' }}>Sanción máxima: {reg.maxFine}</span>
                </div>

                <h4 style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A', marginBottom: '10px' }}>Requisitos clave:</h4>
                {reg.requirements.map((req, i) => (
                  <div key={i} style={{ display: 'flex', gap: '8px', marginBottom: '6px', fontSize: '13px', color: '#374151' }}>
                    <span style={{ color: '#EF4444', fontWeight: 700, flexShrink: 0 }}>!</span>{req}
                  </div>
                ))}

                <h4 style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A', marginTop: '16px', marginBottom: '10px' }}>Cómo ZeroTrust cumple:</h4>
                {reg.howWeHelp.map((help, i) => (
                  <div key={i} style={{ display: 'flex', gap: '8px', marginBottom: '6px', fontSize: '13px', color: '#374151' }}>
                    <span style={{ color: '#22C55E', fontWeight: 700, flexShrink: 0 }}>✓</span>{help}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
