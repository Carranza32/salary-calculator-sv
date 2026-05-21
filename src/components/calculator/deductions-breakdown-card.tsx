"use client";

import { Separator } from "@/components/ui/separator";
import { CollapsibleSection } from "./collapsible-section";
import { formatCurrency } from "@/lib/format";
import { useSalaryStore } from "@/stores/salary-store";
import { Landmark, HeartPulse, Receipt } from "lucide-react";

function PatronalContent() {
  const result = useSalaryStore((s) => s.result);
  if (!result) return null;

  const costoTotal = result.salarioBruto + result.deduccionesTotalesPatronales;

  return (
    <div className="space-y-3 pt-2 text-sm">
      <div className="flex justify-between gap-4">
        <span className="text-muted-foreground">AFP patronal (8.75%)</span>
        <span className="font-medium tabular-nums">
          {formatCurrency(result.afpPatronal)}
        </span>
      </div>
      <div className="flex justify-between gap-4">
        <div>
          <span className="text-muted-foreground">ISSS patronal (7.5%)</span>
          <p className="text-[10px] text-muted-foreground/70">
            Tope máximo $75
          </p>
        </div>
        <span className="font-medium tabular-nums">
          {formatCurrency(result.isssPatronal)}
        </span>
      </div>
      <Separator className="bg-border/60" />
      <div className="flex justify-between rounded-xl bg-muted/40 px-4 py-3 mt-2">
        <span className="font-semibold text-foreground">
          Costo total empresa
        </span>
        <span className="font-bold tabular-nums text-foreground">
          {formatCurrency(costoTotal)}
        </span>
      </div>
    </div>
  );
}

function BenefitsContent() {
  const benefits = useSalaryStore((s) => s.benefits);
  if (!benefits) return null;

  return (
    <div className="space-y-3 pt-2 text-sm">
      <div className="flex justify-between gap-4">
        <span className="text-muted-foreground">Aguinaldo</span>
        <span className="font-medium tabular-nums">
          {formatCurrency(benefits.aguinaldo)}
        </span>
      </div>
      <div className="flex justify-between gap-4">
        <span className="text-muted-foreground">Vacaciones + prima</span>
        <span className="font-medium tabular-nums">
          {formatCurrency(benefits.vacaciones)}
        </span>
      </div>
      <div className="flex justify-between gap-4">
        <span className="text-muted-foreground">Indemnización (estimada)</span>
        <span className="font-medium tabular-nums">
          {formatCurrency(benefits.indemnizacion)}
        </span>
      </div>
      <Separator className="bg-border/60" />
      <div className="flex justify-between rounded-xl bg-muted/40 px-4 py-3 mt-2">
        <span className="font-semibold text-foreground">Total anual extra</span>
        <span className="font-bold tabular-nums text-foreground">
          {formatCurrency(benefits.total)}
        </span>
      </div>
    </div>
  );
}

export function DeductionsBreakdownCard() {
  const result = useSalaryStore((s) => s.result);
  if (!result || result.salarioBruto <= 0) return null;

  return (
    <div className="space-y-4">
      {/* Tarjeta Principal de Descuentos */}
      <div className="rounded-3xl border border-border/50 bg-card p-6 shadow-sm overflow-hidden">
        {/* Cabecera y Total */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8">
          <div>
            <h3 className="text-xl font-bold tracking-tight">
              Descuentos de Ley
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              Desglose exacto de las retenciones de tu salario.
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded-2xl bg-muted/20 p-5 border border-border/40 flex flex-col">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 bg-background rounded-lg shadow-sm border border-border/50">
                <Landmark className="h-4 w-4 text-muted-foreground" />
              </div>
              <span className="font-semibold text-sm">AFP (7.25%)</span>
            </div>
            <span className="text-2xl font-bold tabular-nums tracking-tight mb-1">
              {formatCurrency(result.afpTrabajador)}
            </span>
            <span className="text-xs text-muted-foreground">
              Tu fondo de pensión
            </span>
          </div>

          <div className="rounded-2xl bg-muted/20 p-5 border border-border/40 flex flex-col">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 bg-background rounded-lg shadow-sm border border-border/50">
                <HeartPulse className="h-4 w-4 text-muted-foreground" />
              </div>
              <span className="font-semibold text-sm">ISSS (3%)</span>
            </div>
            <span className="text-2xl font-bold tabular-nums tracking-tight mb-1">
              {formatCurrency(result.isssTrabajador)}
            </span>
            <span className="text-xs text-muted-foreground">
              Seguro de salud
            </span>
          </div>

          <div className="rounded-2xl bg-muted/20 p-5 border border-border/40 flex flex-col">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 bg-background rounded-lg shadow-sm border border-border/50">
                <Receipt className="h-4 w-4 text-muted-foreground" />
              </div>
              <span className="font-semibold text-sm">Renta (ISR)</span>
            </div>
            <span className="text-2xl font-bold tabular-nums tracking-tight mb-1">
              {formatCurrency(result.renta)}
            </span>
            <span className="text-xs text-muted-foreground">
              Impuesto al gobierno
            </span>
          </div>
        </div>
      </div>

      {/* Secciones Adicionales (Lado a lado en pantallas grandes) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-2xl ">
          <CollapsibleSection title="¿Cuánto le cuestas a tu empresa?">
            <PatronalContent />
          </CollapsibleSection>
        </div>

        <div className="rounded-2xl ">
          <CollapsibleSection title="Aguinaldo y vacaciones extras">
            <BenefitsContent />
          </CollapsibleSection>
        </div>
      </div>
    </div>
  );
}
