import type { Metadata } from "next";
import "./globals.css";
import { CookieBanner } from "@/components/CookieBanner";

export const metadata: Metadata = {
  title: "ZeroTrust Redact | LegalTech",
  description: "Saneamiento de PII con arquitectura Zero-Data. Cumplimiento legal y ofuscacion local nivel Enterprise.",
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
