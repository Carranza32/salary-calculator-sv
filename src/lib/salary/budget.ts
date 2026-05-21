import {
  BUCKET_AHORROS_RATE,
  BUCKET_GUSTOS_RATE,
  BUCKET_NECESIDADES_RATE,
} from "./constants";
import type { Budget503020, BudgetSummary, Expense, ExpenseCategory } from "./types";

function round2(value: number): number {
  return Math.round(value * 100) / 100;
}

export function calcular503020(salarioNeto: number): Budget503020 {
  const necesidades = round2(salarioNeto * BUCKET_NECESIDADES_RATE);
  const gustos = round2(salarioNeto * BUCKET_GUSTOS_RATE);
  const ahorros = round2(salarioNeto * BUCKET_AHORROS_RATE);

  return {
    necesidades,
    necesidadesQuincenal: round2(necesidades / 2),
    gustos,
    gustosQuincenal: round2(gustos / 2),
    ahorros,
    ahorrosQuincenal: round2(ahorros / 2),
  };
}

export function sumarGastosPorCategoria(
  gastos: Expense[],
  categoria: ExpenseCategory,
): number {
  return round2(
    gastos
      .filter((g) => g.categoria === categoria)
      .reduce((sum, g) => sum + g.monto, 0),
  );
}

export function calcularAhorroAutomatico(
  salarioNeto: number,
  totalNecesidades: number,
  totalGustos: number,
): number {
  return round2(Math.max(0, salarioNeto - totalNecesidades - totalGustos));
}

export function calcularBudgetSummary(
  salarioNeto: number,
  gastos: Expense[],
): BudgetSummary {
  const buckets = calcular503020(salarioNeto);
  const totalNecesidades = sumarGastosPorCategoria(gastos, "necesidades");
  const totalGustos = sumarGastosPorCategoria(gastos, "gustos");
  const totalAhorros = calcularAhorroAutomatico(
    salarioNeto,
    totalNecesidades,
    totalGustos,
  );

  const saldoRestante = round2(
    salarioNeto - totalNecesidades - totalGustos - totalAhorros,
  );

  const pct = (gastado: number) =>
    salarioNeto > 0 ? round2((gastado / salarioNeto) * 100) : 0;

  return {
    presupuestoNecesidades: buckets.necesidades,
    presupuestoGustos: buckets.gustos,
    presupuestoAhorros: buckets.ahorros,
    totalNecesidades,
    totalGustos,
    totalAhorros,
    saldoRestante,
    diferenciaNecesidades: round2(buckets.necesidades - totalNecesidades),
    diferenciaGustos: round2(buckets.gustos - totalGustos),
    diferenciaAhorros: round2(buckets.ahorros - totalAhorros),
    porcentajeNecesidades: pct(totalNecesidades),
    porcentajeGustos: pct(totalGustos),
    porcentajeAhorros: pct(totalAhorros),
    estaDentroPresupuesto: saldoRestante >= 0,
  };
}

export function getHistoryDisplayTitle(entry: {
  title?: string;
  nota?: string;
  fecha: string;
}): string {
  if (entry.title?.trim()) return entry.title.trim();
  if (entry.nota?.trim()) return entry.nota.trim();
  const date = new Date(entry.fecha);
  const formatted = date.toLocaleDateString("es-SV", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
  return `Cálculo ${formatted}`;
}
