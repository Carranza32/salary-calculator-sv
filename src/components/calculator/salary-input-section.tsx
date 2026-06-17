"use client";

import { useEffect, useState } from "react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { AFP_ENTIDADES } from "@/lib/salary/constants";
import type { TenureKey } from "@/lib/salary/types";
import {
  formatSalaryInputDisplay,
  parseSalaryInput,
  sanitizeSalaryInput,
} from "@/lib/format";
import { useSalaryStore } from "@/stores/salary-store";
import { RotateCcw, Building, FileText, Sparkles, Info } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

const TENURE_OPTIONS: { value: TenureKey; label: string }[] = [
  { value: "menos_1", label: "< 1 año" },
  { value: "1_3", label: "1–3 años" },
  { value: "3_10", label: "3–10 años" },
  { value: "mas_10", label: "+10 años" },
];

const AFP_LABELS: Record<string, string> = {
  Crecer: "Crecer",
  Confia: "Confia",
};

// ── Shared styles ──────────────────────────────────────────────────────────────
const SECTION_LABEL =
  "text-[10px] font-semibold uppercase tracking-[0.13em] text-muted-foreground/70 select-none";

export function SalaryInputSection() {
  const {
    salary,
    hydrated,
    afpEntity,
    tenure,
    setSalary,
    setAfpEntity,
    setTenure,
    mode,
    contractType,
    setMode,
    setContractType,
    viewPerspective,
    setViewPerspective,
  } = useSalaryStore();

  const [displayValue, setDisplayValue] = useState("");

  useEffect(() => {
    if (!hydrated) return;
    const expected = salary === 0 ? "" : formatSalaryInputDisplay(String(salary));
    const timer = setTimeout(() => {
      setDisplayValue((current) => (current !== expected ? expected : current));
    }, 0);
    return () => clearTimeout(timer);
  }, [salary, hydrated]);

  const handleSalaryChange = (raw: string) => {
    const sanitized = sanitizeSalaryInput(raw);
    setDisplayValue(formatSalaryInputDisplay(sanitized));
    setSalary(parseSalaryInput(sanitized));
  };

  const handleClear = () => {
    setDisplayValue("");
    setSalary(0);
  };

  const isFreelance = contractType === "servicios";

  return (
    <section className="flex flex-col gap-5" aria-labelledby="salary-input-heading">

      {/* ── Header ──────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <h2
          id="salary-input-heading"
          className="text-base font-bold tracking-tight text-foreground"
        >
          Calcula tu Salario
        </h2>
        {mode === "neto_a_bruto" && (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-full">
            <Sparkles className="h-2.5 w-2.5" />
            Inverso
          </span>
        )}
      </div>

      {/* ── Mode toggle: Bruto / Neto ────────────────────────────────────── */}
      <div
        className="flex w-full p-1 rounded-2xl"
        style={{
          background: "var(--muted)",
          border: "1px solid var(--border)",
        }}
      >
        {(["bruto_a_neto", "neto_a_bruto"] as const).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => setMode(m)}
            className="flex-1 py-2.5 text-xs font-semibold rounded-xl transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-primary/50 cursor-pointer"
            style={
              mode === m
                ? {
                    background: "var(--primary)",
                    color: "var(--primary-foreground)",
                    boxShadow: "0 2px 8px rgba(18,122,87,0.30)",
                  }
                : { color: "var(--muted-foreground)" }
            }
          >
            {m === "bruto_a_neto" ? "Ingresar Bruto" : "Ingresar Neto"}
          </button>
        ))}
      </div>

      {/* ── Salary input ────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-2">
        <span className={SECTION_LABEL}>
          {mode === "bruto_a_neto" ? "Salario bruto mensual" : "Salario neto deseado"}
        </span>

        <div className="relative flex items-center">
          {/* Dollar prefix */}
          <span
            className="pointer-events-none absolute left-4 text-xl font-bold select-none"
            style={{ color: "var(--muted-foreground)" }}
          >
            $
          </span>

          <Input
            id="salary"
            type="text"
            inputMode="decimal"
            autoComplete="off"
            placeholder="0.00"
            value={displayValue}
            onChange={(e) => handleSalaryChange(e.target.value)}
            className="h-[60px] pl-9 pr-12 text-[1.75rem] font-extrabold tracking-tight tabular-nums rounded-2xl border-transparent bg-muted/40 focus:bg-background focus:border-primary/60 transition-all duration-200 placeholder:text-muted-foreground/30"
          />

          {displayValue && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-2 h-8 w-8 text-muted-foreground hover:text-foreground cursor-pointer"
              onClick={handleClear}
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Slider */}
        <div className="pt-1 pb-0.5">
          <Slider
            min={200}
            max={8000}
            step={50}
            value={[salary || 200]}
            onValueChange={([val]) => setSalary(val)}
            aria-label="Ajustar salario mensual"
          />
          <div className="flex justify-between text-[9px] font-medium text-muted-foreground/50 mt-1.5 px-0.5 select-none">
            <span>$200</span>
            <span>$4,000</span>
            <span>$8,000</span>
          </div>
        </div>
      </div>

      {/* ── Divider ─────────────────────────────────────────────────────── */}
      <div style={{ height: "1px", background: "var(--border)" }} />

      {/* ── Contract type ───────────────────────────────────────────────── */}
      <div className="flex flex-col gap-3">
        <span className={SECTION_LABEL}>Tipo de Contratación</span>

        <div className="grid grid-cols-2 gap-2">
          {(
            [
              { key: "planilla", label: "Asalariado", sub: "Planilla", Icon: Building },
              { key: "servicios", label: "Freelance", sub: "Prof. Independiente", Icon: FileText },
            ] as const
          ).map(({ key, label, sub, Icon }) => (
            <button
              key={key}
              type="button"
              onClick={() => setContractType(key)}
              className="flex flex-col items-center justify-center gap-2 py-4 px-3 rounded-2xl border transition-all duration-200 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-primary"
              style={
                contractType === key
                  ? {
                      borderColor: "var(--primary)",
                      background: "color-mix(in oklch, var(--primary) 8%, transparent)",
                      color: "var(--primary)",
                    }
                  : {
                      borderColor: "var(--border)",
                      background: "transparent",
                      color: "var(--muted-foreground)",
                    }
              }
            >
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center transition-all"
                style={
                  contractType === key
                    ? { background: "color-mix(in oklch, var(--primary) 14%, transparent)" }
                    : { background: "var(--muted)" }
                }
              >
                <Icon className="h-4 w-4" />
              </div>
              <div className="text-center">
                <p className="text-xs font-bold leading-tight">{label}</p>
                <p className="text-[9px] font-medium opacity-60 leading-tight mt-0.5">{sub}</p>
              </div>
            </button>
          ))}
        </div>

        {/* Helper text */}
        <div
          className="flex gap-2 items-start rounded-xl px-3 py-2.5"
          style={{ background: "var(--muted)", border: "1px solid var(--border)" }}
        >
          <Info className="h-3 w-3 mt-0.5 flex-shrink-0 text-muted-foreground/60" />
          <p className="text-[10px] text-muted-foreground/80 leading-relaxed">
            {contractType === "planilla"
              ? "AFP 7.25% · ISSS 3% (tope $30) · ISR progresivo según tabla 2026."
              : "Retención fija del 10% de Renta. Sin ISSS, AFP ni prestaciones de ley."}
          </p>
        </div>

        {/* Employer perspective toggle */}
        {contractType === "planilla" && (
          <div
            className="flex items-center justify-between gap-3 rounded-xl px-3 py-3 animate-in fade-in duration-300"
            style={{ background: "var(--muted)", border: "1px solid var(--border)" }}
          >
            <div>
              <p className="text-xs font-semibold text-foreground leading-tight">
                Ver costo total empresa
              </p>
              <p className="text-[9px] text-muted-foreground mt-0.5 leading-tight">
                Incluye ISSS y AFP patronal
              </p>
            </div>
            <Checkbox
              id="employer-perspective"
              checked={viewPerspective === "empleador"}
              onCheckedChange={(checked) =>
                setViewPerspective(checked ? "empleador" : "empleado")
              }
            />
          </div>
        )}
      </div>

      {/* ── Divider ─────────────────────────────────────────────────────── */}
      {!isFreelance && (
        <div style={{ height: "1px", background: "var(--border)" }} />
      )}

      {/* ── Secondary params (Planilla only) ────────────────────────────── */}
      {!isFreelance ? (
        <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-top-2 duration-300">

          {/* AFP */}
          <div className="flex flex-col gap-2">
            <span className={SECTION_LABEL}>Tu AFP</span>
            <ToggleGroup
              type="single"
              value={afpEntity}
              onValueChange={(v) => v && setAfpEntity(v)}
              className="flex gap-2"
            >
              {AFP_ENTIDADES.map((entity) => (
                <ToggleGroupItem
                  key={entity}
                  value={entity}
                  className="flex-1 h-10 rounded-xl text-sm font-semibold border border-border bg-muted/30 data-[state=on]:bg-primary/10 data-[state=on]:text-primary data-[state=on]:border-primary/30 transition-all duration-200 cursor-pointer"
                >
                  {AFP_LABELS[entity] ?? entity}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </div>

          {/* Tenure */}
          <div className="flex flex-col gap-2">
            <span className={SECTION_LABEL}>Antigüedad laboral</span>
            <ToggleGroup
              type="single"
              value={tenure}
              onValueChange={(v) => v && setTenure(v as TenureKey)}
              className="grid grid-cols-4 gap-1.5"
            >
              {TENURE_OPTIONS.map((opt) => (
                <ToggleGroupItem
                  key={opt.value}
                  value={opt.value}
                  className="h-10 rounded-xl border border-border bg-muted/30 text-[11px] font-semibold data-[state=on]:bg-primary/10 data-[state=on]:text-primary data-[state=on]:border-primary/30 transition-all duration-200 cursor-pointer"
                >
                  {opt.label}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </div>
        </div>
      ) : (
        /* Freelance notice */
        <div
          className="flex gap-2.5 items-start rounded-2xl p-4 animate-in fade-in duration-300"
          style={{
            background: "color-mix(in oklch, oklch(0.75 0.15 75) 10%, transparent)",
            border: "1px solid color-mix(in oklch, oklch(0.75 0.15 75) 25%, transparent)",
          }}
        >
          <Info className="h-3.5 w-3.5 mt-0.5 flex-shrink-0 text-amber-600 dark:text-amber-400" />
          <div>
            <p className="text-xs font-bold text-amber-700 dark:text-amber-300 mb-0.5">
              Servicios Profesionales
            </p>
            <p className="text-[10px] text-amber-600/80 dark:text-amber-400/80 leading-relaxed">
              Sin ISSS, AFP, aguinaldo ni vacaciones. La empresa retiene el 10% de ISR al pago.
            </p>
          </div>
        </div>
      )}
    </section>
  );
}
