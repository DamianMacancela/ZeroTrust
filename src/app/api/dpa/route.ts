import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const orgName = searchParams.get('org') || '[NOMBRE DE LA ORGANIZACIÓN]';
  const email = searchParams.get('email') || '[CORREO ELECTRÓNICO]';
  
  const date = new Date().toLocaleDateString('es-EC', {
    year: 'numeric', month: 'long', day: 'numeric'
  });

  const dpaContent = `DATA PROCESSING AGREEMENT (DPA)
ACUERDO DE PROCESAMIENTO DE DATOS
======================================================

Fecha: ${date}
Versión: 2.0

PARTES:

RESPONSABLE DEL TRATAMIENTO:
Organización: ${orgName}
Correo: ${email}
(en adelante "el Cliente" o "Responsable")

ENCARGADO DEL TRATAMIENTO:
ZeroTrust Tech S.A.S.
Plataforma: zerotrust.tech
(en adelante "ZeroTrust" o "Encargado")

======================================================

1. OBJETO Y ALCANCE

ZeroTrust Tech actúa como Encargado del Tratamiento en nombre del
Cliente para la prestación del servicio de ofuscación de documentos
legales, conforme a las instrucciones documentadas en este Acuerdo.

2. NATURALEZA DEL TRATAMIENTO

ZeroTrust Tech implementa una arquitectura Zero-Knowledge en la que:
- Los documentos NO se transmiten a servidores externos.
- El procesamiento ocurre íntegramente en el dispositivo del usuario.
- ZeroTrust NO tiene acceso al contenido de los documentos procesados.
- Solo se almacena un hash SHA-256 de la IP para control de acceso.

3. CATEGORÍAS DE DATOS

Los documentos del Cliente pueden contener:
- Datos identificativos: nombres, cédulas, RUC, pasaportes
- Datos de contacto: correos, teléfonos, direcciones
- Datos financieros: cuentas bancarias, tarjetas
- Datos de vehículos: placas, VIN

Todos estos datos son procesados localmente y NO abandonan el dispositivo.

4. FINALIDAD DEL TRATAMIENTO

Única finalidad autorizada: ofuscación/redacción de datos personales
en documentos legales para cumplimiento normativo.

5. OBLIGACIONES DE ZEROTRUST TECH

5.1 Procesamiento únicamente bajo instrucción documentada del Cliente.
5.2 Garantía de confidencialidad del personal con acceso a sistemas.
5.3 Implementación de medidas técnicas: cifrado TLS, Zero-Knowledge,
    autenticación de dos factores, auditoría de accesos.
5.4 Asistencia al Cliente para responder solicitudes de derechos ARCO.
5.5 Notificación al Cliente de cualquier brecha de seguridad en 72h.
5.6 Eliminación o devolución de datos al término del contrato.
5.7 Puesta a disposición de información necesaria para auditorías.

6. OBLIGACIONES DEL CLIENTE (RESPONSABLE)

6.1 Garantizar base legal para el tratamiento de los datos personales.
6.2 Informar a los titulares sobre el uso de herramientas de tratamiento.
6.3 No transferir al Encargado categorías especiales de datos sin acuerdo.
6.4 Verificar que los documentos procesados corresponden a su actividad.

7. SUBENCARGADOS

ZeroTrust Tech utiliza los siguientes subencargados autorizados:
- Vercel Inc. (infraestructura de cómputo) — Privacy Shield certificado
- Supabase Inc. (base de datos de control de acceso) — SOC2 Type II

El contenido de los documentos NO es accesible por ningún subencargado.

8. TRANSFERENCIAS INTERNACIONALES

Dado que el procesamiento es local (Zero-Knowledge), no existe
transferencia internacional del contenido de los documentos.
Los metadatos de control (IP hash) se almacenan en servidores
de Supabase con sede en us-east-1 bajo cláusulas contractuales estándar.

9. AUDITORÍA Y CUMPLIMIENTO

El Cliente puede solicitar auditorías de cumplimiento con 30 días
de preaviso. ZeroTrust Tech proporcionará documentación técnica
y registros de acceso (excluyendo datos de otros clientes).

10. VIGENCIA Y TERMINACIÓN

Este DPA tiene la misma vigencia que el contrato de servicio.
A la terminación, ZeroTrust eliminará todos los datos del Cliente
en un plazo máximo de 30 días, salvo obligación legal de conservación.

11. RESPONSABILIDAD

ZeroTrust Tech responde por los daños causados por incumplimiento
de sus obligaciones como Encargado, conforme a la normativa aplicable.

12. LEY APLICABLE

Este acuerdo se rige por la Ley Orgánica de Protección de Datos
Personales del Ecuador (LOPDP), sin perjuicio de la normativa
aplicable en el país de establecimiento del Cliente.

======================================================

FIRMAS:

Por ZeroTrust Tech:
_______________________________
Representante Legal
ZeroTrust Tech S.A.S.
Fecha: ${date}

Por el Cliente:
_______________________________
${orgName}
Representante autorizado
Correo: ${email}
Fecha: ${date}

======================================================
DPA-ZT-2027 · zerotrust.tech/compliance · soporte@zerotrust.tech
`;

  return new NextResponse(dpaContent, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Content-Disposition': `attachment; filename="DPA_ZeroTrustTech_${orgName.replace(/\s+/g, '_')}.txt"`,
    },
  });
}
