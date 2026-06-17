import type { Metadata } from "next";
import { BudgetPage } from "@/components/budget/budget-page";

export const metadata: Metadata = {
  title: "Mi Presupuesto 50/30/20 — Organiza tu Salario Neto",
  description:
    "Distribuye tus ingresos netos mensuales con la regla 50/30/20: necesidades, gustos y ahorro libre. Optimizado para salarios de El Salvador.",
  keywords: [
    "presupuesto 50 30 20",
    "ahorro mensual",
    "gastos mensuales",
    "salario neto el salvador",
    "finanzas personales",
  ],
  alternates: {
    canonical: "/presupuesto",
  },
};

export default function PresupuestoPage() {
  return <BudgetPage />;
}

