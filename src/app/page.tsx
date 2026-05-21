import type { Metadata } from "next";
import { CalculatorPage } from "@/components/calculator/calculator-page";
import {
  CalculatorJsonLd,
  CALCULATOR_META_DESCRIPTION,
} from "@/components/seo/calculator-json-ld";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://calculadora-salarial.sv";

export const metadata: Metadata = {
  title: "Calculadora de Salario El Salvador 2025 — Neto, AFP, ISSS e ISR",
  description: CALCULATOR_META_DESCRIPTION,
  keywords: [
    "calculadora salario el salvador",
    "salario neto el salvador",
    "AFP ISSS ISR 2025",
    "calculadora descuentos salariales",
  ],
  openGraph: {
    title: "Calculadora de Salario El Salvador 2025",
    description: CALCULATOR_META_DESCRIPTION,
    type: "website",
    locale: "es_SV",
    url: SITE_URL,
    siteName: "Calculadora Salarial SV",
  },
  twitter: {
    card: "summary_large_image",
    title: "Calculadora de Salario El Salvador 2025",
    description: CALCULATOR_META_DESCRIPTION,
  },
};

export default function HomePage() {
  return (
    <>
      <CalculatorJsonLd />
      <CalculatorPage />
    </>
  );
}
