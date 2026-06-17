"use client";

import { CalculatorPageHeader } from "./calculator-page-header";
import { SalaryInputSection } from "./salary-input-section";
import { ResultCard } from "./result-card";
import { DeductionsBreakdownCard } from "./deductions-breakdown-card";
import { FaqSection } from "./faq-section";
import { ScrollFadeSection } from "@/components/ui/scroll-fade-section";
import { useSalaryStore } from "@/stores/salary-store";

// Hiding budget and reality elements from main view as requested
// import { BudgetRuleCard } from "./budget-rule-card";
// import { ExpensesSection } from "./expenses-section";
// import { SavingsProjectionSection } from "./savings-projection-section";
// import { useMonthlyExpensesStore } from "@/stores/monthly-expenses-store";

export function CalculatorPage() {
  const result = useSalaryStore((s) => s.result);

  const hasResult = result != null && result.salarioBruto > 0;
  // const salarioNeto = result?.salarioNeto ?? 0;

  return (
    <div className="mx-auto w-full max-w-7xl px-4 md:px-8 pb-20 min-h-[80vh] flex flex-col">
      <CalculatorPageHeader />

      {/* Contenedor principal de 2 columnas */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-4 items-start w-full flex-grow">

        {/* Columna Izquierda (Input): Ancho 4/12 (Se centra si no hay resultados) */}
        <div
          className={`transition-all duration-700 ease-in-out w-full ${hasResult
              ? "lg:col-span-4 lg:sticky lg:top-8"
              : "lg:col-span-12 max-w-md mx-auto mt-4"
            }`}
        >
          <section aria-label="Calculadora de salario">
            <div
              className="rounded-3xl p-6 md:p-8 transition-all duration-700"
              style={{
                background: "rgba(255,255,255,0.85)",
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
                border: "1px solid rgba(255,255,255,0.65)",
                boxShadow: [
                  "0 8px 32px -8px rgba(0,0,0,0.12)",
                  "0 2px 10px -2px rgba(0,0,0,0.07)",
                  "inset 0 1px 0 rgba(255,255,255,0.95)",
                  "inset 0 -1px 0 rgba(0,0,0,0.03)",
                ].join(", "),
              }}
            >
              <SalaryInputSection />
            </div>
          </section>
        </div>

        {/* Columna Derecha (Análisis y Resultados): Ancho 8/12 */}
        {hasResult && (
          <div className="lg:col-span-8 space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-700 fill-mode-both w-full">

            {/* Fila 1: Tarjeta Héroe de Resultados (Neto recibido vs Costo Empresa) */}
            <ScrollFadeSection delay={80}>
              <ResultCard />
            </ScrollFadeSection>

            {/* Fila 2: Descuentos de Ley con Barra de Progreso Integrada */}
            <ScrollFadeSection delay={100}>
              <DeductionsBreakdownCard view="deductions-only" />
            </ScrollFadeSection>

            {/* Fila 3: Prestaciones Anuales y Costo Empresa Expandidos */}
            <ScrollFadeSection delay={140}>
              <DeductionsBreakdownCard view="accordions-only" />
            </ScrollFadeSection>

            {/* Ocultamos temporalmente las secciones de Presupuesto y Tu Realidad */}
            {/* 
            <ScrollFadeSection delay={160}>
              <BudgetRuleCard salarioNeto={salarioNeto} />
            </ScrollFadeSection>
            
            <ScrollFadeSection delay={180}>
              <ExpensesSection />
            </ScrollFadeSection>
            */}

          </div>
        )}
      </div>

      {hasResult && (
        <ScrollFadeSection
          className="mt-20 max-w-3xl mx-auto w-full"
          delay={200}
        >
          <FaqSection />
        </ScrollFadeSection>
      )}
    </div>
  );
}
