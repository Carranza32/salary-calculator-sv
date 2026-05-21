"use client";

import { create } from "zustand";
import type { SalaryHistoryEntry, TenureKey } from "@/lib/salary/types";
import {
  getSalaryHistory,
  setSalaryHistory,
} from "@/lib/storage/local-storage";
import { calcularSalario } from "@/lib/salary";

interface HistoryState {
  entries: SalaryHistoryEntry[];
  hydrated: boolean;
  hydrate: () => void;
  saveEntry: (params: {
    salarioBruto: number;
    afpEntidad: string;
    tenure?: TenureKey;
    title?: string;
  }) => void;
  removeEntry: (id: string) => void;
  clearAll: () => void;
}

function persist(entries: SalaryHistoryEntry[]) {
  const sorted = [...entries].sort(
    (a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime(),
  );
  setSalaryHistory(sorted);
  return sorted;
}

export const useHistoryStore = create<HistoryState>((set, get) => ({
  entries: [],
  hydrated: false,

  hydrate: () => {
    set({ entries: getSalaryHistory(), hydrated: true });
  },

  saveEntry: ({ salarioBruto, afpEntidad, tenure, title }) => {
    const result = calcularSalario(salarioBruto, afpEntidad);
    const entry: SalaryHistoryEntry = {
      id: crypto.randomUUID(),
      salarioBruto: result.salarioBruto,
      salarioNeto: result.salarioNeto,
      salarioNetoQuincenal: result.salarioNetoQuincenal,
      afpTrabajador: result.afpTrabajador,
      isssTrabajador: result.isssTrabajador,
      renta: result.renta,
      totalDeducciones: result.totalDeducciones,
      afpEntidad: result.afpEntidad,
      fecha: new Date().toISOString(),
      title: title?.slice(0, 50),
      tenure,
    };
    const entries = persist([entry, ...get().entries]);
    set({ entries });
  },

  removeEntry: (id) => {
    const entries = persist(get().entries.filter((e) => e.id !== id));
    set({ entries });
  },

  clearAll: () => {
    persist([]);
    set({ entries: [] });
  },
}));
