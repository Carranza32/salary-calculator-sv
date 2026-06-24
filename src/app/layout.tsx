import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { AppProviders } from "@/components/providers/app-providers";
import { PageShell } from "@/components/layout/page-shell";
import { Analytics } from "@/components/seo/analytics";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://calculadora-salarial.sv";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Calculadora Salarial SV | Salario neto El Salvador 2026",
    template: "%s | Calculadora Salarial SV",
  },
  description:
    "Calcula tu salario neto en El Salvador con deducciones AFP, ISSS e ISR 2026. Presupuesto 50/30/20 y comparación de ofertas laborales.",
  keywords: [
    "calculadora salario",
    "El Salvador",
    "salario neto",
    "AFP",
    "ISSS",
    "ISR 2026",
  ],
  manifest: "/manifest.webmanifest",
  alternates: {
    canonical: "/",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#006B5E" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={inter.variable} suppressHydrationWarning data-accent="teal">
      <body className="font-sans antialiased">
        <Analytics />
        <AppProviders>
          <PageShell>{children}</PageShell>
        </AppProviders>
      </body>
    </html>
  );
}

