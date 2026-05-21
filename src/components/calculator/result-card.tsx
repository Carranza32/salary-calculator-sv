"use client";

import { useSalaryStore } from "@/stores/salary-store";
import { formatCurrency } from "@/lib/format";

export function ResultCard() {
  const result = useSalaryStore((s) => s.result);

  if (!result || result.salarioBruto <= 0) return null;

  const quincena = result.salarioNeto / 2;

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1D9E75]/90 to-[#147a59]/90 p-8 shadow-xl backdrop-blur-xl border border-white/20 text-white transition-all duration-500 ease-out">
      {/* Elementos decorativos para el efecto Frost/Glass */}
      <div className="pointer-events-none absolute -right-12 -top-12 h-48 w-48 rounded-full bg-white/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-12 -left-12 h-40 w-40 rounded-full bg-[#1D9E75]/50 blur-2xl" />

      <div className="relative z-10 flex flex-col gap-6">
        <div>
          <p className="text-sm font-medium text-emerald-100 uppercase tracking-wider mb-1">
            Recibirás cada mes
          </p>
          <p className="text-5xl font-extrabold tracking-tight tabular-nums drop-shadow-sm">
            {formatCurrency(result.salarioNeto)}
          </p>
        </div>

        <div className="h-[1px] w-full bg-emerald-400/30 rounded-full" />

        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-emerald-100">
              Cada quincena
            </p>
            <p className="text-2xl font-bold tabular-nums drop-shadow-sm">
              {formatCurrency(quincena)}
            </p>
          </div>

          <div className="text-right text-xs text-emerald-200/80 max-w-[120px] leading-tight">
            Calculado según tabla ISR 2025
          </div>
        </div>
      </div>
    </div>
  );
}
