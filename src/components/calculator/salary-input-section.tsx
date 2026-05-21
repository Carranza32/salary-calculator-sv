"use client";

import { useEffect, useRef, useState } from "react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { AFP_ENTIDADES } from "@/lib/salary/constants";
import type { TenureKey } from "@/lib/salary/types";
import {
  formatSalaryInputDisplay,
  parseSalaryInput,
  sanitizeSalaryInput,
} from "@/lib/format";
import { useSalaryStore } from "@/stores/salary-store";
import { RotateCcw } from "lucide-react";

const TENURE_OPTIONS: { value: TenureKey; label: string }[] = [
  { value: "menos_1", label: "Menos de 1 año" },
  { value: "1_3", label: "1-3 años" },
  { value: "3_10", label: "3-10 años" },
  { value: "mas_10", label: "Más de 10 años" },
];

const AFP_LABELS: Record<string, string> = {
  Crecer: "Crecer",
  Confia: "Confia",
};

export function SalaryInputSection() {
  const {
    salary,
    hydrated,
    afpEntity,
    tenure,
    setSalary,
    setAfpEntity,
    setTenure,
  } = useSalaryStore();
  const [displayValue, setDisplayValue] = useState("");
  const syncedFromStore = useRef(false);

  useEffect(() => {
    if (hydrated && !syncedFromStore.current) {
      syncedFromStore.current = true;
      if (salary > 0) setDisplayValue(formatSalaryInputDisplay(String(salary)));
    }
  }, [hydrated, salary]);

  const handleSalaryChange = (raw: string) => {
    const sanitized = sanitizeSalaryInput(raw);
    setDisplayValue(formatSalaryInputDisplay(sanitized));
    setSalary(parseSalaryInput(sanitized));
  };

  const handleClear = () => {
    setDisplayValue("");
    setSalary(0);
  };

  return (
    <section className="space-y-8" aria-labelledby="salary-input-heading">
      <h2
        id="salary-input-heading"
        className="text-xl font-semibold tracking-tight"
      >
        Calcula tu Salario
      </h2>

      <div className="space-y-3">
        <Label
          htmlFor="salary"
          className="text-sm font-medium text-muted-foreground"
        >
          Salario mensual bruto
        </Label>
        <div className="relative flex items-center">
          <span className="absolute left-4 text-2xl font-semibold text-muted-foreground">
            $
          </span>
          <Input
            id="salary"
            type="text"
            inputMode="decimal"
            autoComplete="off"
            className="h-16 pl-10 text-3xl font-bold rounded-2xl bg-muted/50 border-transparent focus:bg-background focus:border-primary transition-all"
            placeholder="0.00"
            value={displayValue}
            onChange={(e) => handleSalaryChange(e.target.value)}
          />
          {displayValue && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-2 text-muted-foreground hover:text-foreground"
              onClick={handleClear}
            >
              <RotateCcw className="h-5 w-5" />
            </Button>
          )}
        </div>
      </div>

      <div className="space-y-3">
        <Label className="text-sm font-medium text-muted-foreground">
          Tu AFP
        </Label>
        <ToggleGroup
          type="single"
          value={afpEntity}
          onValueChange={(v) => v && setAfpEntity(v)}
          className="bg-muted/30 p-1 rounded-2xl w-full flex"
        >
          {AFP_ENTIDADES.map((entity) => (
            <ToggleGroupItem
              key={entity}
              value={entity}
              className="flex-1 h-12 rounded-xl data-[state=on]:bg-primary/10 data-[state=on]:text-primary data-[state=on]:border-primary/20 data-[state=on]:shadow-sm transition-all"
            >
              {AFP_LABELS[entity] ?? entity}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </div>

      <div className="space-y-3">
        <Label className="text-sm font-medium text-muted-foreground">
          Antigüedad
        </Label>
        <ToggleGroup
          type="single"
          value={tenure}
          onValueChange={(v) => v && setTenure(v as TenureKey)}
          className="grid grid-cols-2 gap-2"
        >
          {TENURE_OPTIONS.map((opt) => (
            <ToggleGroupItem
              key={opt.value}
              value={opt.value}
              className="h-12 rounded-xl border border-transparent bg-muted/30 data-[state=on]:bg-primary/10 data-[state=on]:text-primary data-[state=on]:border-primary/20 transition-all text-xs sm:text-sm"
            >
              {opt.label}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </div>
    </section>
  );
}
