"use client";

import { useEffect } from "react";
import { Toaster } from "sonner";
import { ThemeProvider } from "./theme-provider";
import { AccentInit } from "@/components/theme/accent-init";
import { useSalaryStore } from "@/stores/salary-store";
import { useBudgetStore } from "@/stores/budget-store";
import { useHistoryStore } from "@/stores/history-store";
import { useMonthlyExpensesStore } from "@/stores/monthly-expenses-store";

function StoreHydrator() {
  const hydrateSalary = useSalaryStore((s) => s.hydrate);
  const hydrateBudget = useBudgetStore((s) => s.hydrate);
  const hydrateHistory = useHistoryStore((s) => s.hydrate);
  const hydrateMonthlyExpenses = useMonthlyExpensesStore((s) => s.hydrate);

  useEffect(() => {
    hydrateSalary();
    hydrateBudget();
    hydrateHistory();
    hydrateMonthlyExpenses();
  }, [hydrateSalary, hydrateBudget, hydrateHistory, hydrateMonthlyExpenses]);

  return null;
}

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <AccentInit />
      <StoreHydrator />
      {children}
      <Toaster richColors position="top-center" />
    </ThemeProvider>
  );
}
