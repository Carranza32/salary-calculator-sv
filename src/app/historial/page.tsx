import type { Metadata } from "next";
import { HistoryPage } from "@/components/history/history-page";

export const metadata: Metadata = {
  title: "Historial y Comparador de Ofertas Laborales",
  description:
    "Guarda tus cálculos de salario neto y compara ofertas de empleo lado a lado en El Salvador. Analiza deducciones y beneficios anuales.",
  keywords: [
    "comparador de ofertas",
    "historial de calculos",
    "calcular salario neto",
    "ofertas de trabajo el salvador",
    "AFP ISSS renta",
  ],
  alternates: {
    canonical: "/historial",
  },
};

export default function HistorialPage() {
  return <HistoryPage />;
}

