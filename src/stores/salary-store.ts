"use client";

import { create } from "zustand";
import {
  calcularBeneficiosAnuales,
  calcularSalario,
  DEFAULT_DISTRIBUTION,
  enrichSalaryResult,
} from "@/lib/salary";
import type { DistributionPct } from "@/lib/salary/distribution";
import { DEFAULT_AFP_ENTIDAD, DEFAULT_TENURE } from "@/lib/salary/constants";
import type {
  BenefitsProjection,
  SalaryResultComputed,
  TenureKey,
} from "@/lib/salary/types";
import {
  getCurrentSalary,
  setCurrentSalary,
} from "@/lib/storage/local-storage";

interface SalaryState {
  salary: number;
  afpEntity: string;
  tenure: TenureKey;
  simulatedNetSalary: number | null;
  distribution: DistributionPct;
  hydrated: boolean;
  result: SalaryResultComputed | null;
  benefits: BenefitsProjection | null;
  setSalary: (salary: number) => void;
  setAfpEntity: (entity: string) => void;
  setTenure: (tenure: TenureKey) => void;
  setDistribution: (distribution: DistributionPct) => void;
  setSimulatedNetSalary: (value: number | null) => void;
  clearSimulation: () => void;
  hydrate: () => void;
  recalculate: () => void;
  getEffectiveNetSalary: () => number;
  persist: () => void;
}

function compute(salary: number, afpEntity: string, tenure: TenureKey) {
  if (salary <= 0) {
    return { result: null, benefits: null };
  }
  const raw = calcularSalario(salary, afpEntity);
  return {
    result: enrichSalaryResult(raw),
    benefits: calcularBeneficiosAnuales(salary, tenure),
  };
}

export const useSalaryStore = create<SalaryState>((set, get) => ({
  salary: 0,
  afpEntity: DEFAULT_AFP_ENTIDAD,
  tenure: DEFAULT_TENURE,
  simulatedNetSalary: null,
  distribution: { ...DEFAULT_DISTRIBUTION },
  hydrated: false,
  result: null,
  benefits: null,

  persist: () => {
    const { salary, afpEntity, tenure, simulatedNetSalary, distribution } = get();
    setCurrentSalary({
      salary,
      afp_entity: afpEntity,
      tenure,
      simulated_net_salary: simulatedNetSalary ?? undefined,
      distribution_pct: distribution,
    });
  },

  hydrate: () => {
    const stored = getCurrentSalary();
    const { result, benefits } = compute(
      stored.salary,
      stored.afp_entity,
      stored.tenure,
    );
    set({
      salary: stored.salary,
      afpEntity: stored.afp_entity,
      tenure: stored.tenure,
      simulatedNetSalary: stored.simulated_net_salary ?? null,
      distribution: stored.distribution_pct ?? { ...DEFAULT_DISTRIBUTION },
      result,
      benefits,
      hydrated: true,
    });
  },

  recalculate: () => {
    const { salary, afpEntity, tenure } = get();
    const { result, benefits } = compute(salary, afpEntity, tenure);
    set({ result, benefits });
    get().persist();
  },

  setSalary: (salary) => {
    set({ salary });
    get().recalculate();
  },

  setAfpEntity: (afpEntity) => {
    set({ afpEntity });
    get().recalculate();
  },

  setTenure: (tenure) => {
    set({ tenure });
    get().recalculate();
  },

  setDistribution: (distribution) => {
    set({ distribution });
    get().persist();
  },

  setSimulatedNetSalary: (value) => {
    set({ simulatedNetSalary: value });
    get().persist();
  },

  clearSimulation: () => {
    get().setSimulatedNetSalary(null);
  },

  getEffectiveNetSalary: () => {
    const { simulatedNetSalary, result } = get();
    if (simulatedNetSalary != null && simulatedNetSalary > 0) {
      return simulatedNetSalary;
    }
    return result?.salarioNeto ?? 0;
  },
}));
