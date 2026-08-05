import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  try {
    const { email, consent_given } = await request.json();

    // 1. Verificación Legal (LOPDP Art 7)
    if (!consent_given) {
      return NextResponse.json(
        { error: 'El consentimiento explícito es obligatorio bajo la LOPDP.' },
        { status: 403 }
      );
    }

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Debe proveer un correo válido.' },
        { status: 400 }
      );
    }

    // 2. Obtener IP para el registro de auditoría legal
    const ip_address = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';

    // 3. Guardar en Supabase
    const { error: dbError } = await supabase
      .from('leads_inbound')
      .insert([
        { email, consent_given, ip_address }
      ]);

    // Ignoramos el error si el correo ya existe, porque igual le enviaremos la guía
    if (dbError && dbError.code !== '23505') { // 23505 es unique_violation
      console.error("Supabase Error:", dbError);
      return NextResponse.json(
        { error: 'Hubo un error al registrar el correo en la base de datos.' },
        { status: 500 }
      );
    }

    // 4. Enviar correo usando Nodemailer (Opcional, si está configurado en .env.local)
    // Para simplificar, asumimos que el usuario configurará su SMTP en el .env.local
    if (process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD) {
      try {
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: process.env.GMAIL_USER,
            pass: process.env.GMAIL_APP_PASSWORD
          }
        });

        await transporter.sendMail({
          from: `"ZeroTrust Tech" <${process.env.GMAIL_USER}>`,
          to: email,
          subject: 'Tu Guía LOPDP ha llegado | ZeroTrust Redact',
          text: `¡Hola!\n\nGracias por solicitar la Guía Definitiva LOPDP para Empresas. Hemos registrado tu consentimiento.\n\nPuedes descargar tu guía en el siguiente enlace:\nhttps://zerotrust-redact.vercel.app/\n\nSi deseas hacer una auditoría Zero-Data en este momento, ingresa a nuestro Sandbox gratuito en nuestra web.\n\nSaludos,\nEl equipo de ZeroTrust Tech.`
        });
      } catch (mailError) {
        console.error("Mail Error:", mailError);
        // No bloqueamos la respuesta exitosa si falla el correo
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: 'Ocurrió un error inesperado al procesar la solicitud.' },
      { status: 500 }
    );
  }
}
