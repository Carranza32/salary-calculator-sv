"use client";

import { create } from "zustand";
import { calcularBudgetSummary } from "@/lib/salary";
import type { BudgetSummary, Expense, ExpenseCategory } from "@/lib/salary/types";
import { getExpenses, setExpenses } from "@/lib/storage/local-storage";

interface BudgetState {
  expenses: Expense[];
  hydrated: boolean;
  hydrate: () => void;
  addExpense: (data: Omit<Expense, "id" | "fechaCreacion">) => void;
  updateExpense: (id: string, data: Partial<Expense>) => void;
  removeExpense: (id: string) => void;
  clearAll: () => void;
  getSummary: (salarioNeto: number) => BudgetSummary;
}

function persist(expenses: Expense[]) {
  setExpenses(expenses);
}

export const useBudgetStore = create<BudgetState>((set, get) => ({
  expenses: [],
  hydrated: false,

  hydrate: () => {
    set({ expenses: getExpenses(), hydrated: true });
  },

  addExpense: (data) => {
    const category: ExpenseCategory =
      data.categoria === "ahorros" ? "necesidades" : data.categoria;
    const expense: Expense = {
      ...data,
      categoria: category,
      id: String(Date.now()),
      fechaCreacion: new Date().toISOString(),
      esRecurrente: data.esRecurrente ?? true,
    };
    const expenses = [...get().expenses, expense];
    persist(expenses);
    set({ expenses });
  },

  updateExpense: (id, data) => {
    const expenses = get().expenses.map((e) =>
      e.id === id ? { ...e, ...data } : e,
    );
    persist(expenses);
    set({ expenses });
  },

  removeExpense: (id) => {
    const expenses = get().expenses.filter((e) => e.id !== id);
    persist(expenses);
    set({ expenses });
  },

  clearAll: () => {
    persist([]);
    set({ expenses: [] });
  },

  getSummary: (salarioNeto) =>
    calcularBudgetSummary(salarioNeto, get().expenses),
}));
