"use client";

import { CalculatorPageHeader } from "./calculator-page-header";
import { SalaryInputSection } from "./salary-input-section";
import { ResultCard } from "./result-card";
import { DeductionsBreakdownCard } from "./deductions-breakdown-card";
import { FaqSection } from "./faq-section";
import { ScrollFadeSection } from "@/components/ui/scroll-fade-section";
import { useSalaryStore } from "@/stores/salary-store";
import { motion, AnimatePresence } from "framer-motion";

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
        <motion.div
          layout
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className={`w-full ${hasResult
              ? "lg:col-span-4 lg:sticky lg:top-8"
              : "lg:col-span-12 max-w-md mx-auto mt-4"
            }`}
        >
          <section aria-label="Calculadora de salario">
            <div
              className="rounded-3xl p-6 md:p-8 transition-colors duration-300"
              style={{
                background: "var(--glass-bg)",
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
                border: "1px solid var(--glass-border)",
                boxShadow: "var(--glass-shadow)",
              }}
            >
              <SalaryInputSection />
            </div>
          </section>
        </motion.div>

        {/* Columna Derecha (Análisis y Resultados): Ancho 8/12 */}
        <AnimatePresence mode="popLayout">
          {hasResult && (
            <motion.div
              layout
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 30 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-8 space-y-6 w-full"
            >

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

            </motion.div>
          )}
        </AnimatePresence>
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
