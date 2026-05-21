import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { AppProviders } from "@/components/providers/app-providers";
import { PageShell } from "@/components/layout/page-shell";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: "Calculadora Salarial SV | Salario neto El Salvador 2025",
    template: "%s | Calculadora Salarial SV",
  },
  description:
    "Calcula tu salario neto en El Salvador con deducciones AFP, ISSS e ISR 2025. Presupuesto 50/30/20 y comparación de ofertas laborales.",
  keywords: [
    "calculadora salario",
    "El Salvador",
    "salario neto",
    "AFP",
    "ISSS",
    "ISR 2025",
  ],
  manifest: "/manifest.webmanifest",
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
    <html lang="es" suppressHydrationWarning data-accent="teal">
      <body className={`${inter.variable} font-sans antialiased`}>
        <AppProviders>
          <PageShell>{children}</PageShell>
        </AppProviders>
      </body>
    </html>
  );
}
