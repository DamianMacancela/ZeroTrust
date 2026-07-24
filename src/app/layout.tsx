import type { Metadata } from "next";
import "./globals.css";
import { CookieBanner } from "@/components/CookieBanner";

export const metadata: Metadata = {
  title: "ZeroTrust Redact | LegalTech B2B",
  description: "Saneamiento de PII con arquitectura Zero-Data. Redacción y ofuscación de documentos (PDF, Imágenes, Texto) nivel Enterprise, 100% en navegador para cumplimiento LOPD, GDPR y DPA.",
  keywords: ["redacción PDF", "ofuscar datos sensibles", "PII redaction", "Zero-Data", "LegalTech", "cumplimiento LOPD", "privacidad de datos", "borrar datos PDF"],
  authors: [{ name: "ZeroTrust Tech" }],
  openGraph: {
    title: "ZeroTrust Redact | Saneamiento de Datos Sensibles",
    description: "Plataforma de ofuscación de documentos confidenciales con arquitectura Zero-Data. Cumplimiento legal asegurado.",
    url: "https://zerotrust-redact.vercel.app",
    siteName: "ZeroTrust Redact",
    locale: "es_ES",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ZeroTrust Redact | Saneamiento de Datos Sensibles",
    description: "Redacta datos confidenciales (PII) en tus documentos legales directamente en tu navegador con nuestra arquitectura Zero-Data.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: "qWKebsXjMpuXjCmGNgvyFGmjOo3oFtBeJIhf5Yl2m3o",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body className="antialiased">
        {children}
        <CookieBanner />
      </body>
    </html>
  );
}
