"use client";

import { calcular503020 } from "@/lib/salary";
import { formatCurrency } from "@/lib/format";
import { useSalaryStore } from "@/stores/salary-store";

export function ShareableResultWidget({ id }: { id: string }) {
  const result = useSalaryStore((s) => s.result);
  if (!result) return null;

  const buckets = calcular503020(result.salarioNeto);

  return (
    <div
      id={id}
      className="w-[360px] space-y-3 rounded-2xl border bg-white p-6 text-black"
    >
      <h3 className="text-lg font-bold text-[#006B5E]">Calculadora Salarial SV</h3>
      <p className="text-sm">Bruto: {formatCurrency(result.salarioBruto)}</p>
      <p className="text-sm">
        Deducciones: {formatCurrency(result.totalDeducciones)}
      </p>
      <p className="text-xl font-bold">
        Neto: {formatCurrency(result.salarioNeto)}
      </p>
      <div className="border-t pt-2 text-sm">
        <p>50% Necesidades: {formatCurrency(buckets.necesidades)}</p>
        <p>30% Gustos: {formatCurrency(buckets.gustos)}</p>
        <p>20% Ahorro: {formatCurrency(buckets.ahorros)}</p>
      </div>
      <p className="text-xs text-gray-500">El Salvador · 2026 · Estimación</p>
    </div>
  );
}
