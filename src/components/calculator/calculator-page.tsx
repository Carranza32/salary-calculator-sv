"use client";

import { CalculatorPageHeader } from "./calculator-page-header";
import { SalaryInputSection } from "./salary-input-section";
import { ResultCard } from "./result-card";
import { DeductionsBreakdownCard } from "./deductions-breakdown-card";
import { ExpensesSection } from "./expenses-section";
import { SavingsProjectionSection } from "./savings-projection-section";
import { BudgetRuleCard } from "./budget-rule-card";
import { FaqSection } from "./faq-section";
import { ScrollFadeSection } from "@/components/ui/scroll-fade-section";
import { useSalaryStore } from "@/stores/salary-store";
import { useMonthlyExpensesStore } from "@/stores/monthly-expenses-store";

export function CalculatorPage() {
  const result = useSalaryStore((s) => s.result);
  const totalGastos = useMonthlyExpensesStore((s) =>
    Object.values(s.expenses).reduce((sum, v) => sum + v, 0),
  );

  const hasResult = result != null && result.salarioBruto > 0;
  const salarioNeto = result?.salarioNeto ?? 0;
  const surplus = hasResult
    ? Math.max(0, Math.round((salarioNeto - totalGastos) * 100) / 100)
    : 0;

  return (
    <div className="mx-auto w-full max-w-7xl px-4 md:px-8 pb-20 min-h-[80vh] flex flex-col">
      <CalculatorPageHeader />

      {/* Contenedor principal */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-4 items-start w-full flex-grow">
        {/* Columna Izquierda: Input (Se centra automáticamente si no hay resultados) */}
        <div
          className={`transition-all duration-700 ease-in-out w-full ${
            hasResult
              ? "lg:col-span-4 space-y-6 lg:sticky lg:top-8"
              : "lg:col-span-12 max-w-md mx-auto mt-4"
          }`}
        >
          <section aria-label="Calculadora de salario">
            <div
              className={`bg-card rounded-3xl p-6 border border-border/50 transition-all duration-700 ${
                hasResult ? "shadow-sm" : "shadow-xl shadow-black/5"
              }`}
            >
              <SalaryInputSection />
            </div>
          </section>

          {hasResult && (
            <ScrollFadeSection delay={0}>
              <ResultCard />
            </ScrollFadeSection>
          )}
        </div>

        {/* Columna Derecha: Análisis (Solo se muestra cuando hay resultados con animación de entrada) */}
        {hasResult && (
          <div className="lg:col-span-8 space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700 fill-mode-both">
            <ScrollFadeSection delay={80}>
              <BudgetRuleCard salarioNeto={salarioNeto} />
            </ScrollFadeSection>

            <ScrollFadeSection delay={120}>
              <DeductionsBreakdownCard />
            </ScrollFadeSection>

            <ScrollFadeSection delay={160}>
              <ExpensesSection />
            </ScrollFadeSection>

            {surplus > 0 && totalGastos > 0 && (
              <ScrollFadeSection delay={200}>
                <SavingsProjectionSection surplus={surplus} />
              </ScrollFadeSection>
            )}
          </div>
        )}
      </div>

      {hasResult && (
        <ScrollFadeSection
          className="mt-20 max-w-3xl mx-auto w-full"
          delay={240}
        >
          <FaqSection />
        </ScrollFadeSection>
      )}
    </div>
  );
}
