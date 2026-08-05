// Script de Marketing Automatizado (Cold Emailing) para ZeroTrust Redact
// Ejecutar con: node enviar_correos_masivos.js

require('dotenv').config({ path: '.env.local' });
const nodemailer = require('nodemailer');

// 1. Configura tu correo de Gmail y Contraseña de Aplicación en el archivo .env.local
// Añade estas dos líneas en tu .env.local:
// GMAIL_USER=damianmacancela@gmail.com
// GMAIL_APP_PASSWORD=tupasswordde16letras
const user = process.env.GMAIL_USER;
const pass = process.env.GMAIL_APP_PASSWORD;

if (!user || !pass) {
  console.error("❌ ERROR: Faltan las credenciales GMAIL_USER o GMAIL_APP_PASSWORD en .env.local");
  console.log("👉 Ve a https://myaccount.google.com/apppasswords para crear una Contraseña de Aplicación de 16 letras y ponla en tu .env.local.");
  process.exit(1);
}

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: { user, pass }
});

// Base de datos automatizada (Hospitales y LegalTech)
const leads = [
  { nombre: "Axxis Hospital", email: "info@axxishospital.com.ec", sector: "Salud" },
  { nombre: "Clínica Internacional", email: "clinter@clinicainternacional.com.ec", sector: "Salud" },
  { nombre: "Hospital de los Valles", email: "servicioalcliente@hospitaldelosvalles.com", sector: "Salud" },
  { nombre: "Clínica Guayaquil", email: "info@clinicaguayaquil.com", sector: "Salud" },
  { nombre: "García & Partners", email: "info@garciaypartners.com", sector: "Legal" },
  { nombre: "Aguirre Noboa", email: "info@aguirrenoboa.com", sector: "Legal" },
  { nombre: "Donoso & Donoso", email: "info@donosoabogados.com", sector: "Legal" },
  { nombre: "CVEC Abogados", email: "info@cvecabogados.com", sector: "Legal" },
  { nombre: "Quito Legal", email: "info@quitolegal.com.ec", sector: "Legal" }
];

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function blastEmails() {
  console.log(`🚀 Iniciando Motor de Ventas... Se enviarán ${leads.length} correos corporativos.`);
  
  for (let i = 0; i < leads.length; i++) {
    const lead = leads[i];
    let subject, text;

    if (lead.sector === "Salud") {
      subject = `Auditoría LOPDP: Fuga de Historias Clínicas en ${lead.nombre}`;
      text = `Hola equipo de ${lead.nombre},\n\nHe notado que como clínica de primer nivel, manejan miles de historias clínicas diariamente.\n\nMuchos médicos suelen usar herramientas online gratuitas para borrar datos de PDFs médicos (ILovePDF, etc), violando el Art. 56 de la LOPDP al enviar datos de salud a servidores extranjeros, exponiendo a la clínica a multas millonarias.\n\nHe desarrollado ZeroTrust Redact, una herramienta Zero-Data que censura cédulas y datos médicos 100% de forma local en el navegador, sin subir nada a internet.\n\n¿Podría el encargado de TI probar nuestro Sandbox gratuito?\nLink: https://zerotrust-redact.vercel.app\n\nSaludos,\nDamian Fabricio Macancela\nFundador, ZeroTrust Tech`;
    } else {
      subject = `Cuidado: Fuga de PII en expedientes de ${lead.nombre} (Auditoría LOPDP)`;
      text = `Hola equipo de ${lead.nombre},\n\nNoté que en su firma manejan diariamente cientos de expedientes y contratos.\n\nLa mayoría de firmas están usando herramientas online gratuitas para borrar datos sensibles (PII), exponiéndose a que esos documentos queden almacenados en servidores extranjeros, lo cual viola el Art. 56 de la LOPDP y rompe el secreto profesional.\n\nHe desarrollado ZeroTrust Redact, una herramienta Zero-Data que ofusca cédulas y tarjetas de PDFs 100% sin conexión a internet desde el navegador.\n\n¿Estarías abierto a probar el Sandbox con un documento falso durante 3 minutos?\nLink: https://zerotrust-redact.vercel.app\n\nSaludos,\nDamian Fabricio Macancela\nFundador, ZeroTrust Tech`;
    }

    try {
      console.log(`⏳ Enviando a ${lead.email}...`);
      await transporter.sendMail({
        from: `"Damian Macancela (ZeroTrust)" <${user}>`,
        to: lead.email,
        subject: subject,
        text: text
      });
      console.log(`✅ ¡Enviado a ${lead.nombre}!`);
      
      // Esperar 3 segundos entre correos para evitar ser marcado como SPAM
      await sleep(3000); 
    } catch (error) {
      console.error(`❌ Error al enviar a ${lead.nombre}:`, error.message);
    }
  }
  
  console.log("🎉 CAMPAÑA FINALIZADA. Todos los correos han sido enviados.");
}

blastEmails();
