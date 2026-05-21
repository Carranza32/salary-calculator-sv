"use client";

import { create } from "zustand";

export type MonthlyExpenseKey =
  | "vivienda"
  | "alimentacion"
  | "transporte"
  | "servicios"
  | "salud"
  | "entretenimiento"
  | "ropa"
  | "suscripciones"
  | "deudas"
  | "ahorro"
  | "fijos"
  | "variables";

export type MonthlyExpenses = Record<MonthlyExpenseKey, number>;

export const EMPTY_MONTHLY_EXPENSES: MonthlyExpenses = {
  vivienda: 0,
  alimentacion: 0,
  transporte: 0,
  servicios: 0,
  salud: 0,
  entretenimiento: 0,
  ropa: 0,
  suscripciones: 0,
  deudas: 0,
  ahorro: 0,
  fijos: 0,
  variables: 0,
};

const STORAGE_KEY = "monthly_expense_inputs";

function readExpenses(): MonthlyExpenses {
  if (typeof window === "undefined") return { ...EMPTY_MONTHLY_EXPENSES };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...EMPTY_MONTHLY_EXPENSES };
    return { ...EMPTY_MONTHLY_EXPENSES, ...JSON.parse(raw) };
  } catch {
    return { ...EMPTY_MONTHLY_EXPENSES };
  }
}

function writeExpenses(expenses: MonthlyExpenses) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses));
}

interface MonthlyExpensesState {
  expenses: MonthlyExpenses;
  hydrated: boolean;
  hydrate: () => void;
  setExpense: (key: MonthlyExpenseKey, value: number) => void;
  getTotal: () => number;
  getNecesidadesTotal: () => number;
  getGustosTotal: () => number;
  getDeudasAhorroTotal: () => number;
  getSurplus: (salarioNeto: number) => number;
}

const NECESIDADES_KEYS: MonthlyExpenseKey[] = [
  "vivienda",
  "alimentacion",
  "transporte",
  "servicios",
  "salud",
];
const GUSTOS_KEYS: MonthlyExpenseKey[] = [
  "entretenimiento",
  "ropa",
  "suscripciones",
];
const DEUDAS_AHORRO_KEYS: MonthlyExpenseKey[] = ["deudas", "ahorro"];

function sumKeys(expenses: MonthlyExpenses, keys: MonthlyExpenseKey[]) {
  return keys.reduce((sum, k) => sum + (expenses[k] || 0), 0);
}

export const useMonthlyExpensesStore = create<MonthlyExpensesState>(
  (set, get) => ({
    expenses: { ...EMPTY_MONTHLY_EXPENSES },
    hydrated: false,

    hydrate: () => {
      set({ expenses: readExpenses(), hydrated: true });
    },

    setExpense: (key, value) => {
      const expenses = { ...get().expenses, [key]: Math.max(0, value) };
      writeExpenses(expenses);
      set({ expenses });
    },

    getTotal: () => {
      const e = get().expenses;
      return Object.values(e).reduce((s, v) => s + v, 0);
    },

    getNecesidadesTotal: () => sumKeys(get().expenses, NECESIDADES_KEYS),
    getGustosTotal: () => sumKeys(get().expenses, GUSTOS_KEYS),
    getDeudasAhorroTotal: () => sumKeys(get().expenses, DEUDAS_AHORRO_KEYS),

    getSurplus: (salarioNeto) => {
      const sobra = salarioNeto - get().getTotal();
      return Math.round(Math.max(0, sobra) * 100) / 100;
    },
  }),
);
