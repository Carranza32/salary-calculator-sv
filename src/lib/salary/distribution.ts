import {
  BUCKET_AHORROS_RATE,
  BUCKET_GUSTOS_RATE,
  BUCKET_NECESIDADES_RATE,
} from "./constants";

export type DistributionKey = "necesidades" | "gustos" | "ahorros";

export interface DistributionPct {
  necesidades: number;
  gustos: number;
  ahorros: number;
}

export const DEFAULT_DISTRIBUTION: DistributionPct = {
  necesidades: Math.round(BUCKET_NECESIDADES_RATE * 100),
  gustos: Math.round(BUCKET_GUSTOS_RATE * 100),
  ahorros: Math.round(BUCKET_AHORROS_RATE * 100),
};

export type DiagnosticStatus = "saludable" | "ajustado" | "en_riesgo";

export interface DistributionDiagnostic {
  status: DiagnosticStatus;
  label: string;
  ahorroPct: number;
  message: string;
}

function round2(value: number): number {
  return Math.round(value * 100) / 100;
}

const KEYS: DistributionKey[] = ["necesidades", "gustos", "ahorros"];

/** Ajusta los otros dos buckets al mover un slider; siempre suman 100. */
export function adjustDistribution(
  current: DistributionPct,
  changed: DistributionKey,
  newValue: number,
): DistributionPct {
  const minPct = 5;
  const maxPct = 90;
  const clamped = Math.max(minPct, Math.min(maxPct, Math.round(newValue)));
  const others = KEYS.filter((k) => k !== changed);
  const remaining = 100 - clamped;
  const otherSum = others.reduce((sum, key) => sum + current[key], 0);

  const next: DistributionPct = { ...current, [changed]: clamped };

  if (otherSum <= 0) {
    const half = Math.floor(remaining / 2);
    next[others[0]] = half;
    next[others[1]] = remaining - half;
    return next;
  }

  let allocated = 0;
  others.forEach((key, index) => {
    if (index === others.length - 1) {
      next[key] = remaining - allocated;
    } else {
      const share = Math.round((current[key] / otherSum) * remaining);
      next[key] = share;
      allocated += share;
    }
  });

  const sum = next.necesidades + next.gustos + next.ahorros;
  if (sum !== 100) {
    next[others[others.length - 1]] += 100 - sum;
  }

  return next;
}

export function amountsFromDistribution(
  salarioNeto: number,
  distribution: DistributionPct,
): DistributionPct {
  return {
    necesidades: round2((salarioNeto * distribution.necesidades) / 100),
    gustos: round2((salarioNeto * distribution.gustos) / 100),
    ahorros: round2((salarioNeto * distribution.ahorros) / 100),
  };
}

export function getDistributionDiagnostic(
  distribution: DistributionPct,
  options?: { gastosExcedenNeto?: boolean },
): DistributionDiagnostic {
  const ahorroPct = distribution.ahorros;

  if (options?.gastosExcedenNeto || ahorroPct < 5) {
    return {
      status: "en_riesgo",
      label: "En riesgo",
      ahorroPct,
      message:
        ahorroPct < 5
          ? "Tu ahorro planificado es muy bajo. Revisa gastos o ingresos."
          : "Tus gastos superan tu salario neto.",
    };
  }

  if (ahorroPct >= 15) {
    return {
      status: "saludable",
      label: "Saludable",
      ahorroPct,
      message: "Buen equilibrio: priorizas ahorro y estabilidad financiera.",
    };
  }

  return {
    status: "ajustado",
    label: "Ajustado",
    ahorroPct,
    message: "Vas bien, pero un poco más de ahorro te daría más margen.",
  };
}
