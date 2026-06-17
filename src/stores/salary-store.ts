"use client";

import { create } from "zustand";
import {
  calcularBeneficiosAnuales,
  calcularSalario,
  calcularSalarioInverso,
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
  
  // New States
  mode: "bruto_a_neto" | "neto_a_bruto";
  contractType: "planilla" | "servicios";
  viewPerspective: "empleado" | "empleador";
  includeInsaforp: boolean;

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
  
  // New Actions
  setMode: (mode: "bruto_a_neto" | "neto_a_bruto") => void;
  setContractType: (type: "planilla" | "servicios") => void;
  setViewPerspective: (perspective: "empleado" | "empleador") => void;
  setIncludeInsaforp: (include: boolean) => void;
}

function compute(
  salary: number,
  afpEntity: string,
  tenure: TenureKey,
  mode: "bruto_a_neto" | "neto_a_bruto",
  contractType: "planilla" | "servicios",
  includeInsaforp: boolean
) {
  if (salary <= 0) {
    return { result: null, benefits: null };
  }
  const isFreelance = contractType === "servicios";
  
  let raw;
  if (mode === "neto_a_bruto") {
    raw = calcularSalarioInverso(salary, afpEntity, isFreelance);
  } else {
    raw = calcularSalario(salary, afpEntity, isFreelance);
  }

  return {
    result: enrichSalaryResult(raw, includeInsaforp),
    benefits: calcularBeneficiosAnuales(raw.salarioBruto, tenure),
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
  
  // Default values for new states
  mode: "bruto_a_neto",
  contractType: "planilla",
  viewPerspective: "empleado",
  includeInsaforp: false,

  persist: () => {
    const {
      salary,
      afpEntity,
      tenure,
      simulatedNetSalary,
      distribution,
      mode,
      contractType,
      viewPerspective,
      includeInsaforp,
    } = get();
    
    setCurrentSalary({
      salary,
      afp_entity: afpEntity,
      tenure,
      simulated_net_salary: simulatedNetSalary ?? undefined,
      distribution_pct: distribution,
      mode,
      contract_type: contractType,
      view_perspective: viewPerspective,
      include_insaforp: includeInsaforp,
    });
  },

  hydrate: () => {
    const stored = getCurrentSalary();
    const mode = stored.mode ?? "bruto_a_neto";
    const contractType = stored.contract_type ?? "planilla";
    const viewPerspective = stored.view_perspective ?? "empleado";
    const includeInsaforp = stored.include_insaforp ?? false;

    const { result, benefits } = compute(
      stored.salary,
      stored.afp_entity,
      stored.tenure,
      mode,
      contractType,
      includeInsaforp
    );

    set({
      salary: stored.salary,
      afpEntity: stored.afp_entity,
      tenure: stored.tenure,
      simulatedNetSalary: stored.simulated_net_salary ?? null,
      distribution: stored.distribution_pct ?? { ...DEFAULT_DISTRIBUTION },
      mode,
      contractType,
      viewPerspective,
      includeInsaforp,
      result,
      benefits,
      hydrated: true,
    });
  },

  recalculate: () => {
    const { salary, afpEntity, tenure, mode, contractType, includeInsaforp } = get();
    const { result, benefits } = compute(
      salary,
      afpEntity,
      tenure,
      mode,
      contractType,
      includeInsaforp
    );
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

  // Setters for new states
  setMode: (mode) => {
    set({ mode });
    get().recalculate();
  },

  setContractType: (contractType) => {
    const viewPerspective = contractType === "servicios" ? "empleado" : get().viewPerspective;
    set({ contractType, viewPerspective });
    get().recalculate();
  },

  setViewPerspective: (viewPerspective) => {
    set({ viewPerspective });
    get().persist();
  },

  setIncludeInsaforp: (includeInsaforp) => {
    set({ includeInsaforp });
    get().recalculate();
  },
}));
