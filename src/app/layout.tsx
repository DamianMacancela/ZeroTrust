import type { Metadata } from "next";
import "./globals.css";
import { CookieBanner } from "@/components/CookieBanner";
import { SocialProofToast } from "@/app/components/SocialProofToast";
import { ExitIntentModal } from "@/app/components/ExitIntentModal";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

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
    images: [
      {
        url: "https://zerotrust-redact.vercel.app/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "ZeroTrust Redact Premium Cover",
      }
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ZeroTrust Redact | Saneamiento de Datos Sensibles",
    description: "Redacta datos confidenciales (PII) en tus documentos legales directamente en tu navegador con nuestra arquitectura Zero-Data.",
    images: ["https://zerotrust-redact.vercel.app/og-image.jpg"],
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
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "ZeroTrust Redact",
    "operatingSystem": "Any",
    "applicationCategory": "BusinessApplication",
    "offers": {
      "@type": "Offer",
      "price": "19.99",
      "priceCurrency": "USD"
    },
    "description": "Plataforma de ofuscación de documentos confidenciales con arquitectura Zero-Data para cumplimiento de LOPDP.",
  };

  return (
    <html lang="es">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {/* Lemon Squeezy Affiliate Tracking Script */}
        <script src="https://app.lemonsqueezy.com/js/lemon.js" defer></script>
      </head>
      <body className="antialiased">
        {children}
        <CookieBanner />
        <SocialProofToast />
        <ExitIntentModal />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
