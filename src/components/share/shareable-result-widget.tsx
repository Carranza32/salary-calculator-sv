"use client";

import { calcular503020 } from "@/lib/salary";
import { formatCurrency } from "@/lib/format";
import { useSalaryStore } from "@/stores/salary-store";
import { Landmark, HeartPulse, Receipt, Sparkles, Award } from "lucide-react";

export function ShareableResultWidget({ id }: { id: string }) {
  const result = useSalaryStore((s) => s.result);
  const viewPerspective = useSalaryStore((s) => s.viewPerspective);
  const includeInsaforp = useSalaryStore((s) => s.includeInsaforp);
  
  if (!result) return null;

  const isFreelance = result.isFreelance;
  const isEmployer = viewPerspective === "empleador" && !isFreelance;
  
  // Dynamic background style and headers
  const bgStyle = isEmployer
    ? "linear-gradient(135deg, #1e1b4b 0%, #312e81 40%, #4f46e5 100%)" // Indigo gradient for Employer
    : "linear-gradient(135deg, #022c22 0%, #064e3b 40%, #10b981 100%)"; // Emerald gradient for Employee

  const typeBadge = isFreelance
    ? "Servicios Profesionales (10% Renta)"
    : isEmployer
    ? "Perspectiva de Empresa / Patrono"
    : "Planilla Colaborador (Ley)";

  const mainAmount = isEmployer
    ? result.salarioBruto + result.deduccionesTotalesPatronales + (includeInsaforp ? result.insaforpPatronal : 0)
    : result.salarioNeto;

  const mainLabel = isEmployer
    ? "Costo Total Mensual"
    : "Salario Neto (Líquido)";

  const buckets = calcular503020(result.salarioNeto);

  return (
    <div
      id={id}
      className="w-[380px] rounded-[2rem] p-7 text-white font-sans overflow-hidden flex flex-col justify-between relative border border-white/10"
      style={{
        background: bgStyle,
        boxShadow: "0 25px 50px -12px rgba(0,0,0,0.5)",
      }}
    >
      {/* Background glowing blobs */}
      <div className="absolute top-0 right-0 w-24 h-24 rounded-full bg-white/5 blur-2xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-32 h-32 rounded-full bg-white/5 blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="relative z-10 flex items-center justify-between border-b border-white/10 pb-4 mb-4">
        <div>
          <h3 className="text-xs font-black tracking-wider uppercase opacity-90">
            Calculadora Salarial SV
          </h3>
          <span className="text-[9px] font-bold bg-white/10 text-white/90 px-2 py-0.5 rounded-full mt-1 inline-block border border-white/10">
            {typeBadge}
          </span>
        </div>
        <Sparkles className="h-5 w-5 text-white/70" />
      </div>

      {/* Main Hero Amount */}
      <div className="relative z-10 text-center py-4 bg-white/5 rounded-2xl border border-white/10 shadow-inner mb-4">
        <span className="text-[10px] font-bold uppercase tracking-wider text-white/60">
          {mainLabel}
        </span>
        <div className="text-3xl font-black tracking-tight mt-1 font-mono">
          {formatCurrency(mainAmount)}
        </div>
        <span className="text-[10px] text-white/50 mt-1 block">
          Bruto: {formatCurrency(result.salarioBruto)}
        </span>
      </div>

      {/* Details Breakdown */}
      <div className="relative z-10 space-y-2 mb-4">
        <h4 className="text-[9px] font-black uppercase tracking-wider text-white/55 px-1">
          Desglose Mensual
        </h4>

        {isFreelance ? (
          <div className="bg-white/5 rounded-xl border border-white/10 p-3 space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-white/60">Honorarios Brutos</span>
              <span className="font-bold">{formatCurrency(result.salarioBruto)}</span>
            </div>
            <div className="flex justify-between text-red-300">
              <span>Retención ISR (10%)</span>
              <span className="font-semibold">-{formatCurrency(result.renta)}</span>
            </div>
          </div>
        ) : (
          <div className="bg-white/5 rounded-xl border border-white/10 p-3 space-y-2 text-xs">
            {/* Empleado deductions */}
            <div className="flex justify-between">
              <span className="text-white/60">Salario Bruto</span>
              <span className="font-bold">{formatCurrency(result.salarioBruto)}</span>
            </div>
            <div className="flex justify-between text-red-300/90">
              <span className="flex items-center gap-1">
                <Landmark className="h-3 w-3" /> AFP (7.25%)
              </span>
              <span className="font-mono">-{formatCurrency(result.afpTrabajador)}</span>
            </div>
            <div className="flex justify-between text-red-300/90">
              <span className="flex items-center gap-1">
                <HeartPulse className="h-3 w-3" /> ISSS (3.0%)
              </span>
              <span className="font-mono">-{formatCurrency(result.isssTrabajador)}</span>
            </div>
            <div className="flex justify-between text-red-300/90">
              <span className="flex items-center gap-1">
                <Receipt className="h-3 w-3" /> ISR Renta
              </span>
              <span className="font-mono">-{formatCurrency(result.renta)}</span>
            </div>

            {/* Employer contributions if applicable */}
            {isEmployer && (
              <>
                <div className="border-t border-white/10 my-2 pt-2 flex justify-between text-indigo-200">
                  <span className="flex items-center gap-1">
                    <Landmark className="h-3 w-3" /> AFP Patronal (8.75%)
                  </span>
                  <span className="font-mono">+{formatCurrency(result.afpPatronal)}</span>
                </div>
                <div className="flex justify-between text-indigo-200">
                  <span className="flex items-center gap-1">
                    <HeartPulse className="h-3 w-3" /> ISSS Patronal (7.5%)
                  </span>
                  <span className="font-mono">+{formatCurrency(result.isssPatronal)}</span>
                </div>
                {includeInsaforp && (
                  <div className="flex justify-between text-indigo-200">
                    <span className="flex items-center gap-1">
                      <Award className="h-3 w-3" /> INSAFORP (1.0%)
                    </span>
                    <span className="font-mono">+{formatCurrency(result.insaforpPatronal)}</span>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>

      {/* Rule 50/30/20 or employer extra benefits summary */}
      {!isEmployer && !isFreelance && (
        <div className="relative z-10 bg-white/5 rounded-xl border border-white/10 p-3 mb-4 text-[11px] space-y-1">
          <div className="text-[9px] font-bold text-white/55 uppercase tracking-wider mb-1">
            Recomendación de Presupuesto (50/30/20)
          </div>
          <div className="flex justify-between text-emerald-200">
            <span>Necesidades (50%):</span>
            <span className="font-bold font-mono">{formatCurrency(buckets.necesidades)}</span>
          </div>
          <div className="flex justify-between text-blue-200">
            <span>Gustos (30%):</span>
            <span className="font-bold font-mono">{formatCurrency(buckets.gustos)}</span>
          </div>
          <div className="flex justify-between text-purple-200">
            <span>Ahorro (20%):</span>
            <span className="font-bold font-mono">{formatCurrency(buckets.ahorros)}</span>
          </div>
        </div>
      )}

      {isEmployer && (
        <div className="relative z-10 bg-indigo-950/40 rounded-xl border border-indigo-800/30 p-3 mb-4 text-[11px] text-indigo-200 flex justify-between">
          <span>Total Cargas Sociales:</span>
          <span className="font-black font-mono">
            +{formatCurrency(result.deduccionesTotalesPatronales + (includeInsaforp ? result.insaforpPatronal : 0))}
          </span>
        </div>
      )}

      {/* Footer */}
      <div className="relative z-10 flex items-center justify-between border-t border-white/10 pt-4 mt-1 text-[9px] text-white/60">
        <span>salary-calculator-sv.vercel.app</span>
        <span>El Salvador · 2026</span>
      </div>
    </div>
  );
}
