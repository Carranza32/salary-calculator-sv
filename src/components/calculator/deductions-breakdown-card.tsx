"use client";

import { formatCurrency } from "@/lib/format";
import { useSalaryStore } from "@/stores/salary-store";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Landmark,
  HeartPulse,
  Receipt,
  Calendar,
  Palmtree,
  ShieldAlert,
  Coins,
  Building2,
  HelpCircle,
} from "lucide-react";

interface DeductionsBreakdownProps {
  view?: "all" | "deductions-only" | "accordions-only";
}

export function DeductionsBreakdownCard({ view = "all" }: DeductionsBreakdownProps) {
  const result = useSalaryStore((s) => s.result);
  const benefits = useSalaryStore((s) => s.benefits);
  const includeInsaforp = useSalaryStore((s) => s.includeInsaforp);
  const setIncludeInsaforp = useSalaryStore((s) => s.setIncludeInsaforp);
  const viewPerspective = useSalaryStore((s) => s.viewPerspective);

  if (!result || result.salarioBruto <= 0) return null;

  const isFreelance = result.isFreelance;

  // Compute segments for the multi-segmented progress bar
  let segments: { label: string; value: number; color: string }[] = [];

  if (viewPerspective === "empleado" || isFreelance) {
    if (isFreelance) {
      segments = [
        { label: "Salario Neto (Líquido)", value: result.salarioNeto, color: "#1D9E75" },
        { label: "Retención Renta (10%)", value: result.renta, color: "#EF4444" },
      ];
    } else {
      segments = [
        { label: "Salario Neto (Líquido)", value: result.salarioNeto, color: "#1D9E75" },
        { label: "AFP Colaborador (7.25%)", value: result.afpTrabajador, color: "#7C3AED" },
        { label: "ISSS Colaborador (3%)", value: result.isssTrabajador, color: "#2563EB" },
        { label: "Retención Renta (ISR)", value: result.renta, color: "#EF4444" },
      ];
    }
  } else {
    // Employer view (planilla only)
    segments = [
      { label: "Salario Neto (Líquido)", value: result.salarioNeto, color: "#1D9E75" },
      { label: "AFP Colaborador (7.25%)", value: result.afpTrabajador, color: "#7C3AED" },
      { label: "ISSS Colaborador (3%)", value: result.isssTrabajador, color: "#2563EB" },
      { label: "Retención Renta (ISR)", value: result.renta, color: "#EF4444" },
      { label: "AFP Patronal (8.75%)", value: result.afpPatronal, color: "#A855F7" },
      { label: "ISSS Patronal (7.5%)", value: result.isssPatronal, color: "#6366F1" },
    ];
    if (includeInsaforp) {
      segments.push({ label: "INSAFORP Patronal (1%)", value: result.insaforpPatronal, color: "#64748B" });
    }
  }

  const sumTotal = segments.reduce((sum, item) => sum + item.value, 0);
  const segmentsWithPct = segments.map((item) => ({
    ...item,
    percentage: sumTotal > 0 ? (item.value / sumTotal) * 100 : 0,
  }));

  // Render for independent contractors / services contracts
  if (isFreelance) {
    if (view === "accordions-only") return null;
    return (
      <div className="space-y-4 animate-in fade-in duration-300 w-full">
        <div className="rounded-3xl p-6 overflow-hidden flex flex-col justify-between" style={{ background: "rgba(255,255,255,0.85)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)", border: "1px solid rgba(255,255,255,0.65)", boxShadow: "0 8px 32px -8px rgba(0,0,0,0.12), 0 2px 10px -2px rgba(0,0,0,0.07), inset 0 1px 0 rgba(255,255,255,0.95), inset 0 -1px 0 rgba(0,0,0,0.03)" }}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-6">
            <div>
              <h3 className="text-xl font-bold tracking-tight">
                Retención de Servicios Profesionales
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                Modalidad freelance de facturación: retención del 10% fijo de Impuesto sobre la Renta.
              </p>
            </div>
            <div className="rounded-2xl bg-destructive/5 border border-destructive/10 px-5 py-4 sm:text-right flex items-center sm:items-end justify-between sm:flex-col gap-2">
              <span className="text-xs font-bold text-destructive uppercase tracking-wider">
                Total Retenido (10%)
              </span>
              <span className="text-2xl font-black text-destructive tabular-nums leading-none">
                {formatCurrency(result.totalDeducciones)}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div className="rounded-2xl bg-muted/20 p-5 border border-border/40 flex flex-col max-w-sm">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-10 h-10 flex items-center justify-center bg-background rounded-xl shadow-sm border border-border/50 text-muted-foreground">
                  <Receipt className="h-5 w-5" />
                </div>
                <span className="font-semibold text-sm">Retención ISR Renta (10%)</span>
              </div>
              <span className="text-2xl font-bold tabular-nums tracking-tight mb-1">
                {formatCurrency(result.renta)}
              </span>
              <span className="text-xs text-muted-foreground">
                Monto fijo descontado sobre honorarios brutos
              </span>
            </div>

            {/* Barra de progreso integrada para Freelance */}
            <div className="space-y-3">
              <h4 className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider px-1">
                Distribución Visual del Honorario
              </h4>
              <div className="w-full h-5 rounded-full bg-muted/50 overflow-hidden flex shadow-inner border border-border/20">
                {segmentsWithPct.map((s, idx) => {
                  if (s.percentage <= 0) return null;
                  return (
                    <div
                      key={idx}
                      className="relative group cursor-pointer h-full transition-opacity hover:opacity-90 flex-shrink-0"
                      style={{
                        width: `${s.percentage}%`,
                        backgroundColor: s.color,
                      }}
                    >
                      <div className="w-full h-full" />
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:flex flex-col items-center z-50 pointer-events-none">
                        <div className="bg-popover text-popover-foreground text-[11px] font-semibold px-2.5 py-1.5 rounded-lg border border-border shadow-lg whitespace-nowrap flex flex-col items-center gap-0.5">
                          <span className="text-muted-foreground text-[10px]">{s.label}</span>
                          <span className="text-foreground text-xs font-bold font-mono">
                            {formatCurrency(s.value)} ({s.percentage.toFixed(1)}%)
                          </span>
                        </div>
                        <div className="w-1.5 h-1.5 bg-popover border-r border-b border-border rotate-45 -mt-1" />
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="flex flex-wrap gap-x-4 gap-y-1 px-1 text-xs font-medium text-muted-foreground">
                {segmentsWithPct.map((s, idx) => (
                  <div key={idx} className="flex items-center gap-1.5">
                    <span
                      className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                      style={{ backgroundColor: s.color }}
                    />
                    <span>
                      {s.label.split(" (")[0]} ({s.percentage.toFixed(1)}%)
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Planilla mode (Asalariado)
  const showDeductions = view === "all" || view === "deductions-only";
  const showAccordions = view === "all" || view === "accordions-only";

  const insaforp = includeInsaforp ? result.insaforpPatronal : 0;
  const costoTotalPatronal = result.salarioBruto + result.deduccionesTotalesPatronales + insaforp;
  const markupPct = (((result.deduccionesTotalesPatronales + insaforp) / result.salarioBruto) * 100).toFixed(1);

  const extraPct = benefits
    ? ((benefits.total / (result.salarioBruto * 12)) * 100).toFixed(1)
    : "0.0";

  // Tenure labels descriptive
  const tenureDescriptions: Record<string, string> = {
    menos_1: "menos de 1 año (7 días)",
    "1_3": "1 a 3 años (15 días)",
    "3_10": "3 a 10 años (19 días)",
    mas_10: "más de 10 años (21 días)",
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 w-full">
      {/* 1. Tarjeta Principal de Descuentos de Ley */}
      {showDeductions && (
        <div className="rounded-3xl p-6 overflow-hidden flex flex-col justify-between flex-grow" style={{ background: "rgba(255,255,255,0.85)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)", border: "1px solid rgba(255,255,255,0.65)", boxShadow: "0 8px 32px -8px rgba(0,0,0,0.12), 0 2px 10px -2px rgba(0,0,0,0.07), inset 0 1px 0 rgba(255,255,255,0.95), inset 0 -1px 0 rgba(0,0,0,0.03)" }}>
          {/* Cabecera y Total */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8">
            <div>
              <h3 className="text-xl font-bold tracking-tight">
                Descuentos de Ley (Planilla)
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                Desglose exacto de las retenciones mensuales aplicadas al trabajador.
              </p>
            </div>
            <div className="rounded-2xl bg-destructive/5 border border-destructive/10 px-5 py-4 sm:text-right flex items-center sm:items-end justify-between sm:flex-col gap-2">
              <span className="text-xs font-bold text-destructive uppercase tracking-wider">
                Total Retenido
              </span>
              <span className="text-2xl font-black text-destructive tabular-nums leading-none">
                {formatCurrency(result.totalDeducciones)}
              </span>
            </div>
          </div>

          {/* Cuadrícula de los 3 descuentos */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="rounded-2xl bg-muted/20 p-5 border border-border/40 flex flex-col">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 flex items-center justify-center bg-background rounded-xl shadow-sm border border-border/50 text-muted-foreground">
                  <Landmark className="h-5 w-5" />
                </div>
                <span className="font-semibold text-sm">AFP (7.25%)</span>
              </div>
              <span className="text-2xl font-bold tabular-nums tracking-tight mb-1">
                {formatCurrency(result.afpTrabajador)}
              </span>
              <span className="text-xs text-muted-foreground">
                Tu aporte al fondo de pensión
              </span>
            </div>

            <div className="rounded-2xl bg-muted/20 p-5 border border-border/40 flex flex-col">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 flex items-center justify-center bg-background rounded-xl shadow-sm border border-border/50 text-muted-foreground">
                  <HeartPulse className="h-5 w-5" />
                </div>
                <span className="font-semibold text-sm">ISSS (3%)</span>
              </div>
              <span className="text-2xl font-bold tabular-nums tracking-tight mb-1">
                {formatCurrency(result.isssTrabajador)}
              </span>
              <span className="text-xs text-muted-foreground">
                Seguro social (Tope base $1,000)
              </span>
            </div>

            <div className="rounded-2xl bg-muted/20 p-5 border border-border/40 flex flex-col">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 flex items-center justify-center bg-background rounded-xl shadow-sm border border-border/50 text-muted-foreground">
                  <Receipt className="h-5 w-5" />
                </div>
                <span className="font-semibold text-sm">Renta (ISR)</span>
              </div>
              <span className="text-2xl font-bold tabular-nums tracking-tight mb-1">
                {formatCurrency(result.renta)}
              </span>
              <span className="text-xs text-muted-foreground">
                Impuesto según tramo gravable
              </span>
            </div>
          </div>

          {/* Barra de Progreso Multi-segmentada Integrada */}
          <div className="pt-6 border-t border-border/40">
            <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3 px-1">
              Distribución Visual del Salario ({viewPerspective === "empleado" ? "Empleado" : "Costo Empresa"})
            </h4>
            <div className="w-full h-5 rounded-full bg-muted/50 overflow-hidden flex shadow-inner border border-border/20">
              {segmentsWithPct.map((s, idx) => {
                if (s.percentage <= 0) return null;
                return (
                  <div
                    key={idx}
                    className="relative group cursor-pointer h-full transition-opacity hover:opacity-90 flex-shrink-0"
                    style={{
                      width: `${s.percentage}%`,
                      backgroundColor: s.color,
                    }}
                  >
                    <div className="w-full h-full" />

                    {/* Tooltip con posicionamiento asegurado */}
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:flex flex-col items-center z-50 pointer-events-none">
                      <div className="bg-popover text-popover-foreground text-[11px] font-semibold px-2.5 py-1.5 rounded-lg border border-border shadow-lg whitespace-nowrap flex flex-col items-center gap-0.5">
                        <span className="text-muted-foreground text-[10px]">{s.label}</span>
                        <span className="text-foreground text-xs font-bold font-mono">
                          {formatCurrency(s.value)} ({s.percentage.toFixed(1)}%)
                        </span>
                      </div>
                      <div className="w-1.5 h-1.5 bg-popover border-r border-b border-border rotate-45 -mt-1" />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Leyenda de la barra */}
            <div className="flex flex-wrap gap-x-4 gap-y-2 mt-4 px-1 text-xs font-medium text-muted-foreground">
              {segmentsWithPct.map((s, idx) => (
                <div key={idx} className="flex items-center gap-1.5">
                  <span
                    className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                    style={{ backgroundColor: s.color }}
                  />
                  <span>
                    {s.label.split(" (")[0]} ({s.percentage.toFixed(1)}%)
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 2. Sección de Detalles y Prestaciones Expandidos */}
      {showAccordions && (
        <div className="space-y-6 w-full">

          {/* Card A: Prestaciones y Beneficios Anuales de Ley */}
          {benefits && (
            <div className="rounded-3xl p-6 md:p-8 overflow-hidden" style={{ background: "rgba(255,255,255,0.85)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)", border: "1px solid rgba(255,255,255,0.65)", boxShadow: "0 8px 32px -8px rgba(0,0,0,0.12), 0 2px 10px -2px rgba(0,0,0,0.07), inset 0 1px 0 rgba(255,255,255,0.95), inset 0 -1px 0 rgba(0,0,0,0.03)" }}>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 flex items-center justify-center bg-primary/10 rounded-2xl text-primary border border-primary/20 flex-shrink-0">
                  <Coins className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold tracking-tight">
                    Prestaciones y Beneficios Anuales de Ley
                  </h3>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    Derechos laborales acumulados al año que recibes en efectivo además de tu salario mensual.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
                {/* Desglose (Lado Izquierdo) */}
                <div className="lg:col-span-8 space-y-4">

                  {/* Aguinaldo */}
                  <div className="flex items-center justify-between gap-4 p-4 rounded-2xl hover:bg-muted/30 transition-all duration-200 border border-transparent hover:border-border/30 group">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 flex items-center justify-center bg-background rounded-xl shadow-sm border border-border/50 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0">
                        <Calendar className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                          Aguinaldo Anual
                        </h4>
                        <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                          Pago obligatorio en diciembre. Basado en antigüedad:{" "}
                          <span className="font-semibold text-foreground/80">
                            {tenureDescriptions[benefits.tenureKey] || ""}
                          </span>.
                        </p>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0 font-mono">
                      <span className="text-base font-bold text-foreground">
                        {formatCurrency(benefits.aguinaldo)}
                      </span>
                    </div>
                  </div>

                  {/* Vacaciones */}
                  <div className="flex items-center justify-between gap-4 p-4 rounded-2xl hover:bg-muted/30 transition-all duration-200 border border-transparent hover:border-border/30 group">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 flex items-center justify-center bg-background rounded-xl shadow-sm border border-border/50 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0">
                        <Palmtree className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                          Vacaciones + Prima Vacacional
                        </h4>
                        <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                          Pago al cumplir año laboral. Equivale a 15 días de salario base más 30% de prima vacacional obligatoria por ley.
                        </p>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0 font-mono">
                      <span className="text-base font-bold text-foreground">
                        {formatCurrency(benefits.vacaciones)}
                      </span>
                    </div>
                  </div>

                  {/* Indemnización */}
                  <div className="flex items-center justify-between gap-4 p-4 rounded-2xl hover:bg-muted/30 transition-all duration-200 border border-transparent hover:border-border/30 group">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 flex items-center justify-center bg-background rounded-xl shadow-sm border border-border/50 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0">
                        <ShieldAlert className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                          Indemnización Estimada (Reserva Anual)
                        </h4>
                        <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                          Fondo acumulado en caso de despido o compensación legal (equivalente estimado a 1 mes de salario base por año).
                        </p>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0 font-mono">
                      <span className="text-base font-bold text-foreground">
                        {formatCurrency(benefits.indemnizacion)}
                      </span>
                    </div>
                  </div>

                </div>

                {/* Resumen Héroe (Lado Derecho) */}
                <div className="lg:col-span-4 bg-primary/[0.03] dark:bg-primary/[0.01] border border-primary/20 rounded-2xl p-6 flex flex-col justify-center items-center text-center">
                  <span className="text-xs font-bold text-primary uppercase tracking-wider mb-2">
                    Total Anual Extra
                  </span>
                  <span className="text-3xl font-black text-primary tabular-nums tracking-tight font-mono mb-2">
                    {formatCurrency(benefits.total)}
                  </span>
                  <p className="text-xs text-muted-foreground max-w-[200px] leading-relaxed">
                    ¡Representa un ingreso adicional equivalente al{" "}
                    <span className="font-bold text-foreground">{extraPct}%</span> de tu salario anual bruto!
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Card B: ¿Cuánto le cuestas a tu empresa? (Costo Patronal Mensual) */}
          <div className="rounded-3xl p-6 md:p-8 overflow-hidden" style={{ background: "rgba(255,255,255,0.85)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)", border: "1px solid rgba(255,255,255,0.65)", boxShadow: "0 8px 32px -8px rgba(0,0,0,0.12), 0 2px 10px -2px rgba(0,0,0,0.07), inset 0 1px 0 rgba(255,255,255,0.95), inset 0 -1px 0 rgba(0,0,0,0.03)" }}>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 flex items-center justify-center bg-indigo-500/10 rounded-2xl text-indigo-500 border border-indigo-500/20 flex-shrink-0">
                <Building2 className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold tracking-tight">
                  Costo Total y Cargas Patronales (Mensual)
                </h3>
                <p className="text-sm text-muted-foreground mt-0.5">
                  Obligaciones económicas que asume el empleador por tenerte en planilla en El Salvador.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
              {/* Desglose (Lado Izquierdo) */}
              <div className="lg:col-span-8 space-y-4">

                {/* AFP Patronal */}
                <div className="flex items-center justify-between gap-4 p-4 rounded-2xl hover:bg-muted/30 transition-all duration-200 border border-transparent hover:border-border/30 group">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 flex items-center justify-center bg-background rounded-xl shadow-sm border border-border/50 text-muted-foreground group-hover:text-indigo-500 transition-colors flex-shrink-0">
                      <Landmark className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-foreground group-hover:text-indigo-500 transition-colors">
                        AFP Patronal (8.75%)
                      </h4>
                      <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                        Aporte del empleador al fondo de jubilación del colaborador. No tiene tope máximo.
                      </p>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0 font-mono">
                    <span className="text-base font-bold text-foreground">
                      {formatCurrency(result.afpPatronal)}
                    </span>
                  </div>
                </div>

                {/* ISSS Patronal */}
                <div className="flex items-center justify-between gap-4 p-4 rounded-2xl hover:bg-muted/30 transition-all duration-200 border border-transparent hover:border-border/30 group">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 flex items-center justify-center bg-background rounded-xl shadow-sm border border-border/50 text-muted-foreground group-hover:text-indigo-500 transition-colors flex-shrink-0">
                      <HeartPulse className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-foreground group-hover:text-indigo-500 transition-colors">
                        ISSS Patronal (7.5%)
                      </h4>
                      <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                        Aporte patronal de salud. Aplica un tope máximo de cotización sobre salarios de base hasta $1,000.
                      </p>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0 font-mono">
                    <span className="text-base font-bold text-foreground">
                      {formatCurrency(result.isssPatronal)}
                    </span>
                  </div>
                </div>

                {/* INSAFORP Switch/Aporte */}
                <div className="flex items-center justify-between gap-4 p-4 rounded-2xl hover:bg-muted/30 transition-all duration-200 border border-transparent hover:border-border/30 group">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 flex items-center justify-center bg-background rounded-xl shadow-sm border border-border/50 text-muted-foreground group-hover:text-indigo-500 transition-colors flex-shrink-0">
                      <HelpCircle className="h-5 w-5" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <label
                          htmlFor="insaforp-details"
                          className="text-sm font-semibold text-foreground cursor-pointer select-none group-hover:text-indigo-500 transition-colors"
                        >
                          Aporte INSAFORP (1.0%)
                        </label>
                        <Checkbox
                          id="insaforp-details"
                          checked={includeInsaforp}
                          onCheckedChange={(checked) => setIncludeInsaforp(!!checked)}
                          className="border-muted-foreground/50 data-[state=checked]:bg-indigo-500 data-[state=checked]:border-indigo-500"
                        />
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        Obligatorio solo para empresas con 10 o más empleados permanentes (Tope base $1,000).
                      </p>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0 font-mono">
                    <span className="text-base font-bold text-foreground">
                      {includeInsaforp ? formatCurrency(result.insaforpPatronal) : "$0.00"}
                    </span>
                  </div>
                </div>

              </div>

              {/* Resumen Héroe (Lado Derecho) */}
              <div className="lg:col-span-4 bg-indigo-500/[0.03] dark:bg-indigo-500/[0.01] border border-indigo-500/20 rounded-2xl p-6 flex flex-col justify-center items-center text-center">
                <span className="text-xs font-bold text-indigo-500 uppercase tracking-wider mb-2">
                  Costo Total Empresa
                </span>
                <span className="text-3xl font-black text-indigo-500 tabular-nums tracking-tight font-mono mb-2">
                  {formatCurrency(costoTotalPatronal)}
                </span>
                <p className="text-xs text-muted-foreground max-w-[200px] leading-relaxed">
                  Para pagarte un bruto de {formatCurrency(result.salarioBruto)}, la empresa asume un adicional del{" "}
                  <span className="font-bold text-foreground">+{markupPct}%</span> en cargas patronales obligatorias.
                </p>
              </div>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}
export default DeductionsBreakdownCard;
